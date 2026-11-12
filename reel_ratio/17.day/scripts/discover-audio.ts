/**
 * Build-time audio/subtitle discovery.
 *   npm run discover            -> writes src/generated/manifest.json (warns if audio is missing)
 *   npm run discover:strict     -> same, but exits 1 when an episode has no audio (used before render)
 *   tsx scripts/discover-audio.ts --watch   -> re-runs whenever public/audio or public/subtitles change
 *
 * The browser never touches the filesystem: Remotion reads the generated JSON manifest.
 */
import { existsSync, mkdirSync, readFileSync, watch, writeFileSync } from "node:fs";
import path from "node:path";
import { episodes } from "../src/episodes/registry";
import { buildTimeline } from "../src/timing/buildTimeline";
import { parseSrt } from "../src/timing/srt";
import type { AudioInfo, EpisodeManifestEntry, Manifest } from "../src/timing/types";
import { analyzeSpeech } from "./lib/audio-analysis";

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const MANIFEST = path.join(ROOT, "src/generated/manifest.json");
const FPS = 30;

const args = new Set(process.argv.slice(2));
const STRICT = args.has("--strict");
const WATCH = args.has("--watch");

const log = (m: string) => console.log(m);

const discoverOnce = async (): Promise<{ ok: boolean }> => {
  // music-metadata is ESM-only; load dynamically and type the small surface we use.
  const { parseFile } = (await import("music-metadata")) as unknown as {
    parseFile: (
      file: string,
      opts?: { duration?: boolean },
    ) => Promise<{
      format: { duration?: number; sampleRate?: number; numberOfChannels?: number; codec?: string; container?: string; bitrate?: number };
    }>;
  };
  const manifest: Manifest = { generatedAt: new Date().toISOString(), episodes: {} };
  let ok = true;

  for (const ep of episodes) {
    const searched: string[] = [];
    const found: string[] = [];
    for (const ext of ep.audioExtensions) {
      const rel = `${ep.audioDir}/${ep.episodeId}.${ext}`;
      searched.push(`public/${rel}`);
      if (existsSync(path.join(PUBLIC, rel))) found.push(rel);
    }
    const entry: EpisodeManifestEntry = { episodeId: ep.episodeId, audio: null, subtitles: null, analysis: null, searched };

    log(`\n=== ${ep.episodeId} ===`);
    if (found.length === 0) {
      ok = false;
      log(`  AUDIO: NOT FOUND. Looked for:\n    - ${searched.join("\n    - ")}`);
      log(`  -> Put the original narration at public/${ep.audioDir}/${ep.episodeId}.mp3 (or .wav).`);
      log(`  -> Studio/preview runs in DRAFT mode with ESTIMATED timing. Rendering is blocked until audio exists.`);
    } else {
      const rel = found[0];
      const abs = path.join(PUBLIC, rel);
      if (found.length > 1) log(`  WARNING: several audio files found (${found.join(", ")}). Using ${rel}.`);
      const warnings: string[] = [];
      try {
        const meta = await parseFile(abs, { duration: true });
        const durationSec = meta.format.duration;
        if (!durationSec || !Number.isFinite(durationSec) || durationSec <= 0) {
          throw new Error("could not read a valid duration from the file");
        }
        if (durationSec < 10) warnings.push(`Audio is only ${durationSec.toFixed(1)}s long - a full lesson is expected to be minutes long.`);
        const sampleRate = meta.format.sampleRate ?? null;
        if (sampleRate !== null && sampleRate < 22050) warnings.push(`Low sample rate (${sampleRate} Hz).`);
        if (sampleRate === null) warnings.push("Sample rate could not be read from the metadata.");
        const info: AudioInfo = {
          publicPath: rel,
          durationSec: +durationSec.toFixed(3),
          sampleRate,
          channels: meta.format.numberOfChannels ?? null,
          codec: meta.format.codec ?? meta.format.container ?? null,
          bitrateKbps: meta.format.bitrate ? Math.round(meta.format.bitrate / 1000) : null,
          warnings,
        };
        entry.audio = info;
        log(`  AUDIO: ${rel}`);
        log(`    duration ${info.durationSec}s | ${sampleRate ?? "?"} Hz | ${info.channels ?? "?"} ch | ${info.codec ?? "?"} | ${info.bitrateKbps ?? "?"} kbps`);
        warnings.forEach((w) => log(`    WARNING: ${w}`));
      } catch (e) {
        ok = false;
        log(`  AUDIO: ERROR reading ${rel}: ${(e as Error).message}`);
        entry.audio = null;
      }

      if (entry.audio) {
        try {
          entry.analysis = analyzeSpeech(abs);
          log(`    speech analysis: ${entry.analysis.speechStartSec}s -> ${entry.analysis.speechEndSec}s, ${entry.analysis.gaps.length} pauses (approximate cues)`);
        } catch (e) {
          log(`    speech analysis skipped: ${(e as Error).message}`);
        }
      }
    }

    // Subtitles
    const srtRel = `${ep.subtitleDir}/${ep.episodeId}.srt`;
    if (existsSync(path.join(PUBLIC, srtRel))) {
      try {
        const cues = parseSrt(readFileSync(path.join(PUBLIC, srtRel), "utf8"));
        if (cues.length === 0) throw new Error("no cues found");
        entry.subtitles = { publicPath: srtRel, cues };
        log(`  SRT: ${srtRel} (${cues.length} cues) - authoritative timing source`);
      } catch (e) {
        ok = false;
        log(`  SRT: ERROR parsing ${srtRel}: ${(e as Error).message}`);
      }
    } else {
      log(`  SRT: none (public/${srtRel}) -> ${entry.analysis ? "timing from speech analysis (approximate)" : "timing estimated"}`);
    }

    // Report resulting timeline
    const tl = buildTimeline(ep, entry, FPS);
    log(`  TIMELINE: ${tl.durationSec.toFixed(2)}s = ${tl.durationInFrames} frames @ ${FPS}fps | source: ${tl.source}${tl.verified ? " (verified)" : " (NOT verified)"}`);
    tl.warnings.forEach((w) => log(`    NOTE: ${w}`));
    if (entry.audio) {
      const est = tl.beats.reduce((a, b) => a + (b.endSec - b.startSec), 0);
      if (Math.abs(est - tl.durationSec) > 1) ok = false;
    }
    manifest.episodes[ep.episodeId] = entry;
  }

  mkdirSync(path.dirname(MANIFEST), { recursive: true });
  const next = JSON.stringify(manifest, null, 2);
  // Keep the file stable (no needless HMR) when nothing but the timestamp changed.
  let prev = "";
  try {
    prev = readFileSync(MANIFEST, "utf8");
  } catch {
    /* first run */
  }
  const strip = (s: string) => s.replace(/"generatedAt": "[^"]*"/, "");
  if (strip(prev) !== strip(next)) writeFileSync(MANIFEST, next);
  return { ok };
};

const missingAudio = (): string[] => {
  const m = JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest;
  return Object.values(m.episodes)
    .filter((e) => !e.audio)
    .map((e) => e.episodeId);
};

const main = async () => {
  await discoverOnce();
  if (STRICT) {
    const missing = missingAudio();
    if (missing.length) {
      console.error(
        `\nERROR: narration audio is missing or unreadable for: ${missing.join(", ")}.\n` +
          `Refusing to continue (a silent video must never be produced). Add public/audio/<episode-id>.mp3 and retry.`,
      );
      process.exit(1);
    }
  }
  if (WATCH) {
    log("\nWatching public/audio and public/subtitles for changes (Ctrl+C to stop)...");
    let timer: NodeJS.Timeout | undefined;
    for (const dir of ["audio", "subtitles"]) {
      const abs = path.join(PUBLIC, dir);
      mkdirSync(abs, { recursive: true });
      watch(abs, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          discoverOnce().catch((e) => console.error(e));
        }, 600);
      });
    }
  }
};


main().catch((e) => {
  console.error(e);
  process.exit(1);
});

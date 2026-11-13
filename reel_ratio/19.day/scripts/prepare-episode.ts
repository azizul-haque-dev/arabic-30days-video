/**
 * Build-time episode preparation (runs in Node, never in the browser).
 *   1. discovers public/audio/day-<N>.mp3|wav
 *   2. parses the episode SRT
 *   3. builds the timeline from REAL SRT timestamps
 *   4. writes src/generated/day-<N>.timeline.json for the Remotion composition
 *
 * Flags:  --episode 19   --lenient (dev: missing audio / count mismatch become warnings)
 *         --srt <path>   (dev/demo only, rejected in strict builds)
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { VIDEO } from "../src/config";
import type { EpisodeContent, EpisodeTimeline } from "../src/types";
import { discoverAudio } from "./lib/audio";
import { parseSrt } from "./lib/srt";
import { buildTimeline } from "./lib/timeline";

const ROOT = path.resolve(__dirname, "..");

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const flag = (name: string) => process.argv.includes(`--${name}`);

function fail(lines: string[]): never {
  console.error("\n\x1b[31m✖ Episode preparation failed\x1b[0m\n");
  for (const l of lines) console.error("  " + l.split("\n").join("\n  "));
  console.error("");
  process.exit(1);
}

async function main() {
  const episode = Number(arg("episode") ?? 19);
  if (!Number.isInteger(episode)) fail(["--episode must be an integer."]);
  const lenient = flag("lenient");
  const srtOverride = arg("srt");
  if (srtOverride && !lenient) fail(["--srt is only allowed together with --lenient (dev/demo). Final builds must use the episode's real SRT."]);

  const contentPath = path.join(ROOT, "src", "episodes", `day-${episode}`, "content");
  const content: EpisodeContent = (await import(pathToFileURL(contentPath).href)).content;

  /* ---- SRT ---- */
  const srtCandidates = srtOverride
    ? [path.resolve(ROOT, srtOverride)]
    : [
        path.join(ROOT, "src", "episodes", `day-${episode}`, `day-${episode}.srt`),
        path.join(ROOT, "public", "srt", `day-${episode}.srt`),
        path.join(ROOT, `day${episode}.srt`),
      ];
  const srtFile = srtCandidates.find((p) => fs.existsSync(p));
  if (!srtFile) {
    fail([
      `SRT file not found for Day ${episode}. Expected one of:`,
      ...srtCandidates.map((p) => `  • ${path.relative(ROOT, p)}`),
      "",
      "The timeline is generated ONLY from the real SRT (no timestamps are invented).",
    ]);
  }
  const { entries, warnings: srtWarnings } = parseSrt(fs.readFileSync(srtFile, "utf8"));

  /* ---- audio ---- */
  const audioInfo = await discoverAudio(ROOT, episode);
  const warnings = [...srtWarnings, ...audioInfo.warnings];
  if (!audioInfo.audio) {
    const msg = `Audio not found. Place the narration at one of:\n${audioInfo.expectedPaths.map((p) => `  • ${p}`).join("\n")}`;
    if (lenient) warnings.push(msg + "\n(dev preview will be silent; production build requires it)");
    else fail([msg]);
  }

  /* ---- timeline ---- */
  const built = buildTimeline(entries, content, { lenient, fps: VIDEO.fps });
  if (built.errors.length > 0) fail(built.errors);
  warnings.push(...built.warnings);

  const audioDur = audioInfo.audio?.durationInSeconds;
  if (audioDur && Math.abs(audioDur - built.durationSec) > 2) {
    warnings.push(`Audio is ${audioDur.toFixed(2)}s but the SRT ends at ${built.durationSec.toFixed(2)}s. Check that the audio matches this SRT.`);
  }

  const timeline: EpisodeTimeline = {
    episode,
    fps: VIDEO.fps,
    width: VIDEO.width,
    height: VIDEO.height,
    durationInSeconds: built.durationSec,
    durationInFrames: Math.ceil(built.durationSec * VIDEO.fps),
    srt: { file: path.relative(ROOT, srtFile), entryCount: entries.length, isSample: Boolean(srtOverride) },
    audio: audioInfo.audio,
    scenes: built.scenes,
    warnings,
  };

  const outDir = path.join(ROOT, "src", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `day-${episode}.timeline.json`);
  fs.writeFileSync(outFile, JSON.stringify(timeline, null, 2) + "\n");

  console.log(`\n\x1b[32m✔ Day ${episode} prepared\x1b[0m  (${path.relative(ROOT, outFile)})`);
  console.log(`  SRT      : ${timeline.srt.file}  (${entries.length} entries)${timeline.srt.isSample ? "  \x1b[33m[SAMPLE TIMING - NOT FINAL]\x1b[0m" : ""}`);
  console.log(`  Audio    : ${timeline.audio ? `${timeline.audio.file} (${timeline.audio.durationInSeconds?.toFixed(2) ?? "?"}s)` : "\x1b[33mnone (silent preview)\x1b[0m"}`);
  console.log(`  Duration : ${timeline.durationInSeconds.toFixed(3)}s = ${timeline.durationInFrames} frames @ ${VIDEO.fps}fps`);
  console.log(`  Scenes   : ${timeline.scenes.length}`);
  for (const i of built.info) console.log(`  \x1b[36mℹ\x1b[0m ${i}`);
  for (const w of warnings) console.log(`  \x1b[33m⚠\x1b[0m ${w.split("\n").join("\n    ")}`);
  console.log("");
}

main().catch((e) => fail([String(e instanceof Error ? e.message : e)]));

/**
 * Build-time audio discovery (Node only — the browser bundle never touches the filesystem).
 *   npm run discover-audio            → writes src/generated/audio-manifest.json (missing audio = warning)
 *   npm run discover-audio -- --require → exits 1 if audio is missing (use before rendering)
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseFile } from "music-metadata";
import { episodeConfig } from "../src/episodes/day-18/config";
import { LAST_CUE_END_MS } from "../src/episodes/day-18/cues";

const root = resolve(import.meta.dirname, "..");
const require_ = process.argv.includes("--require");
const manifestPath = join(root, "src/generated/audio-manifest.json");
const { dir, baseName, extensions } = episodeConfig.audio;

const write = (m: Record<string, unknown>) => {
  mkdirSync(join(root, "src/generated"), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(m, null, 2) + "\n");
};

const candidates = extensions.map((e) => `${dir}/${baseName}.${e}`).filter((rel) => existsSync(join(root, "public", rel)));

if (candidates.length === 0) {
  const msg =
    `Audio NOT found. Expected one of: ${extensions.map((e) => `public/${dir}/${baseName}.${e}`).join("  |  ")}.\n` +
    `Put the original Day 18 narration there and run \`npm run discover-audio\` again.`;
  write({ found: false, file: null, durationSeconds: null, message: msg.split("\n")[0] });
  if (require_) {
    console.error(`✖ ${msg}`);
    process.exit(1);
  }
  console.warn(`⚠ ${msg}\n  (Studio preview is allowed without audio; RENDERING without audio is blocked.)`);
  process.exit(0);
}

if (candidates.length > 1) console.warn(`⚠ Multiple audio files found (${candidates.join(", ")}). Using ${candidates[0]}.`);
const file = candidates[0];
const meta = await parseFile(join(root, "public", file));
const durationSeconds = meta.format.duration;
if (!durationSeconds || !Number.isFinite(durationSeconds)) {
  console.error(`✖ Could not read the duration of ${file}.`);
  process.exit(1);
}
const srtSeconds = LAST_CUE_END_MS / 1000;
const diff = durationSeconds - srtSeconds;
const warnings: string[] = [];
if (Math.abs(diff) > 0.25) warnings.push(`Audio (${durationSeconds.toFixed(3)}s) differs from last SRT cue end (${srtSeconds.toFixed(3)}s) by ${diff.toFixed(3)}s.`);
if (diff < -0.5) {
  console.error(`✖ ${warnings[0]} Audio is shorter than the subtitles — wrong file?`);
  process.exit(1);
}
write({
  found: true,
  file,
  durationSeconds: Number(durationSeconds.toFixed(3)),
  codec: meta.format.codec ?? null,
  sampleRate: meta.format.sampleRate ?? null,
  channels: meta.format.numberOfChannels ?? null,
  warnings,
});
console.log(`✔ Audio: ${file}  (${durationSeconds.toFixed(3)}s, ${meta.format.codec ?? "?"}, ${meta.format.sampleRate ?? "?"} Hz)`);
warnings.forEach((w) => console.warn(`⚠ ${w}`));

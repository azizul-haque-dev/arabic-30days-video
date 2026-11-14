/**
 * Build-time step (runs automatically before `npm run studio` / `npm run render`).
 *  - detects public/<audioFile> (default public/audio.wav) — optional
 *  - validates WAV header (sample rate, channels, duration)
 *  - parses the SRT (authoritative cue timing)
 *  - writes src/generated/meta.json consumed by the composition
 * The browser never touches the filesystem.
 */
import fs from "node:fs";
import path from "node:path";
import { episode } from "../src/episodes/active";
import { sentences } from "../src/episodes/active";
import type { GeneratedCue, GeneratedMeta } from "../src/types";

const root = path.resolve(__dirname, "..");
const pub = (p: string) => path.join(root, "public", p);
const warnings: string[] = [];

const fail = (msg: string): never => {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
};

// ---------- SRT ----------
const tsToSec = (s: string) => {
  const m = s.trim().match(/^(\d+):(\d{2}):(\d{2})[,.](\d{1,3})$/);
  if (!m) return fail(`Bad SRT timestamp: "${s}"`);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4].padEnd(3, "0") / 1000;
};

const srtPath = pub(episode.srtFile);
if (!fs.existsSync(srtPath)) {
  fail(
    `SRT not found: public/${episode.srtFile}\nThe SRT is the timing source for the scenes. Put it there (see src/episodes/day-17/config.ts).`,
  );
}
const srtRaw = fs.readFileSync(srtPath, "utf8").replace(/^\uFEFF/, "").replace(/\r/g, "");
const cues: Record<string, GeneratedCue> = {};
for (const block of srtRaw.split(/\n\s*\n/)) {
  const lines = block.split("\n").filter((l) => l.trim() !== "");
  if (lines.length < 3) continue;
  const idx = parseInt(lines[0], 10);
  const [a, b] = lines[1].split("-->");
  if (!Number.isFinite(idx) || !b) continue;
  cues[String(idx)] = { start: tsToSec(a), end: tsToSec(b), text: lines.slice(2).join(" ").trim() };
}
const cueCount = Object.keys(cues).length;
if (cueCount === 0) fail("SRT has no cues.");
const srtEndSec = Math.max(...Object.values(cues).map((c) => c.end));

// every cue number referenced by the config must exist and be ordered
const referenced: number[] = [
  ...episode.introBeats.flatMap((b) => b.cues),
  ...episode.outroBeats.flatMap((b) => b.cues),
  ...sentences.flatMap((s) => Object.values(s.cues)),
];
for (const n of referenced) if (!cues[String(n)]) fail(`Config references SRT cue #${n}, which does not exist.`);
for (const s of sentences) {
  const { intro, say1, say2, meaning } = s.cues;
  if (!(intro < say1 && say1 < say2 && say2 < meaning)) fail(`Sentence ${s.no}: cue order must be intro < say1 < say2 < meaning.`);
}

// ---------- WAV ----------
type AudioInfo = NonNullable<GeneratedMeta["audio"]>;
const readWav = (file: string): AudioInfo => {
  const buf = fs.readFileSync(file);
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    return fail(`${path.basename(file)} is not a valid WAV (RIFF/WAVE header missing).`);
  }
  let off = 12;
  let fmt: { channels: number; sampleRate: number; byteRate: number; bits: number } | null = null;
  let dataBytes = -1;
  while (off + 8 <= buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    let size = buf.readUInt32LE(off + 4);
    const body = off + 8;
    if (id === "fmt ") {
      fmt = {
        channels: buf.readUInt16LE(body + 2),
        sampleRate: buf.readUInt32LE(body + 4),
        byteRate: buf.readUInt32LE(body + 8),
        bits: buf.readUInt16LE(body + 14),
      };
    } else if (id === "data") {
      // streamed/ffmpeg-pipe WAVs may carry 0 / 0xFFFFFFFF here
      if (size === 0 || size === 0xffffffff || body + size > buf.length) size = buf.length - body;
      dataBytes = size;
      break;
    }
    off = body + size + (size % 2);
  }
  if (!fmt || dataBytes < 0) return fail(`${path.basename(file)}: could not find fmt/data chunks.`);
  if (fmt.byteRate <= 0) return fail(`${path.basename(file)}: invalid byte rate.`);
  const durationSec = dataBytes / fmt.byteRate;
  if (durationSec < 1) fail(`${path.basename(file)} is shorter than 1s (${durationSec.toFixed(2)}s) — looks empty.`);
  if (fmt.sampleRate < 22050) warnings.push(`Audio sample rate is low (${fmt.sampleRate} Hz).`);
  return { file: episode.audioFile, durationSec, sampleRate: fmt.sampleRate, channels: fmt.channels, bitDepth: fmt.bits };
};

let audio: GeneratedMeta["audio"] = null;
const audioPath = pub(episode.audioFile);
if (fs.existsSync(audioPath)) {
  audio = readWav(audioPath);
} else {
  const stem = path.parse(episode.audioFile).name;
  const other = fs.readdirSync(pub("")).filter((f) => f.startsWith(stem + ".") && f !== episode.audioFile);
  if (other.length) {
    warnings.push(`Found public/${other[0]} but only public/${episode.audioFile} is used. Convert it to WAV and name it ${episode.audioFile}.`);
  }
}

// ---------- duration ----------
let durationSec: number;
if (audio) {
  durationSec = audio.durationSec;
  const lastStart = Math.max(...referenced.map((n) => cues[String(n)].start));
  if (durationSec < lastStart + 0.2) fail(`Audio (${durationSec.toFixed(2)}s) ends before the last SRT cue starts (${lastStart.toFixed(2)}s). Audio and SRT do not belong together.`);
  if (Math.abs(durationSec - srtEndSec) > 3) {
    warnings.push(
      `Audio is ${durationSec.toFixed(2)}s but the SRT ends at ${srtEndSec.toFixed(2)}s. Cue times are used as-is — check/re-sync the SRT if scenes look off.`,
    );
  }
} else {
  durationSec = srtEndSec + episode.silentTailSec;
}

const durationInFrames = Math.ceil(durationSec * episode.fps);
const meta: GeneratedMeta = {
  episodeId: episode.id,
  fps: episode.fps,
  durationSec: +durationSec.toFixed(3),
  durationInFrames,
  audio,
  timingSource: "srt",
  subCueTimingEstimated: true,
  srtEndSec: +srtEndSec.toFixed(3),
  cues,
  warnings,
};

const outDir = path.join(root, "src", "generated");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");

console.log(`✔ ${episode.id}: ${cueCount} SRT cues, SRT ends ${srtEndSec.toFixed(2)}s`);
if (audio) {
  console.log(`✔ audio: public/${audio.file} — ${audio.durationSec.toFixed(2)}s, ${audio.sampleRate} Hz, ${audio.channels}ch, ${audio.bitDepth}-bit`);
} else {
  console.log(`ℹ no public/${episode.audioFile} yet — composition will be SILENT (${durationSec.toFixed(2)}s). Save the narration there and re-run.`);
}
console.log(`✔ composition: ${durationInFrames} frames @ ${episode.fps}fps`);
for (const w of warnings) console.warn(`⚠ ${w}`);

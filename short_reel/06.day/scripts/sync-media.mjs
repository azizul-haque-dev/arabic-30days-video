// Reads public/*.srt and (optionally) public/audio.wav and writes
// src/data/generated/cues.json + media.json. Runs automatically before studio/render.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const outDir = path.join(root, "src", "data", "generated");
fs.mkdirSync(outDir, {recursive: true});

// ---- SRT -> cues.json -------------------------------------------------
const srtFile = fs.readdirSync(publicDir).filter((f) => f.toLowerCase().endsWith(".srt")).sort()[0];
if (!srtFile) {
  console.error("No .srt file found in public/. Put your SRT there.");
  process.exit(1);
}
const toSec = (t) => {
  const m = t.trim().match(/^(\d+):(\d+):(\d+)[,.](\d+)$/);
  if (!m) throw new Error(`Bad SRT timestamp: ${t}`);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, "0")) / 1000;
};
const raw = fs.readFileSync(path.join(publicDir, srtFile), "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
const cues = raw
  .split(/\n\s*\n/)
  .map((block) => block.split("\n").filter((l, i, a) => !(l.trim() === "" && i === a.length - 1)))
  .filter((lines) => lines.length >= 3 || (lines.length === 2 && lines[1].includes("-->")))
  .map((lines) => {
    const [startRaw, endRaw] = lines[1].split("-->");
    return {
      index: Number(lines[0].trim()),
      start: toSec(startRaw),
      end: toSec(endRaw),
      text: lines.slice(2).join(" ").trim(),
    };
  });
fs.writeFileSync(path.join(outDir, "cues.json"), JSON.stringify(cues, null, 2));
console.log(`[sync] ${cues.length} cues from public/${srtFile}`);

// ---- audio.wav -> media.json -----------------------------------------
const audioPath = path.join(publicDir, "audio.wav");
let media = {hasAudio: false, durationInSeconds: 0};
if (fs.existsSync(audioPath)) {
  const buf = fs.readFileSync(audioPath);
  let byteRate = 0;
  let dataSize = 0;
  let pos = 12;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    let size = buf.readUInt32LE(pos + 4);
    if (id === "fmt ") byteRate = buf.readUInt32LE(pos + 16);
    if (id === "data") {
      if (size === 0xffffffff || pos + 8 + size > buf.length) size = buf.length - (pos + 8);
      dataSize = size;
      break;
    }
    pos += 8 + size + (size % 2);
  }
  if (byteRate > 0 && dataSize > 0) {
    media = {hasAudio: true, durationInSeconds: dataSize / byteRate};
    console.log(`[sync] audio.wav found: ${media.durationInSeconds.toFixed(2)}s`);
    const last = cues[cues.length - 1].end;
    if (media.durationInSeconds < last) console.warn(`[sync] WARNING: audio (${media.durationInSeconds.toFixed(2)}s) ends before last cue (${last}s)`);
  } else {
    console.warn("[sync] audio.wav could not be parsed - rendering without audio");
  }
} else {
  console.log("[sync] public/audio.wav not found - building silent preview (add the file and re-run)");
}
fs.writeFileSync(path.join(outDir, "media.json"), JSON.stringify(media, null, 2));

/**
 * Prints how the scene timeline is derived from the SRT: cue count, total duration, every scene
 * boundary and which beats are ESTIMATED (character-proportional inside a combined SRT cue).
 */
import { readFileSync } from "node:fs";
import { parseSrt } from "../src/utils/srt";
import { buildTimeline } from "../src/config/timeline";
import { episodeConfig as cfg } from "../src/config/episodeConfig";

const cues = parseSrt(readFileSync(`public/${cfg.srtFile}`, "utf8"));
const tl = buildTimeline(cues, cfg.video.fps);
console.log(`SRT cues: ${cues.length}  | last cue end: ${Math.max(...cues.map((c) => c.end)).toFixed(2)}s`);
console.log(`Timeline: ${tl.scenes.length} scenes, ${tl.totalFrames} frames (${(tl.totalFrames / tl.fps).toFixed(2)}s)`);
for (const s of tl.scenes) {
  console.log(`${s.id.padEnd(8)} from ${String(s.from).padStart(4)}  dur ${String(s.dur).padStart(4)}  (${(s.from / tl.fps).toFixed(2)}s)`);
}
const sentences = tl.scenes.filter((s) => s.kind === "sentence").map((s) => s.n);
const expected = Array.from({ length: cfg.sentenceEnd - cfg.sentenceStart + 1 }, (_, i) => cfg.sentenceStart + i);
const ok = expected.every((n) => sentences.includes(n)) && sentences.length === expected.length;
console.log(`Sentences ${cfg.sentenceStart}-${cfg.sentenceEnd} all present: ${ok}`);
console.log(`Estimated beats (need audio to confirm): ${tl.estimated.join(", ")}`);
if (!ok) process.exit(1);

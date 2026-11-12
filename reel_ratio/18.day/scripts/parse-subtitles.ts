/**
 * Validates the cue table (src/episodes/day-18/cues.ts) and, when present, compares it with the ORIGINAL SRT
 * (public/subtitles/day-18.srt). Exit code 1 on any error.   --require-srt → missing SRT is an error.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { episodeConfig, progress } from "../src/episodes/day-18/config";
import { CUES } from "../src/episodes/day-18/cues";
import { SENTENCES } from "../src/episodes/day-18/sentences";
import { parseSrt } from "../src/lib/srt";
import { msToTimecode, timecodeToMs } from "../src/lib/time";

const root = resolve(import.meta.dirname, "..");
const errors: string[] = [];
const warns: string[] = [];
const ok: string[] = [];

// 1. cue table sanity
if (CUES.length !== 57) errors.push(`Cue table has ${CUES.length} entries, expected 57.`);
else ok.push("Cue table: 57 entries");
let prevStart = -1;
for (const c of CUES) {
  const s = timecodeToMs(c.start), e = timecodeToMs(c.end);
  if (e <= s) errors.push(`${c.id}: end <= start`);
  if (s < prevStart) errors.push(`${c.id}: not chronological`);
  prevStart = s;
}
ok.push("Cue table chronological, all durations positive");

// 2. sentence data ↔ cues
const [a, b] = episodeConfig.sentenceRange;
if (SENTENCES.length !== episodeConfig.totalSentences) errors.push(`sentences.ts has ${SENTENCES.length} sentences`);
SENTENCES.forEach((s, i) => {
  if (s.id !== a + i) errors.push(`Sentence order: expected ${a + i}, got ${s.id}`);
  for (const id of Object.values(s.cues)) if (!CUES.find((c) => c.id === id)) errors.push(`Sentence ${s.id}: cue "${id}" missing`);
  if (!s.pron || !s.arabic || !s.meaning) errors.push(`Sentence ${s.id}: empty field`);
});
if (b - a + 1 !== SENTENCES.length) errors.push("Sentence range does not match sentence count");
else ok.push(`Sentences ${a}–${b}: 10 entries, all cue ids resolve`);

// 3. progress maths
if (progress.beforeLabel !== "56.67%" || progress.afterLabel !== "60%") errors.push(`Progress labels wrong: ${progress.beforeLabel} / ${progress.afterLabel}`);
else ok.push(`Progress: 170/300 = ${progress.beforeLabel}, 180/300 = ${progress.afterLabel}`);

// 4. original SRT
const srtPath = join(root, "public", episodeConfig.subtitle);
if (!existsSync(srtPath)) {
  const m = `Original SRT not found at public/${episodeConfig.subtitle}. The timeline uses timestamps transcribed from the master prompt and is NOT verified against the original SRT.`;
  (process.argv.includes("--require-srt") ? errors : warns).push(m);
} else {
  const srt = parseSrt(readFileSync(srtPath, "utf8"));
  if (srt.length !== 57) errors.push(`SRT has ${srt.length} entries, expected 57.`);
  const n = Math.min(srt.length, CUES.length);
  let bad = 0;
  for (let i = 0; i < n; i++) {
    const cs = timecodeToMs(CUES[i].start), ce = timecodeToMs(CUES[i].end);
    if (srt[i].startMs !== cs || srt[i].endMs !== ce) {
      bad++;
      errors.push(`SRT #${srt[i].index} ${msToTimecode(srt[i].startMs)} → ${msToTimecode(srt[i].endMs)} ≠ cue ${CUES[i].id} ${CUES[i].start} → ${CUES[i].end}`);
    }
    const expected = CUES[i].text ?? SENTENCES.find((s) => s.id === CUES[i].sentence)?.[{ pron1: "pron", pron2: "pron", meaning: "meaning" }[CUES[i].role as string] as "pron" | "meaning"];
    if (expected && srt[i].text.replace(/\s+/g, " ").trim() !== expected.replace(/\s+/g, " ").trim()) warns.push(`SRT #${srt[i].index} text differs from "${expected}" (got "${srt[i].text}")`);
  }
  if (!bad && srt.length === 57) ok.push("Original SRT: 57 entries, all timestamps identical to the cue table");
}

ok.forEach((m) => console.log(`✔ ${m}`));
warns.forEach((m) => console.warn(`⚠ ${m}`));
errors.forEach((m) => console.error(`✖ ${m}`));
process.exit(errors.length ? 1 : 0);

/**
 * Static validation: SRT, timeline, content, slots, config. Renders NOTHING.
 * Run: npm run validate:content
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { episodeConfig as E } from "../src/config/episode";
import { CANVAS, MIN_GAP, SAFE, allSlotSets } from "../src/config/layout";
import { sentences } from "../src/episode/content";
import { parseSrt } from "../src/parsers/srt";
import { buildTimeline } from "../src/timeline/build";
import { validateSlots } from "../src/utils/layoutValidation";

const root = resolve(__dirname, "..");
let failures = 0;
const fail = (msg: string) => { failures++; console.error("  ✗ " + msg); };
const ok = (msg: string) => console.log("  ✓ " + msg);

console.log("Config");
E.video.width === 1080 && E.video.height === 1920 && E.video.fps === 30 ? ok("1080x1920 @ 30fps (9:16)") : fail("video config");
E.episodeNumber === 13 && E.sentenceStart === 121 && E.sentenceEnd === 130 ? ok("Episode 13, sentences 121–130") : fail("episode numbers");
E.progressPercentage === 43.33 && E.completedSentences === 130 ? ok("Progress 130/300 = 43.33%") : fail("progress");
Math.abs((E.completedSentences / E.totalSentences) * 100 - E.progressPercentage) < 0.01 ? ok("Progress percentage matches counts") : fail("progress percentage mismatch");

console.log("SRT");
const srtPath = resolve(root, "public", E.srtFile);
if (!existsSync(srtPath)) { fail(`Missing ${srtPath}`); process.exit(1); }
const raw = readFileSync(srtPath, "utf8");
const { cues, issues } = parseSrt(raw);
issues.length === 0 ? ok(`${cues.length} cues parsed, no structural issues`) : issues.forEach((i) => fail(`[${i.code}] ${i.message}`));
/[\u0980-\u09FF]/.test(raw) && !raw.includes("\uFFFD") ? ok("Bengali text intact (no U+FFFD)") : fail("Bengali text corrupted");
/[\u0600-\u06FF]/.test(raw) ? ok("Arabic text present in SRT") : fail("no Arabic in SRT");

const reference = JSON.parse(readFileSync(resolve(root, "qa/cues.reference.json"), "utf8")) as Array<{ i: number; start: number; end: number; text: string }>;
const mismatch = reference.filter((r, idx) => {
  const c = cues[idx];
  return !c || c.index !== r.i || Math.abs(c.start - r.start) > 0.0011 || Math.abs(c.end - r.end) > 0.0011 || c.text.replace(/\s+/g, " ") !== r.text.replace(/\s+/g, " ");
});
mismatch.length === 0 ? ok("SRT matches cues.json (index, times, text) for all cues") : mismatch.forEach((m) => fail(`SRT/cues.json differ at cue ${m.i}`));

console.log("Content");
sentences.length === 10 ? ok("Exactly 10 sentences") : fail(`expected 10 sentences, got ${sentences.length}`);
sentences.every((s, i) => s.number === 121 + i) ? ok("Numbered 121–130 in order") : fail("sentence numbering/order");
const s122 = sentences.find((s) => s.number === 122)!;
s122.pronunciations.length === 2 && s122.pronunciations[0].text !== s122.pronunciations[1].text ? ok("Sentence 122 keeps BOTH pronunciation versions") : fail("sentence 122 versions");
sentences.every((s) => !/[\u0600-\u06FF]/.test(s.pronunciations.map((p) => p.text).join(""))) ? ok("No Arabic script inside pronunciation strings") : fail("Arabic leaked into pronunciation");

console.log("Timeline");
const tl = buildTimeline(cues);
ok(`${tl.scenes.length} scenes, ${tl.durationInFrames} frames (${(tl.durationInFrames / tl.fps).toFixed(2)}s)`);
tl.scenes.length === 17 ? ok("17 scenes as specified") : fail(`expected 17 scenes, got ${tl.scenes.length}`);
tl.scenes.forEach((s) => console.log(`    ${s.id.padEnd(14)} frames ${String(s.from).padStart(4)}–${String(s.from + s.durationInFrames).padStart(4)}  (${(s.durationInFrames / tl.fps).toFixed(2)}s)`));
console.log("  Estimated (proportional, NOT exact) points:");
tl.estimates.forEach((e) => console.log("    ~ " + e));
const arabicOf = tl.scenes.flatMap((s) => (s.data.kind === "sentence" ? [`${s.data.content.number}: ${s.data.arabic}`] : []));
console.log("  Arabic shown (from SRT):\n    " + arabicOf.join("\n    "));

console.log("Slots");
for (const [name, slots] of Object.entries(allSlotSets)) {
  const issuesS = validateSlots(slots, CANVAS, SAFE, MIN_GAP);
  issuesS.length === 0 ? ok(`${name}: ${Object.keys(slots).length} slots disjoint, ≥${MIN_GAP}px apart, inside safe area`) : issuesS.forEach((i) => fail(`${name}: ${i.message}`));
}

console.log("Audio");
const audioPath = resolve(root, "public", E.audio.file);
if (E.audio.enabled) { existsSync(audioPath) ? ok("narration present") : fail(`Audio enabled but missing: ${audioPath}`); }
else console.log("  ! Narration audio NOT bundled (not supplied). audio.enabled=false. See README.");

if (failures > 0) { console.error(`\n${failures} check(s) failed`); process.exit(1); }
console.log("\nAll content checks passed.");

/**
 * Project validation - does NOT render anything.
 *   npm run validate
 * Checks: episode config, SRT, timeline, assets/fonts/audio paths, content fidelity, and the zero-overlap
 * layout rules (text measured with the real font files via fontkit, then validated with src/utils/layoutValidation.ts).
 * Writes docs/timeline-report.md.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";
import { ASSETS, LOGO } from "../src/config/assets";
import { episode, srt, timeline } from "../src/config/episode";
import { FONT_FILES, fontFile } from "../src/config/typography";
import { CONTENT_W, H, MIN_GAP, SAFE, TEXT_MOTION_DY, W } from "../src/config/layout";
import { getSceneSpec } from "../src/config/sceneSpecs";
import { SRT_RAW } from "../src/generated/subtitles";
import { fitText } from "../src/utils/fitText";
import { validateScene, type LayoutElement, type LayoutIssue } from "../src/utils/layoutValidation";
import type { SceneKind } from "../src/types";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);
const check = (cond: boolean, msg: string) => { if (!cond) err(msg); };

// ---------- 1. episode configuration ----------
check(episode.video.width === 1080 && episode.video.height === 1920, "video must be 1080x1920");
check(episode.video.fps === 30, "fps must be 30");
check(episode.video.aspectRatio === "9:16", "aspect ratio must be 9:16");
check(W === 1080 && H === 1920, "layout canvas does not match video config");
check(episode.episodeNumber === 12, "episode number must be 12");
check(episode.sentenceStart === 111 && episode.sentenceEnd === 120, "sentence range must be 111-120");
check(episode.completedSentences === episode.previousCompletedSentences + (episode.sentenceEnd - episode.sentenceStart + 1), "completed sentences inconsistent");
check(Math.round((episode.completedSentences / episode.totalSentences) * 100) === episode.progressPercentage, "progress percentage inconsistent (expected 40)");
check(episode.progressPercentage === 40 && episode.completedSentences === 120 && episode.totalSentences === 300, "progress must be 120/300 = 40%");
check(episode.ctaText === "DAY 12 DONE!" && episode.nextEpisodeNumber === 13, "CTA / next episode mismatch");

// ---------- 2. content fidelity (exact strings from the master prompt) ----------
const EXPECTED: Record<number, { pron: string[]; meaning: string }> = {
  111: { pron: ["জিব হাদা বাস।"], meaning: "শুধু এটা দিন।" },
  112: { pron: ["আবগা কীস লাউ সামাহত।"], meaning: "দয়া করে একটা ব্যাগ দিন।" },
  113: { pron: ["তাকবালুন কার্ত?"], meaning: "আপনারা কি কার্ড গ্রহণ করেন?" },
  114: { pron: ["আদফা' ক্যাশ।"], meaning: "আমি নগদ দেব।" },
  115: { pron: ["মাআক ফুক্কা?", "মাআক সার্ফ"], meaning: "আপনার কাছে খুচরা আছে?" },
  116: { pron: ["আল-বাগি লাক।"], meaning: "বাকিটা আপনার।" },
  117: { pron: ["আবগা ফাতুরা।"], meaning: "আমি রসিদ চাই।" },
  118: { pron: ["হাদা ফীহ দামান?"], meaning: "এটার কি ওয়ারেন্টি আছে?" },
  119: { pron: ["আবগা আরাজ্জা হাদা।"], meaning: "আমি এটা ফেরত দিতে চাই।" },
  120: { pron: ["ফীহ খাসম আল-ইওম?"], meaning: "আজ কি কোন ছাড় / ডিসকাউন্ট আছে?" },
};
check(episode.sentences.length === 10, `expected exactly 10 sentences, found ${episode.sentences.length}`);
episode.sentences.forEach((s, i) => {
  check(s.number === 111 + i, `sentence #${i} has number ${s.number}, expected ${111 + i}`);
  const e = EXPECTED[s.number];
  check(!!e && JSON.stringify(e.pron) === JSON.stringify(s.pron), `sentence ${s.number}: pronunciation differs from the supplied script`);
  check(!!e && e.meaning === s.meaning, `sentence ${s.number}: meaning differs from the supplied script`);
});
check(episode.sentences[4].pron.length === 2, "sentence 115 must keep both alternative pronunciations");
const sceneSentences = timeline.scenes.filter((s) => s.kind === "sentence").map((s) => s.sentence);
check(JSON.stringify(sceneSentences) === JSON.stringify([111, 112, 113, 114, 115, 116, 117, 118, 119, 120]), "sentence scenes must be 111..120 in order");

// ---------- 3. SRT ----------
const srtOnDisk = readFileSync(join(root, episode.srtFile), "utf8");
check(srtOnDisk === SRT_RAW, "src/generated/subtitles.ts is stale - run `npm run sync:srt`");
for (const i of srt.issues) { (i.severity === "error" ? err : i.severity === "warn" ? warn : (m: string) => notes.push(m))(`SRT entry ${i.entry ?? "-"}: ${i.message}`); }
check(srt.entries.length === 29, `expected 29 SRT entries, parsed ${srt.entries.length}`);
check(!SRT_RAW.includes("\uFFFD"), "SRT contains U+FFFD replacement characters (corrupted encoding)");
check(srt.entries.some((e) => /[\u0980-\u09FF]/.test(e.text)), "SRT has no Bengali text");
const srtHash = createHash("sha256").update(readFileSync(join(root, episode.srtFile))).digest("hex");

// ---------- 4. timeline ----------
timeline.errors.forEach((e) => err(`timeline: ${e}`));
timeline.warnings.forEach((w) => warn(`timeline: ${w}`));
const lastEnd = srt.entries[srt.entries.length - 1].endSec;
check(timeline.totalFrames === Math.ceil((lastEnd + episode.tailSeconds) * episode.video.fps), "total frames does not equal SRT end + tail");
check(timeline.scenes[timeline.scenes.length - 1].endFrame === timeline.totalFrames, "last scene must end at total frames");
for (const s of timeline.scenes) for (const [k, v] of Object.entries(s.cues)) check(v >= 0 && v < s.durationFrames, `scene ${s.id}: cue ${k} (${v}) outside scene`);

// ---------- 5. assets, fonts, audio ----------
const used = new Set<string>();
const all = [...episode.sentences.flatMap((s) => s.layers), ...Object.values(episode.illustrations).flat()];
for (const l of all) { used.add(l.a); check(!!ASSETS[l.a], `unknown asset "${l.a}"`); }
for (const [key, a] of Object.entries(ASSETS)) {
  const f = join(root, "public", a.file);
  if (!existsSync(f)) { err(`missing asset file ${a.file}`); continue; }
  const svg = readFileSync(f, "utf8");
  const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  check(!!vb && +vb[1] === a.w && +vb[2] === a.h, `${a.file}: viewBox does not match registry (${a.w}x${a.h})`);
  check(!/https?:\/\/(?!www\.w3\.org)/.test(svg) && !/<image/.test(svg), `${a.file}: external reference found`);
  if (!used.has(key)) warn(`asset "${key}" is registered but never used`);
}
check(existsSync(join(root, "public", LOGO.file)), "missing logo");
for (const f of FONT_FILES) check(existsSync(join(root, "public", fontFile(f.weight, f.script))), `missing font ${fontFile(f.weight, f.script)}`);
const audioPath = join(root, "public", episode.audio.src);
if (episode.audio.enabled) check(existsSync(audioPath), `audio enabled but ${episode.audio.src} is missing`);
else warn(`narration audio is DISABLED (audio.enabled=false, no ${episode.audio.src} supplied). Add the file and set audio.enabled=true.`);

// ---------- 6. hard-coded episode values in reusable code ----------
for (const dir of ["src/components", "src/compositions"]) {
  for (const f of readdirSync(join(root, dir))) {
    const t = readFileSync(join(root, dir, f), "utf8");
    if (/\b(111|112|113|114|115|116|117|118|119|120|300)\b|DAY 1[23]|Day 1[23]/.test(t)) err(`${dir}/${f}: contains a hard-coded episode value`);
  }
}

// ---------- 7. layout: measure real text + validate every scene ----------
const fonts: Record<string, any> = {};
for (const f of FONT_FILES) fonts[`${f.script}-${f.weight}`] = fontkit.openSync(join(root, "public", fontFile(f.weight, f.script)));
const isBn = (ch: string) => /[\u0951\u0952\u0964\u0965\u0980-\u09FE\u200C\u200D\u25CC]/.test(ch);
function measure(text: string, fs: number, weight: number): number {
  let width = 0, run = "", cur: boolean | null = null;
  const flush = () => { if (!run) return; const f = fonts[`${cur ? "bengali" : "latin"}-${weight}`]; width += (f.layout(run).advanceWidth / f.unitsPerEm) * fs; run = ""; };
  for (const ch of text) { const b = isBn(ch); if (cur !== null && b !== cur) flush(); cur = b; run += ch; }
  flush();
  return width;
}

const layoutIssues: LayoutIssue[] = [];
const fontLog: string[] = [];
const kinds = Array.from(new Set(timeline.scenes.map((s) => s.kind))) as SceneKind[];
const jobs: { id: string; kind: SceneKind; sentence?: number }[] = [];
for (const k of kinds) {
  if (k === "sentence") for (const s of episode.sentences) jobs.push({ id: `sentence-${s.number}`, kind: k, sentence: s.number });
  else jobs.push({ id: k, kind: k });
}
for (const job of jobs) {
  const spec = getSceneSpec(job.kind, episode, job.sentence);
  const els: LayoutElement[] = [];
  for (const t of spec.texts) {
    if (/[\u0600-\u06FF]/.test(t.paragraphs.join(""))) err(`${job.id}/${t.id}: Arabic-script text found (none was supplied, none may be invented)`);
    const fit = fitText({ paragraphs: t.paragraphs, maxWidth: t.zone.w, maxHeight: t.zone.h, maxFont: t.maxFont, minFont: t.minFont, lineHeight: t.lineHeight, paragraphGap: t.paragraphGap, weight: t.weight, measure });
    if (!fit.fits) err(`${job.id}/${t.id}: text does not fit its ${t.zone.w}x${t.zone.h} zone even at ${fit.fontSize}px (needs ${Math.round(fit.width)}x${Math.round(fit.height)})`);
    else if (fit.fontSize < t.maxFont * 0.7) warn(`${job.id}/${t.id}: font shrunk to ${fit.fontSize}px (preferred ${t.maxFont}px)`);
    if (job.kind === "sentence" && /^(pron|meaning)/.test(t.id)) fontLog.push(`${job.id}/${t.id}: ${fit.fontSize}px, ${fit.paragraphs.flat().length} line(s), ${Math.round(fit.width)}x${Math.round(fit.height)} in ${t.zone.w}x${t.zone.h}`);
    const align = t.align ?? "center";
    const x = align === "center" ? t.zone.x + (t.zone.w - fit.width) / 2 : align === "left" ? t.zone.x : t.zone.x + t.zone.w - fit.width;
    els.push({ id: t.id, kind: "text", rect: { x, y: t.zone.y + (t.zone.h - fit.height) / 2, w: fit.width, h: fit.height }, within: t.zone, motion: { dy: TEXT_MOTION_DY } });
  }
  for (const z of spec.illustrations) {
    for (const [i, l] of z.layers.entries()) {
      const a = ASSETS[l.a];
      els.push({ id: `${z.id}:${l.a}#${i}`, kind: "illustration", rect: { x: z.zone.x + l.x, y: z.zone.y + l.y, w: l.w, h: (l.w * a.h) / a.w }, within: z.zone, clip: z.zone, motion: { dy: 90 } });
    }
  }
  for (const u of spec.ui) els.push({ id: u.id, kind: u.kind === "decor" ? "decor" : "ui", rect: u.rect, contains: u.contains });
  // zone-level gap check (text zones must be MIN_GAP apart; panels may contain their own texts)
  layoutIssues.push(...validateScene(job.id, els, { canvas: { w: W, h: H }, safe: SAFE, minGap: MIN_GAP }));
}
for (const i of layoutIssues) (i.severity === "error" ? err : warn)(`layout ${i.scene} [${i.rule}] ${i.message}`);
check(CONTENT_W + 140 === W, "content width + margins must equal canvas width");

// ---------- 8. report ----------
const f2 = (n: number) => n.toFixed(2);
const rep: string[] = [];
rep.push("# Day 12 - timeline report", "", `Generated by \`npm run validate\`. SRT: \`${episode.srtFile}\` (sha256 \`${srtHash.slice(0, 16)}...\`), ${srt.entries.length} entries, ends at ${f2(lastEnd)}s. Total: ${timeline.totalFrames} frames @ ${episode.video.fps} fps = ${f2(timeline.totalFrames / episode.video.fps)}s.`, "",
  "Scene boundaries marked *exact* are SRT entry start times. Boundaries marked *interpolated* fall INSIDE a subtitle entry that mixes two things (e.g. the end of one sentence and the start of the next); the SRT has no word-level timing, so the position is estimated linearly by character offset. These are the only estimated points - adjust the anchor in `episode.config.json` once the real narration audio is available.", "",
  "| Scene | Group | Start (s) | Length (s) | Start derived from | Cues (scene-local seconds) |", "|---|---|---|---|---|---|");
for (const s of timeline.scenes) rep.push(`| ${s.id} | ${s.group} | ${f2(s.startFrame / timeline.fps)} | ${f2(s.durationFrames / timeline.fps)} | ${s.startSource} | ${Object.entries(s.cues).map(([k, v]) => `${k}=${f2(v / timeline.fps)}`).join(", ") || "-"} |`);
rep.push("", "## SRT observations", "", "- The supplied SRT is an automatic transcript: Arabic phrases are transcribed in Devanagari (e.g. `अबगा किस लौ समत`) and some entries contain stray bracketed Russian/Bengali pause notes (`[чуть более двух секунд]`). These are used only for timing; nothing from them is displayed. All on-screen text comes from `episode.config.json` (the supplied Day 12 script).", "- Several entries split a sentence across two subtitle blocks (e.g. entries 5-6, 6-8, 16-17). Those splits are why some boundaries are interpolated.", "- Entry 22 (`অর্থ`) lasts 0.18s; sentence 119's meaning cue is therefore the exact start of entry 22.", "",
  "## Display text vs SRT (script wins)", "", "- Sentence 120: script `ফীহ খাসম আল-ইওম?`; SRT transcript `फी खसा मलियोंम` (different transliteration). Script used.", "- Other sentences differ only in transliteration style (Devanagari vs Bengali). Script used.");
writeFileSync(join(root, "docs/timeline-report.md"), rep.join("\n") + "\n");

// ---------- result ----------
console.log(`Scenes: ${timeline.scenes.length} | frames: ${timeline.totalFrames} (${f2(timeline.totalFrames / 30)}s) | SRT entries: ${srt.entries.length} | layout scenes checked: ${jobs.length}`);
console.log("\nSentence text fitting (real font metrics):\n  " + fontLog.join("\n  "));
if (notes.length) console.log(`\nNotes (${notes.length}): SRT transcription artefacts (Cyrillic) present - timing only, never displayed.`);
if (warnings.length) console.log("\nWARNINGS:\n  - " + warnings.join("\n  - "));
if (errors.length) { console.log("\nERRORS:\n  - " + errors.join("\n  - ")); process.exit(1); }
console.log("\nOK - no errors.");

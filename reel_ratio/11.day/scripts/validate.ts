/* Validation only. Does NOT render video. Run: npm run validate */
import fs from "node:fs";
import path from "node:path";
import { parseSrt } from "../src/parsers/srt";
import { buildTimeline } from "../src/services/timeline";
import { episodeConfig as cfg } from "../src/config/episode";

const root = path.resolve(__dirname, "..");
let failed = 0;
const ok = (m: string) => console.log("  ✓", m);
const bad = (m: string) => {
  failed++;
  console.log("  ✗", m);
};
const check = (c: boolean, m: string) => (c ? ok(m) : bad(m));

console.log("Video configuration");
check(cfg.video.width === 1080 && cfg.video.height === 1920, "1080 × 1920");
check(cfg.video.fps === 30, "30 FPS");
check(cfg.video.aspectRatio === "9:16", "9:16");

console.log("Episode content");
check(cfg.sentences.length === 10, "10 sentences");
check(cfg.sentences.every((s, i) => s.number === 101 + i), "numbering 101–110 in order");
check(
  Math.abs((cfg.completedSentences / cfg.totalSentences) * 100 - cfg.progressPercentage) < 0.01,
  `progress ${cfg.completedSentences}/${cfg.totalSentences} = ${cfg.progressPercentage}%`,
);
check(cfg.completedSentences - cfg.previousCompletedSentences === cfg.sentences.length, "completed − previous = 10");

console.log("SRT & timeline");
const srt = fs.readFileSync(path.join(root, "public", cfg.assets.subtitles), "utf8");
const { cues, issues: srtIssues } = parseSrt(srt);
check(cues.length === 42, `parsed ${cues.length} cues`);
srtIssues.forEach((i) => bad(`SRT: ${i}`));
check(srtIssues.length === 0, "SRT timestamps valid, ordered, non-overlapping");
const tl = buildTimeline(cfg, cues, cfg.video.fps);
tl.issues.forEach((i) => bad(`Timeline: ${i}`));
check(tl.issues.length === 0, "timeline mapping valid");
check(tl.scenes.every((s) => s.duration > 0), "all scene durations positive");
check(tl.scenes.length === 15, "15 scenes");
console.log(`  total ${tl.totalFrames} frames = ${(tl.totalFrames / cfg.video.fps).toFixed(2)}s`);
tl.scenes.forEach((s) =>
  console.log(
    `    ${s.id.padEnd(14)} from ${(s.from / 30).toFixed(2).padStart(7)}s  dur ${(s.duration / 30).toFixed(2).padStart(6)}s${s.estimated ? "  (partly estimated)" : ""}`,
  ),
);

console.log("Script vs SRT pronunciation check (script wins on screen)");
const norm = (t: string) => t.replace(/[?।!,.\s]/g, "");
const cueText = cues.map((c) => c.text);
for (const s of cfg.sentences) {
  const hits = cueText.filter((t) => norm(t).includes(norm(s.pronunciation)));
  hits.length >= 1
    ? ok(`${s.number} pronunciation matches SRT (${hits.length}×)`)
    : bad(`${s.number} pronunciation not found verbatim in SRT → using script text`);
  const meaning = norm(s.meaning).replace("রঙ", "রং");
  cueText.some((t) => norm(t).replace("সাইজ", "size").replace("ট্রাই", "try").includes(meaning.replace("সাইজ", "size").replace("ট্রাই", "try")))
    ? ok(`${s.number} meaning matches SRT (modulo spelling)`)
    : console.log(`  ! ${s.number} meaning differs from SRT → script text used`);
}


console.log("Script (script.md) vs config: Arabic / pronunciation / meaning preserved exactly");
const md = fs.readFileSync(path.join(root, "script.md"), "utf8").replace(/\r/g, "");
for (const s of cfg.sentences) {
  const m = new RegExp(`\\*\\*Sentence ${s.number}\\*\\*\\n\\n([^\\n]+)\\n\\n([^\\n]+)\\n\\n([^\\n]+)\\n\\nঅর্থ: ([^\\n]+)`).exec(md);
  if (!m) { bad(`${s.number}: block not found in script.md`); continue; }
  check(m[1] === s.arabic, `${s.number} Arabic identical`);
  check(m[2] === s.pronunciation, `${s.number} pronunciation identical`);
  check(m[4] === s.meaning, `${s.number} meaning identical`);
}
for (const l of [...cfg.intro.lines, ...cfg.outro.lines]) check(md.includes(l.text), `line "${l.id}" is verbatim in script.md`);

console.log("Illustrations");
const ill = fs.readFileSync(path.join(root, "src/illustrations/scenes.tsx"), "utf8");
for (const s of cfg.sentences) check(new RegExp(`\\b${s.illustration}\\b\\s*[:=]`).test(ill), `${s.number} → illustration "${s.illustration}" exists`);

console.log("Assets");
const pub = (p: string) => fs.existsSync(path.join(root, "public", p));
for (const f of fs.readdirSync(path.join(root, "public/fonts")).filter((f) => f.endsWith(".woff2"))) void f;
for (const w of [500, 600, 700]) {
  check(pub(`fonts/hind-siliguri-bengali-${w}-normal.woff2`), `Hind Siliguri bengali ${w}`);
  check(pub(`fonts/hind-siliguri-latin-${w}-normal.woff2`), `Hind Siliguri latin ${w}`);
}
for (const w of [600, 700, 800]) check(pub(`fonts/noto-sans-arabic-arabic-${w}-normal.woff2`), `Noto Sans Arabic ${w}`);
const a = cfg.assets.audio;
if (a.enabled) check(pub(a.file), `narration audio present: ${a.file}`);
else console.log(`  ! narration audio DISABLED (no ${a.file} supplied yet). Add the file and set assets.audio.enabled=true.`);

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);

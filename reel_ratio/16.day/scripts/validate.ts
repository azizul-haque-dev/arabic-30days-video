/* Validation only — never renders video. Run: npm run validate */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { parseSrt, validateCues } from "../src/parsers/srt";
import { buildTimeline, validateTimeline } from "../src/services/timeline";
import { progressOf } from "../src/config/episode";
import type { EpisodeConfig } from "../src/types";

const root = join(__dirname, "..");
const episode = JSON.parse(readFileSync(join(root, "episode.config.json"), "utf8")) as EpisodeConfig;
const errors: string[] = [];
const warns: string[] = [];
const ok = (m: string) => console.log("  ✓", m);
const err = (m: string) => { errors.push(m); console.log("  ✗", m); };
const warn = (m: string) => { warns.push(m); console.log("  !", m); };

console.log("Config");
const v = episode.video;
v.width === 1080 && v.height === 1920 && v.fps === 30 && v.aspectRatio === "9:16" ? ok("1080×1920 @30fps 9:16") : err("video spec mismatch");
const n = episode.sentenceEnd - episode.sentenceStart + 1;
n === 10 && episode.sentences.length === 10 ? ok("exactly 10 sentences") : err("sentence count != 10");
episode.sentences.every((s, i) => s.number === episode.sentenceStart + i) ? ok(`numbered ${episode.sentenceStart}–${episode.sentenceEnd} in order`) : err("sentence order/numbering wrong");
episode.previousCompletedSentences + n === episode.completedSentences ? ok("completed = previous + 10") : err("completedSentences mismatch");
progressOf(episode) === episode.progressPercentage ? ok(`progress ${episode.completedSentences}/${episode.totalSentences} = ${episode.progressPercentage}%`) : err(`progress mismatch (computed ${progressOf(episode)})`);
episode.nextEpisodeNumber === episode.episodeNumber + 1 ? ok("next episode = episode + 1") : err("nextEpisodeNumber mismatch");
episode.ctaText === `DAY ${episode.episodeNumber} DONE!` ? ok("CTA text matches episode") : warn("CTA text differs from DAY N DONE!");

console.log("SRT");
const srtPath = join(root, "public", episode.srt.path);
if (!existsSync(srtPath)) { err("SRT file missing: " + srtPath); process.exit(1); }
const raw = readFileSync(srtPath, "utf8");
const cues = parseSrt(raw);
const issues = validateCues(cues, episode.srt.expectedEntries);
issues.length ? issues.forEach(err) : ok(`${cues.length} entries parsed, order/timestamps valid, no overlaps`);
/[\uFFFD]/.test(raw) ? err("corrupted characters (U+FFFD) in SRT") : ok("UTF-8 Bengali intact");
const tIssues = validateTimeline(episode, cues);
tIssues.length ? tIssues.forEach(err) : ok("scene → cue mapping valid");

console.log("Timeline");
const tl = buildTimeline(episode, cues);
let contiguous = true;
tl.scenes.forEach((s, i) => { if (i > 0 && s.from !== tl.scenes[i - 1].from + tl.scenes[i - 1].durationInFrames) contiguous = false; if (s.durationInFrames < 20) warn(`${s.id}: very short (${s.durationInFrames}f)`); });
contiguous ? ok("scenes contiguous, no gaps/overlaps") : err("scenes not contiguous");
const covered = new Set(tl.scenes.flatMap((s) => s.cues.map((c) => c.index)));
cues.every((c) => covered.has(c.index)) ? ok("every SRT entry belongs to a scene") : err("some SRT entries not covered");
const last = tl.scenes[tl.scenes.length - 1];
last.from + last.durationInFrames === tl.totalFrames ? ok(`total ${tl.totalFrames} frames = ${(tl.totalFrames / tl.fps).toFixed(2)}s (SRT end ${(cues[cues.length - 1].endMs / 1000).toFixed(3)}s + ${episode.srt.tailSeconds}s tail)`) : err("total frames mismatch");
tl.scenes.forEach((s) => console.log(`    ${s.id.padEnd(18)} cues ${String(s.cfg.startCue).padStart(2)}–${String(s.cues[s.cues.length - 1].index).padEnd(2)}  from ${String(s.from).padStart(4)}  len ${String(s.durationInFrames).padStart(4)}f`));

console.log("Content vs SRT (exact Bengali preserved)");
const norm = (t: string) => t.normalize("NFC").replace(/[\s।?!,.\-‘’'"]/g, "");
episode.sentences.forEach((s) => {
  const inCue = (text: string) => cues.some((c) => norm(c.text).includes(norm(text)));
  inCue(s.pronunciation) ? ok(`${s.number} pronunciation "${s.pronunciation}" found in SRT`) : err(`${s.number} pronunciation not found in SRT`);
  inCue(s.meaning) ? ok(`${s.number} meaning found in SRT`) : warn(`${s.number} meaning "${s.meaning}" is not a narrated SRT entry (${s.notes ?? "no note"})`);
});

console.log("Hard-coded episode values in reusable code");
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const bad = walk(join(root, "src")).filter((f) => {
  const norm = f.replace(/\\/g, "/");
  return /\.(tsx?)$/.test(norm) && !norm.includes("/illustrations/") && !norm.endsWith("theme.ts");
}).flatMap((f) => {
  const t = readFileSync(f, "utf8").split("\n");
  return t.map((l, i) => ({ f, i, l })).filter(({ l }) => !l.trim().startsWith("//") && /(\b15[1-9]\b|\b160\b|53\.33|DAY 1[67]|Day 1[67])/.test(l)).map(({ f: ff, i, l }) => `${ff.replace(/\\/g, "/").replace(root.replace(/\\/g, "/") + "/", "")}:${i + 1}: ${l.trim().slice(0, 80)}`);
});
bad.length ? bad.forEach(err) : ok("no hard-coded episode numbers / progress / CTA in src/");

console.log("Assets");
const fonts = readdirSync(join(root, "public/fonts")).filter((f) => f.endsWith(".woff2"));
const needed = ["hind-siliguri-bengali-500-normal", "hind-siliguri-bengali-600-normal", "hind-siliguri-bengali-700-normal", "hind-siliguri-latin-500-normal", "hind-siliguri-latin-600-normal", "hind-siliguri-latin-700-normal", "inter-latin-600-normal", "inter-latin-800-normal"];
needed.every((f) => fonts.includes(f + ".woff2")) ? ok(`${needed.length} font files present`) : err("font file(s) missing");
const audioPath = join(root, "public", episode.audio.src);
if (episode.audio.enabled) existsSync(audioPath) ? ok("audio present: " + episode.audio.src) : err("audio enabled but file missing: " + episode.audio.src);
else ok("audio disabled (silent build, as requested); drop file at public/" + episode.audio.src + " and set audio.enabled=true to use it");
const videos = walk(root).filter((f) => {
  const norm = f.replace(/\\/g, "/");
  return !norm.includes("/node_modules/") && !norm.includes("/out/") && [".mp4", ".webm", ".mov", ".mkv"].includes(extname(f).toLowerCase());
});
videos.length ? videos.forEach((f) => err("rendered video found: " + f)) : ok("no rendered video files in project");

console.log(`\n${errors.length ? "FAILED" : "PASSED"}: ${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);

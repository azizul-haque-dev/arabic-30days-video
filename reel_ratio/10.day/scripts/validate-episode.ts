import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { video } from "../src/config/video.config";
import { illustrations } from "../src/components/Illustrations";
import type { EpisodeConfig } from "../src/types";

const dir = resolve(process.argv[2] ?? "episodes/episode-10");
const errors: string[] = [];
const ok: string[] = [];
const check = (cond: boolean, pass: string, fail: string) => (cond ? ok.push(pass) : errors.push(fail));

for (const f of ["script.md", "subtitles.srt", "episode.meta.json", "episode.config.json"]) {
  check(existsSync(join(dir, f)), `${f} present`, `${f} missing (run: npm run build:episode)`);
}
if (errors.length) done();

const ep = JSON.parse(readFileSync(join(dir, "episode.config.json"), "utf8")) as EpisodeConfig;

check(video.width === 1080 && video.height === 1920 && video.fps === 30, "video spec 1080x1920 @30fps", "video spec is not 1080x1920 @30fps");
for (const f of [
  "hind-siliguri-bengali-500-normal.woff2",
  "hind-siliguri-bengali-600-normal.woff2",
  "hind-siliguri-bengali-700-normal.woff2",
  "hind-siliguri-latin-600-normal.woff2",
  "hind-siliguri-latin-700-normal.woff2",
]) {
  check(existsSync(resolve("public/fonts", f)), `font ${f}`, `font missing: public/fonts/${f}`);
}

const n = ep.sentences.length;
check(n === ep.sentenceEndNumber - ep.sentenceStartNumber + 1, `${n} sentences numbered ${ep.sentenceStartNumber}-${ep.sentenceEndNumber}`, "sentence count does not match number range");
ep.sentences.forEach((s, i) => {
  check(s.number === ep.sentenceStartNumber + i, `sentence ${s.number} order`, `sentence order broken at ${s.number}`);
  check(s.pronunciation.length > 0 && s.meaning.length > 0, `sentence ${s.number} has content`, `sentence ${s.number} missing pronunciation/meaning`);
  check(!s.arabic, `sentence ${s.number} no invented Arabic`, `sentence ${s.number} has Arabic text that must come from the script`);
  check(s.illustration in illustrations, `sentence ${s.number} illustration '${s.illustration}'`, `unknown illustration '${s.illustration}'`);
  check(s.endSec > s.startSec && s.pronStartSec > s.startSec && s.meaningStartSec > s.pronStartSec && s.meaningStartSec < s.endSec, `sentence ${s.number} timing`, `sentence ${s.number} invalid timing`);
  if (i > 0) check(Math.abs(s.startSec - ep.sentences[i - 1]!.endSec) < 1e-6, `sentence ${s.number} no gap/overlap`, `gap or overlap before sentence ${s.number}`);
});
const t = ep.timing;
check(t.thumbnailEndSec > 0 && t.thumbnailEndSec < t.introEndSec && t.introEndSec < t.outroStartSec && t.outroStartSec < t.endSec, "scene boundaries ordered", "scene boundaries not ordered");
check(Math.abs(ep.sentences[0]!.startSec - t.introEndSec) < 1e-6, "intro meets first sentence", "gap between intro and first sentence");
check(Math.abs(ep.sentences[n - 1]!.endSec - t.outroStartSec) < 1e-6, "last sentence meets outro", "gap between last sentence and outro");
check(ep.introStages.length > 0 && ep.outroStages.length > 0, "intro and outro present", "intro or outro missing");
check(ep.hook.length > 0 && ep.ctaText.length > 0 && ep.nextEpisodeNumber === ep.episodeNumber + 1, "hook, CTA and next episode set", "hook / CTA / next episode invalid");
const blob = JSON.stringify(ep);
check(!/সৌদি|Saudi/i.test(blob), "no 'Saudi' wording in generated content", "'Saudi/সৌদি' found in episode config");
check(ep.dialectLabel === "Gulf Arabic", "dialect label = Gulf Arabic", "dialect label must be 'Gulf Arabic'");

done();

function done(): never {
  ok.forEach((m) => console.log("  ok  " + m));
  if (errors.length) {
    console.error("\nVALIDATION FAILED:\n" + errors.map((e) => " - " + e).join("\n"));
    process.exit(1);
  }
  console.log(`\nVALIDATION PASSED (${ok.length} checks, ${ep!.warnings.length} warning(s))`);
  ep!.warnings.forEach((w) => console.log("  warn " + w));
  process.exit(0);
}

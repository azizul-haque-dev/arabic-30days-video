/** Generates script.md from the episode content + SRT (single source of truth). */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { episodeConfig as E } from "../src/config/episode";
import { sentences, texts } from "../src/episode/content";
import { parseSrtStrict } from "../src/parsers/srt";

const root = resolve(__dirname, "..");
const cues = parseSrtStrict(readFileSync(resolve(root, "public", E.srtFile), "utf8"));
const arabicOf = (n: number) => cues.find((c) => c.index === n)!.text.split("\u0964")[0].replace(/\s+/g, " ").trim();

const out: string[] = [];
out.push(`# ${E.brandName} — ${E.seriesName} — Day ${E.episodeNumber}: ${E.topic} (${E.topicBn})`, "");
out.push("Generated from `src/episode/content.ts` and `public/subtitles.srt`. Do not edit by hand.", "");
out.push("## Intro", "", `- ${texts.series}`, `- ${texts.hook}`, `- ${texts.brand}`, `- ${texts.episodeA}`, `- ${texts.episodeB}`, `- ${texts.topicA}`, `- ${texts.topicB}`, "");
out.push("## Sentences", "");
for (const s of sentences) {
  out.push(`### Sentence ${s.number}`, "");
  out.push(`- Arabic (from SRT cue ${s.arabicCue}): ${arabicOf(s.arabicCue)}`);
  s.pronunciations.forEach((p) => out.push(`- ${p.label}: ${p.text}`));
  out.push(`- অর্থ: ${s.meaning}`, "");
}
out.push("## Outro", "", `- ${texts.summaryTitle}`, `- ${texts.summaryLine}`, `- ${texts.ctaA}`, `- ${texts.ctaB} ${E.ctaText}`, `- ${texts.outro}`, "");
writeFileSync(resolve(root, "script.md"), out.join("\n"));
console.log("script.md written");

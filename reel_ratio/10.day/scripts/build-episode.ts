import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseSrt } from "../src/parsers/srtParser";
import { parseScript } from "../src/parsers/scriptParser";
import {
  findAnchor,
  findSentenceMarkers,
  toTimedWords,
  wordStartsWith,
} from "../src/services/timelineService";
import type { EpisodeConfig, EpisodeMeta, Sentence, Stage } from "../src/types";

const dir = resolve(process.argv[2] ?? "episodes/episode-10");
const errors: string[] = [];
const warnings: string[] = [];
const fail = (m: string) => errors.push(m);

const meta = JSON.parse(readFileSync(join(dir, "episode.meta.json"), "utf8")) as EpisodeMeta;
const script = parseScript(readFileSync(join(dir, "script.md"), "utf8"), meta.textNormalizations);
const srt = parseSrt(readFileSync(join(dir, "subtitles.srt"), "utf8"));
errors.push(...script.errors, ...srt.errors);

const words = toTimedWords(srt.cues);
const lastCueEnd = srt.cues[srt.cues.length - 1]?.endSec ?? 0;

// ---- sentence timing (SRT markers + interpolated word times)
const markers = findSentenceMarkers(words);
const sentences: Sentence[] = [];
const starts: number[] = [];
script.sentences.forEach((s, i) => {
  const m = markers.find((x) => x.number === s.number);
  if (!m) {
    fail(`Sentence ${s.number}: no 'Sentence <number>' marker found in SRT`);
    return;
  }
  const nextMarker = markers.find((x) => x.number === (script.sentences[i + 1]?.number ?? -1));
  const limit = nextMarker ? nextMarker.markerIndex : words.length;
  const pronIdx = m.afterIndex;
  let repeatIdx = -1;
  let meaningIdx = -1;
  for (let k = pronIdx + 1; k < limit; k++) {
    const w = words[k]!;
    if (repeatIdx < 0 && wordStartsWith(w, meta.arabicPlaceholder)) repeatIdx = k;
    if (meaningIdx < 0 && wordStartsWith(w, meta.meaningMarker)) meaningIdx = k;
  }
  const startSec = words[m.markerIndex]!.startSec;
  const pronStartSec = words[pronIdx]?.startSec ?? startSec;
  const meaningStartSec = meaningIdx >= 0 ? words[meaningIdx]!.startSec : NaN;
  if (meaningIdx < 0) fail(`Sentence ${s.number}: meaning marker '${meta.meaningMarker}' not found in SRT`);
  let repeatSec = repeatIdx >= 0 && repeatIdx < meaningIdx ? words[repeatIdx]!.startSec : NaN;
  if (Number.isNaN(repeatSec)) {
    warnings.push(`Sentence ${s.number}: second Arabic repetition not located; using midpoint`);
    repeatSec = pronStartSec + (meaningStartSec - pronStartSec) / 2;
  }
  if (!Number.isNaN(repeatSec) && repeatSec - pronStartSec > 0.85 * (meaningStartSec - pronStartSec)) {
    warnings.push(`Sentence ${s.number}: both Arabic repetitions share one SRT cue; repeat time set to midpoint (estimate)`);
    repeatSec = pronStartSec + (meaningStartSec - pronStartSec) / 2;
  }
  const illustration = meta.illustrations[String(s.number)];
  if (!illustration) fail(`Sentence ${s.number}: no illustration mapped in episode.meta.json`);
  starts.push(startSec);
  sentences.push({
    number: s.number,
    pronunciation: s.pronunciation,
    meaning: s.meaning,
    illustration: illustration ?? "",
    startSec,
    pronStartSec,
    repeatSec,
    meaningStartSec,
    endSec: 0,
  });
});

// ---- outro / intro anchors
const lastSentenceMarker = markers.find((m) => m.number === script.sentences[script.sentences.length - 1]?.number);
const outroStartIdx = findAnchor(words, meta.outroStartAnchor, lastSentenceMarker?.afterIndex ?? 0);
if (outroStartIdx < 0) fail(`Outro anchor '${meta.outroStartAnchor}' not found`);
const outroStartSec = outroStartIdx >= 0 ? words[outroStartIdx]!.startSec : lastCueEnd;

sentences.forEach((s, i) => {
  s.endSec = sentences[i + 1]?.startSec ?? outroStartSec;
});

function buildStages(texts: string[], anchors: string[], visuals: string[], from: number, label: string): Stage[] {
  if (texts.length !== anchors.length) {
    fail(`${label}: ${texts.length} script chunks but ${anchors.length} anchors`);
    return [];
  }
  if (visuals.length !== texts.length) fail(`${label}: ${visuals.length} visuals for ${texts.length} stages`);
  const out: Stage[] = [];
  let cursor = from;
  anchors.forEach((a, i) => {
    const idx = findAnchor(words, a, cursor);
    if (idx < 0) {
      fail(`${label}: anchor '${a}' not found after word #${cursor}`);
      return;
    }
    cursor = idx + 1;
    out.push({ text: texts[i] ?? "", startSec: words[idx]!.startSec, visual: visuals[i] ?? "" });
  });
  return out;
}

const thumbIdx = findAnchor(words, meta.thumbnailEndAnchor, 0);
if (thumbIdx < 0) fail(`Thumbnail anchor '${meta.thumbnailEndAnchor}' not found`);
const thumbnailEndSec = thumbIdx >= 0 ? words[thumbIdx]!.startSec : 3;

const introStages = buildStages(script.introChunks, meta.introAnchors, meta.introVisuals, Math.max(thumbIdx, 0), "intro");
if (introStages[0]) introStages[0].startSec = thumbnailEndSec;
const outroStages = buildStages(script.outroLines, meta.outroAnchors, meta.outroVisuals, Math.max(outroStartIdx, 0), "outro");
const introEndSec = sentences[0]?.startSec ?? outroStartSec;
const endSec = lastCueEnd + meta.tailSec;

// ---- validation
sentences.forEach((s, i) => {
  const expected = script.sentences[0]!.number + i;
  if (s.number !== expected) fail(`Sentence order broken at index ${i}: got ${s.number}, expected ${expected}`);
  const chain = [s.startSec, s.pronStartSec, s.repeatSec, s.meaningStartSec, s.endSec];
  for (let k = 1; k < chain.length; k++) {
    if (!(chain[k]! > chain[k - 1]!)) fail(`Sentence ${s.number}: timing not strictly increasing ${JSON.stringify(chain)}`);
  }
  if (s.endSec - s.startSec < 5) warnings.push(`Sentence ${s.number}: scene shorter than 5s`);
});
for (const list of [introStages, outroStages]) {
  for (let i = 1; i < list.length; i++) {
    if (!(list[i]!.startSec > list[i - 1]!.startSec)) fail(`Stage timing not increasing near '${list[i]?.text}'`);
  }
}
if (script.sentences.length !== 10) warnings.push(`Episode has ${script.sentences.length} sentences (expected 10)`);
if (!(thumbnailEndSec < introEndSec && introEndSec < outroStartSec && outroStartSec < endSec)) fail("Scene boundaries are not ordered");

const config: EpisodeConfig = {
  episodeNumber: script.episodeNumber,
  brandName: meta.brandName,
  dialectLabel: meta.dialectLabel,
  seriesTitle: script.seriesTitle,
  totalDays: script.totalDays,
  totalSentences: script.totalSentences,
  completedBefore: script.completedBefore,
  completedSentences: script.completedSentences,
  sentenceStartNumber: script.sentences[0]?.number ?? 0,
  sentenceEndNumber: script.sentences[script.sentences.length - 1]?.number ?? 0,
  hook: script.hook,
  hookHighlight: script.hook.split(" ").slice(-2).join(" "),
  ctaText: script.ctaText,
  nextEpisodeNumber: script.nextEpisodeNumber,
  introStages,
  outroStages,
  sentences,
  timing: { thumbnailEndSec, introEndSec, outroStartSec, endSec },
  warnings,
};

if (errors.length) {
  console.error("BUILD FAILED:\n" + errors.map((e) => " - " + e).join("\n"));
  process.exit(1);
}
writeFileSync(join(dir, "episode.config.json"), JSON.stringify(config, null, 2) + "\n");
console.log(`OK  episode ${config.episodeNumber}: ${sentences.length} sentences, ${endSec.toFixed(2)}s`);
console.log("timing", config.timing);
for (const s of sentences) {
  console.log(
    `  ${s.number}: start ${s.startSec.toFixed(2)} pron ${s.pronStartSec.toFixed(2)} repeat ${s.repeatSec.toFixed(2)} meaning ${s.meaningStartSec.toFixed(2)} end ${s.endSec.toFixed(2)}`,
  );
}
introStages.forEach((s) => console.log(`  intro  ${s.startSec.toFixed(2)} [${s.visual}] ${s.text}`));
outroStages.forEach((s) => console.log(`  outro  ${s.startSec.toFixed(2)} [${s.visual}] ${s.text}`));
if (warnings.length) console.log("WARNINGS:\n" + warnings.map((w) => " - " + w).join("\n"));

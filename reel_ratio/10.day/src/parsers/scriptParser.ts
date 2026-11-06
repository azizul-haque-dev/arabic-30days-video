import { fromBn } from "../lib/bn";

export interface ParsedSentence {
  number: number;
  pronunciation: string;
  meaning: string;
}

export interface ParsedScript {
  hook: string;
  introChunks: string[];
  sentences: ParsedSentence[];
  outroLines: string[];
  episodeNumber: number;
  nextEpisodeNumber: number;
  ctaText: string;
  seriesTitle: string;
  totalDays: number;
  totalSentences: number;
  completedBefore: number;
  completedSentences: number;
  errors: string[];
}

const norm = (s: string): string => s.replace(/\s+/g, " ").trim();

/** Parses the Bengali episode script. Content is never rewritten, only whitespace-normalised. */
export function parseScript(
  raw: string,
  normalizations: { find: string; replace: string }[] = [],
): ParsedScript {
  const errors: string[] = [];
  let text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  for (const n of normalizations) text = text.split(n.find).join(n.replace);
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const isHeader = (l: string) => /^Sentence\s+\d+$/i.test(l);
  const firstSentence = lines.findIndex(isHeader);
  if (firstSentence < 0) errors.push("No 'Sentence N' headers found");

  // Intro region
  const introRegion = norm(lines.slice(0, Math.max(firstSentence, 0)).join(" "));
  const q = introRegion.indexOf("?");
  const hook = q >= 0 ? introRegion.slice(0, q + 1) : introRegion;
  const rest = q >= 0 ? introRegion.slice(q + 1).trim() : "";
  const introChunks = (rest.match(/[^।!?]+[।!?]/g) ?? []).map((c) => c.trim());

  // Sentence blocks
  const sentences: ParsedSentence[] = [];
  let i = Math.max(firstSentence, 0);
  let outroStart = lines.length;
  while (i < lines.length) {
    const header = lines[i] ?? "";
    if (!isHeader(header)) break;
    const number = Number(header.replace(/\D/g, ""));
    const pron: string[] = [];
    let j = i + 1;
    while (j < lines.length && !(lines[j] ?? "").startsWith("অর্থ:")) {
      pron.push(norm(lines[j] ?? ""));
      j++;
    }
    const meaningLine = lines[j];
    if (meaningLine === undefined) {
      errors.push(`Sentence ${number}: missing 'অর্থ:' line`);
      break;
    }
    const unique = Array.from(new Set(pron));
    if (unique.length !== 1) {
      errors.push(`Sentence ${number}: pronunciation lines differ ${JSON.stringify(unique)}`);
    }
    sentences.push({
      number,
      pronunciation: unique[0] ?? "",
      meaning: norm(meaningLine.replace(/^অর্থ:\s*/, "")),
    });
    i = j + 1;
    outroStart = i;
  }
  const outroLines = lines.slice(outroStart).map(norm);

  const joinedOutro = outroLines.join("\n");
  const ep = /DAY\s+(\d+)\s+DONE/i.exec(joinedOutro);
  const next = /Day\s+(\d+)-এ/i.exec(joinedOutro);
  const cta = /লিখুন:\s*(.+)$/m.exec(joinedOutro);
  const total = /([০-৯]+)টি বাক্যের মধ্যে/.exec(joinedOutro);
  const done = /([০-৯]+)টি বাক্য শিখে/.exec(joinedOutro);
  const before = /([০-৯]+)টি শিখেছি/.exec(introRegion);
  const days = /([০-৯]+) দিনের/.exec(introRegion);
  const series = /([০-৯]+ দিনের [A-Za-z ]+?)\s*সিরিজ/.exec(introRegion);
  if (!ep) errors.push("Episode number ('DAY N DONE') not found in outro");
  if (!next) errors.push("Next episode number ('Day N-এ') not found in outro");

  return {
    hook,
    introChunks,
    sentences,
    outroLines,
    episodeNumber: ep ? Number(ep[1]) : 0,
    nextEpisodeNumber: next ? Number(next[1]) : 0,
    ctaText: cta ? (cta[1] ?? "").trim() : "",
    seriesTitle: series ? (series[1] ?? "").trim() : "",
    totalDays: days ? fromBn(days[1]!) : 0,
    totalSentences: total ? fromBn(total[1]!) : 0,
    completedBefore: before ? fromBn(before[1]!) : 0,
    completedSentences: done ? fromBn(done[1]!) : 0,
    errors,
  };
}

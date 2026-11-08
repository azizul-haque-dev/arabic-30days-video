import type { Cue } from "../types";

const TS = /^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})$/;

export const parseTimestamp = (s: string): number | null => {
  const m = TS.exec(s.trim());
  if (!m) return null;
  const [, h, mi, se, ms] = m;
  if (Number(mi) > 59 || Number(se) > 59) return null;
  return ((Number(h) * 60 + Number(mi)) * 60 + Number(se)) * 1000 + Number(ms.padEnd(3, "0"));
};

/** UTF-8 / BOM / CRLF safe, multi-line safe. Throws on malformed timestamps. */
export const parseSrt = (input: string): Cue[] => {
  const text = input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!text) return [];
  const cues: Cue[] = [];
  for (const block of text.split(/\n{2,}/)) {
    const lines = block.split("\n").map((l) => l.trimEnd());
    const idxLine = lines.findIndex((l) => l.includes("-->"));
    if (idxLine < 0) throw new Error(`SRT block without timestamp line: ${JSON.stringify(block.slice(0, 60))}`);
    const index = idxLine > 0 ? Number(lines[idxLine - 1].trim()) : cues.length + 1;
    const [a, b] = lines[idxLine].split("-->").map((x) => x.trim());
    const startMs = parseTimestamp(a);
    const endMs = parseTimestamp(b);
    if (startMs === null || endMs === null) throw new Error(`Invalid timestamp in cue ${index}: "${lines[idxLine]}"`);
    cues.push({ index, startMs, endMs, text: lines.slice(idxLine + 1).join("\n").trim() });
  }
  return cues;
};

export const validateCues = (cues: Cue[], expectedEntries?: number): string[] => {
  const issues: string[] = [];
  if (expectedEntries !== undefined && cues.length !== expectedEntries)
    issues.push(`Expected ${expectedEntries} entries, found ${cues.length}`);
  cues.forEach((c, i) => {
    if (c.index !== i + 1) issues.push(`Cue #${i + 1} has index ${c.index} (missing/out-of-order subtitle)`);
    if (!(c.endMs > c.startMs)) issues.push(`Cue ${c.index}: end <= start`);
    if (!c.text) issues.push(`Cue ${c.index}: empty text`);
    const p = cues[i - 1];
    if (p && c.startMs < p.endMs) issues.push(`Cue ${c.index}: overlaps cue ${p.index}`);
    if (p && c.startMs < p.startMs) issues.push(`Cue ${c.index}: starts before cue ${p.index}`);
  });
  return issues;
};

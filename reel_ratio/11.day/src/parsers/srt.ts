import type { Cue } from "../types/episode";

const TS = /^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})$/;

export const tsToMs = (ts: string): number | null => {
  const m = TS.exec(ts.trim());
  if (!m) return null;
  const [, h, mi, s, ms] = m;
  if (Number(mi) > 59 || Number(s) > 59) return null;
  return Number(h) * 3600000 + Number(mi) * 60000 + Number(s) * 1000 + Number(ms.padEnd(3, "0"));
};

export type SrtResult = { cues: Cue[]; issues: string[] };

/** Robust SRT parser: BOM, CRLF, multiline text, Bengali/UTF-8, invalid timestamps. */
export const parseSrt = (input: string): SrtResult => {
  const issues: string[] = [];
  const text = input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  const blocks = text.split(/\n{2,}/);
  const cues: Cue[] = [];

  blocks.forEach((block, i) => {
    const lines = block.split("\n").map((l) => l.trim());
    if (lines.length < 2) {
      issues.push(`Block ${i + 1}: too short to be a cue`);
      return;
    }
    const idx = Number(lines[0]);
    if (!Number.isInteger(idx)) {
      issues.push(`Block ${i + 1}: invalid cue index "${lines[0]}"`);
      return;
    }
    const [a, b] = lines[1].split("-->").map((s) => s?.trim());
    const startMs = a ? tsToMs(a) : null;
    const endMs = b ? tsToMs(b) : null;
    if (startMs === null || endMs === null) {
      issues.push(`Cue ${idx}: invalid timestamp "${lines[1]}"`);
      return;
    }
    const body = lines.slice(2).filter(Boolean);
    if (body.length === 0) issues.push(`Cue ${idx}: empty subtitle text`);
    cues.push({ index: idx, startMs, endMs, text: body.join(" "), lines: body });
  });

  cues.forEach((c, i) => {
    if (c.endMs <= c.startMs) issues.push(`Cue ${c.index}: end <= start`);
    if (i > 0) {
      const p = cues[i - 1];
      if (c.index !== p.index + 1) issues.push(`Cue ${c.index}: index gap after ${p.index}`);
      if (c.startMs < p.startMs) issues.push(`Cue ${c.index}: out of order`);
      if (c.startMs < p.endMs) issues.push(`Cue ${c.index}: overlaps cue ${p.index}`);
    }
  });

  return { cues, issues };
};

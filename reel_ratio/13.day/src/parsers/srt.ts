export type Cue = { index: number; start: number; end: number; text: string };
export type SrtIssue = { cue: number | null; code: string; message: string };

const TIME_RE = /^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{3})/;

const toSeconds = (h: string, m: string, s: string, ms: string): number =>
  Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;

/**
 * Standard SRT parser: UTF-8 (BOM tolerated), CRLF/LF, multiline cues.
 * Cue order and timestamps are preserved exactly. Nothing is dropped.
 */
export function parseSrt(raw: string): { cues: Cue[]; issues: SrtIssue[] } {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  const blocks = text.split(/\n{2,}/);
  const cues: Cue[] = [];
  const issues: SrtIssue[] = [];

  blocks.forEach((block, blockPos) => {
    const lines = block.split("\n");
    const idxLine = lines[0]?.trim() ?? "";
    const timeLine = lines[1]?.trim() ?? "";
    const m = TIME_RE.exec(timeLine);
    if (!/^\d+$/.test(idxLine) || !m) {
      issues.push({
        cue: /^\d+$/.test(idxLine) ? Number(idxLine) : null,
        code: "INVALID_BLOCK",
        message: `Block #${blockPos + 1} has an invalid index or timestamp line.`,
      });
      return;
    }
    const start = toSeconds(m[1], m[2], m[3], m[4]);
    const end = toSeconds(m[5], m[6], m[7], m[8]);
    const body = lines.slice(2).join("\n");
    cues.push({ index: Number(idxLine), start, end, text: body });
    if (end <= start) {
      issues.push({ cue: Number(idxLine), code: "NON_POSITIVE_DURATION", message: `Cue ${idxLine} ends before it starts.` });
    }
    if (!body.trim()) {
      issues.push({ cue: Number(idxLine), code: "EMPTY_TEXT", message: `Cue ${idxLine} has no text.` });
    }
  });

  cues.forEach((cue, i) => {
    if (cue.index !== i + 1) {
      issues.push({ cue: cue.index, code: "INDEX_SEQUENCE", message: `Expected cue index ${i + 1}, found ${cue.index}.` });
    }
    const prev = cues[i - 1];
    if (prev && cue.start < prev.end - 1e-9) {
      issues.push({ cue: cue.index, code: "OVERLAP", message: `Cue ${cue.index} starts before cue ${prev.index} ends.` });
    }
  });

  return { cues, issues };
}

/** Throws if the SRT has any structural problem; returns the cues otherwise. */
export function parseSrtStrict(raw: string): Cue[] {
  const { cues, issues } = parseSrt(raw);
  if (issues.length > 0) {
    throw new Error("SRT validation failed:\n" + issues.map((i) => `  [${i.code}] ${i.message}`).join("\n"));
  }
  return cues;
}

export const normalizeCueText = (t: string): string => t.replace(/\s+/g, " ").trim();

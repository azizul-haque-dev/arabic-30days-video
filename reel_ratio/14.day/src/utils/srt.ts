export type Cue = { index: number; start: number; end: number; text: string };

const toSec = (h: string, m: string, s: string, ms: string) =>
  Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;

/** Parses an SRT string. Text is kept verbatim (line breaks become single spaces). */
export const parseSrt = (raw: string): Cue[] => {
  const blocks = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const idx = Number(lines[0]?.trim());
    const m = lines[1]?.match(
      /(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)/,
    );
    if (!m || Number.isNaN(idx)) continue;
    cues.push({
      index: idx,
      start: toSec(m[1], m[2], m[3], m[4]),
      end: toSec(m[5], m[6], m[7], m[8]),
      text: lines.slice(2).join(" ").replace(/\s+/g, " ").trim(),
    });
  }
  return cues;
};

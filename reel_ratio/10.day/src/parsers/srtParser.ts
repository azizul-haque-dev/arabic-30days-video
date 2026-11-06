import type { SrtCue } from "../types";

const TS =
  /^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/;

const toSec = (h: string, m: string, s: string, ms: string): number =>
  Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms.padEnd(3, "0")) / 1000;

export interface SrtResult {
  cues: SrtCue[];
  errors: string[];
}

/** Robust SRT parser: BOM, CRLF, multiline cues, UTF-8 Bengali, malformed-entry reporting. */
export function parseSrt(raw: string): SrtResult {
  const errors: string[] = [];
  const cues: SrtCue[] = [];
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!text) return { cues, errors: ["SRT file is empty"] };

  const blocks = text.split(/\n{2,}/);
  blocks.forEach((block, i) => {
    const lines = block.split("\n").map((l) => l.trim());
    const tsLineIdx = lines.findIndex((l) => TS.test(l));
    if (tsLineIdx === -1) {
      errors.push(`Block ${i + 1}: no valid timestamp line`);
      return;
    }
    const m = TS.exec(lines[tsLineIdx] ?? "");
    if (!m) return;
    const startSec = toSec(m[1]!, m[2]!, m[3]!, m[4]!);
    const endSec = toSec(m[5]!, m[6]!, m[7]!, m[8]!);
    const body = lines.slice(tsLineIdx + 1).filter(Boolean).join(" ");
    const index = tsLineIdx > 0 ? Number(lines[0]) : i + 1;
    if (endSec <= startSec) errors.push(`Cue ${index}: end <= start`);
    if (!body) errors.push(`Cue ${index}: empty text`);
    const prev = cues[cues.length - 1];
    if (prev && startSec < prev.startSec) errors.push(`Cue ${index}: out of order`);
    if (prev && startSec < prev.endSec - 0.001) errors.push(`Cue ${index}: overlaps previous cue`);
    cues.push({ index: Number.isFinite(index) ? index : i + 1, startSec, endSec, text: body });
  });
  return { cues, errors };
}

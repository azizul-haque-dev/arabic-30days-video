import { timecodeToMs } from "./time";

export type SrtEntry = { index: number; startMs: number; endMs: number; text: string };

/** Reusable SRT parser. Tolerates BOM, CRLF, "," or "." millisecond separators. */
export const parseSrt = (raw: string): SrtEntry[] => {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!text) return [];
  return text.split(/\n{2,}/).map((block, i) => {
    const lines = block.split("\n");
    let cursor = 0;
    let index = i + 1;
    if (/^\d+$/.test(lines[0].trim())) {
      index = Number(lines[0].trim());
      cursor = 1;
    }
    const timeLine = lines[cursor] ?? "";
    const m = /^(\d{2}:\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[.,]\d{3})/.exec(timeLine.trim());
    if (!m) throw new Error(`SRT block #${index}: cannot parse time line "${timeLine}"`);
    return {
      index,
      startMs: timecodeToMs(m[1]),
      endMs: timecodeToMs(m[2]),
      text: lines.slice(cursor + 1).join("\n").trim(),
    };
  });
};

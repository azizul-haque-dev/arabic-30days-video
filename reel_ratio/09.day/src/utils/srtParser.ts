// Minimal, dependency-free SRT parser (UTF-8, CRLF/LF safe).
export type SrtCue = {
  index: number;
  startMs: number;
  endMs: number;
  startSec: number;
  endSec: number;
  text: string;
};

const TS = /(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/;

export const parseTimestamp = (s: string): number => {
  const m = TS.exec(s.trim());
  if (!m) throw new Error(`Invalid SRT timestamp: "${s}"`);
  const ms = Number(m[4].padEnd(3, "0"));
  return ((Number(m[1]) * 60 + Number(m[2])) * 60 + Number(m[3])) * 1000 + ms;
};

export const parseSrt = (raw: string): SrtCue[] => {
  const blocks = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim().split(/\n{2,}/);
  const cues: SrtCue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const tIdx = lines.findIndex((l) => l.includes("-->"));
    if (tIdx === -1) continue;
    const [a, b] = lines[tIdx].split("-->");
    const startMs = parseTimestamp(a);
    const endMs = parseTimestamp(b);
    const idxLine = tIdx > 0 ? Number(lines[tIdx - 1].trim()) : cues.length + 1;
    cues.push({
      index: Number.isFinite(idxLine) ? idxLine : cues.length + 1,
      startMs,
      endMs,
      startSec: startMs / 1000,
      endSec: endMs / 1000,
      text: lines.slice(tIdx + 1).join("\n").trim(),
    });
  }
  return cues;
};

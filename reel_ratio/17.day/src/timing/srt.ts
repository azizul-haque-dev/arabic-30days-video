import type { Cue } from "./types";

const ts = (s: string): number => {
  const m = /^(\d+):(\d{2}):(\d{2})[,.](\d{1,3})$/.exec(s.trim());
  if (!m) throw new Error(`Invalid SRT timestamp "${s}"`);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, "0")) / 1000;
};

/** Minimal, strict SRT parser. Throws on malformed timestamps. */
export const parseSrt = (raw: string): Cue[] => {
  const blocks = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim().split(/\n{2,}/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const timeLineIdx = lines.findIndex((l) => l.includes("-->"));
    if (timeLineIdx === -1) continue;
    const [a, b] = lines[timeLineIdx].split("-->");
    const startSec = ts(a);
    const endSec = ts(b.trim().split(/\s+/)[0]);
    if (endSec < startSec) throw new Error(`SRT cue ends before it starts: "${lines[timeLineIdx]}"`);
    const text = lines.slice(timeLineIdx + 1).join(" ").replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    cues.push({ index: cues.length, startSec, endSec, text });
  }
  return cues;
};

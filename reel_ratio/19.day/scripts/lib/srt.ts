export interface SrtEntry {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
}

const TS =
  /(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/;

const toMs = (h: string, m: string, s: string, ms: string): number =>
  Number(h) * 3_600_000 + Number(m) * 60_000 + Number(s) * 1000 + Number(ms.padEnd(3, "0"));

export const msToSec = (ms: number): number => ms / 1000;

export function parseSrt(raw: string): { entries: SrtEntry[]; warnings: string[] } {
  const warnings: string[] = [];
  const blocks = raw
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .split(/\n{2,}/);

  const entries: SrtEntry[] = [];
  blocks.forEach((block, blockIdx) => {
    const lines = block.split("\n");
    const tsIdx = lines.findIndex((l) => TS.test(l));
    if (tsIdx === -1) {
      throw new Error(`SRT block #${blockIdx + 1} has no valid timestamp line:\n${block.slice(0, 120)}`);
    }
    const m = TS.exec(lines[tsIdx] ?? "");
    if (!m) throw new Error(`SRT block #${blockIdx + 1}: timestamp parse failed`);
    const startMs = toMs(m[1]!, m[2]!, m[3]!, m[4]!);
    const endMs = toMs(m[5]!, m[6]!, m[7]!, m[8]!);
    const prev = tsIdx > 0 ? (lines[tsIdx - 1] ?? "").trim() : "";
    const index = /^\d+$/.test(prev) ? Number(prev) : entries.length + 1;
    const text = lines.slice(tsIdx + 1).join("\n").trim();
    if (endMs <= startMs) {
      throw new Error(`SRT entry #${index}: end (${endMs}ms) must be after start (${startMs}ms).`);
    }
    if (!text) warnings.push(`SRT entry #${index} has empty text.`);
    entries.push({ index, startMs, endMs, text });
  });

  for (let i = 1; i < entries.length; i++) {
    const a = entries[i - 1]!;
    const b = entries[i]!;
    if (b.startMs < a.startMs) {
      throw new Error(`SRT entry #${b.index} starts before entry #${a.index}. Entries must be in time order.`);
    }
    if (b.startMs < a.endMs - 50) {
      warnings.push(`SRT entries #${a.index} and #${b.index} overlap by ${a.endMs - b.startMs}ms.`);
    }
  }
  return { entries, warnings };
}

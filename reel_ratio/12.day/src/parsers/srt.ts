export interface SrtEntry {
  index: number; startMs: number; endMs: number; startSec: number; endSec: number;
  lines: string[]; text: string;
}
export interface SrtIssue { severity: "error" | "warn" | "info"; entry?: number; message: string }

const TS = /^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*$/;
const toMs = (h: string, m: string, s: string, ms: string) => ((+h * 60 + +m) * 60 + +s) * 1000 + +ms;

/** Text artefacts that sometimes leak into auto-generated subtitles, e.g. "[чуть более двух секунд]". */
export const ARTEFACT = /\[[^\]]*\]/g;

export function normalizeText(s: string): string {
  return s.replace(ARTEFACT, " ").replace(/\s+/g, " ").trim();
}

export function parseSrt(raw: string): { entries: SrtEntry[]; issues: SrtIssue[] } {
  const issues: SrtIssue[] = [];
  const entries: SrtEntry[] = [];
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!text) return { entries, issues: [{ severity: "error", message: "SRT is empty" }] };
  const blocks = text.split(/\n{2,}/);
  let prev: SrtEntry | undefined;
  for (const block of blocks) {
    const lines = block.split("\n");
    const index = Number(lines[0]?.trim());
    if (!Number.isInteger(index)) { issues.push({ severity: "error", message: `Block does not start with an index: "${lines[0]}"` }); continue; }
    const m = TS.exec(lines[1] ?? "");
    if (!m) { issues.push({ severity: "error", entry: index, message: `Invalid timestamp line: "${lines[1]}"` }); continue; }
    const startMs = toMs(m[1], m[2], m[3], m[4]);
    const endMs = toMs(m[5], m[6], m[7], m[8]);
    const body = lines.slice(2);
    const entry: SrtEntry = { index, startMs, endMs, startSec: startMs / 1000, endSec: endMs / 1000, lines: body, text: body.join(" ").replace(/\s+/g, " ").trim() };
    if (endMs <= startMs) issues.push({ severity: "error", entry: index, message: "End time is not after start time" });
    if (!entry.text) issues.push({ severity: "warn", entry: index, message: "Empty subtitle text" });
    if (prev) {
      if (index !== prev.index + 1) issues.push({ severity: "error", entry: index, message: `Index gap/disorder: ${prev.index} -> ${index}` });
      if (startMs < prev.endMs) issues.push({ severity: "error", entry: index, message: `Overlaps previous entry (${prev.index}) by ${prev.endMs - startMs} ms` });
    } else if (index !== 1) issues.push({ severity: "warn", entry: index, message: "First entry index is not 1" });
    if (ARTEFACT.test(entry.text)) issues.push({ severity: "warn", entry: index, message: "Contains bracketed artefact text (ignored for matching, never displayed)" });
    ARTEFACT.lastIndex = 0;
    if (/[\u0400-\u04FF]/.test(entry.text)) issues.push({ severity: "info", entry: index, message: "Contains Cyrillic characters (transcription artefact)" });
    entries.push(entry);
    prev = entry;
  }
  return { entries, issues };
}

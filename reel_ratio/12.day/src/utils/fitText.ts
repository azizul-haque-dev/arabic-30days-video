/** Pure text-fitting maths. The component feeds it a browser measurer; scripts/validate.ts feeds it a font-file measurer. */
export type Measure = (text: string, fontSize: number, weight: number) => number;

export interface FitOptions {
  paragraphs: string[]; maxWidth: number; maxHeight: number;
  maxFont: number; minFont: number; lineHeight: number; paragraphGap?: number;
  weight: number; measure: Measure; step?: number;
}
export interface FitResult {
  fontSize: number; paragraphs: string[][]; lineWidths: number[][];
  width: number; height: number; fits: boolean;
}
const SAFETY = 1.03; // 3% width margin to absorb measurer differences

function greedy(words: string[], limit: number, fs: number, weight: number, m: Measure): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (!cur || m(t, fs, weight) * SAFETY <= limit) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Wrap into the fewest lines, then narrow the limit so the lines come out balanced. */
export function wrap(text: string, maxWidth: number, fs: number, weight: number, m: Measure): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const base = greedy(words, maxWidth, fs, weight, m);
  if (base.length < 2) return base;
  let lo = Math.max(...words.map((w) => m(w, fs, weight) * SAFETY));
  let hi = maxWidth;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (greedy(words, mid, fs, weight, m).length <= base.length) hi = mid; else lo = mid;
  }
  return greedy(words, hi, fs, weight, m);
}

export function fitText(o: FitOptions): FitResult {
  const gap = o.paragraphGap ?? 0;
  const step = o.step ?? 2;
  let last: FitResult | undefined;
  for (let fs = o.maxFont; fs >= o.minFont; fs -= step) {
    const paragraphs = o.paragraphs.map((p) => wrap(p, o.maxWidth, fs, o.weight, o.measure));
    const lineWidths = paragraphs.map((ls) => ls.map((l) => o.measure(l, fs, o.weight)));
    const lineCount = paragraphs.reduce((a, p) => a + p.length, 0);
    const width = Math.max(0, ...lineWidths.flat());
    const height = lineCount * fs * o.lineHeight + gap * (paragraphs.length - 1);
    last = { fontSize: fs, paragraphs, lineWidths, width, height, fits: width * SAFETY <= o.maxWidth && height <= o.maxHeight };
    if (last.fits) return last;
  }
  return last!;
}

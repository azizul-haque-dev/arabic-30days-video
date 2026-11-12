import { measureText } from "@remotion/layout-utils";

export interface FitInput {
  text: string;
  fontFamily: string;
  fontWeight: number;
  maxWidth: number;
  maxFont: number;
  minFont: number;
  /** Single line is preferred while the font stays >= this size. */
  singleLineMinFont?: number;
  /** Cap used only when the text has to wrap to two lines (keeps two-line blocks inside their slot). */
  twoLineMaxFont?: number;
  maxLines: 1 | 2;
  lineHeight: number; // ratio
  step?: number;
}

export interface FitResult {
  fontSize: number;
  lines: string[];
  lineHeightPx: number;
  blockHeight: number;
  widest: number;
}

const cache = new Map<string, FitResult>();

const width = (text: string, fontFamily: string, fontWeight: number, fontSize: number) =>
  measureText({ text, fontFamily, fontWeight, fontSize }).width;

/**
 * Measures real glyph widths (fonts are loaded before render) and returns the largest font size
 * that fits the container. Text that cannot fit even at `minFont` throws, so overflow is a
 * loud error instead of a silent overlap.
 */
export function fitText(input: FitInput): FitResult {
  const key = JSON.stringify(input);
  const hit = cache.get(key);
  if (hit) return hit;

  const { text, fontFamily, fontWeight, maxWidth, maxFont, minFont, maxLines, lineHeight } = input;
  const step = input.step ?? 2;
  const singleMin = input.singleLineMinFont ?? minFont;

  const done = (fontSize: number, lines: string[]): FitResult => {
    const res: FitResult = {
      fontSize,
      lines,
      lineHeightPx: Math.round(fontSize * lineHeight),
      blockHeight: Math.round(fontSize * lineHeight) * lines.length,
      widest: Math.max(...lines.map((l) => width(l, fontFamily, fontWeight, fontSize))),
    };
    cache.set(key, res);
    return res;
  };

  for (let size = maxFont; size >= singleMin; size -= step) {
    if (width(text, fontFamily, fontWeight, size) <= maxWidth) return done(size, [text]);
  }

  if (maxLines === 2) {
    const words = text.split(/\s+/);
    if (words.length >= 2) {
      for (let size = Math.min(maxFont, input.twoLineMaxFont ?? maxFont); size >= minFont; size -= step) {
        let best: { lines: string[]; w: number } | null = null;
        for (let i = 1; i < words.length; i++) {
          const a = words.slice(0, i).join(" ");
          const b = words.slice(i).join(" ");
          const w = Math.max(width(a, fontFamily, fontWeight, size), width(b, fontFamily, fontWeight, size));
          if (!best || w < best.w) best = { lines: [a, b], w };
        }
        if (best && best.w <= maxWidth) return done(size, best.lines);
      }
    }
  }

  if (width(text, fontFamily, fontWeight, minFont) <= maxWidth) return done(minFont, [text]);
  throw new Error(`Text does not fit: "${text}" (needs > ${maxWidth}px at ${minFont}px, maxLines=${maxLines}). Shorten it or adjust the layout.`);
}

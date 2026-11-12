import { useMemo } from "react";
import { measureText } from "@remotion/layout-utils";

export type FitOptions = {
  fontFamily: string;
  fontWeight: number;
  maxWidth: number;
  maxHeight: number;
  maxSize: number;
  minSize: number;
  maxLines?: number;
  lineHeight?: number;
  rtl?: boolean;
  letterSpacing?: string;
};

export type Fitted = { fontSize: number; lines: string[] };

const widthOf = (text: string, o: FitOptions, size: number) =>
  measureText({
    text,
    fontFamily: o.fontFamily,
    fontWeight: o.fontWeight,
    fontSize: size,
    letterSpacing: o.letterSpacing,
  }).width;

/**
 * Dynamic text measurement: finds the largest font-size (≤ maxSize) where the text fits
 * inside maxWidth × maxHeight using the fewest, best-balanced lines (no awkward orphans).
 * If nothing fits it falls back to minSize (callers pick minSize so this never happens
 * for the Day 20 copy — checked in QA stills).
 */
export const fitText = (text: string, o: FitOptions): Fitted => {
  const lh = o.lineHeight ?? 1.3;
  const maxLines = o.maxLines ?? 2;
  const words = text.split(/\s+/).filter(Boolean);

  for (let size = o.maxSize; size >= o.minSize; size -= 2) {
    const cache = new Map<string, number>();
    const w = (t: string) => {
      let v = cache.get(t);
      if (v === undefined) cache.set(t, (v = widthOf(t, o, size)));
      return v;
    };
    const wrap = (limit: number): string[] => {
      const lines: string[] = [];
      let cur = "";
      for (const word of words) {
        const next = cur ? cur + " " + word : word;
        if (!cur || w(next) <= limit) cur = next;
        else {
          lines.push(cur);
          cur = word;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };
    const first = wrap(o.maxWidth);
    const n = first.length;
    if (n > maxLines || n * size * lh > o.maxHeight) continue;
    if (first.some((l) => w(l) > o.maxWidth)) continue; // a single word is too wide
    if (n === 1) return { fontSize: size, lines: first };
    // balance: narrowest width that still wraps into n lines
    let lo = 0;
    let hi = o.maxWidth;
    for (let it = 0; it < 12; it++) {
      const mid = (lo + hi) / 2;
      if (wrap(mid).length <= n) hi = mid;
      else lo = mid;
    }
    return { fontSize: size, lines: wrap(hi) };
  }
  return { fontSize: o.minSize, lines: [text] };
};

export const useFittedText = (text: string, o: FitOptions): Fitted =>
  useMemo(
    () => fitText(text, o),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, o.fontFamily, o.fontWeight, o.maxWidth, o.maxHeight, o.maxSize, o.minSize, o.maxLines, o.lineHeight],
  );

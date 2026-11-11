import { measureText } from "@remotion/layout-utils";

export type FitInput = {
  words: string[];
  fontFamily: string;
  fontWeight: number;
  maxWidth: number;
  maxHeight: number;
  maxFont: number;
  minFont: number;
  lineHeight: number;
  gapEm: number;
};

export type FitResult = { fontSize: number; lines: number; height: number };

const cache = new Map<string, number>();

const widthOf = (word: string, fontFamily: string, fontWeight: number, fontSize: number): number => {
  const key = `${word}|${fontFamily}|${fontWeight}|${fontSize}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const w = measureText({ text: word, fontFamily, fontWeight, fontSize, validateFontIsLoaded: true }).width * 1.02;
  cache.set(key, w);
  return w;
};

/**
 * Picks the LARGEST font size (<= maxFont) for which the wrapped text fits
 * the box. Never shrinks below minFont: if it cannot fit, it throws so the
 * problem is caught instead of silently overlapping or clipping.
 */
export function fitWords(input: FitInput): FitResult {
  const { words, fontFamily, fontWeight, maxWidth, maxHeight, maxFont, minFont, lineHeight, gapEm } = input;
  for (let fs = maxFont; fs >= minFont; fs -= 2) {
    const gap = fs * gapEm;
    const widths = words.map((w) => widthOf(w, fontFamily, fontWeight, fs));
    if (Math.max(...widths) > maxWidth) continue;
    let lines = 1;
    let cur = 0;
    for (const w of widths) {
      const next = cur === 0 ? w : cur + gap + w;
      if (next <= maxWidth || cur === 0) {
        cur = next;
      } else {
        lines += 1;
        cur = w;
      }
    }
    const height = lines * fs * lineHeight;
    if (height <= maxHeight) return { fontSize: fs, lines, height };
  }
  throw new Error(
    `Text does not fit its slot at the minimum font size (${minFont}px): "${words.join(" ")}" in ${maxWidth}x${maxHeight}.`,
  );
}

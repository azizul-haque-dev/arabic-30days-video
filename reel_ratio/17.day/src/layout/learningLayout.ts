import { measureText } from "@remotion/layout-utils";
import { splitUnits, splitWords } from "../lib/format";
import { theme } from "../theme";

/**
 * Dynamic text layout for the "learning section" of a sentence scene.
 * Font sizes and line breaks are CALCULATED from the real (loaded) fonts, never hard-coded.
 * Hierarchy rule enforced here: Bengali pronunciation (large) > Bengali meaning (medium) > Arabic (smaller).
 */

export interface UnitLayout {
  pronLines: string[][]; // words per line
  arabicLines: string[];
  pronHeight: number;
  arabicHeight: number;
}

export interface LearningLayout {
  pronSize: number;
  arabicSize: number;
  meaningSize: number;
  pronLineHeight: number;
  arabicLineHeight: number;
  meaningLineHeight: number;
  units: UnitLayout[];
  meaningLines: string[];
  innerGap: number;
  unitGap: number;
  meaningGap: number;
  height: number;
}

const BN = { family: theme.fonts.bengali, weight: 700 };
const AR = { family: theme.fonts.arabic, weight: 700 };
const MN = { family: theme.fonts.bengali, weight: 500 };

const cache = new Map<string, number>();
const width = (text: string, f: { family: string; weight: number }, size: number): number => {
  const k = `${f.family}|${f.weight}|${size}|${text}`;
  let w = cache.get(k);
  if (w === undefined) {
    w = measureText({ text, fontFamily: f.family, fontWeight: f.weight, fontSize: size, validateFontIsLoaded: true }).width;
    cache.set(k, w);
  }
  return w;
};

/** Greedy wrap that never splits a word; returns null if a single word is wider than maxW. */
const wrap = (words: string[], f: { family: string; weight: number }, size: number, maxW: number): string[][] | null => {
  const lines: string[][] = [];
  let cur: string[] = [];
  for (const w of words) {
    if (width(w, f, size) > maxW) return null;
    const trial = [...cur, w].join(" ");
    if (cur.length && width(trial, f, size) > maxW) {
      lines.push(cur);
      cur = [w];
    } else cur.push(w);
  }
  if (cur.length) lines.push(cur);
  return lines;
};

/** Balance a 2-line wrap so the second line is not a lone short word. */
const balance = (lines: string[][], f: { family: string; weight: number }, size: number, maxW: number): string[][] => {
  if (lines.length !== 2) return lines;
  const all = lines.flat();
  let best = lines;
  let bestDiff = Infinity;
  for (let i = 1; i < all.length; i++) {
    const a = all.slice(0, i);
    const b = all.slice(i);
    const wa = width(a.join(" "), f, size);
    const wb = width(b.join(" "), f, size);
    if (wa > maxW || wb > maxW) continue;
    const d = Math.abs(wa - wb);
    if (d < bestDiff) {
      bestDiff = d;
      best = [a, b];
    }
  }
  return best;
};

export interface LearningInput {
  pronunciation: string;
  arabic: string;
  meaning: string;
}

export const computeLearningLayout = (input: LearningInput, maxW: number, maxH: number): LearningLayout => {
  const pUnits = splitUnits(input.pronunciation);
  const aUnits = splitUnits(input.arabic);
  if (pUnits.length !== aUnits.length) {
    throw new Error(`Pronunciation/Arabic unit mismatch: ${pUnits.length} vs ${aUnits.length} for "${input.pronunciation}"`);
  }
  for (let size = 112; size >= 44; size -= 2) {
    const pronSize = size;
    const arabicSize = Math.round(size * 0.52);
    const meaningSize = Math.round(size * 0.58);
    const pronLH = Math.round(pronSize * 1.28);
    const arabicLH = Math.round(arabicSize * 1.6);
    const meaningLH = Math.round(meaningSize * 1.4);
    const innerGap = Math.round(size * 0.04);
    const unitGap = Math.round(size * 0.26);
    const meaningGap = Math.round(size * 0.42);

    let ok = true;
    const units: UnitLayout[] = [];
    for (let i = 0; i < pUnits.length; i++) {
      const pl = wrap(splitWords(pUnits[i]), BN, pronSize, maxW);
      const al = wrap(splitWords(aUnits[i]), AR, arabicSize, maxW);
      if (!pl || !al || pl.length > 2 || al.length > 2) {
        ok = false;
        break;
      }
      const pb = balance(pl, BN, pronSize, maxW);
      units.push({
        pronLines: pb,
        arabicLines: al.map((l) => l.join(" ")),
        pronHeight: pb.length * pronLH,
        arabicHeight: al.length * arabicLH,
      });
    }
    if (!ok) continue;
    const ml = wrap(splitWords(input.meaning), MN, meaningSize, maxW);
    if (!ml || ml.length > 2) continue;
    const meaningLines = balance(ml, MN, meaningSize, maxW).map((l) => l.join(" "));
    const height =
      units.reduce((a, u) => a + u.pronHeight + innerGap + u.arabicHeight, 0) +
      unitGap * (units.length - 1) +
      meaningGap +
      meaningLines.length * meaningLH;
    if (height <= maxH) {
      if (!(arabicSize < pronSize)) throw new Error("Hierarchy violated: Arabic must be smaller than Bengali pronunciation");
      return {
        pronSize,
        arabicSize,
        meaningSize,
        pronLineHeight: pronLH,
        arabicLineHeight: arabicLH,
        meaningLineHeight: meaningLH,
        units,
        meaningLines,
        innerGap,
        unitGap,
        meaningGap,
        height,
      };
    }
  }
  throw new Error(`Cannot fit "${input.pronunciation}" inside ${maxW}x${maxH}px even at the minimum font size.`);
};

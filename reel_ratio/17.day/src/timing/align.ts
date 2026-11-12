import type { BeatSpec, Cue } from "./types";

const BN_TO_ASCII: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

export const normalizeForMatch = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[০-৯]/g, (d) => BN_TO_ASCII[d])
    .replace(/[\s\u200b-\u200d.,…—–\-:;!?।'"“”‘’()[\]]/g, "");

const bigrams = (s: string): Map<string, number> => {
  const chars = Array.from(s);
  const m = new Map<string, number>();
  for (let i = 0; i < chars.length - 1; i++) {
    const k = chars[i] + chars[i + 1];
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
};

export const dice = (a: string, b: string): number => {
  if (!a || !b) return 0;
  const A = bigrams(a);
  const B = bigrams(b);
  let inter = 0;
  let sa = 0;
  let sb = 0;
  A.forEach((v) => (sa += v));
  B.forEach((v) => (sb += v));
  A.forEach((v, k) => {
    inter += Math.min(v, B.get(k) ?? 0);
  });
  return sa + sb === 0 ? 0 : (2 * inter) / (sa + sb);
};

export interface SrtMatch {
  startSec: number;
  endSec: number;
  score: number;
}

/**
 * Sequentially match narration beats to SRT cues (monotonic, windows of up to 6 consecutive cues).
 * Beats that cannot be matched with confidence (score < threshold) return null.
 */
export const alignBeatsToCues = (specs: BeatSpec[], cues: Cue[], threshold = 0.5): (SrtMatch | null)[] => {
  const out: (SrtMatch | null)[] = [];
  let p = 0;
  const normCues = cues.map((c) => normalizeForMatch(c.text));
  for (const spec of specs) {
    const target = normalizeForMatch(spec.narration);
    let best: { s: number; q: number; score: number } | null = null;
    for (let s = p; s < Math.min(p + 3, cues.length); s++) {
      let acc = "";
      for (let q = s; q < Math.min(s + 6, cues.length); q++) {
        acc += normCues[q];
        const score = dice(acc, target);
        if (!best || score > best.score + 1e-9) best = { s, q, score };
      }
    }
    if (best && best.score >= threshold) {
      out.push({ startSec: cues[best.s].startSec, endSec: cues[best.q].endSec, score: best.score });
      p = best.q + 1;
    } else {
      out.push(null);
    }
  }
  return out;
};

// Pure layout engine (no Remotion imports) — shared by components AND scripts/validate-layout.ts
export const W = 1080;
export const H = 1920;
export const MARGIN = 70; // minimum horizontal safe margin
export const CONTENT_W = W - MARGIN * 2; // 940
export const SAFE_TOP = 150;
export const SAFE_BOTTOM = H - 150;

export type Script = "bn" | "ar" | "en";
export type Rect = { x: number; y: number; w: number; h: number };

export const LINE_HEIGHT: Record<Script, number> = { bn: 1.5, ar: 1.75, en: 1.2 };

const BN_SPACING_SIGNS = /[\u09BE\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0983]/;
const BN_ZERO = /[\u0981\u09BC\u09C1-\u09C4\u09CD\u09D7\u200C\u200D]/;
const AR_ZERO = /[\u064B-\u065F\u0670]/;

/** Conservative per-character advance estimate (em). Calibrated with safety margin (see scripts/measure-fonts.ts). */
export const estimateWidth = (text: string, size: number, script: Script, widthFactor = 1): number => {
  let em = 0;
  for (const ch of text) {
    if (ch === " ") em += script === "ar" ? 0.28 : 0.32;
    else if (script === "bn") {
      if (BN_ZERO.test(ch)) em += 0;
      else if (BN_SPACING_SIGNS.test(ch)) em += 0.36;
      else if (/[\u0980-\u09FF]/.test(ch)) em += 0.7;
      else if (/[-?!.,]/.test(ch)) em += 0.4;
      else em += 0.64;
    } else if (script === "ar") {
      if (AR_ZERO.test(ch)) em += 0;
      else if (/[\u0600-\u06FF]/.test(ch)) em += 0.6;
      else em += 0.5;
    } else em += /[A-Z0-9]/.test(ch) ? 0.68 : 0.6;
  }
  return em * size * widthFactor;
};

export const wrapLines = (text: string, size: number, maxWidth: number, script: Script): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && estimateWidth(next, size, script) > maxWidth) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};

export type FitResult = {
  size: number;
  lines: string[];
  lineHeightPx: number;
  height: number;
  maxLineWidth: number;
  fits: boolean;
  script: Script;
};

/** Re-split a 2-line wrap at the word boundary that minimises the widest line (no lonely last word). */
const balanceTwoLines = (lines: string[], size: number, script: Script): string[] => {
  if (lines.length !== 2) return lines;
  const words = lines.join(" ").split(" ");
  let best = lines;
  let bestW = Math.max(...lines.map((l) => estimateWidth(l, size, script)));
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const w = Math.max(estimateWidth(a, size, script), estimateWidth(b, size, script));
    if (w < bestW) { bestW = w; best = [a, b]; }
  }
  return best;
};

export const fitText = (o: {
  text: string;
  script: Script;
  maxWidth: number;
  maxLines: number;
  maxSize: number;
  minSize: number;
  step?: number;
  /** Prefer ONE line as long as the font stays >= this size (otherwise fall back to maxLines). */
  singleLineMin?: number;
}): FitResult => {
  const step = o.step ?? 2;
  if (o.singleLineMin !== undefined && o.maxLines > 1) {
    const one = fitText({ ...o, maxLines: 1, minSize: o.singleLineMin, singleLineMin: undefined });
    if (one.fits) return one;
  }
  let best: FitResult | null = null;
  for (let size = o.maxSize; size >= o.minSize; size -= step) {
    const lines = balanceTwoLines(wrapLines(o.text, size, o.maxWidth, o.script), size, o.script);
    const maxLineWidth = Math.max(...lines.map((l) => estimateWidth(l, size, o.script)));
    const lineHeightPx = Math.round(size * LINE_HEIGHT[o.script]);
    const res: FitResult = {
      size,
      lines,
      lineHeightPx,
      height: lines.length * lineHeightPx,
      maxLineWidth,
      fits: lines.length <= o.maxLines && maxLineWidth <= o.maxWidth,
      script: o.script,
    };
    if (res.fits) return res;
    best = res;
  }
  return best!;
};

/** Vertical regions of a sentence-learning scene (all inside the 9:16 safe area). */
export const SENTENCE_REGIONS = {
  label: { x: MARGIN, y: 240, w: CONTENT_W, h: 64 },
  illustration: { x: MARGIN, y: 324, w: CONTENT_W, h: 540 },
  pron: { x: MARGIN, y: 896, w: CONTENT_W, h: 340 },
  repeat: { x: MARGIN, y: 1244, w: CONTENT_W, h: 48 },
  arabic: { x: MARGIN, y: 1308, w: CONTENT_W, h: 132 },
  meaning: { x: MARGIN, y: 1464, w: CONTENT_W, h: 176 },
} as const satisfies Record<string, Rect>;

export type SentenceTextLayout = { pron: FitResult; arabic: FitResult; meaning: FitResult; usage?: FitResult };

export const layoutSentenceText = (s: { pron: string; arabic: string; meaning: string; usage?: string }): SentenceTextLayout => {
  const R = SENTENCE_REGIONS;
  const pron = fitText({ text: s.pron, script: "bn", maxWidth: R.pron.w, maxLines: 2, maxSize: 104, minSize: 76, singleLineMin: 88 });
  const arabic = fitText({
    text: s.arabic,
    script: "ar",
    maxWidth: R.arabic.w,
    maxLines: 1,
    maxSize: Math.min(62, Math.floor(pron.size * 0.6)),
    minSize: 44,
  });
  const meaning = fitText({ text: s.meaning, script: "bn", maxWidth: R.meaning.w, maxLines: 2, maxSize: 56, minSize: 44 });
  const usage = s.usage
    ? fitText({ text: s.usage, script: "bn", maxWidth: R.meaning.w, maxLines: 2, maxSize: 52, minSize: 42 })
    : undefined;
  return { pron, arabic, meaning, usage };
};

export const rectsOverlap = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Zones (all inside 150–1770, margins 70): logo 190–290 · title 300–490 · subtitle 500–680 · bn 700–844 · cards 880–1260 / 1300–1680 */
export const THUMB_ZONES = {
  logo: { y: 190, h: 100 }, day: { y: 300, h: 190 }, title: { y: 500, h: 180 }, bn: { y: 700, h: 144 },
  cardA: { y: 880, h: 380 }, cardB: { y: 1300, h: 380 },
} as const;


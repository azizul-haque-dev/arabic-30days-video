/**
 * Pure layout engine (no React, no DOM). Used by the composition (with a real
 * browser text measurer) and by scripts/validate-layout.ts (with an estimator).
 * Every element gets an explicit rectangle inside a reserved region, so text,
 * illustration and header can never be placed on top of each other.
 */
import type { Unit } from "../types";

export type Rect = { x: number; y: number; w: number; h: number };
export type FontKind = "bn" | "ar" | "en";
export type Measurer = (text: string, font: FontKind, size: number, weight: number) => number;

export const CANVAS = { w: 1080, h: 1920 };
export const MARGIN = 70;

/** Reserved regions for the sentence layout (9:16). Bottom 270px stays empty on purpose. */
export const REGIONS = {
  header: { x: MARGIN, y: 150, w: CANVAS.w - MARGIN * 2, h: 100 },
  illustration: { x: MARGIN, y: 280, w: CANVAS.w - MARGIN * 2, h: 640 },
  learn: { x: MARGIN, y: 950, w: CANVAS.w - MARGIN * 2, h: 700 },
} as const;

export const CARD_PAD = 38;
export const BN_WEIGHT = 700;
export const AR_WEIGHT = 600;
export const MEANING_WEIGHT = 600;

export class LayoutError extends Error {}

export const intersects = (a: Rect, b: Rect, tol = 0.5) =>
  a.x < b.x + b.w - tol && b.x < a.x + a.w - tol && a.y < b.y + b.h - tol && b.y < a.y + a.h - tol;

export const inside = (inner: Rect, outer: Rect, tol = 0.5) =>
  inner.x >= outer.x - tol && inner.y >= outer.y - tol && inner.x + inner.w <= outer.x + outer.w + tol && inner.y + inner.h <= outer.y + outer.h + tol;

export type UnitBox = {
  unit: Unit;
  line: number;
  bn: Rect;
  ar: Rect;
  box: Rect;
};

export type SentenceLayout = {
  card: Rect;
  bnSize: number;
  arSize: number;
  meaningSize: number;
  pron: UnitBox[];
  pronBlock: Rect;
  chip: Rect;
  meaningText: Rect;
  meaningBlock: Rect;
  meaningLines: string[];
};

const BN_LH = 1.3;
const AR_LH = 1.5;
const AR_RATIO = 0.5; // Arabic always visibly smaller than the Bengali pronunciation
const UNIT_GAP_Y = 10;
const ROW_GAP = 48;
const MEANING_LH = 1.35;
const CHIP_H = 44;
const CHIP_W = 124;
const BLOCK_GAP = 34;

const wrapWords = (text: string, size: number, maxW: number, measure: Measurer): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next, "bn", size, MEANING_WEIGHT) > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};

export function layoutSentence(units: Unit[], meaning: string, measure: Measurer): SentenceLayout {
  const card = REGIONS.learn;
  const innerW = card.w - CARD_PAD * 2;
  const innerH = card.h - CARD_PAD * 2;
  const innerX = card.x + CARD_PAD;
  const innerY = card.y + CARD_PAD;

  // --- meaning block (fixed at the bottom of the card) ---
  let meaningSize = 0;
  let meaningLines: string[] = [];
  for (let s = 56; s >= 38; s -= 2) {
    const lines = wrapWords(meaning, s, innerW, measure);
    if (lines.length <= 2 && lines.every((l) => measure(l, "bn", s, MEANING_WEIGHT) <= innerW)) {
      meaningSize = s;
      meaningLines = lines;
      break;
    }
  }
  if (!meaningSize) throw new LayoutError(`Meaning does not fit in the card: "${meaning}"`);
  const meaningTextH = Math.ceil(meaningLines.length * meaningSize * MEANING_LH);
  const meaningBlockH = CHIP_H + 12 + meaningTextH;
  const meaningBlock: Rect = { x: innerX, y: innerY + innerH - meaningBlockH, w: innerW, h: meaningBlockH };
  const chip: Rect = { x: innerX + (innerW - CHIP_W) / 2, y: meaningBlock.y, w: CHIP_W, h: CHIP_H };
  const meaningW = Math.max(...meaningLines.map((l) => measure(l, "bn", meaningSize, MEANING_WEIGHT)));
  const meaningText: Rect = {
    x: innerX + (innerW - Math.ceil(meaningW)) / 2,
    y: chip.y + CHIP_H + 12,
    w: Math.ceil(meaningW),
    h: meaningTextH,
  };

  // --- pronunciation block: biggest size that fits in <=2 rows ---
  const pronMaxH = innerH - meaningBlockH - BLOCK_GAP;
  for (let bnSize = 116; bnSize >= 48; bnSize -= 2) {
    const arSize = Math.max(26, Math.round(bnSize * AR_RATIO));
    const gapX = Math.max(30, Math.round(bnSize * 0.4));
    const widths = units.map((u) => Math.ceil(Math.max(measure(u.bn, "bn", bnSize, BN_WEIGHT), measure(u.ar, "ar", arSize, AR_WEIGHT))) + 6);
    if (widths.some((w) => w > innerW)) continue;

    const rows: number[][] = [[]];
    let rowW = 0;
    widths.forEach((w, i) => {
      const add = rows[rows.length - 1].length ? gapX + w : w;
      if (rows[rows.length - 1].length && rowW + add > innerW) {
        rows.push([i]);
        rowW = w;
      } else {
        rows[rows.length - 1].push(i);
        rowW += add;
      }
    });
    if (rows.length > 2) continue;

    const bnH = Math.ceil(bnSize * BN_LH);
    const arH = Math.ceil(arSize * AR_LH);
    const rowH = bnH + UNIT_GAP_Y + arH;
    const blockH = rows.length * rowH + (rows.length - 1) * ROW_GAP;
    if (blockH > pronMaxH) continue;

    const blockY = innerY + (pronMaxH - blockH) / 2;
    const pron: UnitBox[] = [];
    rows.forEach((row, r) => {
      const total = row.reduce((s, i) => s + widths[i], 0) + gapX * (row.length - 1);
      let x = innerX + (innerW - total) / 2;
      const y = blockY + r * (rowH + ROW_GAP);
      row.forEach((i) => {
        const w = widths[i];
        const bw = Math.ceil(measure(units[i].bn, "bn", bnSize, BN_WEIGHT));
        const aw = Math.ceil(measure(units[i].ar, "ar", arSize, AR_WEIGHT));
        pron[i] = {
          unit: units[i],
          line: r,
          bn: { x: x + (w - bw) / 2, y, w: bw, h: bnH },
          ar: { x: x + (w - aw) / 2, y: y + bnH + UNIT_GAP_Y, w: aw, h: arH },
          box: { x, y, w, h: rowH },
        };
        x += w + gapX;
      });
    });
    const pronBlock: Rect = { x: innerX, y: blockY, w: innerW, h: blockH };
    return { card, bnSize, arSize, meaningSize, pron, pronBlock, chip, meaningText, meaningBlock, meaningLines };
  }
  throw new LayoutError(`Pronunciation does not fit (even at the minimum size): ${units.map((u) => u.bn).join(" | ")}`);
}

/** Static checks over the whole sentence layout (regions, edges, overlaps). Returns problems. */
export function checkSentenceLayout(l: SentenceLayout, label: string): string[] {
  const problems: string[] = [];
  const screen: Rect = { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h };
  const safe: Rect = { x: MARGIN, y: 0, w: CANVAS.w - MARGIN * 2, h: CANVAS.h };

  const named: [string, Rect][] = [
    ...l.pron.flatMap((p, i): [string, Rect][] => [
      [`unit${i}.bn`, p.bn],
      [`unit${i}.ar`, p.ar],
    ]),
    ["chip", l.chip],
    ["meaning", l.meaningText],
  ];
  for (const [n, r] of named) {
    if (!inside(r, l.card)) problems.push(`${label}: ${n} leaves the learning card`);
    if (!inside(r, safe)) problems.push(`${label}: ${n} violates the ${MARGIN}px safe margin`);
    if (!inside(r, screen)) problems.push(`${label}: ${n} is clipped by the screen edge`);
  }
  for (let i = 0; i < named.length; i++)
    for (let j = i + 1; j < named.length; j++)
      if (intersects(named[i][1], named[j][1])) problems.push(`${label}: ${named[i][0]} overlaps ${named[j][0]}`);

  const regions = Object.entries(REGIONS);
  for (let i = 0; i < regions.length; i++) {
    if (!inside(regions[i][1], screen)) problems.push(`${label}: region ${regions[i][0]} outside screen`);
    for (let j = i + 1; j < regions.length; j++)
      if (intersects(regions[i][1], regions[j][1])) problems.push(`${label}: region ${regions[i][0]} overlaps ${regions[j][0]}`);
  }
  if (l.card.y + l.card.h > CANVAS.h - 220) problems.push(`${label}: learning card intrudes into the bottom safe space`);
  return problems;
}

/** Header chrome (inside REGIONS.header) */
export const HEADER = {
  logo: { x: MARGIN, y: 165, w: 380, h: 70 } as Rect,
  day: { x: 500, y: 170, w: 170, h: 60 } as Rect,
  sentence: { x: CANVAS.w - MARGIN - 200 - 16, y: 165, w: 200, h: 70 } as Rect,
};

export function checkHeader(): string[] {
  const p: string[] = [];
  const items = Object.entries(HEADER);
  for (const [n, r] of items) if (!inside(r, REGIONS.header)) p.push(`header.${n} leaves the header region`);
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++) if (intersects(items[i][1], items[j][1])) p.push(`header.${items[i][0]} overlaps header.${items[j][0]}`);
  if (intersects(REGIONS.header, REGIONS.illustration)) p.push("header region overlaps illustration region");
  return p;
}

/** Largest single-line font size (<= maxSize) that fits in maxW. */
export function fitSingleLine(
  text: string,
  font: FontKind,
  weight: number,
  maxSize: number,
  minSize: number,
  maxW: number,
  measure: Measurer,
): { size: number; w: number; h: number } {
  for (let s = maxSize; s >= minSize; s -= 2) {
    const w = Math.ceil(measure(text, font, s, weight));
    if (w <= maxW) return { size: s, w: w + 4, h: Math.ceil(s * 1.34) };
  }
  throw new LayoutError(`Text does not fit on one line even at ${minSize}px: "${text}"`);
}

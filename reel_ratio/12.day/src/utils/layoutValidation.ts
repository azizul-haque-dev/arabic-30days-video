import type { Rect } from "../types";

/**
 * Reusable layout validation for any episode.
 * Elements are described by their static rectangle plus the extra extent they can reach while animating
 * (motion). Zones that clip (overflow hidden) cannot leak, so their animated extent is the clip rect.
 */
export type ElementKind = "text" | "illustration" | "ui" | "decor";
export interface LayoutElement {
  id: string; kind: ElementKind; rect: Rect;
  /** Zone the element must stay inside (text zones, panels). */
  within?: Rect;
  /** Maximum displacement / scale during entrance, breathing and exit animations. */
  motion?: { dx?: number; dy?: number; scale?: number };
  /** Rectangle that clips the element (overflow hidden). */
  clip?: Rect;
  /** Ids of text elements that live ON this ui panel on purpose (badge, pill, chip). */
  contains?: string[];
}
export interface LayoutIssue { severity: "error" | "warn"; scene: string; rule: string; message: string }

export const right = (r: Rect) => r.x + r.w;
export const bottom = (r: Rect) => r.y + r.h;
export const intersection = (a: Rect, b: Rect): Rect | null => {
  const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y);
  const w = Math.min(right(a), right(b)) - x, h = Math.min(bottom(a), bottom(b)) - y;
  return w > 0 && h > 0 ? { x, y, w, h } : null;
};
/** True when the rectangles overlap or are closer than `gap` px. */
export const near = (a: Rect, b: Rect, gap = 0): boolean =>
  a.x < right(b) + gap && right(a) + gap > b.x && a.y < bottom(b) + gap && bottom(a) + gap > b.y;
export const contains = (outer: Rect, inner: Rect, tol = 0.5): boolean =>
  inner.x >= outer.x - tol && inner.y >= outer.y - tol && right(inner) <= right(outer) + tol && bottom(inner) <= bottom(outer) + tol;

/** Rectangle reachable by an element at any frame (static rect grown by its motion, then clipped). */
export function reachable(e: LayoutElement): Rect {
  const m = e.motion ?? {};
  const s = m.scale ?? 1;
  const gx = (e.rect.w * (s - 1)) / 2 + Math.abs(m.dx ?? 0);
  const gy = (e.rect.h * (s - 1)) / 2 + Math.abs(m.dy ?? 0);
  const grown = { x: e.rect.x - gx, y: e.rect.y - gy, w: e.rect.w + 2 * gx, h: e.rect.h + 2 * gy };
  return e.clip ? (intersection(grown, e.clip) ?? { x: e.rect.x, y: e.rect.y, w: 0, h: 0 }) : grown;
}

export interface ValidateOptions { canvas: { w: number; h: number }; safe: Rect; minGap: number }

export function validateScene(scene: string, els: LayoutElement[], o: ValidateOptions): LayoutIssue[] {
  const out: LayoutIssue[] = [];
  const err = (rule: string, message: string) => out.push({ severity: "error", scene, rule, message });
  const warn = (rule: string, message: string) => out.push({ severity: "warn", scene, rule, message });
  const texts = els.filter((e) => e.kind === "text");
  const art = els.filter((e) => e.kind === "illustration" || e.kind === "decor");
  const ui = els.filter((e) => e.kind === "ui");
  const reach = new Map(els.map((e) => [e.id, reachable(e)]));

  for (const t of texts) {
    const r = reach.get(t.id)!;
    if (!contains(o.safe, t.rect)) err("safe-area", `${t.id} (${fmt(t.rect)}) leaves the safe area ${fmt(o.safe)}`);
    if (!contains(o.safe, r)) err("safe-area-motion", `${t.id} can animate outside the safe area`);
    if (t.within && !contains(t.within, t.rect)) err("text-in-zone", `${t.id} (${fmt(t.rect)}) is larger than its zone ${fmt(t.within)} - text would be cropped`);
    if (t.rect.x < 70 - 0.5 || right(t.rect) > o.canvas.w - 70 + 0.5) err("margin", `${t.id} violates the 70px side margin`);
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (near(reach.get(a.id)!, reach.get(b.id)!, 0)) err("text-text", `${a.id} overlaps ${b.id} during animation`);
    else if (near(a.within ?? a.rect, b.within ?? b.rect, o.minGap - 1)) err("text-spacing", `${a.id} and ${b.id} zones are closer than ${o.minGap}px`);
  }
  for (const t of texts) {
    for (const a of art) if (near(reach.get(t.id)!, reach.get(a.id)!, 0)) err("text-illustration", `${t.id} overlaps ${a.id}`);
    for (const a of art) if (!near(reach.get(t.id)!, reach.get(a.id)!, 0) && near(t.within ?? t.rect, reach.get(a.id)!, 0)) warn("zone-illustration", `${t.id} zone touches ${a.id}`);
    for (const u of ui) {
      if (u.contains?.includes(t.id)) { if (!contains(u.rect, t.rect)) err("text-in-panel", `${t.id} sticks out of its panel ${u.id}`); continue; }
      if (near(reach.get(t.id)!, reach.get(u.id)!, 0)) err("text-ui", `${t.id} overlaps ${u.id}`);
    }
  }
  for (const a of art) {
    const r = reach.get(a.id)!;
    if (a.within && !contains(a.within, a.rect)) err("illustration-in-zone", `${a.id} (${fmt(a.rect)}) leaves its illustration zone ${fmt(a.within)}`);
    if (!contains({ x: 0, y: 0, w: o.canvas.w, h: o.canvas.h }, r)) warn("canvas", `${a.id} extends beyond the canvas`);
  }
  return out;
}
const fmt = (r: Rect) => `x${Math.round(r.x)} y${Math.round(r.y)} ${Math.round(r.w)}x${Math.round(r.h)}`;

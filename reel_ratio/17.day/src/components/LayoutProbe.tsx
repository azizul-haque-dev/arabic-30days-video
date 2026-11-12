import React, { useLayoutEffect, useRef } from "react";
import { getRemotionEnvironment, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/**
 * Programmatic zero-overlap validation.
 *
 * Every element that matters carries data-lbox="<id>" and data-lkind="text|chrome|art|art-content".
 * On every frame (so every animation keyframe is covered) the probe measures the REAL rendered
 * boxes in the browser (text via Range, SVG art via the union of its visible geometry) and checks:
 *   1. no two visible boxes overlap (minimum gap = theme.layout.gap px)
 *   2. every box is inside the scene's safe rectangle and inside the canvas
 *   3. animated art content stays inside its reserved art box
 * Violations are logged as "[LAYOUT_VIOLATION] ..." and, while rendering, abort the render
 * (unless inputProps.layoutMode === "collect", which scripts/validate-layout.ts uses to gather all of them).
 */

export interface SafeRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface Box {
  id: string;
  kind: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const GEOM = "path,rect,circle,ellipse,line,polygon,polyline,text,image";

const effectiveOpacity = (el: Element, stopAt: Element): number => {
  let o = 1;
  let cur: Element | null = el;
  while (cur && cur !== stopAt.parentElement) {
    const cs = getComputedStyle(cur);
    o *= Number(cs.opacity);
    if (cs.visibility === "hidden" || cs.display === "none") return 0;
    if (cur === stopAt) break;
    cur = cur.parentElement;
  }
  return o;
};

export const measureBoxes = (root: HTMLElement): Box[] => {
  const rr = root.getBoundingClientRect();
  const scale = root.offsetWidth > 0 ? rr.width / root.offsetWidth : 1;
  const toBox = (id: string, kind: string, r: { left: number; top: number; right: number; bottom: number }): Box => ({
    id,
    kind,
    x0: (r.left - rr.left) / scale,
    y0: (r.top - rr.top) / scale,
    x1: (r.right - rr.left) / scale,
    y1: (r.bottom - rr.top) / scale,
  });
  const boxes: Box[] = [];
  root.querySelectorAll<HTMLElement | SVGElement>("[data-lbox]").forEach((el) => {
    const id = el.getAttribute("data-lbox")!;
    const kind = el.getAttribute("data-lkind") ?? "text";
    if (effectiveOpacity(el, root) < 0.05) return;
    if (kind === "art-content") {
      let u: { left: number; top: number; right: number; bottom: number } | null = null;
      el.querySelectorAll(GEOM).forEach((g) => {
        if (g.closest("[data-lignore]")) return;
        if (effectiveOpacity(g, root) < 0.05) return;
        const r = g.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        u = u
          ? { left: Math.min(u.left, r.left), top: Math.min(u.top, r.top), right: Math.max(u.right, r.right), bottom: Math.max(u.bottom, r.bottom) }
          : { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      });
      if (u) boxes.push(toBox(id, kind, u));
      return;
    }
    if (kind === "text") {
      // x-extent = real text width (Range); y-extent = the element's own line slot
      // (every text element has an explicit height = its line-height, so slots tile exactly).
      const range = document.createRange();
      range.selectNodeContents(el);
      const tr = range.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (tr.width > 0 && er.height > 0) boxes.push(toBox(id, kind, { left: tr.left, right: tr.right, top: er.top, bottom: er.bottom }));
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) boxes.push(toBox(id, kind, r));
  });
  return boxes;
};

export const findViolations = (boxes: Box[], safe: SafeRect, canvas: { w: number; h: number }, gap = theme.layout.gap): string[] => {
  const v: string[] = [];
  const TOL = 1.5;
  const fmt = (b: Box) => `${b.id}[${b.x0.toFixed(0)},${b.y0.toFixed(0)} → ${b.x1.toFixed(0)},${b.y1.toFixed(0)}]`;
  for (const b of boxes) {
    if (b.x0 < -TOL || b.y0 < -TOL || b.x1 > canvas.w + TOL || b.y1 > canvas.h + TOL) v.push(`SCREEN-EDGE: ${fmt(b)} leaves the 1080x1920 canvas`);
    else if (b.kind !== "art-content" && (b.x0 < safe.x0 - TOL || b.x1 > safe.x1 + TOL || b.y0 < safe.y0 - TOL || b.y1 > safe.y1 + TOL))
      v.push(`SAFE-AREA: ${fmt(b)} is outside safe area [${safe.x0},${safe.y0} → ${safe.x1},${safe.y1}]`);
  }
  const art = boxes.filter((b) => b.kind === "art");
  const content = boxes.filter((b) => b.kind === "art-content");
  for (const c of content) {
    const host = art[0];
    if (!host) continue;
    if (c.x0 < host.x0 - 4 || c.y0 < host.y0 - 4 || c.x1 > host.x1 + 4 || c.y1 > host.y1 + 4)
      v.push(`ART-ESCAPE: ${fmt(c)} leaves its reserved box ${fmt(host)}`);
  }
  const solid = boxes.filter((b) => b.kind !== "art-content");
  for (let i = 0; i < solid.length; i++) {
    for (let j = i + 1; j < solid.length; j++) {
      const a = solid[i];
      const b = solid[j];
      const overlapX = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
      const overlapY = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
      if (overlapX > 0.5 - gap && overlapY > 0.5 - gap) v.push(`OVERLAP: ${fmt(a)} vs ${fmt(b)}${gap > 0 ? ` (gap < ${gap}px)` : ""}`);
    }
  }
  return v;
};

export const LayoutProbe: React.FC<{
  label: string;
  safe: SafeRect;
  mode: "throw" | "collect";
  /** Skip enforcement (still logs) - used for intentional transition frames. */
  disabled?: boolean;
}> = ({ label, safe, mode, disabled }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);
  const env = getRemotionEnvironment();

  useLayoutEffect(() => {
    if (disabled) return;
    const root = ref.current?.closest<HTMLElement>("[data-lroot]");
    if (!root) return;
    const boxes = measureBoxes(root);
    const violations = findViolations(boxes, safe, { w: width, h: height });
    if (violations.length === 0) return;
    const msg = `[LAYOUT_VIOLATION] ${label} @frame ${frame}: ${violations.join(" || ")}`;
    console.error(msg);
    if (mode === "throw" && env.isRendering) throw new Error(msg);
  });

  // Marker only; the probe itself draws nothing.
  return <div ref={ref} data-lignore="true" style={{ display: "none" }} />;
};

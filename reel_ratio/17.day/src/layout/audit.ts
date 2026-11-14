import { useLayoutEffect, type RefObject } from "react";
import { CANVAS, MARGIN, REGIONS, inside, intersects, type Rect } from "./engine";

/**
 * Runtime DOM audit — runs on every rendered frame (render + Studio).
 * Elements opt in with  data-box="<name>"  (+ data-kind="text|art|chrome").
 * Throws (render fails / Studio error overlay) when two visible boxes collide,
 * when a box leaves the 1080x1920 frame, or breaks the horizontal safe margin.
 * Bounding boxes include the CURRENT animation transforms, so every frame is a keyframe check.
 */
/** reserved region + 24px of entrance travel (the 30px gap to the learning card is never entered) */
const R = REGIONS.illustration;
const ENTRANCE_REGION: Rect = { x: R.x - 24, y: R.y - 24, w: R.w + 48, h: R.h + 48 };

const effectiveOpacity = (el: Element, root: Element): number => {
  let o = 1;
  let cur: Element | null = el;
  while (cur) {
    o *= parseFloat(getComputedStyle(cur).opacity || "1");
    if (cur === root) break;
    cur = cur.parentElement;
  }
  return o;
};

export const useLayoutAudit = (rootRef: RefObject<HTMLElement | null>, label: string) => {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const canvas = root.getBoundingClientRect();
    if (canvas.width === 0) return;
    const k = canvas.width / CANVAS.w;
    const boxes: { name: string; kind: string; region?: string; rect: Rect }[] = [];
    root.querySelectorAll<HTMLElement>("[data-box]").forEach((el) => {
      if (effectiveOpacity(el, root) < 0.06) return;
      const r = el.getBoundingClientRect();
      boxes.push({
        name: el.dataset.box!,
        kind: el.dataset.kind ?? "text",
        region: el.dataset.region,
        rect: { x: (r.left - canvas.left) / k, y: (r.top - canvas.top) / k, w: r.width / k, h: r.height / k },
      });
    });

    const problems: string[] = [];
    const screen: Rect = { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h };
    const safe: Rect = { x: MARGIN, y: 0, w: CANVAS.w - MARGIN * 2, h: CANVAS.h };
    for (const b of boxes) {
      if (!inside(b.rect, screen, 1.5)) problems.push(`"${b.name}" is clipped by the screen edge`);
      if (b.kind !== "bg" && !inside(b.rect, safe, 1.5)) problems.push(`"${b.name}" breaks the ${MARGIN}px safe margin`);
      if (b.region === "illustration" && !inside(b.rect, ENTRANCE_REGION, 1.5)) problems.push(`illustration leaves its reserved region (${[b.rect.x, b.rect.y, b.rect.w, b.rect.h].map(Math.round).join(",")})`);
    }
    const leaves = boxes.filter((b) => b.kind !== "bg" && b.kind !== "container");
    for (let i = 0; i < leaves.length; i++)
      for (let j = i + 1; j < leaves.length; j++)
        if (intersects(leaves[i].rect, leaves[j].rect, 1.5)) problems.push(`"${leaves[i].name}" overlaps "${leaves[j].name}"`);

    if (problems.length) {
      throw new Error(`[layout audit] ${label}: ${problems.join("; ")}`);
    }
  });
};

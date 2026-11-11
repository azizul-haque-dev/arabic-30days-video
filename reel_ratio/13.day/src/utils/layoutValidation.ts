/**
 * Reusable, dependency-free layout validation.
 * Used (1) at build time on the static slot maps and (2) by the browser QA
 * harness on real DOM boxes for every frame. Zero overlap is a QA gate.
 */
export type Box = { x: number; y: number; w: number; h: number };
export type ItemKind = "text" | "illustration" | "badge" | "shape";

export type LayoutItem = {
  id: string;
  kind: ItemKind;
  box: Box;
  /** slot the item must stay inside (optional) */
  slot?: Box;
  slotId?: string;
  /** effective opacity (0..1); nearly transparent items are ignored */
  opacity: number;
};

export type SafeArea = { left: number; right: number; top: number; bottom: number };
export type CanvasSize = { width: number; height: number };

export type LayoutIssue = {
  code: "OVERLAP" | "OUTSIDE_SLOT" | "OUTSIDE_SAFE_AREA" | "SLOT_OVERLAP" | "SLOT_OUTSIDE_CANVAS" | "TOO_CLOSE";
  message: string;
  ids: string[];
};

export const MIN_VISIBLE_OPACITY = 0.04;
const EPS = 0.5;

export const intersects = (a: Box, b: Box, gap = 0): boolean =>
  a.x < b.x + b.w + gap - EPS &&
  b.x < a.x + a.w + gap - EPS &&
  a.y < b.y + b.h + gap - EPS &&
  b.y < a.y + a.h + gap - EPS;

export const overlapsStrictly = (a: Box, b: Box): boolean => intersects(a, b, 0);

export const contains = (outer: Box, inner: Box, tol = EPS): boolean =>
  inner.x >= outer.x - tol &&
  inner.y >= outer.y - tol &&
  inner.x + inner.w <= outer.x + outer.w + tol &&
  inner.y + inner.h <= outer.y + outer.h + tol;

export const safeBox = (canvas: CanvasSize, safe: SafeArea): Box => ({
  x: safe.left,
  y: safe.top,
  w: canvas.width - safe.left - safe.right,
  h: canvas.height - safe.top - safe.bottom,
});

export const unionBox = (boxes: Box[]): Box | null => {
  if (boxes.length === 0) return null;
  const x1 = Math.min(...boxes.map((b) => b.x));
  const y1 = Math.min(...boxes.map((b) => b.y));
  const x2 = Math.max(...boxes.map((b) => b.x + b.w));
  const y2 = Math.max(...boxes.map((b) => b.y + b.h));
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
};

/** Static check of a slot map: inside safe area and pairwise separated by minGap. */
export function validateSlots(
  slots: Record<string, Box>,
  canvas: CanvasSize,
  safe: SafeArea,
  minGap: number,
): LayoutIssue[] {
  const issues: LayoutIssue[] = [];
  const safeArea = safeBox(canvas, safe);
  const entries = Object.entries(slots);
  for (const [id, box] of entries) {
    if (box.x < 0 || box.y < 0 || box.x + box.w > canvas.width || box.y + box.h > canvas.height) {
      issues.push({ code: "SLOT_OUTSIDE_CANVAS", message: `Slot "${id}" leaves the canvas.`, ids: [id] });
    } else if (!contains(safeArea, box)) {
      issues.push({ code: "OUTSIDE_SAFE_AREA", message: `Slot "${id}" is outside the safe area.`, ids: [id] });
    }
  }
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [ia, a] = entries[i];
      const [ib, b] = entries[j];
      if (overlapsStrictly(a, b)) {
        issues.push({ code: "SLOT_OVERLAP", message: `Slots "${ia}" and "${ib}" overlap.`, ids: [ia, ib] });
      } else if (intersects(a, b, minGap)) {
        issues.push({ code: "TOO_CLOSE", message: `Slots "${ia}" and "${ib}" are closer than ${minGap}px.`, ids: [ia, ib] });
      }
    }
  }
  return issues;
}

/** Per-frame check of the real, visible boxes. */
export function validateFrame(
  items: LayoutItem[],
  canvas: CanvasSize,
  safe: SafeArea,
  minGap: number,
): LayoutIssue[] {
  const issues: LayoutIssue[] = [];
  const safeArea = safeBox(canvas, safe);
  const visible = items.filter((i) => i.opacity >= MIN_VISIBLE_OPACITY);

  for (const it of visible) {
    if (it.slot && !contains(it.slot, it.box)) {
      issues.push({
        code: "OUTSIDE_SLOT",
        message: `"${it.id}" leaves its slot "${it.slotId}" (box ${fmt(it.box)} vs slot ${fmt(it.slot)}).`,
        ids: [it.id],
      });
    }
    if (!contains(safeArea, it.box)) {
      issues.push({ code: "OUTSIDE_SAFE_AREA", message: `"${it.id}" is outside the safe area (${fmt(it.box)}).`, ids: [it.id] });
    }
  }

  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      const a = visible[i];
      const b = visible[j];
      if (overlapsStrictly(a.box, b.box)) {
        issues.push({ code: "OVERLAP", message: `"${a.id}" overlaps "${b.id}".`, ids: [a.id, b.id] });
      } else if (intersects(a.box, b.box, minGap)) {
        issues.push({ code: "TOO_CLOSE", message: `"${a.id}" is closer than ${minGap}px to "${b.id}".`, ids: [a.id, b.id] });
      }
    }
  }
  return issues;
}

const fmt = (b: Box): string => `[${b.x.toFixed(0)},${b.y.toFixed(0)} ${b.w.toFixed(0)}x${b.h.toFixed(0)}]`;

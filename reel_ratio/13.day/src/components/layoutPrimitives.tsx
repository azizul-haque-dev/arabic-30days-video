import React from "react";
import { Rect } from "../config/layout";

/** A reserved, fixed region of the canvas. Nothing else may be placed inside it. */
export const Slot: React.FC<{
  id: string;
  rect: Rect;
  children?: React.ReactNode;
  align?: "center" | "flex-start" | "flex-end";
  justify?: "center" | "flex-start" | "flex-end";
}> = ({ id, rect, children, align = "center", justify = "center" }) => (
  <div
    data-slot={id}
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      display: "flex",
      alignItems: align,
      justifyContent: justify,
    }}
  >
    {children}
  </div>
);

export type LvKind = "text" | "illustration" | "badge" | "shape";

/** Marks an element as a measurable layout item (picked up by the QA harness). */
export const Lv: React.FC<{
  id: string;
  kind: LvKind;
  slotId: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ id, kind, slotId, style, children }) => (
  <div data-lv={id} data-lv-kind={kind} data-lv-slot={slotId} style={style}>
    {children}
  </div>
);

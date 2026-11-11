import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Rect, SLOT_PAD_X, SLOT_PAD_Y } from "../config/layout";
import { useReveal } from "../animation/motion";
import { Lv, Slot } from "../components/layoutPrimitives";

/**
 * Shows an SVG illustration inside a slot. The wrapper is one measurable
 * item (kind "illustration"); text may never enter its box.
 */
export const Illustration: React.FC<{
  id: string;
  slotId: string;
  rect: Rect;
  viewW: number;
  viewH: number;
  delay?: number;
  instant?: boolean;
  render: (t: number) => React.ReactNode;
}> = ({ id, slotId, rect, viewW, viewH, delay = 0, instant, render }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = useReveal(delay, { instant, preset: "smooth" });
  const maxW = rect.w - 2 * SLOT_PAD_X;
  const maxH = rect.h - 2 * SLOT_PAD_Y;
  const k = Math.min(maxW / viewW, maxH / viewH);
  const w = Math.floor(viewW * k);
  const h = Math.floor(viewH * k);
  return (
    <Slot id={slotId} rect={rect}>
      <Lv id={id} kind="illustration" slotId={slotId} style={{ width: w, height: h, ...style }}>
        <svg width={w} height={h} viewBox={`0 0 ${viewW} ${viewH}`} style={{ display: "block", overflow: "hidden", borderRadius: 28 }}>
          {render(frame / fps)}
        </svg>
      </Lv>
    </Slot>
  );
};

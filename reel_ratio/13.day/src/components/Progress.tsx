import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Rect, SLOT_PAD_X } from "../config/layout";
import { theme, FONT_WEIGHTS } from "../config/theme";
import { formatPercent } from "../utils/bn";
import { useReveal, easeInOut } from "../animation/motion";
import { Lv, Slot } from "./layoutPrimitives";

/**
 * Counter + bar + percentage, all driven by props (no episode values inside).
 * Three separately measured items stacked vertically with fixed gaps.
 */
export const ProgressBlock: React.FC<{
  slotId: string;
  rect: Rect;
  from: number;
  to: number;
  total: number;
  /** percentage shown at the end of the animation (config value, not recomputed) */
  toPercent: number;
  fromPercent: number;
  delay: number;
  animateFrames?: number;
}> = ({ slotId, rect, from, to, total, toPercent, fromPercent, delay, animateFrames = 40 }) => {
  const frame = useCurrentFrame();
  const style = useReveal(delay);
  const k = easeInOut((frame - delay - 8) / animateFrames);
  const count = Math.round(from + (to - from) * k);
  const pct = fromPercent + (toPercent - fromPercent) * k;
  const innerW = rect.w - 2 * SLOT_PAD_X;
  const barH = 40;
  const numH = 120;
  const pctH = 72;
  const gap = 24;
  const innerH = numH + gap + barH + gap + pctH;

  return (
    <Slot id={slotId} rect={rect}>
      <div style={{ width: innerW, height: innerH, display: "flex", flexDirection: "column", gap, ...style }}>
        <Lv id={`${slotId}-count`} kind="text" slotId={slotId} style={{ height: numH }}>
          <div
            style={{
              height: numH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.en,
              fontWeight: FONT_WEIGHTS.en,
              fontSize: 104,
              lineHeight: 1.1,
              color: theme.colors.primaryDark,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {count} / {total}
          </div>
        </Lv>
        <Lv id={`${slotId}-bar`} kind="shape" slotId={slotId} style={{ height: barH }}>
          <div style={{ height: barH, borderRadius: 999, background: theme.colors.line, overflow: "hidden" }}>
            <div
              style={{
                width: `${interpolate(pct, [0, 100], [0, 100])}%`,
                height: "100%",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              }}
            />
          </div>
        </Lv>
        <Lv id={`${slotId}-pct`} kind="text" slotId={slotId} style={{ height: pctH }}>
          <div
            style={{
              height: pctH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.en,
              fontWeight: FONT_WEIGHTS.en,
              fontSize: 56,
              color: theme.colors.text,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatPercent(pct)}%
          </div>
        </Lv>
      </div>
    </Slot>
  );
};

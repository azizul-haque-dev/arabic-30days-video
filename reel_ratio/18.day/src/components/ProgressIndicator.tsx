import React from "react";
import { theme } from "../theme";
import { prog } from "../lib/anim";
import { MARGIN, CONTENT_W } from "../lib/layout";

/** Horizontal progress bar (eased fill). `value` 0–100. Final label is always exact. */
export const ProgressBar: React.FC<{
  frame: number; delay: number; value: number; dur?: number; height?: number; width?: number;
}> = ({ frame, delay, value, dur = 40, height = 44, width = CONTENT_W }) => {
  const p = prog(frame, delay, dur, theme.ease.inOut);
  return (
    <div style={{ width, height, borderRadius: height, background: theme.colors.white, boxShadow: `inset 0 0 0 3px ${theme.colors.line}`, overflow: "hidden" }}>
      <div style={{ width: `${(value / 100) * p * 100}%`, height: "100%", borderRadius: height, background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})` }} />
    </div>
  );
};

export { MARGIN };

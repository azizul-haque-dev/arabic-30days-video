import React from "react";
import { theme } from "../theme";
import { entrance } from "../lib/anim";
import type { FitResult } from "../lib/layout";

/** Bengali meaning (medium size). Also reused for the "usage" line of sentence 175. */
export const MeaningText: React.FC<{
  fit: FitResult; frame: number; fps: number; delay: number; opacityMul?: number; color?: string;
}> = ({ fit, frame, fps, delay, opacityMul = 1, color = theme.colors.text }) => {
  const e = entrance(frame, fps, delay, { y: 16, scale: 0.97 });
  return (
    <div style={{ textAlign: "center", opacity: e.opacity * opacityMul, transform: e.transform }}>
      {fit.lines.map((line, i) => (
        <div
          key={i}
          style={{
            height: fit.lineHeightPx, lineHeight: `${fit.lineHeightPx}px`, whiteSpace: "nowrap",
            fontFamily: theme.fonts.bn, fontWeight: 500, fontSize: fit.size, color,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

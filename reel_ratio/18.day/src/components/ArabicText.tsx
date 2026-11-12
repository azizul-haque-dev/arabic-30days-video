import React from "react";
import { theme } from "../theme";
import { entrance } from "../lib/anim";
import type { FitResult } from "../lib/layout";

/** Secondary element — smaller than the Bengali pronunciation. RTL, explicit lines. */
export const ArabicText: React.FC<{ fit: FitResult; frame: number; fps: number; delay: number }> = ({ fit, frame, fps, delay }) => (
  <div dir="rtl" style={{ textAlign: "center", ...entrance(frame, fps, delay, { y: 10, scale: 0.96 }) }}>
    {fit.lines.map((line, i) => (
      <div
        key={i}
        style={{
          height: fit.lineHeightPx, lineHeight: `${fit.lineHeightPx}px`, whiteSpace: "nowrap",
          fontFamily: theme.fonts.ar, fontWeight: 600, fontSize: fit.size, color: theme.colors.textDim,
          unicodeBidi: "isolate",
        }}
      >
        {line}
      </div>
    ))}
  </div>
);

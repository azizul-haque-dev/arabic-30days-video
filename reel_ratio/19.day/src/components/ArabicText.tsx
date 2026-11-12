import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import type { FitResult } from "../lib/fit";

/** Arabic script: secondary line, RTL, smaller than the Bengali pronunciation. */
export const ArabicText: React.FC<{ fit: FitResult; appearF: number }> = ({ fit, appearF }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, appearF, springs.smooth);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          direction: "rtl",
          unicodeBidi: "isolate",
          textAlign: "center",
          fontFamily: fonts.arabic,
          fontWeight: 500,
          fontSize: fit.fontSize,
          lineHeight: `${fit.lineHeightPx}px`,
          color: colors.amberDark,
          whiteSpace: "nowrap",
        }}
      >
        {fit.lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};

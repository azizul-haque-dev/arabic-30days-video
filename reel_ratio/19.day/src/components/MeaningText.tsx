import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, ease, fonts, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import type { FitResult } from "../lib/fit";
import type { LocalSpan } from "./PronunciationText";

/** Bengali meaning: supporting line. Revealed when the meaning is spoken, never competes with the pronunciation. */
export const MeaningText: React.FC<{ fit: FitResult; spans: LocalSpan[] }> = ({ fit, spans }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const first = spans[0]?.startF ?? 0;
  const p = enter(frame, fps, first, springs.smooth);
  const a = spans.reduce(
    (m, s) =>
      Math.max(
        m,
        interpolate(frame, [s.startF, s.startF + 5, Math.max(s.startF + 6, s.endF - 2), s.endF + 6], [0, 1, 1, 0], {
          easing: ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    0,
  );
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
      }}
    >
      {fit.lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: fonts.bengali,
            fontWeight: 600,
            fontSize: fit.fontSize,
            lineHeight: `${fit.lineHeightPx}px`,
            whiteSpace: "nowrap",
            color: interpolateColors(a, [0, 1], [colors.textDim, colors.text]),
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

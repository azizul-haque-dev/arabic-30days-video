import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, ease, fonts, springs } from "../design/tokens";
import { bump, clamp01, enter } from "../lib/anim";
import type { FitResult } from "../lib/fit";

export interface LocalSpan {
  startF: number;
  endF: number;
}

/**
 * Bengali pronunciation: the visual focus of every sentence scene.
 * - enters at the first pronunciation SRT entry
 * - highlights while ANY pronunciation entry is being spoken, with a time-accurate progress sweep
 * - repeats get a subtle second emphasis pulse (the layout is never torn down)
 */
export const PronunciationText: React.FC<{ fit: FitResult; spans: LocalSpan[] }> = ({ fit, spans }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const first = spans[0]?.startF ?? 0;
  const p = enter(frame, fps, first, springs.smooth);

  const a = spans.reduce(
    (m, s) =>
      Math.max(
        m,
        interpolate(frame, [s.startF, s.startF + 5, Math.max(s.startF + 6, s.endF - 2), s.endF + 5], [0, 1, 1, 0], {
          easing: ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    0,
  );
  const pulse = spans.slice(1).reduce((m, s) => Math.max(m, bump(frame, s.startF, 14)), 0);
  const active = spans.find((s) => frame >= s.startF && frame < s.endF);
  const sweep = active ? ease.sweep(clamp01((frame - active.startF) / Math.max(1, active.endF - active.startF))) : 0;

  const color = interpolateColors(a, [0, 1], [colors.dark, colors.primary]);
  const scale = interpolate(p, [0, 1], [0.94, 1]) * (1 + 0.04 * pulse);

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
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${scale})`,
      }}
    >
      {fit.lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: fonts.bengali,
            fontWeight: 700,
            fontSize: fit.fontSize,
            lineHeight: `${fit.lineHeightPx}px`,
            whiteSpace: "nowrap",
            color,
            textShadow: `0 0 ${Math.round(30 * a)}px rgba(22,163,74,${(0.35 * a).toFixed(3)})`,
          }}
        >
          {line}
        </div>
      ))}
      <div
        style={{
          marginTop: 10,
          height: 8,
          width: Math.min(fit.widest, 800),
          borderRadius: 4,
          background: "rgba(245,158,11,0.2)",
          opacity: a,
          overflow: "hidden",
        }}
      >
        <div style={{ height: "100%", width: `${sweep * 100}%`, background: colors.amber, borderRadius: 4 }} />
      </div>
    </div>
  );
};

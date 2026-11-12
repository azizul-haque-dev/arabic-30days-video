import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, ease, fonts, shadow } from "../design/tokens";

/** Animates the course progress, e.g. 180 / 300 -> 190 / 300 and 60% -> 63.33%. */
export const EpisodeProgress: React.FC<{
  from: number;
  to: number;
  total: number;
  fromPercent: number;
  toPercent: number;
  startFrame: number;
  durationFrames?: number;
  width?: number;
}> = ({ from, to, total, fromPercent, toPercent, startFrame, durationFrames = 54, width = 860 }) => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const q = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    easing: ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const count = Math.round(from + (to - from) * q);
  const pct = fromPercent + (toPercent - fromPercent) * q;
  const fill = ((from + (to - from) * q) / total) * 100;
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        padding: "34px 40px 38px",
        borderRadius: 40,
        background: colors.white,
        border: `2px solid ${colors.border}`,
        boxShadow: shadow.soft,
        fontFamily: fonts.latin,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.12em", color: colors.textDim }}>SENTENCES</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: colors.primary, fontVariantNumeric: "tabular-nums" }}>{pct.toFixed(2)}%</div>
      </div>
      <div style={{ marginTop: 6, fontSize: 96, fontWeight: 700, color: colors.dark, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
        {count}
        <span style={{ fontSize: 56, color: colors.textDim, fontWeight: 600 }}> / {total}</span>
      </div>
      <div style={{ marginTop: 18, height: 20, borderRadius: 10, background: colors.soft, overflow: "hidden" }}>
        <div style={{ width: `${fill}%`, height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${colors.primary}, ${colors.amber})` }} />
      </div>
    </div>
  );
};

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const c = theme.colors;

/** Count + bar. Counts `from → to` of `total` between startSec and startSec+durSec. */
export const ProgressIndicator: React.FC<{
  from: number;
  to: number;
  total: number;
  startSec?: number;
  durSec?: number;
  countStyle?: React.CSSProperties;
  barStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}> = ({ from, to, total, startSec = 0.3, durSec = 1.4, countStyle, barStyle, labelStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [startSec * fps, (startSec + durSec) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.easing.out,
  });
  const value = from + (to - from) * p;
  const pct = (value / total) * 100;
  const shown = Math.round(value);
  return (
    <>
      <div
        data-box="progress-count"
        style={{
          width: 860,
          height: 230,
          lineHeight: "230px",
          textAlign: "center",
          fontFamily: theme.fonts.en,
          fontWeight: 800,
          fontSize: 190,
          letterSpacing: -4,
          fontVariantNumeric: "tabular-nums",
          color: c.text,
          flexShrink: 0,
          ...countStyle,
        }}
      >
        {shown}
        <span style={{ color: c.textSoft, fontSize: 120 }}>/{total}</span>
      </div>
      <div
        data-box="progress-bar"
        data-kind="chrome"
        style={{
          width: 860,
          height: 48,
          borderRadius: 24,
          background: c.primarySoft,
          boxShadow: `inset 0 2px 6px ${c.shadow}`,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          ...barStyle,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            borderRadius: 24,
            background: `linear-gradient(90deg, ${c.primary}, ${c.primaryDark})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            bottom: 6,
            left: `calc(${pct}% - 30px)`,
            width: 24,
            borderRadius: 12,
            background: c.accent,
            opacity: p > 0 ? 1 : 0,
          }}
        />
      </div>
      <div
        data-box="progress-percent"
        style={{
          width: 860,
          height: 110,
          lineHeight: "110px",
          textAlign: "center",
          fontFamily: theme.fonts.en,
          fontWeight: 800,
          fontSize: 84,
          fontVariantNumeric: "tabular-nums",
          color: c.primary,
          flexShrink: 0,
          ...labelStyle,
        }}
      >
        {pct.toFixed(2)}%<span style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 56, color: c.text }}> সম্পন্ন</span>
      </div>
    </>
  );
};

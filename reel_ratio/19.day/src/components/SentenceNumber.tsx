import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, fonts, springs } from "../design/tokens";
import { enter } from "../lib/anim";

/** "181 / 300" pill + tiny progress track. Lives in its own band above the illustration. */
export const SentenceNumber: React.FC<{ number: number; total: number }> = ({ number, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 3, springs.snappy);
  const trackW = 520;
  return (
    <div
      style={{
        position: "absolute",
        top: L.numberRow.top,
        left: L.side,
        width: L.contentWidth,
        height: L.numberRow.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
      }}
    >
      <div
        style={{
          height: L.numberRow.height,
          padding: "0 34px",
          display: "flex",
          alignItems: "center",
          borderRadius: 999,
          background: colors.primary,
          color: colors.white,
          fontFamily: fonts.latin,
          fontWeight: 700,
          fontSize: 40,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.02em",
          boxShadow: "0 12px 24px -12px rgba(22,163,74,0.6)",
        }}
      >
        {number} / {total}
      </div>
      <div style={{ width: trackW, height: 14, borderRadius: 7, background: colors.soft, overflow: "hidden" }}>
        <div style={{ width: `${(number / total) * 100 * p}%`, height: "100%", background: colors.primary, borderRadius: 7 }} />
      </div>
    </div>
  );
};

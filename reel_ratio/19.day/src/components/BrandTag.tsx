import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, fonts } from "../design/tokens";
import { enter } from "../lib/anim";

export const LogoMark: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect width="64" height="64" rx="18" fill={colors.primary} />
    <path d="M16 20c0-3 2-5 5-5h22c3 0 5 2 5 5v16c0 3-2 5-5 5H32l-9 8v-8h-2c-3 0-5-2-5-5V20z" fill={colors.white} />
    <circle cx="25" cy="28" r="3" fill={colors.primary} />
    <circle cx="33" cy="28" r="3" fill={colors.primary} />
    <circle cx="41" cy="28" r="3" fill={colors.amber} />
  </svg>
);

/** Small non-critical brand tag in the top band. Shows a SAMPLE badge for synthetic timelines. */
export const BrandTag: React.FC<{ brand: string; day: number; sample?: boolean }> = ({ brand, day, sample }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 2);
  return (
    <div
      style={{
        position: "absolute",
        top: L.brandTop,
        left: 0,
        width: L.width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        opacity: p * 0.9,
        transform: `translateY(${interpolate(p, [0, 1], [-16, 0])}px)`,
        fontFamily: fonts.latin,
      }}
    >
      <LogoMark size={44} />
      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.14em", color: colors.dark, textTransform: "uppercase" }}>
        {brand} · Day {day}
      </span>
      {sample ? (
        <span style={{ fontSize: 20, fontWeight: 700, color: colors.white, background: colors.amberDark, padding: "6px 14px", borderRadius: 999 }}>
          SAMPLE TIMING
        </span>
      ) : null}
    </div>
  );
};

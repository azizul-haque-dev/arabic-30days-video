import React from "react";
import { theme } from "../theme";

const c = theme.colors;

/** Arabic Master mark (swap the SVG here if you have the official logo file). */
export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
    <defs>
      <linearGradient id="lm" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={c.primary} />
        <stop offset="1" stopColor={c.primaryDark} />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#lm)" />
    <text x="32" y="46" textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize="40" fill={c.white}>
      م
    </text>
    <circle cx="50" cy="14" r="5" fill={c.accent} />
  </svg>
);

/** Horizontal lockup: mark + wordmark. Fixed box so layout is deterministic. */
export const Logo: React.FC<{ width: number; height: number; box?: string; center?: boolean }> = ({ width, height, box = "logo", center }) => {
  const mark = height * 0.66;
  return (
    <div
      data-box={box}
      data-kind="chrome"
      style={{ width, height, display: "flex", alignItems: "center", justifyContent: center ? "center" : "flex-start", gap: 16, boxSizing: "border-box" }}
    >
      <LogoMark size={mark} />
      <div
        style={{
          fontFamily: theme.fonts.en,
          fontWeight: 800,
          fontSize: height * 0.36,
          letterSpacing: -0.5,
          color: c.text,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        Arabic <span style={{ color: c.primary }}>Master</span>
      </div>
    </div>
  );
};

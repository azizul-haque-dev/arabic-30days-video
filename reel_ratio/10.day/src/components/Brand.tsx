import React from "react";
import { theme } from "../theme";

const c = theme.colors;
export const font: React.CSSProperties = { fontFamily: theme.fonts.stack };

export const LogoMark: React.FC<{ size: number; uid?: string }> = ({ size, uid = "lm" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={c.primary} />
        <stop offset="1" stopColor={c.primaryDark} />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill={`url(#${uid})`} />
    <path
      d="M28 28h44a9 9 0 0 1 9 9v21a9 9 0 0 1-9 9H54L40 80V67H28a9 9 0 0 1-9-9V37a9 9 0 0 1 9-9z"
      fill={c.white}
    />
    <circle cx="35" cy="47.5" r="5.5" fill={c.primary} />
    <circle cx="50" cy="47.5" r="5.5" fill={c.primary} />
    <circle cx="65" cy="47.5" r="5.5" fill={c.accent} />
  </svg>
);

export const BrandHeader: React.FC<{ brand: string; right?: string }> = ({ brand, right }) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      right: 80,
      top: 150,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ...font,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <LogoMark size={68} uid="hdr" />
      <span style={{ fontSize: 44, fontWeight: 700, color: c.text, letterSpacing: -0.5 }}>{brand}</span>
    </div>
    {right ? (
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: c.primaryDark,
          background: c.mint,
          padding: "10px 28px",
          borderRadius: 999,
        }}
      >
        {right}
      </div>
    ) : null}
  </div>
);

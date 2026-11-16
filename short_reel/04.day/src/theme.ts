// theme.ts — single source of truth. Mint Fresh palette.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#EEF8F5",
    bgAlt: "#E2F3EE",
    primary: "#0E9F6E", // hero — only the ACTIVE (currently spoken) row uses it
    accent: "#F59E0B", // amber — logo, badge, follow button
    text: "#10231D",
    textDim: "#4B635A",
    card: "rgba(255,255,255,0.94)",
    line: "rgba(16,35,29,0.08)",
    glow: "rgba(14,159,110,0.38)",
    accentGlow: "rgba(245,158,11,0.45)",
  },
  fonts: {
    arabic: "Cairo, sans-serif",
    bengali: "NotoBengali, Cairo, sans-serif",
    display: "Cairo, NotoBengali, sans-serif",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;

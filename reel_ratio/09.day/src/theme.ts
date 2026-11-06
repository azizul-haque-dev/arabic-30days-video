// theme.ts — single source of truth: palette, fonts, easings, springs, layout.
// Never inline colors / easings / spring configs in components.
import { Easing } from "remotion";

export const theme = {
  video: { width: 1080, height: 1920, fps: 30 },
  colors: {
    // Mint Fresh palette (exact)
    bg: "#EEF8F5",
    primary: "#0E9F6E",
    accent: "#F59E0B",
    text: "#10231D",
    // neutral / derived tints of the palette above
    white: "#FFFFFF",
    textDim: "#10231D99",
    textSoft: "#10231D66",
    primarySoft: "#0E9F6E1A",
    primaryMid: "#0E9F6E40",
    accentSoft: "#F59E0B2E",
    line: "#10231D14",
    screen: "#F6FCFA",
    glow: "rgba(14,159,110,0.38)",
  },
  fonts: {
    bengali: '"Hind Siliguri", "Noto Sans Bengali", "Kohinoor Bangla", sans-serif',
    arabic: '"Noto Sans Arabic", "Hind Siliguri", "Geeza Pro", "Segoe UI", sans-serif',
    latin: '"Hind Siliguri", "Inter", "Helvetica Neue", Arial, sans-serif',
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
  layout: {
    marginX: 72,
    exitFrames: 8,
  },
} as const;

export type Theme = typeof theme;

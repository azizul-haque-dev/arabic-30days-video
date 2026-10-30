// theme.ts — single source of truth for colors, fonts, easings, and spring presets.
// Never inline hex colors or easings directly inside components.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#EEF8F5",
    bgAlt: "#DDF0EA",
    surface: "#FFFFFF",
    primary: "#0E9F6E", // Hero color: Mint Fresh Emerald
    primaryDeep: "#0A7A55",
    primarySoft: "#CDEBDF",
    accent: "#F59E0B", // Accent color: Warm Amber
    accentSoft: "#FDE8BD",
    text: "#10231D", // Deep Forest Slate
    textDim: "#4D6A60",
    line: "rgba(16, 35, 29, 0.10)",
    glow: "rgba(14, 159, 110, 0.35)",
    shadow: "rgba(16, 35, 29, 0.16)",
    white: "#FFFFFF",
    arabic: "#08503C", // Deep readable tone for Arabic calligraphy
  },
  fonts: {
    display: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    body: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    arabic: "'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Segoe UI', Tahoma, sans-serif",
  },
  weights: {
    hero: 700,
    strong: 600,
    body: 400,
  },
  radius: {
    sm: 20,
    md: 32,
    lg: 44,
    pill: 999,
  },
  shadow: {
    card: "0 30px 60px -24px rgba(16, 35, 29, 0.28), 0 6px 16px -6px rgba(16, 35, 29, 0.10)",
    soft: "0 14px 30px -14px rgba(16, 35, 29, 0.22)",
    hero: "0 24px 50px -16px rgba(14, 159, 110, 0.55)",
  },
  size: {
    w: 1080,
    h: 1080,
    pad: 80,
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


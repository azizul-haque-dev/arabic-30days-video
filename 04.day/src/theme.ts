import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#EEF8F5",
    bgAlt: "#DDF0EA",
    surface: "#FFFFFF",
    primary: "#0E9F6E",
    primaryDeep: "#0A7A55",
    primarySoft: "#CDEBDF",
    accent: "#F59E0B",
    accentSoft: "#FDE8BD",
    text: "#10231D",
    textDim: "#4D6A60",
    line: "rgba(16, 35, 29, 0.10)",
    glow: "rgba(14, 159, 110, 0.35)",
    shadow: "rgba(16, 35, 29, 0.16)",
  },
  fonts: {
    display: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    body: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    arabic: "'Noto Naskh Arabic', 'Noto Sans Arabic', sans-serif",
  },
  weights: {
    hero: 700,
    strong: 600,
    body: 400,
  },
  radii: {
    sm: 20,
    md: 32,
    lg: 44,
    pill: 999,
  },
  shadows: {
    card: "0 24px 60px -16px rgba(16, 35, 29, 0.16), 0 4px 16px rgba(16, 35, 29, 0.06)",
    soft: "0 10px 28px -8px rgba(16, 35, 29, 0.12)",
    hero: "0 24px 64px -12px rgba(14, 159, 110, 0.35)",
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

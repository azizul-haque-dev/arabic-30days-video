import { Easing } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1080;
export const MARGIN = 72;

export const alpha = (hex: string, a: number) =>
  hex + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

// User scheme: "Mint Fresh"
const base = {
  bg: "#EEF8F5",
  primary: "#0E9F6E",
  accent: "#F59E0B",
  text: "#10231D",
};

export const theme = {
  colors: {
    ...base,
    surface: "#FFFFFF",
    primaryDeep: "#0A7A55", // darker tint of primary for small text
    primarySoft: alpha(base.primary, 0.13),
    primaryMid: alpha(base.primary, 0.3),
    accentSoft: alpha(base.accent, 0.22),
    textDim: "#4A6359",
    line: alpha(base.text, 0.1),
    faint: alpha(base.text, 0.07),
    shadow: alpha(base.text, 0.22),
  },
  font: {
    family: "'Hind Siliguri', sans-serif",
    heavy: 700 as const,
    mid: 600 as const,
    body: 500 as const,
  },
  radius: { card: 44, small: 26, pill: 999 },
  shadow: {
    card: `0 34px 60px -28px ${alpha(base.text, 0.35)}, 0 2px 0 rgba(255,255,255,0.9) inset`,
    soft: `0 18px 36px -20px ${alpha(base.text, 0.3)}`,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.5, 0, 0.9, 0.4),
  },
  spring: {
    smooth: { damping: 200, stiffness: 100, mass: 1 },
    snappy: { damping: 20, stiffness: 220, mass: 0.8 },
    bouncy: { damping: 11, stiffness: 150, mass: 0.9 },
  },
  // per-sound gain (kept inside 0.2-0.35; tuned after loudness check)
  sfx: { whoosh: 0.32, swipe: 0.33, pop: 0.26, click: 0.35, chime: 0.28, thud: 0.26 } as Record<SfxName, number>,
};

export type SfxName = "whoosh" | "swipe" | "pop" | "click" | "chime" | "thud";

// theme.ts — single source of truth: colors, fonts, easing, springs, shape, shadows.
import { Easing } from "remotion";

export const VIDEO = { width: 1080, height: 1080, fps: 30 } as const;

export const theme = {
  colors: {
    // মিন্ট ফ্রেশ
    bg: "#EEF8F5",
    bgAlt: "#E1F2EC",
    primary: "#0E9F6E", // hero
    primaryDark: "#0A7A55",
    primarySoft: "#D3EEE3",
    accent: "#F59E0B",
    accentSoft: "#FDEBC8",
    text: "#10231D",
    textDim: "#4F6B62",
    card: "#FFFFFF",
    line: "#BFE0D3",
    onPrimary: "#FFFFFF",
    glow: "rgba(14, 159, 110, 0.35)",
    shadow: "rgba(16, 35, 29, 0.16)",
    shade: "rgba(16, 35, 29, 0.10)",
  },
  fonts: {
    display: "'Hind Siliguri', sans-serif",
    body: "'Hind Siliguri', sans-serif",
  },
  weight: { body: 500, display: 700 },
  radius: { card: 40, bubble: 44, pill: 999, small: 22 },
  shadow: {
    card: "0 28px 56px -22px rgba(16, 35, 29, 0.22), 0 2px 0 rgba(255,255,255,0.8) inset",
    soft: "0 14px 30px -14px rgba(16, 35, 29, 0.20)",
    hero: "0 30px 60px -22px rgba(14, 159, 110, 0.55)",
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
  motion: {
    lead: 5, // frames visuals enter before the related speech
    wordGap: 4, // stagger between words (3–6)
    exit: 10, // exit frames (faster than entrances)
    overlap: 10,
  },
} as const;

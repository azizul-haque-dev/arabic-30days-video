// theme.ts — single source of truth: colors, fonts, easings, spring presets, motion constants.
import { Easing } from "remotion";

export const theme = {
  colors: {
    // Scheme: মিন্ট ফ্রেশ
    bg: "#EEF8F5",
    bgAlt: "#DDF1EA",
    primary: "#0E9F6E", // hero
    primaryDeep: "#0A7A55",
    primarySoft: "rgba(14, 159, 110, 0.12)",
    accent: "#F59E0B",
    accentSoft: "rgba(245, 158, 11, 0.18)",
    text: "#10231D",
    textDim: "#4F6F64",
    surface: "#FFFFFF",
    onPrimary: "#FFFFFF",
    line: "rgba(16, 35, 29, 0.10)",
    glow: "rgba(14, 159, 110, 0.35)",
    shadow: "rgba(16, 35, 29, 0.16)",
  },
  fonts: { display: "HindSiliguri, sans-serif", body: "HindSiliguri, sans-serif" },
  weight: { body: 600, display: 700 },
  radius: { card: 40, small: 24, pill: 999 },
  size: { w: 1080, h: 1080, margin: 72 },
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
    staggerWord: 3, staggerCard: 5, staggerBlock: 6,
    exit: 9, // frames, faster than entrances
    overlap: 6, // scene overlap frames
    lead: 5, // visuals land this many frames before the narration
  },
} as const;

export type SpringName = keyof typeof theme.spring;

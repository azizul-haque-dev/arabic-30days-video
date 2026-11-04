// Single source of truth: colors, fonts, easing, springs, type sizes.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#EEF8F5",
    bgAlt: "#DDF1EA",
    primary: "#0E9F6E",
    primaryDark: "#0A7D56",
    primarySoft: "#CBEBDD",
    accent: "#F59E0B",
    accentSoft: "#FDE9C2",
    text: "#10231D",
    textDim: "#4B6359",
    card: "#FFFFFF",
    night: "#12332B",
    nightSoft: "#1E4A3F",
    skin: "#F1C9A5",
    pants: "#2F4F45",
    glow: "rgba(14,159,110,0.35)",
  },
  fonts: {
    bn: '"HindBn", "HindLatin", sans-serif',
    ar: '"NotoAr", sans-serif',
    en: '"Poppins", "HindLatin", sans-serif',
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
  // Sentence-card type scale. Pronunciation is the hero; Arabic is deliberately smaller.
  type: {
    arabic: 72,
    meaning: 56,
    pronLarge: 124,
    pronMid: 114,
    pronSmall: 104,
  },
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

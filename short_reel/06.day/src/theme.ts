import {Easing} from "remotion";

/** Single source of truth for colors, easings, springs and fonts. */
export const theme = {
  colors: {
    primary: "#16A34A",
    dark: "#14532D",
    light: "#DCFCE7",
    bg: "#F0FDF4",
    accent: "#F59E0B",
    accentSoft: "rgba(245, 158, 11, 0.28)",
    text: "#171717",
    textDim: "#737373",
    white: "#FFFFFF",
    cardBorder: "rgba(22, 163, 74, 0.14)",
    shadow: "rgba(20, 83, 45, 0.16)",
    subtitleBg: "rgba(20, 83, 45, 0.94)",
  },
  /** Flat-illustration colors (people icons only). */
  illustration: {
    skin: "#EBB88A",
    hair: "#2B1B12",
    shoe: "#14532D",
  },
  easing: {
    outCubic: Easing.out(Easing.cubic),
    inOutCubic: Easing.inOut(Easing.cubic),
    inCubic: Easing.in(Easing.cubic),
    outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  },
  spring: {
    soft: {damping: 200},
    snappy: {damping: 20, stiffness: 200},
    pop: {damping: 13, stiffness: 170, mass: 0.8},
  },
  fonts: {
    arabic: "AM Noto Sans Arabic",
    bengali: "AM Noto Sans Bengali",
    fallback: "'Noto Sans', 'Segoe UI', sans-serif",
  },
  layout: {
    cardWidth: 900,
    cardTop: 250,
    cardHeight: 1160,
    subtitleTop: 1500,
  },
} as const;

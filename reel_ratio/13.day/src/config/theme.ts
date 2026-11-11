import { Easing } from "remotion";

/** One theme object. No hex colour / easing / spring is inlined in components. */
export const theme = {
  colors: {
    bg: "#EEF8F5",
    bgAlt: "#DCF0E9",
    primary: "#0E9F6E",
    primaryDark: "#0A7A55",
    accent: "#F59E0B",
    text: "#10231D",
    textDim: "#64748B",
    white: "#FFFFFF",
    line: "#C9E5DB",
    shadow: "rgba(16,35,29,0.14)",
    danger: "#E5484D",
  },
  /** Illustration palette (kept here so the whole set stays consistent). */
  ill: {
    skin: ["#F2C6A0", "#D9A072", "#B9784B"],
    hair: ["#2B1B12", "#4A3222", "#1B1B1F"],
    shirt: ["#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6", "#F97316"],
    pants: "#334155",
    thobe: "#F8FAFC",
    taxi: "#F59E0B",
    taxiDark: "#D97706",
    road: "#3F4B57",
    roadLine: "#F8FAFC",
    curb: "#CBD5E1",
    glass: "#BFE6F2",
    wood: "#C99A62",
    woodDark: "#A87A45",
    rice: "#F6EBD0",
    meat: "#E5646E",
    meatDark: "#B83C4A",
    fat: "#FBE3E3",
    leaf: "#34A853",
    leafDark: "#1F7A3A",
    tomato: "#EF4444",
    cucumber: "#6BBF59",
    sky: "#D6F0FA",
    sand: "#F3E6C8",
    building: "#FFFFFF",
    buildingShade: "#E2EEE9",
    metal: "#94A3B8",
    metalDark: "#475569",
    screen: "#12372B",
    screenGlow: "#7CF2C0",
    products: ["#F59E0B", "#0E9F6E", "#3B82F6", "#EC4899", "#8B5CF6", "#EF4444", "#14B8A6"],
  },
  fonts: {
    bn: '"Hind Siliguri", "Noto Sans Arabic", sans-serif',
    ar: '"Noto Sans Arabic", "Hind Siliguri", sans-serif',
    en: 'Inter, "Hind Siliguri", sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  /** overshootClamping everywhere: text must never leave its slot while animating. */
  spring: {
    snappy: { damping: 18, stiffness: 170, mass: 0.6, overshootClamping: true },
    smooth: { damping: 22, stiffness: 90, mass: 1, overshootClamping: true },
    soft: { damping: 26, stiffness: 60, mass: 1, overshootClamping: true },
  },
  motion: {
    enterFrames: 20,
    exitFrames: 8,
    stagger: 4,
    /** max translate (px) used by any text animation; must be < SLOT_PAD_Y */
    maxTravel: 22,
  },
} as const;

export const FONT_WEIGHTS = { bn: 700, bnMedium: 600, ar: 600, en: 800 } as const;

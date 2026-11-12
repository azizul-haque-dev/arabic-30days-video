/**
 * Single source of truth for brand colours, fonts, easings and spring presets.
 * Components never inline a hex colour or an easing curve - they read from here.
 */
import { Easing } from "remotion";

export const theme = {
  colors: {
    background: "#EEF8F5",
    primary: "#0E9F6E",
    accent: "#F59E0B",
    text: "#10231D",
    textSecondary: "#64748B",
    white: "#FFFFFF",
    // derived tints (computed from the brand palette, kept here so components stay colour-free)
    primarySoft: "#D3EFE5",
    primaryDeep: "#0A7A55",
    accentSoft: "#FDE9BF",
    textOnPrimary: "#FFFFFF",
    shadow: "rgba(16, 35, 29, 0.14)",
    shadowSoft: "rgba(16, 35, 29, 0.08)",
    transparent: "rgba(0,0,0,0)",
    meshA: "rgba(14, 159, 110, 0.16)",
    meshB: "rgba(245, 158, 11, 0.13)",
    meshC: "rgba(14, 159, 110, 0.10)",
    gradeWarm: "rgba(245, 158, 11, 0.05)",
    vignette: "rgba(16, 35, 29, 0.10)",
    grain: "rgba(16, 35, 29, 0.55)",
  },
  /** Illustration palette (flat vector art). */
  art: {
    skinA: "#F2C6A0",
    skinB: "#C98F63",
    hairDark: "#2B2118",
    hairBrown: "#6B4423",
    shirtGreen: "#0E9F6E",
    shirtBlue: "#3B82F6",
    shirtWhite: "#FFFFFF",
    apron: "#10231D",
    tableTop: "#C9854A",
    tableTopLight: "#DDA166",
    tableLeg: "#8A5A2E",
    cloth: "#FFFFFF",
    clothShade: "#E3EEEA",
    chairSeat: "#0A7A55",
    chairBack: "#0E9F6E",
    plate: "#FFFFFF",
    plateRim: "#D6E4DF",
    plateShade: "#C5D6D0",
    rice: "#FDF3D0",
    meat: "#B5532E",
    meatDark: "#8C3B1E",
    veg: "#3FAE6A",
    tomato: "#E5483B",
    bread: "#E8B463",
    breadDark: "#C98B34",
    basket: "#B07A3C",
    basketDark: "#8A5D27",
    steam: "#CFDAD6",
    receipt: "#FFFFFF",
    receiptInk: "#64748B",
    receiptLine: "#CBD5D1",
    ice: "#8CD3F5",
    iceDeep: "#3B9AD1",
    clockFace: "#FFFFFF",
    clockRim: "#10231D",
    box: "#F5D9A8",
    boxDark: "#D8B070",
    boxLid: "#EFC98A",
    bag: "#F59E0B",
    bagDark: "#C97F00",
    signRed: "#DC4C3E",
    signText: "#FFFFFF",
    metal: "#AEBBB6",
    metalDark: "#8696A0",
    counter: "#E3C79B",
    counterDark: "#B8975F",
    outline: "#10231D",
    ground: "#D3EFE5",
    ghost: "#0E9F6E",
    water: "#BFE6F7",
  },
  fonts: {
    bengali: '"Hind Siliguri Bengali", "Hind Siliguri Latin", "Inter", sans-serif',
    arabic: '"Noto Sans Arabic", "Inter", sans-serif',
    latin: '"Inter", "Hind Siliguri Latin", sans-serif',
  },
  /** Spring presets (no overshoot beyond ~3% so animated art never escapes its reserved box). */
  springs: {
    soft: { damping: 22, stiffness: 120, mass: 0.9 },
    snappy: { damping: 20, stiffness: 190, mass: 0.7 },
    gentle: { damping: 26, stiffness: 90, mass: 1 },
  },
  easings: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    outSoft: Easing.bezier(0.22, 0.8, 0.3, 1),
    in: Easing.bezier(0.5, 0, 0.9, 0.4),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
  /** All motion durations in SECONDS; converted with fps at the call site. */
  motion: {
    enterSec: 0.7,
    exitSec: 0.3,
    staggerSec: 0.13,
    wipeSec: 0.45,
  },
  canvas: { width: 1080, height: 1920, fps: 30 },
  /** Layout grid (px). */
  layout: {
    safeX: 70,
    safeTop: 96,
    safeBottom: 330,
    headerTop: 118,
    /** minimum clear distance (px) required between any two visible boxes; 0 = they may touch but never intersect */
    gap: 0,
  },
} as const;

export type Theme = typeof theme;

import {Easing} from "remotion";

/** Single source of truth: palette, easings, springs, fonts, layout. */
export const C = {
  primary: "#16A34A",
  dark: "#14532D",
  soft: "#DCFCE7",
  bg: "#F0FDF4",
  white: "#FFFFFF",
  text: "#171717",
  muted: "#737373",
  amber: "#F59E0B",
};

/** Illustration-only accents (kept out of the type system). */
export const I = {
  skinA: "#F1C27D",
  skinB: "#B9835A",
  hairA: "#3B2A20",
  hairB: "#1F1A17",
  shirtBlue: "#38BDF8",
  wall: "#E7F8EC",
  wall2: "#CFEFD8",
  floor: "#B7E4C4",
  wood: "#C58B4E",
  woodDark: "#9A6A36",
  sky: "#BAE6FD",
  skyDeep: "#7DD3FC",
  cool: "#38BDF8",
  hot: "#EF4444",
  hotSoft: "#FCA5A5",
  night: "#0B1B3A",
  night2: "#16305F",
  metal: "#CBD5E1",
  metalDark: "#94A3B8",
  gray: "#E5E7EB",
};

export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.5, 0, 0.9, 0.5),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const SPRING = {
  pop: {damping: 13, stiffness: 170, mass: 0.7},
  soft: {damping: 20, stiffness: 110, mass: 0.9},
  snappy: {damping: 17, stiffness: 240, mass: 0.6},
};

export const FONT = {
  latin: "Poppins, 'Noto Sans Bengali', sans-serif",
  bn: "'Noto Sans Bengali', Poppins, sans-serif",
  ar: "'Noto Naskh Arabic', serif",
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;
/** Mobile-safe vertical band for important content. */
export const SAFE = {top: 230, bottom: 1500};
export const STAGE = {x: 80, y: 250, w: 920, h: 580};

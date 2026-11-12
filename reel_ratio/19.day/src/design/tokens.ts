import { Easing } from "remotion";

/** Single source of truth: brand colours, fonts, easing curves, spring presets. */
export const colors = {
  primary: "#16A34A",
  dark: "#14532D",
  soft: "#DCFCE7",
  bg: "#F0FDF4",
  amber: "#F59E0B",
  amberDark: "#B45309",
  text: "#171717",
  textDim: "#737373",
  border: "#E5E5E5",
  white: "#FFFFFF",
} as const;

export const fonts = {
  bengali: "'Hind Siliguri', 'Hind Siliguri Latin', 'Inter', sans-serif",
  arabic: "'Noto Sans Arabic', 'Inter', sans-serif",
  latin: "'Inter', 'Hind Siliguri Latin', sans-serif",
} as const;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Near-linear but never strictly linear; used for time-accurate sweeps. */
  sweep: Easing.bezier(0.3, 0.1, 0.7, 0.9),
} as const;

export const springs = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  smooth: { damping: 20, stiffness: 90, mass: 1 },
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
} as const;

export const radius = { card: 48, pill: 999, panel: 44 } as const;
export const shadow = {
  card: "0 30px 60px -24px rgba(20,83,45,0.28), 0 6px 16px -6px rgba(20,83,45,0.12)",
  soft: "0 14px 30px -16px rgba(20,83,45,0.25)",
} as const;

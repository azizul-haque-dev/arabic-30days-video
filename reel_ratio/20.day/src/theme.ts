import { Easing, spring, SpringConfig } from "remotion";

/** Single source of truth for design tokens (colors, type, layout, motion). */
export const theme = {
  colors: {
    primary: "#16A34A",
    dark: "#14532D",
    soft: "#DCFCE7",
    bg: "#F0FDF4",
    amber: "#F59E0B",
    text: "#171717",
    muted: "#737373",
    border: "#E5E5E5",
    white: "#FFFFFF",
    // functional tints derived from the brand palette
    amberSoft: "#FEF3C7",
    danger: "#DC2626",
    dangerSoft: "#FEE2E2",
    skin1: "#E8B98F",
    skin2: "#C68B5E",
    skin3: "#A8703F",
    slate: "#334155",
  },
  fonts: {
    bn: "'Hind Siliguri', sans-serif",
    ar: "'Noto Sans Arabic', sans-serif",
    en: "'Inter', sans-serif",
  },
  canvas: { w: 1080, h: 1920, fps: 30 },
  /** Safe area: top/bottom are covered by platform UI on Reels/Shorts. */
  safe: { top: 240, bottom: 360, side: 60 },
  layout: {
    brandBarY: 96,
    illus: { x: 60, y: 250, w: 960, h: 580 },
    card: { x: 60, y: 860, w: 960, h: 700, pad: 40, radius: 48 },
  },
  radius: { sm: 20, md: 32, lg: 48 },
  shadow: {
    card: "0 24px 60px rgba(20,83,45,0.14), 0 4px 12px rgba(20,83,45,0.06)",
    soft: "0 10px 28px rgba(20,83,45,0.12)",
  },
  ease: {
    out: Easing.bezier(0.22, 1, 0.36, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.55, 0, 1, 0.45),
  },
  spring: {
    pop: { damping: 14, stiffness: 140, mass: 0.7 } as SpringConfig,
    soft: { damping: 22, stiffness: 90, mass: 0.9 } as SpringConfig,
    snap: { damping: 18, stiffness: 220, mass: 0.6 } as SpringConfig,
  },
} as const;

export type Theme = typeof theme;
export { spring };

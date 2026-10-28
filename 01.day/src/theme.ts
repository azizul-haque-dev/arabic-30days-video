// theme.ts — single source of truth: colors, fonts, easing, springs, radii, shadows.
// Scheme: মিন্ট ফ্রেশ (bg #EEF8F5, hero #0E9F6E, accent #F59E0B, text #10231D)
import type { CSSProperties } from "react";
import { Easing } from "remotion";

export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const colors = {
  bg: "#EEF8F5",
  bgDeep: "#D8EFE6", // deeper tint of bg for depth
  primary: "#0E9F6E", // THE hero color
  accent: "#F59E0B",
  text: "#10231D",
  textDim: "#4A6A5F",
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
};

export const theme = {
  colors: {
    ...colors,
    glow: alpha(colors.primary, 0.35),
    line: alpha(colors.primary, 0.16),
    ink12: alpha(colors.text, 0.12),
  },
  fonts: {
    display: '"HS Bengali", "HS Latin", sans-serif',
    body: '"HS Bengali", "HS Latin", sans-serif',
  },
  weight: { display: 700, strong: 600, body: 500 },
  radius: { card: 52, panel: 44, tile: 30, pill: 999 },
  shadow: {
    card: `0 34px 70px -30px ${alpha(colors.text, 0.30)}, 0 4px 14px -6px ${alpha(colors.text, 0.12)}`,
    soft: `0 18px 40px -20px ${alpha(colors.text, 0.25)}`,
    hero: `0 26px 60px -22px ${alpha(colors.primary, 0.65)}`,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.4, 0, 0.2, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;

export const glass = (radius: number): CSSProperties => ({
  background: alpha(colors.surface, 0.78),
  border: `2px solid ${theme.colors.line}`,
  borderRadius: radius,
  boxShadow: theme.shadow.card,
  backdropFilter: "blur(16px)",
});

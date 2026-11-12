// theme.ts — single source of truth: brand colors, fonts, easing, springs.
// NEVER inline colors / easings / spring configs inside components.
import { Easing } from "remotion";

export const theme = {
  colors: {
    // ── Official Arabic Master brand colors ──
    bg: "#EEF8F5",
    primary: "#0E9F6E",
    accent: "#F59E0B",
    text: "#10231D",
    textDim: "#64748B",
    white: "#FFFFFF",
    // ── Tints derived from the same hues (not new brand colors) ──
    primarySoft: "#CFEDE2",
    primaryDark: "#0A7A55",
    accentSoft: "#FCE7B8",
    bgAlt: "#DDF0EA",
    line: "#BFE0D4",
    shadow: "rgba(16, 35, 29, 0.14)",
  },
  // Illustration palette (people / objects). Several skin tones on purpose.
  illus: {
    skin: ["#F1C7A0", "#D9A074", "#B07A52", "#7E5236"],
    hair: ["#2B1B12", "#4A2F1B", "#1F2937", "#5B3A1E"],
    shirtA: "#0E9F6E",
    shirtB: "#F59E0B",
    shirtC: "#475569",
    shirtD: "#FFFFFF",
    shirtE: "#2F5D8A",
    pants: "#2F3E4E",
    wood: "#C98F5B",
    woodDark: "#A8723F",
    metal: "#CBD5E1",
    glass: "rgba(255,255,255,0.62)",
    glassEdge: "#9CC9BC",
    ice: "#E6F6FF",
    iceEdge: "#8CC7E8",
    mango: "#F6A21B",
    mangoDark: "#E07B0B",
    leaf: "#2E9E5B",
    red: "#E4572E",
    cream: "#FFF4DC",
    ink: "#10231D",
  },
  fonts: {
    bn: '"Hind Siliguri", "Noto Sans Bengali", "Nirmala UI", sans-serif',
    ar: '"Noto Sans Arabic", "Segoe UI", "Tahoma", sans-serif',
    en: '"Hind Siliguri", "Inter", "Segoe UI", system-ui, sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // entrances (easeOutExpo)
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // moves
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
    soft: Easing.bezier(0.45, 0, 0.25, 1), // gentle in-out
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;

export type Theme = typeof theme;

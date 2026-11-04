import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#EEF8F5",
    bgAlt: "#DDF1EA",
    primary: "#0E9F6E",
    primaryDeep: "#0A7A55",
    primarySoft: "#CFEFE4",
    accent: "#F59E0B",
    accentSoft: "#FEF3C7",
    text: "#10231D",
    textDim: "#4B6B60",
    white: "#FFFFFF",
    glass: "#BFE6DB",
    shadow: "rgba(16,35,29,0.18)",
    glow: "rgba(14,159,110,0.35)",
    danger: "#E5534B",
    skin: "#E8B48A",
    hair: "#2B1B12",
    bldA: "#A9DCCB",
    bldB: "#8CCBB6",
    ink2: "#1F3B32",
  },
  fonts: {
    display: '"Plus Jakarta Sans", "Noto Sans Bengali", sans-serif',
    bn: '"Noto Sans Bengali", "Plus Jakarta Sans", sans-serif',
    ar: '"Noto Naskh Arabic", serif',
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
} as const;

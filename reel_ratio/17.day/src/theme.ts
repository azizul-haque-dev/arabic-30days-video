import { Easing } from "remotion";

/**
 * Single source of truth for look & motion. No hex colors / easings elsewhere.
 */
export const theme = {
  colors: {
    bg: "#EEF8F5",
    primary: "#0E9F6E",
    primaryDark: "#08775A",
    primarySoft: "#D4EFE5",
    accent: "#F59E0B",
    accentDark: "#C77A04",
    accentSoft: "#FDEFCB",
    text: "#10231D",
    textSoft: "#64748B",
    white: "#FFFFFF",
    line: "#CFE6DE",
    shadow: "rgba(16, 35, 29, 0.14)",
    // illustration supporting palette (kept warm + neutral so brand colors stay the hero)
    art: {
      wood: "#C98F52",
      woodLight: "#DDAE72",
      waiterShirt: "#35435F",
      woodDark: "#A06A34",
      cloth: "#FFFFFF",
      plate: "#FFFFFF",
      plateRim: "#DCE7E3",
      skin1: "#F2C29B",
      skin2: "#D99A6C",
      hair1: "#2B2A33",
      hair2: "#5B3A29",
      tomato: "#E5533D",
      rice: "#FFF4D6",
      chicken: "#D98B3A",
      leaf: "#5CB85C",
      bread: "#E8B25D",
      breadDark: "#C98B34",
      paper: "#FFFDF6",
      kraft: "#D9B382",
      kraftDark: "#B98F5C",
      steel: "#AEBBC2",
      ice: "#7DC4E8",
      wall: "#E3F3EE",
      floor: "#D2E9E1",
      chairSeat: "#0E9F6E",
    },
  },
  fonts: {
    bn: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    ar: "'Noto Sans Arabic', 'Segoe UI', sans-serif",
    en: "'Inter', 'Hind Siliguri', system-ui, sans-serif",
  },
  easing: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
  spring: {
    snappy: { damping: 16, stiffness: 180, mass: 0.8 },
    soft: { damping: 22, stiffness: 110, mass: 1 },
    bouncy: { damping: 11, stiffness: 150, mass: 0.9 },
  },
  /** all in seconds; converted with fps at use-site */
  timing: {
    enterSec: 0.55,
    exitSec: 0.28, // faster than entrance
    staggerSec: 0.09,
  },
} as const;

export type SpringPreset = keyof typeof theme.spring;

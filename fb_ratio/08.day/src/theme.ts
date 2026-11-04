// theme.ts — single source of truth: colors, fonts, easings, spring presets, motion constants.
// NEVER inline colors / easings / springs in components.
import {Easing} from "remotion";

export const theme = {
  video: {width: 1080, height: 1080, fps: 30},
  colors: {
    // Scheme: "মিন্ট ফ্রেশ"
    bg: "#EEF8F5",
    bgAlt: "#DDF1EA",
    primary: "#0E9F6E", // THE hero color
    accent: "#F59E0B",
    text: "#10231D",
    // derived neutrals / tints (same family as the scheme)
    textDim: "#4D6A60",
    surface: "#FFFFFF",
    mint: "#CDEDE2",
    mintDeep: "#8FD8BC",
    onPrimary: "#FFFFFF",
    line: "rgba(16, 35, 29, 0.10)",
    glow: "rgba(14, 159, 110, 0.35)",
  },
  fonts: {
    bn: "'Hind Siliguri', 'Cairo', sans-serif", // Bengali + Latin
    ar: "'Cairo', 'Hind Siliguri', sans-serif", // Arabic
  },
  radius: {card: 40, small: 24, pill: 999},
  shadow: {
    card: "0 34px 70px -28px rgba(16,35,29,0.30), 0 8px 20px -10px rgba(16,35,29,0.12)",
    soft: "0 16px 36px -18px rgba(16,35,29,0.26)",
    hero: "0 22px 44px -16px rgba(14,159,110,0.55)",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // moves
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    bouncy: {damping: 11, stiffness: 170, mass: 0.7},
  },
  motion: {
    enterFrames: 20,
    exitFrames: 10,
    overlap: 10, // outgoing scene stays this many frames under the incoming one
    lead: 5, // visuals land this many frames BEFORE the spoken word
    wordStagger: 4,
  },
} as const;

export const withAlpha = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const bn = (n: number | string): string => String(n).replace(/\d/g, (d) => BN[+d]);

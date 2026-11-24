import {Easing} from "remotion";

/** One theme object for the whole project — no inline hex colors / easings in components. */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const EPISODE = {
  number: "07",
  firstWord: 61,
  lastWord: 70,
  headline: "500+",
  headlineSub: "ARABIC WORDS",
  brand: "Arabic Master",
  cta: "FOLLOW FOR MORE",
} as const;

export const theme = {
  colors: {
    bgDeep: "#041A13",
    bg: "#073526",
    emerald: "#0E6B4A",
    green: "#14A85C",
    greenDark: "#0B7F44",
    mint: "#9BE8C2",
    mintSoft: "#D8F8E8",
    cream: "#FFF6DC",
    gold: "#F7C948",
    goldDeep: "#B8860B",
    white: "#FFFFFF",
    ink: "#05231A",
    coral: "#FF6B5E",
    glass: "rgba(255,255,255,0.07)",
    glassBorder: "rgba(255,255,255,0.18)",
    // illustration palette (shared by every icon so the set stays consistent)
    skin: ["#F3CBA0", "#DDA776", "#BF8052", "#94603C"],
    hair: ["#1D1612", "#3A2618", "#5B3A22"],
    shirts: ["#1FA463", "#0E7C66", "#F4B740", "#EAF7EF", "#3B82C4", "#E86B5A"],
    scarf: ["#EAF7EF", "#F4B740", "#0E7C66", "#E86B5A"],
  },
  fonts: {
    latin: '"Poppins", "Helvetica Neue", Arial, sans-serif',
    arabic: '"Noto Sans Arabic", "Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif',
    bangla: '"Noto Sans Bengali", "Hind Siliguri", "Nirmala UI", sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.55, 0, 0.9, 0.4),
  },
  spring: {
    pop: {damping: 11, stiffness: 170, mass: 0.7},
    soft: {damping: 20, stiffness: 120, mass: 0.9},
    snappy: {damping: 16, stiffness: 230, mass: 0.6},
  },
  // all in seconds — converted with fps in timing.ts
  motion: {
    /** extra seconds before the narration starts (audio is delayed by the same amount). 0 = exact SRT. */
    leadInSec: 0,
    thumbHoldSec: 0.3,
    thumbExitSec: 0.4,
    entranceSec: 0.55,
    exitSec: 0.3,
    outroSec: 3.8,
  },
} as const;

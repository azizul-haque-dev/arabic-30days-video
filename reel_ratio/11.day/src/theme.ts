import { Easing, spring } from "remotion";

/** One theme object: no inline hex colors, easings or spring configs in components. */
export const theme = {
  colors: {
    bg: "#EEF8F5",
    primary: "#0E9F6E",
    accent: "#F59E0B",
    text: "#10231D",
    textSoft: "#64748B",
    white: "#FFFFFF",
    // derived tints (same hue family as the brand palette)
    primaryDark: "#0A7A55",
    primaryDeep: "#075E42",
    mint: "#D5F0E7",
    mintSoft: "#E4F5EE",
    accentSoft: "#FDE7B8",
    accentDark: "#C77C04",
    danger: "#E5484D",
    dangerSoft: "#FFE1E2",
    skin: "#F2C29B",
    skinDark: "#D9A076",
    hair: "#1F2937",
    cloth: "#F8FAFC",
    slate: "#334155",
    sky: "#38BDF8",
    violet: "#8B5CF6",
    rose: "#F472B6",
    shadow: "rgba(16, 35, 29, 0.16)",
  },
  fonts: {
    bn: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
    ar: '"Noto Sans Arabic", "Hind Siliguri", sans-serif',
    en: '"Hind Siliguri", system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  /** Mobile safe margins for 9:16 (platform UI covers top/bottom) */
  safe: { x: 72, top: 150, bottom: 260 },
  radius: { card: 48, pill: 999 },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.5, 0, 0.9, 0.4),
    back: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
  spring: {
    snappy: { damping: 16, stiffness: 180, mass: 0.7 },
    soft: { damping: 20, stiffness: 100, mass: 1 },
    pop: { damping: 11, stiffness: 160, mass: 0.7 },
  },
  frames: { enter: 20, exit: 10, stagger: 4 },
} as const;

export type SpringName = keyof typeof theme.spring;
export const springOf = (
  frame: number,
  fps: number,
  delay = 0,
  preset: SpringName = "snappy",
) => spring({ frame: frame - delay, fps, config: theme.spring[preset] });

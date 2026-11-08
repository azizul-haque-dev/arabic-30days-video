import { Easing } from "remotion";
import { TEXT_MOTION_DY } from "./config/layout";
import { ARABIC_STACK, FONT_STACK } from "./config/typography";

/** The one theme object. Components never inline colours, fonts, easings or spring presets. */
export const theme = {
  colors: {
    bg: "#EEF8F5", primary: "#0E9F6E", primaryDark: "#0A7A55", primarySoft: "#D7F0E7",
    accent: "#F59E0B", accentSoft: "#FDE8C0", text: "#10231D", secondary: "#64748B", white: "#FFFFFF",
    shadow: "rgba(16, 35, 29, 0.16)", line: "#BFE5D6",
  },
  fonts: { main: FONT_STACK, arabic: ARABIC_STACK },
  springs: {
    enter: { damping: 17, stiffness: 150, mass: 0.8 },
    pop: { damping: 11, stiffness: 170, mass: 0.7 },
    soft: { damping: 24, stiffness: 90, mass: 1 },
  },
  easing: { exit: Easing.in(Easing.cubic), out: Easing.out(Easing.cubic), inOut: Easing.inOut(Easing.cubic) },
  motion: {
    exitSeconds: 0.33,      // exits are faster than entrances
    staggerSeconds: 0.13,   // gap between sibling entrances
    textRiseSeconds: 0,
    textDy: TEXT_MOTION_DY, // px - kept below half of the minimum zone gap (see layoutValidation)
    kenBurns: 0.025,
    radius: 48,
  },
} as const;
export type ThemeColor = keyof typeof theme.colors;

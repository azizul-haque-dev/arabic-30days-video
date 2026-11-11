import { Easing } from "remotion";

/** Single source of truth for colours, fonts, easings, springs and layout zones. */
export const theme = {
  colors: {
    bg: "#EEF8F5",
    green: "#0E9F6E",
    greenDark: "#0A7A55",
    greenSoft: "#CDEFE2",
    greenMist: "#DDF3EA",
    amber: "#F59E0B",
    amberDark: "#C77D06",
    amberSoft: "#FDE6B0",
    text: "#10231D",
    muted: "#64748B",
    white: "#FFFFFF",
    road: "#31423D",
    roadEdge: "#1F2D29",
    grass: "#CFEBDC",
    block: "#E4F1EC",
    blockDark: "#B9DCCB",
    red: "#E5484D",
    glass: "#BFE6F2",
  },
  fonts: {
    bn: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
    ar: '"Noto Sans Arabic", "Segoe UI", sans-serif',
    en: '"Inter", "Hind Siliguri", system-ui, sans-serif',
  },
  easings: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.33, 1, 0.68, 1),
  },
  springs: {
    enter: { damping: 17, stiffness: 150, mass: 0.8 },
    pop: { damping: 12, stiffness: 190, mass: 0.7 },
    gentle: { damping: 22, stiffness: 90, mass: 1 },
  },
  /** timing constants in seconds (converted with fps) */
  timing: { enterStagger: 0.14, exitSec: 0.28, sceneLead: 0.1, tail: 1.1 },
  layout: {
    W: 1080,
    H: 1920,
    marginX: 70,
    safeTop: 160,
    safeBottom: 1700,
    zones: {
      top: { x: 70, y: 160, w: 940, h: 100 },
      stage: { x: 70, y: 300, w: 940, h: 820 },
      title: { x: 70, y: 1130, w: 940, h: 300 },
      caption: { x: 70, y: 1450, w: 940, h: 250 },
      sStage: { x: 70, y: 300, w: 940, h: 880 },
      pron: { x: 70, y: 1196, w: 940, h: 250 },
      meaning: { x: 70, y: 1456, w: 940, h: 236 },
    },
  },
} as const;

export type ZoneKey = keyof typeof theme.layout.zones;

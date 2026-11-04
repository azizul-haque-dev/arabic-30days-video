import { Easing } from "remotion";

// ── একমাত্র সত্যের উৎস: সব রং, ইজিং, spring ও ফন্ট এখানে ──
export const VIDEO = { width: 1080, height: 1080, fps: 30 } as const;
export const F = (seconds: number) => Math.round(seconds * VIDEO.fps);

// Mint Fresh (ইউজারের বাছাই করা স্কিম) + তা থেকে নেওয়া শেড
export const C = {
  bg: "#EEF8F5",
  hero: "#0E9F6E",
  accent: "#F59E0B",
  text: "#10231D",
  white: "#FFFFFF",
  heroDeep: "#0A7A55",
  heroSoft: "#CFEBDF",
  heroTint: "#E2F4EC",
  accentSoft: "#FCE3AE",
  accentDeep: "#B76E00",
  muted: "rgba(16,35,29,0.62)",
  faint: "rgba(16,35,29,0.10)",
  onHero: "#FFFFFF",
} as const;

export const FONT = {
  family: "'Hind Siliguri', system-ui, sans-serif",
  w: { regular: 400, semi: 600, heavy: 700 },
} as const;

export const R = { card: 48, bubble: 40, chip: 30, pill: 999 } as const;

export const SHADOW = {
  card: "0 36px 70px -28px rgba(10,122,85,0.35), 0 10px 22px -12px rgba(16,35,29,0.14)",
  soft: "0 18px 40px -20px rgba(10,122,85,0.30)",
  hero: "0 22px 44px -16px rgba(14,159,110,0.55)",
  accent: "0 18px 36px -14px rgba(245,158,11,0.60)",
} as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const SPRING = {
  pop: { damping: 11, stiffness: 170, mass: 0.7 },
  soft: { damping: 20, stiffness: 120, mass: 0.9 },
  snap: { damping: 17, stiffness: 240, mass: 0.6 },
  heavy: { damping: 14, stiffness: 110, mass: 1.1 },
} as const;

// সব টাইমিং fps থেকে
export const MOTION = {
  enter: F(0.47),
  exit: F(0.27),
  lead: F(0.17), // ভিজ্যুয়াল কথার ~5 ফ্রেম আগে ঢোকে
  overlap: F(0.27),
  stagger: F(0.13),
} as const;

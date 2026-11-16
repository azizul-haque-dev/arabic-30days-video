import {Easing} from 'remotion';

// ---- Colour scheme: "Mint Fresh" (user-chosen) ----
const base = {
  bg: '#EEF8F5',
  hero: '#0E9F6E',
  accent: '#F59E0B',
  text: '#10231D',
} as const;

const toRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

export const mix = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
};
export const alpha = (hex: string, a: number) => {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

export const colors = {
  ...base,
  heroDeep: mix(base.hero, base.text, 0.4),
  heroSoft: mix(base.hero, base.bg, 0.86),
  accentSoft: mix(base.accent, base.bg, 0.8),
  surface: mix(base.bg, '#FFFFFF', 0.75),
  textDim: mix(base.text, base.bg, 0.4),
};

// ---- Fonts (files live in public/fonts, see src/fonts.ts) ----
// Bengali glyphs -> Hind Siliguri, Latin + Arabic glyphs -> Cairo. One stack everywhere.
export const fonts = {
  stack: "'Hind Siliguri', 'Cairo', sans-serif",
  arabicWeight: 900,
  displayWeight: 900,
  bodyWeight: 700,
} as const;

export const radius = {card: 56, tile: 48, bubble: 52, pill: 999} as const;

export const shadow = {
  card: `0 40px 70px -28px ${alpha(colors.heroDeep, 0.38)}, 0 10px 24px -12px ${alpha(colors.heroDeep, 0.18)}`,
  hero: `0 44px 80px -30px ${alpha(colors.heroDeep, 0.6)}`,
  soft: `0 18px 40px -22px ${alpha(colors.heroDeep, 0.35)}`,
} as const;

// ---- Motion personality: snappy, springy, quick exits ----
export const springs = {
  pop: {damping: 12, stiffness: 190, mass: 0.7},
  soft: {damping: 20, stiffness: 120, mass: 0.9},
  bounce: {damping: 9, stiffness: 210, mass: 0.6},
  crisp: {damping: 26, stiffness: 240, mass: 0.8},
} as const;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.5, 0, 0.9, 0.4),
} as const;

export const motion = {
  stagger: 4, // frames between staggered items
  exitFrames: 8, // exits are faster than entrances
} as const;

export const bn = (n: number) =>
  String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

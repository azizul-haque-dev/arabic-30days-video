import {Easing} from 'remotion';

// সব রং, ইজিং, spring প্রিসেট ও ফন্ট এখানে। কম্পোনেন্টে সরাসরি রঙের কোড নয়।
export const theme = {
  colors: {
    // ইউজারের স্কিম: মিন্ট ফ্রেশ
    bg: '#EEF8F5',
    hero: '#0E9F6E',
    accent: '#F59E0B',
    text: '#10231D',
    // স্কিম থেকে নেওয়া টিন্ট/শেড
    heroDeep: '#0A7A55',
    heroSoft: '#CDEBDF',
    heroTint: '#E1F3EC',
    accentSoft: '#FDE6B8',
    white: '#FFFFFF',
    glass: 'rgba(255,255,255,0.88)',
    muted: '#4C6A5F',
    line: '#B9DDCF',
    shadow: 'rgba(16,35,29,0.14)',
    shadowSoft: 'rgba(16,35,29,0.08)',
  },
  fonts: {
    family: "'Hind Siliguri', sans-serif",
    weights: {regular: 500, semi: 600, bold: 700},
  },
  radius: {card: 44, bubble: 36, pill: 999, tile: 40},
  shadow: {
    card: '0 28px 64px rgba(16,35,29,0.13), 0 3px 0 rgba(255,255,255,0.9) inset',
    soft: '0 14px 34px rgba(16,35,29,0.10)',
    pop: '0 18px 40px rgba(14,159,110,0.28)',
  },
  easings: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.33, 1, 0.68, 1),
  },
  // মোশন-ব্যক্তিত্ব: নরম, হালকা বাউন্সি
  springs: {
    soft: {damping: 18, stiffness: 130, mass: 0.9},
    pop: {damping: 11, stiffness: 200, mass: 0.7},
    snappy: {damping: 20, stiffness: 240, mass: 0.8},
    slow: {damping: 24, stiffness: 90, mass: 1},
  },
  motion: {
    stagger: 4, // ফ্রেম
    exit: 10,
    lead: 5, // ভিজ্যুয়াল কথার ~৫ ফ্রেম আগে
  },
  sfx: {pop: 0.3, whoosh: 0.3, click: 0.34, chime: 0.3, thud: 0.22},
} as const;

export type Theme = typeof theme;

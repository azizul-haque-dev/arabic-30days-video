// theme.ts — সব রং, ফন্ট, ইজিং, spring ও সাউন্ডের মান এখানে। কম্পোনেন্টে সরাসরি রঙের কোড নয়।
import { Easing } from "remotion";

export const theme = {
  colors: {
    // ইউজারের স্কিম: মিন্ট ফ্রেশ
    bg: "#EEF8F5",
    hero: "#0E9F6E",
    accent: "#F59E0B",
    text: "#10231D",
    // স্কিমের রং থেকে নেওয়া টিন্ট/শেড
    white: "#FFFFFF",
    heroDeep: "#0A7A55",
    accentDeep: "#D98206",
    textDim: "rgba(16,35,29,0.62)",
    textFaint: "rgba(16,35,29,0.28)",
    heroSoft: "rgba(14,159,110,0.14)",
    accentSoft: "rgba(245,158,11,0.40)",
    line: "rgba(16,35,29,0.10)",
    glow: "rgba(14,159,110,0.38)",
    shadow: "rgba(16,35,29,0.30)",
    glass: "rgba(255,255,255,0.72)",
    // শুধু ইলাস্ট্রেশনের জন্য
    sand: "#F6E7C1",
    meat: "#E3745B",
    meatDark: "#B8523C",
  },
  fonts: {
    display: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
    body: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
  },
  radius: { card: 56, tile: 44, pill: 999 },
  shadow: {
    card: "0 36px 70px -28px rgba(16,35,29,0.34), 0 8px 22px rgba(16,35,29,0.07)",
    soft: "0 18px 40px -18px rgba(16,35,29,0.30)",
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
  // ভিজ্যুয়াল ক্যু-র কথার কত ফ্রেম আগে ঢুকবে (৪-৬)
  leadFrames: 5,
  audio: {
    // ভয়েসওভার ফ্ল্যাগ: Studio প্রিভিউ ও রেন্ডারে বাজবে
    voiceoverEnabled: true,
    voiceoverFile: "13-partcomolete.wav",
    voiceoverVolume: 1,
    // true হলে রেন্ডারে voiceover না থাকলে এরর দেবে (অডিও কখনো চুপচাপ বাদ যাবে না)
    voiceoverRequiredInRender: true,
  },
  sfx: {
    // ধরন → { ফাইল দৈর্ঘ্য (সেকেন্ড), ভলিউম }
    pop: { dur: 0.26, vol: 0.30 },
    click: { dur: 0.14, vol: 0.34 },
    whoosh: { dur: 0.70, vol: 0.30 },
    chime: { dur: 0.50, vol: 0.30 },
    thud: { dur: 0.36, vol: 0.30 },
  },
} as const;

export type SfxType = keyof typeof theme.sfx;

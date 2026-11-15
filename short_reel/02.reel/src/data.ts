// ─────────────────────────────────────────────────────────────
// EKHANE SOB EDIT KORBE: page name, voice file, phrase text, timing
// Timing = SRT-er start/end (milliseconds). reel2-done_ben.srt theke neya.
// ─────────────────────────────────────────────────────────────
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const PAGE_NAME = "Arabic Master";
export const TAGLINE = "SURVIVAL ARABIC";

// Voice file public/ folder e rakhle ekhane naam dao, jemon "voice.mp3". null = no audio.
export const VOICE_FILE: string | null = "audio.wav";
// Choto pop/whoosh sound (public/sfx). Voice-er upor chaile false koro.
export const SFX_ENABLED = true;

export type Phrase = {
  n: number;
  ar: string;
  bn: string; // pronunciation in Bengali
  meaning: string;
  startMs: number;
  endMs: number;
};

export const PHRASES: Phrase[] = [
  { n: 11, ar: "طيب", bn: "তাইয়্যিব", meaning: "ভালো / ঠিক আছে", startMs: 120, endMs: 560 },
  { n: 12, ar: "تمام", bn: "তামাম", meaning: "একদম ঠিক / ভালো", startMs: 1440, endMs: 1800 },
  { n: 13, ar: "شكرا", bn: "শুকরান", meaning: "ধন্যবাদ", startMs: 2820, endMs: 3320 },
  { n: 14, ar: "عفوا", bn: "আফওয়ান", meaning: "স্বাগতম (ধন্যবাদের উত্তর) / মাফ করবেন", startMs: 4260, endMs: 4760 },
  { n: 15, ar: "أيوه", bn: "আইওয়া", meaning: "হ্যাঁ", startMs: 5680, endMs: 6160 },
  { n: 16, ar: "لا", bn: "লা", meaning: "না", startMs: 7120, endMs: 7380 },
  { n: 17, ar: "لو سمحت", bn: "লাও সামাহত", meaning: "দয়া করে / এক্সকিউজ মি", startMs: 8300, endMs: 8940 },
  { n: 18, ar: "مع السلامة", bn: "মা’আস সালামা", meaning: "বিদায়", startMs: 9820, endMs: 10680 },
];

// Layout (px) — 9:16 safe zone-er moddhe
export const ROW_LEFT = 60;
export const ROW_W = 960;
export const ROW_TOP = 272;
export const ROW_H = 144;
export const ROW_GAP = 10;

// Last cue-er por Follow button-er CTA koto sec dekhabe
export const CTA_DELAY_SEC = 0.5;
export const CTA_TAIL_SEC = 2.8;

const lastEnd = PHRASES[PHRASES.length - 1].endMs / 1000;
export const CTA_FRAME = Math.round((lastEnd + CTA_DELAY_SEC) * FPS);
export const TOTAL_FRAMES = Math.ceil((lastEnd + CTA_DELAY_SEC + CTA_TAIL_SEC) * FPS);
export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

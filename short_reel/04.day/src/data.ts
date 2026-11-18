// ─────────────────────────────────────────────────────────────
// EKHANE SOB EDIT KORBE: page name, voice file, phrase text, timing
// Timing = SRT-er start/end (milliseconds). reel4-done_ben.srt theke neya.
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
  { n: 27, ar: "كل سنةإنت طيب", bn: "কুল্লু সানাহ ইন্তা তায়্যিব", meaning: "শুভ জন্মদিন / ঈদের শুভেচ্ছা", startMs: 620, endMs: 2000 },
  { n: 28, ar: "حياك الله", bn: "হাইয়্যাকাল্লাহ", meaning: "আপনাকে স্বাগতম", startMs: 3660, endMs: 4360 },
  { n: 29, ar: "الله يحييك", bn: "আল্লাহ ই-হাইয়ীক", meaning: "আল্লাহ আপনাকে দীর্ঘজীবী করুন (স্বাগতমের উত্তর)", startMs: 5920, endMs: 7040 },
  { n: 30, ar: "تصبح على خير", bn: "তিসবাহ আলা খাইর", meaning: "শুভ রাত্রি", startMs: 8700, endMs: 9660 },
  { n: 31, ar: "وإنت من أهل الخير", bn: "ওয়া ইন্তা মিন আহলিল খাইর", meaning: "আপনাকেও শুভ রাত্রি", startMs: 11280, endMs: 12660 },
  { n: 32, ar: "نعيما", bn: "নাঈমান", meaning: "গোসল বা চুল কাটার পর শুভেচ্ছা", startMs: 14320, endMs: 14940 },
  { n: 33, ar: "الله ينعم عليك", bn: "আল্লাহ ই-নায়িম আলেইক", meaning: "আল্লাহ আপনাকে অনুগ্রহ করুন (নাইমান-এর উত্তর)", startMs: 16520, endMs: 17840 },
];

// Layout (px) — 9:16 safe zone-er moddhe
export const ROW_LEFT = 50;
export const ROW_W = 980;
export const ROW_TOP = 272;
export const ROW_H = 160;
export const ROW_GAP = 12;

// Last cue-er por Follow button-er CTA koto sec dekhabe
export const CTA_DELAY_SEC = 0.5;
export const CTA_TAIL_SEC = 2.8;

const lastEnd = PHRASES[PHRASES.length - 1].endMs / 1000;
export const CTA_FRAME = Math.round((lastEnd + CTA_DELAY_SEC) * FPS);
export const TOTAL_FRAMES = Math.ceil((lastEnd + CTA_DELAY_SEC + CTA_TAIL_SEC) * FPS);
export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

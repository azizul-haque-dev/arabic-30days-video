// ─────────────────────────────────────────────────────────────
// EKHANE SOB EDIT KORBE: page name, voice file, phrase text, timing
// Timing = SRT-er start/end (milliseconds). reel3-done_ben.srt theke neya.
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
  { n: 19, ar: "بارك الله فيك", bn: "বারাকাল্লাহু ফীক", meaning: "আল্লাহ আপনার মঙ্গল করুন", startMs: 880, endMs: 2000 },
  { n: 20, ar: "جزاك الله خير", bn: "জাযাকাল্লাহু খাইর", meaning: "আল্লাহ আপনাকে উত্তম প্রতিদান দিন", startMs: 3820, endMs: 4860 },
  { n: 21, ar: "تفضل", bn: "তাফাদ্দাল", meaning: "আসুন / নিন / বসুন (অনুরোধ)", startMs: 6440, endMs: 7140 },
  { n: 22, ar: "آسف", bn: "আসিফ", meaning: "দুঃখিত", startMs: 8760, endMs: 9380 },
  { n: 23, ar: "معليش", bn: "মা'আলেশ", meaning: "কিছু মনে করবেন না / সমস্যা নেই", startMs: 11100, endMs: 11840 },
  { n: 24, ar: "ولا يهمك", bn: "ওয়ালা ইয়িহিম্মাক", meaning: "চিন্তা করবেন না", startMs: 13540, endMs: 14480 },
  { n: 25, ar: "مبروك", bn: "মাবরুক", meaning: "অভিনন্দন", startMs: 16200, endMs: 17000 },
  { n: 26, ar: "الله يبارك فيك", bn: "আল্লাহ ইয়িবারিক ফীক", meaning: "আল্লাহ আপনাকে বরকত দিন (অভিনন্দনের উত্তর)", startMs: 18700, endMs: 20060 },
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

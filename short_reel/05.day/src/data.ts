// ─────────────────────────────────────────────────────────────
// EKHANE SOB EDIT KORBE: page name, voice file, phrase text, timing
// Timing = SRT-er start/end (milliseconds). reel5-done_ben.srt theke neya (cue 1-7).
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
  { n: 34, ar: "ما قصرت", bn: "মা গাসসারত", meaning: "আপনি কোনো কমতি রাখেননি", startMs: 580, endMs: 1340 },
  { n: 35, ar: "في أمان الله", bn: "ফি আমানিল্লাহ", meaning: "আল্লাহর হেফাজতে থাকুন", startMs: 2520, endMs: 3260 },
  { n: 36, ar: "يعطيك العافية", bn: "ইয়াতিক আল আফিয়া", meaning: "আল্লাহ আপনাকে শক্তি ও সুস্বাস্থ্য দিন", startMs: 4420, endMs: 5460 },
  { n: 37, ar: "تشرفنا", bn: "তাশাররাফনা", meaning: "আপনার সাথে পরিচিত হয়ে খুশি হলাম", startMs: 6480, endMs: 7240 },
  { n: 38, ar: "الشرف لنا", bn: "আশ-শারাফ লানা", meaning: "সম্মানটা আমাদেরই", startMs: 8340, endMs: 9200 },
  { n: 39, ar: "طال عمرك", bn: "তালা ওমারাক", meaning: "আপনার দীর্ঘায়ু কামনা করি", startMs: 10260, endMs: 11040 },
  { n: 40, ar: "الله يكرمك", bn: "আল্লাহ ইয়িকরিমাক", meaning: "আল্লাহ আপনাকে সম্মানিত করুন", startMs: 12160, endMs: 13260 },
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

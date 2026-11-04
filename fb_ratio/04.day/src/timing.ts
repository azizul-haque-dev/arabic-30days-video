export const FPS = 30;
export const TOTAL_FRAMES = 4063; // 135.423s (SRT শেষ 135.10s / 4053f, WAV 135.423s)

export interface SceneDef {
  id: string;
  from: number;
  duration: number;
}

export interface SentenceBeat {
  num: number;
  from: number;
  duration: number;
  firstAr: number;
  say: number;
  mean: number;
}

export const INTRO_SCENES: SceneDef[] = [
  { id: "hook", from: 0, duration: 143 },
  { id: "brand", from: 143, duration: 226 },
  { id: "progress", from: 369, duration: 230 },
  { id: "topic", from: 599, duration: 146 },
];

export const SENTENCE_BEATS: SentenceBeat[] = [
  { num: 31, from: 745, duration: 275, firstAr: 65, say: 127, mean: 190 },
  { num: 32, from: 1020, duration: 231, firstAr: 60, say: 110, mean: 163 },
  { num: 33, from: 1251, duration: 299, firstAr: 57, say: 135, mean: 211 },
  { num: 34, from: 1550, duration: 255, firstAr: 57, say: 101, mean: 176 },
  { num: 35, from: 1805, duration: 241, firstAr: 60, say: 109, mean: 160 },
  { num: 36, from: 2046, duration: 264, firstAr: 63, say: 123, mean: 179 },
  { num: 37, from: 2310, duration: 302, firstAr: 77, say: 144, mean: 209 },
  { num: 38, from: 2612, duration: 249, firstAr: 69, say: 121, mean: 174 },
  { num: 39, from: 2861, duration: 251, firstAr: 61, say: 116, mean: 176 },
  { num: 40, from: 3112, duration: 262, firstAr: 54, say: 113, mean: 199 },
];

export const OUTRO_SCENES: SceneDef[] = [
  { id: "recap", from: 3374, duration: 232 },
  { id: "comment", from: 3606, duration: 101 },
  { id: "statement", from: 3707, duration: 83 },
  { id: "follow", from: 3790, duration: 116 },
  { id: "end", from: 3906, duration: 157 },
];

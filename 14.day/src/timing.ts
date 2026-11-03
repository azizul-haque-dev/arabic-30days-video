export const FPS = 30;
export const TOTAL_FRAMES = 3570; // 118.99s @ 30fps

export const SCENES = [
  { id: "intro_hook", from: 0, duration: 210 },         // 0.0s - 7.0s
  { id: "intro_title", from: 210, duration: 210 },      // 7.0s - 14.0s
  { id: "intro_count", from: 420, duration: 180 },      // 14.0s - 20.0s
  { id: "intro_ready", from: 600, duration: 135 },      // 20.0s - 24.5s
  
  // Sentences 131 - 140
  { id: "sent_131", from: 735, duration: 213 },
  { id: "sent_132", from: 948, duration: 203 },
  { id: "sent_133", from: 1151, duration: 267 },
  { id: "sent_134", from: 1418, duration: 237 },
  { id: "sent_135", from: 1655, duration: 257 },
  { id: "sent_136", from: 1912, duration: 177 },
  { id: "sent_137", from: 2089, duration: 153 },
  { id: "sent_138", from: 2242, duration: 263 },
  { id: "sent_139", from: 2505, duration: 269 },
  { id: "sent_140", from: 2774, duration: 232 },

  // Outro
  { id: "outro_recap", from: 3006, duration: 210 },
  { id: "outro_cta", from: 3216, duration: 270 },       // 107.2s - 116.2s (follow + "comment-এ লিখুন Day 14 Done")
  { id: "outro_end", from: 3486, duration: 84 },        // 116.2s - 119.0s ("দেখা হবে Day 15-তে ইনশাআল্লাহ")
];

export const BEATS = [
  { say: 75, mean: 167 }, // 131
  { say: 60, mean: 140 }, // 132
  { say: 41, mean: 143 }, // 133
  { say: 44, mean: 95 },  // 134
  { say: 43, mean: 120 }, // 135
  { say: 57, mean: 110 }, // 136
  { say: 45, mean: 105 }, // 137
  { say: 74, mean: 186 }, // 138
  { say: 73, mean: 193 }, // 139
  { say: 64, mean: 152 }, // 140
];

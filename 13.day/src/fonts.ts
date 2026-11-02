import { continueRender, delayRender, staticFile } from "remotion";

const BN =
  "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

// ফন্ট প্রজেক্টের ভেতরেই (public/fonts) — অফলাইনে চলবে
const rule = (subset: "bengali" | "latin", weight: number, range: string) =>
  `@font-face{font-family:"Hind Siliguri";font-style:normal;font-weight:${weight};font-display:block;` +
  `src:url(${staticFile(`fonts/hind-siliguri-${subset}-${weight}-normal.woff2`)}) format("woff2");unicode-range:${range};}`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = [600, 700]
    .flatMap((w) => [rule("bengali", w, BN), rule("latin", w, LATIN)])
    .join("\n");
  document.head.appendChild(style);

  const handle = delayRender("fonts");
  Promise.all([
    document.fonts.load('600 40px "Hind Siliguri"', "অআকখ যুক্তাক্ষর"),
    document.fonts.load('700 40px "Hind Siliguri"', "অআকখ যুক্তাক্ষর"),
    document.fonts.load('600 40px "Hind Siliguri"', "Arabic Master 0123"),
    document.fonts.load('700 40px "Hind Siliguri"', "Arabic Master 0123"),
  ])
    .then(() => continueRender(handle))
    .catch((e) => {
      // ফন্ট না এলে চুপচাপ এগোবে না
      throw e;
    });
}

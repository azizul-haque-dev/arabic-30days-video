import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// ফন্ট প্রজেক্টের ভেতরেই (public/fonts) — অফলাইনে চলে।
const BN = "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CF7,U+200C-200D,U+20B9,U+25CC";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

const handle = delayRender("Loading Hind Siliguri");
const jobs: Promise<unknown>[] = [];
// latin আগে, bengali পরে — ওভারল্যাপে (ZWJ/ZWNJ) বাংলা ফাইল জেতে
for (const [subset, range] of [["latin", LATIN], ["bengali", BN]] as const) {
  for (const weight of [400, 600, 700]) {
    const face = new FontFace(
      "Hind Siliguri",
      `url(${staticFile(`fonts/hind-siliguri-${subset}-${weight}-normal.woff2`)}) format("woff2")`,
      { weight: String(weight), unicodeRange: range },
    );
    jobs.push(face.load().then((f) => document.fonts.add(f)));
  }
}
Promise.all(jobs)
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));

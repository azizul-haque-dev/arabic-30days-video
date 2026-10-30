import { continueRender, delayRender, staticFile } from "remotion";

// Fonts ship inside the project (public/fonts) — works fully offline.
const BN_RANGE = "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CE4-1CE8,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC";
const LATIN_RANGE = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export const loadFonts = () => {
  if (typeof document === "undefined") return;
  const handle = delayRender("Loading Hind Siliguri");
  const faces: FontFace[] = [];
  for (const w of [500, 600, 700]) {
    faces.push(new FontFace("Hind Siliguri", `url(${staticFile(`fonts/hind-siliguri-bengali-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w), unicodeRange: BN_RANGE }));
    faces.push(new FontFace("Hind Siliguri", `url(${staticFile(`fonts/hind-siliguri-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w), unicodeRange: LATIN_RANGE }));
  }
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => loaded.forEach((f) => document.fonts.add(f)))
    .catch((e) => console.error("Font load failed", e))
    .finally(() => continueRender(handle));
};

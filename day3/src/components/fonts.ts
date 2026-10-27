import { continueRender, delayRender, staticFile } from "remotion";
import { theme } from "../theme";

const BN =
  "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

const faces: Array<[string, string, string]> = [
  ["fonts/hind-siliguri-bengali-500-normal.woff2", "500", BN],
  ["fonts/hind-siliguri-bengali-700-normal.woff2", "700", BN],
  ["fonts/hind-siliguri-latin-500-normal.woff2", "500", LATIN],
  ["fonts/hind-siliguri-latin-700-normal.woff2", "700", LATIN],
];

// Fonts ship inside the project (public/fonts) — fully offline.
let started = false;
export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading Hind Siliguri");
  Promise.all(
    faces.map(async ([file, weight, range]) => {
      const f = new FontFace("Hind Siliguri", `url(${staticFile(file)})`, {
        weight,
        unicodeRange: range,
      });
      await f.load();
      document.fonts.add(f);
    }),
  )
    .catch((e) => console.error("Font load failed", e))
    .finally(() => continueRender(handle));
};

export const FONT_FAMILY = theme.fonts.display;

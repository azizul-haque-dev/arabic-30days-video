import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

const BN = "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const AR = "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC";

const faces: Parameters<typeof loadFont>[0][] = [];
for (const w of ["500", "600", "700"]) {
  faces.push({ family: "Hind Siliguri", url: staticFile(`fonts/hind-siliguri-bengali-${w}-normal.woff2`), weight: w, unicodeRange: BN });
  faces.push({ family: "Hind Siliguri", url: staticFile(`fonts/hind-siliguri-latin-${w}-normal.woff2`), weight: w, unicodeRange: LATIN });
  faces.push({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w, unicodeRange: LATIN });
}
for (const w of ["500", "700"]) {
  faces.push({ family: "Noto Sans Arabic", url: staticFile(`fonts/noto-sans-arabic-arabic-${w}-normal.woff2`), weight: w, unicodeRange: AR });
}

let promise: Promise<void> | null = null;

/** Loads every local font once (see <FontGate/> which blocks rendering until done). */
export const ensureFonts = (): Promise<void> => {
  if (!promise) {
    promise = Promise.all(faces.map((f) => loadFont(f)))
      .then(() => undefined)
      .catch((e) => console.error("Font load failed", e));
  }
  return promise;
};

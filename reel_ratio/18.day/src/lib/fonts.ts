import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

type FaceDef = { family: string; file: string; weight: string; range: string };

const BN = "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const AR = "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC";

const FACES: FaceDef[] = (["500", "600", "700"] as const).flatMap((w) => [
  { family: "Hind Siliguri", file: `fonts/hind-siliguri-bengali-${w}-normal.woff2`, weight: w, range: BN },
  { family: "Hind Siliguri", file: `fonts/hind-siliguri-latin-${w}-normal.woff2`, weight: w, range: LATIN },
  { family: "Noto Sans Arabic", file: `fonts/noto-sans-arabic-arabic-${w}-normal.woff2`, weight: w, range: AR },
]);

let started = false;

/** Loads the bundled (OFL-licensed) fonts once; blocks rendering until they are ready. */
export const loadFonts = (): void => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading Arabic Master fonts");
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
        weight: f.weight, unicodeRange: f.range,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};

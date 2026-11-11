import { continueRender, delayRender, staticFile } from "remotion";

type Face = { family: string; file: string; weight: string; range: string };

const BN = "U+0980-09FF,U+200C-200D,U+25CC";
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const AR = "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC";

const faces: Face[] = [
  ...["500", "600", "700"].flatMap((w) => [
    { family: "Hind Siliguri", file: `fonts/hind-siliguri-bengali-${w}-normal.woff2`, weight: w, range: BN },
    { family: "Hind Siliguri", file: `fonts/hind-siliguri-latin-${w}-normal.woff2`, weight: w, range: LATIN },
  ]),
  ...["500", "700"].map((w) => ({ family: "Noto Sans Arabic", file: `fonts/noto-sans-arabic-arabic-${w}-normal.woff2`, weight: w, range: AR })),
  ...["600", "800"].map((w) => ({ family: "Inter", file: `fonts/inter-latin-${w}-normal.woff2`, weight: w, range: LATIN })),
];

let started: Promise<void> | null = null;

/** Loads every bundled font; blocks rendering (delayRender) until all are ready. */
export const loadFonts = (): Promise<void> => {
  if (started) return started;
  const handle = delayRender("fonts");
  started = Promise.all(
    faces.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
        weight: f.weight,
        unicodeRange: f.range,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => undefined)
    .catch((e) => console.error("Font load failed", e))
    .finally(() => continueRender(handle));
  return started;
};

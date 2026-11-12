import { staticFile } from "remotion";

interface FaceDef {
  family: string;
  file: string;
  weight: string;
}

/** Fonts are bundled in public/fonts (SIL OFL) - no network needed at render time. */
export const FACES: FaceDef[] = [
  ...["500", "600", "700"].flatMap((w) => [
    { family: "Hind Siliguri Bengali", file: `fonts/hind-siliguri-bengali-${w}-normal.woff2`, weight: w },
    { family: "Hind Siliguri Latin", file: `fonts/hind-siliguri-latin-${w}-normal.woff2`, weight: w },
  ]),
  { family: "Noto Sans Arabic", file: "fonts/noto-sans-arabic-arabic-500-normal.woff2", weight: "500" },
  { family: "Noto Sans Arabic", file: "fonts/noto-sans-arabic-arabic-700-normal.woff2", weight: "700" },
  { family: "Inter", file: "fonts/inter-latin-600-normal.woff2", weight: "600" },
  { family: "Inter", file: "fonts/inter-latin-800-normal.woff2", weight: "800" },
];

let loading: Promise<void> | null = null;

export const loadFonts = (): Promise<void> => {
  if (!loading) {
    loading = Promise.all(
      FACES.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight });
        await face.load();
        document.fonts.add(face);
      }),
    ).then(() => document.fonts.ready.then(() => undefined));
  }
  return loading;
};

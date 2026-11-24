import {continueRender, delayRender, staticFile} from "remotion";

// Fonts are bundled in public/fonts so the project renders offline.
const FACES: {family: string; file: string; weight: string}[] = [
  {family: "Noto Sans Arabic", file: "fonts/noto-sans-arabic-arabic-700-normal.woff2", weight: "700"},
  {family: "Noto Sans Arabic", file: "fonts/noto-sans-arabic-arabic-800-normal.woff2", weight: "800"},
  {family: "Noto Sans Bengali", file: "fonts/noto-sans-bengali-bengali-600-normal.woff2", weight: "600"},
  {family: "Noto Sans Bengali", file: "fonts/noto-sans-bengali-bengali-700-normal.woff2", weight: "700"},
  {family: "Poppins", file: "fonts/poppins-latin-600-normal.woff2", weight: "600"},
  {family: "Poppins", file: "fonts/poppins-latin-700-normal.woff2", weight: "700"},
  {family: "Poppins", file: "fonts/poppins-latin-800-normal.woff2", weight: "800"},
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading Arabic Master fonts");
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {weight: f.weight});
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((e) => console.error("Font load failed", e))
    .finally(() => continueRender(handle));
}

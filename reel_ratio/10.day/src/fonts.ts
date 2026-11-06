import { staticFile } from "remotion";

const faces: { family: string; file: string; weight: string }[] = [
  { family: "HindSiliguriBn", file: "hind-siliguri-bengali-500-normal.woff2", weight: "500" },
  { family: "HindSiliguriBn", file: "hind-siliguri-bengali-600-normal.woff2", weight: "600" },
  { family: "HindSiliguriBn", file: "hind-siliguri-bengali-700-normal.woff2", weight: "700" },
  { family: "HindSiliguriLatin", file: "hind-siliguri-latin-600-normal.woff2", weight: "600" },
  { family: "HindSiliguriLatin", file: "hind-siliguri-latin-700-normal.woff2", weight: "700" },
];

/** Loads the bundled Hind Siliguri subsets (Bengali + Latin). No network needed. */
export async function loadFonts(): Promise<void> {
  const loaded = await Promise.all(
    faces.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
        weight: f.weight,
      });
      await face.load();
      return face;
    }),
  );
  loaded.forEach((f) => document.fonts.add(f));
  await document.fonts.ready;
}

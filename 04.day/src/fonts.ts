import { continueRender, delayRender, staticFile } from "remotion";

let loaded = false;

export const initFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("offline-fonts");

  const faces = [
    { family: "Hind Siliguri", file: "fonts/HindSiliguri-Regular.ttf", weight: "400" },
    { family: "Hind Siliguri", file: "fonts/HindSiliguri-SemiBold.ttf", weight: "600" },
    { family: "Hind Siliguri", file: "fonts/HindSiliguri-Bold.ttf", weight: "700" },
    { family: "Noto Naskh Arabic", file: "fonts/NotoNaskhArabic-Bold.ttf", weight: "700" },
  ];

  Promise.all(
    faces.map(async (f) => {
      try {
        const font = new FontFace(f.family, `url(${staticFile(f.file)})`, {
          weight: f.weight,
          style: "normal",
        });
        const loadedFace = await font.load();
        document.fonts.add(loadedFace);
      } catch {
        // Fallback to system font if offline file is missing
      }
    })
  ).finally(() => {
    continueRender(handle);
  });
};

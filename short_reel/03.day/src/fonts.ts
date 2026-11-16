// Local fonts (public/fonts) — offline render-e kaj kore, internet lage na.
import { continueRender, delayRender, staticFile } from "remotion";

const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const ARABIC =
  "U+0600-06FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE80-FEFC";
const BENGALI =
  "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC";

const faces = [
  { family: "Cairo", file: "cairo-arabic-800-normal.woff2", weight: "800", range: ARABIC },
  { family: "Cairo", file: "cairo-latin-800-normal.woff2", weight: "800", range: LATIN },
  { family: "Cairo", file: "cairo-arabic-700-normal.woff2", weight: "700", range: ARABIC },
  { family: "Cairo", file: "cairo-latin-700-normal.woff2", weight: "700", range: LATIN },
  { family: "NotoBengali", file: "noto-sans-bengali-bengali-700-normal.woff2", weight: "700", range: BENGALI },
  { family: "NotoBengali", file: "noto-sans-bengali-bengali-500-normal.woff2", weight: "500", range: BENGALI },
];

const handle = delayRender("Loading local fonts");
Promise.all(
  faces.map(async (f) => {
    const face = new FontFace(f.family, `url(${staticFile("fonts/" + f.file)})`, {
      weight: f.weight,
      unicodeRange: f.range,
    });
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error("Font load failed", e);
    continueRender(handle);
  });

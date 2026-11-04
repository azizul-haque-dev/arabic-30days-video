import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Separate families per script so glyph coverage never silently falls back.
const loads = [
  ...[500, 600, 700].map((w) =>
    loadFont({ family: "HindBn", url: staticFile(`fonts/hind-siliguri-bengali-${w}-normal.woff2`), weight: String(w) }),
  ),
  ...[500, 600, 700].map((w) =>
    loadFont({ family: "HindLatin", url: staticFile(`fonts/hind-siliguri-latin-${w}-normal.woff2`), weight: String(w) }),
  ),
  ...[600, 700].map((w) =>
    loadFont({ family: "NotoAr", url: staticFile(`fonts/noto-sans-arabic-arabic-${w}-normal.woff2`), weight: String(w) }),
  ),
  ...[600, 700, 800].map((w) =>
    loadFont({ family: "Poppins", url: staticFile(`fonts/poppins-latin-${w}-normal.woff2`), weight: String(w) }),
  ),
];

const handle = delayRender("Loading fonts");
Promise.all(loads)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });

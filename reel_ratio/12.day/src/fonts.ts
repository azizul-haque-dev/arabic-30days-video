import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { FONT_FAMILY, FONT_FILES, fontFile } from "./config/typography";

/** Loads the bundled woff2 files (no network needed). Rendering waits until every font is ready. */
const handle = delayRender("Loading Arabic Master fonts");
Promise.all([
  ...FONT_FILES.map((f) =>
    loadFont({ family: FONT_FAMILY, url: staticFile(fontFile(f.weight, f.script)), weight: String(f.weight), unicodeRange: f.range, format: "woff2" }),
  ),
  loadFont({ family: "Noto Sans Arabic", url: staticFile("fonts/noto-sans-arabic-arabic-400-normal.woff2"), weight: "400", format: "woff2" }),
  loadFont({ family: "Noto Sans Arabic", url: staticFile("fonts/noto-sans-arabic-arabic-700-normal.woff2"), weight: "700", format: "woff2" }),
])
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));

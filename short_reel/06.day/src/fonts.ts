import {continueRender, delayRender, staticFile} from "remotion";
import {theme} from "./theme";

type FontDef = {family: string; file: string; weight: string};

const FONT_FILES: FontDef[] = [
  ...(["600", "700"] as const).flatMap((w) => [
    {family: theme.fonts.bengali, file: `fonts/noto-sans-bengali-bengali-${w}-normal.woff2`, weight: w},
    {family: theme.fonts.bengali, file: `fonts/noto-sans-bengali-latin-${w}-normal.woff2`, weight: w},
    {family: theme.fonts.arabic, file: `fonts/noto-sans-arabic-arabic-${w}-normal.woff2`, weight: w},
    {family: theme.fonts.arabic, file: `fonts/noto-sans-arabic-latin-${w}-normal.woff2`, weight: w},
  ]),
];

/** Loads the bundled Noto fonts (offline, from /public/fonts). Call once at module load. */
export const loadFonts = () => {
  FONT_FILES.forEach(({family, file, weight}) => {
    const handle = delayRender(`Loading font ${file}`);
    const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, {weight});
    face
      .load()
      .then(() => {
        (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Font failed to load", file, err);
        continueRender(handle);
      });
  });
};

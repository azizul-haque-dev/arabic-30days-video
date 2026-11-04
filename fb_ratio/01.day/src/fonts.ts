// Fonts bundled in public/fonts (Hind Siliguri, OFL) -> works fully offline.
import { continueRender, delayRender, staticFile } from "remotion";

const FAMILIES: [string, string][] = [["HS Bengali", "bengali"], ["HS Latin", "latin"]];
const WEIGHTS = [500, 600, 700];
let started = false;

export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading Hind Siliguri");
  const jobs = FAMILIES.flatMap(([family, subset]) =>
    WEIGHTS.map((w) =>
      new FontFace(family, `url(${staticFile(`fonts/hind-siliguri-${subset}-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })
        .load()
        .then((ff) => { document.fonts.add(ff); })
    )
  );
  Promise.all(jobs).then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
};

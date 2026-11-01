// Offline fonts: Hind Siliguri files live in public/fonts (bundled with the project).
import { continueRender, delayRender, staticFile } from "remotion";

const faces: Array<[number, "bengali" | "latin", string]> = [];
for (const w of [400, 600, 700]) {
  faces.push([w, "bengali", "U+0964-0965,U+0980-09FE,U+200C-200D,U+25CC"]);
  faces.push([w, "latin", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"]);
}

let started = false;
export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("fonts");
  const css = faces
    .map(
      ([w, sub, range]) =>
        `@font-face{font-family:'Hind Siliguri';font-weight:${w};font-style:normal;font-display:block;src:url(${staticFile(
          `fonts/hind-siliguri-${sub}-${w}-normal.woff2`
        )}) format('woff2');unicode-range:${range};}`
    )
    .join("\n");
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
  Promise.all(
    [400, 600, 700].flatMap((w) =>
      [`${w} 40px 'Hind Siliguri'`].map((f) => document.fonts.load(f, "আ কখগ Abc 123 ১২৩"))
    )
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};


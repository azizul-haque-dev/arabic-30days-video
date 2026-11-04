import { continueRender, delayRender, staticFile } from "remotion";

const faces: [string, number, string, string][] = [
  ["Noto Sans Bengali", 500, "noto-sans-bengali-bengali-500-normal.woff2", "U+0980-09FF,U+200C-200D,U+25CC"],
  ["Noto Sans Bengali", 700, "noto-sans-bengali-bengali-700-normal.woff2", "U+0980-09FF,U+200C-200D,U+25CC"],
  ["Noto Sans Bengali", 800, "noto-sans-bengali-bengali-800-normal.woff2", "U+0980-09FF,U+200C-200D,U+25CC"],
  ["Noto Sans Bengali", 700, "noto-sans-bengali-latin-700-normal.woff2", "U+0000-00FF,U+2013-2014,U+2018-201D"],
  ["Noto Naskh Arabic", 600, "noto-naskh-arabic-arabic-600-normal.woff2", "U+0600-06FF,U+200C-200E,U+2010-2011,U+FB50-FDFF,U+FE70-FEFF"],
  ["Noto Naskh Arabic", 700, "noto-naskh-arabic-arabic-700-normal.woff2", "U+0600-06FF,U+200C-200E,U+2010-2011,U+FB50-FDFF,U+FE70-FEFF"],
  ["Plus Jakarta Sans", 700, "plus-jakarta-sans-latin-700-normal.woff2", "U+0000-00FF,U+2013-2014,U+2018-201D"],
  ["Plus Jakarta Sans", 800, "plus-jakarta-sans-latin-800-normal.woff2", "U+0000-00FF,U+2013-2014,U+2018-201D"],
];

export const loadFonts = () => {
  const handle = delayRender("fonts");
  Promise.all(
    faces.map(async ([family, weight, file, range]) => {
      const f = new FontFace(family, `url(${staticFile("fonts/" + file)}) format("woff2")`, {
        weight: String(weight),
        unicodeRange: range,
      });
      await f.load();
      document.fonts.add(f);
    })
  )
    .then(() => continueRender(handle))
    .catch((e) => { console.error(e); continueRender(handle); });
};

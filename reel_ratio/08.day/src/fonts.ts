import { continueRender, delayRender, staticFile } from "remotion";

const faces: [string, string, string][] = [
  ...[500, 600, 700].map((w): [string, string, string] => ["HindBn", String(w), `fonts/hind-siliguri-bengali-${w}-normal.woff2`]),
  ...[500, 600, 700].map((w): [string, string, string] => ["HindLatin", String(w), `fonts/hind-siliguri-latin-${w}-normal.woff2`]),
  ...[600, 700].map((w): [string, string, string] => ["NotoAr", String(w), `fonts/noto-sans-arabic-arabic-${w}-normal.woff2`]),
  ...[600, 700, 800].map((w): [string, string, string] => ["Poppins", String(w), `fonts/poppins-latin-${w}-normal.woff2`]),
];

const handle = delayRender("Loading fonts");
Promise.all(
  faces.map(async ([family, weight, file]) => {
    if (typeof window === "undefined" || !("FontFace" in window)) return;
    const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
    await f.load();
    document.fonts.add(f);
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });

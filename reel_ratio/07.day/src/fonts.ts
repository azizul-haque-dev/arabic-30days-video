import {continueRender, delayRender, staticFile} from "remotion";

const faces: [string, string, string][] = [
  ["Poppins", "600", "poppins-latin-600-normal.woff2"],
  ["Poppins", "700", "poppins-latin-700-normal.woff2"],
  ["Poppins", "800", "poppins-latin-800-normal.woff2"],
  ["Noto Sans Bengali", "500", "noto-sans-bengali-bengali-500-normal.woff2"],
  ["Noto Sans Bengali", "700", "noto-sans-bengali-bengali-700-normal.woff2"],
  ["Noto Sans Bengali", "800", "noto-sans-bengali-bengali-800-normal.woff2"],
  ["Noto Sans Bengali", "700", "noto-sans-bengali-latin-700-normal.woff2"],
  ["Noto Naskh Arabic", "600", "noto-naskh-arabic-arabic-600-normal.woff2"],
  ["Noto Naskh Arabic", "700", "noto-naskh-arabic-arabic-700-normal.woff2"],
];

const handle = delayRender("fonts");
Promise.all(
  faces.map(async ([family, weight, file]) => {
    const f = new FontFace(family, `url(${staticFile("fonts/" + file)})`, {weight});
    await f.load();
    document.fonts.add(f);
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });

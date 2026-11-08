import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

const BN =
  "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const AR =
  "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC";

const face = (family: string, file: string, weight: number, range: string) =>
  `@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;font-display:block;` +
  `src:url(${staticFile(`fonts/${file}`)}) format("woff2");unicode-range:${range};}`;

const css = [500, 600, 700]
  .flatMap((w) => [
    face("Hind Siliguri", `hind-siliguri-bengali-${w}-normal.woff2`, w, BN),
    face("Hind Siliguri", `hind-siliguri-latin-${w}-normal.woff2`, w, LATIN),
  ])
  .concat([600, 700, 800].map((w) => face("Noto Sans Arabic", `noto-sans-arabic-arabic-${w}-normal.woff2`, w, AR)))
  .join("\n");

const probes: [string, string][] = [
  ['700 40px "Hind Siliguri"', "আরব কেনাকাটা ১১"],
  ['700 40px "Hind Siliguri"', "Arabic Master DAY 11"],
  ['500 40px "Hind Siliguri"', "আরব"],
  ['800 40px "Noto Sans Arabic"', "كم سعر هذا؟"],
  ['600 40px "Noto Sans Arabic"', "كم سعر هذا؟"],
];

/** Blocks rendering until all bundled fonts are loaded (deterministic frames). */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(probes.map(([f, t]) => document.fonts.load(f, t)))
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return (
    <>
      <style>{css}</style>
      {ready ? children : null}
    </>
  );
};

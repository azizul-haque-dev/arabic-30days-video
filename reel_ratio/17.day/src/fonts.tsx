import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

type Face = { family: string; file: string; weight: number; range: string };

const BN = "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CF7,U+200C-200D,U+20B9,U+25CC";
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const AR = "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC";

const FACES: Face[] = [
  ...[500, 600, 700].flatMap((w): Face[] => [
    { family: "Hind Siliguri", file: `hind-siliguri-latin-${w}-normal.woff2`, weight: w, range: LATIN },
    { family: "Hind Siliguri", file: `hind-siliguri-bengali-${w}-normal.woff2`, weight: w, range: BN },
  ]),
  ...[600, 700].map((w): Face => ({ family: "Noto Sans Arabic", file: `noto-sans-arabic-arabic-${w}-normal.woff2`, weight: w, range: AR })),
  ...[600, 800].map((w): Face => ({ family: "Inter", file: `inter-latin-${w}-normal.woff2`, weight: w, range: LATIN })),
];

let loading: Promise<void> | null = null;
const loadAll = () => {
  if (!loading) {
    loading = Promise.all(
      FACES.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
          weight: String(f.weight),
          unicodeRange: f.range,
        });
        await face.load();
        (document.fonts as unknown as { add(f: FontFace): void }).add(face);
      }),
    ).then(() => document.fonts.ready.then(() => undefined));
  }
  return loading;
};

/** Blocks rendering until every bundled font is ready (offline, deterministic). */
export const FontsGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading Arabic Master fonts"));
  useEffect(() => {
    loadAll()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => {
        // fail loudly: wrong glyphs would silently break the Bengali/Arabic text
        throw new Error(`Font loading failed: ${e?.message ?? e}`);
      });
  }, [handle]);
  return ready ? <>{children}</> : null;
};

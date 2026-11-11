import React, { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";

const range = {
  bn: "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1",
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
};

type Face = { family: string; weight: number; file: string; unicodeRange: string };

/** Local, offline fonts (public/fonts). Arabic script font: see README "Fonts". */
const faces: Face[] = [
  ...[500, 600, 700].flatMap((w): Face[] => [
    { family: "Hind Siliguri", weight: w, file: `fonts/hind-siliguri-bengali-${w}-normal.woff2`, unicodeRange: range.bn },
    { family: "Hind Siliguri", weight: w, file: `fonts/hind-siliguri-latin-${w}-normal.woff2`, unicodeRange: range.latin },
  ]),
  ...[600, 800].map((w): Face => ({ family: "Inter", weight: w, file: `fonts/inter-latin-${w}-normal.woff2`, unicodeRange: range.latin })),
];

/** Blocks rendering until every face is loaded (deterministic text metrics). */
export const FontLoader: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    Promise.all(
      faces.map(async (f) => {
        const ff = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
          weight: String(f.weight),
          unicodeRange: f.unicodeRange,
        });
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(await ff.load());
      }),
    )
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle, continueRender, cancelRender]);
  return <>{children}</>;
};

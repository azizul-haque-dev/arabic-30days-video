import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

interface Face {
  family: string;
  file: string;
  weight: string;
}

/** Local fonts in /public/fonts (OFL licensed) - no network needed at render time. */
const FACES: Face[] = [
  { family: "Hind Siliguri", file: "hind-siliguri-bengali-400-normal.woff2", weight: "400" },
  { family: "Hind Siliguri", file: "hind-siliguri-bengali-600-normal.woff2", weight: "600" },
  { family: "Hind Siliguri", file: "hind-siliguri-bengali-700-normal.woff2", weight: "700" },
  { family: "Hind Siliguri Latin", file: "hind-siliguri-latin-600-normal.woff2", weight: "600" },
  { family: "Hind Siliguri Latin", file: "hind-siliguri-latin-700-normal.woff2", weight: "700" },
  { family: "Noto Sans Arabic", file: "noto-sans-arabic-arabic-500-normal.woff2", weight: "500" },
  { family: "Noto Sans Arabic", file: "noto-sans-arabic-arabic-700-normal.woff2", weight: "700" },
  { family: "Inter", file: "inter-latin-500-normal.woff2", weight: "500" },
  { family: "Inter", file: "inter-latin-600-normal.woff2", weight: "600" },
  { family: "Inter", file: "inter-latin-700-normal.woff2", weight: "700" },
];

let loading: Promise<void> | null = null;

export function loadBrandFonts(): Promise<void> {
  if (!loading) {
    loading = Promise.all(
      FACES.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
          weight: f.weight,
          style: "normal",
        });
        await face.load();
        document.fonts.add(face);
      }),
    ).then(() => undefined);
  }
  return loading;
}

/** Blocks rendering until every brand font is loaded, so text measurement is exact. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading brand fonts", { timeoutInMilliseconds: 60_000 }));
  useEffect(() => {
    loadBrandFonts()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);
  return ready ? <>{children}</> : null;
};

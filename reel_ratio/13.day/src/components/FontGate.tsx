import React, { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import "@fontsource/hind-siliguri/bengali-600.css";
import "@fontsource/hind-siliguri/bengali-700.css";
import "@fontsource/hind-siliguri/latin-600.css";
import "@fontsource/hind-siliguri/latin-700.css";
import "@fontsource/noto-sans-arabic/arabic-600.css";
import "@fontsource/noto-sans-arabic/arabic-700.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-800.css";

const FACES: Array<[string, string]> = [
  ['600 40px "Hind Siliguri"', "অআকখ"],
  ['700 40px "Hind Siliguri"', "অআকখ"],
  ['600 40px "Hind Siliguri"', "Abc 123"],
  ['700 40px "Hind Siliguri"', "Abc 123"],
  ['600 40px "Noto Sans Arabic"', "السوق"],
  ['700 40px "Noto Sans Arabic"', "السوق"],
  ['600 40px Inter', "Abc 123"],
  ['800 40px Inter', "Abc 123"],
];

/** Children render only after every font face is loaded, so text is measured with real metrics. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading fonts"));

  useEffect(() => {
    let cancelled = false;
    Promise.all(FACES.map(([font, sample]) => document.fonts.load(font, sample)))
      .then(() => document.fonts.ready)
      .then(() => {
        if (cancelled) return;
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Font loading failed", err);
        throw err;
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return ready ? <>{children}</> : null;
};

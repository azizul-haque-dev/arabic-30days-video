import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

const SAMPLES: [string, string][] = [
  ['400 40px "Hind Siliguri"', "আ A"],
  ['500 40px "Hind Siliguri"', "আ A"],
  ['600 40px "Hind Siliguri"', "আ A"],
  ['700 40px "Hind Siliguri"', "আ A"],
  ['500 40px "Noto Sans Arabic"', "جوالي"],
  ['600 40px "Noto Sans Arabic"', "جوالي"],
  ['700 40px "Noto Sans Arabic"', "جوالي"],
];

/** Loads the bundled local fonts and blocks rendering until they are ready. */
export const FontLoader: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading Arabic Master fonts"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = staticFile("fonts/fonts.css");
    document.head.appendChild(link);
    const done = () => continueRender(handle);
    link.onload = () => {
      Promise.all(SAMPLES.map(([f, t]) => document.fonts.load(f, t)))
        .then(() => document.fonts.ready)
        .then(done)
        .catch(done);
    };
    link.onerror = done;
  }, [handle]);
  return null;
};

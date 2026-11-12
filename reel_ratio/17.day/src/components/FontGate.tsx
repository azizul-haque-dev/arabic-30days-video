import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { loadFonts } from "../fonts";

/** Blocks rendering until every bundled font is loaded (needed for correct text measurement). */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading bundled fonts", { timeoutInMilliseconds: 60000 }));
  useEffect(() => {
    loadFonts()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => cancelRender(new Error(`Font loading failed: ${(e as Error).message}`)));
  }, [handle]);
  return ready ? <>{children}</> : null;
};

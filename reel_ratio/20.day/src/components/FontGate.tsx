import React, { useEffect, useLayoutEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { ensureFonts } from "../fonts";

/** Renders children only after all local fonts are loaded, so text measurement is correct. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ensureFonts().then(() => setReady(true));
  }, []);
  useLayoutEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);
  return ready ? <>{children}</> : null;
};

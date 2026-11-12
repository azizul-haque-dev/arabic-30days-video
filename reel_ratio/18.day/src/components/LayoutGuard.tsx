import React from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { runDomGuard } from "../lib/domGuard";
import { H, MARGIN, W } from "../lib/layout";

/** Only mounted when input prop `guard` is true (scripts/validate-layout.ts --dom). Fails the still render on any violation. */
export const LayoutGuard: React.FC = () => {
  const [handle] = React.useState(() => delayRender("layout guard"));
  React.useEffect(() => {
    const id = setTimeout(() => {
      const root = document.querySelector("[data-guard-root]");
      if (!root) return cancelRender(new Error("LAYOUT_GUARD: root not found"));
      const issues = runDomGuard(root, { W, H, margin: MARGIN });
      if (issues.length) cancelRender(new Error(`LAYOUT_GUARD\n${issues.join("\n")}`));
      else continueRender(handle);
    }, 120);
    return () => clearTimeout(id);
  }, [handle]);
  return null;
};

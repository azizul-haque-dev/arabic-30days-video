import React from "react";
import { theme } from "../theme";
import { useScene } from "../context";
import type { SceneTiming } from "../types";

export const sceneText = (scene: SceneTiming) => scene.cues[0]?.text ?? "";

/** Vertically centred column used by all intro/outro scenes (keeps content inside the 9:16 safe zone). */
export const Stack: React.FC<React.PropsWithChildren<{ gap?: number }>> = ({ gap = 36, children }) => (
  <div style={{ position: "absolute", left: 60, top: 250, width: 960, height: 1400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}>
    {children}
  </div>
);

export const useSceneText = () => sceneText(useScene().scene);

export const heroFont = { fontFamily: theme.fonts.en, fontWeight: 800 as const, letterSpacing: -1 };

import React from "react";
import { Audio, getRemotionEnvironment, staticFile } from "remotion";
import { CONFIG } from "../config";

export const PreviewAudio: React.FC = () => {
  const isRendering = getRemotionEnvironment().isRendering;
  if (isRendering && (!CONFIG.voiceover.enabled || !CONFIG.voiceover.includeInRender)) {
    throw new Error("Voiceover must be enabled and included when rendering.");
  }
  if (!CONFIG.voiceover.enabled) return null;
  return <Audio src={staticFile(CONFIG.voiceover.file)} volume={1} />;
};

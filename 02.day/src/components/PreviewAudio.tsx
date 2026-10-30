import React from "react";
import { Audio, staticFile, useRemotionEnvironment } from "remotion";
import { PREVIEW_VOICEOVER, RENDER_VOICEOVER } from "../config";

const SRC = staticFile("voiceover.mp3");

export const PreviewAudio: React.FC = () => {
  const env = useRemotionEnvironment();
  const enabled = env.isRendering ? RENDER_VOICEOVER : PREVIEW_VOICEOVER;

  if (!enabled) return null;
  return <Audio src={SRC} />;
};

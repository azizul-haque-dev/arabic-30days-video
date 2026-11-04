import React from "react";
import { Audio, getRemotionEnvironment, staticFile } from "remotion";
import { PREVIEW_VOICEOVER, RENDER_VOICEOVER } from "../config";

/** Plays public/voiceover.wav (or voiceover.mp3) in both Studio preview and MP4 render. */
export const PreviewAudio: React.FC = () => {
  const { isRendering } = getRemotionEnvironment();
  const enabled = isRendering ? RENDER_VOICEOVER : PREVIEW_VOICEOVER;

  if (!enabled) return null;
  return <Audio src={staticFile("voiceover.wav")} volume={1} />;
};


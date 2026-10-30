import React from "react";
import { Audio, getRemotionEnvironment, staticFile } from "remotion";
import audioConfig from "../audio-config.json";

export const PreviewAudio: React.FC = () => {
  const { isRendering } = getRemotionEnvironment();
  const enabled = audioConfig.voiceover.enabled &&
    (isRendering ? audioConfig.voiceover.includeInRender : audioConfig.voiceover.previewEnabled);
  if (!enabled) return null;
  return <Audio src={staticFile(audioConfig.voiceover.file)} volume={1} />;
};

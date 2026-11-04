import React from "react";
import { Audio, staticFile } from "remotion";
import { PREVIEW_VOICEOVER } from "../config";

export const PreviewAudio: React.FC = () => {
  if (!PREVIEW_VOICEOVER) return null;
  return (
    <Audio
      src={staticFile("voiceover.mp3")}
      volume={1.0}
    />
  );
};

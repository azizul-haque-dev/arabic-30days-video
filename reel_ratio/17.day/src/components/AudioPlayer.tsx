import React from "react";
import { Audio, staticFile } from "remotion";
import { generated } from "../episodes/timeline";

/**
 * Plays the ORIGINAL narration if public/<audioFile> exists (detected at build time by
 * scripts/prepare.ts). With no audio file the composition is simply silent — no crash.
 */
export const AudioPlayer: React.FC = () => {
  if (!generated.audio) return null;
  return <Audio src={staticFile(generated.audio.file)} />;
};

import React from "react";
import { Html5Audio, staticFile } from "remotion";

/** Plays the ORIGINAL narration (path comes from the discovery manifest - never hard-coded). */
export const AudioPlayer: React.FC<{ publicPath: string | null }> = ({ publicPath }) => {
  if (!publicPath) return null;
  return <Html5Audio src={staticFile(publicPath)} />;
};

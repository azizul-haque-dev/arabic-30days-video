import React from "react";
import { Html5Audio, getRemotionEnvironment, staticFile } from "remotion";
import manifest from "../generated/audio-manifest.json";

/**
 * Plays the ORIGINAL narration discovered at build time (scripts/discover-audio.ts → src/generated/audio-manifest.json).
 * - Studio preview without audio: allowed (nothing plays, a notice is logged once).
 * - Rendering without audio: HARD ERROR — a silent video must never be produced.
 * - `allowMissing` is only used by the layout-validation stills (they never produce a video).
 * No filesystem access happens at runtime; only `staticFile()` URLs are used.
 */
export const AudioPlayer: React.FC<{ allowMissing?: boolean }> = ({ allowMissing }) => {
  if (!manifest.found || !manifest.file) {
    if (getRemotionEnvironment().isRendering && !allowMissing) {
      throw new Error(
        "Narration audio is missing. Put the original Day 18 audio at public/audio/day-18.mp3 (or .wav), " +
          "run `npm run discover-audio`, then render again. Silent videos are not allowed.",
      );
    }
    return null;
  }
  return <Html5Audio src={staticFile(manifest.file)} />;
};

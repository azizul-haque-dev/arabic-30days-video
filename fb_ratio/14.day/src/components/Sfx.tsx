import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SFX_ENABLED } from "../config";

export type SfxName = "pop" | "click" | "whoosh" | "chime";

export const Sfx: React.FC<{
  name: SfxName;
  at?: number;
  volume?: number;
  rate?: number;
  gain?: number;
}> = ({ name, at = 0, volume, rate = 1, gain = 1 }) => {
  if (!SFX_ENABLED) return null;
  const vol = volume ?? Math.min(0.35, 0.28 * gain);
  return (
    <Sequence from={at} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} playbackRate={rate} />
    </Sequence>
  );
};

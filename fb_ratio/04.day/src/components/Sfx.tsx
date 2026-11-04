import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SFX_ENABLED } from "../config";

export type SfxName = "pop" | "click" | "tick" | "whoosh" | "chime" | "thud";

const BASE_VOL: Record<SfxName, number> = {
  pop: 0.26,
  click: 0.24,
  tick: 0.20,
  whoosh: 0.25,
  chime: 0.28,
  thud: 0.30,
};

export const Sfx: React.FC<{
  name: SfxName;
  at: number;
  gain?: number;
  playbackRate?: number;
}> = ({ name, at, gain = 1, playbackRate = 1 }) => {
  if (!SFX_ENABLED) return null;
  const vol = Math.min(0.35, BASE_VOL[name] * gain);
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={28} layout="none">
      <Audio
        src={staticFile(`sfx/${name}.wav`)}
        volume={vol}
        playbackRate={playbackRate}
      />
    </Sequence>
  );
};

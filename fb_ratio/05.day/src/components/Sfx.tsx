import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SFX_ENABLED } from "../config";

export type SfxName = "pop" | "click" | "tick" | "whoosh" | "chime" | "thud";
const LEN: Record<SfxName, number> = { pop: 0.22, click: 0.13, tick: 0.07, whoosh: 0.7, chime: 0.5, thud: 0.36 };
const BASE: Record<SfxName, number> = { pop: 0.3, click: 0.3, tick: 0.2, whoosh: 0.26, chime: 0.24, thud: 0.28 }; // 0.2–0.35, never over the voice

/** Short UI sound at frame `at` (local to the parent Sequence). `rate` = gentle pitch variation, `gain` = volume multiplier. */
export const Sfx: React.FC<{ name: SfxName; at: number; rate?: number; gain?: number }> = ({ name, at, rate = 1, gain = 1 }) => {
  const { fps } = useVideoConfig();
  if (!SFX_ENABLED) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={Math.ceil((LEN[name] / rate) * fps) + 2} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={Math.min(0.35, BASE[name] * gain)} playbackRate={rate} />
    </Sequence>
  );
};

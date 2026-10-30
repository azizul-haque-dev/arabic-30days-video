import React from "react";
import { Audio, getRemotionEnvironment, Sequence, staticFile } from "remotion";
import { CONFIG } from "./config";
import { FPS, SFX } from "./timeline";

// durations of the synthesized files (see scripts/check-sfx.mjs) and conservative base volumes (0.2–0.35)
const DUR = { pop: 0.22, click: 0.14, thud: 0.35, chime: 0.52, whoosh: 0.68, swipe: 0.42 } as const;
const BASE = { pop: 0.3, click: 0.26, thud: 0.24, chime: 0.28, whoosh: 0.26, swipe: 0.24 } as const;
const RATES = [1, 1.06, 0.95, 1.03, 0.97]; // slight pitch variation for consecutive same-type sounds

export const SfxLayer: React.FC = () => {
  if (getRemotionEnvironment().isRendering && !CONFIG.sfxEnabled) {
    throw new Error("Sound effects must be enabled when rendering.");
  }
  if (!CONFIG.sfxEnabled) return null;
  const count: Record<string, number> = {};
  return (
    <>
      {SFX.map((e, i) => {
        const k = (count[e.name] = (count[e.name] ?? -1) + 1);
        const rate = RATES[k % RATES.length];
        const vol = BASE[e.name] * (e.vol ?? 1) * (0.92 + ((k * 7) % 5) * 0.03) * CONFIG.sfxMaster;
        return (
          <Sequence key={i} from={e.at} durationInFrames={Math.ceil((DUR[e.name] / rate) * FPS) + 3} layout="none">
            <Audio src={staticFile(`sfx/${e.name}.wav`)} volume={vol} playbackRate={rate} />
          </Sequence>
        );
      })}
    </>
  );
};

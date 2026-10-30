import React, { useEffect, useState } from "react";
import { Audio, Sequence, cancelRender, continueRender, delayRender, staticFile } from "remotion";

const REQUIRED_AUDIO_FILES = [
  "voiceover.wav",
  "sfx/pop_a.wav",
  "sfx/pop_b.wav",
  "sfx/click.wav",
  "sfx/whoosh.wav",
  "sfx/swipe.wav",
  "sfx/chime.wav",
  "sfx/thud.wav",
] as const;

export const PreviewAudio: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading required audio assets"));
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    Promise.all(
      REQUIRED_AUDIO_FILES.map(async (file) => {
        const response = await fetch(staticFile(file), { method: "HEAD" });
        if (!response.ok) {
          throw new Error(`Required audio asset "${file}" returned HTTP ${response.status}`);
        }
      }),
    ).then(
      () => {
        setAssetsReady(true);
        continueRender(handle);
      },
      (error: unknown) => {
        cancelRender(error instanceof Error ? error : new Error(String(error)));
      },
    );
  }, [handle]);

  if (!assetsReady) return null;
  return <Audio src={staticFile("voiceover.wav")} volume={1} />;
};

// ─── SFX ──────────────────────────────────────────────────────────────────────
export type SfxName = "pop_a" | "pop_b" | "click" | "whoosh" | "swipe" | "chime" | "thud";
export type SfxEvent = { frame: number; name: SfxName; volume?: number };

const LEN: Record<SfxName, number> = { pop_a: 0.24, pop_b: 0.2, click: 0.14, whoosh: 0.7, swipe: 0.38, chime: 0.55, thud: 0.32 };
const VOL: Record<SfxName, number> = { pop_a: 0.3, pop_b: 0.3, click: 0.26, whoosh: 0.3, swipe: 0.26, chime: 0.28, thud: 0.3 };

export const SfxLayer: React.FC<{ events: SfxEvent[]; fps: number }> = ({ events, fps }) => (
  <>
    {events.map((e, i) => (
      <Sequence key={i} from={Math.max(0, e.frame)} durationInFrames={Math.ceil(LEN[e.name] * fps) + 2} layout="none">
        <Audio src={staticFile(`sfx/${e.name}.wav`)} volume={e.volume ?? VOL[e.name]} />
      </Sequence>
    ))}
  </>
);

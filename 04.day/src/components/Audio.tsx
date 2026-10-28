import React, { useEffect, useState } from "react";
import { Audio, Sequence, continueRender, delayRender, getRemotionEnvironment, staticFile } from "remotion";

// ─── Voiceover preview ────────────────────────────────────────────────────────
// Plays public/voiceover.mp3 (if the file exists) so the Studio preview can be checked against the narration.
// Flag: set VOICEOVER_IN_RENDER = true to also bake it into rendered files. Default: off in renders.
export const VOICEOVER_IN_RENDER = false;

export const PreviewAudio: React.FC = () => {
  const env = getRemotionEnvironment();
  const active = !env.isRendering || VOICEOVER_IN_RENDER;
  const [handle] = useState(() => (active ? delayRender("voiceover check") : null));
  const [exists, setExists] = useState(false);
  useEffect(() => {
    if (handle === null) return;
    fetch(staticFile("voiceover.mp3"), { method: "HEAD" })
      .then((r) => setExists(r.ok && (r.headers.get("content-type") ?? "").includes("audio")))
      .catch(() => setExists(false))
      .finally(() => continueRender(handle));
  }, [handle]);
  if (!active || !exists) return null;
  return <Audio src={staticFile("voiceover.mp3")} volume={1} />;
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

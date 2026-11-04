import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { BgMesh, Finish, Wipe } from "./components/layers";
import { SceneShell } from "./components/primitives";
import { theme } from "./theme";
import { SENTENCES } from "./data/script";
import { SCENES, T, spanOf } from "./timeline";
import { Hook, Brand, Progress60, Steps } from "./scenes/Intro";
import { Sentence } from "./scenes/Sentence";
import { Recap, Bar70, Cta, Outro } from "./scenes/Outro";

/**
 * Audio is mandatory in every final video render and Studio preview.
 * Voiceover and sound effects must be enabled during rendering.
 * Never silently omit audio or ignore audio-loading errors.
 */
export const VOICE_OVER_ENABLED = true;
export const SFX_ENABLED = true;

const VoiceoverAudio: React.FC = () => {
  const [handle] = useState(() => delayRender("check mandatory voiceover"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(staticFile("voiceover.mp3"), { method: "HEAD" })
      .then((r) => {
        if (!r.ok) {
          const err = new Error(
            `Mandatory voiceover file "public/voiceover.mp3" failed to load (HTTP ${r.status}). Audio is mandatory in every final video render.`
          );
          cancelRender(err);
          return;
        }
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => {
        const error =
          err instanceof Error
            ? err
            : new Error(`Mandatory voiceover file "public/voiceover.mp3" failed to load: ${String(err)}`);
        cancelRender(error);
      });
  }, [handle]);

  if (!ready) {
    return null;
  }

  return (
    <Audio
      src={staticFile("voiceover.mp3")}
      onError={(err) => {
        const error =
          err instanceof Error
            ? err
            : new Error(`Voiceover playback error in "public/voiceover.mp3": ${String(err)}`);
        cancelRender(error);
      }}
    />
  );
};

const render = (id: string): React.ReactNode => {
  switch (id) {
    case "hook": return <Hook />;
    case "brand": return <Brand />;
    case "p60": return <Progress60 />;
    case "steps": return <Steps />;
    case "recap": return <Recap />;
    case "bar": return <Bar70 />;
    case "cta": return <Cta />;
    case "outro": return <Outro />;
    default: {
      const i = T.sentences.findIndex((s) => "s" + s.n === id);
      return <Sentence d={T.sentences[i]} idx={i} />;
    }
  }
};

const wipes: { id: string; accent?: boolean }[] = [{ id: "brand" }, { id: "s61", accent: true }, { id: "recap" }, { id: "cta", accent: true }];

export const Main: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: theme.font.family, letterSpacing: 0 }}>
    <BgMesh />
    {SCENES.map((s, i) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
        <SceneShell dur={s.dur} last={i === SCENES.length - 1}>{render(s.id)}</SceneShell>
      </Sequence>
    ))}
    {wipes.map((w) => (
      <Sequence key={"w" + w.id} from={Math.max(0, spanOf(w.id).from - 12)} durationInFrames={30} layout="none" name={"wipe-" + w.id}>
        <Wipe c={14} accent={w.accent} />
      </Sequence>
    ))}
    <Finish />
    <VoiceoverAudio />
  </AbsoluteFill>
);
void SENTENCES;

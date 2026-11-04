import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import "./fonts";
import { SCENES } from "./timing";
import { BgMesh, Grade, Grain, PreviewAudio, SceneFrame, SfxTrack, Transitions, Vignette } from "./components/primitives";
import { Hook } from "./scenes/Hook";
import { Series } from "./scenes/Series";
import { Today } from "./scenes/Today";
import { Sentence } from "./scenes/Sentence";
import { Recap } from "./scenes/Recap";
import { Cta } from "./scenes/Cta";

export type MainProps = {
  requireVoiceover?: boolean;
  voiceoverFile?: string;
};

export const Main: React.FC<MainProps> = ({ voiceoverFile }) => (
  <AbsoluteFill>
    <BgMesh />
    {SCENES.map((s, i) => (
      <Sequence key={s.id} from={s.start} durationInFrames={s.end - s.start} name={s.id}>
        <SceneFrame exit={i !== SCENES.length - 1}>
          {s.kind === "hook" && <Hook />}
          {s.kind === "series" && <Series />}
          {s.kind === "today" && <Today />}
          {s.kind === "sentence" && <Sentence scene={s} />}
          {s.kind === "recap" && <Recap />}
          {s.kind === "cta" && <Cta />}
        </SceneFrame>
      </Sequence>
    ))}
    <Transitions />
    <Grade />
    <Grain />
    <Vignette />
    <PreviewAudio file={voiceoverFile} />
    <SfxTrack />
  </AbsoluteFill>
);

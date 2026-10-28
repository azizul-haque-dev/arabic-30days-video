import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { FontGate } from "./fonts";
import { BgMesh, Grade, Grain, Vignette } from "./components/Backdrop";
import { PreviewAudio, SfxLayer } from "./components/Audio";
import { sentences } from "./data/script";
import { sceneOf, sentenceTimings } from "./timing";
import { buildSfx } from "./sfx";
import { Go, Hook, How, Lesson } from "./scenes/IntroScenes";
import { Cta, Outro, Question, Recap, Tagline } from "./scenes/OutroScenes";
import { SentenceScene } from "./scenes/SentenceScene";

const at = (id: string, node: React.ReactNode) => {
  const s = sceneOf(id);
  return <Sequence key={id} from={s.start} durationInFrames={s.end - s.start} name={id}>{node}</Sequence>;
};

const sfx = buildSfx();

export const Main: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <FontGate>
      <AbsoluteFill>
        <BgMesh />
        {at("hook", <Hook />)}
        {at("lesson", <Lesson />)}
        {at("how", <How />)}
        {at("go", <Go />)}
        {sentenceTimings.map((t) => at(`s${t.n}`, <SentenceScene s={sentences[t.n - 1]} t={t} />))}
        {at("recap", <Recap />)}
        {at("question", <Question />)}
        {at("tagline", <Tagline />)}
        {at("cta", <Cta />)}
        {at("outro", <Outro />)}
        <Grade />
        <Grain />
        <Vignette />
        <SfxLayer events={sfx} fps={fps} />
        <PreviewAudio />
      </AbsoluteFill>
    </FontGate>
  );
};

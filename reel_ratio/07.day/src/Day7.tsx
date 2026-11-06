import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import "./fonts";
import {BgMesh, Finish} from "./components/Layers";
import {Wipes} from "./components/Wipes";
import {Intro} from "./scenes/Intro";
import {Outro} from "./scenes/Outro";
import {SentenceScene} from "./scenes/SentenceScene";
import {BOUNDARIES} from "./timing";

export const Day7: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const starts = [0, ...BOUNDARIES.map(f)]; // intro, 10 sentences, outro
  return (
    <AbsoluteFill>
      <BgMesh />
      <Sequence from={0} durationInFrames={starts[1]}>
        <Intro />
      </Sequence>
      {Array.from({length: 10}).map((_, i) => (
        <Sequence key={i} from={starts[i + 1]} durationInFrames={starts[i + 2] - starts[i + 1]}>
          <SentenceScene i={i} len={starts[i + 2] - starts[i + 1]} />
        </Sequence>
      ))}
      <Sequence from={starts[11]} durationInFrames={durationInFrames - starts[11]}>
        <Outro />
      </Sequence>
      <Wipes />
      <Finish />
      <Audio src={staticFile("voiceover.mp3")} />
    </AbsoluteFill>
  );
};

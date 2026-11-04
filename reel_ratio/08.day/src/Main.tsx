import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { WipePanel } from "./components/Motion";
import { IntroBrand, IntroHook, IntroProgress, IntroToday } from "./scenes/Intro";
import { OutroDone, OutroEnd, OutroFollow, OutroProgress } from "./scenes/Outro";
import { SentenceScene } from "./scenes/Sentence";
import { Thumbnail } from "./scenes/Thumbnail";
import { scenes, sec, sentences } from "./timeline";

const fixed: Record<string, React.FC> = {
  thumb: Thumbnail, i1: IntroHook, i2: IntroBrand, i3: IntroProgress, i4: IntroToday,
  o1: OutroDone, o2: OutroProgress, o3: OutroFollow, o4: OutroEnd,
};

// SFX cues: [frame, file, volume]. Placed 2-3 frames BEFORE the visual lands; kept well under the voice-over.
const sfx: [number, string, number][] = [];
scenes.forEach((sc, i) => {
  if (i > 0) sfx.push([sc.from - 9, "whoosh", 0.22]);
});
sentences.forEach((s) => {
  sfx.push([sec(s.tScene) + 3, "pop", 0.3]);
  sfx.push([sec(s.tArabic) - 3, "ding", 0.22]);
  sfx.push([sec(s.tMeaning) - 3, "tick", 0.3]);
});
const o1 = scenes.find((s) => s.key === "o1");
if (o1) sfx.push([o1.from + 6, "chime", 0.3]);

export const Main: React.FC = () => (
  <AbsoluteFill>
    <BgMesh />
    <Audio src={staticFile("voiceover.mp3")} />
    {scenes.map((sc) => {
      const s = sentences.find((x) => `s${x.n}` === sc.key);
      const idx = s ? sentences.indexOf(s) : 0;
      const Fixed = fixed[sc.key];
      return (
        <Sequence key={sc.key} from={sc.from} durationInFrames={sc.duration} name={sc.key}>
          {s ? <SentenceScene s={s} index={idx} /> : <Fixed />}
        </Sequence>
      );
    })}
    <Grade />
    <Grain />
    <Vignette />
    {scenes.slice(1).map((sc) => (
      <Sequence key={`w-${sc.key}`} from={sc.from - 8} durationInFrames={14} name={`wipe-${sc.key}`}>
        <WipePanel />
      </Sequence>
    ))}
    {sfx.map(([f, file, vol], i) => (
      <Sequence key={i} from={Math.max(0, f)} durationInFrames={60} name={`sfx-${file}`}>
        <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BgMesh, Grade, Grain, Vignette, Wipe } from "./components/fx";
import { DURATION, T, f, sentences } from "./data";
import { AirportIntro, Opening, Range, Uses } from "./scenes/Intro";
import { SentenceScene } from "./scenes/Sentence";
import { Outro } from "./scenes/Outro";
import { loadFonts } from "./fonts";

loadFonts();

const sfx = (name: string, at: number, volume = 0.3) => (
  <Sequence key={name + at} from={Math.max(0, at)}><Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} /></Sequence>
);

export const Main: React.FC = () => {
  const boundaries = [T.opening[1], T.range[1], T.uses[1], ...sentences.map((s) => s.E), T.airportIntro[1]];
  return (
    <AbsoluteFill
      style={{
        scale: 1.024
      }}
    >
      <BgMesh />
      <Sequence from={0} durationInFrames={f(T.opening[1])}><Opening /></Sequence>
      <Sequence from={f(T.range[0])} durationInFrames={f(T.range[1]) - f(T.range[0])}><Range /></Sequence>
      <Sequence from={f(T.uses[0])} durationInFrames={f(T.uses[1]) - f(T.uses[0])}><Uses /></Sequence>
      {sentences.map((s) => (
        <Sequence key={s.n} from={f(s.S)} durationInFrames={f(s.E) - f(s.S)}><SentenceScene s={s} /></Sequence>
      ))}
      <Sequence from={f(T.airportIntro[0])} durationInFrames={f(T.airportIntro[1]) - f(T.airportIntro[0])}><AirportIntro /></Sequence>
      <Sequence from={f(156.64)} durationInFrames={DURATION - f(156.64)}><Outro /></Sequence>

      <Grade />
      {boundaries.map((b) => <Wipe key={b} at={f(b)} />)}
      <Grain />
      <Vignette />

      <Audio src={staticFile("vo.mp3")} volume={1} />
      {boundaries.map((b) => sfx("whoosh", f(b) - 6, 0.28))}
      {sentences.map((s) => sfx("pop", f(s.arabicIn), 0.3))}
      {sentences.map((s) => sfx("ding", f(s.meaningIn), 0.25))}
      {sfx("pop", f(161.3), 0.3)}{sfx("ding", f(164.4), 0.25)}{sfx("pop", f(167.0), 0.3)}{sfx("pop", f(169.2), 0.3)}
    </AbsoluteFill>
  );
};

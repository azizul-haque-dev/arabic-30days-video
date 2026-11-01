import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { initFonts } from "./fonts";
import { INTRO_SCENES, SENTENCE_BEATS, OUTRO_SCENES } from "./timing";
import { LESSONS } from "./content";
import { BgMesh, Grade, Grain, TransitionWipe, Vignette } from "./components/Chrome";
import { PreviewAudio } from "./components/PreviewAudio";
import { Sfx } from "./components/Sfx";
import { BrandScene, HookScene, ProgressScene, TopicScene } from "./scenes/Intro";
import { SentenceScene } from "./scenes/Sentence";
import { CommentScene, EndScene, FollowScene, RecapScene, StatementScene } from "./scenes/Outro";

initFonts();

export const Main: React.FC = () => {
  const allBoundaries = [
    ...INTRO_SCENES.slice(1).map((s) => s.from),
    ...SENTENCE_BEATS.map((b) => b.from),
    ...OUTRO_SCENES.map((s) => s.from),
  ];

  return (
    <AbsoluteFill>
      <BgMesh />

      <Sequence from={INTRO_SCENES[0].from} durationInFrames={INTRO_SCENES[0].duration}>
        <HookScene duration={INTRO_SCENES[0].duration} />
      </Sequence>
      <Sequence from={INTRO_SCENES[1].from} durationInFrames={INTRO_SCENES[1].duration}>
        <BrandScene duration={INTRO_SCENES[1].duration} />
      </Sequence>
      <Sequence from={INTRO_SCENES[2].from} durationInFrames={INTRO_SCENES[2].duration}>
        <ProgressScene duration={INTRO_SCENES[2].duration} />
      </Sequence>
      <Sequence from={INTRO_SCENES[3].from} durationInFrames={INTRO_SCENES[3].duration}>
        <TopicScene duration={INTRO_SCENES[3].duration} />
      </Sequence>

      {SENTENCE_BEATS.map((beat, i) => (
        <Sequence key={beat.num} from={beat.from} durationInFrames={beat.duration}>
          <SentenceScene item={LESSONS[i]} beat={beat} index={i + 1} />
        </Sequence>
      ))}

      <Sequence from={OUTRO_SCENES[0].from} durationInFrames={OUTRO_SCENES[0].duration}>
        <RecapScene duration={OUTRO_SCENES[0].duration} />
      </Sequence>
      <Sequence from={OUTRO_SCENES[1].from} durationInFrames={OUTRO_SCENES[1].duration}>
        <CommentScene duration={OUTRO_SCENES[1].duration} />
      </Sequence>
      <Sequence from={OUTRO_SCENES[2].from} durationInFrames={OUTRO_SCENES[2].duration}>
        <StatementScene duration={OUTRO_SCENES[2].duration} />
      </Sequence>
      <Sequence from={OUTRO_SCENES[3].from} durationInFrames={OUTRO_SCENES[3].duration}>
        <FollowScene duration={OUTRO_SCENES[3].duration} />
      </Sequence>
      <Sequence from={OUTRO_SCENES[4].from} durationInFrames={OUTRO_SCENES[4].duration}>
        <EndScene duration={OUTRO_SCENES[4].duration} />
      </Sequence>

      {allBoundaries.map((cut) => (
        <React.Fragment key={cut}>
          <TransitionWipe at={cut} />
          <Sfx name="whoosh" at={cut - 6} gain={0.85} />
        </React.Fragment>
      ))}

      <Grade />
      <Grain />
      <Vignette />
      <PreviewAudio />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AudioPlayer } from "./components/AudioPlayer";
import { BgMesh, FinishLayers } from "./components/Backdrop";
import { ClosingBeat, FollowBeat, OutroProgressBeat, SaveBeat } from "./components/EpisodeOutro";
import { DayBeat, IntroProgressBeat, RangeBeat, StartBeat, WelcomeBeat } from "./components/EpisodeIntro";
import { EpisodeThumbnail } from "./components/EpisodeThumbnail";
import { SentenceScene } from "./components/SentenceScene";
import { SubtitleSync } from "./components/SubtitleSync";
import { FontsGate } from "./fonts";
import { sentences } from "./episodes/active";
import { buildScenes, type Scene } from "./episodes/timeline";

const scenes = buildScenes();

const renderScene = (s: Scene, isFirstSentence: boolean) => {
  if (s.type === "sentence") {
    return <SentenceScene sentence={s.sentence} sceneStartSec={s.startSec} durationInFrames={s.duration} wipeIn={isFirstSentence} />;
  }
  const p = { durationInFrames: s.duration, startSec: s.startSec, cues: s.cues };
  switch (s.kind) {
    case "thumbnail":
      return <EpisodeThumbnail durationInFrames={s.duration} />;
    case "welcome":
      return <WelcomeBeat {...p} />;
    case "day":
      return <DayBeat {...p} />;
    case "progress":
      return <IntroProgressBeat {...p} />;
    case "range":
      return <RangeBeat {...p} />;
    case "start":
      return <StartBeat {...p} firstSentenceNo={sentences[0].no} />;
    case "outro-progress":
      return <OutroProgressBeat {...p} />;
    case "save":
      return <SaveBeat {...p} />;
    case "follow":
      return <FollowBeat {...p} />;
    case "closing":
      return <ClosingBeat {...p} />;
  }
};

export const Episode: React.FC<{ showCues?: boolean }> = ({ showCues = false }) => {
  let firstSentenceSeen = false;
  return (
    <FontsGate>
      <AbsoluteFill>
        <BgMesh />
        {scenes.map((s) => {
          const first = s.type === "sentence" && !firstSentenceSeen;
          if (s.type === "sentence") firstSentenceSeen = true;
          return (
            <Sequence key={s.key} name={s.key} from={s.from} durationInFrames={s.duration}>
              {renderScene(s, first)}
            </Sequence>
          );
        })}
        <FinishLayers />
        <SubtitleSync show={showCues} />
        <AudioPlayer />
      </AbsoluteFill>
    </FontsGate>
  );
};

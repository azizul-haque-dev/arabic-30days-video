import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BackgroundMesh, PostLayers } from "../components/BackgroundLayers";
import { LayoutGuard } from "../components/LayoutGuard";
import { AudioPlayer } from "../components/AudioPlayer";
import { SentenceScene } from "../components/SentenceScene";
import { SectionIntro } from "../components/SectionIntro";
import {
  IntroConfidenceScene, IntroCountScene, IntroLayoutScene, IntroProgressScene, IntroSplitScene, IntroTitleScene, OpeningScene,
} from "../components/IntroScenes";
import {
  OutroDoneScene, OutroFinalScene, OutroFollowScene, OutroGoalScene, OutroNextScene, OutroPracticeScene, OutroShareScene,
} from "../components/OutroScenes";
import { SENTENCES } from "../episodes/day-18/sentences";
import { placeScenes, type PlacedScene } from "../episodes/day-18/timeline";

export type Day18Props = { fps: number; totalFrames: number; guard?: boolean };

const renderScene = (sc: PlacedScene): React.ReactNode => {
  const d = sc.durationInFrames;
  switch (sc.kind) {
    case "opening": return <OpeningScene durationInFrames={d} />;
    case "introSplit": return <IntroSplitScene durationInFrames={d} />;
    case "introConfidence": return <IntroConfidenceScene durationInFrames={d} />;
    case "introTitle": return <IntroTitleScene durationInFrames={d} />;
    case "introProgress": return <IntroProgressScene durationInFrames={d} />;
    case "introCount": return <IntroCountScene durationInFrames={d} />;
    case "introLayout": return <IntroLayoutScene durationInFrames={d} />;
    case "section": return <SectionIntro section={sc.section!} durationInFrames={d} />;
    case "sentence": {
      const sentence = SENTENCES.find((s) => s.id === sc.sentenceId);
      if (!sentence) throw new Error(`Sentence ${sc.sentenceId} not found in sentences.ts`);
      return <SentenceScene sentence={sentence} from={sc.from} durationInFrames={d} />;
    }
    case "outroDone": return <OutroDoneScene durationInFrames={d} />;
    case "outroPractice": return <OutroPracticeScene durationInFrames={d} />;
    case "outroGoal": return <OutroGoalScene durationInFrames={d} />;
    case "outroShare": return <OutroShareScene durationInFrames={d} />;
    case "outroFollow": return <OutroFollowScene durationInFrames={d} />;
    case "outroNext": return <OutroNextScene durationInFrames={d} />;
    case "outroFinal": return <OutroFinalScene durationInFrames={d} />;
  }
};

export const Day18Video: React.FC<Day18Props> = ({ fps, totalFrames, guard }) => {
  const scenes = React.useMemo(() => placeScenes(fps, totalFrames), [fps, totalFrames]);
  return (
    <AbsoluteFill data-guard-root="1">
      <BackgroundMesh />
      {scenes.map((sc) => (
        <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames} name={sc.id} layout="absolute-fill">
          {renderScene(sc)}
        </Sequence>
      ))}
      <PostLayers />
      <AudioPlayer allowMissing={guard} />
      {guard ? <LayoutGuard /> : null}
    </AbsoluteFill>
  );
};

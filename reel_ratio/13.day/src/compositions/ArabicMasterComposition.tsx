import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { episodeConfig as E } from "../config/episode";
import { SceneContext } from "../animation/motion";
import { Background } from "../components/Background";
import { FontGate } from "../components/FontGate";
import type { Timeline, SceneTimeline } from "../timeline/build";
import { BrandScene, EpisodeIntroScene, HookScene, OutroScene, TopicIntroScene } from "../scenes/IntroScenes";
import { SentenceScene } from "../scenes/SentenceScene";
import { CtaScene, SummaryScene } from "../scenes/OutroScenes";

export type CompositionProps = { timeline: Timeline };

const renderScene = (scene: SceneTimeline): React.ReactNode => {
  const d = scene.data;
  switch (d.kind) {
    case "hook": return <HookScene />;
    case "brand": return <BrandScene />;
    case "episodeIntro": return <EpisodeIntroScene lineBAt={d.lineBAt} />;
    case "topicIntro": return <TopicIntroScene lineBAt={d.lineBAt} />;
    case "sentence": return <SentenceScene {...d} />;
    case "summary": return <SummaryScene lineAt={d.lineAt} />;
    case "cta": return <CtaScene commentAt={d.commentAt} />;
    case "outro": return <OutroScene />;
  }
};

/**
 * Data-driven episode. Scenes are contiguous, non-overlapping Sequences, so
 * outgoing and incoming text can never be on screen together.
 */
export const ArabicMasterComposition: React.FC<CompositionProps> = ({ timeline }) => (
  <FontGate>
    <AbsoluteFill>
      <Background />
      {timeline.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} name={scene.id}>
          <SceneContext.Provider value={{ durationInFrames: scene.durationInFrames, id: scene.id }}>
            <AbsoluteFill>{renderScene(scene)}</AbsoluteFill>
          </SceneContext.Provider>
        </Sequence>
      ))}
      {E.audio.enabled ? <Audio src={staticFile(E.audio.file)} volume={E.audio.volume} /> : null}
    </AbsoluteFill>
  </FontGate>
);

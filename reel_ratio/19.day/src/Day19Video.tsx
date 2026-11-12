import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { BgMesh, FinishLayers } from "./components/Background";
import { ChallengeScene } from "./components/ChallengeScene";
import { IntroScene } from "./components/IntroScene";
import { OpeningScene } from "./components/OpeningScene";
import { OutroScene } from "./components/OutroScene";
import { SectionTitle } from "./components/SectionTitle";
import { SentenceScene } from "./components/SentenceScene";
import { SceneShell } from "./components/SceneShell";
import { AnimatedIllustration } from "./components/AnimatedIllustration";
import { BrandTag } from "./components/BrandTag";
import { FontGate } from "./design/fonts";
import type { EpisodeContent, EpisodeTimeline } from "./types";

export const EpisodeVideo: React.FC<{ content: EpisodeContent; timeline: EpisodeTimeline }> = ({ content, timeline }) => {
  const sample = timeline.srt.isSample;
  return (
    <FontGate>
      <AbsoluteFill>
        <BgMesh />
        {timeline.audio ? <Html5Audio src={staticFile(timeline.audio.file)} /> : null}
        {timeline.scenes.map((scene, i) => {
          const key = `${scene.type}-${i}`;
          const dur = Math.max(1, scene.endFrame - scene.startFrame);
          return (
            <Sequence key={key} from={scene.startFrame} durationInFrames={dur} name={scene.type === "sentence" ? `Sentence ${scene.number}` : scene.type}>
              {scene.type === "opening" ? <OpeningScene scene={scene} content={content} /> : null}
              {scene.type === "intro" ? <IntroScene content={content} /> : null}
              {scene.type === "section" ? (
                <SceneShell>
                  <BrandTag brand={content.brand} day={content.episode} sample={sample} />
                  <AnimatedIllustration id="section" top={350} />
                  <SectionTitle title={content.sectionTitle} />
                </SceneShell>
              ) : null}
              {scene.type === "sentence" ? (
                <SentenceScene
                  scene={scene}
                  sentence={content.sentences.find((s) => s.number === scene.number)!}
                  content={content}
                  sample={sample}
                />
              ) : null}
              {scene.type === "challenge" ? <ChallengeScene scene={scene} content={content} sample={sample} /> : null}
              {scene.type === "outro" ? <OutroScene content={content} /> : null}
            </Sequence>
          );
        })}
        <FinishLayers />
      </AbsoluteFill>
    </FontGate>
  );
};

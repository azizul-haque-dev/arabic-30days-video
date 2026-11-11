import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";
import type { SentenceConfig } from "../config/episodeConfig";
import type { BuiltScene } from "../config/timeline";
import { Chip } from "./brand";
import { Stage, Zone } from "./layout";
import { MeaningPanel, PronPanel } from "./sentencePanel";
import { SceneShell, TopBar } from "./scene";
import { enter } from "../utils/motion";

export type ArtProps = { frame: number; fps: number; dur: number; w: number; h: number };

/** Shared layout for every sentence scene: top bar, stage (art), pronunciation + meaning. */
export const SentenceScene: React.FC<{
  scene: BuiltScene;
  sentence: SentenceConfig;
  Art: React.FC<ArtProps>;
}> = ({ scene, sentence, Art }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = theme.layout.zones.sStage;
  const p = enter(frame, fps, 3, "gentle");
  const beats = scene.beats!;
  return (
    <SceneShell dur={scene.dur}>
      <TopBar right={<Chip id="sentence-no" tone="amber" size={38}>{`Sentence ${sentence.n}`}</Chip>} />
      <Stage zone="sStage" opacity={Math.min(1, p * 1.6)} scale={0.94 + 0.06 * Math.min(p, 1)} translateY={(1 - Math.min(p, 1)) * 40}>
        <Art frame={frame} fps={fps} dur={scene.dur} w={z.w} h={z.h} />
      </Stage>
      <PronPanel variants={sentence.pronunciation} p1={beats.pron1} p2={beats.pron2} dur={scene.dur} />
      <MeaningPanel text={sentence.meaning} at={beats.meaning} />
      {sentence.arabic ? (
        <Zone zone="pron">
          <div />
        </Zone>
      ) : null}
    </SceneShell>
  );
};

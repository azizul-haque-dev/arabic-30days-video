import React, { useMemo } from "react";
import { episode } from "../config/episode";
import { getSceneSpec } from "../config/sceneSpecs";
import { BrandHeader, DotsBar, rectOf } from "../components/Ui";
import { IllustrationZone } from "../components/Illustration";
import { SceneShell } from "../components/SceneShell";
import { SpecTexts } from "../components/SpecTexts";
import type { TimelineScene } from "../types";

/**
 * Reusable sentence scene. All content (pronunciation, meaning, illustration layers) comes from
 * episode.config.json; the reveal times (pron / alt / meaning) come from the SRT-derived cues.
 * Order: number badge -> illustration -> pronunciation -> (alternative) -> meaning.
 */
export const SentenceScene: React.FC<{ scene: TimelineScene }> = ({ scene }) => {
  const spec = useMemo(() => getSceneSpec("sentence", episode, scene.sentence), [scene.sentence]);
  const current = (scene.sentence ?? episode.sentenceStart) - episode.sentenceStart;
  return (
    <SceneShell duration={scene.durationFrames}>
      <BrandHeader spec={spec} />
      <IllustrationZone zone={spec.illustrations[0]} duration={scene.durationFrames} delay={6} />
      <DotsBar rect={rectOf(spec, "progress")} current={current} delay={10} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.05} />
    </SceneShell>
  );
};

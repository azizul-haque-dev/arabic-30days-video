import React, { useMemo } from "react";
import { episode } from "../config/episode";
import { getSceneSpec } from "../config/sceneSpecs";
import { BrandHeader, ChipPanels, Logo, Panel, ProgressBar, Ripples, rectOf } from "../components/Ui";
import { IllustrationZone } from "../components/Illustration";
import { SceneShell } from "../components/SceneShell";
import { SpecTexts } from "../components/SpecTexts";
import { theme } from "../theme";
import { InstantContext, useBreathe, useEnter } from "../utils/motion";
import type { TimelineScene } from "../types";

type P = { scene: TimelineScene };
const useSpec = (s: TimelineScene) => useMemo(() => getSceneSpec(s.kind, episode, s.sentence), [s.kind, s.sentence]);

/** Scene 1 - fully designed on frame 0 (instant entrances), then idle motion only. */
export const ThumbnailScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <InstantContext.Provider value={true}>
      <SceneShell duration={scene.durationFrames}>
        <BrandHeader spec={spec} />
        <IllustrationZone zone={spec.illustrations[0]} duration={scene.durationFrames} />
        <SpecTexts texts={spec.texts} cues={scene.cues} />
      </SceneShell>
    </InstantContext.Provider>
  );
};

export const StoryScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <BrandHeader spec={spec} />
      <IllustrationZone zone={spec.illustrations[0]} duration={scene.durationFrames} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.35} />
    </SceneShell>
  );
};

export const BrandScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  const r = rectOf(spec, "logoBig");
  return (
    <SceneShell duration={scene.durationFrames}>
      <Ripples cx={r.x + r.w / 2} cy={r.y + r.h / 2} minR={r.w / 2} maxR={r.w / 2 + 50} />
      <Logo rect={r} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.3} />
    </SceneShell>
  );
};

export const EpisodeScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  const pr = rectOf(spec, "dayPanel");
  const ring = 1 + useBreathe(0.025, 2.4);
  const p = useEnter(10, "soft");
  return (
    <SceneShell duration={scene.durationFrames}>
      <div style={{ position: "absolute", left: pr.x - 14, top: pr.y - 14, width: pr.w + 28, height: pr.h + 28, borderRadius: "50%", border: `6px solid ${theme.colors.accent}`, opacity: 0.8 * p, transform: `scale(${ring})` }} />
      <Panel rect={pr} fill="primary" round delay={4} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.15} />
    </SceneShell>
  );
};

export const ProgressDoneScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <ProgressBar rect={rectOf(spec, "bar")} value={episode.previousCompletedSentences / episode.totalSentences} delay={14} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};

export const TopicScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <BrandHeader spec={spec} />
      <ChipPanels spec={spec} />
      <Panel rect={rectOf(spec, "topicPanel")} fill="white" radius={48} delay={scene.cues.title ?? 0} />
      <IllustrationZone zone={spec.illustrations[0]} duration={scene.durationFrames} delay={scene.cues.title ?? 0} card={false} />
      <Panel rect={rectOf(spec, "goPill")} fill="accent" radius={60} delay={scene.cues.go ?? 0} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};


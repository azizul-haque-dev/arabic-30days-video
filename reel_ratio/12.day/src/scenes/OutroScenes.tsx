import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import { episode } from "../config/episode";
import { getSceneSpec } from "../config/sceneSpecs";
import { BrandHeader, ChipPanels, CommentBubbles, Confetti, IconButton, Logo, Panel, ProgressBar, Ripples, rectOf } from "../components/Ui";
import { IllustrationZone } from "../components/Illustration";
import { SceneShell } from "../components/SceneShell";
import { SpecTexts } from "../components/SpecTexts";
import type { TimelineScene } from "../types";

type P = { scene: TimelineScene };
const useSpec = (s: TimelineScene) => useMemo(() => getSceneSpec(s.kind, episode, s.sentence), [s.kind, s.sentence]);

/** Outro 1 - all ten sentences completed. */
export const OutroDoneScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <BrandHeader spec={spec} />
      <Confetti rect={rectOf(spec, "confetti")} startFrame={12} />
      <ChipPanels spec={spec} done startSec={0.35} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};

/** Outro 2 - 120 / 300 (40%) and the shopping items learnt today. */
export const OutroProgressScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <ProgressBar rect={rectOf(spec, "bar")} value={episode.completedSentences / episode.totalSentences} delay={12} />
      <IllustrationZone zone={spec.illustrations[0]} duration={scene.durationFrames} delay={20} card={false} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};

/** Outro 3 - "use it for real, don't just memorise". */
export const OutroPracticeScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <IllustrationZone zone={spec.illustrations[0]} duration={scene.durationFrames} delay={8} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};

/** Outro 4 - follow Arabic Master, save, share. */
export const OutroFollowScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  const { fps } = useVideoConfig();
  const r = rectOf(spec, "logoBig");
  return (
    <SceneShell duration={scene.durationFrames}>
      <Ripples cx={r.x + r.w / 2} cy={r.y + r.h / 2} minR={r.w / 2} maxR={r.w / 2 + 30} />
      <Logo rect={r} />
      <Panel rect={rectOf(spec, "followPill")} fill="accent" radius={60} delay={Math.round(0.9 * fps)} />
      <IconButton rect={rectOf(spec, "saveIcon")} kind="save" delay={Math.round(1.2 * fps)} pulseAt={Math.round(2.0 * fps)} />
      <IconButton rect={rectOf(spec, "shareIcon")} kind="share" delay={Math.round(1.35 * fps)} pulseAt={Math.round(2.3 * fps)} />
      <SpecTexts texts={spec.texts.map((t) => (t.id === "followBtn" ? { ...t, delaySec: 0.95 } : t.id === "saveLabel" ? { ...t, delaySec: 1.3 } : t.id === "shareLabel" ? { ...t, delaySec: 1.45 } : t))} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};

/** Outro 5 - comment CTA. */
export const OutroCommentScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  return (
    <SceneShell duration={scene.durationFrames}>
      <Panel rect={rectOf(spec, "ctaPanel")} fill="primary" radius={56} delay={scene.cues.cta ?? 6} />
      <CommentBubbles rect={rectOf(spec, "commentBubbles")} delay={Math.round(0.5 * 30)} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.1} />
    </SceneShell>
  );
};

/** Outro 6 - next episode + goodbye. */
export const OutroGoodbyeScene: React.FC<P> = ({ scene }) => {
  const spec = useSpec(scene);
  const r = rectOf(spec, "logoBig");
  return (
    <SceneShell duration={scene.durationFrames}>
      <Ripples cx={r.x + r.w / 2} cy={r.y + r.h / 2} minR={r.w / 2} maxR={r.w / 2 + 30} />
      <Logo rect={r} />
      <Panel rect={rectOf(spec, "nextPanel")} fill="primary" radius={56} delay={14} />
      <SpecTexts texts={spec.texts} cues={scene.cues} baseSec={0.15} />
    </SceneShell>
  );
};

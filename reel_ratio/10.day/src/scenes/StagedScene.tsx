import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { BrandHeader } from "../components/Brand";
import { StageVisual } from "../components/StageVisuals";
import { WordReveal } from "../components/Text";
import { useBreathe, useEnter, useExit } from "../lib/anim";
import type { EpisodeConfig, Stage } from "../types";
import { theme } from "../theme";
import { SceneShell } from "./SceneShell";

const StageView: React.FC<{ ep: EpisodeConfig; stage: Stage; exitFrames: number; size: number }> = ({ ep, stage, exitFrames, size }) => {
  const x = useExit(exitFrames);
  const enter = useEnter(0, theme.spring.smooth);
  const b = useBreathe(6, 3.2);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 330,
          width: 880,
          height: 600,
          opacity: (1 - x) * Math.min(1, enter * 1.5),
          transform: `translateY(${b + (1 - enter) * 50 - x * 30}px) scale(${0.94 + 0.06 * enter})`,
        }}
      >
        <StageVisual kind={stage.visual} ep={ep} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1010,
          width: 920,
          minHeight: 420,
          padding: "46px 48px",
          boxSizing: "border-box",
          borderRadius: theme.radius.card,
          background: theme.colors.white,
          boxShadow: theme.shadow.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - x,
          transform: `translateY(${-x * 24}px)`,
        }}
      >
        <WordReveal text={stage.text} size={size} delay={4} stagger={3} />
      </div>
    </>
  );
};

/** Intro/Outro: a sequence of narrated stages, each with its own visual and kinetic text. */
export const StagedScene: React.FC<{
  ep: EpisodeConfig;
  stages: Stage[];
  sceneStartSec: number;
  exitFrames: number;
  headerRight?: string;
}> = ({ ep, stages, sceneStartSec, exitFrames, headerRight }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const overlap = Math.round(0.2 * fps);
  return (
    <SceneShell exitFrames={exitFrames}>
      <BrandHeader brand={ep.brandName} right={headerRight} />
      {stages.map((st, i) => {
        const from = Math.round((st.startSec - sceneStartSec) * fps);
        const next = stages[i + 1];
        const end = next ? Math.round((next.startSec - sceneStartSec) * fps) + overlap : durationInFrames;
        const len = Math.max(1, end - from);
        const size = st.text.length > 70 ? 54 : st.text.length > 40 ? 62 : 72;
        return (
          <Sequence key={i} from={from} durationInFrames={len} name={`stage-${i}`}>
            <StageView ep={ep} stage={st} exitFrames={next ? overlap : 0} size={size} />
          </Sequence>
        );
      })}
    </SceneShell>
  );
};

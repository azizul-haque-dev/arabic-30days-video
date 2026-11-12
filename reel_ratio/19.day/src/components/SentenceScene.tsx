import React from "react";
import { useVideoConfig } from "remotion";
import { secToFrame } from "../lib/anim";
import type { EpisodeContent, SceneTiming, SentenceContent } from "../types";
import { AnimatedIllustration } from "./AnimatedIllustration";
import { BrandTag } from "./BrandTag";
import { SceneShell } from "./SceneShell";
import { SentenceCard } from "./SentenceCard";
import { SentenceNumber } from "./SentenceNumber";
import type { LocalSpan } from "./PronunciationText";

type SentenceTiming = Extract<SceneTiming, { type: "sentence" }>;

/** One sentence = illustration + number + Bengali pronunciation (dominant) + Arabic + meaning, all driven by SRT events. */
export const SentenceScene: React.FC<{
  scene: SentenceTiming;
  sentence: SentenceContent;
  content: EpisodeContent;
  sample: boolean;
}> = ({ scene, sentence, content, sample }) => {
  const { fps } = useVideoConfig();
  const toSpan = (e: { startSec: number; endSec: number }): LocalSpan => {
    const startF = Math.max(0, secToFrame(e.startSec, fps) - scene.startFrame);
    return { startF, endF: Math.max(startF + 1, secToFrame(e.endSec, fps) - scene.startFrame) };
  };
  const pronSpans = scene.events.filter((e) => e.kind === "pron").map(toSpan);
  const meaningSpans = scene.events.filter((e) => e.kind === "meaning").map(toSpan);

  return (
    <SceneShell>
      <BrandTag brand={content.brand} day={content.episode} sample={sample} />
      <SentenceNumber number={sentence.number} total={content.totalSentences} />
      <AnimatedIllustration id={sentence.illustration} />
      <SentenceCard sentence={sentence} pronSpans={pronSpans} meaningSpans={meaningSpans} />
    </SceneShell>
  );
};

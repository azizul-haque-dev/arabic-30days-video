import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { episodeConfig as cfg } from "../config/episodeConfig";
import { buildTimeline, sentenceFor } from "../config/timeline";
import type { Cue } from "../utils/srt";
import { loadFonts } from "../utils/fonts";
import { BgMesh, Grade, GrainVignette } from "../components/fx";
import { CaptionLayer } from "../components/caption";
import { SentenceScene } from "../components/SentenceScene";
import { ARTS } from "../scenes/sentences/arts";
import { IntroBrand, IntroEpisode, IntroProblem, IntroProgress, IntroTopic, OutroComplete, OutroFollow, OutroNext, OutroProgress } from "../scenes/introOutro";
import { useVideoConfig } from "remotion";

export type DayProps = { cues: Cue[] };

export const ArabicMasterDay: React.FC<DayProps> = ({ cues }) => {
  loadFonts();
  const { fps } = useVideoConfig();
  const tl = useMemo(() => buildTimeline(cues, fps), [cues, fps]);
  return (
    <AbsoluteFill>
      {/* layer 1: background mesh */}
      <BgMesh />
      {/* layers 2-3: assets + graphics/type, one sequence per scene */}
      {tl.scenes.map((s) => {
        let body: React.ReactNode = null;
        switch (s.kind) {
          case "intro1": body = <IntroProblem scene={s} />; break;
          case "intro2": body = <IntroBrand scene={s} />; break;
          case "intro3": body = <IntroEpisode scene={s} />; break;
          case "intro4": body = <IntroProgress scene={s} />; break;
          case "intro5": body = <IntroTopic scene={s} />; break;
          case "outro1": body = <OutroComplete scene={s} />; break;
          case "outro2": body = <OutroProgress scene={s} />; break;
          case "outro3": body = <OutroFollow scene={s} />; break;
          case "outro4": body = <OutroNext scene={s} />; break;
          case "sentence": {
            const sentence = sentenceFor(s.n!);
            body = <SentenceScene scene={s} sentence={sentence} Art={ARTS[sentence.visual]} />;
            break;
          }
        }
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
            {body}
          </Sequence>
        );
      })}
      <CaptionLayer cues={cues} ranges={cfg.captionCueRanges} />
      {cfg.audio.enabled ? <Audio src={staticFile(cfg.audio.file)} /> : null}
      {/* layers 4-5: grade, grain + vignette */}
      <Grade />
      <GrainVignette />
    </AbsoluteFill>
  );
};

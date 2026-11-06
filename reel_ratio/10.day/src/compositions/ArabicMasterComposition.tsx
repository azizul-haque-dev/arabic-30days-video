import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, cancelRender, staticFile, continueRender, delayRender } from "remotion";
import { Background, Vignette } from "../components/Background";
import { video } from "../config/video.config";
import { loadFonts } from "../fonts";
import { IntroLabel } from "./labels";
import { SentenceScene } from "../scenes/SentenceScene";
import { StagedScene } from "../scenes/StagedScene";
import { ThumbnailScene } from "../scenes/ThumbnailScene";
import type { EpisodeConfig } from "../types";

export interface CompositionProps extends Record<string, unknown> {
  episode: EpisodeConfig;
  /** Optional narration: a path inside public/ (e.g. "audio/narration.wav") or an http(s) URL. Omit for a silent video. */
  audioSrc?: string;
}

export const secondsToFrames = (s: number): number => Math.round(s * video.fps);

export const totalFrames = (ep: EpisodeConfig): number => secondsToFrames(ep.timing.endSec);

export const ArabicMasterComposition: React.FC<CompositionProps> = ({ episode: ep, audioSrc }) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    loadFonts().then(() => continueRender(handle)).catch((e) => cancelRender(e));
  }, [handle]);

  const f = secondsToFrames;
  const ov = f(video.overlapSec);
  const total = totalFrames(ep);
  const thumbEnd = f(ep.timing.thumbnailEndSec);
  const introEnd = f(ep.timing.introEndSec);
  const outroStart = f(ep.timing.outroStartSec);

  return (
    <AbsoluteFill>
      <Background />
      {audioSrc ? <Audio src={/^https?:/.test(audioSrc) ? audioSrc : staticFile(audioSrc)} /> : null}
      <Sequence from={0} durationInFrames={thumbEnd + ov} name="thumbnail">
        <ThumbnailScene ep={ep} exitFrames={ov} />
      </Sequence>
      <Sequence from={thumbEnd} durationInFrames={introEnd - thumbEnd + ov} name="intro">
        <StagedScene ep={ep} stages={ep.introStages} sceneStartSec={ep.timing.thumbnailEndSec} exitFrames={ov} headerRight={IntroLabel(ep)} />
      </Sequence>
      {ep.sentences.map((s, i) => (
        <Sequence key={s.number} from={f(s.startSec)} durationInFrames={f(s.endSec) - f(s.startSec) + ov} name={`sentence-${s.number}`}>
          <SentenceScene ep={ep} sentence={s} index={i} exitFrames={ov} />
        </Sequence>
      ))}
      <Sequence from={outroStart} durationInFrames={total - outroStart} name="outro">
        <StagedScene ep={ep} stages={ep.outroStages} sceneStartSec={ep.timing.outroStartSec} exitFrames={0} headerRight={IntroLabel(ep)} />
      </Sequence>
      <Vignette />
    </AbsoluteFill>
  );
};

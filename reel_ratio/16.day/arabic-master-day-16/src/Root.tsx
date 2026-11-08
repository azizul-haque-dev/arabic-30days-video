import React from "react";
import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { MainComposition } from "./MainComposition";
import { episodeConfig } from "./config/episode";
import { parseSrt, validateCues } from "./parsers/srt";
import { buildTimeline, validateTimeline } from "./services/timeline";
import type { MainProps } from "./types";

/** SRT is the authoritative timeline: duration + scene frames are derived from it at render time. */
const calculateMetadata: CalculateMetadataFunction<MainProps> = async ({ props }) => {
  const { episode } = props;
  const res = await fetch(staticFile(episode.srt.path));
  if (!res.ok) throw new Error(`Cannot load SRT "${episode.srt.path}" (HTTP ${res.status})`);
  const cues = parseSrt(await res.text());
  const issues = [...validateCues(cues, episode.srt.expectedEntries), ...validateTimeline(episode, cues)];
  if (issues.length) throw new Error(`SRT/timeline validation failed:\n- ${issues.join("\n- ")}`);
  const timeline = buildTimeline(episode, cues);
  return {
    durationInFrames: timeline.totalFrames,
    fps: episode.video.fps,
    width: episode.video.width,
    height: episode.video.height,
    props: { ...props, timeline },
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id={episodeConfig.compositionId}
    component={MainComposition}
    durationInFrames={60}
    fps={episodeConfig.video.fps}
    width={episodeConfig.video.width}
    height={episodeConfig.video.height}
    defaultProps={{ episode: episodeConfig, timeline: null } satisfies MainProps}
    calculateMetadata={calculateMetadata}
  />
);

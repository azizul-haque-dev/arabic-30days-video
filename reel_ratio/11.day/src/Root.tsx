import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, EpisodeProps } from "./Episode";
import { episodeConfig as cfg } from "./config/episode";
import { parseSrt } from "./parsers/srt";
import { buildTimeline } from "./services/timeline";

const calculateMetadata = async () => {
  const res = await fetch(staticFile(cfg.assets.subtitles));
  const { cues, issues: srtIssues } = parseSrt(await res.text());
  const a = cfg.assets.audio;
  const audioSeconds = a.enabled ? await getAudioDurationInSeconds(staticFile(a.file)) : null;
  const timeline = buildTimeline(cfg, cues, cfg.video.fps, audioSeconds);
  const all = [...srtIssues, ...timeline.issues];
  if (all.length) throw new Error(`Timeline validation failed:\n${all.join("\n")}`);
  return { durationInFrames: timeline.totalFrames, props: { timeline } };
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="ArabicMaster"
      component={Episode}
      width={cfg.video.width}
      height={cfg.video.height}
      fps={cfg.video.fps}
      durationInFrames={Math.round(cfg.video.fps * 135)}
      defaultProps={{ timeline: null } as EpisodeProps}
      calculateMetadata={calculateMetadata}
    />
    <Composition
      id="ArabicMasterComposition"
      component={Episode}
      width={cfg.video.width}
      height={cfg.video.height}
      fps={cfg.video.fps}
      durationInFrames={Math.round(cfg.video.fps * 135)}
      defaultProps={{ timeline: null } as EpisodeProps}
      calculateMetadata={calculateMetadata}
    />
  </>
);

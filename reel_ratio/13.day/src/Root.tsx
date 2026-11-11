import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { episodeConfig as E } from "./config/episode";
import { ArabicMasterComposition, CompositionProps } from "./compositions/ArabicMasterComposition";
import { parseSrtStrict } from "./parsers/srt";
import { buildTimeline } from "./timeline/build";

/** Loads the ORIGINAL SRT, parses it strictly and derives the whole timeline + duration from it. */
const calculateMetadata: CalculateMetadataFunction<CompositionProps> = async () => {
  const res = await fetch(staticFile(E.srtFile));
  if (!res.ok) throw new Error(`Cannot load ${E.srtFile} (HTTP ${res.status}).`);
  const timeline = buildTimeline(parseSrtStrict(await res.text()));
  return {
    durationInFrames: timeline.durationInFrames,
    fps: timeline.fps,
    width: E.video.width,
    height: E.video.height,
    props: { timeline },
  };
};

const emptyTimeline: CompositionProps["timeline"] = { fps: E.video.fps, durationInFrames: 1, scenes: [], estimates: [] };

export const RemotionRoot: React.FC = () => (
  <Composition
    id={E.compositionId}
    component={ArabicMasterComposition}
    durationInFrames={1}
    fps={E.video.fps}
    width={E.video.width}
    height={E.video.height}
    defaultProps={{ timeline: emptyTimeline }}
    calculateMetadata={calculateMetadata}
  />
);

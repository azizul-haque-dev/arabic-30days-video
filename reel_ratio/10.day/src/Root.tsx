import React from "react";
import { Composition } from "remotion";
import episodeJson from "../episodes/episode-10/episode.config.json";
import { ArabicMasterComposition, totalFrames } from "./compositions/ArabicMasterComposition";
import type { CompositionProps } from "./compositions/ArabicMasterComposition";
import { video } from "./config/video.config";
import type { EpisodeConfig } from "./types";

const defaultEpisode = episodeJson as unknown as EpisodeConfig;

export const Root: React.FC = () => (
  <Composition
    id={video.compositionId}
    component={ArabicMasterComposition}
    width={video.width}
    height={video.height}
    fps={video.fps}
    durationInFrames={totalFrames(defaultEpisode)}
    defaultProps={{ episode: defaultEpisode, audioSrc: "voiceover.wav" } satisfies CompositionProps}
    // Any episode passed via --props / API drives the duration.
    calculateMetadata={({ props }) => ({ durationInFrames: totalFrames((props as CompositionProps).episode) })}
  />
);

import React from "react";
import { CalculateMetadataFunction, Composition, Still, getRemotionEnvironment } from "remotion";
import { AbsoluteFill } from "remotion";
import { Background } from "./components/Background";
import { EpisodeThumbnail } from "./components/EpisodeThumbnail";
import { FontGate } from "./components/FontGate";
import { EpisodeVideo, EpisodeVideoProps, defaultEpisodeProps } from "./compositions/EpisodeVideo";
import { episodes } from "./episodes/registry";
import { getEpisode } from "./episodes/registry";
import manifestJson from "./generated/manifest.json";
import { theme } from "./theme";
import { buildTimeline } from "./timing/buildTimeline";
import type { Manifest } from "./timing/types";

const manifest = manifestJson as unknown as Manifest;
const { width, height, fps } = theme.canvas;

/**
 * Composition length is decided by the narration audio (single source of truth).
 * No audio => draft timeline in Studio; a real render is refused with a clear error.
 */
const calculateMetadata: CalculateMetadataFunction<EpisodeVideoProps> = ({ props }) => {
  const config = getEpisode(props.episodeId);
  const entry = manifest.episodes[props.episodeId];
  const env = getRemotionEnvironment();
  if (!entry?.audio && env.isRendering && !props.allowDraft) {
    throw new Error(
      `Narration audio for "${props.episodeId}" was not found. Put the ORIGINAL narration at ` +
        `public/${config.audioDir}/${props.episodeId}.mp3 (or .wav), run "npm run discover", and render again. ` +
        `A silent video is never produced.`,
    );
  }
  const timeline = buildTimeline(config, entry, fps);
  return {
    durationInFrames: timeline.durationInFrames,
    props: { ...props, timeline, audioSrc: entry?.audio?.publicPath ?? null, cues: entry?.subtitles?.cues ?? [] },
  };
};

const Thumb: React.FC<{ episodeId: string }> = ({ episodeId }) => (
  <AbsoluteFill>
    <FontGate>
      <Background />
      <EpisodeThumbnail
        config={getEpisode(episodeId)}
        frame={0}
        fps={fps}
        layoutMode="throw"
        safe={{ x0: theme.layout.safeX, y0: theme.layout.safeTop, x1: width - theme.layout.safeX, y1: height - theme.layout.safeBottom }}
      />
    </FontGate>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    {episodes.map((ep) => (
      <React.Fragment key={ep.episodeId}>
        <Composition
          id={ep.episodeId}
          component={EpisodeVideo}
          width={width}
          height={height}
          fps={fps}
          durationInFrames={fps * 60}
          defaultProps={defaultEpisodeProps(ep.episodeId)}
          calculateMetadata={calculateMetadata}
        />
        <Still id={`${ep.episodeId}-thumbnail`} component={Thumb} width={width} height={height} defaultProps={{ episodeId: ep.episodeId }} />
      </React.Fragment>
    ))}
  </>
);

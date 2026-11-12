import React from "react";
import { AbsoluteFill } from "remotion";
import { BackgroundMesh, PostLayers } from "../components/BackgroundLayers";
import { EpisodeThumbnail } from "../components/EpisodeThumbnail";

/** Exportable 1080×1920 thumbnail (identical to the video's first frame, fully settled). */
export const ThumbnailStill: React.FC = () => (
  <AbsoluteFill>
    <BackgroundMesh />
    <EpisodeThumbnail frame={40} fps={30} />
    <PostLayers />
  </AbsoluteFill>
);

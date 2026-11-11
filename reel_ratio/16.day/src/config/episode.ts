import raw from "../../episode.config.json";
import type { EpisodeConfig } from "../types";

/** Single source of truth for all episode-specific data. Override via --props / inputProps. */
export const episodeConfig = raw as unknown as EpisodeConfig;

export const progressOf = (e: EpisodeConfig) =>
  Math.round((e.completedSentences / e.totalSentences) * 10000) / 100;

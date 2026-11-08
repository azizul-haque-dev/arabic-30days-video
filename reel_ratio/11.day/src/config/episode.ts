import raw from "../../episode.config.json";
import type { EpisodeConfig } from "../types/episode";

/** Single source of truth for all episode data. Nothing episode-specific lives in components. */
export const episodeConfig = raw as unknown as EpisodeConfig;

export const progress = {
  done: episodeConfig.completedSentences,
  total: episodeConfig.totalSentences,
  previous: episodeConfig.previousCompletedSentences,
  percent: episodeConfig.progressPercentage,
};

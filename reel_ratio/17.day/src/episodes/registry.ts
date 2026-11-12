import type { EpisodeConfig } from "./types";
import { day17 } from "./day-17/config";

/** Add future episodes here - Root.tsx and the scripts pick them up automatically. */
export const episodes: EpisodeConfig[] = [day17];

export const getEpisode = (id: string): EpisodeConfig => {
  const e = episodes.find((x) => x.episodeId === id);
  if (!e) throw new Error(`Unknown episode "${id}". Registered: ${episodes.map((x) => x.episodeId).join(", ")}`);
  return e;
};

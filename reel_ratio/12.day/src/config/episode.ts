import episodeJson from "../../episode.config.json";
import { SRT_RAW } from "../generated/subtitles";
import { parseSrt } from "../parsers/srt";
import { buildTimeline } from "../services/timeline";
import type { EpisodeConfig } from "../types";

/** The single source of truth for everything episode-specific. */
export const episode = episodeJson as unknown as EpisodeConfig;
export const srt = parseSrt(SRT_RAW);
export const timeline = buildTimeline(episode, srt.entries);
export const VIDEO = episode.video;

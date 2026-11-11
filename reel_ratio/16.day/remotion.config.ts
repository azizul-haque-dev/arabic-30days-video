import { Config } from "@remotion/cli/config";

// Centralised render defaults. Resolution / fps / duration come from episode.config.json + SRT (see src/Root.tsx).
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPublicDir("public");

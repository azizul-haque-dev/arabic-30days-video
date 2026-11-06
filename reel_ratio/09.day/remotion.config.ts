import { Config } from "@remotion/cli/config";

// Defaults used by `npx remotion render` and the Studio.
// scripts/render.ts passes its own explicit options and overrides these.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(18);
Config.setOverwriteOutput(true);

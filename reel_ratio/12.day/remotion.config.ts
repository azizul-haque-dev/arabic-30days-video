import { Config } from "@remotion/cli/config";

// Rendering is NOT run by this project's tooling. These are the defaults for when you render it yourself.
Config.setRendererPort(3030);
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

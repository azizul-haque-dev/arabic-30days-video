import { Config } from "@remotion/cli/config";

Config.setRendererPort(3030);
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setAudioCodec("aac");
Config.setEnforceAudioTrack(true);
Config.setOverwriteOutput(true);
Config.setCrf(17);

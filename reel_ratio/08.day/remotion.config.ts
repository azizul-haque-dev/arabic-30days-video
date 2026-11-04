import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setAudioCodec("aac");
Config.setAudioBitrate("320k");
Config.setEnforceAudioTrack(true);

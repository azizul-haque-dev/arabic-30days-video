import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

// Optional: point Remotion at a local Chromium (useful in offline sandboxes / CI).
// On a normal machine leave REMOTION_BROWSER_EXECUTABLE unset - Remotion downloads its own.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}

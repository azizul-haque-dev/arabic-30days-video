import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RenderInternals } from "@remotion/renderer";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = path.join(projectRoot, "out", "video.mp4");
const requiredAudioFiles = [
  "public/voiceover.wav",
  "public/sfx/pop_a.wav",
  "public/sfx/pop_b.wav",
  "public/sfx/click.wav",
  "public/sfx/whoosh.wav",
  "public/sfx/swipe.wav",
  "public/sfx/chime.wav",
  "public/sfx/thud.wav",
];

for (const relativePath of requiredAudioFiles) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Required audio file is missing or empty: ${relativePath}`);
  }
  const fileStat = statSync(absolutePath);
  if (!fileStat.isFile() || fileStat.size === 0) {
    throw new Error(`Required audio file is missing or empty: ${relativePath}`);
  }
}

mkdirSync(path.dirname(outputPath), { recursive: true });

const remotionCli = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");
const render = spawnSync(
  process.execPath,
  [
    remotionCli,
    "render",
    "src/index.ts",
    "Main",
    outputPath,
    "--codec",
    "h264",
    "--audio-codec",
    "aac",
    "--enforce-audio-track",
    "--overwrite",
  ],
  { cwd: projectRoot, stdio: "inherit" },
);

if (render.error) {
  throw render.error;
}
if (render.status !== 0) {
  throw new Error(`Remotion render failed with exit code ${render.status ?? "unknown"}`);
}

if (!existsSync(outputPath) || statSync(outputPath).size === 0) {
  throw new Error(`Render did not produce a non-empty MP4: ${outputPath}`);
}

const ffprobePath = RenderInternals.getExecutablePath({
  indent: false,
  logLevel: "error",
  type: "ffprobe",
  binariesDirectory: null,
});
if (!existsSync(ffprobePath)) {
  throw new Error(`Cannot verify rendered audio: Remotion ffprobe was not found at ${ffprobePath}`);
}

const probe = spawnSync(
  ffprobePath,
  ["-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type", "-of", "json", outputPath],
  { cwd: projectRoot, encoding: "utf8" },
);
if (probe.error) {
  throw probe.error;
}
if (probe.status !== 0) {
  throw new Error(`Could not verify the rendered MP4 audio stream: ${probe.stderr || probe.error || "ffprobe failed"}`);
}

let streams;
try {
  streams = JSON.parse(probe.stdout).streams;
} catch (error) {
  throw new Error("Could not parse ffprobe output while verifying the rendered MP4 audio stream", { cause: error });
}
if (!Array.isArray(streams) || streams.length === 0) {
  throw new Error(`Rendered MP4 has no audio stream: ${outputPath}`);
}

console.log(`Verified ${streams.length} audio stream(s) in ${outputPath}`);

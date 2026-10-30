import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RenderInternals } from "@remotion/renderer";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = path.join(projectRoot, "out", "video.mp4");
const configPath = path.join(projectRoot, "src", "config.ts");
const requiredAudioFiles = [
  "public/voiceover.wav",
  "public/sfx/pop.wav",
  "public/sfx/click.wav",
  "public/sfx/tick.wav",
  "public/sfx/whoosh.wav",
  "public/sfx/chime.wav",
  "public/sfx/thud.wav",
];

const requireEnabledConfig = (source, name) => {
  const match = source.match(new RegExp(`export const ${name} = (true|false);`));
  if (!match) {
    throw new Error(`Could not verify ${name} in src/config.ts.`);
  }
  if (match[1] !== "true") {
    throw new Error(`${name} must be true for a render with mandatory audio.`);
  }
};

const requireAudioFile = (relativePath) => {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile() || statSync(absolutePath).size === 0) {
    throw new Error(`Required audio file is missing or empty: ${relativePath}`);
  }
};

const render = () => {
  const cliPath = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");
  if (!existsSync(cliPath)) {
    throw new Error(`Remotion CLI was not found at ${cliPath}. Install project dependencies before rendering.`);
  }

  const result = spawnSync(
    process.execPath,
    [
      cliPath,
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
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Remotion render failed with exit code ${result.status ?? "unknown"}.`);
  }
};

const verifyAudioStream = () => {
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
    throw new Error(`Could not verify the rendered MP4 audio stream: ${probe.stderr || "ffprobe failed"}`);
  }

  let streams;
  try {
    streams = JSON.parse(probe.stdout).streams;
  } catch (error) {
    throw new Error("Could not parse ffprobe output while verifying the rendered MP4 audio stream.", { cause: error });
  }
  if (!Array.isArray(streams) || streams.length === 0) {
    throw new Error(`Rendered MP4 has no audio stream: ${outputPath}`);
  }

  console.log(`Verified ${streams.length} audio stream(s) in ${outputPath}`);
};

try {
  const config = readFileSync(configPath, "utf8");
  requireEnabledConfig(config, "RENDER_VOICEOVER");
  requireEnabledConfig(config, "SFX_ENABLED");
  requiredAudioFiles.forEach(requireAudioFile);
  console.log("Audio preflight passed: voiceover and sound effects are enabled and all required files are present.");

  mkdirSync(path.dirname(outputPath), { recursive: true });
  rmSync(outputPath, { force: true });
  render();
  verifyAudioStream();
} catch (error) {
  console.error(`Render failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

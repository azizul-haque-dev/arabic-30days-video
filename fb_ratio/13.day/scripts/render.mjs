import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RenderInternals } from "@remotion/renderer";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = path.join(projectRoot, "out", "video.mp4");

const candidateVoiceovers = [
  "13-partcomolete.wav",
  "voiceover.wav",
  "voiceover.mp3",
];

const requiredSfx = [
  "public/sfx/pop.wav",
  "public/sfx/click.wav",
  "public/sfx/whoosh.wav",
  "public/sfx/chime.wav",
  "public/sfx/thud.wav",
];

const checkAudioFiles = () => {
  // Voiceover check
  const foundVoiceover = candidateVoiceovers.find((file) => {
    const p = path.join(projectRoot, "public", file);
    return existsSync(p) && statSync(p).isFile() && statSync(p).size > 0;
  });

  if (!foundVoiceover) {
    throw new Error(
      `Voiceover audio is missing in public/. Looked for: ${candidateVoiceovers.join(", ")}`,
    );
  }
  console.log(`Found voiceover audio: public/${foundVoiceover}`);

  // SFX check
  for (const sfx of requiredSfx) {
    const p = path.join(projectRoot, sfx);
    if (!existsSync(p) || !statSync(p).isFile() || statSync(p).size === 0) {
      throw new Error(`Required SFX audio file is missing or empty: ${sfx}`);
    }
  }
  console.log("All audio preflight checks passed.");
};

const render = (extraArgs = []) => {
  const cliPath = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");
  if (!existsSync(cliPath)) {
    throw new Error(`Remotion CLI not found at ${cliPath}.`);
  }

  const defaultArgs = [
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
  ];

  const args = [...defaultArgs, ...extraArgs];

  console.log(`Starting Remotion render...`);
  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Remotion render exited with status ${result.status ?? "unknown"}`);
  }
};

const verifyAudioStream = () => {
  if (!existsSync(outputPath) || statSync(outputPath).size === 0) {
    throw new Error(`Render did not produce output video: ${outputPath}`);
  }

  const ffprobePath = RenderInternals.getExecutablePath({
    indent: false,
    logLevel: "error",
    type: "ffprobe",
    binariesDirectory: null,
  });

  if (!existsSync(ffprobePath)) {
    console.warn(`ffprobe not found at ${ffprobePath}, skipping post-render stream probe.`);
    return;
  }

  const probe = spawnSync(
    ffprobePath,
    ["-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type,codec_name,channels", "-of", "json", outputPath],
    { cwd: projectRoot, encoding: "utf8" },
  );

  if (probe.error) {
    throw probe.error;
  }

  let streams = [];
  try {
    streams = JSON.parse(probe.stdout).streams || [];
  } catch (err) {
    console.warn("Could not parse ffprobe output:", err);
  }

  if (!Array.isArray(streams) || streams.length === 0) {
    throw new Error(`CRITICAL: Rendered MP4 has NO audio stream! ${outputPath}`);
  }

  console.log(`Verified ${streams.length} audio stream(s) in rendered output (${streams[0].codec_name}, ${streams[0].channels}ch). Audio successfully added!`);
};

try {
  checkAudioFiles();
  mkdirSync(path.dirname(outputPath), { recursive: true });
  render(process.argv.slice(2));
  verifyAudioStream();
} catch (err) {
  console.error(`Render failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
}


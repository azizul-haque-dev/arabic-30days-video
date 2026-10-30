import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";
import {getVideoMetadata} from "@remotion/renderer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "out", "video.mp4");
const requiredAudio = [
  "public/voiceover.mp3",
  "public/sfx/chime.wav",
  "public/sfx/click.wav",
  "public/sfx/pop.wav",
  "public/sfx/swipe.wav",
  "public/sfx/thud.wav",
  "public/sfx/whoosh.wav",
];

const assertAudioAssets = () => {
  for (const relativePath of requiredAudio) {
    const filePath = path.join(root, relativePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required audio file is missing: ${relativePath}`);
    }

    const data = fs.readFileSync(filePath);
    if (data.length === 0) {
      throw new Error(`Required audio file is empty: ${relativePath}`);
    }
    if (relativePath.endsWith(".wav") &&
        (data.length <= 44 || data.toString("ascii", 0, 4) !== "RIFF" || data.toString("ascii", 8, 12) !== "WAVE")) {
      throw new Error(`Required sound effect is not a valid WAV file: ${relativePath}`);
    }
  }
};

const render = () => {
  const require = createRequire(import.meta.url);
  const cliPackage = require.resolve("@remotion/cli/package.json");
  const cliPath = path.join(path.dirname(cliPackage), "remotion-cli.js");
  fs.mkdirSync(path.dirname(output), {recursive: true});

  const result = spawnSync(process.execPath, [cliPath, "render", "src/index.ts", "Main", output], {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Remotion render failed with exit code ${result.status ?? "unknown"}`);
  }
};

const verifyAudioStream = async () => {
  if (!fs.existsSync(output) || fs.statSync(output).size === 0) {
    throw new Error(`Render did not produce an MP4: ${output}`);
  }

  const metadata = await getVideoMetadata(output);
  if (!metadata.audioCodec) {
    throw new Error(`Rendered MP4 has no audio stream: ${output}`);
  }
  console.log(`Verified MP4 audio stream: ${metadata.audioCodec}`);
};

try {
  assertAudioAssets();
  render();
  await verifyAudioStream();
  console.log(`Render complete: ${path.relative(root, output)}`);
} catch (error) {
  console.error(`Render failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

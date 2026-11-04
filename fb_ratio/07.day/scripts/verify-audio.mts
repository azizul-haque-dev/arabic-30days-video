import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

export const REQUIRED_SFX = [
  "whoosh",
  "swipe",
  "pop",
  "click",
  "chime",
  "thud",
] as const;

export const REQUIRED_VOICEOVER = "voiceover.mp3";

/**
 * Find the ffprobe executable path (system or remotion compositor).
 */
export function findFfprobe(): string {
  // Check common remotion compositor paths
  const compositorDir = path.join(PROJECT_ROOT, "node_modules", "@remotion");
  if (fs.existsSync(compositorDir)) {
    const pkgs = fs.readdirSync(compositorDir);
    for (const pkg of pkgs) {
      if (pkg.startsWith("compositor-")) {
        const candidate = path.join(compositorDir, pkg, process.platform === "win32" ? "ffprobe.exe" : "ffprobe");
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
    }
  }

  // Fallback to PATH
  return process.platform === "win32" ? "ffprobe.exe" : "ffprobe";
}

/**
 * Pre-render verification:
 * 1. Checks that voiceover and SFX audio files exist and are non-empty.
 * 2. Checks that voiceover and sound effects are enabled during rendering (not preview-only).
 */
export function verifyPreRenderAudio(): { valid: boolean; files: string[] } {
  console.log("\n[Pre-render Audio Verification] Checking required audio assets...");

  const missingOrInvalid: string[] = [];
  const verifiedFiles: string[] = [];

  // Check voiceover file
  const voiceoverPath = path.join(PROJECT_ROOT, "public", REQUIRED_VOICEOVER);
  if (!fs.existsSync(voiceoverPath)) {
    missingOrInvalid.push(`Missing voiceover file: ${voiceoverPath}`);
  } else {
    const stats = fs.statSync(voiceoverPath);
    if (stats.size === 0) {
      missingOrInvalid.push(`Voiceover file is 0 bytes: ${voiceoverPath}`);
    } else {
      verifiedFiles.push(`${REQUIRED_VOICEOVER} (${stats.size} bytes)`);
    }
  }

  // Check SFX files
  for (const sfx of REQUIRED_SFX) {
    const sfxPath = path.join(PROJECT_ROOT, "public", "sfx", `${sfx}.wav`);
    if (!fs.existsSync(sfxPath)) {
      missingOrInvalid.push(`Missing SFX file: ${sfxPath}`);
    } else {
      const stats = fs.statSync(sfxPath);
      if (stats.size === 0) {
        missingOrInvalid.push(`SFX file is 0 bytes: ${sfxPath}`);
      } else {
        verifiedFiles.push(`sfx/${sfx}.wav (${stats.size} bytes)`);
      }
    }
  }

  // Check Main.tsx configuration to ensure audio is not disabled in render
  const mainTsxPath = path.join(PROJECT_ROOT, "src", "Main.tsx");
  if (fs.existsSync(mainTsxPath)) {
    const content = fs.readFileSync(mainTsxPath, "utf-8");
    if (content.includes("RENDER_WITH_VOICEOVER = false")) {
      missingOrInvalid.push(
        `Main.tsx has RENDER_WITH_VOICEOVER set to false! Audio must be enabled during rendering.`
      );
    }
    if (content.includes("PREVIEW_VOICEOVER && (!rendering || RENDER_WITH_VOICEOVER)")) {
      missingOrInvalid.push(
        `Main.tsx contains preview-only voiceover gate! Audio must be enabled during rendering.`
      );
    }
  }

  if (missingOrInvalid.length > 0) {
    console.error("\n❌ [Pre-render Audio Verification FAILED]");
    for (const err of missingOrInvalid) {
      console.error(`  - ${err}`);
    }
    throw new Error(
      `Audio verification failed before rendering: ${missingOrInvalid.join("; ")}`
    );
  }

  console.log("✅ [Pre-render Audio Verification PASSED]");
  for (const f of verifiedFiles) {
    console.log(`  ✓ ${f}`);
  }
  return { valid: true, files: verifiedFiles };
}

export interface AudioStreamInfo {
  codec_name: string;
  channels: number;
  sample_rate: string;
  duration?: string;
  bit_rate?: string;
}

/**
 * Post-render verification:
 * Inspects output MP4 with ffprobe to verify it contains an audio stream.
 * Fails with an explicit error if audio stream is missing or ffprobe fails.
 */
export function verifyPostRenderAudio(videoPath: string): AudioStreamInfo {
  console.log(`\n[Post-render Audio Verification] Inspecting "${videoPath}"...`);

  const resolvedVideoPath = path.isAbsolute(videoPath)
    ? videoPath
    : path.resolve(PROJECT_ROOT, videoPath);

  if (!fs.existsSync(resolvedVideoPath)) {
    throw new Error(
      `Render verification failed: Output video file not found at "${resolvedVideoPath}"`
    );
  }

  const stat = fs.statSync(resolvedVideoPath);
  if (stat.size === 0) {
    throw new Error(
      `Render verification failed: Output video file "${resolvedVideoPath}" is empty (0 bytes).`
    );
  }

  const ffprobePath = findFfprobe();
  let stdout: string;
  try {
    stdout = execFileSync(
      ffprobePath,
      [
        "-v",
        "error",
        "-print_format",
        "json",
        "-show_streams",
        "-show_format",
        resolvedVideoPath,
      ],
      { encoding: "utf-8", timeout: 30000 }
    );
  } catch (err) {
    throw new Error(
      `Failed to run ffprobe on "${resolvedVideoPath}" using executable "${ffprobePath}": ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  let probeResult: { streams?: Array<Record<string, unknown>>; format?: Record<string, unknown> };
  try {
    probeResult = JSON.parse(stdout);
  } catch (err) {
    throw new Error(`Failed to parse ffprobe JSON output: ${String(err)}`);
  }

  const streams = probeResult.streams ?? [];
  const audioStream = streams.find((s) => s.codec_type === "audio");

  if (!audioStream) {
    console.error("\n❌ [Post-render Audio Verification FAILED]");
    console.error(
      `Output video "${resolvedVideoPath}" does NOT contain an audio stream!\nStreams found:`,
      streams.map((s) => `${s.codec_type} (${s.codec_name})`)
    );
    throw new Error(
      `Audio verification failed: Output file "${resolvedVideoPath}" does not contain any audio stream. Audio is mandatory in every final video render.`
    );
  }

  const info: AudioStreamInfo = {
    codec_name: String(audioStream.codec_name ?? "unknown"),
    channels: Number(audioStream.channels ?? 0),
    sample_rate: String(audioStream.sample_rate ?? "unknown"),
    duration: audioStream.duration ? String(audioStream.duration) : undefined,
    bit_rate: audioStream.bit_rate ? String(audioStream.bit_rate) : undefined,
  };

  console.log("✅ [Post-render Audio Verification PASSED]");
  console.log(`  ✓ Audio Stream found in "${path.basename(resolvedVideoPath)}"`);
  console.log(`  ✓ Codec: ${info.codec_name}`);
  console.log(`  ✓ Channels: ${info.channels}`);
  console.log(`  ✓ Sample Rate: ${info.sample_rate} Hz`);
  if (info.duration) console.log(`  ✓ Duration: ${info.duration} s`);
  if (info.bit_rate) console.log(`  ✓ Bitrate: ${info.bit_rate} bps`);

  return info;
}

// CLI entry point if run directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const target = process.argv[2];
  try {
    if (!target || target === "--pre") {
      verifyPreRenderAudio();
    } else {
      verifyPostRenderAudio(target);
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}


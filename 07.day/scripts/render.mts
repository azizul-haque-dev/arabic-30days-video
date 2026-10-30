import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { verifyPreRenderAudio, verifyPostRenderAudio } from "./verify-audio.mts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

async function run(): Promise<void> {
  const defaultOutput = path.join(PROJECT_ROOT, "out", "video.mp4");
  const targetOutput = process.argv[2] ?? defaultOutput;
  const resolvedOutput = path.isAbsolute(targetOutput)
    ? targetOutput
    : path.resolve(PROJECT_ROOT, targetOutput);

  console.log("==================================================");
  console.log(" 🎬 REMOTION VIDEO RENDER WITH MANDATORY AUDIO   ");
  console.log("==================================================");

  // 1. Pre-render Audio Verification
  try {
    verifyPreRenderAudio();
  } catch (err) {
    console.error("\n❌ RENDER ABORTED: Pre-render audio verification failed.");
    console.error((err as Error).message);
    process.exit(1);
  }

  // 2. Prepare output directory
  const outDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 3. Execute Remotion Render
  console.log(`\n🚀 Starting render to "${resolvedOutput}"...\n`);
  const isWindows = process.platform === "win32";
  const remotionBin = path.join(PROJECT_ROOT, "node_modules", ".bin", isWindows ? "remotion.cmd" : "remotion");

  const remotionArgs = [
    "render",
    "src/index.ts",
    "Main",
    resolvedOutput,
    ...process.argv.slice(3),
  ];

  const renderExitCode = await new Promise<number>((resolve) => {
    const child = spawn(remotionBin, remotionArgs, {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
      shell: isWindows,
    });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });

    child.on("error", (err) => {
      console.error("Failed to spawn Remotion render process:", err);
      resolve(1);
    });
  });

  if (renderExitCode !== 0) {
    console.error(`\n❌ Render failed with exit code ${renderExitCode}.`);
    process.exit(renderExitCode);
  }

  // 4. Post-render Audio Verification
  try {
    const audioInfo = verifyPostRenderAudio(resolvedOutput);
    console.log("\n==================================================");
    console.log(" ✨ RENDER COMPLETE & AUDIO VERIFIED SUCCESSFUL   ");
    console.log(` Output: ${resolvedOutput}`);
    console.log(` Audio Stream: ${audioInfo.codec_name}, ${audioInfo.channels}ch, ${audioInfo.sample_rate}Hz`);
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ RENDER VERIFICATION FAILED: Mandatory audio stream is missing or invalid!");
    console.error((err as Error).message);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Unexpected render error:", err);
  process.exit(1);
});


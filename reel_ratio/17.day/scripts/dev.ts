/** `npm run dev`: discover audio/SRT, keep watching them, and open Remotion Studio. */
import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const watcher = spawn(npx, ["tsx", "scripts/discover-audio.ts", "--watch"], { cwd: root, stdio: "inherit" });
const studio = spawn(npx, ["remotion", "studio", "src/index.ts"], { cwd: root, stdio: "inherit" });

const stop = () => {
  watcher.kill();
  studio.kill();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
studio.on("exit", (code) => {
  watcher.kill();
  process.exit(code ?? 0);
});

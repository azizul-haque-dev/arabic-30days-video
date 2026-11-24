// npm run render  →  out/arabic-master-ep07.mp4  (narration is used automatically if public/audio.wav exists)
import fs from "node:fs";
import {spawnSync} from "node:child_process";

const audio = fs.existsSync("public/audio.wav");
console.log(audio ? "🔊 public/audio.wav found — narration will be included." : "⚠️  public/audio.wav not found — rendering WITHOUT audio.");
fs.mkdirSync("out", {recursive: true});
const args = ["remotion", "render", "src/index.ts", "ArabicMasterEp07", "out/arabic-master-ep07.mp4", "--codec=h264", "--crf=17", "--overwrite", ...process.argv.slice(2)];
const r = spawnSync("npx", args, {stdio: "inherit", shell: process.platform === "win32"});
process.exit(r.status ?? 1);

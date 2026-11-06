import { ZipArchive } from "archiver";
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import type { EpisodeConfig } from "../src/types";

const dir = resolve(process.argv[2] ?? "episodes/episode-10");

const run = (cmd: string, args: string[]) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`\nPACKAGING ABORTED: '${cmd} ${args.join(" ")}' failed`);
    process.exit(1);
  }
};

// 1) rebuild config from script + SRT, 2) validate, 3) type-check. Any failure stops packaging.
run("npx", ["tsx", "scripts/build-episode.ts", dir]);
run("npx", ["tsx", "scripts/validate-episode.ts", dir]);
run("npx", ["tsc", "--noEmit"]);

const ep = JSON.parse(readFileSync(resolve(dir, "episode.config.json"), "utf8")) as EpisodeConfig;
const name = `arabic-master-day-${ep.episodeNumber}`;
mkdirSync("output", { recursive: true });
const outPath = resolve("output", `${name}.zip`);

const output = createWriteStream(outPath);
const zip = new ZipArchive({ zlib: { level: 9 } });
output.on("close", () => console.log(`\nZIP created: ${outPath} (${(zip.pointer() / 1024).toFixed(0)} KB)`));
zip.on("error", (e: Error) => {
  console.error("ZIP failed:", e);
  process.exit(1);
});
zip.pipe(output);

const ignore = ["node_modules/**", "out/**", "output/**", ".git/**", "**/*.mp4", "**/*.wav", "**/*.mp3", "**/.DS_Store"];
zip.glob("**/*", { cwd: process.cwd(), dot: true, ignore }, { prefix: name });
if (!existsSync(resolve("package-lock.json"))) console.warn("warning: package-lock.json missing");
zip.finalize();

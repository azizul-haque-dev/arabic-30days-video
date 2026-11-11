// Verifies the ZIP: extractable, required files present, nothing forbidden.
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const zip = resolve(process.argv[2] ?? "../arabic-master-day-13.zip");
const names = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" }).trim().split("\n");
const must = ["package.json", "package-lock.json", "tsconfig.json", "remotion.config.ts", "README.md", "script.md",
  "public/subtitles.srt", "src/index.ts", "src/Root.tsx", "src/config/episode.ts", "src/utils/layoutValidation.ts"];
const forbidden = [/node_modules\//, /\.(mp4|webm|mov|mkv)$/i, /qa\/dist\//, /\.png$/i];
let bad = 0;
for (const m of must) if (!names.some((n) => n.endsWith(m))) { console.error("✗ missing", m); bad++; }
for (const n of names) if (forbidden.some((r) => r.test(n))) { console.error("✗ forbidden file in zip:", n); bad++; }
const dir = mkdtempSync(join(tmpdir(), "am-zip-"));
execFileSync("unzip", ["-q", zip, "-d", dir]);
const top = names[0].split("/")[0];
const pkg = JSON.parse(readFileSync(join(dir, top, "package.json"), "utf8"));
if (pkg.name !== "arabic-master-day-13") { console.error("✗ package name"); bad++; }
if (!existsSync(join(dir, top, "public/subtitles.srt"))) { console.error("✗ srt not extracted"); bad++; }
console.log(`${names.length} entries; extracted to ${dir}`);
if (bad) process.exit(1);
console.log("✓ ZIP integrity OK (extractable, required files present, no node_modules/video/PNG).");

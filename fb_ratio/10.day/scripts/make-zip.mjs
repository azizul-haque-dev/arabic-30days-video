import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const zipName = "survival-arabic-day10.zip";
if (fs.existsSync(zipName)) {
  fs.unlinkSync(zipName);
}

// Use powershell Compress-Archive via child_process
const items = [
  "package.json",
  "remotion.config.ts",
  "tsconfig.json",
  "day10.srt",
  "script.txt",
  "src",
  "public",
  "data",
  "scripts"
];

const psCmd = `Compress-Archive -Path ${items.join(", ")} -DestinationPath ${zipName} -Force`;
execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: "inherit" });

const stats = fs.statSync(zipName);
console.log(`Created ${zipName}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);


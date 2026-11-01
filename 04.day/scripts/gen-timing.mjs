import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srtPath = path.join(__dirname, "..", "data", "day4.srt");
console.log("Verified SRT source:", srtPath, "exists:", fs.existsSync(srtPath));

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sfxDir = path.join(__dirname, "..", "public", "sfx");

for (const file of fs.readdirSync(sfxDir)) {
  if (!file.endsWith(".wav")) continue;
  const buf = fs.readFileSync(path.join(sfxDir, file));
  const samples = (buf.length - 44) / 2;
  let peak = 0;
  for (let i = 44; i < buf.length; i += 2) {
    const v = Math.abs(buf.readInt16LE(i)) / 32768;
    if (v > peak) peak = v;
  }
  console.log(`${file}: ${(samples / 44100).toFixed(2)}s, peak=${peak.toFixed(2)}, clipping=${peak >= 0.99}`);
}

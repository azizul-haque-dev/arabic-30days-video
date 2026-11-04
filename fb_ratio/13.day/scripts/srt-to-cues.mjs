// SRT থেকে সময় বের করার স্ক্রিপ্ট: node scripts/srt-to-cues.mjs
// সব টাইমিং এই SRT (src/data/script.srt) থেকেই আসে।
import fs from "node:fs";

const raw = fs.readFileSync(new URL("../src/data/script.srt", import.meta.url), "utf8").replace(/\r/g, "");
const toSec = (s) => {
  const m = s.match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};
const cues = raw
  .trim()
  .split(/\n\s*\n/)
  .map((block) => {
    const lines = block.split("\n");
    const [a, b] = lines[1].split("-->").map((x) => x.trim());
    return { i: +lines[0], start: toSec(a), end: toSec(b), text: lines.slice(2).join("\n") };
  });
fs.writeFileSync(new URL("../src/data/cues.json", import.meta.url), JSON.stringify(cues, null, 1));
console.log(`${cues.length} cues, ends at ${cues[cues.length - 1].end}s`);

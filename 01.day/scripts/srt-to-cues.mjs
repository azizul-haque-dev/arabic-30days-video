// SRT -> src/cues.ts  (timing is read ONLY from the SRT; nothing is typed by hand)
import fs from "node:fs";
const file = process.argv[2] ?? "script/audio-11_ben.srt";
const raw = fs.readFileSync(file, "utf8").replace(/\r/g, "");
const toSec = (t) => { const [h, m, rest] = t.split(":"); const [s, ms] = rest.split(","); return +h * 3600 + +m * 60 + +s + +ms / 1000; };
const cues = raw.trim().split(/\n\s*\n/).map((b) => {
  const lines = b.split("\n");
  const [a, z] = lines[1].split(" --> ");
  return { i: +lines[0], s: toSec(a.trim()), e: toSec(z.trim()) };
});
const out = `// AUTO-GENERATED from ${file} by scripts/srt-to-cues.mjs. Do not edit by hand.\nexport type Cue = { i: number; s: number; e: number };\nexport const CUES: Cue[] = ${JSON.stringify(cues, null, 1).replace(/\n\s*/g, " ").replace(/\}, \{/g, "},\n  {").replace("[ {", "[\n  {").replace("} ]", "}\n]")};\n`;
fs.writeFileSync("src/cues.ts", out);
console.log(cues.length, "cues; last end", cues.at(-1).e);

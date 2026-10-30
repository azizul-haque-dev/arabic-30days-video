// Parses subtitle.srt -> src/data/cues.ts  (the SRT is the ONLY timing source)
import fs from "node:fs";
const raw = fs.readFileSync("subtitle.srt", "utf8").replace(/\r/g, "").trim();
const ts = (s) => {
  const [h, m, r] = s.split(":");
  const [sec, ms] = r.split(",");
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};
const cues = raw.split(/\n\s*\n/).map((blk) => {
  const lines = blk.split("\n");
  const [a, b] = lines[1].split(" --> ");
  return {start: ts(a.trim()), end: ts(b.trim()), text: lines.slice(2).join(" ").replace(/\s+/g, " ").trim()};
});
fs.mkdirSync("src/data", {recursive: true});
fs.writeFileSync(
  "src/data/cues.ts",
  `// AUTO-GENERATED from subtitle.srt by scripts/gen-cues.mjs — do not edit by hand.\nexport type Cue = {start: number; end: number; text: string};\nexport const CUES: Cue[] = ${JSON.stringify(cues, null, 2)};\n`
);
console.log("cues:", cues.length, "end:", cues[cues.length - 1].end);

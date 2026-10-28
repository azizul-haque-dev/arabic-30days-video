// SRT -> src/data/cues.ts  (run: node scripts/gen-cues.mjs)
import fs from "node:fs";
const srt = fs.readFileSync(new URL("../public/subtitles.srt", import.meta.url), "utf8").replace(/\r/g, "");
const ts = (s) => { const m = s.match(/(\d+):(\d+):(\d+)[,.](\d+)/); return +m[1]*3600 + +m[2]*60 + +m[3] + +m[4]/1000; };
const cues = srt.trim().split(/\n\s*\n/).map((b) => {
  const lines = b.split("\n");
  const [a, z] = lines[1].split("-->").map((x) => ts(x.trim()));
  return { i: +lines[0], start: a, end: z, text: lines.slice(2).join(" ").replace(/\s+/g, " ").trim() };
});
fs.writeFileSync(new URL("../src/data/cues.ts", import.meta.url),
`// AUTO-GENERATED from public/subtitles.srt by scripts/gen-cues.mjs — do not edit by hand.
export type Cue = { i: number; start: number; end: number; text: string };
export const cues: Cue[] = ${JSON.stringify(cues, null, 1)};
`);
console.log(cues.length, "cues, ends at", cues.at(-1).end);

// SRT -> src/data/cues.ts (SRT-ই একমাত্র সময়ের উৎস)
import fs from "node:fs";
const raw = fs.readFileSync("src/data/voiceover.srt", "utf8").replace(/\r/g, "").trim();
const toSec = (t) => { const [h, m, r] = t.split(":"); const [s, ms] = r.split(","); return +h * 3600 + +m * 60 + +s + +ms / 1000; };
const cues = raw.split(/\n\s*\n/).map((b) => {
  const l = b.split("\n"); const [a, z] = l[1].split(" --> ");
  return { index: +l[0], start: toSec(a.trim()), end: toSec(z.trim()), text: l.slice(2).join(" ").replace(/\s+/g, " ").trim() };
});
fs.writeFileSync("src/data/cues.ts", `// AUTO-GENERATED from voiceover.srt — run: node scripts/srt-to-ts.mjs\nexport type Cue = { index: number; start: number; end: number; text: string };\nexport const CUES: Cue[] = ${JSON.stringify(cues, null, 2)};\n`);
console.log("cues:", cues.length, "end:", cues.at(-1).end);

import fs from "node:fs";

const raw = fs.readFileSync(new URL("../data/day10.srt", import.meta.url), "utf8").replace(/\r/g, "");
const ts = (s) => {
  const [h, m, r] = s.split(":");
  const [sec, ms] = r.split(",");
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};

const cues = raw
  .trim()
  .split(/\n\n+/)
  .map((b) => {
    const l = b.split("\n");
    const [a, z] = l[1].split(" --> ");
    return {
      n: +l[0],
      s: ts(a),
      e: ts(z),
      t: l.slice(2).join(" ").replace(/\s+/g, " ").trim(),
    };
  });

cues.forEach(c => {
  console.log(`Cue ${c.n} [${c.s.toFixed(2)} - ${c.e.toFixed(2)}]: ${c.t}`);
});


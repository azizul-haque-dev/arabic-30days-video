// Generates tiny deterministic SFX (pop + whoosh) as 16-bit WAVs. No downloads.
import fs from "node:fs";
const SR = 44100;
const write = (name, samples) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, 44 + i * 2));
  fs.mkdirSync("public/sfx", { recursive: true });
  fs.writeFileSync(`public/sfx/${name}.wav`, buf);
};
// pop: pitch-dropping sine, fast decay
{
  const n = Math.floor(SR * 0.16); const out = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR; const f = 520 * Math.exp(-t * 14) + 180;
    ph += (2 * Math.PI * f) / SR; out[i] = Math.sin(ph) * Math.exp(-t * 24) * 0.8;
  }
  write("pop", out);
}
// whoosh: filtered noise swell
{
  const n = Math.floor(SR * 0.5); const out = new Float32Array(n); let lp = 0, seed = 7;
  for (let i = 0; i < n; i++) {
    const t = i / n; seed = (seed * 16807) % 2147483647; const r = (seed / 2147483647) * 2 - 1;
    const a = 0.02 + 0.5 * Math.sin(Math.PI * t) ** 2; lp += a * (r - lp);
    out[i] = lp * Math.sin(Math.PI * t) * 1.6;
  }
  write("whoosh", out);
}
console.log("sfx ready");

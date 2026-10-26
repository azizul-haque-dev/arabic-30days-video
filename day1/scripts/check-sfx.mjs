// Verifies every SFX: duration, peak, RMS, clipping.
import fs from "node:fs";
for (const f of fs.readdirSync("public/sfx").filter((n) => n.endsWith(".wav")).sort()) {
  const b = fs.readFileSync(`public/sfx/${f}`); const n = (b.length - 44) / 2; let pk = 0, s = 0, clip = 0, act = 0;
  for (let i = 0; i < n; i++) { const v = b.readInt16LE(44 + i * 2) / 32768; pk = Math.max(pk, Math.abs(v)); if (Math.abs(v) >= 0.999) clip++; }
  for (let i = 0; i < n; i++) { const v = b.readInt16LE(44 + i * 2) / 32768; if (Math.abs(v) > pk * 0.05) { s += v * v; act++; } }
  const db = (x) => (20 * Math.log10(x)).toFixed(1);
  console.log(f.padEnd(12), "dur", (n / 44100).toFixed(2) + "s", "peak", db(pk) + "dBFS", "rms", db(Math.sqrt(s / act)) + "dBFS", clip ? "CLIPPING " + clip : "no clipping");
}

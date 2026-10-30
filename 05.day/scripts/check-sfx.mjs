// Verifies each SFX: duration, peak level, clipping, RMS (loudness match).
import fs from "node:fs";
const dir = new URL("../public/sfx/", import.meta.url).pathname;
const limits = { whoosh: 0.8 };
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".wav"))) {
  const b = fs.readFileSync(dir + f);
  const n = (b.length - 44) / 2;
  let peak = 0, sum = 0, clip = 0;
  for (let i = 0; i < n; i++) {
    const v = b.readInt16LE(44 + i * 2) / 32768;
    peak = Math.max(peak, Math.abs(v)); sum += v * v; if (Math.abs(v) >= 0.999) clip++;
  }
  const dur = n / 44100, name = f.replace(".wav", "");
  const rmsDb = 20 * Math.log10(Math.sqrt(sum / n));
  const ok = dur <= (limits[name] ?? 0.5) && peak < 0.99 && clip === 0;
  console.log(f.padEnd(11), "dur", dur.toFixed(3) + "s", "peak", (20 * Math.log10(peak)).toFixed(1) + "dB", "rms", rmsDb.toFixed(1) + "dB", "clip", clip, ok ? "OK" : "CHECK");
}

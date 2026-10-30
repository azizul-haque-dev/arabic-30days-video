// Pure-Node SFX synth: 16-bit mono WAV, clean UI/motion-graphics sounds. No downloads.
import fs from "node:fs";
const SR = 44100;
let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const N = (sec) => Math.floor(sec * SR);
const env = (t, a, tau) => (t < a ? t / a : Math.exp(-(t - a) / tau));
function biquad(type, f0, Q) {
  const w = (2 * Math.PI * f0) / SR, al = Math.sin(w) / (2 * Q), c = Math.cos(w);
  let b0, b1, b2, a0 = 1 + al, a1 = -2 * c, a2 = 1 - al;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = al; b1 = 0; b2 = -al; }
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0, x1: 0, x2: 0, y1: 0, y2: 0 };
}
const run = (f, x) => { const y = f.b0 * x + f.b1 * f.x1 + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2; f.x2 = f.x1; f.x1 = x; f.y2 = f.y1; f.y1 = y; return y; };
function lowpass(buf, f0) { const f = biquad("lp", f0, 0.707); return buf.map((x) => run(f, x)); }
function reverb(buf, mix = 0.1) { // tiny comb reverb
  const out = Float32Array.from(buf); const taps = [[0.023, 0.35], [0.037, 0.28], [0.051, 0.2]];
  for (const [d, g] of taps) { const n = N(d); for (let i = n; i < out.length; i++) out[i] += buf[i - n] * g * mix * 3; }
  return out;
}
function fade(buf, inS = 0.003, outS = 0.02) {
  const a = N(inS), b = N(outS);
  for (let i = 0; i < a; i++) buf[i] *= i / a;
  for (let i = 0; i < b; i++) buf[buf.length - 1 - i] *= i / b;
  return buf;
}
const gen = (dur, fn) => { const b = new Float32Array(N(dur)); for (let i = 0; i < b.length; i++) b[i] = fn(i / SR, i); return b; };

const sounds = {
  pop: () => { let ph = 0; return reverb(lowpass(gen(0.22, (t) => { const f = 180 + 340 * Math.exp(-t / 0.035); ph += (2 * Math.PI * f) / SR; return Math.sin(ph) * env(t, 0.003, 0.05); }), 3500), 0.08); },
  click: () => { const hp = biquad("hp", 2600, 0.8); return lowpass(gen(0.09, (t) => run(hp, rnd()) * env(t, 0.0008, 0.009)), 8000); },
  tick: () => { const bp = biquad("bp", 3200, 2); return lowpass(gen(0.12, (t) => run(bp, rnd()) * 2.2 * env(t, 0.001, 0.014) + Math.sin(2 * Math.PI * 1300 * t) * 0.4 * env(t, 0.001, 0.02)), 6500); },
  whoosh: () => { const bp = biquad("bp", 600, 1.1); let ph = 0; const d = 0.62; return reverb(lowpass(gen(d, (t) => { const f = 400 + 2000 * Math.pow(t / d, 1.4); const w = (2 * Math.PI * f) / SR, al = Math.sin(w) / 2.4, c = Math.cos(w); bp.b0 = al / (1 + al); bp.b1 = 0; bp.b2 = -al / (1 + al); bp.a1 = (-2 * c) / (1 + al); bp.a2 = (1 - al) / (1 + al); return run(bp, rnd()) * Math.pow(Math.sin(Math.PI * Math.min(1, t / d)), 1.6); }), 5000), 0.1); },
  swipe: () => { const bp = biquad("bp", 900, 1.1); const d = 0.36; return lowpass(gen(d, (t) => { const f = 700 + 2600 * Math.pow(t / d, 1.3); const w = (2 * Math.PI * f) / SR, al = Math.sin(w) / 2.4, c = Math.cos(w); bp.b0 = al / (1 + al); bp.b2 = -al / (1 + al); bp.a1 = (-2 * c) / (1 + al); bp.a2 = (1 - al) / (1 + al); return run(bp, rnd()) * Math.pow(Math.sin(Math.PI * Math.min(1, t / d)), 1.4); }), 6000); },
  chime: () => reverb(lowpass(gen(0.5, (t) => (Math.sin(2 * Math.PI * 784 * t) + 0.3 * Math.sin(2 * Math.PI * 1568 * t) * Math.exp(-t / 0.08) + 0.12 * Math.sin(2 * Math.PI * 2358 * t) * Math.exp(-t / 0.05)) * env(t, 0.004, 0.16)), 5000), 0.12),
  thud: () => { let ph = 0; return lowpass(gen(0.3, (t) => { const f = 55 + 60 * Math.exp(-t / 0.05); ph += (2 * Math.PI * f) / SR; return Math.sin(ph) * env(t, 0.006, 0.09); }), 420); },
};

fs.mkdirSync("public/sfx", { recursive: true });
const report = [];
for (const [name, make] of Object.entries(sounds)) {
  const buf = fade(make());
  let sum = 0, peak = 0; for (const x of buf) { sum += x * x; peak = Math.max(peak, Math.abs(x)); }
  const rms = Math.sqrt(sum / buf.length);
  const target = 0.7 / peak; // peak-normalise to 0.7 (-3 dBFS), consistent level
  const k = Math.min(target, 0.9 / peak);
  const pcm = Buffer.alloc(44 + buf.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + buf.length * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(buf.length * 2, 40);
  let pk2 = 0, clip = 0;
  buf.forEach((x, i) => { const v = Math.max(-1, Math.min(1, x * k)); if (Math.abs(v) >= 0.999) clip++; pk2 = Math.max(pk2, Math.abs(v)); pcm.writeInt16LE(Math.round(v * 32767), 44 + i * 2); });
  fs.writeFileSync(`public/sfx/${name}.wav`, pcm);
  report.push({ name, dur: +(buf.length / SR).toFixed(3), peak: +pk2.toFixed(3), rms: +(rms * k).toFixed(3), clipped: clip });
}
console.table(report);

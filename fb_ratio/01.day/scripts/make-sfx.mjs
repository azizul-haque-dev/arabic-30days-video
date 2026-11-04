// Synthesizes the small, clean UI/motion SFX kit into public/sfx/*.wav (44.1kHz, 16-bit mono).
import fs from "node:fs";
const SR = 44100;
const N = (sec) => Math.floor(sec * SR);
let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };

const lowpass = (x, fc) => { const a = 1 - Math.exp(-2 * Math.PI * fc / SR); let y = 0; return x.map((v) => (y += a * (v - y))); };
const highpass = (x, fc) => { const lp = lowpass(x, fc); return x.map((v, i) => v - lp[i]); };
// state-variable band-pass with per-sample centre frequency
const bandpassSweep = (x, f0, f1, q) => {
  let low = 0, band = 0;
  return x.map((v, i) => {
    const f = f0 * Math.pow(f1 / f0, i / x.length);
    const g = 2 * Math.sin(Math.PI * f / SR);
    low += g * band; const high = v - low - band / q; band += g * high; return band;
  });
};
// tiny, quiet reverb (3 combs)
const reverb = (x, tail = 0.1, mix = 0.14) => {
  const out = new Float32Array(x.length + N(tail)); out.set(x);
  for (const [d, fb] of [[0.029, 0.28], [0.037, 0.24], [0.053, 0.2]]) {
    const dl = N(d); const buf = new Float32Array(out.length);
    for (let i = 0; i < out.length; i++) { const src = i < x.length ? x[i] : 0; buf[i] = src + (i >= dl ? buf[i - dl] * fb : 0); }
    for (let i = 0; i < out.length; i++) out[i] += buf[i] * mix / 3;
  }
  return Array.from(out);
};
const fadeOut = (x, sec = 0.025) => { const n = N(sec); for (let i = 0; i < n && i < x.length; i++) x[x.length - 1 - i] *= i / n; return x; };

const pop = () => { // soft pop: sine with fast downward pitch + short envelope
  const len = N(0.16); const x = new Array(len); let ph = 0;
  for (let i = 0; i < len; i++) { const t = i / SR; const f = 170 + 420 * Math.exp(-t / 0.028); ph += 2 * Math.PI * f / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.05); x[i] = Math.sin(ph) * env; }
  return reverb(fadeOut(lowpass(x, 3200)), 0.06, 0.1);
};
const click = () => { // crisp click: high-passed noise burst + tiny tone tick
  const len = N(0.09); const x = new Array(len);
  for (let i = 0; i < len; i++) { const t = i / SR; const env = Math.min(1, t / 0.0012) * Math.exp(-t / 0.011);
    x[i] = (rnd() * 0.8 + Math.sin(2 * Math.PI * 2100 * t) * 0.5) * env; }
  return reverb(fadeOut(lowpass(highpass(x, 1800), 7000)), 0.05, 0.08);
};
const whoosh = (dur, f0, f1, q = 1.6) => { // smooth band-pass noise sweep, fade in/out
  const len = N(dur); let x = Array.from({ length: len }, () => rnd());
  x = bandpassSweep(x, f0, f1, q);
  x = x.map((v, i) => { const p = i / len; return v * Math.pow(Math.sin(Math.PI * Math.pow(p, 0.8)), 2); });
  return reverb(fadeOut(lowpass(x, 5200)), 0.08, 0.12);
};
const chime = () => { // short soft pluck/chime with gentle overtones
  const len = N(0.42); const x = new Array(len);
  const partials = [[880, 1, 0.16], [1318.5, 0.35, 0.11], [1760, 0.16, 0.07], [2637, 0.06, 0.04]];
  for (let i = 0; i < len; i++) { const t = i / SR; let v = 0;
    for (const [f, a, tau] of partials) v += Math.sin(2 * Math.PI * f * t) * a * Math.exp(-t / tau);
    x[i] = v * Math.min(1, t / 0.005); }
  return reverb(fadeOut(lowpass(x, 4800)), 0.1, 0.16);
};
const thud = () => { // very light soft thud
  const len = N(0.3); const x = new Array(len); let ph = 0;
  for (let i = 0; i < len; i++) { const t = i / SR; const f = 52 + 60 * Math.exp(-t / 0.05); ph += 2 * Math.PI * f / SR;
    x[i] = Math.sin(ph) * Math.min(1, t / 0.008) * Math.exp(-t / 0.09); }
  return reverb(fadeOut(lowpass(x, 600)), 0.05, 0.06);
};

const kit = {
  pop: pop(), click: click(), thud: thud(), chime: chime(),
  whoosh: whoosh(0.6, 380, 2400),   // title / text entry
  swipe: whoosh(0.34, 900, 3600, 1.3), // scene transition
};

// loudness match: scale each sound so RMS (over active part) is equal, but keep peak <= 0.85
const stats = (x) => { let pk = 0, s = 0, n = 0; for (const v of x) { pk = Math.max(pk, Math.abs(v)); } const thr = pk * 0.05;
  for (const v of x) if (Math.abs(v) > thr) { s += v * v; n++; } return { pk, rms: Math.sqrt(s / Math.max(n, 1)) }; };
const TARGET_RMS = 0.2;
fs.mkdirSync("public/sfx", { recursive: true });
for (const [name, x] of Object.entries(kit)) {
  const { pk, rms } = stats(x);
  const g = Math.min(TARGET_RMS / rms, 0.85 / pk);
  const buf = Buffer.alloc(44 + x.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * g * 32767))), 44 + i * 2));
  fs.writeFileSync(`public/sfx/${name}.wav`, buf);
}
console.log("sfx written:", Object.keys(kit).join(", "));

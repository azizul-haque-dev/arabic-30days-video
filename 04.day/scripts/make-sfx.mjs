// Synthesizes a small, clean UI-style SFX kit into public/sfx/ (16-bit WAV, mono, 44.1 kHz).
// run: node scripts/make-sfx.mjs
import fs from "node:fs";
const SR = 44100;
fs.mkdirSync(new URL("../public/sfx/", import.meta.url), { recursive: true });

let seed = 12345; // deterministic noise
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const buf = (sec) => new Float32Array(Math.round(sec * SR));

// RBJ biquad
const biquad = (x, type, fc, q = 0.707) => {
  const w0 = 2 * Math.PI * fc / SR, al = Math.sin(w0) / (2 * q), c = Math.cos(w0);
  let b0, b1, b2, a0 = 1 + al, a1 = -2 * c, a2 = 1 - al;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = al; b1 = 0; b2 = -al; } // bandpass (const 0 dB peak)
  const y = new Float32Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
};
const reverb = (x, mix = 0.12) => { // very short multi-tap room, low-passed
  const y = Float32Array.from(x);
  const taps = [[0.021, 0.5], [0.034, 0.35], [0.052, 0.22]];
  const wet = new Float32Array(x.length);
  for (const [d, g] of taps) { const o = Math.round(d * SR); for (let i = o; i < x.length; i++) wet[i] += x[i - o] * g; }
  const w = biquad(wet, "lp", 3000);
  for (let i = 0; i < y.length; i++) y[i] += w[i] * mix * 2;
  return y;
};
const fadeEdges = (x, inMs, outMs) => {
  const a = Math.round(inMs / 1000 * SR), b = Math.round(outMs / 1000 * SR);
  for (let i = 0; i < a && i < x.length; i++) x[i] *= i / a;
  for (let i = 0; i < b && i < x.length; i++) x[x.length - 1 - i] *= i / b;
  return x;
};

const pop = (f0, f1, dur) => {
  const x = buf(dur); let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR, f = f1 + (f0 - f1) * Math.exp(-t * 38);
    ph += 2 * Math.PI * f / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 26);
    x[i] = Math.sin(ph) * env;
  }
  return fadeEdges(reverb(biquad(x, "lp", 3200)), 1, 30);
};
const click = () => {
  const x = buf(0.14);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = rnd() * Math.exp(-t * 160) * 0.9 + Math.sin(2 * Math.PI * 2100 * t) * Math.exp(-t * 210) * 0.35;
  }
  return fadeEdges(reverb(biquad(biquad(x, "hp", 1800), "lp", 7500), 0.08), 1, 25);
};
const sweep = (dur, fa, fb, q, peak = 0.5) => {
  const n = buf(dur); const x = new Float32Array(n.length);
  // time-varying band-pass via short blocks
  const block = 256; let ph = 0;
  for (let s = 0; s < n.length; s += block) {
    const t = s / n.length, fc = fa * Math.pow(fb / fa, t);
    const seg = new Float32Array(Math.min(block, n.length - s)); for (let i = 0; i < seg.length; i++) seg[i] = rnd();
    const y = biquad(seg, "bp", fc, q);
    for (let i = 0; i < y.length; i++) x[s + i] = y[i];
  }
  void ph;
  for (let i = 0; i < x.length; i++) { const t = i / x.length; x[i] *= Math.pow(Math.sin(Math.PI * Math.pow(t, peak)), 2); }
  return fadeEdges(reverb(biquad(x, "lp", 6000), 0.1), 12, 60);
};
const chime = () => {
  const x = buf(0.55);
  const parts = [[784, 1, 7], [1175, 0.32, 10], [1568, 0.14, 15], [2093, 0.05, 22]];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR; let v = 0;
    for (const [fr, a, d] of parts) v += Math.sin(2 * Math.PI * fr * t) * a * Math.exp(-t * d);
    x[i] = v * Math.min(1, t / 0.005);
  }
  return fadeEdges(reverb(biquad(x, "lp", 4500), 0.14), 1, 90);
};
const thud = () => {
  const x = buf(0.32); let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR, f = 46 + 52 * Math.exp(-t * 28);
    ph += 2 * Math.PI * f / SR;
    x[i] = Math.sin(ph) * Math.min(1, t / 0.008) * Math.exp(-t * 14);
  }
  return fadeEdges(biquad(x, "lp", 240), 1, 60);
};

const kit = {
  "pop_a": pop(560, 190, 0.24),
  "pop_b": pop(660, 225, 0.2),
  "click": click(),
  "whoosh": sweep(0.7, 380, 2600, 1.1, 0.8),
  "swipe": sweep(0.38, 2800, 700, 1.3, 0.7),
  "chime": chime(),
  "thud": thud(),
};

// level-match: target RMS over the audible part, peak capped (no clipping)
const TARGET_RMS = 0.11, PEAK_CAP = 0.85;
const wav = (name, x) => {
  let pk = 0, sum = 0, cnt = 0;
  for (const v of x) { pk = Math.max(pk, Math.abs(v)); }
  for (const v of x) if (Math.abs(v) > pk * 0.05) { sum += v * v; cnt++; }
  let g = TARGET_RMS / Math.sqrt(sum / cnt);
  if (pk * g > PEAK_CAP) g = PEAK_CAP / pk;
  const out = Buffer.alloc(44 + x.length * 2);
  out.write("RIFF", 0); out.writeUInt32LE(36 + x.length * 2, 4); out.write("WAVEfmt ", 8);
  out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22); out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write("data", 36); out.writeUInt32LE(x.length * 2, 40);
  let clip = 0, p2 = 0, s2 = 0, c2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i] * g; if (Math.abs(v) >= 0.999) clip++;
    p2 = Math.max(p2, Math.abs(v)); out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2);
    if (Math.abs(v) > p2 * 0.05) { s2 += v * v; c2++; }
  }
  fs.writeFileSync(new URL(`../public/sfx/${name}.wav`, import.meta.url), out);
  console.log(name.padEnd(7), "dur", (x.length / SR).toFixed(2) + "s", "peak", (20 * Math.log10(p2)).toFixed(1) + "dBFS", "rms", (20 * Math.log10(Math.sqrt(s2 / c2))).toFixed(1) + "dB", "clipped", clip);
};
for (const [k, v] of Object.entries(kit)) wav(k, v);

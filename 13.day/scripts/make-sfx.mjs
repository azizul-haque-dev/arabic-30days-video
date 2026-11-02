// SFX সিন্থেসাইজার: node scripts/make-sfx.mjs  → public/sfx/*.wav (16-bit, 48kHz, mono)
// pop = দ্রুত নিচে নামা pitch সহ sine · click = highpass noise burst · whoosh = bandpass noise sweep
// chime = নরম ওভারটোনসহ ছোট decay · thud = নরম low sine; সবকিছুতে হালকা lowpass + খুব ছোট reverb
import fs from "node:fs";

const SR = 48000;
const TARGET_PEAK = 0.85;
fs.mkdirSync(new URL("../public/sfx/", import.meta.url), { recursive: true });

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const lowpass = (x, fc) => {
  const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  return x.map((v) => (y += a * (v - y)));
};
const highpass = (x, fc) => {
  const lp = lowpass(x, fc);
  return x.map((v, i) => v - lp[i]);
};
const tinyReverb = (x, wet = 0.16) => {
  const taps = [[0.021, 0.5], [0.037, 0.35], [0.058, 0.22], [0.083, 0.12]];
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    let v = x[i];
    for (const [d, g] of taps) {
      const j = i - Math.round(d * SR);
      if (j >= 0) v += x[j] * g * wet * 2;
    }
    out[i] = v;
  }
  return out;
};
const fadeEnds = (x, inMs = 1, outMs = 25) => {
  const a = Math.round((inMs / 1000) * SR), b = Math.round((outMs / 1000) * SR);
  for (let i = 0; i < a; i++) x[i] *= i / a;
  for (let i = 0; i < b; i++) x[x.length - 1 - i] *= i / b;
  return x;
};
const gen = (dur, fn) => Float32Array.from({ length: Math.round(dur * SR) }, (_, i) => fn(i / SR, i));
const atk = (t, a) => (t < a ? 0.5 - 0.5 * Math.cos((Math.PI * t) / a) : 1); // নরম attack

// RBJ bandpass, সময়ের সাথে বদলানো কেন্দ্র-ফ্রিকোয়েন্সি
const sweepBandpass = (x, f0, f1, q) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x.map((v, i) => {
    const p = i / x.length;
    const fc = f0 * Math.pow(f1 / f0, p);
    const w = (2 * Math.PI * fc) / SR, al = Math.sin(w) / (2 * q), c = Math.cos(w);
    const b0 = al, b2 = -al, a0 = 1 + al, a1 = -2 * c, a2 = 1 - al;
    const y = (b0 * v + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = v; y2 = y1; y1 = y;
    return y;
  });
};

const sounds = {
  pop() {
    let ph = 0;
    const x = gen(0.26, (t) => {
      const f = 170 + 430 * Math.exp(-t / 0.022);
      ph += (2 * Math.PI * f) / SR;
      return (Math.sin(ph) + 0.18 * Math.sin(2 * ph)) * atk(t, 0.004) * Math.exp(-t / 0.055);
    });
    return fadeEnds(tinyReverb(lowpass(x, 3600), 0.12), 1, 40);
  },
  click() {
    const noise = gen(0.14, (t) => rnd() * atk(t, 0.0008) * Math.exp(-t / 0.0035));
    const tick = gen(0.14, (t) => Math.sin(2 * Math.PI * 1900 * t) * 0.7 * atk(t, 0.0008) * Math.exp(-t / 0.009));
    const x = highpass(noise, 2200).map((v, i) => v + tick[i]);
    return fadeEnds(tinyReverb(lowpass(Float32Array.from(x), 9000), 0.1), 0.5, 30);
  },
  whoosh() {
    const n = gen(0.7, () => rnd());
    const bp = sweepBandpass(n, 380, 3200, 1.1);
    const x = bp.map((v, i) => {
      const p = i / bp.length;
      const env = Math.pow(Math.sin(Math.PI * Math.pow(p, 0.7)), 2);
      return v * env;
    });
    return fadeEnds(tinyReverb(lowpass(Float32Array.from(x), 6500), 0.1), 4, 80);
  },
  chime() {
    const parts = [[880, 1, 0.16], [1760.5, 0.32, 0.09], [2641, 0.14, 0.05], [1318.5, 0.2, 0.12]];
    const x = gen(0.5, (t) => parts.reduce((s, [f, g, d]) => s + Math.sin(2 * Math.PI * f * t) * g * Math.exp(-t / d), 0) * atk(t, 0.003));
    return fadeEnds(tinyReverb(lowpass(x, 6000), 0.2), 1, 90);
  },
  thud() {
    let ph = 0;
    const x = gen(0.36, (t) => {
      const f = 56 + 54 * Math.exp(-t / 0.05);
      ph += (2 * Math.PI * f) / SR;
      return Math.sin(ph) * atk(t, 0.008) * Math.exp(-t / 0.09);
    });
    return fadeEnds(lowpass(x, 420), 2, 70);
  },
};

const wav = (x) => {
  const buf = Buffer.alloc(44 + x.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  return buf;
};

for (const [name, make] of Object.entries(sounds)) {
  const x = make();
  const peak = x.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const g = TARGET_PEAK / peak;
  const y = x.map((v) => v * g);
  const rms = Math.sqrt(y.reduce((s, v) => s + v * v, 0) / y.length);
  const clipped = y.filter((v) => Math.abs(v) >= 0.999).length;
  fs.writeFileSync(new URL(`../public/sfx/${name}.wav`, import.meta.url), wav(y));
  console.log(`${name}.wav  dur=${(y.length / SR).toFixed(3)}s  peak=${Math.max(...y.map(Math.abs)).toFixed(2)}  rms=${rms.toFixed(3)}  clipped=${clipped}`);
}

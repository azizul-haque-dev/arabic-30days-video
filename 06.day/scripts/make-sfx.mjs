// আধুনিক UI-ধাঁচের ক্লিন SFX সিন্থেসাইজ (কোনো ডাউনলোড নয়, সম্পূর্ণ ডিটারমিনিস্টিক)
// চালাতে: node scripts/make-sfx.mjs
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const OUT = path.resolve('public/sfx');
fs.mkdirSync(OUT, {recursive: true});

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
// State-variable band-pass, centre frequency sweeps over time
const sweepBand = (x, f0, f1, q) => {
  let low = 0, band = 0;
  return x.map((v, i) => {
    const f = f0 * Math.pow(f1 / f0, i / x.length);
    const g = 2 * Math.sin((Math.PI * f) / SR);
    low += g * band;
    const high = v - low - band / q;
    band += g * high;
    return band;
  });
};
// ছোট reverb (৩টি comb, খুব হালকা)
const tinyVerb = (x, mix = 0.12, tail = 0.06) => {
  const n = x.length + Math.floor(tail * SR);
  const y = new Float32Array(n);
  x.forEach((v, i) => (y[i] = v));
  const out = new Float32Array(n);
  for (const [d, fb] of [[0.023, 0.32], [0.031, 0.28], [0.041, 0.24]]) {
    const dl = Math.floor(d * SR);
    const buf = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const dry = i < x.length ? x[i] : 0;
      buf[i] = dry + (i >= dl ? buf[i - dl] * fb : 0);
      out[i] += buf[i] - dry;
    }
  }
  return Array.from(y, (v, i) => v + out[i] * mix);
};
const fade = (x, inMs, outMs) => {
  const a = Math.floor((inMs / 1000) * SR), b = Math.floor((outMs / 1000) * SR);
  return x.map((v, i) => v * Math.min(1, i / Math.max(1, a)) * Math.min(1, (x.length - 1 - i) / Math.max(1, b)));
};
const gen = (dur, fn) => Array.from({length: Math.floor(dur * SR)}, (_, i) => fn(i / SR, i));
const norm = (x, peak = 0.8) => {
  const m = Math.max(...x.map(Math.abs)) || 1;
  return x.map((v) => (v / m) * peak);
};

const save = (name, x) => {
  const n = x.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), 44 + i * 2));
  fs.writeFileSync(path.join(OUT, name + '.wav'), buf);
};

// pop: দ্রুত নিচে নামা pitch সহ sine + ছোট envelope
{
  let ph = 0;
  let x = gen(0.16, (t) => {
    const f = 240 + 520 * Math.exp(-t / 0.028);
    ph += (2 * Math.PI * f) / SR;
    return Math.sin(ph) * Math.min(1, t / 0.003) * Math.exp(-t / 0.045);
  });
  x = lowpass(x, 3200);
  x = tinyVerb(x, 0.1, 0.04);
  save('pop', fade(norm(x), 1, 25));
}
// whoosh: band-pass noise sweep + fade in/out
{
  let x = gen(0.62, () => rnd());
  x = sweepBand(x, 450, 3600, 1.6);
  x = x.map((v, i) => v * Math.pow(Math.sin((Math.PI * i) / x.length), 1.6));
  x = lowpass(x, 5200);
  x = tinyVerb(x, 0.1, 0.08);
  save('whoosh', fade(norm(x, 0.8), 40, 80));
}
// click: high-pass করা ছোট noise burst + অতি ছোট টোন
{
  let x = gen(0.09, (t) => (rnd() * Math.exp(-t / 0.009) + Math.sin(2 * Math.PI * 1900 * t) * 0.35 * Math.exp(-t / 0.006)) * Math.min(1, t / 0.0008));
  x = highpass(x, 1800);
  x = lowpass(x, 7000);
  save('click', fade(norm(x), 0.5, 15));
}
// chime: নরম ওভারটোনসহ ছোট pluck
{
  const f = 987.77;
  let x = gen(0.48, (t) => {
    const e = Math.min(1, t / 0.004) * Math.exp(-t / 0.13);
    return (Math.sin(2 * Math.PI * f * t) + 0.32 * Math.sin(2 * Math.PI * f * 2.005 * t) * Math.exp(-t / 0.08) + 0.1 * Math.sin(2 * Math.PI * f * 3.01 * t) * Math.exp(-t / 0.05)) * e;
  });
  x = lowpass(x, 5200);
  x = tinyVerb(x, 0.12, 0.02);
  save('chime', fade(norm(x), 1, 60));
}
// thud: খুব হালকা সফট থাড (সংযত)
{
  let ph = 0;
  let x = gen(0.3, (t) => {
    const f = 52 + 70 * Math.exp(-t / 0.05);
    ph += (2 * Math.PI * f) / SR;
    return Math.sin(ph) * Math.min(1, t / 0.006) * Math.exp(-t / 0.085);
  });
  x = lowpass(x, 420);
  save('thud', fade(norm(x), 2, 50));
}
console.log('SFX ready →', OUT);

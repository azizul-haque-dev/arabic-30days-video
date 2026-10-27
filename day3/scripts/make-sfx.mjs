// Synthesizes the SFX kit into public/sfx/*.wav (16-bit, 44.1kHz, mono). No downloads.
import fs from "node:fs";
const SR = 44100;
const out = "public/sfx";
fs.mkdirSync(out, { recursive: true });

let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const lowpass = (x, cutoff) => {
  const a = Math.exp((-2 * Math.PI * cutoff) / SR);
  let y = 0;
  return x.map((v) => (y = (1 - a) * v + a * y));
};
const highpass = (x, cutoff) => {
  const lp = lowpass(x, cutoff);
  return x.map((v, i) => v - lp[i]);
};
const bandpass = (x, lo, hi) => lowpass(highpass(x, lo), hi);
const env = (n, att, dec) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / SR;
    const a = Math.min(1, t / att);
    return a * Math.exp(-t / dec);
  });
const tinyReverb = (x) => {
  const y = x.slice();
  [[0.021, 0.22], [0.034, 0.15], [0.047, 0.1]].forEach(([d, g]) => {
    const k = Math.round(d * SR);
    for (let i = k; i < y.length; i++) y[i] += x[i - k] * g;
  });
  return y;
};
const fadeEnd = (x, ms = 12) => {
  const k = Math.round((ms / 1000) * SR);
  for (let i = 0; i < k; i++) x[x.length - 1 - i] *= i / k;
  return x;
};
const normalize = (x, peak = 0.7) => {
  const m = Math.max(...x.map(Math.abs));
  return x.map((v) => (v / m) * peak);
};
const write = (name, x) => {
  const buf = Buffer.alloc(44 + x.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  fs.writeFileSync(`${out}/${name}.wav`, buf);
};

// pop — sine with fast downward pitch glide, tiny envelope
{
  const n = Math.round(0.22 * SR);
  let ph = 0;
  const e = env(n, 0.004, 0.05);
  const x = Array.from({ length: n }, (_, i) => {
    const t = i / SR;
    const f = 180 + 520 * Math.exp(-t / 0.035);
    ph += (2 * Math.PI * f) / SR;
    return Math.sin(ph) * e[i];
  });
  write("pop", fadeEnd(normalize(tinyReverb(lowpass(x, 3500)))));
}
// click — high-passed short noise burst
{
  const n = Math.round(0.07 * SR);
  const e = env(n, 0.001, 0.012);
  const x = Array.from({ length: n }, (_, i) => rnd() * e[i]);
  write("click", fadeEnd(normalize(lowpass(highpass(x, 1800), 7000), 0.6)));
}
// whoosh — band-passed noise sweep, fade in/out
{
  const n = Math.round(0.6 * SR);
  const raw = Array.from({ length: n }, () => rnd());
  const chunks = 24, size = Math.floor(n / chunks);
  let x = new Array(n).fill(0);
  for (let c = 0; c < chunks; c++) {
    const prog = c / chunks;
    const center = 500 + 2600 * Math.sin(prog * Math.PI);
    const seg = bandpass(raw.slice(c * size, (c + 1) * size), center * 0.6, center * 1.4);
    seg.forEach((v, i) => (x[c * size + i] = v));
  }
  x = x.map((v, i) => v * Math.pow(Math.sin((i / n) * Math.PI), 1.6));
  write("whoosh", fadeEnd(normalize(tinyReverb(lowpass(x, 5000)), 0.6)));
}
// thud — soft low sine, restrained
{
  const n = Math.round(0.4 * SR);
  let ph = 0;
  const e = env(n, 0.008, 0.09);
  const x = Array.from({ length: n }, (_, i) => {
    const t = i / SR;
    ph += (2 * Math.PI * (52 + 60 * Math.exp(-t / 0.05))) / SR;
    return Math.sin(ph) * e[i];
  });
  write("thud", fadeEnd(normalize(lowpass(x, 400), 0.6)));
}
// chime — soft pluck with gentle overtones
{
  const n = Math.round(0.5 * SR);
  const e = env(n, 0.003, 0.11);
  const f0 = 784;
  const x = Array.from({ length: n }, (_, i) => {
    const t = i / SR;
    return (Math.sin(2 * Math.PI * f0 * t) + 0.35 * Math.sin(2 * Math.PI * f0 * 2.01 * t) * Math.exp(-t / 0.07) + 0.15 * Math.sin(2 * Math.PI * f0 * 3 * t) * Math.exp(-t / 0.04)) * e[i];
  });
  write("chime", fadeEnd(normalize(tinyReverb(lowpass(x, 4500)), 0.6)));
}
console.log("sfx written");

// Synthesises the SFX kit (6 short, soft UI sounds) into public/sfx/*.wav
// Zero downloads, fully deterministic.  Run: node scripts/generate-sfx.mjs
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const OUT = path.resolve("public/sfx");
fs.mkdirSync(OUT, {recursive: true});

// deterministic PRNG
let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0xffffffff;
};
const noise = () => rnd() * 2 - 1;
const buf = (sec) => new Float32Array(Math.floor(sec * SR));

// ---- filters ----
const lowpass = (x, fc) => {
  const a = Math.exp((-2 * Math.PI * fc) / SR);
  const y = new Float32Array(x.length);
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    s = (1 - a) * x[i] + a * s;
    y[i] = s;
  }
  return y;
};
const highpass = (x, fc) => {
  const lp = lowpass(x, fc);
  return x.map((v, i) => v - lp[i]);
};
// RBJ band-pass biquad with time-varying centre
const sweepBandpass = (x, f0, f1, q) => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length;
    const f = f0 * Math.pow(f1 / f0, t);
    const w = (2 * Math.PI * f) / SR;
    const alpha = Math.sin(w) / (2 * q);
    const b0 = alpha, b1 = 0, b2 = -alpha;
    const a0 = 1 + alpha, a1 = -2 * Math.cos(w), a2 = 1 - alpha;
    const out = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = out;
    y[i] = out;
  }
  return y;
};
// very short, soft reverb (3 taps, darkened)
const tinyReverb = (x) => {
  const taps = [[0.023, 0.16], [0.041, 0.1], [0.067, 0.06]];
  const y = new Float32Array(x.length + Math.floor(0.1 * SR));
  x.forEach((v, i) => (y[i] += v));
  const wet = lowpass(x, 3500);
  for (const [d, g] of taps) {
    const off = Math.floor(d * SR);
    wet.forEach((v, i) => (y[i + off] += v * g));
  }
  return y;
};
const fade = (x, inS, outS) => {
  const ni = Math.floor(inS * SR), no = Math.floor(outS * SR);
  for (let i = 0; i < x.length; i++) {
    let g = 1;
    if (i < ni) g *= 0.5 - 0.5 * Math.cos((Math.PI * i) / ni);
    const r = x.length - 1 - i;
    if (r < no) g *= 0.5 - 0.5 * Math.cos((Math.PI * r) / no);
    x[i] *= g;
  }
  return x;
};
const finish = (x, lp = 7500) => fade(lowpass(tinyReverb(lowpass(x, lp)), lp), 0.002, 0.03);

// ---- sounds ----
const sounds = {};

// pop: sine with fast downward pitch + short envelope
sounds.pop = (() => {
  const x = buf(0.22);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 190 + 420 * Math.exp(-t * 38);
    ph += (2 * Math.PI * f) / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 24);
    x[i] = (Math.sin(ph) + 0.18 * Math.sin(2 * ph)) * env;
  }
  return finish(x, 6000);
})();

// click: high-passed tiny noise burst + faint tick
sounds.click = (() => {
  const x = buf(0.09);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.0015) * Math.exp(-t * 85);
    x[i] = noise() * env + 0.35 * Math.sin(2 * Math.PI * 1900 * t) * Math.exp(-t * 120);
  }
  return finish(highpass(x, 1800), 7500);
})();

// whoosh: band-passed noise sweep, fade in / out
sounds.whoosh = (() => {
  const x = buf(0.7);
  for (let i = 0; i < x.length; i++) x[i] = noise();
  const y = sweepBandpass(x, 350, 2600, 0.9);
  return finish(fade(y, 0.22, 0.4), 6500);
})();

// swipe: shorter, softer whoosh used on scene transitions
sounds.swipe = (() => {
  const x = buf(0.4);
  for (let i = 0; i < x.length; i++) x[i] = noise();
  const y = sweepBandpass(x, 900, 3200, 1.1);
  return finish(fade(y, 0.12, 0.24), 6000);
})();

// chime: soft pluck with gentle overtones and short decay
sounds.chime = (() => {
  const x = buf(0.38);
  const partials = [[784, 1, 9], [1175, 0.45, 12], [1568, 0.22, 16], [2352, 0.08, 20]];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const [f, g, d] of partials) v += g * Math.sin(2 * Math.PI * f * t) * Math.exp(-t * d);
    x[i] = v * Math.min(1, t / 0.006);
  }
  return finish(x, 6500);
})();

// thud: very soft low thump for the hook / key message (restrained)
sounds.thud = (() => {
  const x = buf(0.32);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 52 + 70 * Math.exp(-t * 30);
    ph += (2 * Math.PI * f) / SR;
    x[i] = Math.sin(ph) * Math.min(1, t / 0.006) * Math.exp(-t * 14);
  }
  return finish(x, 900);
})();

// ---- level match (RMS), then write 16-bit WAV ----
const TARGET_RMS = 0.11, PEAK_CAP = 0.89;
for (const [name, x] of Object.entries(sounds)) {
  let sum = 0;
  for (const v of x) sum += v * v;
  const rms = Math.sqrt(sum / x.length);
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  const gain = Math.min(TARGET_RMS / rms, PEAK_CAP / peak);
  const pcm = Buffer.alloc(44 + x.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + x.length * 2, 4); pcm.write("WAVE", 8);
  pcm.write("fmt ", 12); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36); pcm.writeUInt32LE(x.length * 2, 40);
  for (let i = 0; i < x.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, x[i] * gain)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, `${name}.wav`), pcm);
}
console.log("SFX written to", OUT);

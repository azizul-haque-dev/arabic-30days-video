// Synthesises a small, soft UI/motion-graphics SFX kit → public/sfx/*.wav (16-bit mono, 44.1 kHz).
// pop = pitch-dropped sine · click = high-passed noise burst · whoosh = band-pass noise sweep
// chime = soft plucked partials · thud = very soft low sine · tick = tiny click
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const OUT = new URL("../public/sfx/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const buf = (sec) => new Float32Array(Math.round(sec * SR));
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t / d);

function lowpass(x, fc) {
  const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  const o = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) o[i] = y += a * (x[i] - y);
  return o;
}
function highpass(x, fc) {
  const l = lowpass(x, fc);
  return x.map((v, i) => v - l[i]);
}
function reverb(x, mix = 0.1) {
  const delays = [0.0297, 0.0371, 0.0411, 0.0437].map((d) => Math.round(d * SR));
  const out = new Float32Array(x.length);
  for (const d of delays) {
    const line = new Float32Array(x.length);
    for (let i = 0; i < x.length; i++) {
      const fb = i >= d ? line[i - d] * 0.32 : 0;
      line[i] = x[i] + fb;
      out[i] += line[i - (i >= d ? d : 0)] * 0 + (i >= d ? line[i - d] : 0) / delays.length;
    }
  }
  return x.map((v, i) => v * (1 - mix) + lowpass(out, 3500)[i] * mix * 2.2);
}
function fadeEnds(x, inMs, outMs) {
  const a = Math.round((inMs / 1000) * SR), b = Math.round((outMs / 1000) * SR);
  for (let i = 0; i < a && i < x.length; i++) x[i] *= i / a;
  for (let i = 0; i < b && i < x.length; i++) x[x.length - 1 - i] *= i / b;
  return x;
}

const sounds = {
  pop() {
    const x = buf(0.22);
    let ph = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      const f = 190 + 380 * Math.exp(-t / 0.028); // fast downward pitch glide
      ph += (2 * Math.PI * f) / SR;
      x[i] = (Math.sin(ph) + 0.18 * Math.sin(2 * ph)) * env(t, 0.004, 0.05);
    }
    return lowpass(x, 4800);
  },
  click() {
    const x = buf(0.13);
    const n = new Float32Array(x.length);
    for (let i = 0; i < n.length; i++) n[i] = rnd();
    const h = highpass(n, 2200);
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      x[i] = h[i] * env(t, 0.0015, 0.011) + 0.5 * Math.sin(2 * Math.PI * 1500 * t) * env(t, 0.001, 0.018);
    }
    return lowpass(x, 6500);
  },
  tick() {
    const x = buf(0.07);
    const n = new Float32Array(x.length);
    for (let i = 0; i < n.length; i++) n[i] = rnd();
    const h = highpass(n, 3000);
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      x[i] = h[i] * env(t, 0.001, 0.006) + 0.35 * Math.sin(2 * Math.PI * 2100 * t) * env(t, 0.001, 0.01);
    }
    return lowpass(x, 6000);
  },
  whoosh() {
    const len = 0.7;
    const x = buf(len);
    let low = 0, band = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR, p = t / len;
      const fc = 350 + 2600 * Math.pow(p, 1.6); // rising band-pass sweep
      const f = 2 * Math.sin((Math.PI * fc) / SR), q = 0.55;
      const n = rnd();
      low += f * band;
      const high = n - low - q * band;
      band += f * high;
      const e = Math.sin(Math.PI * Math.min(1, p * 1.05)) ** 2.2; // fade in / fade out
      x[i] = band * e;
    }
    return lowpass(x, 5200);
  },
  chime() {
    const x = buf(0.5);
    const parts = [[784, 1, 0.16], [1568.8, 0.22, 0.1], [2352, 0.07, 0.07], [1175, 0.12, 0.12]];
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      let v = 0;
      for (const [f, a, d] of parts) v += a * Math.sin(2 * Math.PI * f * t) * env(t, 0.005, d);
      x[i] = v;
    }
    return lowpass(x, 5200);
  },
  thud() {
    const x = buf(0.36);
    let ph = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * (52 + 60 * Math.exp(-t / 0.05))) / SR;
      x[i] = Math.sin(ph) * env(t, 0.008, 0.09);
    }
    return lowpass(x, 420);
  },
};

const target = 0.85; // peak target; composition volumes (0.2–0.35) set the final level
for (const [name, fn] of Object.entries(sounds)) {
  let x = fn();
  x = reverb(x, name === "whoosh" ? 0.06 : 0.1);
  x = fadeEnds(Float32Array.from(x), 1.5, 40);
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  const g = target / peak;
  const pcm = Buffer.alloc(44 + x.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + x.length * 2, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36); pcm.writeUInt32LE(x.length * 2, 40);
  for (let i = 0; i < x.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, x[i] * g)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, name + ".wav"), pcm);
}
console.log("sfx written");

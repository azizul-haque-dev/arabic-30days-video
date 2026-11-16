// Synthesizes a small, soft UI/motion-graphics SFX kit -> public/sfx/*.wav (16-bit mono, 44.1kHz)
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const OUT = path.resolve('public/sfx');
fs.mkdirSync(OUT, {recursive: true});

let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296 * 2 - 1;
};
const N = (sec) => Math.round(sec * SR);

const lowpass = (x, fc) => {
  const a = Math.exp(-2 * Math.PI * fc / SR);
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
const bandpassSweep = (x, f0, f1, q) => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length;
    const fc = f0 * Math.pow(f1 / f0, t);
    const w = 2 * Math.PI * fc / SR;
    const alpha = Math.sin(w) / (2 * q);
    const b0 = alpha, b2 = -alpha;
    const a0 = 1 + alpha, a1 = -2 * Math.cos(w), a2 = 1 - alpha;
    const out = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = out;
    y[i] = out;
  }
  return y;
};
// very small room: 4 damped combs, short tail
const tinyReverb = (x, mix = 0.1, tail = 0.12) => {
  const len = x.length + N(tail);
  const dry = new Float32Array(len);
  dry.set(x);
  const wet = new Float32Array(len);
  for (const [ms, fb] of [[29.7, 0.42], [37.1, 0.38], [41.1, 0.34], [43.7, 0.3]]) {
    const d = Math.round(ms / 1000 * SR);
    const buf = new Float32Array(len);
    let lpState = 0;
    for (let i = 0; i < len; i++) {
      const fbv = i >= d ? buf[i - d] : 0;
      lpState = 0.6 * lpState + 0.4 * fbv;
      buf[i] = dry[i] + lpState * fb;
      wet[i] += buf[i] * 0.25;
    }
  }
  return dry.map((v, i) => v * (1 - mix) + wet[i] * mix);
};
const finish = (x, peak) => {
  const y = lowpass(x, 7500);
  const fade = N(0.012);
  for (let i = 0; i < fade; i++) y[y.length - 1 - i] *= i / fade;
  let max = 0;
  for (const v of y) max = Math.max(max, Math.abs(v));
  return y.map((v) => (v / max) * peak);
};
const atk = (t, a) => (t < a ? Math.sin((t / a) * Math.PI / 2) ** 2 : 1);

const pop = (f0, f1, decay, dur) => {
  const x = new Float32Array(N(dur));
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = f0 + (f1 - f0) * Math.exp(-t / 0.024);
    ph += 2 * Math.PI * f / SR;
    x[i] = (Math.sin(ph) + 0.12 * Math.sin(2 * ph)) * atk(t, 0.004) * Math.exp(-t / decay);
  }
  return tinyReverb(lowpass(x, 4200), 0.08, 0.08);
};

const click = () => {
  const n = new Float32Array(N(0.11));
  for (let i = 0; i < n.length; i++) n[i] = rnd();
  const hp = highpass(n, 2400);
  const x = new Float32Array(n.length);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = (hp[i] * Math.exp(-t / 0.006) + 0.5 * Math.sin(2 * Math.PI * 2300 * t) * Math.exp(-t / 0.008)) * atk(t, 0.0015);
  }
  return tinyReverb(x, 0.06, 0.06);
};

const whoosh = () => {
  const dur = 0.7;
  const n = new Float32Array(N(dur));
  for (let i = 0; i < n.length; i++) n[i] = rnd();
  const bp = bandpassSweep(n, 350, 3200, 1.1);
  const x = new Float32Array(n.length);
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length;
    x[i] = bp[i] * Math.sin(Math.PI * Math.pow(t, 0.8)) ** 2;
  }
  return tinyReverb(lowpass(x, 5500), 0.1, 0.1);
};

const chime = () => {
  const x = new Float32Array(N(0.38));
  const note = (f, start, amp) => {
    for (let i = N(start); i < x.length; i++) {
      const t = (i - N(start)) / SR;
      const w = 2 * Math.PI * f * t;
      x[i] += amp * (Math.sin(w) + 0.28 * Math.sin(2 * w) + 0.1 * Math.sin(3.01 * w)) * atk(t, 0.004) * Math.exp(-t / 0.11);
    }
  };
  note(987.77, 0, 1);
  note(1318.5, 0.07, 0.7);
  return tinyReverb(lowpass(x, 5200), 0.12, 0.1);
};

const thud = () => {
  const x = new Float32Array(N(0.28));
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += 2 * Math.PI * (52 + 45 * Math.exp(-t / 0.05)) / SR;
    x[i] = Math.sin(ph) * atk(t, 0.008) * Math.exp(-t / 0.09);
  }
  return tinyReverb(lowpass(x, 420), 0.06, 0.05);
};

const kit = {
  pop_a: finish(pop(150, 640, 0.055, 0.22), 0.3),
  pop_b: finish(pop(175, 760, 0.05, 0.2), 0.29),
  click: finish(click(), 0.34),
  whoosh: finish(whoosh(), 0.3),
  chime: finish(chime(), 0.27),
  thud: finish(thud(), 0.31),
};

for (const [name, data] of Object.entries(kit)) {
  const buf = Buffer.alloc(44 + data.length * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + data.length * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  fs.writeFileSync(path.join(OUT, `${name}.wav`), buf);
}
console.log('SFX written:', Object.keys(kit).join(', '));

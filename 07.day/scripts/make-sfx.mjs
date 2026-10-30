// Synthesises a small, clean UI-style SFX set into public/sfx/*.wav (16-bit mono, 48 kHz).
// Run: node scripts/make-sfx.mjs   — fully deterministic, no downloads.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 48000;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const N = (sec) => Math.round(sec * SR);

// RBJ biquad
function biquad(type, f0, q = 0.707) {
  const w = (2 * Math.PI * f0) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
  let b0, b1, b2, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = a; b1 = 0; b2 = -a; } // bp (constant 0 dB peak)
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0, x1: 0, x2: 0, y1: 0, y2: 0 };
}
function run(f, x) {
  const y = f.b0 * x + f.b1 * f.x1 + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2;
  f.x2 = f.x1; f.x1 = x; f.y2 = f.y1; f.y1 = y;
  return y;
}
const filt = (buf, type, f0, q) => { const f = biquad(type, f0, q); return buf.map((x) => run(f, x)); };

// very small reverb (4 combs, low mix) — short tail only
function reverb(buf, mix = 0.1) {
  const tail = N(0.12), out = new Float32Array(buf.length + tail);
  out.set(buf);
  for (const [ms, g] of [[29.7, 0.32], [37.1, 0.28], [41.1, 0.25], [43.7, 0.22]]) {
    const d = N(ms / 1000);
    for (let i = d; i < out.length; i++) out[i] += mix * g * out[i - d] * 0.9 + (i - d < buf.length ? mix * g * buf[i - d] * 0.6 : 0) * 0;
  }
  return out;
}

const env = (t, a, tau) => (t < a ? t / a : Math.exp(-(t - a) / tau)); // soft attack, exp decay

function finish(buf, dur, peak = 0.85) {
  const len = N(dur), out = new Float32Array(len);
  for (let i = 0; i < len; i++) out[i] = buf[i] ?? 0;
  const fade = N(0.02);
  for (let i = 0; i < fade; i++) out[len - 1 - i] *= i / fade; // no click at the end
  let p = 0; for (const v of out) p = Math.max(p, Math.abs(v));
  const g = peak / (p || 1);
  return out.map((v) => v * g);
}

function wav(name, data) {
  const pcm = Buffer.alloc(44 + data.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + data.length * 2, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36); pcm.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) => pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), 44 + i * 2));
  writeFileSync(join(OUT, name + ".wav"), pcm);
}

// pop: sine with fast downward pitch sweep
function pop() {
  const dur = 0.22, b = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR, f = 150 + 430 * Math.exp(-t / 0.028);
    ph += (2 * Math.PI * f) / SR; b[i] = Math.sin(ph) * env(t, 0.004, 0.05);
  }
  return finish(reverb(filt(b, "lp", 3200), 0.08), dur);
}
// click: short high-passed noise burst + tiny body
function click() {
  const dur = 0.1, b = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; ph += (2 * Math.PI * 1800) / SR;
    b[i] = (rnd() * 0.8 + Math.sin(ph) * 0.3) * env(t, 0.0015, 0.011);
  }
  return finish(reverb(filt(filt(b, "hp", 1600), "lp", 7000), 0.05), dur);
}
// whoosh / swipe: band-passed noise with moving centre frequency, fade in/out
function sweep(dur, f0, f1, peakAt, q) {
  const n = N(dur), out = new Float32Array(n), f = biquad("bp", f0, q);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    if (i % 32 === 0) Object.assign(f, { ...biquad("bp", f0 * Math.pow(f1 / f0, t), q), x1: f.x1, x2: f.x2, y1: f.y1, y2: f.y2 });
    const e = t < peakAt ? Math.sin((t / peakAt) * (Math.PI / 2)) ** 2 : Math.cos(((t - peakAt) / (1 - peakAt)) * (Math.PI / 2)) ** 2;
    out[i] = run(f, rnd()) * e;
  }
  return out;
}
const whoosh = () => finish(reverb(filt(sweep(0.55, 500, 2400, 0.4, 0.9), "lp", 6000), 0.08), 0.55);
const swipe = () => finish(reverb(filt(sweep(0.7, 320, 1900, 0.45, 0.8), "lp", 5200), 0.1), 0.7);
// chime: soft sine partials with short decay
function chime() {
  const dur = 0.5, b = new Float32Array(N(dur));
  const parts = [[784, 1, 0.16], [1175, 0.45, 0.12], [1568, 0.2, 0.09], [2349, 0.08, 0.06]];
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; let v = 0;
    for (const [f, a, tau] of parts) v += Math.sin(2 * Math.PI * f * t) * a * env(t, 0.006, tau);
    b[i] = v;
  }
  return finish(reverb(filt(b, "lp", 5000), 0.12), dur);
}
// thud: restrained low sine with pitch drop
function thud() {
  const dur = 0.3, b = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR, f = 52 + 60 * Math.exp(-t / 0.05);
    ph += (2 * Math.PI * f) / SR; b[i] = Math.sin(ph) * env(t, 0.006, 0.07);
  }
  return finish(filt(b, "lp", 420), dur);
}

const set = { pop, click, whoosh, swipe, chime, thud };
for (const [name, fn] of Object.entries(set)) {
  seed = 1234567;
  const d = fn(); wav(name, d);
  let pk = 0, clip = 0, sq = 0;
  for (const v of d) { pk = Math.max(pk, Math.abs(v)); if (Math.abs(v) >= 0.999) clip++; sq += v * v; }
  const rms = Math.sqrt(sq / d.length);
  console.log(`${name.padEnd(7)} ${(d.length / SR).toFixed(2)}s  peak ${pk.toFixed(2)}  rms ${(20 * Math.log10(rms)).toFixed(1)} dBFS  clipped ${clip}`);
}

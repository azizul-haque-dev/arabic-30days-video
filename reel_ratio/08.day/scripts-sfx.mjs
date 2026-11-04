// Synthesises a small SFX kit as 16-bit mono WAVs (no downloads).
import { writeFileSync, mkdirSync } from "node:fs";
const SR = 44100;
mkdirSync("public/sfx", { recursive: true });
const wav = (name, samples) => {
  const n = samples.length, buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-1, Math.min(1, samples[i])) * 32767 | 0, 44 + i * 2);
  writeFileSync(`public/sfx/${name}.wav`, buf);
};
const gen = (dur, fn) => Array.from({ length: Math.floor(dur * SR) }, (_, i) => fn(i / SR, i));
let seed = 12345; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

// whoosh: noise through a sweeping one-pole low-pass, shaped envelope
{ let lp = 0; wav("whoosh", gen(0.5, (t) => {
  const env = Math.sin(Math.PI * Math.min(1, t / 0.5)) ** 2;
  const a = 0.02 + 0.5 * (t / 0.5) ** 1.5; lp += a * (rnd() - lp); return lp * env * 1.6; })); }
// pop: pitch-dropping sine
{ let ph = 0; wav("pop", gen(0.18, (t) => { ph += 2 * Math.PI * (520 * Math.exp(-t * 18) + 140) / SR; return Math.sin(ph) * Math.exp(-t * 20); })); }
// ding: two partials, soft attack
wav("ding", gen(0.7, (t) => (Math.sin(2 * Math.PI * 988 * t) * 0.6 + Math.sin(2 * Math.PI * 1480 * t) * 0.3) * Math.min(1, t / 0.005) * Math.exp(-t * 7)));
// tick: very short click
wav("tick", gen(0.05, (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 90)));
// chime: rising arpeggio
wav("chime", gen(1.4, (t) => [523.25, 659.25, 783.99, 1046.5].reduce((s, f, k) => {
  const tt = t - k * 0.11; return tt < 0 ? s : s + Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt * 4.2) * 0.35; }, 0)));
console.log("sfx ok");

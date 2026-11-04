import fs from "fs";
const SR = 44100;
function wav(name, samples) {
  const n = samples.length, buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-1, Math.min(1, samples[i])) * 32000, 44 + i * 2);
  fs.writeFileSync(`public/sfx/${name}.wav`, buf);
}
const gen = (dur, fn) => Array.from({ length: Math.floor(dur * SR) }, (_, i) => fn(i / SR, i));
// whoosh: filtered noise swell
let lp = 0;
wav("whoosh", gen(0.45, (t) => {
  const env = Math.sin(Math.PI * Math.min(1, t / 0.45)) ** 1.5;
  const a = 0.05 + 0.5 * env; lp += a * ((Math.random() * 2 - 1) - lp);
  return lp * env * 0.9;
}));
// pop: pitch-dropping sine
wav("pop", gen(0.18, (t) => Math.sin(2 * Math.PI * (520 - 2200 * t * 0.35) * t) * Math.exp(-t * 28) * 0.8));
// ding: two soft partials
wav("ding", gen(0.9, (t) => (Math.sin(2 * Math.PI * 880 * t) * 0.5 + Math.sin(2 * Math.PI * 1320 * t) * 0.25) * Math.exp(-t * 5.5) * 0.7));
// tick
wav("tick", gen(0.05, (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 90) * 0.5));
console.log("sfx ok");

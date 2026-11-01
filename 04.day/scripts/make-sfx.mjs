import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "sfx");
fs.mkdirSync(outDir, { recursive: true });

const SR = 44100;

function writeWav(name, samples) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-0.85, Math.min(0.85, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(outDir, `${name}.wav`), buf);
}

writeWav("pop", Float32Array.from({ length: Math.floor(SR * 0.18) }, (_, i) => {
  const t = i / SR;
  const f = 380 * Math.exp(-t * 18) + 110;
  const env = Math.sin(Math.min(1, t / 0.008) * Math.PI * 0.5) * Math.exp(-t * 22);
  return Math.sin(2 * Math.PI * f * t) * env * 0.65;
}));

writeWav("click", Float32Array.from({ length: Math.floor(SR * 0.11) }, (_, i) => {
  const t = i / SR;
  const env = Math.exp(-t * 50);
  return (Math.sin(2 * Math.PI * 920 * t) * 0.6 + (Math.random() * 2 - 1) * 0.25) * env * 0.6;
}));

writeWav("tick", Float32Array.from({ length: Math.floor(SR * 0.10) }, (_, i) => {
  const t = i / SR;
  return Math.sin(2 * Math.PI * 680 * t) * Math.exp(-t * 60) * 0.5;
}));

writeWav("whoosh", Float32Array.from({ length: Math.floor(SR * 0.38) }, (_, i) => {
  const t = i / SR;
  const env = Math.sin((t / 0.38) * Math.PI) ** 1.6;
  const tone = Math.sin(2 * Math.PI * (180 + 260 * (t / 0.38)) * t);
  return (tone * 0.45 + (Math.random() * 2 - 1) * 0.2) * env * 0.45;
}));

writeWav("chime", Float32Array.from({ length: Math.floor(SR * 0.36) }, (_, i) => {
  const t = i / SR;
  const env = Math.sin(Math.min(1, t / 0.01) * Math.PI * 0.5) * Math.exp(-t * 10);
  return (Math.sin(2 * Math.PI * 528 * t) + 0.35 * Math.sin(2 * Math.PI * 792 * t)) * env * 0.48;
}));

writeWav("thud", Float32Array.from({ length: Math.floor(SR * 0.28) }, (_, i) => {
  const t = i / SR;
  const f = 140 * Math.exp(-t * 14) + 55;
  return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 14) * 0.65;
}));

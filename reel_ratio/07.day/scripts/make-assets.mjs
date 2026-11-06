// Generates public/grain.png and a tiny synthesized SFX kit (no downloads).
import fs from "node:fs";
import zlib from "node:zlib";

const crcT = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc = (b) => {
  let c = -1;
  for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (t, d) => {
  const l = Buffer.alloc(4);
  l.writeUInt32BE(d.length);
  const td = Buffer.concat([Buffer.from(t), d]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([l, td, c]);
};
const S = 256;
const raw = Buffer.alloc((S * 4 + 1) * S);
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
for (let y = 0; y < S; y++) {
  raw[y * (S * 4 + 1)] = 0;
  for (let x = 0; x < S; x++) {
    const o = y * (S * 4 + 1) + 1 + x * 4;
    const v = rnd() > 0.5 ? 255 : 0;
    raw[o] = raw[o + 1] = raw[o + 2] = v;
    raw[o + 3] = Math.floor(rnd() * 40);
  }
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(S, 0);
ihdr.writeUInt32BE(S, 4);
ihdr[8] = 8;
ihdr[9] = 6;
fs.writeFileSync(
  "public/grain.png",
  Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);

const SR = 44100;
const wav = (name, secs, fn) => {
  const n = Math.floor(SR * secs);
  const d = Buffer.alloc(44 + n * 2);
  d.write("RIFF", 0);
  d.writeUInt32LE(36 + n * 2, 4);
  d.write("WAVEfmt ", 8);
  d.writeUInt32LE(16, 16);
  d.writeUInt16LE(1, 20);
  d.writeUInt16LE(1, 22);
  d.writeUInt32LE(SR, 24);
  d.writeUInt32LE(SR * 2, 28);
  d.writeUInt16LE(2, 32);
  d.writeUInt16LE(16, 34);
  d.write("data", 36);
  d.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, fn(i / SR, i / n)));
    d.writeInt16LE(Math.round(v * 32000), 44 + i * 2);
  }
  fs.writeFileSync(`public/sfx/${name}.wav`, d);
};
// soft whoosh: low-passed noise with a rising/falling envelope
let lp = 0;
wav("whoosh", 0.6, (t, p) => {
  const env = Math.sin(Math.PI * p) ** 2;
  const a = 0.05 + 0.4 * Math.sin(Math.PI * p);
  lp += a * ((rnd() * 2 - 1) - lp);
  return lp * env * 0.9;
});
// pop: pitch-dropping sine
wav("pop", 0.18, (t, p) => Math.sin(2 * Math.PI * (520 - 330 * p) * t) * (1 - p) ** 2 * 0.6);
// ding: two detuned sines, exponential decay
wav("ding", 0.9, (t) => (Math.sin(2 * Math.PI * 988 * t) + 0.5 * Math.sin(2 * Math.PI * 1480 * t)) * Math.exp(-5 * t) * 0.4);
// power-down thunk for the outage scene
wav("thunk", 0.5, (t, p) => Math.sin(2 * Math.PI * (110 - 60 * p) * t) * (1 - p) ** 2 * 0.8);

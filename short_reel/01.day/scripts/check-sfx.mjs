// Verifies every SFX: duration, peak level, clipping, loudness (RMS on the active part).
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('public/sfx');
const limits = {whoosh: 0.8};
let bad = 0;
console.log('file          dur(s)  peak(dBFS)  peak   rms(dBFS)  clip');
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.wav')).sort()) {
  const b = fs.readFileSync(path.join(dir, f));
  const sr = b.readUInt32LE(24);
  const n = (b.length - 44) / 2;
  let peak = 0, clip = 0, sum = 0, cnt = 0;
  const s = [];
  for (let i = 0; i < n; i++) {
    const v = b.readInt16LE(44 + i * 2);
    s.push(v / 32768);
    peak = Math.max(peak, Math.abs(v) / 32768);
    if (Math.abs(v) >= 32760) clip++;
  }
  // loudness on the first 0.12s of the active signal (comparable across short + long sounds)
  const win = Math.round(0.12 * sr);
  const startIdx = s.findIndex((v) => Math.abs(v) > peak * 0.1);
  const seg = f.startsWith('whoosh') ? s.slice(Math.round(0.15 * sr), Math.round(0.45 * sr)) : s.slice(Math.max(0, startIdx), Math.max(0, startIdx) + win);
  for (const v of seg) { sum += v * v; cnt++; }
  const rms = Math.sqrt(sum / cnt);
  const dur = n / sr;
  const maxDur = limits[f.replace('.wav', '')] ?? 0.5;
  const ok = dur <= maxDur + 1e-6 && peak <= 0.36 && peak >= 0.2 && clip === 0;
  if (!ok) bad++;
  console.log(`${f.padEnd(13)} ${dur.toFixed(3).padStart(6)}  ${(20 * Math.log10(peak)).toFixed(1).padStart(9)}  ${peak.toFixed(3)}  ${(20 * Math.log10(rms)).toFixed(1).padStart(8)}   ${clip}  ${ok ? 'OK' : 'FAIL'}`);
}
if (bad) { console.error(`SFX check failed: ${bad} file(s)`); process.exit(1); }
console.log('SFX check passed.');

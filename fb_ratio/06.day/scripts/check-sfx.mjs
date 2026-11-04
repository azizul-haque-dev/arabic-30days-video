// প্রতিটি SFX-এর দৈর্ঘ্য, peak, RMS ও clipping চেক
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('public/sfx');
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.wav'))) {
  const b = fs.readFileSync(path.join(dir, f));
  const n = (b.length - 44) / 2;
  let peak = 0, sum = 0, clip = 0;
  for (let i = 0; i < n; i++) {
    const v = b.readInt16LE(44 + i * 2) / 32768;
    peak = Math.max(peak, Math.abs(v)); sum += v * v;
    if (Math.abs(v) >= 0.999) clip++;
  }
  const rms = Math.sqrt(sum / n);
  console.log(f.padEnd(12), 'dur', (n / 44100).toFixed(2) + 's', 'peak', peak.toFixed(2), 'rms', rms.toFixed(3), 'clipped', clip);
}

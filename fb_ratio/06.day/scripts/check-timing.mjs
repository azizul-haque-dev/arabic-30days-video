// timing.ts-এর সব অ্যাংকর প্রিন্ট করে (esbuild দিয়ে বান্ডেল করে)
import {build} from 'esbuild';
import {pathToFileURL} from 'node:url';
import {tmpdir} from 'node:os';
import path from 'node:path';
const out = path.join(tmpdir(), 'timing-check.mjs');
await build({entryPoints: ['src/timing.ts'], bundle: true, format: 'esm', outfile: out, platform: 'node', logLevel: 'error'});
const t = await import(pathToFileURL(out).href);
const s = (f) => (f / 30).toFixed(2) + 's';
console.log('TOTAL', t.TOTAL_FRAMES, s(t.TOTAL_FRAMES));
for (const p of t.scenePlan) console.log(p.id.padEnd(9), 'from', String(p.from).padStart(5), s(p.from).padStart(8), 'dur', String(p.to - p.from).padStart(4), s(p.to - p.from));
t.sentenceT.forEach((x, i) => console.log('S' + (i + 1), 'sent', s(x.sent), 'say', s(x.say), 'mean', s(x.mean), 'end', s(x.end)));
console.log(JSON.stringify(Object.fromEntries(Object.entries(t.anchors).map(([k, v]) => [k, s(v)]))));

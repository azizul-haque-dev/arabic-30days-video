/**
 * Static layout validation (Node, no browser) — runs before every `npm run render`.
 * Uses the same layout engine as the scenes, with a CONSERVATIVE text-width estimate.
 * The browser-side audit (src/layout/audit.ts) re-checks the real DOM boxes on every rendered
 * frame and fails the render on any overlap / clipping, so this script is the first gate, not the only one.
 */
import { episode, sentences } from "../src/episodes/active";
import { CANVAS, LayoutError, checkHeader, checkSentenceLayout, layoutSentence } from "../src/layout/engine";
import { checkMotionEnvelopes } from "../src/layout/keyframes";
import { estimateMeasure } from "../src/layout/measure";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};

if (episode.width !== CANVAS.w || episode.height !== CANVAS.h) fail(`Episode is ${episode.width}x${episode.height}; layout engine is built for ${CANVAS.w}x${CANVAS.h}`);

const expected = episode.sentenceTo - episode.sentenceFrom + 1;
if (sentences.length !== expected) fail(`Expected ${expected} sentences, found ${sentences.length}`);
sentences.forEach((s, i) => s.no !== episode.sentenceFrom + i && fail(`Sentence number mismatch at index ${i}: ${s.no}`));
if (episode.previousCompleted + sentences.length !== episode.currentCompleted) fail("previousCompleted + sentences != currentCompleted");

for (const p of checkHeader()) fail(p);

console.log(`Validating ${sentences.length} sentence layouts (estimated text metrics, conservative)…`);
for (const s of sentences) {
  try {
    const l = layoutSentence(s.units, s.meaning, estimateMeasure);
    const problems = [...checkSentenceLayout(l, `sentence ${s.no}`), ...checkMotionEnvelopes(l, `sentence ${s.no}`)];
    if (problems.length) problems.forEach(fail);
    else {
      const rows = Math.max(...l.pron.map((p) => p.line)) + 1;
      console.log(`  ✓ ${s.no}  bn ${l.bnSize}px / ar ${l.arSize}px / meaning ${l.meaningSize}px / ${rows} row(s)`);
    }
  } catch (e) {
    if (e instanceof LayoutError) fail(`Sentence ${s.no}: ${e.message}`);
    else throw e;
  }
}

if (failures) {
  console.error(`\n❌ ${failures} layout problem(s). Fix content/layout before rendering.`);
  process.exit(1);
}
console.log("\n✅ Static layout validation passed (estimated metrics; real-DOM audit runs during Studio/render).");

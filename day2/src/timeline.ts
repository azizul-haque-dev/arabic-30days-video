// ALL timing is derived from the SRT (src/data/subtitle.ts). Nothing is hand-placed.
// Within a cue, word positions are estimated by character proportion.
import {SRT} from './data/subtitle';
import {FPS} from './theme';

type Cue = {start: number; end: number; text: string};
const toSec = (t: string) => {
  const m = t.match(/(\d+):(\d+):(\d+)[,.](\d+)/)!;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};
export const parseSrt = (src: string): Cue[] =>
  src.replace(/\r/g, '').trim().split(/\n\s*\n/).map((b) => {
    const lines = b.split('\n');
    const [a, c] = lines[1].split('-->');
    return {start: toSec(a), end: toSec(c), text: lines.slice(2).join(' ')};
  });

const cues = parseSrt(SRT);
let full = '';
const spans: {s: number; e: number; start: number; end: number}[] = [];
cues.forEach((c) => {
  const t = c.text.replace(/\s+/g, ' ').trim().normalize('NFC');
  if (full) full += ' ';
  spans.push({s: full.length, e: full.length + t.length, start: c.start, end: c.end});
  full += t;
});
const timeAt = (i: number) => {
  const sp = spans.find((x) => i >= x.s && i <= x.e) ?? spans[spans.length - 1];
  const r = Math.min(1, Math.max(0, (i - sp.s) / Math.max(1, sp.e - sp.s)));
  return sp.start + r * (sp.end - sp.start);
};
const find = (re: RegExp, from = 0) => {
  const m = re.exec(full.slice(from));
  if (!m) throw new Error('SRT marker not found: ' + re);
  const idx = from + m.index;
  return {end: idx + m[0].length, t: timeAt(idx)};
};

const LEAD = 5; // visuals enter ~5 frames before the spoken words
const toF = (sec: number) => Math.round(sec * FPS);
const lead = (sec: number) => toF(sec) - LEAD;

const ORD = ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ'];

export type SentenceT = {n: number; from: number; dur: number; arabicF: number; meaningF: number; repeatF: number | null};
export type Sfx = {frame: number; file: 'pop' | 'click' | 'whoosh' | 'chime' | 'thud'; rate?: number};

let cursor = 0;
const markers = ORD.map((o) => {
  const m = find(new RegExp('Sentence\\s+' + o.normalize('NFC')), cursor);
  cursor = m.end;
  return {m, ...m};
});
const hookB2 = find(/তাহলে/);
const hookB3 = find(/এটি আমাদের/);
const hookB4 = find(/চলুন/);
const recap = find(/দারুণ/, markers[9].end);
const follow = find(/প্রতিদিন/, recap.end);
const comment = find(/কমেন্টে/, follow.end);
const bye = find(/দেখা হবে/, comment.end);

export const TOTAL = toF(cues[cues.length - 1].end + 0.8);

const sentenceStarts = markers.map((k) => lead(k.t));
export const sentences: SentenceT[] = markers.map((k, i) => {
  const from = sentenceStarts[i];
  const to = i < 9 ? sentenceStarts[i + 1] : lead(recap.t);
  const ar = find(/\[আরবি ভাষা\]/, k.end);
  const mean = find(/অর্থ/, ar.end);
  const rep = i === 0 ? find(/আমার সঙ্গে বলুন/, ar.end) : null;
  return {
    n: i + 1, from, dur: to - from,
    arabicF: Math.max(8, lead(ar.t) - from),
    meaningF: Math.max(16, lead(mean.t) - from),
    repeatF: rep ? lead(rep.t) - from : null,
  };
});

export const hook = {
  dur: sentenceStarts[0],
  b2: lead(hookB2.t), b3: lead(hookB3.t), b4: lead(hookB4.t),
};
export const recapScene = {from: lead(recap.t), dur: lead(follow.t) - lead(recap.t)};
export const ctaScene = {
  from: lead(follow.t), dur: TOTAL - lead(follow.t),
  commentF: lead(comment.t) - lead(follow.t),
  byeF: lead(bye.t) - lead(follow.t),
};

// Boundaries (sceneStart frames) for transitions
export const boundaries = [...sentenceStarts, recapScene.from, ctaScene.from];

// SFX plan: only main entrances, meaning reveals, transitions. Limited kit of 5.
export const sfx: Sfx[] = [];
sfx.push({frame: 2, file: 'whoosh'});
sfx.push({frame: hook.b2 + 2, file: 'pop'});
sfx.push({frame: hook.b3 + 4, file: 'thud'});
sfx.push({frame: hook.b4 + 2, file: 'pop', rate: 1.1});
boundaries.forEach((b) => sfx.push({frame: Math.max(0, b - 8), file: 'whoosh', rate: 1}));
sentences.forEach((s, i) => {
  sfx.push({frame: s.from + 4, file: 'pop', rate: 0.94 + (i % 3) * 0.05});
  sfx.push({frame: s.from + s.meaningF + 2, file: 'click', rate: 0.96 + (i % 2) * 0.06});
});
sfx.push({frame: recapScene.from + 6, file: 'pop'});
sfx.push({frame: ctaScene.from + 8, file: 'click'});
sfx.push({frame: ctaScene.from + ctaScene.commentF + 3, file: 'chime'});

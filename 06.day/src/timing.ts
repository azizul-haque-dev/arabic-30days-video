import {FPS} from './config';
import {SRT} from './data/srt';

// ───────── SRT পার্সার (সময়ের একমাত্র উৎস) ─────────
type Cue = {index: number; start: number; end: number; text: string; offset: number};

const toSec = (t: string) => {
  const m = t.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) throw new Error('Bad SRT time: ' + t);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

const parse = (raw: string): Cue[] => {
  const cues: Cue[] = [];
  let offset = 0;
  for (const block of raw.replace(/\r/g, '').trim().split(/\n\n+/)) {
    const lines = block.split('\n');
    const index = parseInt(lines[0], 10);
    const [a, b] = lines[1].split('-->');
    const text = lines.slice(2).join(' ').replace(/\s+/g, ' ').trim();
    cues.push({index, start: toSec(a), end: toSec(b), text, offset});
    offset += text.length + 1;
  }
  return cues;
};

export const cues = parse(SRT);
const fullText = cues.map((c) => c.text).join(' ');
export const srtEnd = cues[cues.length - 1].end;

/** অক্ষর-অবস্থান → সেকেন্ড (cue-র ভেতরে অক্ষর-অনুপাতে ইন্টারপোলেশন) */
const timeAt = (pos: number): number => {
  for (const c of cues) {
    if (pos >= c.offset && pos < c.offset + c.text.length + 1) {
      const frac = Math.min(1, (pos - c.offset) / Math.max(1, c.text.length));
      return c.start + frac * (c.end - c.start);
    }
  }
  return srtEnd;
};

const find = (marker: string, after = 0): number => {
  const i = fullText.indexOf(marker, after);
  if (i < 0) throw new Error(`SRT-তে মার্কার পাওয়া যায়নি: "${marker}"`);
  return i;
};

const sec2f = (s: number) => Math.round(s * FPS);
/** মার্কারের শুরুর সময় (ফ্রেম) */
const F = (marker: string, after = 0) => sec2f(timeAt(find(marker, after)));
const idx = (marker: string, after = 0) => find(marker, after);

// ───────── দৃশ্যের অ্যাংকর ─────────
const LEAD = 12; // সিন শুরু = অ্যাংকর − ১২ ফ্রেম (ট্রানজিশন ঢাকার জায়গা)
export const TOTAL_FRAMES = Math.ceil(srtEnd * FPS);

const names = ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ'];
export type SentenceTiming = {sent: number; say: number; mean: number; end: number};

const sentenceTimings: SentenceTiming[] = [];
{
  let cursor = 0;
  names.forEach((n) => {
    const s = idx(`Sentence ${n}`, cursor);
    const say = find('বলুন,', s) + 'বলুন, '.length;
    const mean = find('অর্থ,', say);
    sentenceTimings.push({sent: sec2f(timeAt(s)), say: sec2f(timeAt(say)), mean: sec2f(timeAt(mean)), end: 0});
    cursor = mean;
  });
  sentenceTimings.forEach((t, i) => {
    t.end = i < 9 ? sentenceTimings[i + 1].sent : F('এই ছিল আজকের', 0);
  });
}
export const sentenceT = sentenceTimings;

// হুক ও ভূমিকার অ্যাংকর
const aGulf = F('Gulf');
const aDaily = F('দৈনন্দিন');
const aHome = F('ঘরবাড়ি');
const aFood = F('খাবার দাবার');
const aTen = F('দশটি');
const aHow = F('প্রতিটি বাক্যের');
const aTwice = F('দুইবার');
const aListen = F('শুনে শুনে');
const aLetsGo = F('চলুন শুরু করি');
const aRecap = F('এই ছিল আজকের');
const aQuestion = F('আপনার সবচেয়ে');
const aComment = F('কমেন্টে জানাতে');
const aLearn = F('আরবি শিখুন');
const aEveryday = F('প্রতিদিন অল্প');
const aCta = F('প্রতিদিনের লেসন');
const aFollow = F('ফলো করুন');
const aWrite = F('কমেন্টে লিখুন');
const aDone = F('Day Six Done');
const aSeeYou = F('দেখা হবে');
const aInsha = F('ইনশাআল্লাহ');
const aTitle1 = F('ত্রিশ দিনে');
const aSurvival = F('Survival Arabic');
const aDaySix = F('Day Six');

export const anchors = {
  aGulf, aDaily, aHome, aFood, aTen, aHow, aTwice, aListen, aLetsGo, aRecap, aQuestion, aComment, aLearn,
  aCta, aEveryday, aFollow, aWrite, aDone, aSeeYou, aInsha, aTitle1, aSurvival, aDaySix,
};

export type SceneId =
  | 'hook' | 'overview' | 'how'
  | `s${number}`
  | 'recap' | 'question' | 'learn' | 'cta' | 'end';

export type ScenePlan = {id: SceneId; from: number; to: number; anchor: number};

const starts: {id: SceneId; anchor: number}[] = [
  {id: 'hook', anchor: LEAD}, // 0 থেকে শুরু
  {id: 'overview', anchor: aGulf},
  {id: 'how', anchor: aHow},
  ...sentenceTimings.map((t, i) => ({id: `s${i + 1}` as SceneId, anchor: t.sent})),
  {id: 'recap', anchor: aRecap},
  {id: 'question', anchor: aQuestion},
  {id: 'learn', anchor: aLearn},
  {id: 'cta', anchor: aCta},
  {id: 'end', anchor: aSeeYou},
];

export const scenePlan: ScenePlan[] = starts.map((s, i) => {
  const from = i === 0 ? 0 : s.anchor - LEAD;
  const to = i === starts.length - 1 ? TOTAL_FRAMES : starts[i + 1].anchor - LEAD;
  return {id: s.id, from, to, anchor: s.anchor};
});

export const planOf = (id: SceneId) => {
  const p = scenePlan.find((s) => s.id === id);
  if (!p) throw new Error('scene ' + id);
  return p;
};

/** সিন-লোকাল ফ্রেম (অ্যাংকরের LEAD_VISUAL ফ্রেম আগে) */
export const local = (id: SceneId, absAnchor: number, lead = 5) => absAnchor - lead - planOf(id).from;

export const TRANSITION_LEAD = LEAD;

import {SRT} from "./srt";

type Cue = {start: number; end: number; text: string; c0: number; c1: number};

const toSec = (s: string) => {
  const m = s.match(/(\d+):(\d+):(\d+),(\d+)/)!;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

export const CUES: Cue[] = [];
let ALL = "";
SRT.trim()
  .split(/\n\s*\n/)
  .forEach((blk) => {
    const lines = blk.trim().split("\n");
    const [a, b] = lines[1].split(" --> ");
    const text = lines.slice(2).join(" ").replace(/\s+/g, " ").trim();
    const c0 = ALL.length;
    ALL += text + " ";
    CUES.push({start: toSec(a), end: toSec(b), text, c0, c1: c0 + text.length});
  });

/** char offset in the flattened SRT text -> seconds (linear inside a cue). */
const timeAt = (p: number) => {
  const cue = CUES.find((c) => p >= c.c0 && p <= c.c1 + 1) ?? CUES[CUES.length - 1];
  const f = Math.min(1, Math.max(0, (p - cue.c0) / Math.max(1, cue.c1 - cue.c0)));
  return cue.start + f * (cue.end - cue.start);
};

export const AUDIO_SECONDS = 117.336;
export const END_SEC = CUES[CUES.length - 1].end;

const NUM = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "seventy"];
const markerRe = (i: number) =>
  new RegExp(i === 9 ? "Sentence\\s+seventy\\s*,?" : `Sentence\\s+sixty\\s+${NUM[i]}\\s*,?`);

export type SentenceTiming = {
  n: number;
  /** narration "Sentence N" */ marker: number;
  /** first repeat of the pronunciation */ p1: number;
  /** second repeat */ p2: number;
  /** "অর্থ" – the meaning */ meaning: number;
  /** end of the meaning */ end: number;
};

const find = (re: RegExp | string, from: number) => {
  if (typeof re === "string") return ALL.indexOf(re, from);
  const m = ALL.slice(from).match(re);
  return m ? from + (m.index ?? 0) : -1;
};

const markers: number[] = [];
const markerEnds: number[] = [];
for (let i = 0; i < 10; i++) {
  const from = i === 0 ? 0 : markerEnds[i - 1];
  const m = ALL.slice(from).match(markerRe(i))!;
  const at = from + m.index!;
  markers.push(at);
  markerEnds.push(at + m[0].length);
}
const introDay = find("আলহামদুলিল্লাহ, আমরা", 0);
const introToday = find("আজ শিখব", 0);
const introBrand = find("শেখার সঙ্গী", 0);
const outroAt = find("এই ছিল", markers[9]);
const outroProgress = find("৩০০টি বাক্যের মধ্যে আমরা", outroAt);
const outroFollow = find("শিখতে", outroAt);
const outroDay8 = find("দেখা হবে", outroAt);

export const SENTENCES: SentenceTiming[] = markers.map((mk, i) => {
  const after = markerEnds[i];
  const next = i < 9 ? markers[i + 1] : outroAt;
  const firstTok = ALL.slice(after).trim().split(/\s+/)[0];
  const a = ALL.indexOf(firstTok, after);
  const b = ALL.indexOf(firstTok, a + firstTok.length);
  const m = ALL.indexOf("অর্থ", after);
  return {
    n: 61 + i,
    marker: timeAt(mk),
    p1: timeAt(a),
    p2: timeAt(b > 0 && b < m ? b : (a + m) / 2),
    meaning: timeAt(m),
    end: timeAt(next),
  };
});

export const INTRO = {
  brand: timeAt(introBrand),
  learned: timeAt(introDay),
  today: timeAt(introToday),
  end: SENTENCES[0].marker,
};
export const OUTRO = {
  start: timeAt(outroAt),
  progress: timeAt(outroProgress),
  follow: timeAt(outroFollow),
  day8: timeAt(outroDay8),
  end: END_SEC,
};

/** Scene boundaries (seconds): the transition wipe is centred on each. */
export const BOUNDARIES: number[] = [
  ...SENTENCES.map((s) => s.marker - 0.12),
  OUTRO.start - 0.05,
];

/** Subtitle text visible at time `t` (used for the intro/outro caption line). */
export const captionAt = (t: number, opts: {from?: string; until?: string} = {}) => {
  let idx = CUES.findIndex((c, i) => t >= c.start && t < (CUES[i + 1]?.start ?? c.end + 1));
  if (idx < 0) idx = 0; // before the first cue starts: show cue 1 so frame 0 is complete
  let text = CUES[idx].text;
  if (opts.from && text.includes(opts.from)) text = text.slice(text.indexOf(opts.from));
  if (opts.until && text.includes(opts.until)) text = text.slice(0, text.indexOf(opts.until));
  text = text.trim();
  return text ? {idx, text, start: CUES[idx].start} : null;
};

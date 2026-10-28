// timing.ts — every time value is derived from the SRT cues (src/data/cues.ts). Nothing is placed by hand.
import { cues } from "./data/cues";
import { theme } from "./theme";

export const FPS = 30;
export const f = (sec: number) => Math.round(sec * FPS);

export type Tok = { t: string; s: number; e: number; ghost?: boolean };

// Distribute each cue's time across its words by character weight (+ pause weight on punctuation).
const buildTokens = (): Tok[] => {
  const toks: Tok[] = [];
  for (const c of cues) {
    const words = c.text.split(" ");
    const w = words.map((x) => x.length + (/[।?,]$/.test(x) ? 2.5 : 0));
    const total = w.reduce((a, b) => a + b, 0);
    let acc = 0;
    words.forEach((x, i) => {
      const s = c.start + (acc / total) * (c.end - c.start);
      acc += w[i];
      toks.push({ t: x, s, e: c.start + (acc / total) * (c.end - c.start) });
    });
  }
  // The SRT repeats "Sentence নয়" twice in a row; the repeat is ignored for markers.
  for (let i = 0; i + 3 < toks.length; i++) {
    if (toks[i].t === "Sentence" && toks[i + 2].t === "Sentence" && toks[i + 1].t === toks[i + 3].t) {
      toks[i + 2].ghost = true;
      toks[i + 3].ghost = true;
    }
  }
  return toks;
};
export const tokens = buildTokens();

const find = (seq: string[], from = 0): number => {
  for (let i = from; i < tokens.length - seq.length + 1; i++) {
    if (tokens[i].ghost) continue;
    if (seq.every((q, k) => tokens[i + k].t.startsWith(q))) return i;
  }
  throw new Error("marker not found: " + seq.join(" "));
};

const NUM = ["এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ"];

export type SentenceTiming = {
  n: number; start: number; // scene start frame (absolute)
  say: number; phrase: number; rep2: number; mean: number; // relative to scene start
  end: number; // absolute scene end (next start)
};

const sIdx = NUM.map((w) => find(["Sentence", w]));
const afterS = (n: number) => sIdx[n - 1];

const iPart = find(["পর্ব", "চারে"]);
const iGulf = find(["Gulf"]);
const iTen = find(["দশটি"], iGulf);
const iEach = find(["প্রতিটি"], iGulf);
const iTwice = find(["দুইবার"], iEach);
const iListen = find(["শুনে"], iTwice);
const iGo = find(["চলুন", "শুরু"]);
const iRecap = find(["এই", "ছিল"], afterS(10));
const iQ = find(["আপনার", "সবচেয়ে"], iRecap);
const iAr = find(["আরবি", "শিখুন"], iQ);
const iDaily = find(["প্রতিদিনের"], iAr);
const iFollow = find(["ফলো"], iDaily);
const iDay4 = find(["Day", "four"], iFollow);
const iSee = find(["দেখা", "হবে"], iDay4);
const iTrish = find(["ত্রিশ"]);
const iFourth = find(["চতুর্থ"]);

const T = (i: number) => tokens[i].s;
const pre = theme.motion.lead;
const A = (i: number) => f(T(i)) - pre; // absolute frame a visual should land

export const TOTAL = f(cues[cues.length - 1].end);

const sentStarts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => A(afterS(n)));
const recapStart = A(iRecap);

export const sentenceTimings: SentenceTiming[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, k) => {
  const si = afterS(n);
  const start = sentStarts[k];
  const iSayTok = n === 9 ? find(["পারেন"], si) : find(["বলুন"], si);
  const iMean = find(["অর্থ"], iSayTok);
  const phraseStart = tokens[iSayTok].e;
  const mean = tokens[iMean].s;
  const rep2 = phraseStart + (mean - phraseStart) / 2;
  return {
    n, start,
    say: f(tokens[iSayTok].s) - pre - start,
    phrase: f(phraseStart) - pre - start,
    rep2: f(rep2) - start,
    mean: f(mean) - pre - start,
    end: k < 9 ? sentStarts[k + 1] : recapStart,
  };
});

export const marks = {
  hi: f(cues[0].start),
  trish: A(iTrish), fourth: A(iFourth),
  part: A(iPart), gulf: A(iGulf), ten: A(iTen),
  each: A(iEach), twice: A(iTwice), listen: A(iListen), go: A(iGo),
  recap: recapStart, q: A(iQ), ar: A(iAr), daily: A(iDaily),
  follow: A(iFollow), day4: A(iDay4), see: A(iSee),
  firstSentence: sentStarts[0],
};

export type SceneDef = { id: string; start: number; end: number };
const bounds: [string, number][] = [
  ["hook", 0], ["lesson", marks.part], ["how", marks.each], ["go", marks.go],
  ...sentenceTimings.map((s) => [`s${s.n}`, s.start] as [string, number]),
  ["recap", marks.recap], ["question", marks.q], ["tagline", marks.ar],
  ["cta", marks.daily], ["outro", marks.see],
];
export const scenes: SceneDef[] = bounds.map(([id, start], i) => ({
  id, start,
  end: i < bounds.length - 1 ? bounds[i + 1][1] + theme.motion.overlap : TOTAL,
}));
export const sceneOf = (id: string) => scenes.find((s) => s.id === id)!;
export const relTo = (id: string, abs: number) => abs - sceneOf(id).start;

// sanity: markers must be strictly increasing
for (let i = 1; i < bounds.length; i++) {
  if (bounds[i][1] <= bounds[i - 1][1]) console.warn("scene order problem at", bounds[i][0]);
}

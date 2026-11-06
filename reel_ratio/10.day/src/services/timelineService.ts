import type { SrtCue, TimedWord } from "../types";

const strip = (s: string): string => s.replace(/[,।!?.:;"“”]/g, "");
const latin = (s: string): string => s.toLowerCase().replace(/[^a-z]/g, "");

/** Interpolates per-word time inside each cue (weighted by character length). */
export function toTimedWords(cues: SrtCue[]): TimedWord[] {
  const out: TimedWord[] = [];
  for (const cue of cues) {
    const tokens = cue.text.split(/\s+/).filter(Boolean);
    const total = tokens.reduce((a, t) => a + t.length + 1, 0);
    let acc = 0;
    for (const t of tokens) {
      const s = cue.startSec + ((cue.endSec - cue.startSec) * acc) / total;
      acc += t.length + 1;
      const e = cue.startSec + ((cue.endSec - cue.startSec) * acc) / total;
      out.push({ text: t, startSec: s, endSec: e, cueIndex: cue.index });
    }
  }
  return out;
}

const UNITS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
};
const TEENS: Record<string, number> = {
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

function parseNumberWords(
  words: TimedWord[],
  start: number,
): { value: number; next: number } | null {
  let value = 0;
  let i = start;
  let any = false;
  for (; i < words.length; i++) {
    const w = latin(words[i]!.text);
    if (w === "hundred") {
      value = (value || 1) * 100;
    } else if (w in TENS) value += TENS[w]!;
    else if (w in TEENS) value += TEENS[w]!;
    else if (w in UNITS) value += UNITS[w]!;
    else if (w === "and") continue;
    else break;
    any = true;
  }
  return any ? { value, next: i } : null;
}

export interface SentenceMarker {
  number: number;
  markerIndex: number; // index of the word "Sentence"
  afterIndex: number; // first word after the number words
}

export function findSentenceMarkers(words: TimedWord[]): SentenceMarker[] {
  const markers: SentenceMarker[] = [];
  words.forEach((w, i) => {
    if (latin(w.text) !== "sentence") return;
    const n = parseNumberWords(words, i + 1);
    if (n) markers.push({ number: n.value, markerIndex: i, afterIndex: n.next });
  });
  return markers;
}

/** Finds the first word (at/after `from`) equal to the anchor, ignoring punctuation. */
export function findAnchor(words: TimedWord[], anchor: string, from: number): number {
  const a = strip(anchor);
  for (let i = from; i < words.length; i++) {
    if (strip(words[i]!.text) === a) return i;
  }
  return -1;
}

export const wordStartsWith = (w: TimedWord, prefix: string): boolean =>
  strip(w.text).startsWith(strip(prefix)) || w.text.startsWith(prefix);

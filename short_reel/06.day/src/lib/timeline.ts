import cuesJson from "../data/generated/cues.json";
import {vocab, VocabItem} from "../data/vocab";

export type Cue = {index: number; start: number; end: number; text: string};
export const cues = cuesJson as Cue[];

const stripDanda = (s: string) => s.replace(/[।\s]+$/u, "").trim();
const cueByIndex = (i: number) => {
  const c = cues.find((x) => x.index === i);
  if (!c) throw new Error(`SRT cue ${i} not found`);
  return c;
};

export type TimelineItem = {
  item: VocabItem;
  pronText: string;
  meaningText: string;
  /** all values are absolute frames */
  start: number;
  end: number;
  pronStart: number;
  pronEnd: number;
  meaningStart: number;
  meaningEnd: number;
};

export const lastCueEndSeconds = Math.max(...cues.map((c) => c.end));

export const buildTimeline = (fps: number, totalFrames: number): TimelineItem[] => {
  const f = (s: number) => Math.round(s * fps);
  const rows = vocab.map((item) => {
    const p = cueByIndex(item.pronCue);
    const m = cueByIndex(item.meaningCue);
    const pronStart = f(p.start);
    const meaningStart = item.split ? f(p.start + item.split.meaningOffsetSec) : f(m.start);
    const pronEnd = item.split ? meaningStart : f(p.end);
    return {
      item,
      pronText: item.split ? item.split.pron : stripDanda(p.text),
      meaningText: item.split ? item.split.meaning : stripDanda(m.text),
      start: pronStart,
      end: 0,
      pronStart,
      pronEnd,
      meaningStart,
      meaningEnd: f(m.end),
    };
  });
  rows.forEach((r, i) => {
    r.end = i < rows.length - 1 ? rows[i + 1].start : totalFrames;
  });
  return rows;
};

// All timing comes from the SRT. Nothing is placed by hand.
import { SRT_TEXT } from "./srt";
import { VIDEO } from "./theme";

export type Cue = { index: number; start: number; end: number; text: string };

const toSec = (t: string) => {
  const m = t.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/)!;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

export const cues: Cue[] = SRT_TEXT.replace(/\r/g, "")
  .trim()
  .split(/\n\s*\n/)
  .map((block) => {
    const lines = block.split("\n");
    const [a, b] = lines[1].split("-->");
    return {
      index: +lines[0],
      start: toSec(a),
      end: toSec(b),
      text: lines.slice(2).join(" ").replace(/\s+/g, " ").trim(),
    };
  });

export const fps = VIDEO.fps;
export const toFrame = (sec: number) => Math.round(sec * fps);

const cue = (i: number) => {
  const c = cues.find((x) => x.index === i);
  if (!c) throw new Error(`SRT cue ${i} not found`);
  return c;
};

/** Start time (sec) of cue i. */
export const cueStart = (i: number) => cue(i).start;
export const cueEnd = (i: number) => cue(i).end;

/**
 * Time (sec) of the n-th occurrence of `marker` inside cue i, estimated by its
 * character position across the cue's SRT duration.
 */
export const markerAt = (i: number, marker: string, nth = 0) => {
  const c = cue(i);
  let idx = -1;
  for (let k = 0; k <= nth; k++) {
    idx = c.text.indexOf(marker, idx + 1);
    if (idx < 0) throw new Error(`marker "${marker}" #${nth} not in cue ${i}: ${c.text}`);
  }
  return c.start + (idx / c.text.length) * (c.end - c.start);
};

export const lastCueEnd = cues[cues.length - 1].end;
// Audio file is a few hundred ms longer than the last cue; SRT remains the guide.
export const TOTAL_SECONDS = lastCueEnd + 0.4;
export const TOTAL_FRAMES = toFrame(TOTAL_SECONDS);

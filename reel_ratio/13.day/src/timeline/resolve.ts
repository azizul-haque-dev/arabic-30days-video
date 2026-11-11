import { Cue, normalizeCueText } from "../parsers/srt";

/**
 * A point in time, expressed relative to the ORIGINAL SRT.
 *  - { sec }            absolute seconds
 *  - { cue }            start of that cue (exact, from the SRT)
 *  - { cue, marker }    a position INSIDE a cue where `marker` begins.
 *                       SRT has no word timing, so this is a proportional
 *                       ESTIMATE (marked estimated=true) unless an override
 *                       from real word-level alignment is supplied.
 */
export type TimeRef = { sec: number } | { cue: number; marker?: string };

export type ResolvedTime = {
  sec: number;
  estimated: boolean;
  source: string;
};

/** Manual / audio-aligned overrides: key = "<cue>:<marker>" -> absolute seconds. */
export type TimingOverrides = Record<string, number>;

export const refKey = (cue: number, marker: string): string => `${cue}:${marker}`;

export function resolveRef(
  ref: TimeRef,
  cues: Cue[],
  overrides: TimingOverrides = {},
): ResolvedTime {
  if ("sec" in ref) return { sec: ref.sec, estimated: false, source: `${ref.sec}s` };

  const cue = cues.find((c) => c.index === ref.cue);
  if (!cue) throw new Error(`Timeline references cue ${ref.cue}, which does not exist in the SRT.`);

  if (!ref.marker) return { sec: cue.start, estimated: false, source: `cue ${cue.index} start` };

  const override = overrides[refKey(cue.index, ref.marker)];
  if (override !== undefined) {
    return { sec: override, estimated: false, source: `override ${refKey(cue.index, ref.marker)}` };
  }

  const text = normalizeCueText(cue.text);
  const pos = text.indexOf(ref.marker);
  if (pos < 0) {
    throw new Error(`Marker "${ref.marker}" not found in cue ${cue.index}: "${text}"`);
  }
  if (pos === 0) return { sec: cue.start, estimated: false, source: `cue ${cue.index} start` };

  const ratio = pos / text.length;
  return {
    sec: cue.start + ratio * (cue.end - cue.start),
    estimated: true,
    source: `cue ${cue.index} @ "${ref.marker}" (proportional estimate, ${(ratio * 100).toFixed(0)}% of cue)`,
  };
}

export const secToFrame = (sec: number, fps: number): number => Math.round(sec * fps);

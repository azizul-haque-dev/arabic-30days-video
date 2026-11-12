import { SRT, SrtEntry } from "./generated/srt";
import { theme } from "./theme";

const fps = theme.canvas.fps;
export const sec2f = (s: number) => Math.round(s * fps);

export const entry = (n: number): SrtEntry => {
  const e = SRT[n - 1];
  if (!e) throw new Error(`SRT entry ${n} not found`);
  return e;
};
export const startF = (n: number) => sec2f(entry(n).start);
export const endF = (n: number) => sec2f(entry(n).end);

/** Composition length = final SRT timestamp (169.95s → 5099 frames @30fps). */
export const TOTAL_FRAMES = Math.ceil(SRT[SRT.length - 1].end * fps);

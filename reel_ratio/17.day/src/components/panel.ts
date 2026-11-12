import { ease, sec } from "../lib/anim";
import { theme } from "../theme";

export interface PanelState {
  opacity: number;
  /** 0..1 entrance progress (eased) */
  enter: number;
  /** frames since the panel started */
  local: number;
  len: number;
}

/**
 * Time-boxed panel: returns null outside [start, end). Entrance eases in, exit is faster than the entrance
 * and finishes exactly at `end`, so two sequential panels never overlap in time.
 */
export const panelState = (
  frame: number,
  start: number,
  end: number,
  fps: number,
  opts: { enterSec?: number; exitSec?: number; fadeOut?: boolean } = {},
): PanelState | null => {
  if (frame < start || frame >= end) return null;
  const len = end - start;
  const enterF = Math.max(2, Math.min(sec(opts.enterSec ?? theme.motion.enterSec, fps), Math.floor(len * 0.5)));
  const exitF = Math.max(2, Math.min(sec(opts.exitSec ?? theme.motion.exitSec, fps), Math.floor(len * 0.35)));
  const local = frame - start;
  const enter = ease(local, [0, enterF], [0, 1], theme.easings.out);
  const exit = opts.fadeOut === false ? 1 : ease(local, [len - exitF, len], [1, 0], theme.easings.in);
  return { opacity: Math.min(enter, exit), enter, local, len };
};

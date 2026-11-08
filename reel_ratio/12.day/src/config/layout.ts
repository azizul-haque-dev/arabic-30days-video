import cfg from "../../episode.config.json";
import type { Rect } from "../types";

/** Canvas + spacing system. All numbers derive from the centralised video config. */
export const W: number = cfg.video.width;
export const H: number = cfg.video.height;
export const MARGIN = 70;                 // minimum left/right safe margin (px)
export const CONTENT_W = W - MARGIN * 2;
export const SAFE_TOP = 100;
export const SAFE_BOTTOM = 190;           // keeps text clear of the platform UI at the bottom
export const SAFE: Rect = { x: MARGIN, y: SAFE_TOP, w: CONTENT_W, h: H - SAFE_TOP - SAFE_BOTTOM };
export const MIN_GAP = 20;                // minimum distance between any two text zones

export const R = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });
export const ROW = (y: number, h: number): Rect => R(MARGIN, y, CONTENT_W, h);

/** 5 x 2 grid of chips (sentence numbers). */
export function chipRect(area: Rect, i: number, cols = 5, gap = 22): Rect {
  const rows = Math.ceil(10 / cols);
  const cw = Math.floor((area.w - gap * (cols - 1)) / cols);
  const ch = Math.floor((area.h - gap * (rows - 1)) / rows);
  return R(area.x + (i % cols) * (cw + gap), area.y + Math.floor(i / cols) * (ch + gap), cw, ch);
}

/** Vertical travel (px) of a text entrance. Must stay below half of MIN_GAP so animated text can never reach a neighbour. */
export const TEXT_MOTION_DY = 8;

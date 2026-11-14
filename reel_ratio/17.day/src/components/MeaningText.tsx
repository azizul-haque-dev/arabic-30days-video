import React from "react";
import type { Rect } from "../layout/engine";
import { MEANING_WEIGHT } from "../layout/engine";
import { theme } from "../theme";

const c = theme.colors;

export const MeaningChip: React.FC<{ rect: Rect; style?: React.CSSProperties }> = ({ rect, style }) => (
  <div
    data-box="meaning-chip"
    data-kind="chrome"
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      borderRadius: rect.h / 2,
      background: c.accent,
      color: c.text,
      fontFamily: theme.fonts.bn,
      fontWeight: 700,
      fontSize: 28,
      lineHeight: `${rect.h}px`,
      textAlign: "center",
      ...style,
    }}
  >
    অর্থ
  </div>
);

/** Bengali meaning, medium size, revealed on its own cue. */
export const MeaningText: React.FC<{ rect: Rect; size: number; lines: string[]; style?: React.CSSProperties }> = ({ rect, size, lines, style }) => (
  <div
    data-box="meaning"
    data-kind="text"
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      fontFamily: theme.fonts.bn,
      fontWeight: MEANING_WEIGHT,
      fontSize: size,
      lineHeight: 1.35,
      color: c.text,
      whiteSpace: "nowrap",
      textAlign: "center",
      ...style,
    }}
  >
    {lines.map((l, i) => (
      <div key={i}>{l}</div>
    ))}
  </div>
);

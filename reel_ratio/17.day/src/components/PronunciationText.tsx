import React from "react";
import type { Rect } from "../layout/engine";
import { BN_WEIGHT } from "../layout/engine";
import { theme } from "../theme";

/** Large Bengali pronunciation of one unit — the main learning element. */
export const PronunciationText: React.FC<{
  rect: Rect;
  size: number;
  text: string;
  index: number;
  style?: React.CSSProperties;
}> = ({ rect, size, text, index, style }) => (
  <div
    data-box={`pronunciation-${index}`}
    data-kind="text"
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      fontFamily: theme.fonts.bn,
      fontWeight: BN_WEIGHT,
      fontSize: size,
      lineHeight: `${rect.h}px`,
      color: theme.colors.text,
      whiteSpace: "nowrap",
      textAlign: "center",
      ...style,
    }}
  >
    {text}
  </div>
);

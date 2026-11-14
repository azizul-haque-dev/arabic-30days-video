import React from "react";
import type { Rect } from "../layout/engine";
import { AR_WEIGHT } from "../layout/engine";
import { theme } from "../theme";

/** Smaller Arabic text, always RTL, sitting right under its Bengali unit. */
export const ArabicText: React.FC<{
  rect: Rect;
  size: number;
  text: string;
  index: number;
  style?: React.CSSProperties;
}> = ({ rect, size, text, index, style }) => (
  <div
    data-box={`arabic-${index}`}
    data-kind="text"
    lang="ar"
    dir="rtl"
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      fontFamily: theme.fonts.ar,
      fontWeight: AR_WEIGHT,
      fontSize: size,
      lineHeight: `${rect.h}px`,
      color: theme.colors.primaryDark,
      whiteSpace: "nowrap",
      textAlign: "center",
      unicodeBidi: "isolate",
      ...style,
    }}
  >
    {text}
  </div>
);

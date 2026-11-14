import React, { useMemo } from "react";
import { fitSingleLine, type FontKind } from "../layout/engine";
import { browserMeasure, fontFamilyCss } from "../layout/measure";

/** One-line text that auto-sizes to fit its max width (real browser measurement). */
export const FitText: React.FC<{
  text: string;
  font?: FontKind;
  weight?: number;
  maxSize: number;
  minSize?: number;
  maxW?: number;
  color: string;
  box: string;
  style?: React.CSSProperties;
  kind?: "text" | "chrome";
}> = ({ text, font = "bn", weight = 700, maxSize, minSize = 36, maxW = 880, color, box, style, kind = "text" }) => {
  const fit = useMemo(() => fitSingleLine(text, font, weight, maxSize, minSize, maxW, browserMeasure), [text, font, weight, maxSize, minSize, maxW]);
  return (
    <div
      data-box={box}
      data-kind={kind}
      dir={font === "ar" ? "rtl" : undefined}
      style={{
        width: fit.w,
        height: fit.h,
        fontFamily: fontFamilyCss(font),
        fontWeight: weight,
        fontSize: fit.size,
        lineHeight: `${fit.h}px`,
        color,
        whiteSpace: "nowrap",
        textAlign: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

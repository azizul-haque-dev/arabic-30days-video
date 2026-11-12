import React, { useMemo } from "react";
import { fitText } from "@remotion/layout-utils";

/** Single-line text whose font-size is calculated so it never exceeds `maxWidth`. */
export const FitLine: React.FC<{
  id: string;
  text: string;
  maxWidth: number;
  maxFontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  lineHeightRatio?: number;
  letterSpacing?: string;
  opacity?: number;
  translateY?: number;
}> = ({ id, text, maxWidth, maxFontSize, fontFamily, fontWeight, color, lineHeightRatio = 1.3, letterSpacing, opacity = 1, translateY = 0 }) => {
  const size = useMemo(
    () => Math.min(maxFontSize, Math.floor(fitText({ text, withinWidth: maxWidth, fontFamily, fontWeight, letterSpacing }).fontSize)),
    [text, maxWidth, maxFontSize, fontFamily, fontWeight, letterSpacing],
  );
  const lh = Math.round(size * lineHeightRatio);
  return (
    <div
      data-lbox={id}
      data-lkind="text"
      style={{ fontFamily, fontWeight, fontSize: size, lineHeight: `${lh}px`, height: lh, color, whiteSpace: "nowrap", textAlign: "center", letterSpacing, opacity, transform: `translateY(${translateY}px)` }}
    >
      {text}
    </div>
  );
};

import React from "react";
import { theme } from "../theme";
import { fitText, type Script } from "../lib/layout";

const FONT = { bn: theme.fonts.bn, ar: theme.fonts.ar, en: theme.fonts.en } as const;

/** Single-style text block with deterministic wrapping + font scaling (zero-overlap safe). */
export const FitText: React.FC<{
  text: string; script?: Script; width: number; maxLines?: number; maxSize: number; minSize: number;
  weight?: number; color?: string; align?: "center" | "left" | "right"; style?: React.CSSProperties;
}> = ({ text, script = "bn", width, maxLines = 2, maxSize, minSize, weight = 700, color = theme.colors.text, align = "center", style }) => {
  const fit = fitText({ text, script, maxWidth: width, maxLines, maxSize, minSize });
  return (
    <div dir={script === "ar" ? "rtl" : "ltr"} style={{ width, textAlign: align, ...style }}>
      {fit.lines.map((l, i) => (
        <div key={i} style={{ height: fit.lineHeightPx, lineHeight: `${fit.lineHeightPx}px`, whiteSpace: "nowrap", fontFamily: FONT[script], fontWeight: weight, fontSize: fit.size, color }}>
          {l}
        </div>
      ))}
    </div>
  );
};

export const fitHeight = (o: Parameters<typeof fitText>[0]) => fitText(o).height;

export const Abs: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    {children}
  </div>
);

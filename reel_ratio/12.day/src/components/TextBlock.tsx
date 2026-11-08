import React, { useMemo } from "react";
import { measureText } from "@remotion/layout-utils";
import { theme, type ThemeColor } from "../theme";
import { FONT_FAMILY } from "../config/typography";
import { fitText } from "../utils/fitText";
import { fadeIn, useEnter } from "../utils/motion";
import type { TextSpec } from "../types";

const measure = (text: string, fontSize: number, weight: number) =>
  measureText({ text, fontFamily: FONT_FAMILY, fontSize, fontWeight: weight, validateFontIsLoaded: true }).width;

/**
 * Renders one text spec inside its own zone. The font size is measured (largest size that fits the zone),
 * lines are wrapped explicitly so the browser can never re-wrap differently from what was measured.
 */
export const TextBlock: React.FC<{ spec: TextSpec; delay: number; color?: ThemeColor }> = ({ spec, delay, color }) => {
  const p = useEnter(delay, "enter");
  const fit = useMemo(
    () => fitText({ paragraphs: spec.paragraphs, maxWidth: spec.zone.w, maxHeight: spec.zone.h, maxFont: spec.maxFont, minFont: spec.minFont, lineHeight: spec.lineHeight, paragraphGap: spec.paragraphGap, weight: spec.weight, measure }),
    [spec],
  );
  if (!fit.fits) console.warn(`[layout] "${spec.id}" does not fit its zone even at ${fit.fontSize}px`);
  const align = spec.align ?? "center";
  return (
    <div
      style={{
        position: "absolute", left: spec.zone.x, top: spec.zone.y, width: spec.zone.w, height: spec.zone.h,
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        opacity: fadeIn(p), transform: `translateY(${theme.motion.textDy * (1 - p)}px) scale(${0.96 + 0.04 * p})`,
        fontFamily: theme.fonts.main, fontWeight: spec.weight, color: theme.colors[color ?? spec.color],
        fontSize: fit.fontSize, lineHeight: spec.lineHeight, textAlign: align, whiteSpace: "nowrap",
      }}
    >
      {fit.paragraphs.map((lines, pi) => (
        <div key={pi} style={{ marginTop: pi ? spec.paragraphGap ?? 0 : 0 }}>
          {lines.map((l, li) => (<div key={li}>{l}</div>))}
        </div>
      ))}
    </div>
  );
};

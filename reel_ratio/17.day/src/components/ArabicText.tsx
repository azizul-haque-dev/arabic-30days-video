import React from "react";
import { ease, sec } from "../lib/anim";
import { theme } from "../theme";

/** Smaller Arabic text, right-to-left, aligned under its Bengali pronunciation unit. */
export const ArabicText: React.FC<{
  id: string;
  lines: string[];
  fontSize: number;
  lineHeight: number;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ id, lines, fontSize, lineHeight, frame, fps, startFrame }) => {
  const t = ease(frame, [startFrame, startFrame + sec(0.5, fps)], [0, 1], theme.easings.out);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: t, transform: `scale(${0.94 + 0.06 * t})` }}>
      {lines.map((line, i) => (
        <div
          key={i}
          data-lbox={`${id}-l${i + 1}`}
          data-lkind="text"
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: theme.fonts.arabic,
            fontWeight: 700,
            fontSize,
            lineHeight: `${lineHeight}px`,
            height: lineHeight,
            whiteSpace: "nowrap",
            color: theme.colors.primaryDeep,
            textAlign: "center",
            unicodeBidi: "isolate",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

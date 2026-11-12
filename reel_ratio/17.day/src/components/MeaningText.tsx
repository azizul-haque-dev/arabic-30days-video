import React from "react";
import { ease, sec } from "../lib/anim";
import { theme } from "../theme";

/** Bengali meaning - revealed when the narrator says it. */
export const MeaningText: React.FC<{
  id: string;
  lines: string[];
  fontSize: number;
  lineHeight: number;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ id, lines, fontSize, lineHeight, frame, fps, startFrame }) => {
  const t = ease(frame, [startFrame, startFrame + sec(0.55, fps)], [0, 1], theme.easings.out);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: t, transform: `scale(${0.94 + 0.06 * t})` }}>
      {lines.map((line, i) => (
        <div
          key={i}
          data-lbox={`${id}-l${i + 1}`}
          data-lkind="text"
          style={{
            fontFamily: theme.fonts.bengali,
            fontWeight: 600,
            fontSize,
            lineHeight: `${lineHeight}px`,
            height: lineHeight,
            whiteSpace: "nowrap",
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

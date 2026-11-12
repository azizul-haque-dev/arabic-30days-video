import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ease, useEnter } from "../anim";
import { useFittedText } from "./useFittedText";

type Props = {
  text: string;
  from: number;
  to: number;
  width?: number;
  height?: number;
  maxSize?: number;
  minSize?: number;
  maxLines?: number;
  color?: string;
  weight?: 500 | 600 | 700;
};

/** SRT narration text (exact wording) shown while the narrator speaks it. */
export const Caption: React.FC<Props> = ({ text, from, to, width = 860, height = 300, maxSize = 56, minSize = 38, maxLines = 4, color = theme.colors.text, weight = 600 }) => {
  const frame = useCurrentFrame();
  const e = useEnter(from, { y: 30, from: 0.96 });
  const exit = ease(frame, to - 6, to, theme.ease.in);
  const fitted = useFittedText(text, { fontFamily: "Hind Siliguri", fontWeight: weight, maxWidth: width, maxHeight: height, maxSize, minSize, maxLines, lineHeight: 1.4 });
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: e.opacity * (1 - exit),
        transform: `${e.transform} translateY(${-exit * 14}px)`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        {fitted.lines.map((l, i) => (
          <div key={i} style={{ fontFamily: theme.fonts.bn, fontWeight: weight, fontSize: fitted.fontSize, lineHeight: 1.4, color, whiteSpace: "nowrap" }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

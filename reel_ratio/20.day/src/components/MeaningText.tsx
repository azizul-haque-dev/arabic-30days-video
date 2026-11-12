import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ease, useEnter } from "../anim";
import { useFittedText } from "./useFittedText";

type Props = { text: string; enterFrame: number; endFrame: number; maxWidth?: number };

/** Bengali meaning — supporting text, revealed when the meaning is spoken. */
export const MeaningText: React.FC<Props> = ({ text, enterFrame, endFrame, maxWidth = 860 }) => {
  const frame = useCurrentFrame();
  const e = useEnter(enterFrame, { y: 30, from: 0.95 });
  const fitted = useFittedText(text, {
    fontFamily: "Hind Siliguri",
    fontWeight: 600,
    maxWidth,
    maxHeight: 116,
    maxSize: 48,
    minSize: 36,
    maxLines: 2,
    lineHeight: 1.4,
  });
  // highlight while spoken, then settle to the secondary colour
  const spoken = frame >= enterFrame && frame <= endFrame;
  const underline = ease(frame, enterFrame + 4, Math.min(endFrame, enterFrame + 28), theme.ease.out);
  return (
    <div style={{ height: 140, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: e.opacity, transform: e.transform, textAlign: "center" }}>
        {fitted.lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: theme.fonts.bn,
              fontWeight: 600,
              fontSize: fitted.fontSize,
              lineHeight: 1.4,
              color: spoken ? theme.colors.dark : theme.colors.muted,
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </div>
        ))}
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: theme.colors.amber,
            margin: "4px auto 0",
            width: `${underline * 60}%`,
            opacity: spoken ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};

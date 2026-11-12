import React from "react";
import { interpolateColors } from "remotion";
import { theme } from "../theme";
import { prog, springIn } from "../lib/anim";
import type { FitResult } from "../lib/layout";

/**
 * PRIMARY learning element. Bengali pronunciation, words fade in staggered (4f apart).
 * At the second repetition (`secondFrame`) the text gets a calm emphasis: colour shift, underline sweep, tiny pulse.
 */
export const PronunciationText: React.FC<{
  fit: FitResult; frame: number; fps: number; firstFrame: number; secondFrame: number;
}> = ({ fit, frame, fps, firstFrame, secondFrame }) => {
  const emph = prog(frame, secondFrame, 12, theme.ease.soft);
  const pulse = 1 + 0.022 * Math.sin(prog(frame, secondFrame, 14, theme.ease.soft) * Math.PI);
  const color = interpolateColors(emph, [0, 1], [theme.colors.text, theme.colors.primaryDark]);
  let wordIndex = 0;
  return (
    <div style={{ transform: `scale(${pulse})`, textAlign: "center" }}>
      {fit.lines.map((line, li) => (
        <div key={li} style={{ height: fit.lineHeightPx, lineHeight: `${fit.lineHeightPx}px`, whiteSpace: "nowrap" }}>
          {line.split(" ").map((word, wi) => {
            const i = wordIndex++;
            const d = firstFrame + i * 4;
            const s = springIn(frame, fps, d, theme.spring.smooth);
            const sweep = prog(frame, secondFrame + i * 3, 14, theme.ease.out);
            return (
              <span
                key={wi}
                style={{
                  position: "relative", display: "inline-block", marginInline: Math.round(fit.size * 0.1),
                  fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: fit.size, color,
                  opacity: prog(frame, d, 10), transform: `translateY(${(1 - s) * 18}px)`,
                }}
              >
                {word}
                <span
                  style={{
                    position: "absolute", left: 0, bottom: Math.round(fit.size * 0.06), height: 6, borderRadius: 3,
                    width: `${sweep * 100}%`, background: theme.colors.accent,
                  }}
                />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

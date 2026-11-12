import React from "react";
import { ease, sec } from "../lib/anim";
import { theme } from "../theme";

/**
 * Large Bengali pronunciation. Words reveal in a gentle stagger starting when the narrator
 * starts the unit. Repeated pronunciations pulse a colour highlight (no geometry change, so
 * emphasis can never push text outside its reserved box).
 */
export const PronunciationText: React.FC<{
  id: string;
  lines: string[][];
  fontSize: number;
  lineHeight: number;
  frame: number;
  fps: number;
  /** local frame at which this unit starts being spoken */
  startFrame: number;
  /** local frames at which the unit is repeated by the narrator (emphasis pulses) */
  emphasisFrames: number[];
}> = ({ id, lines, fontSize, lineHeight, frame, fps, startFrame, emphasisFrames }) => {
  let wordIndex = 0;
  const staggerF = sec(theme.motion.staggerSec, fps);
  const enterF = sec(0.5, fps);
  const pulseLen = sec(0.9, fps);
  let pulse = 0;
  for (const f of emphasisFrames) {
    if (frame >= f && frame < f + pulseLen) pulse = Math.max(pulse, 1 - ease(frame, [f, f + pulseLen], [0, 1], theme.easings.outSoft));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {lines.map((words, li) => (
        <div
          key={li}
          data-lbox={`${id}-l${li + 1}`}
          data-lkind="text"
          style={{
            fontFamily: theme.fonts.bengali,
            fontWeight: 700,
            fontSize,
            lineHeight: `${lineHeight}px`,
            height: lineHeight,
            whiteSpace: "nowrap",
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          {words.map((w, wi) => {
            const s = startFrame + wordIndex * staggerF;
            wordIndex += 1;
            const t = ease(frame, [s, s + enterF], [0, 1], theme.easings.out);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  opacity: t,
                  transform: `scale(${0.88 + 0.12 * t})`,
                  filter: t < 1 ? `blur(${(1 - t) * 6}px)` : undefined,
                  marginLeft: wi === 0 ? 0 : fontSize * 0.26,
                  color: pulse > 0 ? theme.colors.primaryDeep : theme.colors.text,
                  textShadow: pulse > 0 ? `0 0 ${24 * pulse}px ${theme.colors.accentSoft}, 0 ${6 * pulse}px 0 ${theme.colors.accentSoft}` : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ease } from "../anim";
import { useFittedText } from "./useFittedText";

export type Sweep = { from: number; to: number };

type Props = {
  text: string;
  /** local frame when the first pronunciation starts (text must not appear before it) */
  enterFrame: number;
  /** pronunciation windows (SRT entries) used for the word-by-word highlight */
  sweeps: Sweep[];
  maxWidth?: number;
  maxHeight?: number;
};

/** Bengali pronunciation — the largest, most prominent text of every sentence scene. */
export const PronunciationText: React.FC<Props> = ({ text, enterFrame, sweeps, maxWidth = 880, maxHeight = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fitted = useFittedText(text, {
    fontFamily: "Hind Siliguri",
    fontWeight: 700,
    maxWidth,
    maxHeight,
    maxSize: 98,
    minSize: 76,
    maxLines: 2,
    lineHeight: 1.25,
  });

  const allWords = fitted.lines.flatMap((l) => l.split(" "));
  const totalChars = allWords.reduce((a, w) => a + w.length, 0);
  const starts: number[] = [];
  let acc = 0;
  allWords.forEach((w) => {
    starts.push(acc / totalChars);
    acc += w.length;
  });
  const ends = starts.map((s, i) => s + allWords[i].length / totalChars);

  // active sweep (if any)
  const sweep = sweeps.find((s) => frame >= s.from && frame <= s.to);
  const sp = sweep ? ease(frame, sweep.from, sweep.to, (t) => t) : 0; // linear on purpose: matches speech pace

  // subtle second emphasis: whole block breathes once when repeated pronunciation starts
  const pulse = sweeps.slice(1).reduce((m, s) => {
    const p = ease(frame, s.from, s.from + 8, theme.ease.out) * (1 - ease(frame, s.from + 8, s.from + 22, theme.ease.inOut));
    return Math.max(m, p);
  }, 0);

  let wi = 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: maxHeight,
        width: "100%",
        transform: `scale(${1 + pulse * 0.035})`,
      }}
    >
      {fitted.lines.map((line, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", gap: Math.round(fitted.fontSize * 0.28), lineHeight: 1.25, whiteSpace: "nowrap" }}>
          {line.split(" ").map((word) => {
            const i = wi++;
            const p = spring({ frame: frame - enterFrame - i * 4 - li * 3, fps, config: theme.spring.pop });
            const o = ease(frame, enterFrame + i * 4, enterFrame + i * 4 + 8);
            const active = !!sweep && sp >= starts[i] && sp < ends[i];
            const done = !!sweep && sp >= ends[i];
            const color = active ? theme.colors.primary : done ? theme.colors.dark : theme.colors.text;
            return (
              <span
                key={i}
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontFamily: theme.fonts.bn,
                  fontWeight: 700,
                  fontSize: fitted.fontSize,
                  color,
                  opacity: o,
                  transform: `translateY(${(1 - p) * 36}px) scale(${(0.9 + 0.1 * p) * (active ? 1.05 : 1)})`,
                  transition: "none",
                }}
              >
                {word}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 2,
                    height: 8,
                    borderRadius: 4,
                    background: theme.colors.amber,
                    opacity: active ? 1 : 0,
                    transform: `scaleX(${active ? 1 : 0})`,
                    transformOrigin: "center",
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

import React from "react";
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";
import {Cue} from "../lib/timeline";

const SubtitleLine: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inP = spring({frame, fps, config: theme.spring.snappy});
  const out = interpolate(frame, [durationInFrames - 3, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{alignItems: "center", pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          top: theme.layout.subtitleTop,
          maxWidth: 900,
          padding: "12px 44px",
          borderRadius: 48,
          backgroundColor: theme.colors.subtitleBg,
          opacity: inP * out,
          transform: `translateY(${interpolate(inP, [0, 1], [24, 0])}px) scale(${interpolate(inP, [0, 1], [0.95, 1])})`,
        }}
      >
        <span
          style={{
            fontFamily: `'${theme.fonts.bengali}', ${theme.fonts.fallback}`,
            fontWeight: 600,
            fontSize: 54,
            lineHeight: 1.5,
            color: theme.colors.white,
            whiteSpace: "pre-wrap",
            textAlign: "center",
            display: "block",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** One sequence per SRT cue: appears exactly at the cue's start, ends at its end. */
export const Subtitles: React.FC<{cues: Cue[]}> = ({cues}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {cues.map((c) => {
        const from = Math.round(c.start * fps);
        const to = Math.round(c.end * fps);
        return (
          <Sequence key={c.index} from={from} durationInFrames={Math.max(1, to - from)} layout="none" name={`cue ${c.index}`}>
            <SubtitleLine text={c.text} />
          </Sequence>
        );
      })}
    </>
  );
};

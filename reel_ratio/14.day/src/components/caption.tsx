import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";
import type { Cue } from "../utils/srt";
import { enter, enterStyle, exitProgress } from "../utils/motion";
import { TextBox, Zone } from "./layout";

const c = theme.colors;

const CaptionCue: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 0);
  const e = exitProgress(frame, dur, 6);
  const size = text.length > 70 ? 42 : text.length > 45 ? 48 : 54;
  return (
    <Zone zone="caption">
      <TextBox
        id="caption"
        kind="caption"
        style={{
          background: "rgba(255,255,255,0.94)",
          borderRadius: 36,
          padding: "16px 30px",
          fontFamily: theme.fonts.bn,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.38,
          color: c.text,
          boxShadow: `0 18px 40px -22px rgba(16,35,29,0.4), inset 0 0 0 3px ${c.greenSoft}`,
          textWrap: "balance" as never,
          ...enterStyle(p, 28, 0.96),
          opacity: enterStyle(p).opacity * (1 - e),
          transform: `${enterStyle(p, 28, 0.96).transform} translateY(${e * 14}px)`,
        }}
      >
        {text}
      </TextBox>
    </Zone>
  );
};

/** Narration captions straight from the SRT (cue text verbatim). One cue on screen at a time. */
export const CaptionLayer: React.FC<{ cues: Cue[]; ranges: [number, number][] }> = ({ cues, ranges }) => {
  const { fps } = useVideoConfig();
  const shown = cues.filter((q) => ranges.some(([a, b]) => q.index >= a && q.index <= b));
  return (
    <>
      {shown.map((q) => {
        const from = Math.round(q.start * fps);
        const dur = Math.max(2, Math.round(q.end * fps) - from);
        return (
          <Sequence key={q.index} from={from} durationInFrames={dur} name={`caption-${q.index}`}>
            <CaptionCue text={q.text} dur={dur} />
          </Sequence>
        );
      })}
    </>
  );
};

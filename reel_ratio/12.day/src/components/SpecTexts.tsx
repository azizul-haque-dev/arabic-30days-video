import React from "react";
import { useVideoConfig } from "remotion";
import { theme } from "../theme";
import { TextBlock } from "./TextBlock";
import type { TextSpec } from "../types";

/** Renders all texts of a scene spec; un-cued texts enter in order with a stagger, cued texts wait for their SRT cue. */
export const SpecTexts: React.FC<{ texts: TextSpec[]; cues: Record<string, number>; baseSec?: number }> = ({ texts, cues, baseSec = 0.1 }) => {
  const { fps } = useVideoConfig();
  let order = 0;
  return (
    <>
      {texts.map((t) => {
        const extra = Math.round((t.delaySec ?? 0) * fps);
        let delay: number;
        if (t.cue) delay = (cues[t.cue] ?? 0) + extra;
        else delay = Math.round((baseSec + order++ * theme.motion.staggerSeconds) * fps) + extra;
        return <TextBlock key={t.id} spec={t} delay={delay} />;
      })}
    </>
  );
};

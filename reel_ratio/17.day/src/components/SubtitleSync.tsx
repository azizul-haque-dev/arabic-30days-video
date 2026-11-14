import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { generated } from "../episodes/timeline";
import { theme } from "../theme";

export const useActiveCue = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const entry = Object.entries(generated.cues).find(([, c]) => t >= c.start && t < c.end);
  return entry ? { n: Number(entry[0]), ...entry[1] } : null;
};

/** Debug aid: shows the active SRT cue so timing can be checked in Studio. Off by default. */
export const SubtitleSync: React.FC<{ show?: boolean }> = ({ show = false }) => {
  const cue = useActiveCue();
  if (!show || !cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 60,
        padding: "10px 18px",
        borderRadius: 14,
        background: "rgba(16,35,29,0.85)",
        color: theme.colors.white,
        fontFamily: theme.fonts.bn,
        fontSize: 30,
        textAlign: "center",
      }}
    >
      #{cue.n} · {cue.text}
    </div>
  );
};

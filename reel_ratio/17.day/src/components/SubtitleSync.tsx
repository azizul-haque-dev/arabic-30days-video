import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Cue } from "../timing/types";
import { theme } from "../theme";

/** Returns the SRT cue active at the current frame (or null). Timing authority = the SRT. */
export const useActiveCue = (cues: Cue[], offsetSec = 0): Cue | null => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - offsetSec;
  return cues.find((c) => t >= c.startSec && t < c.endSec) ?? null;
};

/** Optional caption strip (off by default - enable with config.showCaptions). */
export const SubtitleSync: React.FC<{ cues: Cue[]; offsetSec?: number; top: number }> = ({ cues, offsetSec = 0, top }) => {
  const cue = useActiveCue(cues, offsetSec);
  if (!cue) return null;
  return (
    <div style={{ position: "absolute", left: theme.layout.safeX, width: theme.canvas.width - 2 * theme.layout.safeX, top, display: "flex", justifyContent: "center" }}>
      <div
        data-lbox="caption"
        data-lkind="text"
        style={{ fontFamily: theme.fonts.bengali, fontWeight: 600, fontSize: 40, lineHeight: "56px", color: theme.colors.text, textAlign: "center", maxWidth: 940 }}
      >
        {cue.text}
      </div>
    </div>
  );
};

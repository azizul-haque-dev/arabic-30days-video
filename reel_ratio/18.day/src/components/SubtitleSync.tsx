import { useCurrentFrame, useVideoConfig } from "remotion";
import { CUES, type CueDef } from "../episodes/day-18/cues";
import { timecodeToMs } from "../lib/time";

/** Cue lookup for the current frame (audio-synchronised timing; global frame). */
export const useActiveCues = (): CueDef[] => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  return CUES.filter((c) => ms >= timecodeToMs(c.start) && ms < timecodeToMs(c.end));
};

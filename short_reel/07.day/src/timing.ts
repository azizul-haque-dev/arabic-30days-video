import {LESSONS} from "./data/lessons";
import {TIMELINE} from "./data/timeline.generated";
import {FPS, theme} from "./theme";

const f = (sec: number, fps = FPS) => Math.round(sec * fps);

export type WordSchedule = {
  index: number;
  /** absolute frames */
  sceneIn: number;
  sceneOut: number;
  pronStart: number;
  pronEnd: number;
  meanStart: number;
  meanEnd: number;
};

// sanity check: the on-screen text must equal the SRT text
TIMELINE.forEach((t, i) => {
  const l = LESSONS[i];
  if (!l || l.pron !== t.pron.text || l.meaning !== t.meaning.text) {
    console.warn(`[timing] lesson ${i + 1} (${l?.id}) does not match SRT: "${t.pron.text}" / "${t.meaning.text}"`);
  }
});

export const buildSchedule = (fps = FPS) => {
  const lead = f(theme.motion.leadInSec, fps);
  const thumbHold = f(theme.motion.thumbHoldSec, fps);
  const thumbExit = f(theme.motion.thumbExitSec, fps);
  const exit = f(theme.motion.exitSec, fps);

  const words: WordSchedule[] = TIMELINE.map((t, i) => {
    const meanEnd = lead + f(t.meaning.end, fps);
    const prevMeanEnd = i === 0 ? null : lead + f(TIMELINE[i - 1].meaning.end, fps);
    return {
      index: i,
      // first card slides in while the thumbnail leaves; every other card starts the moment the previous meaning cue ends
      sceneIn: prevMeanEnd ?? lead + thumbHold,
      sceneOut: meanEnd + exit,
      pronStart: lead + f(t.pron.start, fps),
      pronEnd: lead + f(t.pron.end, fps),
      meanStart: lead + f(t.meaning.start, fps),
      meanEnd,
    };
  });

  const lastMeanEnd = words[words.length - 1].meanEnd;
  const outroIn = lastMeanEnd;
  const total = lastMeanEnd + f(theme.motion.outroSec, fps);

  return {
    lead,
    words,
    thumbEnd: lead + thumbHold + thumbExit,
    thumbHold,
    thumbExit,
    outroIn,
    total,
  };
};

export const SCHEDULE = buildSchedule();
export const DURATION = SCHEDULE.total;

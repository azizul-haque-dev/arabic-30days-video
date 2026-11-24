import React from "react";
import {AbsoluteFill, Audio, getStaticFiles, Sequence, staticFile} from "remotion";
import "./fonts";
import {BgMesh, Grade, Grain, Vignette} from "./components/Backdrop";
import {ProgressHeader} from "./components/ProgressHeader";
import {LESSONS} from "./data/lessons";
import {OutroScene} from "./scenes/OutroScene";
import {ThumbnailScene} from "./scenes/ThumbnailScene";
import {WordScene} from "./scenes/WordScene";
import {EPISODE, theme} from "./theme";
import {SCHEDULE} from "./timing";

const hasAudio = () => {
  try {
    return getStaticFiles().some((f) => f.name === "audio.wav");
  } catch {
    return false;
  }
};

export const Episode: React.FC = () => {
  return (
    <AbsoluteFill style={{background: theme.colors.bgDeep, fontFamily: theme.fonts.latin}}>
      {/* layer 1 — background */}
      <BgMesh />

      {/* original narration: drop it in public/audio.wav, it is picked up automatically */}
      {hasAudio() && (
        <Sequence from={SCHEDULE.lead} name="Narration (audio.wav)">
          <Audio src={staticFile("audio.wav")} />
        </Sequence>
      )}

      {/* layers 2–3 — assets + type */}
      <ProgressHeader />
      {SCHEDULE.words.map((w) => (
        <Sequence key={w.index} from={w.sceneIn} durationInFrames={w.sceneOut - w.sceneIn} name={`Word ${EPISODE.firstWord + w.index} · ${LESSONS[w.index].arabic}`}>
          <WordScene lesson={LESSONS[w.index]} sched={w} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={SCHEDULE.thumbEnd} name="Opening thumbnail">
        <ThumbnailScene holdFrames={SCHEDULE.lead + SCHEDULE.thumbHold} exitFrames={SCHEDULE.thumbExit} />
      </Sequence>
      <Sequence from={SCHEDULE.outroIn} durationInFrames={SCHEDULE.total - SCHEDULE.outroIn} name="Outro + FOLLOW CTA">
        <OutroScene />
      </Sequence>

      {/* layer 4 — grade, layer 5 — grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

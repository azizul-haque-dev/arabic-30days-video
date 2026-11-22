import React from "react";
import {Composition} from "remotion";
import media from "./data/generated/media.json";
import {lastCueEndSeconds} from "./lib/timeline";
import {loadFonts} from "./fonts";
import {VocabVideo} from "./VocabVideo";

loadFonts();

export const FPS = 30;
const TAIL_SECONDS = 1.0; // only used when there is no audio.wav yet

export const Root: React.FC = () => {
  const seconds = media.hasAudio ? media.durationInSeconds : lastCueEndSeconds + TAIL_SECONDS;
  return (
    <Composition
      id="ArabicMasterVocab"
      component={VocabVideo}
      durationInFrames={Math.ceil(seconds * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

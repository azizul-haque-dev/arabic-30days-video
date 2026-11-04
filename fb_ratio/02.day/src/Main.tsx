import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C, FONT, MOTION } from "./theme";
import "./fonts";
import { MAJOR_WIPES, SCENES, Scene } from "./lib/timeline";
import { BgMesh, Finish } from "./components/Bg";
import { NoExitCtx, Sfx, Wipe } from "./components/Scene";
import { PreviewAudio } from "./components/PreviewAudio";
import { Brand, Hook } from "./scenes/Intro";
import { Progress10, Progress20 } from "./scenes/Progress";
import { Journey } from "./scenes/Journey";
import { SentenceScene } from "./scenes/Sentence";
import { Contrast, Cta, Outro, Recap } from "./scenes/Outro";

const renderScene = (s: Scene) => {
  switch (s.id) {
    case "hook": return <Hook dur={s.dur} />;
    case "brand": return <Brand dur={s.dur} />;
    case "progress10": return <Progress10 dur={s.dur} />;
    case "journey": return <Journey dur={s.dur} />;
    case "recap": return <Recap dur={s.dur} />;
    case "progress20": return <Progress20 dur={s.dur} />;
    case "contrast": return <Contrast dur={s.dur} />;
    case "cta": return <Cta dur={s.dur} />;
    case "outro": return <Outro dur={s.dur} />;
    default: return <SentenceScene k={s.k!} dur={s.dur} />;
  }
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.family, color: C.text, letterSpacing: 0 }}>
    <BgMesh />
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}><NoExitCtx.Provider value={s.noExit}>{renderScene(s)}</NoExitCtx.Provider></Sequence>
    ))}
    {SCENES.slice(1).map((s) => {
      const major = MAJOR_WIPES.includes(s.id);
      const at = major ? s.from - 4 : s.from + MOTION.lead;
      return (
        <React.Fragment key={`t-${s.id}`}>
          {major && <Wipe at={at} />}
          <Sfx name={major ? "whoosh" : "swipe"} at={at - (major ? 9 : 4)} vol={major ? 0.9 : 0.7} />
        </React.Fragment>
      );
    })}
    <Finish />
    <PreviewAudio />
  </AbsoluteFill>
);

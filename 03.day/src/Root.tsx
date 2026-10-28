import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { theme, VIDEO } from "./theme";
import { TOTAL_FRAMES } from "./timing";
import { scenes, sentences, sfxPlan, SceneId } from "./content";
import { BgMesh, Grade, Grain, SceneFrame, Vignette } from "./components/kit";
import { loadFonts } from "./components/fonts";
import { PreviewAudio } from "./components/PreviewAudio";
import { Hook, PromiseScene, Challenge } from "./scenes/Intro";
import { SentenceScene } from "./scenes/Sentence";
import { Recap, Follow, Comment, Signoff } from "./scenes/Outro";

loadFonts();

const renderScene = (id: SceneId, from: number, dur: number) => {
  if (/^s\d+$/.test(id)) {
    const s = sentences.find((x) => `s${x.n}` === id)!;
    return <SentenceScene s={s} from={from} />;
  }
  switch (id) {
    case "hook": return <Hook from={from} />;
    case "promise": return <PromiseScene from={from} />;
    case "challenge": return <Challenge from={from} />;
    case "recap": return <Recap from={from} dur={dur} />;
    case "follow": return <Follow from={from} />;
    case "comment": return <Comment from={from} />;
    default: return <Signoff from={from} />;
  }
};

const Main: React.FC = () => {
  const sfx = sfxPlan();
  return (
    <AbsoluteFill style={{ fontFamily: theme.fonts.body, letterSpacing: 0 }}>
      <BgMesh />
      {scenes.map((sc, i) => {
        const last = i === scenes.length - 1;
        const len = sc.dur + (last ? 0 : theme.motion.overlap);
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={len} name={sc.id}>
            <SceneFrame dur={len}>{renderScene(sc.id, sc.from, sc.dur)}</SceneFrame>
          </Sequence>
        );
      })}
      <Grade />
      <Grain />
      <Vignette />
      <PreviewAudio />
      {sfx.map((e, i) => (
        <Sequence key={i} from={Math.max(0, e.frame)} durationInFrames={VIDEO.fps} layout="none">
          <Audio src={staticFile(`sfx/${e.name}.wav`)} volume={e.vol} playbackRate={e.rate ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);

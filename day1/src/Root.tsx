import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { CONFIG } from "./config";
import { theme } from "./theme";
import { loadFonts } from "./fonts";
import { SfxLayer } from "./sfx";
import { DURATION, FPS, SCENES, WIPES } from "./timeline";
import { BgMesh, Decor, Grade, Grain, Vignette } from "./components/Bg";
import { Hud, SceneShell, Wipe } from "./components/Frame";
import { PreviewAudio } from "./components/PreviewAudio";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Lesson } from "./scenes/Lesson";
import { SentenceScene } from "./scenes/Sentence";
import { Recap } from "./scenes/Recap";
import { Progress } from "./scenes/Progress";
import { Cta } from "./scenes/Cta";
import { Outro } from "./scenes/Outro";

loadFonts();

const renderScene = (id: string) => {
  if (id === "hook") return <Hook />;
  if (id === "intro") return <Intro />;
  if (id === "lesson") return <Lesson />;
  if (id === "recap") return <Recap />;
  if (id === "progress") return <Progress />;
  if (id === "cta") return <Cta />;
  if (id === "outro") return <Outro />;
  return <SentenceScene n={Number(id.slice(1))} />;
};

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    <BgMesh />
    <Decor />
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={s.id}>
        <SceneShell exit={!s.wipeNext && s.id !== "outro"}>{renderScene(s.id)}</SceneShell>
      </Sequence>
    ))}
    <Hud />
    {WIPES.map((w) => <Wipe key={w} at={w} />)}
    <Grade />
    <Grain />
    <Vignette />
    <SfxLayer />
    <PreviewAudio />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <Composition id="Main" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={CONFIG.width} height={CONFIG.height} />
);

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFonts } from "./fonts";
import { SCENES } from "./timing";
import { theme } from "./theme";
import { BgMesh, Grade, Grain, Transition, Vignette } from "./components/Chrome";
import { PreviewAudio } from "./components/PreviewAudio";
import { Sfx } from "./components/Sfx";
import { HookScene, IntroScene, ProgressScene, TodayScene } from "./scenes/Intro";
import { BentoLayout, ChatLayout, GlassLayout } from "./scenes/Sentence";
import { AdviceScene, CtaScene, EndScene, RecapScene } from "./scenes/Outro";

loadFonts();

// Layouts rotate chat → glass → bento (never the same layout twice in a row)
const sentenceLayout = (i: number): React.FC<{ i: number; dur: number }> =>
  [ChatLayout, GlassLayout, BentoLayout][i % 3];

const renderScene = (id: string, dur: number): React.ReactNode => {
  switch (id) {
    case "hook":
      return <HookScene dur={dur} />;
    case "intro":
      return <IntroScene dur={dur} />;
    case "progress":
      return <ProgressScene dur={dur} />;
    case "today":
      return <TodayScene dur={dur} />;
    case "recap":
      return <RecapScene dur={dur} />;
    case "advice":
      return <AdviceScene dur={dur} />;
    case "cta":
      return <CtaScene dur={dur} />;
    case "end":
      return <EndScene dur={dur} />;
    default: {
      // id is "s81" ... "s90"
      const num = Number(id.replace("s", ""));
      const i = num - 81; // 0 to 9
      const Layout = sentenceLayout(i);
      return <Layout i={i} dur={dur} />;
    }
  }
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
    {/* Layer 1: Animated mint mesh + dot grid */}
    <BgMesh />

    {/* Scene sequences derived from SRT */}
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
        {renderScene(s.id, s.dur)}
      </Sequence>
    ))}

    {/* Scene-to-scene transitions + whoosh SFX */}
    {SCENES.slice(1).map((s, k) => (
      <React.Fragment key={s.id}>
        <Transition at={s.from} variant={k} />
        <Sfx name="whoosh" at={s.from - 10} rate={[1, 1.06, 0.95][k % 3]} />
      </React.Fragment>
    ))}

    {/* Layer 4: Color grade */}
    <Grade />

    {/* Layer 5a: Procedural film grain */}
    <Grain />

    {/* Layer 5b: Vignette */}
    <Vignette />

    {/* Studio preview voiceover (if audio present) */}
    <PreviewAudio />
  </AbsoluteFill>
);


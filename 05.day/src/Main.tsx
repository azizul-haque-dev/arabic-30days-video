import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFonts } from "./fonts";
import { SCENES } from "./timing";
import { theme } from "./theme";
import { BgMesh, Grade, Grain, Transition, Vignette } from "./components/Chrome";
import { PreviewAudio } from "./components/PreviewAudio";
import { Sfx } from "./components/Sfx";
import { CountScene, GulfScene, HookScene, HubScene, TwiceScene } from "./scenes/Intro";
import { BentoLayout, ChatLayout, GlassLayout } from "./scenes/Sentence";
import { CommentScene, EndScene, FollowScene, RecapScene, StatementScene } from "./scenes/Outro";

loadFonts();

const sentenceLayout = (i: number): React.FC<{ i: number; dur: number }> => [ChatLayout, GlassLayout, BentoLayout][i % 3];

const render = (id: string, dur: number): React.ReactNode => {
  switch (id) {
    case "hook": return <HookScene dur={dur} />;
    case "gulf": return <GulfScene dur={dur} />;
    case "count": return <CountScene dur={dur} />;
    case "hub": return <HubScene dur={dur} />;
    case "twice": return <TwiceScene dur={dur} />;
    case "recap": return <RecapScene dur={dur} />;
    case "comment": return <CommentScene dur={dur} />;
    case "statement": return <StatementScene dur={dur} />;
    case "follow": return <FollowScene dur={dur} />;
    case "end": return <EndScene dur={dur} />;
    default: {
      const i = Number(id.slice(1)) - 1; // s1..s10 — layouts rotate chat → glass → bento (never the same twice in a row)
      const L = sentenceLayout(i);
      return <L i={i} dur={dur} />;
    }
  }
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
    <BgMesh />
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>{render(s.id, s.dur)}</Sequence>
    ))}
    {/* scene-to-scene transitions + whoosh (peaks on the cut) */}
    {SCENES.slice(1).map((s, k) => (
      <React.Fragment key={s.id}>
        <Transition at={s.from} variant={k} />
        <Sfx name="whoosh" at={s.from - 12} rate={[1, 1.06, 0.95][k % 3]} />
      </React.Fragment>
    ))}
    <Grade />
    <Grain />
    <Vignette />
    <PreviewAudio />
  </AbsoluteFill>
);

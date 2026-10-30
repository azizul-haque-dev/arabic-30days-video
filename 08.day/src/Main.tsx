import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {theme} from "./theme";
import {SCENES} from "./timing";
import {BgMesh, Grade, Grain, Vignette} from "./components/fx";
import {FontLoader, PreviewAudio, SceneShell, Sfx} from "./components/ui";
import {BrandScene, Days30Scene, HookScene, ProgressScene, TodayScene} from "./scenes/IntroScenes";
import {SentenceScene} from "./scenes/SentenceScene";
import {ClosingScene, DashScene, RecapScene, SocialScene} from "./scenes/OutroScenes";

const pick = (id: string): React.ReactNode => {
  if (/^s\d+$/.test(id)) return <SentenceScene n={Number(id.slice(1))} />;
  switch (id) {
    case "hook": return <HookScene />;
    case "brand": return <BrandScene />;
    case "days30": return <Days30Scene />;
    case "progress": return <ProgressScene />;
    case "today": return <TodayScene />;
    case "recap": return <RecapScene />;
    case "dash": return <DashScene />;
    case "social": return <SocialScene />;
    case "closing": return <ClosingScene />;
  }
  return null;
};

const swipeRates = [1, 1.06, 0.95];

export const Main: React.FC = () => {
  const last = SCENES.length - 1;
  return (
    <FontLoader>
      <AbsoluteFill style={{backgroundColor: theme.colors.bg}}>
        <BgMesh />
        {SCENES.map((s, i) => (
          <Sequence key={s.id} from={s.start} durationInFrames={s.end - s.start + (i < last ? theme.motion.overlap : 0)} name={s.id}>
            <SceneShell first={i === 0} last={i === last}>{pick(s.id)}</SceneShell>
          </Sequence>
        ))}
        <Grade />
        <Grain />
        <Vignette />
        {SCENES.slice(1).map((s, i) => (
          <Sfx key={`sw-${s.id}`} name="swipe" at={s.start - 2} rate={swipeRates[i % 3]} />
        ))}
        <PreviewAudio />
      </AbsoluteFill>
    </FontLoader>
  );
};

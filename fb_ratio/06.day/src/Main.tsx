import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {scenePlan, SceneId} from './timing';
import {useFonts} from './fonts';
import {BgMesh, FinishLayers, Wipe} from './components/Backdrop';
import {PreviewAudio} from './components/PreviewAudio';
import {Sfx} from './components/Sfx';
import {HookScene, OverviewScene, HowScene} from './scenes/Intro';
import {SentenceScene} from './scenes/SentenceScene';
import {RecapScene, QuestionScene, LearnScene, CtaScene, EndScene} from './scenes/Outro';

const renderScene = (id: SceneId): React.ReactNode => {
  if (id === 'hook') return <HookScene />;
  if (id === 'overview') return <OverviewScene />;
  if (id === 'how') return <HowScene />;
  if (id === 'recap') return <RecapScene />;
  if (id === 'question') return <QuestionScene />;
  if (id === 'learn') return <LearnScene />;
  if (id === 'cta') return <CtaScene />;
  if (id === 'end') return <EndScene />;
  return <SentenceScene i={parseInt(id.slice(1), 10) - 1} />;
};

export const Main: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill>
      <PreviewAudio />
      <BgMesh />
      {scenePlan.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={s.id}>
          {renderScene(s.id)}
        </Sequence>
      ))}
      {scenePlan.slice(1).map((s, i) => (
        <React.Fragment key={s.id}>
          <Wipe at={s.from} dir={i % 2 === 0 ? 1 : -1} />
          <Sfx at={s.from - 9} name="whoosh" rate={i % 2 === 0 ? 1 : 0.94} />
        </React.Fragment>
      ))}
      <FinishLayers />
    </AbsoluteFill>
  );
};

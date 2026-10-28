import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, getRemotionEnvironment, staticFile, continueRender, delayRender} from 'remotion';
import {FPS, H, W, theme} from './theme';
import {TOTAL, sentences, hook, recapScene, ctaScene, sfx, boundaries} from './timeline';
import {BgMesh, Grade, Grain, Vignette, Wipe} from './primitives';
import {HookScene} from './scenes/HookScene';
import {SentenceScene} from './scenes/SentenceScene';
import {RecapScene, CtaScene} from './scenes/OutroScenes';

// Flip to false to silence the voiceover in Studio. It is always OFF while rendering.
const PREVIEW_AUDIO = true;

const PreviewAudio: React.FC = () => {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    fetch(staticFile('voiceover.mp3'), {method: 'HEAD'})
      .then((r) => setOk(r.ok && (r.headers.get('content-type') ?? '').startsWith('audio')))
      .catch(() => setOk(false));
  }, []);
  if (!PREVIEW_AUDIO || getRemotionEnvironment().isRendering || !ok) return null;
  return <Audio src={staticFile('voiceover.mp3')} volume={1} />;
};

// Optional offline font: put public/fonts/HindSiliguri-Bold.ttf to use it.
const useLocalFont = () => {
  useEffect(() => {
    const h = delayRender('font');
    const f = new FontFace('HS Local', `url(${staticFile('fonts/HindSiliguri-Bold.ttf')})`, {weight: '700'});
    f.load().then((ff) => document.fonts.add(ff)).catch(() => undefined).finally(() => continueRender(h));
  }, []);
};

const SFX_VOL = {pop: 0.3, click: 0.35, whoosh: 0.3, chime: 0.3, thud: 0.28} as const;
const WIPE_AT = new Set([boundaries[0], recapScene.from]); // hook->S1 and S10->recap

export const Main: React.FC = () => {
  useLocalFont();
  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PreviewAudio/>
      <BgMesh/>
      <Sequence from={0} durationInFrames={hook.dur}><HookScene/></Sequence>
      {sentences.map((s) => (
        <Sequence key={s.n} from={s.from} durationInFrames={s.dur}><SentenceScene s={s}/></Sequence>
      ))}
      <Sequence from={recapScene.from} durationInFrames={recapScene.dur}><RecapScene/></Sequence>
      <Sequence from={ctaScene.from} durationInFrames={ctaScene.dur}><CtaScene/></Sequence>
      {boundaries.filter((b) => WIPE_AT.has(b)).map((b) => (
        <Sequence key={'w' + b} from={Math.max(0, b - 8)} durationInFrames={16}><Wipe/></Sequence>
      ))}
      <Grade/>
      <Grain/>
      <Vignette/>
      {sfx.map((e, i) => (
        <Sequence key={i} from={Math.max(0, e.frame)} durationInFrames={Math.ceil(FPS * 1.2)}>
          <Audio src={staticFile(`sfx/${e.file}.wav`)} volume={SFX_VOL[e.file]} playbackRate={e.rate ?? 1}/>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/>
);

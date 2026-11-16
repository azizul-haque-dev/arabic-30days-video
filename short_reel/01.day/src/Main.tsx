import React from 'react';
import {AbsoluteFill, Audio, getRemotionEnvironment, Sequence, staticFile} from 'remotion';
import {BgMesh, Grade, Grain, Vignette} from './components/Layers';
import {Hud} from './components/Hud';
import {SceneShell} from './components/SceneShell';
import {Wipe} from './components/Transition';
import {HookScene} from './scenes/HookScene';
import {ThumbnailScene} from './scenes/ThumbnailScene';
import {WelcomeScene} from './scenes/WelcomeScene';
import {MorningScene} from './scenes/MorningScene';
import {EveningScene} from './scenes/EveningScene';
import {AskScene} from './scenes/AskScene';
import {PraiseScene} from './scenes/PraiseScene';
import {RecapScene} from './scenes/RecapScene';
import {SFX_EVENTS, SceneId, scenes, WIPE_HALF, THUMB_FRAMES} from './timing';
import {PLAY_VOICEOVER_IN_STUDIO} from './voiceover';

export type MainProps = {voiceover: string | null};

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  thumbnail: ThumbnailScene,
  hook: HookScene,
  welcome: WelcomeScene,
  morning: MorningScene,
  evening: EveningScene,
  ask: AskScene,
  praise: PraiseScene,
  recap: RecapScene,
};

/** Voiceover: plays in Studio (switchable) and is ALWAYS part of a real render. */
const PreviewAudio: React.FC<{src: string | null}> = ({src}) => {
  const {isRendering} = getRemotionEnvironment();
  if (!src) return null;
  if (!isRendering && !PLAY_VOICEOVER_IN_STUDIO) return null;
  return <Audio src={staticFile(src)} />;
};

export const Main: React.FC<MainProps> = ({voiceover}) => {
  const recap = scenes[scenes.length - 1];
  return (
    <AbsoluteFill>
      {/* 1 background mesh */}
      <BgMesh />

      {/* 2-3 scene graphics */}
      {scenes.map((s) => {
        const Scene = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.to - s.from}>
            <SceneShell exit={s.id !== 'recap'}>
              <Scene />
            </SceneShell>
          </Sequence>
        );
      })}

      <Sequence name="hud" from={THUMB_FRAMES} durationInFrames={recap.from - THUMB_FRAMES}>
        <Hud />
      </Sequence>

      {scenes.slice(1).map((s) => (
        <Sequence key={`wipe-${s.id}`} name={`wipe-${s.id}`} from={s.from - WIPE_HALF} durationInFrames={WIPE_HALF * 2 + 4}>
          <Wipe />
        </Sequence>
      ))}

      {/* 4 grade, 5 grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />

      <Sequence from={THUMB_FRAMES} layout="none">
        <PreviewAudio src={voiceover} />
      </Sequence>
      {SFX_EVENTS.map((e, i) => (
        <Sequence key={`${e.name}-${i}`} name={`sfx-${e.name}`} from={e.frame} layout="none">
          <Audio src={staticFile(`sfx/${e.name}.wav`)} volume={e.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {planOf, sentenceT, SceneId} from '../timing';
import {sentences} from '../data/content';
import {SceneShell} from '../components/SceneShell';
import {Sfx} from '../components/Sfx';
import {Icon} from '../components/Icons';
import {cardStyle, clamp, Karaoke, Medallion, Pill, Reveal, SentenceHeader, useBreathe, useEnter, Waveform, WordStagger} from '../components/primitives';

const c = theme.colors;

type Ctx = {
  i: number; qIn: number; sayIn: number; meanIn: number; sayStart: number; meanStart: number;
  windows: [number, number][]; dur: number; q: string; phrase: string; meaning: string; hi: number[]; icon: (typeof sentences)[number]['icon'];
};

const useCtx = (i: number): Ctx => {
  const id = `s${i + 1}` as SceneId;
  const plan = planOf(id);
  const T = sentenceT[i];
  const s = sentences[i];
  const sayStart = T.say - plan.from;
  const meanStart = T.mean - plan.from;
  const mid = Math.round((sayStart + meanStart) / 2);
  return {
    i, qIn: T.sent - theme.motion.lead - plan.from, sayIn: sayStart - theme.motion.lead, meanIn: meanStart - theme.motion.lead,
    sayStart, meanStart, windows: [[sayStart, mid - 2], [mid, meanStart - 3]], dur: plan.to - plan.from,
    q: s.q, phrase: s.phrase, meaning: s.meaning, hi: s.hi, icon: s.icon,
  };
};

/** প্রশ্ন বলা শেষে ম্লান হয় */
const useQDim = (sayIn: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [sayIn, sayIn + 14], [1, 0.5], {easing: theme.easings.out, ...clamp});
};

const MeaningLabel: React.FC<{size?: number}> = ({size = 26}) => (
  <Pill bg={c.accent} color={c.text} size={size}>অর্থ</Pill>
);

const Sounds: React.FC<{x: Ctx}> = ({x}) => {
  const rate = 1 + (x.i % 3) * 0.05;
  return (
    <>
      <Sfx at={x.qIn + 2} name="pop" rate={rate} />
      <Sfx at={x.sayIn} name="pop" rate={rate * 1.12} volume={0.24} />
      <Sfx at={x.meanIn + 2} name="click" rate={rate} />
    </>
  );
};

// ───────── লেআউট A: Glossy UI Mockup (চ্যাট) ─────────
const LayoutA: React.FC<{x: Ctx}> = ({x}) => {
  const dim = useQDim(x.sayIn);
  const br = useBreathe(3.4, 0.006);
  return (
    <>
      <SentenceHeader n={x.i + 1} start={x.qIn - 2} />
      <Reveal start={x.qIn - 3} y={50} from={0.96} style={{position: 'absolute', left: 70, top: 272, width: 940, height: 740, transform: undefined}}>
        <div style={{...cardStyle, width: 940, height: 740, padding: '34px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, transform: `scale(${br})`}}>
          <div style={{alignSelf: 'flex-start', maxWidth: 650, opacity: dim}}>
            <Reveal start={x.qIn + 2} x={-30} y={16}>
              <div style={{background: c.heroTint, borderRadius: `${theme.radius.bubble}px ${theme.radius.bubble}px ${theme.radius.bubble}px 8px`, padding: '20px 30px'}}>
                <WordStagger text={x.q} start={x.qIn + 8} size={40} weight={600} align="left" lineHeight={1.34} />
              </div>
            </Reveal>
          </div>
          <div style={{alignSelf: 'flex-end', maxWidth: 800}}>
            <Reveal start={x.sayIn} x={40} y={18} cfg={theme.springs.pop}>
              <div style={{background: `linear-gradient(135deg, ${c.hero}, ${c.heroDeep})`, borderRadius: `${theme.radius.bubble}px ${theme.radius.bubble}px 8px ${theme.radius.bubble}px`, padding: '22px 34px 18px', boxShadow: theme.shadow.pop}}>
                <Karaoke text={x.phrase} windows={x.windows} size={70} tone="hero" start={x.sayIn + 4} align="left" />
                <div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 16}}>
                  <Waveform width={240} height={34} color={c.white} active={x.windows} />
                  <span style={{color: c.white, opacity: 0.8, fontWeight: 600, fontSize: 26, fontFamily: theme.fonts.family}}>দুইবার</span>
                </div>
              </div>
            </Reveal>
          </div>
          <div style={{marginTop: 'auto'}}>
            <Reveal start={x.meanIn} y={30} cfg={theme.springs.pop}>
              <div style={{background: c.accentSoft, borderRadius: 32, padding: '16px 30px 18px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start'}}>
                <MeaningLabel />
                <WordStagger text={x.meaning} start={x.meanIn + 6} size={44} align="left" hi={x.hi} hiStart={x.meanIn + 22} lineHeight={1.3} />
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>
      <Medallion size={206} start={x.qIn} style={{position: 'absolute', left: 786, top: 128}}>
        <Icon name={x.icon} />
      </Medallion>
    </>
  );
};

// ───────── লেআউট B: Glass Cards ─────────
const LayoutB: React.FC<{x: Ctx}> = ({x}) => {
  const dim = useQDim(x.sayIn);
  return (
    <>
      <SentenceHeader n={x.i + 1} start={x.qIn - 2} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 140, display: 'flex', justifyContent: 'center', opacity: dim}}>
        <WordStagger text={x.q} start={x.qIn + 2} size={46} weight={700} align="center" maxWidth={880} />
      </div>
      <Medallion size={270} start={x.qIn + 4} style={{position: 'absolute', left: 405, top: 345}}>
        <Icon name={x.icon} />
      </Medallion>
      <Reveal start={x.sayIn} y={60} cfg={theme.springs.pop} style={{position: 'absolute', left: 90, top: 650, width: 900}}>
        <div style={{...cardStyle, padding: '18px 30px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Karaoke text={x.phrase} windows={x.windows} size={66} tone="light" start={x.sayIn + 4} />
          <Waveform width={300} height={30} color={c.hero} active={x.windows} bars={18} />
        </div>
      </Reveal>
      <Reveal start={x.meanIn} y={44} cfg={theme.springs.pop} style={{position: 'absolute', left: 90, top: 902, width: 900}}>
        <div style={{background: c.accentSoft, borderRadius: 38, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: theme.shadow.soft}}>
          <MeaningLabel size={26} />
          <WordStagger text={x.meaning} start={x.meanIn + 6} size={40} align="left" hi={x.hi} hiStart={x.meanIn + 22} lineHeight={1.25} />
        </div>
      </Reveal>
    </>
  );
};

// ───────── লেআউট C: Bento Grid ─────────
const RepTile: React.FC<{x: Ctx}> = ({x}) => {
  const f = useCurrentFrame();
  const on1 = f >= x.windows[0][0];
  const on2 = f >= x.windows[1][0];
  const dot = (on: boolean, n: string) => (
    <div style={{width: 74, height: 74, borderRadius: '50%', background: on ? c.hero : c.heroTint, border: `4px solid ${on ? c.hero : c.line}`, color: on ? c.white : c.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 40, transform: `scale(${on ? 1 : 0.92})`}}>{n}</div>
  );
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, height: '100%'}}>
      <Waveform width={140} height={44} color={c.hero} active={x.windows} bars={9} />
      <div style={{display: 'flex', gap: 14}}>{dot(on1, '১')}{dot(on2, '২')}</div>
      <div style={{fontWeight: 700, fontSize: 28, color: c.muted, fontFamily: theme.fonts.family}}>দুইবার</div>
    </div>
  );
};

const LayoutC: React.FC<{x: Ctx}> = ({x}) => {
  const dim = useQDim(x.sayIn);
  const tile: React.CSSProperties = {...cardStyle, borderRadius: theme.radius.tile, boxSizing: 'border-box', overflow: 'hidden'};
  return (
    <>
      <SentenceHeader n={x.i + 1} start={x.qIn - 2} />
      <div style={{position: 'absolute', left: 70, top: 142, width: 940, display: 'flex', flexDirection: 'column', gap: 22}}>
        <Reveal start={x.qIn} y={40} from={0.94}>
          <div style={{...tile, height: 236, background: c.heroTint, padding: '0 40px', display: 'flex', alignItems: 'center', opacity: dim}}>
            <WordStagger text={x.q} start={x.qIn + 6} size={44} weight={700} align="left" lineHeight={1.34} />
          </div>
        </Reveal>
        <div style={{display: 'flex', gap: 22}}>
          <Reveal start={x.qIn + 5} y={40} from={0.9} cfg={theme.springs.pop} style={{width: 340}}>
            <div style={{...tile, height: 354, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Medallion size={250} start={x.qIn + 6} ring={false}>
                <Icon name={x.icon} />
              </Medallion>
            </div>
          </Reveal>
          <Reveal start={x.sayIn} y={50} from={0.92} cfg={theme.springs.pop} style={{width: 578}}>
            <div style={{...tile, height: 354, background: `linear-gradient(135deg, ${c.hero}, ${c.heroDeep})`, boxShadow: theme.shadow.pop, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px'}}>
              <Karaoke text={x.phrase} windows={x.windows} size={64} tone="hero" start={x.sayIn + 4} />
            </div>
          </Reveal>
        </div>
        <div style={{display: 'flex', gap: 22}}>
          <Reveal start={x.meanIn} y={40} from={0.92} cfg={theme.springs.pop} style={{width: 640}}>
            <div style={{...tile, height: 214, background: c.accentSoft, padding: '18px 34px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', alignItems: 'flex-start'}}>
              <MeaningLabel />
              <WordStagger text={x.meaning} start={x.meanIn + 6} size={42} align="left" hi={x.hi} hiStart={x.meanIn + 22} lineHeight={1.28} />
            </div>
          </Reveal>
          <Reveal start={x.sayIn + 4} y={40} from={0.9} cfg={theme.springs.pop} style={{width: 278}}>
            <div style={{...tile, height: 214}}>
              <RepTile x={x} />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
};

// ───────── লেআউট D: Kinetic ব্যান্ড ─────────
const LayoutD: React.FC<{x: Ctx}> = ({x}) => {
  const dim = useQDim(x.sayIn);
  const band = useEnter(x.sayIn - 4, theme.springs.snappy);
  return (
    <>
      <SentenceHeader n={x.i + 1} start={x.qIn - 2} />
      <div style={{position: 'absolute', left: 70, top: 140, width: 900, opacity: dim}}>
        <WordStagger text={x.q} start={x.qIn + 2} size={48} weight={700} align="left" maxWidth={900} lineHeight={1.32} />
      </div>
      <div style={{position: 'absolute', left: -80, top: 372, width: 1240, height: 330, transform: `rotate(-3deg) translateX(${(1 - band) * -1300}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${c.hero}, ${c.heroDeep})`, boxShadow: theme.shadow.pop}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -14, height: 14, background: c.accent}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingLeft: 80, paddingRight: 80}}>
          <Karaoke text={x.phrase} windows={x.windows} size={84} tone="hero" start={x.sayIn + 4} maxWidth={1000} />
          <Waveform width={360} height={34} color={c.white} active={x.windows} bars={22} />
        </div>
      </div>
      <Medallion size={236} start={x.qIn + 4} style={{position: 'absolute', left: 74, top: 742}}>
        <Icon name={x.icon} />
      </Medallion>
      <Reveal start={x.meanIn} y={40} cfg={theme.springs.pop} style={{position: 'absolute', left: 340, top: 772, width: 670}}>
        <div style={{...cardStyle, background: c.accentSoft, padding: '18px 32px 22px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start'}}>
          <MeaningLabel />
          <WordStagger text={x.meaning} start={x.meanIn + 6} size={44} align="left" hi={x.hi} hiStart={x.meanIn + 22} lineHeight={1.28} />
        </div>
      </Reveal>
    </>
  );
};

const LAYOUTS = [LayoutA, LayoutB, LayoutC, LayoutD];

export const SentenceScene: React.FC<{i: number}> = ({i}) => {
  const x = useCtx(i);
  const L = LAYOUTS[i % 4];
  return (
    <SceneShell dur={x.dur}>
      <Sounds x={x} />
      <L x={x} />
    </SceneShell>
  );
};

import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {theme} from '../theme';
import {Pop, WordReveal, MaskSweep, Sweep, Dots3, SceneShell, toBn} from '../primitives';
import {Icon, Person} from '../icons';
import {PHRASES, REPEAT_PROMPT} from '../content';
import type {SentenceT} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Variant = 'card' | 'chat' | 'spot';
export const VARIANTS: Variant[] = ['card', 'chat', 'spot', 'card', 'chat', 'spot', 'card', 'chat', 'spot', 'card'];

const Header: React.FC<{n: number}> = ({n}) => (
  <div style={{position: 'absolute', top: 54, left: 90, right: 90, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <Pop y={-20} delay={2}>
      <div style={{fontFamily: theme.fonts.body, fontWeight: theme.weight.title, fontSize: 34, color: theme.colors.textDim}}>
        Day 2 · Survival Arabic
      </div>
    </Pop>
    <div style={{display: 'flex', gap: 12}}>
      {Array.from({length: 10}).map((_, i) => (
        <Pop key={i} delay={4 + i * 3} y={-12} from={0.5}>
          <div style={{width: i + 1 === n ? 44 : 16, height: 16, borderRadius: 8,
            background: i + 1 === n ? theme.colors.accent : i + 1 < n ? theme.colors.textDim : theme.colors.line}}/>
        </Pop>
      ))}
    </div>
    <Pop y={-20} delay={2}>
      <div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 40, color: theme.colors.text}}>
        {toBn(String(n).padStart(2, '0'))} / {toBn(10)}
      </div>
    </Pop>
  </div>
);

const phraseSize = (t: string) => (t.length > 24 ? 92 : t.length > 16 ? 108 : 120);

// ---- A: glossy phrase card + meaning pill ----
const CardLayout: React.FC<{s: SentenceT}> = ({s}) => {
  const p = PHRASES[s.n - 1];
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 30) * 4;
  return (
    <>
      <div style={{position: 'absolute', left: 300, top: 180 + breathe, width: 1320}}>
        <Pop delay={0} y={60} preset="smooth">
          <div style={{height: 520, borderRadius: theme.radius.card, background: theme.colors.surface,
            boxShadow: `0 40px 80px -30px ${theme.colors.shadow}44, inset 0 2px 0 #FFFFFF`,
            border: `2px solid ${theme.colors.line}`, position: 'relative', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{position: 'absolute', top: 36, left: 48, display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{width: 84, height: 84, borderRadius: 26, background: theme.colors.primarySoft, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display,
                fontWeight: theme.weight.title, fontSize: 46, color: theme.colors.text}}>{toBn(s.n)}</div>
              <div style={{fontFamily: theme.fonts.body, fontWeight: theme.weight.title, fontSize: 36, color: theme.colors.textDim}}>বাক্য</div>
            </div>
            <div style={{position: 'absolute', top: 30, right: 48}}>
              <Pop delay={10} preset="bouncy" from={0.5}><Icon name={p.icon} size={110} color={theme.colors.accent} soft={theme.colors.accentSoft}/></Pop>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, maxWidth: 1160}}>
              <WordReveal text={p.ar} delay={s.arabicF} per={4} size={phraseSize(p.ar)} />
              <div style={{marginTop: 18, width: 560}}><Sweep delay={s.arabicF + 10} dur={24} height={12}/></div>
            </div>
          </div>
        </Pop>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center'}}>
        <Pop delay={s.meaningF} y={36} preset="snappy">
          <div style={{background: theme.colors.accentSoft, border: `3px solid ${theme.colors.accent}`, borderRadius: 64,
            padding: '24px 56px', maxWidth: 1500, textAlign: 'center', fontFamily: theme.fonts.display, fontWeight: theme.weight.body,
            fontSize: 50, lineHeight: 1.3, color: theme.colors.text}}>{p.meaning}</div>
        </Pop>
      </div>
    </>
  );
};

// ---- B: chat bubbles ----
const ChatLayout: React.FC<{s: SentenceT}> = ({s}) => {
  const p = PHRASES[s.n - 1];
  const frame = useCurrentFrame();
  const typing = frame > s.arabicF + 20 && frame < s.meaningF + 4;
  return (
    <>
      <div style={{position: 'absolute', left: 190, top: 250, display: 'flex', alignItems: 'flex-start', gap: 36}}>
        <Pop delay={0} preset="bouncy" from={0.6}><Person size={130} color={theme.colors.text} bg={theme.colors.primarySoft}/></Pop>
        <Pop delay={4} x={-60} y={20} preset="smooth">
          <div style={{background: theme.colors.surface, borderRadius: '44px 44px 44px 10px', padding: '38px 56px', maxWidth: 1130,
            minHeight: 190, boxShadow: `0 30px 60px -28px ${theme.colors.shadow}44`, border: `2px solid ${theme.colors.line}`,
            display: 'flex', alignItems: 'center'}}>
            <WordReveal text={p.ar} delay={s.arabicF} per={4} size={phraseSize(p.ar) - 14} justify="flex-start" />
          </div>
        </Pop>
      </div>
      <div style={{position: 'absolute', right: 190, top: 660, display: 'flex', alignItems: 'flex-start', gap: 36, flexDirection: 'row-reverse'}}>
        <Pop delay={14} preset="bouncy" from={0.6}><Person size={130} color={theme.colors.accent} bg={theme.colors.accentSoft}/></Pop>
        <div style={{position: 'relative'}}>
          {typing && (
            <div style={{position: 'absolute', right: 0, top: 0, background: theme.colors.surface, borderRadius: '44px 44px 10px 44px',
              padding: '34px 44px', border: `2px solid ${theme.colors.line}`}}><Dots3/></div>
          )}
          {frame >= s.meaningF && (
            <Pop delay={s.meaningF} x={60} y={20} preset="snappy">
              <div style={{background: theme.colors.primary, borderRadius: '44px 44px 10px 44px', padding: '34px 54px', maxWidth: 1050,
                fontFamily: theme.fonts.display, fontWeight: theme.weight.body, fontSize: 52, lineHeight: 1.3, color: theme.colors.surface}}>
                {p.meaning}
              </div>
            </Pop>
          )}
        </div>
      </div>
    </>
  );
};

// ---- C: spotlight tile + mask-sweep meaning ----
const SpotLayout: React.FC<{s: SentenceT}> = ({s}) => {
  const p = PHRASES[s.n - 1];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rot = interpolate(spring({frame, fps, config: theme.spring.bouncy}), [0, 1], [-14, 0]);
  const float = Math.sin(frame / 26) * 6;
  return (
    <>
      <div style={{position: 'absolute', left: 170, top: 270 + float, width: 540, height: 540, borderRadius: 120, background: theme.colors.primarySoft,
        border: `3px solid ${theme.colors.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotate(${rot}deg)`, boxShadow: `0 40px 80px -30px ${theme.colors.shadow}44`}}>
        <Pop delay={4} preset="bouncy" from={0.5}><Icon name={p.icon} size={320} color={theme.colors.primary} soft={theme.colors.surface}/></Pop>
        <div style={{position: 'absolute', bottom: 22, left: 40, fontFamily: theme.fonts.display, fontWeight: theme.weight.title,
          fontSize: 120, color: theme.colors.text, opacity: 0.16}}>{toBn(String(s.n).padStart(2, '0'))}</div>
      </div>
      <div style={{position: 'absolute', left: 820, top: 290, width: 930}}>
        <WordReveal text={p.ar} delay={s.arabicF} per={4} size={phraseSize(p.ar) - 20} justify="flex-start" />
        <div style={{marginTop: 26, width: 220}}><Sweep delay={s.arabicF + 10} dur={20} height={10} color={theme.colors.accent}/></div>
        <div style={{marginTop: 34}}>
          <MaskSweep delay={s.meaningF} dur={20}>
            <div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.body, fontSize: 54, lineHeight: 1.32, color: theme.colors.textDim}}>{p.meaning}</div>
          </MaskSweep>
        </div>
      </div>
    </>
  );
};

export const SentenceScene: React.FC<{s: SentenceT}> = ({s}) => {
  const variant = VARIANTS[s.n - 1];
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <Header n={s.n}/>
      {variant === 'card' && <CardLayout s={s}/>}
      {variant === 'chat' && <ChatLayout s={s}/>}
      {variant === 'spot' && <SpotLayout s={s}/>}
      {s.repeatF !== null && frame >= s.repeatF && (
        <div style={{position: 'absolute', bottom: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Pop delay={s.repeatF} y={30} preset="snappy">
            <div style={{background: theme.colors.text, color: theme.colors.surface, borderRadius: 60, padding: '14px 44px',
              fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 42}}>{REPEAT_PROMPT}</div>
          </Pop>
        </div>
      )}
    </SceneShell>
  );
};

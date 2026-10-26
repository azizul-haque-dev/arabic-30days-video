import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Pop, WordReveal, Dots3, toBn} from '../primitives';
import {Icon} from '../icons';
import {PHRASES} from '../content';
import {hook} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Beat: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [0, 1], {easing: theme.ease.in, ...clamp});
  return <AbsoluteFill style={{opacity: 1 - p, transform: `translateY(${-p * 40}px)`}}>{children}</AbsoluteFill>;
};

// Beat 1: the question + chat bubbles
const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: 130, top: 250, width: 1020}}>
        <WordReveal text="সৌদি আরবের মানুষের সঙ্গে আরবিতে কথা বলতে চান?" per={5} size={104} justify="flex-start" hi={[6]} gapX={24}/>
      </div>
      <div style={{position: 'absolute', right: 150, top: 230 + Math.sin(frame / 28) * 8}}>
        <Pop delay={6} x={80} y={0} preset="smooth">
          <div style={{background: theme.colors.surface, borderRadius: '48px 48px 48px 12px', padding: '44px 56px', width: 420,
            border: `2px solid ${theme.colors.line}`, boxShadow: `0 30px 60px -28px ${theme.colors.shadow}44`}}><Dots3 size={22}/></div>
        </Pop>
        <div style={{height: 36}}/>
        <Pop delay={18} x={80} y={0} preset="bouncy">
          <div style={{background: theme.colors.primary, borderRadius: '48px 48px 12px 48px', padding: '44px 56px', width: 420, marginLeft: 120,
            display: 'flex', justifyContent: 'center'}}>
            <span style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 96, color: theme.colors.surface, lineHeight: 1}}>?</span>
          </div>
        </Pop>
      </div>
    </>
  );
};

// Beat 2: ten sentences
const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.round(interpolate(spring({frame: frame - 6, fps, config: {damping: 30, stiffness: 60}}), [0, 1], [0, 10]));
  return (
    <>
      <div style={{position: 'absolute', left: 150, top: 290}}>
        <Pop delay={0}><div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 62, color: theme.colors.textDim}}>আজকের এই</div></Pop>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 30}}>
          <Pop delay={4} preset="bouncy" from={0.7}>
            <div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 330, lineHeight: 1.05, color: theme.colors.primary,
              fontVariantNumeric: 'tabular-nums'}}>{toBn(n)}</div>
          </Pop>
          <Pop delay={10}><div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 96, color: theme.colors.text}}>টি বাক্য</div></Pop>
        </div>
      </div>
      <div style={{position: 'absolute', right: 130, top: 215, width: 800, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22}}>
        {PHRASES.map((p, i) => (
          <Pop key={p.n} delay={8 + i * 3} preset="bouncy" from={0.5} y={24}>
            <div style={{height: 140, borderRadius: 34, background: i % 2 ? theme.colors.accentSoft : theme.colors.surface,
              border: `2px solid ${theme.colors.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name={p.icon} size={78} color={theme.colors.text} soft="none"/>
            </div>
          </Pop>
        ))}
      </div>
    </>
  );
};

// Beat 3: series progress (Day 2 of 30)
const Beat3: React.FC = () => {
  return (
    <>
      <div style={{position: 'absolute', left: 150, top: 230}}>
        <Pop delay={0}><div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 84, color: theme.colors.text}}>৩০ দিনে ৩০০টি</div></Pop>
        <Pop delay={6}><div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 110, color: theme.colors.text}}>Survival Arabic</div></Pop>
        <Pop delay={14} preset="bouncy" from={0.6} style={{marginTop: 20}}>
          <div style={{display: 'inline-block', background: theme.colors.primary, borderRadius: 44, padding: '10px 60px',
            fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 190, color: theme.colors.surface, lineHeight: 1.15}}>Day 2</div>
        </Pop>
      </div>
      <div style={{position: 'absolute', right: 130, top: 270, width: 760, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18}}>
        {Array.from({length: 30}).map((_, i) => (
          <Pop key={i} delay={4 + i * 2} preset="snappy" from={0.4} y={14}>
            <div style={{height: 100, borderRadius: 26, background: i < 2 ? theme.colors.accent : theme.colors.surface,
              border: `2px solid ${i < 2 ? theme.colors.accent : theme.colors.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 40, color: i < 2 ? theme.colors.text : theme.colors.textDim}}>{toBn(i + 1)}</div>
          </Pop>
        ))}
      </div>
    </>
  );
};

// Beat 4: kinetic "let's start"
const Beat4: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <WordReveal text="চলুন শুরু করি!" per={5} size={190} hi={[2]} gapX={40}/>
  </AbsoluteFill>
);

export const HookScene: React.FC = () => {
  const {b2, b3, b4, dur} = hook;
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={b2}><Beat><Beat1/></Beat></Sequence>
      <Sequence from={b2} durationInFrames={b3 - b2}><Beat><Beat2/></Beat></Sequence>
      <Sequence from={b3} durationInFrames={b4 - b3}><Beat><Beat3/></Beat></Sequence>
      <Sequence from={b4} durationInFrames={dur - b4}><Beat4/></Sequence>
    </AbsoluteFill>
  );
};

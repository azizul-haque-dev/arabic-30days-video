import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {Pop, WordReveal, SceneShell, Sweep, toBn} from '../primitives';
import {Icon} from '../icons';
import {PHRASES} from '../content';
import {ctaScene} from '../timeline';

export const RecapScene: React.FC = () => (
  <SceneShell>
    <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <WordReveal text="আজ শিখলেন ১০টি বাক্য" per={5} size={92} hi={[2]} />
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 250, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 26}}>
      {PHRASES.map((p, i) => (
        <Pop key={p.n} delay={14 + i * 4} preset="snappy" from={0.8} y={30}>
          <div style={{height: 330, borderRadius: 38, background: theme.colors.surface, border: `2px solid ${theme.colors.line}`, padding: 22,
            boxShadow: `0 24px 50px -26px ${theme.colors.shadow}44`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 40, color: theme.colors.textDim}}>{toBn(String(p.n).padStart(2, '0'))}</div>
              <Icon name={p.icon} size={74} color={theme.colors.accent} soft={theme.colors.accentSoft}/>
            </div>
            <div style={{fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: p.ar.length > 24 ? 33 : 38, lineHeight: 1.3, color: theme.colors.text}}>{p.ar}</div>
          </div>
        </Pop>
      ))}
    </div>
  </SceneShell>
);

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {commentF, byeF} = ctaScene;
  return (
    <SceneShell>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44}}>
          <WordReveal text="প্রতিদিন এমন সহজ আরবি শিখতে" per={5} size={72} color={theme.colors.textDim} />
          <Pop delay={10} preset="bouncy" from={0.7}>
            <div style={{background: theme.colors.text, color: theme.colors.surface, borderRadius: 80, padding: '22px 70px',
              fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 80}}>পেজটি ফলো করুন</div>
          </Pop>
          <div style={{height: 150, display: 'flex', alignItems: 'center'}}>
            {frame >= commentF && (
              <Pop delay={commentF} preset="bouncy" from={0.6}>
                <div style={{background: theme.colors.primary, borderRadius: 40, padding: '8px 64px', fontFamily: theme.fonts.display,
                  fontWeight: theme.weight.title, fontSize: 130, color: theme.colors.surface, lineHeight: 1.3}}>DAY 2 DONE!</div>
              </Pop>
            )}
          </div>
          <div style={{height: 100}}>
            {frame >= byeF && (
              <WordReveal text="দেখা হবে পরের লেসনে, ইনশাআল্লাহ।" per={5} size={64} color={theme.colors.text} />
            )}
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

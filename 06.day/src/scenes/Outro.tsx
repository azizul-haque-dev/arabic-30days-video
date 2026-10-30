import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {anchors, local, planOf} from '../timing';
import {sentences} from '../data/content';
import {SceneShell} from '../components/SceneShell';
import {Sfx} from '../components/Sfx';
import {Icon} from '../components/Icons';
import {cardStyle, clamp, Counter, Medallion, Pill, Reveal, toBn, useBreathe, useEnter, useFloat, WordStagger} from '../components/primitives';

const c = theme.colors;
const dur = (id: Parameters<typeof planOf>[0]) => planOf(id).to - planOf(id).from;

// ───────── সমাপ্তি: Checklist Recap Grid ─────────
export const RecapScene: React.FC = () => {
  const id = 'recap';
  const f = useCurrentFrame();
  const t0 = local(id, anchors.aRecap);
  const bar = interpolate(f, [t0 + 22, t0 + 70], [0, 1], {easing: theme.easings.inOut, ...clamp});
  return (
    <SceneShell dur={dur(id)}>
      <Sfx at={t0 + 2} name="pop" />
      <Sfx at={t0 + 74} name="chime" />
      <div style={{position: 'absolute', top: 118, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <WordStagger text="আজকের ১০টি বাক্য" start={t0 + 2} size={84} hi={[2]} hiStart={t0 + 22} />
      </div>
      <div style={{position: 'absolute', left: 71, top: 300, width: 938, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22}}>
        {sentences.map((s, i) => {
          const tin = t0 + 10 + i * 3;
          const tick = t0 + 28 + i * 5;
          const tp = useEnter(tin, theme.springs.pop);
          const kp = useEnter(tick, theme.springs.pop);
          return (
            <div key={i} style={{...cardStyle, borderRadius: 36, height: 218, boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: Math.min(1, tp * 1.8), transform: `translateY(${(1 - tp) * 40}px) scale(${0.85 + 0.15 * tp})`}}>
              <div style={{width: 120, height: 120}}><Icon name={s.icon} /></div>
              <div style={{fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 30, color: c.muted}}>{String(s.n).padStart(2, '0')}</div>
              <div style={{position: 'absolute', top: -14, right: -10, width: 52, height: 52, transform: `scale(${kp})`}}>
                <div style={{width: '100%', height: '100%', borderRadius: '50%', background: c.hero, border: `5px solid ${c.white}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="26" height="26" viewBox="0 0 26 26"><path d="M5 13.5 L11 19 L21 7" fill="none" stroke={c.white} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Reveal start={t0 + 20} y={30} style={{position: 'absolute', left: 190, top: 800, width: 700}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{flex: 1, height: 26, borderRadius: 26, background: c.heroSoft, overflow: 'hidden'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 26, background: `linear-gradient(90deg, ${c.hero}, ${c.accent})`}} />
          </div>
          <span style={{fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 52, color: c.text, lineHeight: 1}}>
            <Counter to={10} start={t0 + 22} dur={48} />/{toBn(10)}
          </span>
        </div>
      </Reveal>
    </SceneShell>
  );
};

// ───────── প্রশ্ন: Statement Card ─────────
export const QuestionScene: React.FC = () => {
  const id = 'question';
  const t0 = local(id, anchors.aQuestion);
  const t1 = local(id, anchors.aComment);
  const fl = useFloat(3.2, 10);
  const small = [
    {n: 'plate' as const, x: 90, y: 112, p: 0}, {n: 'tea' as const, x: 880, y: 112, p: 1.4},
    {n: 'sandwich' as const, x: 90, y: 830, p: 2.6}, {n: 'water' as const, x: 880, y: 830, p: 3.8},
  ];
  return (
    <SceneShell dur={dur(id)}>
      <Sfx at={t0 + 2} name="pop" />
      <Sfx at={t1 + 2} name="click" />
      {small.map((s, i) => (
        <Reveal key={i} start={t0 + 8 + i * 4} cfg={theme.springs.pop} from={0.4} style={{position: 'absolute', left: s.x, top: s.y}}>
          <div style={{width: 110, height: 110, transform: `translateY(${Math.sin(fl / 10 + s.p) * 10}px) rotate(${i % 2 ? 8 : -8}deg)`, opacity: 0.95}}><Icon name={s.n} /></div>
        </Reveal>
      ))}
      <Medallion size={190} start={t0} style={{position: 'absolute', left: 445, top: 96}}>
        <Icon name="bubble" />
      </Medallion>
      <Reveal start={t0 + 2} y={60} from={0.94} style={{position: 'absolute', left: 90, top: 250, width: 900}}>
        <div style={{...cardStyle, padding: '60px 50px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center'}}>
          <WordStagger text="আপনার সবচেয়ে কাজে লাগবে কোন বাক্যটি?" start={t0 + 8} size={84} maxWidth={780} hi={[4, 5]} hiStart={t0 + 34} lineHeight={1.3} />
        </div>
      </Reveal>
      <Reveal start={t1} y={40} cfg={theme.springs.pop} style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
        <Pill bg={c.hero} color={c.white} size={62} style={{boxShadow: theme.shadow.pop}}>কমেন্টে জানান</Pill>
      </Reveal>
    </SceneShell>
  );
};

// ───────── বিরতি: Minimal + ডেইলি-ডট ─────────
export const LearnScene: React.FC = () => {
  const id = 'learn';
  const f = useCurrentFrame();
  const t0 = local(id, anchors.aLearn);
  const t1 = local(id, anchors.aEveryday);
  const fillStart = t1 + 2;
  return (
    <SceneShell dur={dur(id)}>
      <Sfx at={t0 + 2} name="pop" />
      <Sfx at={t1 + 2} name="pop" rate={1.1} volume={0.24} />
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
        <WordStagger text="আরবি শিখুন সহজভাবে" start={t0} size={74} />
        <WordStagger text="প্রতিদিন অল্প অল্প করে" start={t1} size={74} color={c.heroDeep} hi={[1, 2]} hiStart={t1 + 14} />
      </div>
      <div style={{position: 'absolute', left: 228, top: 420, width: 624, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24}}>
        {Array.from({length: 30}).map((_, i) => {
          const p = interpolate(f, [t0 + 4 + i * 0.8, t0 + 14 + i * 0.8], [0, 1], {easing: theme.easings.out, ...clamp});
          const fill = interpolate(f, [fillStart + i * 1.3, fillStart + i * 1.3 + 8], [0, 1], {easing: theme.easings.out, ...clamp});
          const six = i === 5;
          return (
            <div key={i} style={{aspectRatio: '1', borderRadius: '50%', opacity: p, transform: `scale(${(0.5 + 0.5 * p) * (1 + 0.18 * fill * (1 - fill) * 4)})`,
              background: six ? c.accent : fill > 0.5 ? c.hero : c.heroSoft}} />
          );
        })}
      </div>
    </SceneShell>
  );
};

// ───────── CTA: Glossy UI (ফলো + কমেন্ট) ─────────
export const CtaScene: React.FC = () => {
  const id = 'cta';
  const f = useCurrentFrame();
  const t0 = local(id, anchors.aCta);
  const tF = local(id, anchors.aFollow);
  const tW = local(id, anchors.aWrite);
  const tD = local(id, anchors.aDone);
  const press = interpolate(f, [tF + 8, tF + 12, tF + 18], [1, 0.94, 1], clamp);
  const done = f >= tF + 12;
  const text = 'DAY 6 DONE!';
  const typed = Math.round(interpolate(f, [tW + 6, tD], [0, text.length], clamp));
  const caret = Math.floor(f / 8) % 2 === 0;
  const sendP = useEnter(tD + 2, theme.springs.pop);
  return (
    <SceneShell dur={dur(id)}>
      <Sfx at={t0 + 2} name="pop" />
      <Sfx at={tF + 10} name="click" />
      <Sfx at={tW + 2} name="pop" rate={1.08} volume={0.24} />
      <Sfx at={tD + 2} name="chime" />
      <div style={{position: 'absolute', top: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <WordStagger text="প্রতিদিনের লেসন পেতে" start={t0} size={68} />
      </div>
      <Reveal start={tF - 4} y={50} cfg={theme.springs.pop} style={{position: 'absolute', left: 140, top: 250, width: 800}}>
        <div style={{...cardStyle, padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 28, boxSizing: 'border-box'}}>
          <div style={{width: 124, height: 124, flexShrink: 0}}><Icon name="speaker" /></div>
          <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
            <div style={{transform: `scale(${press})`}}>
              <Pill bg={done ? c.heroDeep : c.hero} color={c.white} size={56} style={{boxShadow: theme.shadow.pop}}>
                {done ? '✓' : '+'} <span>ফলো করুন</span>
              </Pill>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal start={tW - 4} y={30} style={{position: 'absolute', left: 140, top: 500}}>
        <WordStagger text="কমেন্টে লিখুন:" start={tW} size={54} color={c.muted} align="left" />
      </Reveal>
      <Reveal start={tW + 2} y={50} cfg={theme.springs.pop} style={{position: 'absolute', left: 90, top: 600, width: 900}}>
        <div style={{...cardStyle, padding: '34px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, boxSizing: 'border-box'}}>
          <div style={{fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 96, color: c.text, letterSpacing: 0, lineHeight: 1.1, minHeight: 106, display: 'flex', alignItems: 'center'}}>
            <span>{text.slice(0, typed)}</span>
            <span style={{display: 'inline-block', width: 6, height: 86, marginLeft: 6, background: c.hero, opacity: caret ? 1 : 0}} />
          </div>
          <div style={{width: 104, height: 104, borderRadius: '50%', background: c.hero, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${1 + 0.08 * sendP})`}}>
            <svg width="52" height="52" viewBox="0 0 52 52"><path d="M8 26 L44 10 L32 44 L25 29 Z" fill={c.white} /></svg>
          </div>
        </div>
      </Reveal>
    </SceneShell>
  );
};

// ───────── শেষ কার্ড ─────────
export const EndScene: React.FC = () => {
  const id = 'end';
  const f = useCurrentFrame();
  const t0 = local(id, anchors.aSeeYou);
  const tI = local(id, anchors.aInsha);
  const disc = useEnter(0, theme.springs.slow);
  const br = useBreathe(2.8, 0.02);
  const roll = interpolate(f, [t0 + 14, t0 + 26], [0, 1], {easing: theme.easings.out, ...clamp});
  return (
    <SceneShell dur={dur(id)} noExit>
      <Sfx at={t0 + 2} name="pop" />
      <Sfx at={tI} name="chime" />
      <div style={{position: 'absolute', left: 540 - 400, top: 540 - 400, width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle at 35% 28%, ${c.hero}, ${c.heroDeep})`, transform: `scale(${disc * br})`, boxShadow: theme.shadow.pop}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4}}>
        <WordStagger text="দেখা হবে" start={t0} size={92} color={c.white} />
        <div style={{display: 'flex', alignItems: 'center', gap: 18, height: 210}}>
          <Reveal start={t0 + 8} cfg={theme.springs.pop}><span style={{display: 'block', fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 190, color: c.white, lineHeight: '210px'}}>Day</span></Reveal>
          <div style={{position: 'relative', width: 125, height: 210, overflow: 'hidden'}}>
            <span style={{position: 'absolute', left: 0, top: -roll * 210, fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 190, color: c.white, lineHeight: '210px'}}>6</span>
            <span style={{position: 'absolute', left: 0, top: 210 - roll * 210, fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 190, color: c.accent, lineHeight: '210px'}}>7</span>
          </div>
          <Reveal start={t0 + 10} cfg={theme.springs.pop}><span style={{display: 'block', fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 90, color: c.white, lineHeight: '210px'}}>-এ</span></Reveal>
        </div>
        <Reveal start={tI} y={30} cfg={theme.springs.pop} from={0.6} style={{marginTop: 24}}>
          <Pill bg={c.accent} color={c.text} size={62}>ইনশাআল্লাহ!</Pill>
        </Reveal>
      </div>
    </SceneShell>
  );
};

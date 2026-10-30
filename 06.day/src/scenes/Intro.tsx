import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {anchors, local, planOf} from '../timing';
import {SceneShell} from '../components/SceneShell';
import {Sfx} from '../components/Sfx';
import {Icon} from '../components/Icons';
import {cardStyle, clamp, Counter, Medallion, Pill, Reveal, useBreathe, useEnter, WordStagger} from '../components/primitives';

const c = theme.colors;
const dur = (id: Parameters<typeof planOf>[0]) => planOf(id).to - planOf(id).from;

// ───────── হুক: Kinetic Typography + ৩০-দিনের ডট গ্রিড ─────────
export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const tTitle = local('hook', anchors.aTitle1);
  const tSurv = local('hook', anchors.aSurvival);
  const tDay = local('hook', anchors.aDaySix);
  const hi = useEnter(2, theme.springs.pop);
  const dayPop = useEnter(tDay, theme.springs.pop);
  const br = useBreathe(2.6, 0.03);

  return (
    <SceneShell dur={dur('hook')}>
      <Sfx at={tTitle + 2} name="thud" />
      <Sfx at={tSurv + 2} name="pop" rate={1.05} />
      <Sfx at={tDay + 2} name="chime" />
      <Reveal start={2} from={0.5} cfg={theme.springs.pop} y={20} style={{position: 'absolute', left: 70, top: 64}}>
        <Pill bg={c.accent} color={c.text} size={52} style={{transform: `rotate(${-4 + hi * 0}deg)`}}>Hi!</Pill>
      </Reveal>

      <div style={{position: 'absolute', top: 176, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 28, lineHeight: 1}}>
          <Reveal start={tTitle} cfg={theme.springs.pop} y={50} from={0.7}>
            <span style={{fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 214, color: c.hero, letterSpacing: 0}}><Counter to={30} start={tTitle} dur={22} /></span>
          </Reveal>
          <WordStagger text="দিনে" start={tTitle + 6} size={110} color={c.text} />
        </div>
        <div style={{marginTop: 6}}>
          <WordStagger text="Survival Arabic" start={tSurv} size={118} color={c.text} stagger={6} hi={[1]} hiStart={tSurv + 16} />
        </div>
        <Reveal start={tDay} cfg={theme.springs.pop} from={0.5} y={30} style={{marginTop: 16}}>
          <Pill bg={c.hero} color={c.white} size={64} style={{transform: `scale(${br * dayPop})`, boxShadow: theme.shadow.pop}}>
            <span>Day</span>
            <span style={{background: c.accent, color: c.text, borderRadius: 999, padding: '0 22px'}}>6</span>
          </Pill>
        </Reveal>
      </div>

      {/* ৩০টি ডট: প্রতিটি একটি দিন; ষষ্ঠটি = Day 6 */}
      <div style={{position: 'absolute', left: 116, top: 722, width: 848, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 30}}>
        {Array.from({length: 30}).map((_, i) => {
          const p = interpolate(f, [tTitle + 4 + i * 1.5, tTitle + 4 + i * 1.5 + 10], [0, 1], {easing: theme.easings.out, ...clamp});
          const lit = i < 5 ? interpolate(f, [tDay - 14 + i * 3, tDay - 8 + i * 3], [0, 1], clamp) : 0;
          const six = i === 5;
          const sp = six ? dayPop : 0;
          return (
            <div key={i} style={{aspectRatio: '1', borderRadius: '50%', opacity: p, transform: `scale(${(0.5 + 0.5 * p) * (six ? 1 + 0.28 * sp : 1)})`,
              background: six && sp > 0.05 ? c.accent : lit > 0.5 ? c.hero : c.heroSoft,
              boxShadow: six && sp > 0.05 ? `0 0 0 8px ${c.accentSoft}` : 'none'}} />
          );
        })}
      </div>
    </SceneShell>
  );
};

// ───────── ওভারভিউ: Bento Grid ─────────
const Tile: React.FC<{start: number; w: number; h: number; bg?: string; children: React.ReactNode}> = ({start, w, h, bg, children}) => (
  <Reveal start={start} y={50} from={0.88} cfg={theme.springs.pop} style={{width: w}}>
    <div style={{...cardStyle, borderRadius: theme.radius.tile, height: h, background: bg ?? c.glass, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 24, overflow: 'hidden', boxSizing: 'border-box'}}>{children}</div>
  </Reveal>
);

export const OverviewScene: React.FC = () => {
  const id = 'overview';
  const tG = local(id, anchors.aGulf);
  const tD = local(id, anchors.aDaily);
  const tH = local(id, anchors.aHome);
  const tF = local(id, anchors.aFood);
  const tT = local(id, anchors.aTen);
  const label = (text: string, start: number, size = 52, color: string = c.text) => <WordStagger text={text} start={start + 5} size={size} align="left" color={color} lineHeight={1.2} />;
  return (
    <SceneShell dur={dur(id)}>
      <Sfx at={tG + 2} name="pop" />
      <Sfx at={tD + 2} name="pop" rate={1.06} volume={0.24} />
      <Sfx at={tT + 2} name="chime" />
      <div style={{position: 'absolute', left: 70, top: 112, width: 940, display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{display: 'flex', gap: 22}}>
          <Tile start={tG} w={560} h={300}>
            <div style={{width: 170, height: 170, flexShrink: 0}}><Icon name="skyline" /></div>
            {label('Gulf দেশগুলো', tG, 56)}
          </Tile>
          <Tile start={tD} w={358} h={300} bg={c.heroTint}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <div style={{width: 120, height: 120}}><Icon name="sun" /></div>
              {label('দৈনন্দিন জীবন', tD, 48)}
            </div>
          </Tile>
        </div>
        <div style={{display: 'flex', gap: 22}}>
          <Tile start={tH} w={358} h={300} bg={c.accentSoft}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <div style={{width: 120, height: 120}}><Icon name="house" /></div>
              {label('ঘরবাড়ি', tH, 52)}
            </div>
          </Tile>
          <Tile start={tF} w={560} h={300}>
            <div style={{width: 170, height: 170, flexShrink: 0}}><Icon name="plate" /></div>
            {label('খাবারদাবার', tF, 56)}
          </Tile>
        </div>
        <Tile start={tT} w={940} h={220} bg={c.hero}>
          <span style={{fontFamily: theme.fonts.family, fontWeight: 700, fontSize: 150, color: c.white, lineHeight: 1}}>
            <Counter to={10} start={tT} dur={18} />টি
          </span>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <WordStagger text="সহজ আরবি" start={tT + 6} size={58} color={c.white} align="left" lineHeight={1.15} />
            <WordStagger text="বাক্য" start={tT + 14} size={58} color={c.white} align="left" lineHeight={1.15} />
          </div>
        </Tile>
      </div>
    </SceneShell>
  );
};

// ───────── কীভাবে হবে: Timeline Process Flow ─────────
export const HowScene: React.FC = () => {
  const id = 'how';
  const f = useCurrentFrame();
  const t1 = local(id, anchors.aHow);
  const t2 = local(id, anchors.aTwice);
  const t3 = local(id, anchors.aListen);
  const t4 = local(id, anchors.aLetsGo);
  const rail = interpolate(f, [t1, t3 + 16], [0, 1], {easing: theme.easings.inOut, ...clamp});
  const rows = [
    {t: t1, icon: 'speaker' as const, text: 'প্রতিটি বাক্যের উচ্চারণ', y: 120},
    {t: t2, icon: 'bubble' as const, text: 'দুইবার করে', y: 326},
    {t: t3, icon: 'mic' as const, text: 'শুনে শুনে প্র্যাকটিস', y: 532},
  ];
  const go = useEnter(t4, theme.springs.pop);
  const br = useBreathe(2.4, 0.025);
  return (
    <SceneShell dur={dur(id)}>
      <Sfx at={t1 + 2} name="pop" />
      <Sfx at={t2 + 2} name="pop" rate={1.08} />
      <Sfx at={t3 + 2} name="pop" rate={1.14} />
      <Sfx at={t4 + 2} name="chime" />
      <div style={{position: 'absolute', left: 140, top: 160, width: 10, height: 540, borderRadius: 10, background: c.heroSoft}} />
      <div style={{position: 'absolute', left: 140, top: 160, width: 10, height: 540 * rail, borderRadius: 10, background: c.hero}} />
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <Reveal start={r.t} cfg={theme.springs.pop} from={0.3} style={{position: 'absolute', left: 119, top: r.y + 66}}>
            <div style={{width: 52, height: 52, borderRadius: '50%', background: c.hero, border: `9px solid ${c.white}`, boxShadow: theme.shadow.soft, boxSizing: 'border-box'}} />
          </Reveal>
          <Reveal start={r.t + 2} x={60} y={0} from={0.96} style={{position: 'absolute', left: 230, top: r.y, width: 780}}>
            <div style={{...cardStyle, height: 172, display: 'flex', alignItems: 'center', gap: 28, padding: '0 36px', boxSizing: 'border-box'}}>
              <div style={{width: 112, height: 112, flexShrink: 0}}><Icon name={r.icon} /></div>
              <WordStagger text={r.text} start={r.t + 8} size={54} align="left" maxWidth={560} lineHeight={1.2} />
            </div>
          </Reveal>
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center', opacity: Math.min(1, go * 1.6), transform: `translateY(${(1 - go) * 40}px) scale(${(0.8 + 0.2 * go) * br})`}}>
        <Pill bg={c.accent} color={c.text} size={76} style={{boxShadow: theme.shadow.soft}}>চলুন শুরু করি!</Pill>
      </div>
    </SceneShell>
  );
};

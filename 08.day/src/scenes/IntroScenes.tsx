import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {bn, theme, withAlpha} from "../theme";
import {M, rel} from "../timing";
import {Counter, Pop, Sfx, Sweep, TopBar, WordStagger, useOut} from "../components/ui";
import {BubbleDots, CheckMark, ICONS, Pin} from "../components/icons";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const fill = {position: "absolute", inset: 0} as const;

// ───────────────────────── 1. HOOK — Kinetic Typography ─────────────────────────
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const R = (s: number) => rel("hook", s);
  const tBut = R(M.but.t);
  const tRelax = R(M.relax.t);
  const iconP = spring({frame: frame - 2, fps: 30, config: theme.spring.bouncy});
  const pinOut = interpolate(frame, [tBut - 2, tBut + 7], [1, 0], clamp);
  const bubbleIn = interpolate(frame, [tBut + 2, tBut + 12], [0, 1], clamp);
  const done = frame >= tRelax ? 1 : 0;
  const pulse = frame >= tRelax ? 1 + Math.max(0, Math.sin((frame - tRelax) / 5)) * 0.04 * Math.exp(-(frame - tRelax) / 25) : 1;
  const bob = Math.sin(frame / 18) * 6;
  return (
    <div style={fill}>
      <TopBar />
      <div style={{position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", transform: `translateY(${bob}px) scale(${interpolate(iconP, [0, 1], [0.5, 1]) * pulse})`, opacity: Math.min(1, iconP)}}>
        <div style={{position: "relative", width: 380, height: 380}}>
          <div style={{position: "absolute", inset: 0, opacity: pinOut}}><Pin size={380} t={frame} /></div>
          <div style={{position: "absolute", inset: 0, opacity: bubbleIn}}><BubbleDots size={380} t={frame} done={done} /></div>
        </div>
      </div>
      <div style={{position: "absolute", left: 70, right: 70, top: 560, height: 420}}>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <WordStagger text="আরব দেশে থাকেন" delay={R(0.6) + 0} size={118} per={5} exitAt={tBut - 4} />
        </div>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <WordStagger text="আরবি বলতে গিয়ে আটকে যান?" delay={tBut} size={96} per={4} hi={[3, 4]} hiColor={theme.colors.accent} exitAt={tRelax - 4} gap={22} />
        </div>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Pop delay={tRelax} preset="bouncy" from={0.6} dist={30}>
            <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 190, lineHeight: 1.2, color: theme.colors.primary, letterSpacing: 0, textShadow: `0 18px 50px ${theme.colors.glow}`}}>চিন্তা নেই!</div>
          </Pop>
        </div>
      </div>
      <Sfx name="whoosh" at={R(0.6) - 1} vol={0.22} />
      <Sfx name="thud" at={tRelax} vol={0.26} />
    </div>
  );
};

// ───────────────────────── 2. BRAND — Statement + wordmark card ─────────────────────────
export const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const R = (s: number) => rel("brand", s);
  const tBrand = R(M.brand.t);
  const breathe = 1 + Math.sin(frame / 24) * 0.012;
  return (
    <div style={fill}>
      <TopBar />
      <div style={{position: "absolute", left: 70, right: 70, top: 200}}>
        <WordStagger text="আপনার প্রতিদিনের আরবি শেখার সঙ্গী" size={84} per={4} delay={0} hi={[3, 4]} />
      </div>
      <div style={{position: "absolute", left: 70, right: 70, top: 560, display: "flex", justifyContent: "center"}}>
        <Pop delay={tBrand} preset="bouncy" from={0.7} dist={50}>
          <div style={{transform: `scale(${breathe})`, background: theme.colors.surface, borderRadius: 56, padding: "44px 64px", boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, textAlign: "center"}}>
            <div style={{fontFamily: theme.fonts.ar, fontWeight: 900, fontSize: 124, lineHeight: 1.25, color: theme.colors.text, letterSpacing: 0}}>
              Arabic <Sweep delay={tBrand + 10} dur={18} style={{padding: "0 6px"}}>Master</Sweep>
            </div>
          </div>
        </Pop>
      </div>
      {[[130, 880, 46, 0], [900, 470, 30, 14], [960, 900, 64, 28]].map(([x, y, r, o], i) => (
        <Pop key={i} delay={tBrand + 6 + i * 4} preset="snappy" style={{position: "absolute", left: x, top: y + Math.sin((frame + o) / 20) * 8}}>
          <div style={{width: r, height: r, borderRadius: "50%", background: i === 1 ? withAlpha(theme.colors.accent, 0.8) : theme.colors.mintDeep}} />
        </Pop>
      ))}
      <Sfx name="chime" at={tBrand} />
    </div>
  );
};

// ───────────────────────── 3. 30 DAYS — Checklist / Timeline grid ─────────────────────────
export const Days30Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const R = (s: number) => rel("days30", s);
  const tDay8 = Math.max(R(M.day8.t), 50);
  const checkStart = Math.max(18, tDay8 - 7 * 4 - 6);
  const size = 112, gap = 18;
  return (
    <div style={fill}>
      <TopBar />
      <div style={{position: "absolute", left: 70, right: 70, top: 130}}>
        <WordStagger text="৩০ দিনের Survival Arabic Series" size={68} per={4} hi={[2, 3]} />
      </div>
      <div style={{position: "absolute", left: (1080 - (6 * size + 5 * gap)) / 2, top: 330, display: "grid", gridTemplateColumns: `repeat(6, ${size}px)`, gap}}>
        {Array.from({length: 30}).map((_, i) => {
          const d = i + 1;
          const p = spring({frame: frame - 10 - i * 1.4, fps, config: theme.spring.snappy});
          const isDone = d <= 7;
          const doneP = isDone ? spring({frame: frame - checkStart - (d - 1) * 4, fps, config: theme.spring.bouncy}) : 0;
          const isToday = d === 8;
          const todayP = isToday ? spring({frame: frame - tDay8, fps, config: theme.spring.bouncy}) : 0;
          const bg = isToday ? withAlpha(theme.colors.accent, todayP) : isDone ? withAlpha(theme.colors.primary, doneP) : theme.colors.surface;
          const ink = isToday && todayP > 0.5 ? theme.colors.text : isDone && doneP > 0.5 ? theme.colors.onPrimary : withAlpha(theme.colors.text, 0.55);
          return (
            <div key={i} style={{width: size, height: size, borderRadius: "50%", background: bg, border: `3px solid ${isToday && todayP > 0.3 ? theme.colors.accent : theme.colors.line}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, p), transform: `scale(${interpolate(p, [0, 1], [0.5, 1]) * (isToday ? 1 + todayP * 0.12 + Math.max(0, Math.sin(frame / 6)) * 0.03 * todayP : 1)})`, boxShadow: isToday && todayP > 0.3 ? `0 0 0 ${10 * todayP}px ${withAlpha(theme.colors.accent, 0.25)}` : undefined}}>
              {isDone && doneP > 0.4 ? <CheckMark size={52} /> : <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 44, color: ink}}>{bn(d)}</span>}
            </div>
          );
        })}
      </div>
      <Pop delay={tDay8 + 2} dir="down" preset="bouncy" style={{position: "absolute", left: 0, right: 0, top: 1000 - 6, display: "flex", justifyContent: "center"}}>
        <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 40, color: theme.colors.text, background: withAlpha(theme.colors.accent, 0.35), padding: "2px 30px", borderRadius: 999}}>আজ অষ্টম দিন</div>
      </Pop>
      <Sfx name="click" at={checkStart} vol={0.3} />
      <Sfx name="pop" at={tDay8} rate={1.08} />
    </div>
  );
};

// ───────────────────────── 4. PROGRESS — Data Dashboard (ring) ─────────────────────────
export const ProgressScene: React.FC = () => {
  const frame = useCurrentFrame();
  const R = (s: number) => rel("progress", s);
  const t300 = R(M.total300.t);
  const t70 = Math.max(R(M.learned70.t), t300 + 12);
  const ringP = interpolate(frame, [t70, t70 + 34], [0, 70 / 300], {easing: theme.ease.out, ...clamp});
  const D = 560, sw = 44, r = (D - sw) / 2, C = 2 * Math.PI * r;
  const breathe = 1 + Math.sin(frame / 26) * 0.01;
  return (
    <div style={fill}>
      <TopBar />
      <Pop delay={0} dir="down" preset="bouncy" style={{position: "absolute", left: 0, right: 0, top: 140, display: "flex", justifyContent: "center"}}>
        <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 56, color: theme.colors.text, background: withAlpha(theme.colors.accent, 0.35), padding: "2px 38px", borderRadius: 999}}>আলহামদুলিল্লাহ</div>
      </Pop>
      <Pop delay={R(M.alhamdu.t) + 8} preset="bouncy" from={0.8} style={{position: "absolute", left: (1080 - D) / 2, top: 270, width: D, height: D, transform: `scale(${breathe})`}}>
        <div style={{position: "relative", width: D, height: D, background: theme.colors.surface, borderRadius: "50%", boxShadow: theme.shadow.card}}>
          <svg width={D} height={D} style={{position: "absolute", inset: 0}}>
            <circle cx={D / 2} cy={D / 2} r={r} fill="none" stroke={theme.colors.mint} strokeWidth={sw} />
            {ringP > 0.002 && <circle cx={D / 2} cy={D / 2} r={r} fill="none" stroke={theme.colors.primary} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${C * ringP} ${C}`} transform={`rotate(-90 ${D / 2} ${D / 2})`} />}
          </svg>
          <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6}}>
            <Counter from={0} to={70} delay={t70} size={190} dur={34} />
            <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 48, color: theme.colors.textDim}}>শিখেছি</div>
          </div>
        </div>
      </Pop>
      <Pop delay={t300} dir="up" style={{position: "absolute", left: 70, right: 70, top: 880, display: "flex", justifyContent: "center"}}>
        <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 60, color: theme.colors.text, textAlign: "center"}}>
          <Sweep delay={t300 + 6}>৩০০টি</Sweep> দরকারি বাক্যের মধ্যে
        </div>
      </Pop>
      <Sfx name="pop" at={R(M.alhamdu.t) + 8} />
      <Sfx name="pop" at={t70} rate={1.06} vol={0.26} />
    </div>
  );
};

// ───────────────────────── 5. TODAY — Bento tiles (71–80) ─────────────────────────
export const TodayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const R = (s: number) => rel("today", s);
  const tRange = R(M.range.t);
  const tJourney = Math.max(R(M.journey.t), tRange + 40);
  const tilesAt = tRange + 6;
  const tw = 160, th = 190, g = 16;
  const sweepIdx = interpolate(frame, [tJourney, tJourney + 40], [0, 9], {easing: theme.ease.inOut, ...clamp});
  return (
    <div style={fill}>
      <TopBar />
      <div style={{position: "absolute", left: 70, right: 70, top: 130}}>
        <WordStagger text="আজ শিখব" size={96} per={5} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", alignItems: "center", gap: 36}}>
        {[{v: 71, w: 0}, {v: 80, w: 2}].map((x, i) => (
          <React.Fragment key={i}>
            {i === 1 && <Pop delay={tRange + 2} preset="snappy"><span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 56, color: theme.colors.textDim}}>থেকে</span></Pop>}
            <Pop delay={tRange + x.w * 6} preset="bouncy" from={0.6}>
              <div style={{background: theme.colors.surface, borderRadius: 36, padding: "10px 46px", boxShadow: theme.shadow.soft, border: `2px solid ${theme.colors.line}`}}>
                <Counter from={71} to={x.v} delay={tRange + 12} size={150} dur={26} color={i === 0 ? theme.colors.text : theme.colors.primary} />
              </div>
            </Pop>
          </React.Fragment>
        ))}
      </div>
      <Pop delay={tRange + 14} style={{position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center"}}>
        <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 52, color: theme.colors.text}}>নম্বর বাক্য</div>
      </Pop>
      <div style={{position: "absolute", left: (1080 - (5 * tw + 4 * g)) / 2, top: 585, display: "grid", gridTemplateColumns: `repeat(5, ${tw}px)`, gap: g}}>
        {Array.from({length: 10}).map((_, i) => {
          const n = 71 + i;
          const Icon = ICONS[n];
          const p = spring({frame: frame - tilesAt - i * 4, fps, config: theme.spring.snappy});
          const on = Math.max(0, 1 - Math.abs(sweepIdx - i));
          return (
            <div key={i} style={{width: tw, height: th, borderRadius: 32, background: theme.colors.surface, border: `3px solid ${on > 0.2 ? theme.colors.accent : theme.colors.line}`, boxShadow: on > 0.2 ? `0 18px 34px -16px ${withAlpha(theme.colors.accent, 0.6)}` : theme.shadow.soft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40 - on * 10}px) scale(${interpolate(p, [0, 1], [0.9, 1]) + on * 0.04})`}}>
              <Icon size={104} t={Math.max(0, frame - tilesAt - i * 4)} />
              <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 46, color: theme.colors.text, lineHeight: 1.2}}>{bn(n)}</span>
            </div>
          );
        })}
      </div>
      <Sfx name="pop" at={tilesAt} />
      <Sfx name="click" at={tJourney} vol={0.28} />
    </div>
  );
};

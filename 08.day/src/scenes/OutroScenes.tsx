import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {bn, theme, withAlpha} from "../theme";
import {M, SENTENCES, rel} from "../timing";
import {Counter, Pop, Sfx, Sweep, TopBar, WordStagger} from "../components/ui";
import {CheckMark} from "../components/icons";

const fill = {position: "absolute", inset: 0} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ───────────────────────── Recap grid ─────────────────────────
export const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const R = (s: number) => rel("recap", s);
  const tTen = R(M.ten.t);
  const gridAt = 14;
  const checkAt = Math.max(gridAt + 40, tTen + 10);
  return (
    <div style={fill}>
      <TopBar />
      <div style={{position: "absolute", left: 70, right: 70, top: 128}}>
        <WordStagger text="১০টি বাক্য শেখা শেষ!" size={78} per={4} hi={[0]} hiColor={theme.colors.primary} />
      </div>
      <div style={{position: "absolute", left: 70, top: 270, width: 940, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        {SENTENCES.map((s, i) => {
          const p = spring({frame: frame - gridAt - i * 3, fps, config: theme.spring.snappy});
          const c = spring({frame: frame - checkAt - i * 3, fps, config: theme.spring.bouncy});
          return (
            <div key={s.n} style={{height: 134, borderRadius: 34, background: theme.colors.surface, boxShadow: theme.shadow.soft, border: `2px solid ${theme.colors.line}`, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`}}>
              <div style={{width: 58, height: 58, flex: "none", borderRadius: "50%", background: theme.colors.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 28, color: theme.colors.text}}>{bn(s.n)}</div>
              <div dir="rtl" style={{flex: 1, fontFamily: theme.fonts.ar, fontWeight: 900, fontSize: 34, lineHeight: 1.35, color: theme.colors.text, textAlign: "center"}}>{s.arabic}</div>
              <div style={{width: 48, height: 48, flex: "none", borderRadius: "50%", background: c > 0.4 ? theme.colors.primary : "transparent", border: c > 0.4 ? "none" : `3px solid ${theme.colors.line}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.7 + Math.min(1.2, c) * 0.3})`}}>
                {c > 0.4 && <CheckMark size={28} />}
              </div>
            </div>
          );
        })}
      </div>
      <Sfx name="pop" at={gridAt} />
      <Sfx name="click" at={checkAt} vol={0.3} />
    </div>
  );
};

// ───────────────────────── Dashboard (70 → 80 of 300) ─────────────────────────
export const DashScene: React.FC = () => {
  const frame = useCurrentFrame();
  const R = (s: number) => rel("dash", s);
  const t80 = Math.max(R(M.eighty.t), 30);
  const tTotal = Math.max(R(M.alh2.t) + 14, 16);
  const barW = 860;
  const base = interpolate(frame, [tTotal, tTotal + 22], [0, 70 / 300], {easing: theme.ease.out, ...clamp});
  const plus = interpolate(frame, [t80, t80 + 22], [0, 10 / 300], {easing: theme.ease.out, ...clamp});
  const breathe = 1 + Math.sin(frame / 22) * 0.012;
  return (
    <div style={fill}>
      <TopBar />
      <Pop delay={0} dir="down" preset="bouncy" style={{position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center"}}>
        <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 56, color: theme.colors.text, background: withAlpha(theme.colors.accent, 0.35), padding: "2px 38px", borderRadius: 999}}>আলহামদুলিল্লাহ</div>
      </Pop>
      <Pop delay={6} preset="bouncy" from={0.8} style={{position: "absolute", left: 70, right: 70, top: 300, transform: `scale(${breathe})`}}>
        <div style={{background: theme.colors.surface, borderRadius: 56, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, padding: "30px 40px 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
          <div style={{display: "flex", alignItems: "baseline", gap: 24}}>
            <Counter from={70} to={80} delay={t80} size={270} dur={24} color={theme.colors.primary} />
          </div>
          <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 52, color: theme.colors.text}}>
            <Sweep delay={tTotal}>৩০০টি</Sweep> বাক্যের মধ্যে
          </div>
        </div>
      </Pop>
      <Pop delay={tTotal - 6} dir="up" style={{position: "absolute", left: (1080 - barW) / 2, top: 770}}>
        <div style={{width: barW, height: 64, borderRadius: 32, background: theme.colors.mint, position: "relative", overflow: "hidden"}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${base * 100}%`, background: theme.colors.primary, borderRadius: 32}} />
          <div style={{position: "absolute", left: `${base * 100}%`, top: 0, bottom: 0, width: `${plus * 100}%`, background: theme.colors.accent}} />
        </div>
        <div style={{display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 36, color: theme.colors.textDim}}>
          <span>{bn(0)}</span><span>{bn(300)}</span>
        </div>
      </Pop>
      <Sfx name="pop" at={6} />
      <Sfx name="click" at={t80} vol={0.3} />
    </div>
  );
};

// ───────────────────────── Social CTA — Glossy UI mockup ─────────────────────────
export const SocialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const R = (s: number) => rel("social", s);
  const tFollow = Math.max(R(M.followWord.t), 40);
  const tComment = Math.max(R(M.comment.t), tFollow + 24);
  const tType = Math.max(R(M.done.t), tComment + 14);
  const label = "DAY 8 DONE!";
  const typed = Math.floor(interpolate(frame, [tType, tType + 22], [0, label.length], clamp));
  const tPost = tType + 28;
  const followed = frame >= tFollow + 6;
  const click = spring({frame: frame - tFollow, fps, config: {damping: 10, stiffness: 220, mass: 0.5}});
  const cx = interpolate(frame, [tFollow - 22, tFollow], [150, 0], {easing: theme.ease.out, ...clamp});
  const cy = interpolate(frame, [tFollow - 22, tFollow], [110, 0], {easing: theme.ease.out, ...clamp});
  const cOut = interpolate(frame, [tFollow + 10, tFollow + 22], [1, 0], clamp);
  const posted = frame >= tPost;
  return (
    <div style={fill}>
      <TopBar />
      <Pop delay={0} dist={60} style={{position: "absolute", left: 70, top: 190, width: 940}}>
        <div style={{background: theme.colors.surface, borderRadius: 52, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, padding: "48px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20}}>
          <div>
            <div style={{fontFamily: theme.fonts.ar, fontWeight: 900, fontSize: 58, lineHeight: 1.25, color: theme.colors.text}}>Arabic Master</div>
            <div style={{fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 30, color: theme.colors.textDim, marginTop: 4}}>৩০ দিনের Survival Arabic Series</div>
          </div>
          <div style={{position: "relative"}}>
            <div style={{transform: `scale(${1 - Math.max(0, click) * 0.06 + (frame >= tFollow ? 0.06 : 0)})`, background: followed ? theme.colors.surface : theme.colors.primary, color: followed ? theme.colors.primary : theme.colors.onPrimary, border: `4px solid ${theme.colors.primary}`, borderRadius: 999, padding: "10px 34px", display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 38, boxShadow: followed ? "none" : theme.shadow.hero, whiteSpace: "nowrap"}}>
              {followed && <CheckMark size={36} color={theme.colors.primary} stroke={4} />}
              {followed ? "ফলো করছেন" : "ফলো করুন"}
            </div>
            <svg width={64} height={64} viewBox="0 0 24 24" style={{position: "absolute", right: 22 - cx, bottom: -34 - cy, opacity: cOut * Math.min(1, frame / 6), transform: `scale(${1 - click * 0.0})`}}>
              <path d="M5 3l14 7-6 2-2 6z" fill={theme.colors.text} stroke={theme.colors.surface} strokeWidth={1.4} strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Pop>
      <Pop delay={tComment} dist={70} preset="smooth" style={{position: "absolute", left: 70, top: 520, width: 940}}>
        <div style={{background: theme.colors.surface, borderRadius: 52, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, padding: "34px 40px", display: "flex", flexDirection: "column", gap: 26}}>
          <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 40, color: theme.colors.text}}>কমেন্ট</div>
          <div style={{display: "flex", alignItems: "center", gap: 20}}>
            <div style={{flex: 1, height: 104, borderRadius: 52, background: theme.colors.bg, border: `3px solid ${typed > 0 && !posted ? theme.colors.primary : theme.colors.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 52, color: theme.colors.text, letterSpacing: 0}}>
              {posted ? "" : typed > 0 ? <>{label.slice(0, typed)}<span style={{display: "inline-block", width: 4, height: 52, background: theme.colors.primary, marginLeft: 4, opacity: frame % 16 < 9 ? 1 : 0}} /></> : <span style={{color: withAlpha(theme.colors.text, 0.4), fontWeight: 600, fontSize: 40}}>কমেন্ট লিখুন…</span>}
            </div>
            <div style={{width: 104, height: 104, borderRadius: "50%", background: theme.colors.primary, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${posted ? 1 - Math.max(0, 0.12 * Math.exp(-(frame - tPost) / 4)) : 1})`}}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={theme.colors.onPrimary} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12L20 4L14 20L11 13Z" /></svg>
            </div>
          </div>
        </div>
      </Pop>
      {posted && (
        <Pop delay={tPost} dir="up" dist={40} preset="bouncy" style={{position: "absolute", left: 70, top: 860, width: 940}}>
          <div style={{display: "flex", justifyContent: "flex-start"}}>
            <div style={{background: theme.colors.mint, borderRadius: "44px 44px 44px 10px", padding: "22px 48px", fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 64, color: theme.colors.text, letterSpacing: 0}}>{label}</div>
          </div>
        </Pop>
      )}
      <Sfx name="click" at={tFollow} />
      <Sfx name="pop" at={tComment} vol={0.26} rate={1.06} />
      <Sfx name="click" at={tPost} vol={0.3} rate={0.94} />
      <Sfx name="pop" at={tPost + 2} vol={0.26} rate={0.94} />
    </div>
  );
};

// ───────────────────────── Closing — Day 9 teaser ─────────────────────────
export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const R = (s: number) => rel("closing", s);
  const tDay = Math.max(R(M.day9.t), 22);
  const tInsha = Math.max(R(M.insha.t), tDay + 14);
  const roll = spring({frame: frame - tDay, fps, config: theme.spring.smooth});
  const bigStyle: React.CSSProperties = {fontFamily: theme.fonts.ar, fontWeight: 900, fontSize: 300, lineHeight: 1.3, color: theme.colors.text, letterSpacing: 0};
  const breathe = 1 + Math.sin(frame / 24) * 0.012;
  return (
    <div style={fill}>
      <TopBar label="Day 8" />
      <div style={{position: "absolute", left: 70, right: 70, top: 190}}>
        <WordStagger text="দেখা হবে" size={92} per={5} color={theme.colors.textDim} />
      </div>
      <Pop delay={10} preset="bouncy" from={0.7} style={{position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", transform: `scale(${breathe})`}}>
        <div style={{display: "flex", alignItems: "center", gap: 36, background: theme.colors.surface, borderRadius: 64, padding: "10px 64px", boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`}}>
          <div style={bigStyle}>Day</div>
          <div style={{position: "relative", width: 190, height: 390, overflow: "hidden"}}>
            <div style={{...bigStyle, position: "absolute", left: 0, right: 0, textAlign: "center", top: 0, transform: `translateY(${-roll * 390}px)`, opacity: 1 - roll}}>8</div>
            <div style={{...bigStyle, position: "absolute", left: 0, right: 0, textAlign: "center", top: 0, transform: `translateY(${(1 - roll) * 390}px)`, color: theme.colors.primary}}>9</div>
          </div>
        </div>
      </Pop>
      <Pop delay={tInsha} preset="bouncy" from={0.7} dist={30} style={{position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center"}}>
        <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 108, lineHeight: 1.3, color: theme.colors.text, letterSpacing: 0}}>
          <Sweep delay={tInsha + 6} dur={22}>ইনশাআল্লাহ!</Sweep>
        </div>
      </Pop>
      <Sfx name="whoosh" at={tDay - 2} vol={0.2} />
      <Sfx name="thud" at={tDay + 6} vol={0.22} />
      <Sfx name="chime" at={tInsha} vol={0.26} rate={1.05} />
    </div>
  );
};

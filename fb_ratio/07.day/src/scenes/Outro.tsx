import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Card, Chip, Enter, Sfx, Sweep, Words, clamp } from "../components/primitives";
import { Icon } from "../components/icons";
import { SENTENCES, bn } from "../data/script";
import { T, loc } from "../timeline";
import { theme } from "../theme";

const C = theme.colors;

/* ───────── Recap grid ───────── */
export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 72, right: 72, top: 90 }}><Words text="আজকের ১০টি বাক্য" delay={2} size={84} /></div>
      <div style={{ position: "absolute", left: 72, top: 290, width: 936, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        {SENTENCES.map((s, i) => {
          const tick = interpolate(frame, [58 + i * 3, 64 + i * 3], [0, 1], { ...clamp, easing: theme.ease.out });
          return (
            <Enter key={s.n} delay={14 + i * 3} y={40} s={0.85}>
              <Card style={{ height: 280, borderRadius: 32 }}>
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <Icon n={s.n} p={1} t={0} size={112} />
                  <div style={{ fontSize: 48, fontWeight: theme.font.heavy, color: C.text, lineHeight: 1.3 }}>{bn(s.n)}</div>
                </div>
                <div style={{ position: "absolute", right: 12, top: 12, width: 44, height: 44, borderRadius: 22, background: C.accent, display: "grid", placeItems: "center", transform: `scale(${tick})` }}>
                  <svg width={26} height={26} viewBox="0 0 26 26"><path d="M5 13l5 5 11-12" fill="none" stroke={C.text} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </Card>
            </Enter>
          );
        })}
      </div>
      <Enter delay={90} y={20} style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center" }}>
        <Chip size={52} fill={C.text}>৬১ – ৭০</Chip>
      </Enter>
      <Sfx name="pop" at={14} />
      <Sfx name="click" at={58 + 9 * 3 + 4} />
    </AbsoluteFill>
  );
};

/* ───────── 70 / 300 progress (segment bar) ───────── */
export const Bar70: React.FC = () => {
  const frame = useCurrentFrame();
  const fSot = loc("bar", T.bar.sottor);
  const q = interpolate(frame, [fSot, fSot + 16], [0, 1], { ...clamp, easing: theme.ease.out });
  const num = 60 + Math.round(10 * q);
  const segW = (936 - 29 * 5) / 30;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 72, right: 72, top: 140 }}><Words text="৩০০টি বাক্যের মধ্যে" delay={2} size={70} color={C.textDim} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontSize: 330, fontWeight: theme.font.heavy, lineHeight: 1.2, color: C.primary, transform: `scale(${1 + 0.05 * Math.sin(Math.PI * q)})` }}>{bn(num)}</div>
      <div style={{ position: "absolute", left: 72, top: 700, display: "flex", gap: 5 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const on = i < 6 || (i === 6 && q > 0.4);
          const s = interpolate(frame, [6 + i * 1.5, 14 + i * 1.5], [0, 1], { ...clamp, easing: theme.ease.out });
          return <div key={i} style={{ width: segW, height: 110, borderRadius: 9, background: i === 6 ? (q > 0.4 ? C.accent : C.faint) : on ? C.text : C.faint, transformOrigin: "bottom", transform: `scaleY(${s})` }} />;
        })}
      </div>
      <Enter delay={fSot + 6} y={20} style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <Chip size={52} fill={C.accent} color={C.text}>আজকের ১০টি</Chip>
      </Enter>
      <Sfx name="pop" at={4} />
      <Sfx name="click" at={fSot + 14} />
    </AbsoluteFill>
  );
};

/* ───────── CTA: follow + comment (UI mockup) ───────── */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const fF = loc("cta", T.cta.follow), fC = loc("cta", T.cta.comment), fD = loc("cta", T.cta.done);
  const cardAt = Math.max(30, fF - 22);
  const press = interpolate(frame, [fF + 4, fF + 8, fF + 14], [0, 1, 0], clamp);
  const followed = frame > fF + 8;
  const cx = interpolate(frame, [fF - 14, fF + 4], [900, 800], { ...clamp, easing: theme.ease.out });
  const cy = interpolate(frame, [fF - 14, fF + 4], [700, 440], { ...clamp, easing: theme.ease.out });
  const full = "DAY 7 DONE!";
  const typed = Math.max(0, Math.min(full.length, Math.floor((frame - fD) / 2)));
  const sendAt = fD + full.length * 2 + 4;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 72, right: 72, top: 110 }}><Words text="প্রতিদিন নতুন বাক্য" delay={2} size={88} /></div>
      <Enter delay={cardAt} y={50} style={{ position: "absolute", left: 72, top: 310, width: 936, height: 210 }}>
        <Card style={{ width: 936, height: 210 }}>
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
            <div>
              <div style={{ fontSize: 62, fontWeight: theme.font.heavy, color: C.text, lineHeight: 1.3 }}>Arabic Master</div>
              <div style={{ fontSize: 36, fontWeight: theme.font.mid, color: C.textDim, lineHeight: 1.4 }}>Survival Arabic</div>
            </div>
            <div style={{ padding: "16px 48px", borderRadius: 999, fontSize: 48, fontWeight: theme.font.heavy, lineHeight: 1.3, background: followed ? C.text : C.primary, color: "#FFFFFF", transform: `scale(${1 - 0.07 * press})` }}>{followed ? (<span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>Following<svg width={36} height={36} viewBox="0 0 26 26"><path d="M4 13l6 6 12-13" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg></span>) : "Follow"}</div>
          </div>
        </Card>
      </Enter>
      <Enter delay={fC} y={50} style={{ position: "absolute", left: 72, top: 590, width: 936, height: 350 }}>
        <Card style={{ width: 936, height: 350 }}>
          <div style={{ padding: "30px 44px", display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ fontSize: 40, fontWeight: theme.font.mid, color: C.textDim, lineHeight: 1.3 }}>Comment</div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ flex: 1, height: 120, borderRadius: 60, background: C.bg, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 40px", fontSize: 62, fontWeight: theme.font.heavy, color: C.text, letterSpacing: 0 }}>
                {full.slice(0, typed)}
                <span style={{ display: "inline-block", width: 5, height: 64, marginLeft: 4, background: C.primary, opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.1 }} />
              </div>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: C.accent, display: "grid", placeItems: "center", transform: `scale(${interpolate(frame, [sendAt, sendAt + 8], [0.7, 1], clamp)})`, opacity: frame >= sendAt ? 1 : 0.35 }}>
                <svg width={52} height={52} viewBox="0 0 52 52"><path d="M8 26h34m-14-14l14 14-14 14" fill="none" stroke={C.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>
        </Card>
      </Enter>
      {/* cursor */}
      <svg width={64} height={64} viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, opacity: frame > fF - 16 && frame < fF + 40 ? 1 : 0, transform: `scale(${1 - 0.15 * press})` }}>
        <path d="M5 3l14 8-6 2 4 7-3 1-4-7-5 4z" fill={C.text} stroke="#FFFFFF" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
      <Sfx name="pop" at={cardAt} />
      <Sfx name="click" at={fF + 8} />
      <Sfx name="pop" at={fC} rate={1.04} />
      <Sfx name="click" at={sendAt} rate={0.97} />
    </AbsoluteFill>
  );
};

/* ───────── Outro (Statement Card) ───────── */
export const Outro: React.FC = () => {
  const fD8 = loc("outro", T.outro.day8), fI = loc("outro", T.outro.insha);
  return (
    <AbsoluteFill>
      <Enter delay={0} y={60} style={{ position: "absolute", left: 72, top: 150, width: 936, height: 780 }}>
        <Card style={{ width: 936, height: 780, borderRadius: 64 }}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Words text="দেখা হবে" delay={4} size={112} />
            <div style={{ position: "relative" }}>
              <Words text="Day 8-এ" delay={Math.max(6, fD8)} per={5} size={190} />
              <Sweep delay={Math.max(6, fD8) + 10} dur={14}><div style={{ margin: "-6px auto 0", width: 560, height: 18, borderRadius: 9, background: C.accent }} /></Sweep>
            </div>
            <div style={{ height: 24 }} />
            <Words text="ইনশাআল্লাহ!" delay={Math.max(10, fI)} size={134} color={C.primary} />
          </div>
        </Card>
      </Enter>
      <Sfx name="pop" at={3} />
      <Sfx name="chime" at={Math.max(10, fI)} />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BrandChip, Entrance, Pill, clampI } from "../components/fx";
import { Bus, Plane, Suitcase, Taxi } from "../components/art";
import { f, toBn } from "../data";

const C = theme.colors;
const VW = 1080, VH = 1920;

/* ---------- 0:00 – opening thumbnail card (fully designed from frame 0) ---------- */
export const Opening: React.FC = () => {
  const fr = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = clampI(fr, [durationInFrames - 10, durationInFrames - 1], [0, 1], theme.ease.in);
  const breathe = 1 + Math.sin(fr / 24) * 0.012;
  const planeY = 1010 + Math.sin(fr / 28) * 14, planeX = 600 + Math.sin(fr / 50) * 22;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.6 }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="op-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFEFE4" /><stop offset="1" stopColor="#F4FCF9" /></linearGradient></defs>
        <rect width={VW} height={VH} fill="url(#op-sky)" />
        <circle cx={880} cy={260} r={100} fill={C.accent} opacity={0.9} />
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 480 + fr * 0.9) % 1500) - 200} cy={330 + (i % 3) * 120} rx={140} ry={36} fill="#fff" opacity={0.9} />)}
        <path d="M0 1240 L1080 1190 L1080 1920 L0 1920Z" fill={C.bldA} />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={i * 112 + 10} y={1290 - i * 5} width={94} height={230} rx={8} fill={C.glass} opacity={0.9} />)}
        <path d="M0 1240 L1080 1190 L1080 1222 L0 1274Z" fill={C.primary} />
        <rect y={1650} width={VW} height={270} fill={C.ink2} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={((i * 190 - fr * 7) % 1710 + 1710) % 1710 - 200} y={1800} width={110} height={10} rx={5} fill="#fff" opacity={0.8} />)}
        <text x={820} y={1160} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={260} fill={C.primary} opacity={0.14}>مطار</text>
        <text x={260} y={1560} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={150} fill={C.accent} opacity={0.22}>باص</text>
      </svg>
      <svg viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} style={{ position: "absolute", inset: 0 }}>
        <Plane x={planeX} y={planeY} s={1.75} rot={-9} />
        <Bus x={40 + Math.sin(fr / 40) * 8} y={1760} s={1.15} rot={fr * 8} />
        <Suitcase x={860} y={1790} s={2.1} color={C.accent} rot={Math.sin(fr / 30) * 2} />
        <Suitcase x={980} y={1790} s={1.6} color={C.primaryDeep} />
      </svg>
      <div style={{ position: "absolute", left: 60, top: 60 }}><BrandChip /></div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 190, transform: `scale(${breathe})`, transformOrigin: "left top" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26, fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <span style={{ fontSize: 210, color: C.text, letterSpacing: -5 }}>Day</span>
          <span style={{ fontSize: 290, color: C.primary, letterSpacing: -7, textShadow: `0 12px 0 ${C.primaryDeep}33, 0 0 80px ${C.glow}` }}>15</span>
        </div>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 80, color: C.text, marginTop: 18, lineHeight: 1.25 }}>১০টি জরুরি আরবি বাক্য</div>
        <div style={{ marginTop: 28 }}><Pill bg={C.accent} color={C.ink2} size={44}>বাস ও বিমানবন্দরে যাতায়াত</Pill></div>
        <div style={{ marginTop: 22 }}><Pill bg={C.white} color={C.primaryDeep} size={40} style={{ border: `4px solid ${C.primary}` }}>বাক্য {toBn(141)} – {toBn(150)}</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 24, display: "flex", gap: 6 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 14, borderRadius: 7, background: i < 15 ? C.primary : "rgba(255,255,255,0.35)", opacity: i === 14 ? 0.7 + Math.sin(fr / 6) * 0.3 : 1 }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Strip: React.FC<{ fr: number }> = ({ fr }) => (
  <svg viewBox="0 0 1080 560" width={1080} height={560}>
    <rect y={420} width={1080} height={140} fill={C.ink2} />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={((i * 160 - fr * 8) % 1440 + 1440) % 1440 - 160} y={488} width={90} height={9} rx={4} fill="#fff" opacity={0.8} />)}
    <Taxi x={30} y={420} s={1.0} rot={fr * 14} bob={Math.sin(fr / 3) * 2} />
    <Bus x={370} y={426} s={0.72} rot={fr * 12} />
    <Plane x={880} y={190 + Math.sin(fr / 20) * 10} s={0.75} rot={-6} />
  </svg>
);

/* ---------- 0:06 – 141 → 150, ten sentences ---------- */
export const Range: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const count = interpolate(fr, [f(1.2), f(2.8)], [141, 150], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = clampI(fr, [durationInFrames - 9, durationInFrames - 1], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-exit * 24}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 60 }}><BrandChip /></div>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center" }}>
        <Entrance delay={4}><Pill bg={C.primary} size={44}>আজ আমরা শিখব</Pill></Entrance>
      </div>
      <div style={{ position: "absolute", top: 330, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 20, fontFamily: theme.fonts.bn, fontWeight: 800 }}>
        <Entrance delay={8}><div style={{ fontSize: 190, color: C.text, minWidth: 380, textAlign: "center", lineHeight: 1.1 }}>{toBn(141)}</div></Entrance>
        <Entrance delay={14}>
          <svg width={110} height={60} viewBox="0 0 150 60"><path d="M0 30 H110 M84 6 L120 30 L84 54" stroke={C.accent} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Entrance>
        <Entrance delay={20}><div style={{ fontSize: 190, color: C.primary, minWidth: 380, textAlign: "center", lineHeight: 1.1, textShadow: `0 0 70px ${C.glow}` }}>{toBn(Math.round(count))}</div></Entrance>
      </div>
      <div style={{ position: "absolute", top: 620, left: 70, right: 70, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const p = spring({ frame: fr - f(3.3) - i * 4, fps, config: theme.spring.bouncy });
          return (
            <div key={i} style={{ height: 150, borderRadius: 32, background: i % 2 ? C.white : C.primarySoft, border: `5px solid ${C.primary}`,
              display: "grid", placeItems: "center", fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 46, color: C.text,
              opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + 0.4 * p})`, boxShadow: `0 14px 30px ${C.shadow}` }}>{toBn(141 + i)}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 960, width: "100%", textAlign: "center" }}>
        <Entrance delay={f(4.2)}><Pill bg={C.accent} color={C.ink2} size={50}>১০টি অত্যন্ত জরুরি আরবি বাক্য</Pill></Entrance>
      </div>
      <Entrance delay={f(4.6)} dy={80} style={{ position: "absolute", top: 1220 }}>
        <div style={{ width: 1080 }}><Strip fr={fr} /></div>
      </Entrance>
    </AbsoluteFill>
  );
};

/* ---------- 0:12 – where these sentences help ---------- */
export const Uses: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t0 = f(12.6);
  const rel = (s: number) => f(s) - t0;
  const exit = clampI(fr, [durationInFrames - 9, durationInFrames - 1], [0, 1], theme.ease.in);
  const cards = [
    { at: 13.3, label: "ট্যাক্সি", art: (r: number) => <Taxi x={315} y={222} s={1.1} rot={r * 16} bob={Math.sin(r / 3) * 2} /> },
    { at: 14.9, label: "বাস", art: (r: number) => <Bus x={260} y={226} s={0.8} rot={r * 14} /> },
    { at: 16.3, label: "বিমানবন্দর", art: (r: number) => <Plane x={480} y={130 + Math.sin(r / 20) * 8} s={0.9} rot={-6} /> },
  ];
  const go = spring({ frame: fr - rel(20.9), fps, config: theme.spring.bouncy });
  const day = spring({ frame: fr - rel(19.0), fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-exit * 24}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 60 }}><BrandChip /></div>
      <div style={{ position: "absolute", top: 190, width: "100%", textAlign: "center" }}>
        <Entrance delay={rel(12.9)}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 76, color: C.text }}>যেখানে কাজে লাগবে</div></Entrance>
      </div>
      <div style={{ position: "absolute", top: 320, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 28 }}>
        {cards.map((c, i) => {
          const p = spring({ frame: fr - rel(c.at), fps, config: theme.spring.smooth });
          const lr = fr - rel(c.at);
          return (
            <div key={i} style={{ width: 960, height: 410, borderRadius: 44, background: C.white, boxShadow: `0 30px 60px -20px ${C.shadow}`,
              overflow: "hidden", opacity: p, transform: `translateY(${(1 - p) * 70}px) scale(${0.92 + 0.08 * p})`, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.primarySoft}, #F4FCF9)` }} />
              <svg viewBox="0 0 960 300" width={960} height={300} style={{ position: "absolute", top: 0 }}>
                <rect y={226} width={960} height={74} fill={C.ink2} />
                {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={((k * 130 - lr * 6) % 1170 + 1170) % 1170 - 100} y={262} width={64} height={8} rx={4} fill="#fff" opacity={0.8} />)}
                {c.art(lr)}
              </svg>
              <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center", fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 58, color: C.text }}>{c.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ opacity: day, transform: `translateY(${(1 - day) * 40}px)` }}><Pill bg={C.white} color={C.primaryDeep} size={46} style={{ border: `4px solid ${C.primary}` }}>প্রতিদিন কাজে লাগবে</Pill></div>
        <div style={{ opacity: go, transform: `scale(${0.6 + 0.4 * go}) rotate(${(1 - go) * -6}deg)` }}><Pill bg={C.accent} color={C.ink2} size={54}>চলুন শুরু করি!</Pill></div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 1:43 – airport transition ---------- */
export const AirportIntro: React.FC = () => {
  const fr = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const x = interpolate(fr, [0, durationInFrames], [-500, 1600], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = clampI(fr, [durationInFrames - 8, durationInFrames - 1], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} style={{ position: "absolute", inset: 0 }}>
        <rect y={1250} width={VW} height={670} fill={C.ink2} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={((i * 220 - fr * 10) % 1980 + 1980) % 1980 - 200} y={1560} width={140} height={12} rx={6} fill="#fff" opacity={0.8} />)}
        {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={i * 230 - 20} y={1030} width={200} height={200} rx={10} fill={C.glass} opacity={0.8} />)}
        <rect y={1010} width={VW} height={24} fill={C.primary} />
        <g opacity={0.55}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={x - 300 - i * 90} y={900 + i * 6} width={240 - i * 30} height={10} rx={5} fill="#fff" />)}</g>
        <Plane x={x} y={860 + Math.sin(fr / 6) * 4} s={1.5} rot={-5} />
      </svg>
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center" }}>
        <Entrance delay={4}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 96, color: C.text }}>এবার <span style={{ color: C.primary }}>বিমানবন্দর</span></div></Entrance>
        <Entrance delay={10}><div style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: 130, color: C.accent, marginTop: 6 }}>مطار</div></Entrance>
      </div>
    </AbsoluteFill>
  );
};

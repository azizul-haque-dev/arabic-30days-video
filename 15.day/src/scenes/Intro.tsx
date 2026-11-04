import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BrandChip, Entrance, Pill, clampI } from "../components/fx";
import { Bus, Plane, Suitcase, Taxi } from "../components/art";
import { f, toBn } from "../data";

const C = theme.colors;

/* ---------- 0:00 – opening thumbnail card (vertical 1080x1920) ---------- */
export const Opening: React.FC = () => {
  const fr = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = clampI(fr, [durationInFrames - 10, durationInFrames - 1], [0, 1], theme.ease.in);
  const breathe = 1 + Math.sin(fr / 24) * 0.012;
  const planeY = 880 + Math.sin(fr / 28) * 14, planeX = 660 + Math.sin(fr / 50) * 22;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.6 }}>
      {/* airport terminal facade background */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="op-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFEFE4" /><stop offset="1" stopColor="#F4FCF9" /></linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#op-sky)" />
        <circle cx={920} cy={280} r={100} fill={C.accent} opacity={0.9} />
        {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 480 + fr * 0.8) % 1500) - 200} cy={220 + (i % 2) * 120} rx={140} ry={36} fill="#fff" opacity={0.9} />)}

        {/* terminal building in lower section */}
        <path d="M0 1340 L1080 1280 L1080 1920 L0 1920Z" fill={C.bldA} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 120 + 20} y={1360 - i * 3.4} width={96} height={180} rx={8} fill={C.glass} opacity={0.9} />)}
        <path d="M0 1340 L1080 1280 L1080 1310 L0 1372Z" fill={C.primary} />
        <rect x={340} y={1200} width={740} height={110} fill={C.bldB} opacity={0.8} />
        <rect y={1660} width={1080} height={260} fill={C.ink2} />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={((i * 180 - fr * 7) % 1500 + 1500) % 1500 - 150} y={1780} width={110} height={10} rx={5} fill="#fff" opacity={0.8} />)}

        {/* Arabic typography watermark */}
        <text x={840} y={1220} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={220} fill={C.primary} opacity={0.16}>مطار</text>
        <text x={300} y={1520} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={180} fill={C.accent} opacity={0.22}>باص</text>
      </svg>

      {/* vehicles */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Plane x={planeX} y={planeY} s={1.8} rot={-9} />
        <Bus x={520 + Math.sin(fr / 40) * 8} y={1760} s={1.2} rot={fr * 8} />
        <Suitcase x={920} y={1790} s={2.0} color={C.accent} rot={Math.sin(fr / 30) * 2} />
        <Suitcase x={820} y={1790} s={1.6} color={C.primaryDeep} />
      </svg>

      {/* text block */}
      <div style={{ position: "absolute", left: 60, top: 70 }}><BrandChip /></div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 220, transform: `scale(${breathe})`, transformOrigin: "left top" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <span style={{ fontSize: 180, color: C.text, letterSpacing: -4 }}>Day</span>
          <span style={{ fontSize: 240, color: C.primary, letterSpacing: -6, textShadow: `0 12px 0 ${C.primaryDeep}33, 0 0 70px ${C.glow}` }}>15</span>
        </div>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 80, color: C.text, marginTop: 12, lineHeight: 1.25 }}>১০টি জরুরি আরবি বাক্য</div>
        <div style={{ marginTop: 28, display: "flex", gap: 20, alignItems: "center" }}>
          <Pill bg={C.accent} color={C.ink2} size={46}>বাস ও বিমানবন্দরে যাতায়াত</Pill>
        </div>
        <div style={{ marginTop: 24 }}><Pill bg={C.white} color={C.primaryDeep} size={38} style={{ border: `3px solid ${C.primary}` }}>বাক্য {toBn(141)} – {toBn(150)}</Pill></div>
      </div>

      {/* series progress 15/30 */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", gap: 6 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: i < 15 ? C.primary : "rgba(255,255,255,0.35)",
            opacity: i === 14 ? 0.7 + Math.sin(fr / 6) * 0.3 : 1 }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 0:06 – 141 → 150, ten sentences ---------- */
export const Range: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const count = interpolate(fr, [f(1.2), f(2.8)], [141, 150], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = clampI(fr, [durationInFrames - 9, durationInFrames - 1], [0, 1], theme.ease.in);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-exit * 24}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 70 }}><BrandChip /></div>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center" }}>
        <Entrance delay={4}><Pill bg={C.primary} size={42}>আজ আমরা শিখব</Pill></Entrance>
      </div>

      <div style={{ position: "absolute", top: 360, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 32, fontFamily: theme.fonts.bn, fontWeight: 800 }}>
        <Entrance delay={8}><div style={{ fontSize: 160, color: C.text, minWidth: 320, textAlign: "center", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{toBn(141)}</div></Entrance>
        <Entrance delay={14}>
          <svg width={90} height={50} viewBox="0 0 150 60"><path d="M0 30 H110 M84 6 L120 30 L84 54" stroke={C.accent} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Entrance>
        <Entrance delay={20}><div style={{ fontSize: 160, color: C.primary, minWidth: 320, textAlign: "center", lineHeight: 1.1, textShadow: `0 0 60px ${C.glow}` }}>{toBn(Math.round(count))}</div></Entrance>
      </div>

      {/* 2x5 grid for 10 sentences */}
      <div style={{ position: "absolute", top: 620, left: 60, right: 60, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const p = spring({ frame: fr - f(3.3) - i * 4, fps, config: theme.spring.bouncy });
          return (
            <div key={i} style={{ height: 130, borderRadius: 28, background: i % 2 ? C.white : C.primarySoft, border: `4px solid ${C.primary}`,
              display: "grid", placeItems: "center", fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 48, color: C.text,
              opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.7 + 0.3 * p})`, boxShadow: `0 12px 24px ${C.shadow}` }}>{toBn(141 + i)}</div>
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 960, width: "100%", textAlign: "center" }}>
        <Entrance delay={f(4.2)}><Pill bg={C.accent} color={C.ink2} size={50}>১০টি অত্যন্ত জরুরি আরবি বাক্য</Pill></Entrance>
      </div>
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
    { at: 13.3, label: "ট্যাক্সি", art: (r: number) => <Taxi x={60} y={230} s={0.9} rot={r * 16} bob={Math.sin(r / 3) * 2} /> },
    { at: 14.9, label: "বাস", art: (r: number) => <Bus x={40} y={236} s={0.65} rot={r * 14} /> },
    { at: 16.3, label: "বিমানবন্দর", art: (r: number) => <Plane x={180} y={130 + Math.sin(r / 20) * 8} s={0.75} rot={-6} /> },
  ];
  const go = spring({ frame: fr - rel(20.9), fps, config: theme.spring.bouncy });
  const day = spring({ frame: fr - rel(19.0), fps, config: theme.spring.smooth });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-exit * 24}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 70 }}><BrandChip /></div>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center" }}>
        <Entrance delay={rel(12.9)}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 76, color: C.text }}>যেখানে কাজে লাগবে</div></Entrance>
      </div>

      {/* 3 stacked vertical cards */}
      <div style={{ position: "absolute", top: 340, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 24 }}>
        {cards.map((c, i) => {
          const p = spring({ frame: fr - rel(c.at), fps, config: theme.spring.smooth });
          return (
            <div key={i} style={{ width: "100%", height: 260, borderRadius: 36, background: C.white, boxShadow: `0 24px 50px -16px ${C.shadow}`,
              overflow: "hidden", opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + 0.06 * p})`, position: "relative",
              display: "flex", alignItems: "center", border: `4px solid ${C.primarySoft}` }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.primarySoft}, #F4FCF9)` }} />
              <svg viewBox="0 0 460 280" width={420} height={260} style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                <rect y={210} width={460} height={70} fill={C.ink2} />
                {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={((k * 110 - (fr - rel(c.at)) * 6) % 550 + 550) % 550 - 80} y={242} width={50} height={6} rx={3} fill="#fff" opacity={0.8} />)}
                {c.art(fr - rel(c.at))}
              </svg>
              <div style={{ position: "relative", zIndex: 1, flex: 1, paddingRight: 40, textAlign: "right", fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 68, color: C.text }}>{c.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
  const x = interpolate(fr, [0, durationInFrames], [-400, 1400], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = clampI(fr, [durationInFrames - 8, durationInFrames - 1], [0, 1], theme.ease.in);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect y={1350} width={1080} height={570} fill={C.ink2} />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={((i * 200 - fr * 10) % 1600 + 1600) % 1600 - 150} y={1500} width={120} height={12} rx={6} fill="#fff" opacity={0.8} />)}
        {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={i * 240 - 20} y={1150} width={200} height={180} rx={10} fill={C.glass} opacity={0.8} />)}
        <rect y={1130} width={1080} height={20} fill={C.primary} />
        <g opacity={0.55}>{[0, 1, 2, 3].map((i) => <rect key={i} x={x - 250 - i * 80} y={920 + i * 6} width={200 - i * 25} height={10} rx={5} fill="#fff" />)}</g>
        <Plane x={x} y={880 + Math.sin(fr / 6) * 4} s={1.6} rot={-5} />
      </svg>
      <div style={{ position: "absolute", top: 320, width: "100%", textAlign: "center" }}>
        <Entrance delay={4}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 100, color: C.text }}>এবার <span style={{ color: C.primary }}>বিমানবন্দর</span></div></Entrance>
        <Entrance delay={10}><div style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: 120, color: C.accent, marginTop: 12 }}>مطار</div></Entrance>
      </div>
    </AbsoluteFill>
  );
};

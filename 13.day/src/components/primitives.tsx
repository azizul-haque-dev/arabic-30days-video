import React from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { BOUNDARIES, FPS, SFX } from "../timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- লেয়ার: bg mesh → (অ্যাসেট/গ্রাফিক্স) → grade → grain → vignette ---------- */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", top: -480, left: -330 + d1, filter: "blur(40px)", background: `radial-gradient(circle, ${theme.colors.heroSoft}, transparent 64%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", bottom: -420, right: -260 - d2, filter: "blur(50px)", opacity: 0.55, background: `radial-gradient(circle, ${theme.colors.accentSoft}, transparent 66%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${theme.colors.line} 1.6px, transparent 1.8px)`, backgroundSize: "40px 40px", backgroundPosition: `${-frame * 0.15}px 0`, opacity: 0.6 }} />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.hero, mixBlendMode: "soft-light", opacity: 0.1 }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.colors.white}, transparent 26%, transparent 78%, ${theme.colors.heroSoft})`, opacity: 0.35 }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.045, mixBlendMode: "multiply" }} />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 60%, ${theme.colors.shadow} 100%)`, opacity: 0.22 }} />
);

/* ---------- এন্ট্রি: opacity + translate + scale একসাথে, spring ---------- */
type PopProps = {
  at: number;
  children: React.ReactNode;
  y?: number; x?: number; scale?: number;
  kind?: keyof typeof theme.spring;
  minOpacity?: number;
  exitAt?: number;
  style?: React.CSSProperties;
};
export const Pop: React.FC<PopProps> = ({ at, children, y = 36, x = 0, scale = 0.92, kind = "smooth", minOpacity = 0, exitAt, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring[kind] });
  let o = minOpacity + (1 - minOpacity) * Math.min(1, p);
  let ty = interpolate(p, [0, 1], [y, 0]);
  const tx = interpolate(p, [0, 1], [x, 0]);
  let sc = interpolate(p, [0, 1], [scale, 1]);
  if (exitAt !== undefined) {
    const e = interpolate(frame, [exitAt, exitAt + 9], [0, 1], { easing: theme.ease.in, ...clamp });
    o *= 1 - e; ty -= 34 * e; sc *= 1 - 0.04 * e;
  }
  return <div style={{ opacity: o, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, ...style }}>{children}</div>;
};

/* ---------- শব্দ ধরে স্ট্যাগার্ড (বাংলা অক্ষর কখনো ভাঙে না; ভাগ শুধু স্পেসে) ---------- */
type WordsProps = {
  text: string; at: number; size: number;
  per?: number; weight?: 600 | 700; color?: string; align?: "center" | "left";
  mask?: boolean; settle?: boolean; highlightAt?: number; exitAt?: number; lineHeight?: number;
  style?: React.CSSProperties; wordColors?: Record<number, string>;
};
export const Words: React.FC<WordsProps> = ({ text, at, size, per = 4, weight = 700, color = theme.colors.text, align = "center", mask = false, settle = false, highlightAt, exitAt, lineHeight = 1.42, style, wordColors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let o = 1, ty = 0;
  if (exitAt !== undefined) {
    const e = interpolate(frame, [exitAt, exitAt + 9], [0, 1], { easing: theme.ease.in, ...clamp });
    o = 1 - e; ty = -30 * e;
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, rowGap: 0, fontFamily: theme.fonts.display, fontWeight: weight, fontSize: size, lineHeight, letterSpacing: 0, color, opacity: o, transform: `translateY(${ty}px)`, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - at - i * per, fps, config: theme.spring.snappy });
        const hp = highlightAt === undefined ? 0 : interpolate(frame, [highlightAt + i * 4, highlightAt + i * 4 + 16], [0, 1], { easing: theme.ease.out, ...clamp });
        const inner = (
          <span style={{ display: "inline-block", whiteSpace: "nowrap", color: wordColors?.[i], opacity: mask ? (p > 0.03 ? 1 : 0) : settle ? 1 : Math.min(1, p), transform: mask ? `translateY(${interpolate(p, [0, 1], [105, 0])}%)` : settle ? `translateY(${interpolate(p, [0, 1], [14, 0])}px) scale(${interpolate(p, [0, 1], [0.97, 1])})` : `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>{w}</span>
        );
        return (
          <span key={i} style={{ display: "inline-block", padding: "0 6px", margin: "0 -6px", backgroundImage: `linear-gradient(${theme.colors.accentSoft}, ${theme.colors.accentSoft})`, backgroundRepeat: "no-repeat", backgroundSize: `${hp * 100}% 36%`, backgroundPosition: "0 88%" }}>
            {mask ? <span style={{ display: "inline-block", overflow: "hidden", padding: `${size * 0.2}px 0 ${size * 0.26}px`, margin: `${-size * 0.2}px 0 ${-size * 0.26}px` }}>{inner}</span> : inner}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- সিনের এক্সিট (এন্ট্রির চেয়ে দ্রুত) ---------- */
export const SceneFrame: React.FC<{ children: React.ReactNode; exit?: boolean }> = ({ children, exit = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const e = exit ? interpolate(frame, [durationInFrames - 9, durationInFrames - 1], [0, 1], { easing: theme.ease.in, ...clamp }) : 0;
  return <AbsoluteFill style={{ opacity: 1 - e, transform: `translateY(${-26 * e}px) scale(${1 - 0.015 * e})` }}>{children}</AbsoluteFill>;
};

/* ---------- সিন ট্রানজিশন: মাস্ক-ওয়াইপ (কাট ঠিক মাঝখানে, প্যানেলের পেছনে) ---------- */
export const WIPE_FRAMES = 14;
export const Wipe: React.FC<{ dir: "x" | "y" }> = ({ dir }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, WIPE_FRAMES], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const pos = interpolate(p, [0, 1], [-1290, 1290]);
  const horizontal = dir === "x";
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: horizontal ? 1500 : 1500, height: 1500, marginLeft: -750, marginTop: -750, transform: horizontal ? `translateX(${pos}px) skewX(-10deg)` : `translateY(${pos}px) skewY(-6deg)`, background: theme.colors.hero, boxShadow: `0 0 80px ${theme.colors.glow}` }}>
        <div style={{ position: "absolute", ...(horizontal ? { right: 0, top: 0, bottom: 0, width: 30 } : { bottom: 0, left: 0, right: 0, height: 30 }), background: theme.colors.accent }} />
        <div style={{ position: "absolute", ...(horizontal ? { right: 54, top: 0, bottom: 0, width: 12 } : { bottom: 54, left: 0, right: 0, height: 12 }), background: theme.colors.white, opacity: 0.6 }} />
      </div>
    </AbsoluteFill>
  );
};

export const Transitions: React.FC = () => (
  <>
    {BOUNDARIES.map((b, i) => (
      <Sequence key={b} from={b - WIPE_FRAMES / 2} durationInFrames={WIPE_FRAMES + 1} layout="none">
        <Wipe dir={i % 3 === 2 ? "y" : "x"} />
      </Sequence>
    ))}
  </>
);

/* ---------- আইকন টাইল ---------- */
export const IconTile: React.FC<{ at: number; size: number; children: React.ReactNode; tilt?: number; round?: number; floatPhase?: number; minOpacity?: number }> = ({ at, size, children, tilt = 0, round = theme.radius.tile, floatPhase = 0, minOpacity = 0 }) => {
  const frame = useCurrentFrame();
  const fl = Math.sin(frame / 26 + floatPhase) * 5;
  const br = 1 + Math.sin(frame / 22 + floatPhase) * 0.012;
  return (
    <Pop at={at} kind="bouncy" y={minOpacity ? 18 : 50} scale={minOpacity ? 0.95 : 0.8} minOpacity={minOpacity}>
      <div style={{ width: size, height: size, borderRadius: round, background: theme.colors.white, boxShadow: theme.shadow.card, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${fl}px) rotate(${tilt}deg) scale(${br})` }}>{children}</div>
    </Pop>
  );
};

/* ---------- অডিও ---------- */
// SFX: প্রতিটি ইভেন্ট নিজের Sequence-এ, রেন্ডারেও থাকে, Studio প্রিভিউতেও শোনা যায়
export const SfxTrack: React.FC = () => (
  <>
    {SFX.map((e, i) => (
      <Sequence key={i} from={e.f} durationInFrames={Math.ceil(theme.sfx[e.type].dur * FPS) + 2} layout="none">
        <Audio src={staticFile(`sfx/${e.type}.wav`)} volume={theme.sfx[e.type].vol * (e.vol ?? 1)} playbackRate={e.rate ?? 1} />
      </Sequence>
    ))}
  </>
);

// ভয়েসওভার: রেন্ডার ও স্টুডিও প্রিভিউ উভয় ক্ষেত্রে voiceover অডিও বাজবে
export const PreviewAudio: React.FC<{ file?: string }> = ({ file }) => {
  const activeFile = file || theme.audio.voiceoverFile;
  if (!theme.audio.voiceoverEnabled) return null;
  return <Audio src={staticFile(activeFile)} volume={theme.audio.voiceoverVolume} />;
};

export const VoiceoverAudio = PreviewAudio;

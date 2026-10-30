import React, { createContext, useContext } from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, EASE, MOTION } from "../theme";
import { tween } from "../lib/motion";

export const NoExitCtx = createContext(false);

// সিন শেল: ঢোকা (দীর্ঘ) + বেরোনো (দ্রুততর)
export const SceneShell: React.FC<{ dur: number; last?: boolean; from?: "right" | "up" | "scale"; children: React.ReactNode }> = ({ dur, last, from = "right", children }) => {
  const f = useCurrentFrame();
  const noExit = useContext(NoExitCtx);
  const en = tween(f, 0, MOTION.enter, 0, 1, EASE.out);
  const ex = last || noExit ? 0 : tween(f, dur - MOTION.exit, dur, 0, 1, EASE.in);
  const x = from === "right" ? (1 - en) * 80 - ex * 70 : 0;
  const y = from === "up" ? (1 - en) * 60 - ex * 40 : 0;
  const sc = from === "scale" ? 0.92 + 0.08 * en - ex * 0.04 : 0.97 + 0.03 * en - ex * 0.03;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, en * 1.5) * (1 - ex), transform: `translate(${x}px, ${y}px) scale(${sc})` }}>
      {children}
    </div>
  );
};

// ── সাউন্ড: public/sfx/*.wav (কোডে সিন্থেসাইজ করা)। ভলিউম সংযত ──
export type SfxName = "pop" | "click" | "tick" | "whoosh" | "swipe" | "chime" | "thud";
const SFX_DUR: Record<SfxName, number> = { pop: 0.22, click: 0.09, tick: 0.12, whoosh: 0.62, swipe: 0.36, chime: 0.5, thud: 0.3 };
const SFX_VOL: Record<SfxName, number> = { pop: 0.3, click: 0.35, tick: 0.35, whoosh: 0.3, swipe: 0.28, chime: 0.22, thud: 0.25 };

export const Sfx: React.FC<{ name: SfxName; at: number; vol?: number; rate?: number }> = ({ name, at, vol = 1, rate = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={Math.ceil((SFX_DUR[name] / rate) * fps) + 2} layout="none" name={`sfx-${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={SFX_VOL[name] * vol} playbackRate={rate} />
    </Sequence>
  );
};

// মেজর সিন-ট্রানজিশন: হিরো-রঙা প্যানেল সোয়াইপ
export const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const a = at - 9, b = at + 13;
  if (f < a || f > b) return null;
  const x = interpolate(f, [a, (a + b) / 2, b], [100, -12, -112], { easing: EASE.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: -40, bottom: -40, left: 0, width: "135%", transform: `translateX(${x}%) skewX(-8deg)`, background: `linear-gradient(120deg, ${C.hero} 0%, ${C.heroDeep} 100%)`, boxShadow: "0 0 80px rgba(10,122,85,0.35)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, background: C.accent }} />
    </div>
  );
};

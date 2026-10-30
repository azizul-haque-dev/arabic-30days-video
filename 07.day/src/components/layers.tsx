import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, theme } from "../theme";
import { clamp, Sfx } from "./primitives";

export const BgMesh: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 90) * 60, d2 = Math.cos(f / 110) * 50;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", top: -480, left: -330 + d1, filter: "blur(50px)", background: `radial-gradient(circle, ${alpha(theme.colors.primary, 0.2)}, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", bottom: -420, right: -300 - d2, filter: "blur(60px)", background: `radial-gradient(circle, ${alpha(theme.colors.accent, 0.22)}, transparent 65%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha(theme.colors.text, 0.09)} 2px, transparent 2.5px)`, backgroundSize: "54px 54px", backgroundPosition: `${-f * 0.25}px ${-f * 0.15}px`, opacity: 0.7 }} />
    </AbsoluteFill>
  );
};

export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
      <AbsoluteFill style={{ backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.045, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 58%, ${alpha(theme.colors.text, 0.14)} 100%)` }} />
    </AbsoluteFill>
  );
};

/** Hand-rolled band wipe; scene cut hides behind the centre frame `c`. */
export const Wipe: React.FC<{ c: number; accent?: boolean }> = ({ c, accent }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [c - 8, c + 8], [-100, 100], { ...clamp, easing: theme.ease.inOut });
  const visible = f >= c - 9 && f <= c + 9;
  return (
    <>
      <Sfx name="swipe" at={c - 11} />
      {visible && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, bottom: -60, left: "-20%", width: "140%", transform: `translateX(${x}%) skewX(-10deg)`, background: accent ? theme.colors.primary : theme.colors.accent, boxShadow: `-44px 0 0 ${accent ? theme.colors.accent : theme.colors.primary}` }} />
        </AbsoluteFill>
      )}
    </>
  );
};

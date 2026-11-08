import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { useScene } from "../context";
import { clamp01, exitAmount, fitFont, ramp, useSpring } from "../utils/anim";

const C = theme.colors;

/* ---------- motion primitives ---------- */
export const Entrance: React.FC<React.PropsWithChildren<{
  delay?: number; y?: number; scale?: number; preset?: keyof typeof theme.spring; style?: React.CSSProperties;
}>> = ({ delay = 0, y = 40, scale = 0.94, preset = "smooth", style, children }) => {
  const p = useSpring(delay, preset);
  return (
    <div style={{ opacity: clamp01(p), transform: `translateY(${(1 - p) * y}px) scale(${scale + (1 - scale) * p})`, ...style }}>
      {children}
    </div>
  );
};

export const WordReveal: React.FC<{ text: string; delay?: number; per?: number; style?: React.CSSProperties; gap?: number }> = ({
  text, delay = 0, per = 3, style, gap = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gap, rowGap: 4, ...style }}>
      {words.map((w, i) => {
        const p = frame - delay - i * per < 0 ? 0 : Math.min(1, ramp(frame, delay + i * per, delay + i * per + 14));
        void fps;
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>{w}</span>
        );
      })}
    </div>
  );
};

/* ---------- global layers ---------- */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", width: 1200, height: 1200, borderRadius: "50%", top: -450, left: -300 + d1, filter: "blur(50px)", background: `radial-gradient(circle, ${C.primary}33, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -420, right: -300 - d2, filter: "blur(70px)", background: `radial-gradient(circle, ${C.accent}2E, transparent 65%)` }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.primary}14 2px, transparent 2.5px)`, backgroundSize: "54px 54px", transform: `translateY(${(frame * 0.25) % 54}px)` }} />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: C.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,35,29,0.05), transparent 25%, transparent 75%, rgba(16,35,29,0.08))" }} />
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
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 58%, rgba(16,35,29,0.13) 100%)" }} />
);

/* ---------- scene wrapper with exit ---------- */
export const SceneShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const frame = useCurrentFrame();
  const { scene } = useScene();
  const e = exitAmount(frame, scene.durationInFrames, 9);
  return (
    <AbsoluteFill style={{ opacity: 1 - e, transform: `translateY(${-30 * e}px) scale(${1 - 0.02 * e})`, fontFamily: theme.fonts.bn, color: C.text }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- brand ---------- */
export const SparkMark: React.FC<{ size: number; delay?: number; still?: boolean }> = ({ size, delay = 0, still = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rays = 12;
  const popS = useSpring(delay, "bouncy");
  const rotS = interpolate(useSpring(delay, "smooth"), [0, 1], [-120, 0]);
  const pop = still ? 1 : popS;
  const rot = still ? 0 : rotS;
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `scale(${pop}) rotate(${rot + Math.sin(frame / (fps * 1.4)) * 4}deg)`, filter: `drop-shadow(0 0 ${size * 0.18}px ${C.glow})` }}>
      {Array.from({ length: rays }).map((_, i) => {
        const p = still ? 1 : Math.min(1, ramp(frame, delay + i * 1.2, delay + i * 1.2 + 14));
        return (
          <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: size * 0.085, height: size * 0.46 * p, background: i % 2 ? C.accent : C.primary, borderRadius: size, transformOrigin: "50% 0%", transform: `translateX(-50%) rotate(${(360 / rays) * i}deg) translateY(${size * 0.08}px)` }} />
        );
      })}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: size * 0.2, height: size * 0.2, marginLeft: -size * 0.1, marginTop: -size * 0.1, borderRadius: "50%", background: C.white, boxShadow: `0 0 0 ${size * 0.03}px ${C.primary}` }} />
    </div>
  );
};

export const Pill: React.FC<React.PropsWithChildren<{ bg?: string; color?: string; size?: number; pad?: number; style?: React.CSSProperties }>> = ({
  bg = C.primary, color = C.white, size = 34, pad = 26, style, children,
}) => (
  <div style={{ display: "inline-flex", alignItems: "center", background: bg, color, borderRadius: 999, padding: `${pad * 0.34}px ${pad}px`, fontFamily: theme.fonts.en, fontWeight: 800, fontSize: size, letterSpacing: 1, boxShadow: `0 10px 24px -10px ${C.shadow}`, ...style }}>
    {children}
  </div>
);

export const BrandHeader: React.FC = () => {
  const { episode } = useScene();
  return (
    <div style={{ position: "absolute", left: theme.layout.margin, right: theme.layout.margin, top: theme.layout.headerTop, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Entrance delay={0} y={-20} style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <SparkMark size={64} delay={0} />
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 42, letterSpacing: -0.5 }}>{episode.brandName}</div>
      </Entrance>
      <Entrance delay={4} y={-20}>
        <Pill size={32}>DAY {episode.episodeNumber}</Pill>
      </Entrance>
    </div>
  );
};

/* ---------- cards ---------- */
export const Card: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ style, children }) => (
  <div style={{ background: C.white, borderRadius: 40, boxShadow: `0 28px 60px -24px ${C.shadow}, 0 2px 0 ${C.primary}10`, border: `2px solid ${C.primary}14`, ...style }}>{children}</div>
);

/** Rounded art frame with subtle Ken-Burns (1 -> 1.04) + idle float. */
export const ArtFrame: React.FC<React.PropsWithChildren<{ left?: number; top?: number; width: number; height: number; delay?: number; inline?: boolean }>> = ({
  left, top, width, height, delay = 0, inline = false, children,
}) => {
  const frame = useCurrentFrame();
  const { scene } = useScene();
  const p = useSpring(delay, "smooth");
  const kb = interpolate(frame, [0, scene.durationInFrames], [1, 1.04], { easing: theme.ease.inOut, extrapolateRight: "clamp" });
  return (
    <div style={{ position: inline ? "relative" : "absolute", left, top, width, height, flexShrink: 0, opacity: clamp01(p), transform: `translateY(${(1 - p) * 60 + Math.sin(frame / 34) * 3}px) scale(${0.95 + 0.05 * p})` }}>
      <Card style={{ width, height, overflow: "hidden", borderRadius: 44 }}>
        <div style={{ width, height, transform: `scale(${kb})`, transformOrigin: "50% 60%" }}>{children}</div>
      </Card>
    </div>
  );
};

export const Caption: React.FC<{ text: string; delay?: number }> = ({ text, delay = 6 }) => {
  const size = text.length > 70 ? 46 : text.length > 40 ? 52 : text.length > 22 ? 60 : 72;
  return (
    <Entrance delay={delay} y={40} style={{ width: 920 }}>
      <Card style={{ padding: "30px 40px", textAlign: "center", fontSize: size, lineHeight: 1.3, fontWeight: 600, color: C.text }}>
        <WordReveal text={text} delay={delay + 2} per={3} />
      </Card>
    </Entrance>
  );
};

export const ProgressBar: React.FC<{ value: number; delay?: number; height?: number }> = ({ value, delay = 0, height = 34 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 40, theme.ease.out);
  return (
    <div style={{ width: "100%", height, borderRadius: height, background: `${C.primary}1F`, overflow: "hidden" }}>
      <div style={{ width: `${value * p}%`, height: "100%", borderRadius: height, background: `linear-gradient(90deg, ${C.primary}, ${C.accent})` }} />
    </div>
  );
};

export { fitFont };

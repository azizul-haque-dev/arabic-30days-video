import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, WordReveal, ramp, useBreathe, useSpringIn } from "../animations/presets";
import { BrandLogo } from "../components/BrandLogo";
import { SeriesProgressBar } from "../components/ProgressIndicator";
import { script } from "../utils/timeline";

const bn = (size: number, weight: 400 | 500 | 600 | 700 = 600, color: string = theme.colors.text): React.CSSProperties => ({
  fontFamily: theme.fonts.bengali, fontWeight: weight, fontSize: size, lineHeight: 1.35, color, textAlign: "center",
});
const SHIFT = 120; // optical vertical centring for 9:16
const Center: React.FC<{ top: number; children: React.ReactNode; gap?: number }> = ({ top, children, gap = 30 }) => (
  <div style={{ position: "absolute", left: 72, right: 72, top: top + SHIFT, display: "flex", flexDirection: "column", alignItems: "center", gap }}>{children}</div>
);
const Corner: React.FC = () => (
  <div style={{ position: "absolute", left: theme.layout.marginX, top: 96 }}><BrandLogo size={62} delay={0} /></div>
);

export const OutroScene: React.FC<{ variant: "complete" | "progress" | "tip" | "follow" | "next" }> = ({ variant }) => {
  const c = theme.colors;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const breathe = useBreathe(66, 0.014);
  const pop = useSpringIn(4, "bouncy");
  const o = script.outro;
  const btn = useSpringIn(Math.round(0.6 * fps), "bouncy");
  const cm = useSpringIn(Math.round(3.4 * fps), "smooth");
  const lock = useSpringIn(2, "bouncy");

  if (variant === "complete") {
    const draw = ramp(frame, 12, 34);
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <Center top={330} gap={40}>
          <div style={{ opacity: Math.min(1, pop), transform: `scale(${interpolate(pop, [0, 1], [0.4, 1]) * breathe})` }}>
            <svg width={340} height={340} viewBox="0 0 340 340">
              <circle cx={170} cy={170} r={150} fill={c.primary} />
              <circle cx={170} cy={170} r={150} fill="none" stroke={c.primaryMid} strokeWidth={24} transform="scale(1.08) translate(-13 -13)" />
              <path d="M104 176 L152 222 L240 120" fill="none" stroke={c.white} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={260} strokeDashoffset={260 * (1 - draw)} />
            </svg>
          </div>
          <Entrance delay={10} y={30}>
            <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 96, letterSpacing: "-0.01em", color: c.text, textAlign: "center", lineHeight: 1.05 }}>
              DAY <span style={{ color: c.primary }}>09</span><br />COMPLETED
            </div>
          </Entrance>
        </Center>
        <Center top={1030} gap={26}>
          <Entrance delay={16} y={30}><div lang="bn" style={{ ...bn(58, 600), maxWidth: 900 }}>{o.complete}</div></Entrance>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  if (variant === "progress") {
    const v = interpolate(frame, [4, 46], [script.episode.learnedBefore, script.episode.learnedAfter], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <Center top={330} gap={50}>
          <Entrance delay={0} y={30}><div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 40, letterSpacing: "0.16em", color: c.textDim }}>LEARNING PROGRESS</div></Entrance>
          <div style={{ transform: `scale(${breathe})`, display: "flex", alignItems: "baseline", gap: 22, fontFamily: theme.fonts.latin, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ fontSize: 250, color: c.primary, lineHeight: 1, letterSpacing: "-0.02em" }}>{Math.round(v)}</span>
            <span style={{ fontSize: 84, color: c.textDim }}>/ 300</span>
          </div>
          <Entrance delay={8} y={30}><SeriesProgressBar days={v / 10} /></Entrance>
        </Center>
        <Center top={1000}>
          <Entrance delay={14} y={30}><div lang="bn" style={{ ...bn(58, 600), maxWidth: 900 }}>{o.progress}</div></Entrance>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  if (variant === "tip") {
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <Center top={420} gap={46}>
          <div style={{ opacity: Math.min(1, pop), transform: `scale(${interpolate(pop, [0, 1], [0.5, 1]) * breathe})` }}>
            <svg width={220} height={200} viewBox="0 0 220 200">
              <rect x={14} y={14} width={192} height={124} rx={42} fill={c.accent} stroke={c.text} strokeWidth={8} />
              <path d="M62 136 L40 186 L104 138" fill={c.accent} stroke={c.text} strokeWidth={8} strokeLinejoin="round" />
              <path d="M60 138 L104 138" stroke={c.accent} strokeWidth={12} />
              {[70, 110, 150].map((x) => <circle key={x} cx={x} cy={76} r={11} fill={c.text} />)}
            </svg>
          </div>
          <div style={{ width: 936, borderRadius: 56, background: c.white, border: `2px solid ${c.line}`, boxShadow: `0 40px 80px -34px ${c.primaryMid}`, padding: "56px 56px 62px", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 56, bottom: 56, width: 12, borderRadius: 6, background: c.primary }} />
            <WordReveal text={o.tip} delay={Math.round(0.4 * fps)} per={3} style={{ ...bn(58, 600), justifyContent: "center", textAlign: "center" }} gap={14} />
          </div>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  if (variant === "follow") {
    const press = ramp(frame, Math.round(2.4 * fps), Math.round(2.4 * fps) + 6);
    const typed = "DAY 9 DONE!";
    const nType = Math.floor(interpolate(frame, [Math.round(3.8 * fps), Math.round(3.8 * fps) + typed.length * 3], [0, typed.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const cursor = Math.floor(frame / 8) % 2 === 0;
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <Center top={300} gap={34}>
          <Entrance delay={0} y={30}><div lang="bn" style={{ ...bn(56, 600), maxWidth: 900 }}>{o.follow}</div></Entrance>
          <div style={{ opacity: Math.min(1, btn), transform: `scale(${interpolate(btn, [0, 1], [0.5, 1]) * (1 - press * 0.06 + (press > 0.99 ? 0 : 0))})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28, background: press > 0.6 ? c.text : c.primary, color: c.white, borderRadius: 999, padding: "18px 64px 26px 40px", boxShadow: `0 24px 60px ${c.glow}` }}>
              <BrandLogo size={84} light showWord={false} delay={Math.round(0.6 * fps)} />
              <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 70 }}>
                {press > 0.6 ? "Following" : "+ Follow"}
              </div>
            </div>
          </div>
        </Center>
        <Center top={880} gap={30}>
          <div style={{ opacity: Math.min(1, cm), transform: `translateY(${interpolate(cm, [0, 1], [40, 0])}px)` }}>
            <div lang="bn" style={{ ...bn(52, 600), marginBottom: 28 }}>{o.comment}</div>
            <div style={{ width: 880, borderRadius: 48, background: c.white, border: `3px solid ${c.primary}`, boxShadow: `0 30px 70px -30px ${c.primaryMid}`, padding: "34px 48px 40px", display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: c.primarySoft, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={52} height={52} viewBox="-26 -26 52 52"><circle cy={-8} r={11} fill={c.primary} /><path d="M-20 22 C-20 4 20 4 20 22 Z" fill={c.primary} /></svg>
              </div>
              <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 82, color: c.text, letterSpacing: "0.02em", minHeight: 100, lineHeight: "100px" }}>
                {typed.slice(0, nType)}
                <span style={{ color: c.primary, opacity: cursor ? 1 : 0 }}>|</span>
              </div>
            </div>
          </div>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  // next
  return (
    <AbsoluteFill><SceneExit>
      <Corner />
      <Center top={340} gap={36}>
        <div style={{ opacity: Math.min(1, lock), transform: `scale(${interpolate(lock, [0, 1], [0.5, 1]) * breathe})` }}>
          <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 250, lineHeight: 1, letterSpacing: "-0.03em", color: c.text }}>
            DAY <span style={{ color: c.primary }}>10</span>
          </div>
        </div>
        <Entrance delay={8} y={30}>
          <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 56, color: c.text, background: c.accent, padding: "4px 44px 10px", borderRadius: 22, letterSpacing: "0.1em" }}>COMING SOON</div>
        </Entrance>
      </Center>
      <Center top={1000} gap={50}>
        <Entrance delay={12} y={30}><div lang="bn" style={{ ...bn(66, 700) }}>{o.next}</div></Entrance>
        <BrandLogo size={110} delay={18} shadow />
      </Center>
    </SceneExit></AbsoluteFill>
  );
};

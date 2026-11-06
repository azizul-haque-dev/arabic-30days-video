import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, WordReveal, ramp, useBreathe, useSpringIn } from "../animations/presets";
import { BrandLogo } from "../components/BrandLogo";
import { SeriesProgressBar } from "../components/ProgressIndicator";
import { Struggle } from "../illustrations/scenes2";
import { script } from "../utils/timeline";

const bn = (size: number, weight: 400 | 500 | 600 | 700 = 600, color: string = theme.colors.text): React.CSSProperties => ({
  fontFamily: theme.fonts.bengali, fontWeight: weight, fontSize: size, lineHeight: 1.35, color, textAlign: "center",
});

const SHIFT = 120; // optical vertical centring for 9:16
const Center: React.FC<{ top: number; children: React.ReactNode; gap?: number }> = ({ top, children, gap = 30 }) => (
  <div style={{ position: "absolute", left: 72, right: 72, top: top + SHIFT, display: "flex", flexDirection: "column", alignItems: "center", gap }}>{children}</div>
);

const Corner: React.FC = () => (
  <div style={{ position: "absolute", left: theme.layout.marginX, top: 96 }}>
    <BrandLogo size={62} delay={0} />
  </div>
);

const Counter: React.FC<{ from: number; to: number; delay: number; dur?: number; size?: number }> = ({ from, to, delay, dur = 40, size = 230 }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + dur], [from, to], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 22, fontFamily: theme.fonts.latin, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
      <span style={{ fontSize: size, color: theme.colors.primary, lineHeight: 1, letterSpacing: "-0.02em" }}>{Math.round(v)}</span>
      <span style={{ fontSize: size * 0.34, color: theme.colors.textDim }}>/ {script.episode.totalSentences}</span>
    </div>
  );
};

export const IntroScene: React.FC<{ variant: "brand" | "series" | "progress" | "preview" }> = ({ variant }) => {
  const c = theme.colors;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const breathe = useBreathe(66, 0.012);
  const pop = useSpringIn(4, "bouncy");

  if (variant === "brand") {
    const lines = script.intro.brand.split("! ");
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <div style={{ position: "absolute", left: 72, top: 270 + SHIFT }}>
          <div style={{ width: 936, height: 520, borderRadius: 56, background: `linear-gradient(160deg, ${c.white}, ${c.primarySoft})`, border: `2px solid ${c.line}`, boxShadow: `0 34px 70px -28px ${c.primaryMid}`, overflow: "hidden" }}>
            <svg viewBox="0 0 600 520" width={936} height={520}><Struggle /></svg>
          </div>
        </div>
        <Center top={880} gap={26}>
          <Entrance delay={Math.round(0.4 * fps)} y={40}><div style={{ ...bn(92, 700), color: c.primary }}>{lines[0]}!</div></Entrance>
          <WordReveal text={lines[1].replace(" Arabic Master!", "")} delay={Math.round(0.9 * fps)} per={4} style={{ ...bn(60, 600), maxWidth: 900 }} gap={14} />
          <div style={{ marginTop: 10, transform: `scale(${breathe})` }}>
            <BrandLogo size={132} delay={Math.round(1.5 * fps)} shadow />
          </div>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  if (variant === "series") {
    const grid = Array.from({ length: 30 });
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <Center top={300} gap={34}>
          <div style={{ opacity: Math.min(1, pop), transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])}) rotate(-2deg)` }}>
            <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 240, lineHeight: 1, color: c.text, letterSpacing: "-0.03em" }}>
              DAY <span style={{ color: c.primary }}>09</span>
            </div>
          </div>
          <Entrance delay={8} y={30}>
            <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 56, color: c.text, background: c.accent, padding: "4px 40px 10px", borderRadius: 22, letterSpacing: "0.06em" }}>
              SURVIVAL ARABIC
            </div>
          </Entrance>
        </Center>
        <div style={{ position: "absolute", left: 120, right: 120, top: 720 + SHIFT, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 18 }}>
          {grid.map((_, i) => {
            const p = ramp(frame, 12 + i * 2, 24 + i * 2);
            const done = i < 9;
            return (
              <div key={i} style={{ height: 90, borderRadius: 24, background: done ? (i === 8 ? c.accent : c.primary) : c.primaryMid, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 40, color: done ? c.white : c.textSoft, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})` }}>
                {i + 1}
              </div>
            );
          })}
        </div>
        {/* grid: 5 rows × 90 + 4 × 18 gap = 522px → ends at 720 + 522 = 1242; text starts below with breathing room */}
        <Center top={1310}>
          <Entrance delay={14} y={30}><div lang="bn" style={{ ...bn(58, 600), maxWidth: 900 }}>{script.intro.series}</div></Entrance>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  if (variant === "progress") {
    return (
      <AbsoluteFill><SceneExit>
        <Corner />
        <Center top={330} gap={50}>
          <Entrance delay={0} y={30}><div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 40, letterSpacing: "0.16em", color: c.textDim }}>SENTENCES LEARNED</div></Entrance>
          <div style={{ transform: `scale(${breathe})` }}><Counter from={0} to={script.episode.learnedBefore} delay={6} dur={50} /></div>
          <Entrance delay={10} y={30}><SeriesProgressBar days={script.episode.learnedBefore / 10 * ramp(frame, 8, 58)} /></Entrance>
        </Center>
        <Center top={1000}>
          <Entrance delay={18} y={30}><div lang="bn" style={{ ...bn(58, 600), maxWidth: 900 }}>{script.intro.progress}</div></Entrance>
        </Center>
      </SceneExit></AbsoluteFill>
    );
  }

  // preview
  const sentencesText = script.intro.preview.split(/(?<=[।!?])\s+/);
  return (
    <AbsoluteFill><SceneExit>
      <Corner />
      <Center top={290} gap={20}>
        <Entrance delay={0} y={30}><div lang="bn" style={{ ...bn(64, 700) }}>আজ শিখব</div></Entrance>
        <div style={{ opacity: Math.min(1, pop), transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])}) scale(${breathe})` }}>
          <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 250, lineHeight: 1.02, color: c.primary, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
            81<span style={{ color: c.accent }}>–</span>90
          </div>
        </div>
        <Entrance delay={10} y={30}><div lang="bn" style={{ ...bn(60, 600) }}>{sentencesText[0].replace("আজ শিখব ", "")}</div></Entrance>
      </Center>
      <div style={{ position: "absolute", left: 96, right: 96, top: 920 + SHIFT, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 26 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const p = ramp(frame, 16 + i * 4, 32 + i * 4);
          return (
            <div key={i} style={{ height: 128, borderRadius: 32, background: c.white, border: `3px solid ${c.line}`, boxShadow: `0 18px 40px -20px ${c.primaryMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 54, color: i === 0 ? c.primary : c.text, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})` }}>
              {81 + i}
            </div>
          );
        })}
      </div>
      <Center top={1290}>
        <WordReveal text={sentencesText[1]} delay={Math.round(2.4 * fps)} per={3} style={{ ...bn(54, 600), maxWidth: 900 }} gap={12} />
      </Center>
    </SceneExit></AbsoluteFill>
  );
};

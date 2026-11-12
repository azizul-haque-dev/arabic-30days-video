import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { breathe, entrance, prog, springIn } from "../lib/anim";
import { CONTENT_W, MARGIN } from "../lib/layout";
import { toBengaliDigits } from "../lib/format";
import { episodeConfig, progress } from "../episodes/day-18/config";
import { EpisodeThumbnail } from "./EpisodeThumbnail";
import { Abs, FitText } from "./FitText";
import { Chip } from "./Chip";
import { SceneShell } from "./SceneShell";
import { TopBar } from "./TopBar";
import { Shift } from "./Shift";
import { BrandLogo } from "./BrandLogo";
import { ProgressBar } from "./ProgressIndicator";
import { ConfidentPair, OfficeMini, RestaurantMini } from "../episodes/day-18/illustrations/minis";

type P = { durationInFrames: number };
const C = theme.colors;
const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", borderRadius: 40, overflow: "hidden", background: C.white, boxShadow: `0 18px 40px ${C.shadow}`,
  border: `4px solid ${C.white}`, boxSizing: "border-box", ...extra,
});
const num = (size: number, color: string): React.CSSProperties => ({
  fontFamily: theme.fonts.en, fontWeight: 700, fontSize: size, lineHeight: 1, color, fontVariantNumeric: "tabular-nums",
});

/** Scene 1 — thumbnail is the opening frame (fully visible at frame 0). */
export const OpeningScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} noExit>
      <EpisodeThumbnail frame={frame} fps={fps} />
    </SceneShell>
  );
};

/** Scene 2 — split screen: restaurant | workplace. */
export const IntroSplitScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = entrance(frame, fps, 4, { x: -60, y: 0 });
  const r = entrance(frame, fps, 12, { x: 60, y: 0 });
  const speech = Math.max(0, Math.sin(frame / 6));
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <TopBar frame={frame} fps={fps} />
      <div style={card({ left: MARGIN, top: 340, width: 450, height: 760, ...l })}><RestaurantMini frame={frame} fps={fps} w={442} h={752} speech={speech} /></div>
      <div style={card({ left: MARGIN + 490, top: 340, width: 450, height: 760, ...r })}><OfficeMini frame={frame} fps={fps} w={442} h={752} speech={speech} /></div>
      <Abs x={MARGIN} y={1130} w={450} h={90} style={entrance(frame, fps, 18, { y: 14 })}><Chip label="Restaurant" size={36} /></Abs>
      <Abs x={MARGIN + 490} y={1130} w={450} h={90} style={entrance(frame, fps, 24, { y: 14 })}><Chip label="Workplace" size={36} bg={C.accent} color={C.text} /></Abs>
      <Abs x={MARGIN} y={1270} w={CONTENT_W} h={200} style={entrance(frame, fps, 30, { y: 18 })}>
        <FitText text="অর্ডার করার সময় এবং কর্মস্থলে কথা বলার সময়" width={CONTENT_W} maxLines={2} maxSize={64} minSize={48} weight={600} />
      </Abs>
    </SceneShell>
  );
};

/** Scene 3 — confident conversation + confidence meter. */
export const IntroConfidenceScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <TopBar frame={frame} fps={fps} />
      <div style={card({ left: MARGIN, top: 340, width: CONTENT_W, height: 560, ...entrance(frame, fps, 0, { y: 20, scale: 0.97 }) })}>
        <ConfidentPair frame={frame} fps={fps} w={932} h={552} />
      </div>
      <Abs x={MARGIN} y={950} w={CONTENT_W} h={90} style={entrance(frame, fps, 14, { y: 14 })}>
        <FitText text="আত্মবিশ্বাস" width={CONTENT_W} maxLines={1} maxSize={60} minSize={48} weight={600} color={C.textDim} />
      </Abs>
      <div style={{ position: "absolute", left: MARGIN, top: 1060, ...entrance(frame, fps, 18, { y: 14 }) }}>
        <ProgressBar frame={frame} delay={26} value={100} dur={60} height={56} />
      </div>
      <Abs x={MARGIN} y={1180} w={CONTENT_W} h={200} style={entrance(frame, fps, 36, { y: 18 })}>
        <FitText text="কনফিডেন্স বহুগুণ বাড়বে" width={CONTENT_W} maxLines={2} maxSize={76} minSize={52} color={C.primaryDark} />
      </Abs>
    </SceneShell>
  );
};

/** Scene 4 — "Day 18" title with animated number. */
export const IntroTitleScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.round(interpolate(frame, [4, 26], [0, episodeConfig.day], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pop = springIn(frame, fps, 4, theme.spring.bouncy);
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Shift dy={110}>
      <Abs x={MARGIN} y={300} w={CONTENT_W} h={150} style={entrance(frame, fps, 0, { y: -20 })}><span style={num(124, C.primary)}>DAY</span></Abs>
      <Abs x={MARGIN} y={460} w={CONTENT_W} h={400} style={{ transform: `scale(${0.8 + 0.2 * Math.min(pop, 1.08)})`, opacity: prog(frame, 2, 8) }}>
        <span style={num(380, C.accent)}>{n}</span>
      </Abs>
      <Abs x={MARGIN} y={890} w={CONTENT_W} h={100} style={entrance(frame, fps, 16, { y: 18 })}>
        <FitText text={episodeConfig.series} script="en" width={CONTENT_W} maxLines={1} maxSize={64} minSize={48} />
      </Abs>
      <Abs x={MARGIN} y={1020} w={CONTENT_W} h={150} style={entrance(frame, fps, 22, { y: 18 })}>
        <FitText text="৩০ দিনের সারভাইভাল আরবিক সিরিজ" width={CONTENT_W} maxLines={2} maxSize={56} minSize={44} weight={600} color={C.textDim} />
      </Abs>
      <Abs x={MARGIN} y={1260} w={CONTENT_W} h={120} style={entrance(frame, fps, 28, { y: 18 })}><BrandLogo size={100} /></Abs>
    </Shift>
    </SceneShell>
  );
};

/** Scene 5 — 170/300 · 56.67%. Counters settle on the exact values early; final labels are always exact. */
export const IntroProgressScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = prog(frame, 6, 34, theme.ease.out);
  const done = Math.round(episodeConfig.previousCompleted * t);
  const pct = (progress.before * t).toFixed(2);
  const pctLabel = t >= 1 ? progress.beforeLabel : `${Number(pct)}%`;
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <TopBar frame={frame} fps={fps} />
      <Shift dy={150}>
      <Abs x={MARGIN} y={340} w={CONTENT_W} h={100} style={entrance(frame, fps, 0, { y: 14 })}>
        <FitText text="এখন পর্যন্ত শেখা বাক্য" width={CONTENT_W} maxLines={1} maxSize={60} minSize={48} weight={600} color={C.textDim} />
      </Abs>
      <Abs x={MARGIN} y={460} w={CONTENT_W} h={230}>
        <span style={num(190, C.primary)}>{done}<span style={{ color: C.textDim, fontSize: 120 }}> / {episodeConfig.totalSeries}</span></span>
      </Abs>
      <div style={{ position: "absolute", left: MARGIN, top: 770, ...entrance(frame, fps, 8, { y: 14 }) }}>
        <ProgressBar frame={frame} delay={6} value={progress.before} dur={34} height={56} />
      </div>
      <Abs x={MARGIN} y={880} w={CONTENT_W} h={170}><span style={num(130, C.accent)}>{pctLabel}</span></Abs>
    </Shift>
    </SceneShell>
  );
};

/** Scene 6 — 10 new sentences, range 171–180. */
export const IntroCountScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [a, b] = episodeConfig.sentenceRange;
  const ids = Array.from({ length: b - a + 1 }, (_, i) => a + i);
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <TopBar frame={frame} fps={fps} />
      <Shift dy={100}>
      <Abs x={MARGIN} y={340} w={CONTENT_W} h={100} style={entrance(frame, fps, 0, { y: 14 })}>
        <FitText text="আজ নতুন" width={CONTENT_W} maxLines={1} maxSize={60} minSize={48} weight={600} color={C.textDim} />
      </Abs>
      <Abs x={MARGIN} y={450} w={CONTENT_W} h={340} style={entrance(frame, fps, 4, { y: 20, scale: 0.8 })}><span style={num(320, C.primary)}>10</span></Abs>
      <Abs x={MARGIN} y={800} w={CONTENT_W} h={120} style={entrance(frame, fps, 10, { y: 16 })}>
        <FitText text="নতুন আরবি বাক্য" width={CONTENT_W} maxLines={1} maxSize={76} minSize={52} />
      </Abs>
      {ids.map((id, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        return (
          <div key={id} style={{ position: "absolute", left: MARGIN + col * (168 + 25), top: 990 + row * (140 + 24), width: 168, height: 140, borderRadius: 28, background: i === 0 || i === 9 ? C.accent : C.white, boxShadow: `0 10px 24px ${C.shadow}`, display: "flex", alignItems: "center", justifyContent: "center", ...entrance(frame, fps, 14 + i * 3, { y: 24, scale: 0.9 }) }}>
            <span style={num(56, C.text)}>{id}</span>
          </div>
        );
      })}
      <Abs x={MARGIN} y={1340} w={CONTENT_W} h={100} style={entrance(frame, fps, 48, { y: 14 })}>
        <Chip label={`${a} – ${b}`} size={40} bg={C.primary} />
      </Abs>
    </Shift>
    </SceneShell>
  );
};

/** Scene 7 — transition: skeleton of the learning layout, then "let's start". */
export const IntroLayoutScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = (w: number, h: number, color: string, delay: number): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: color, ...entrance(frame, fps, delay, { y: 20 }) });
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <TopBar frame={frame} fps={fps} />
      <Shift dy={40}>
      <div style={card({ left: MARGIN, top: 340, width: CONTENT_W, height: 760, padding: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 36, ...entrance(frame, fps, 0, { y: 30, scale: 0.96 }) })}>
        <div style={{ width: "100%", height: 300, borderRadius: 28, background: C.bgAlt }} />
        <div style={bar(760, 56, C.primary, 6)} />
        <div style={bar(460, 34, C.line, 10)} />
        <div style={bar(600, 40, C.accentSoft, 14)} />
      </div>
      <Abs x={MARGIN} y={1180} w={CONTENT_W} h={200} style={entrance(frame, fps, 10, { y: 24 })}>
        <FitText text="চলুন শুরু করা যাক" width={CONTENT_W} maxLines={1} maxSize={96} minSize={64} color={C.primary} style={{ transform: `translateY(${breathe(frame, fps, 3, 2)}px)` }} />
      </Abs>
      <Abs x={MARGIN} y={1420} w={CONTENT_W} h={90}>
        <Chip label={`বাক্য ${toBengaliDigits(171)}`} bn size={34} bg={C.accent} color={C.text} style={entrance(frame, fps, 16, { y: 10 })} />
      </Abs>
    </Shift>
    </SceneShell>
  );
};

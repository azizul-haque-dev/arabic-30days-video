import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { breathe, entrance, prog, springIn } from "../lib/anim";
import { CONTENT_W, MARGIN } from "../lib/layout";
import { episodeConfig, progress } from "../episodes/day-18/config";
import { Abs, FitText } from "./FitText";
import { Chip } from "./Chip";
import { SceneShell } from "./SceneShell";
import { BrandLogo, LogoMark } from "./BrandLogo";
import { ProgressBar } from "./ProgressIndicator";
import { PracticeReminder } from "./PracticeReminder";
import { Shift } from "./Shift";
import { ArrowIcon, CheckIcon, LikeIcon, PlusIcon, ShareIcon } from "./Icons";
import { Bubble, Dots, Person, Stage } from "../episodes/day-18/illustrations/kit";

type P = { durationInFrames: number };
const C = theme.colors;
const I = theme.illus;
const num = (size: number, color: string): React.CSSProperties => ({ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: size, lineHeight: 1, color, fontVariantNumeric: "tabular-nums" });

/** Outro 1 — 10 completed items with check marks. */
export const OutroDoneScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [a, b] = episodeConfig.sentenceRange;
  const ids = Array.from({ length: b - a + 1 }, (_, i) => a + i);
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Shift dy={100}>
      <Abs x={MARGIN} y={330} w={CONTENT_W} h={130} style={entrance(frame, fps, 0, { y: -16 })}>
        <FitText text="Lesson Complete" script="en" width={CONTENT_W} maxLines={1} maxSize={104} minSize={70} color={C.primary} />
      </Abs>
      <Abs x={MARGIN} y={480} w={CONTENT_W} h={110} style={entrance(frame, fps, 6, { y: 14 })}>
        <FitText text="আজকের ১০টি বাক্য সম্পন্ন" width={CONTENT_W} maxLines={1} maxSize={64} minSize={48} weight={600} />
      </Abs>
      {ids.map((id, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const d = 14 + i * 5;
        return (
          <div key={id} style={{ position: "absolute", left: MARGIN + col * (168 + 25), top: 680 + row * (230 + 28), width: 168, height: 230, borderRadius: 30, background: C.white, boxShadow: `0 10px 24px ${C.shadow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, ...entrance(frame, fps, d, { y: 24, scale: 0.9 }) }}>
            <span style={num(52, C.text)}>{id}</span>
            <div style={{ width: 82, height: 82, borderRadius: 41, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckIcon size={52} color={C.white} draw={prog(frame, d + 8, 12)} />
            </div>
          </div>
        );
      })}
      <Abs x={MARGIN} y={1250} w={CONTENT_W} h={100} style={entrance(frame, fps, 70, { y: 14 })}>
        <Chip label={`${a} – ${b}`} size={40} bg={C.accent} color={C.text} />
      </Abs>
    </Shift>
    </SceneShell>
  );
};

/** Outro 2 — practice reminder: say each sentence three times. */
export const OutroPracticeScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = (frame % 30) / 30;
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{ position: "absolute", left: MARGIN, top: 330, width: CONTENT_W, height: 520, borderRadius: 44, overflow: "hidden", background: C.white, boxShadow: `0 18px 40px ${C.shadow}`, border: `4px solid ${C.white}`, boxSizing: "border-box", ...entrance(frame, fps, 0, { y: 20, scale: 0.97 }) }}>
        <Stage w={932} h={512} floorY={440}>
          <Person x={330} y={452} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 60, armL: 12, mouth: Math.abs(Math.sin(frame / 4)), bob: breathe(frame, fps, 1.4, 2.4) }} />
          {[0, 1, 2].map((i) => {
            const t = (pulse + i / 3) % 1;
            return <path key={i} d={`M${430 + i * 0} 210 q${34 + t * 30} 26 0 52`} stroke={C.primary} strokeWidth="8" fill="none" strokeLinecap="round" opacity={(1 - t) * 0.9} transform={`translate(${t * 120 + i * 26} 0)`} />;
          })}
          <Bubble x={640} y={150} w={230} h={110} tail="left">
            <Dots x={0} y={0} active={Math.floor(frame / 8) % 3} r={11} />
          </Bubble>
        </Stage>
      </div>
      <div style={{ position: "absolute", left: MARGIN, top: 920, width: CONTENT_W, display: "flex", justifyContent: "center" }}>
        <PracticeReminder frame={frame} fps={fps} delay={30} step={22} />
      </div>
      <Abs x={MARGIN} y={1180} w={CONTENT_W} h={220} style={entrance(frame, fps, 14, { y: 20 })}>
        <FitText text="প্রতিটি বাক্য অন্তত তিনবার বলুন" width={CONTENT_W} maxLines={2} maxSize={76} minSize={52} color={C.primaryDark} />
      </Abs>
    </SceneShell>
  );
};

/** Outro 3 — 30-day goal: calendar, 10/day, 300 total, progress → 60%. */
export const OutroGoalScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cells = Array.from({ length: 30 }, (_, i) => i + 1);
  const t = prog(frame, 70, 50, theme.ease.inOut);
  const shown = t >= 1 ? progress.afterLabel : `${Number((progress.after * t).toFixed(2))}%`;
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Abs x={MARGIN} y={250} w={CONTENT_W} h={90} style={entrance(frame, fps, 0, { y: -12 })}>
        <FitText text="৩০ দিনের সারভাইভাল আরবিক" width={CONTENT_W} maxLines={1} maxSize={56} minSize={44} weight={600} color={C.textDim} />
      </Abs>
      {cells.map((d, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const done = d <= episodeConfig.day;
        const isToday = d === episodeConfig.day;
        const delay = 6 + i * 2;
        return (
          <div key={d} style={{ position: "absolute", left: MARGIN + 95 + col * (110 + 18), top: 370 + row * (110 + 18), width: 110, height: 110, borderRadius: 26, background: isToday ? C.accent : done ? C.primary : C.white, boxShadow: `0 8px 18px ${C.shadow}`, display: "flex", alignItems: "center", justifyContent: "center", ...entrance(frame, fps, delay, { y: 16, scale: 0.9 }) }}>
            <span style={num(44, done ? C.white : C.textDim)}>{d}</span>
          </div>
        );
      })}
      <Abs x={MARGIN} y={1040} w={CONTENT_W} h={110} style={entrance(frame, fps, 44, { y: 14 })}>
        <FitText text="প্রতিদিন ১০টি বাক্য  =  ৩০০ বাক্য" width={CONTENT_W} maxLines={1} maxSize={60} minSize={44} weight={600} />
      </Abs>
      <Abs x={MARGIN} y={1190} w={CONTENT_W} h={150} style={entrance(frame, fps, 56, { y: 14 })}>
        <span style={num(120, C.primary)}>{episodeConfig.currentCompleted}<span style={{ color: C.textDim, fontSize: 80 }}> / {episodeConfig.totalSeries}</span></span>
      </Abs>
      <div style={{ position: "absolute", left: MARGIN, top: 1370, ...entrance(frame, fps, 60, { y: 14 }) }}>
        <ProgressBar frame={frame} delay={70} value={progress.after} dur={50} height={52} />
      </div>
      <Abs x={MARGIN} y={1450} w={CONTENT_W} h={150}><span style={num(112, C.accent)}>{shown}</span></Abs>
    </SceneShell>
  );
};

/** Outro 4 — like & share. */
export const OutroShareScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const like = springIn(frame, fps, 6, theme.spring.bouncy);
  const share = springIn(frame, fps, 24, theme.spring.bouncy);
  const btn = (bg: string): React.CSSProperties => ({ position: "absolute", top: 520, width: 450, height: 450, borderRadius: 56, background: bg, boxShadow: `0 22px 44px ${C.shadow}`, display: "flex", alignItems: "center", justifyContent: "center" });
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Shift dy={110}>
      <div style={{ ...btn(C.primary), left: MARGIN, transform: `scale(${Math.min(like, 1.06)})`, opacity: prog(frame, 6, 8) }}>
        <div style={{ transform: `rotate(${-14 * (1 - like)}deg)` }}><LikeIcon size={230} color={C.white} /></div>
      </div>
      <div style={{ ...btn(C.accent), left: MARGIN + 490, transform: `scale(${Math.min(share, 1.06)})`, opacity: prog(frame, 24, 8) }}>
        <ShareIcon size={230} color={C.text} />
      </div>
      <Abs x={MARGIN} y={1080} w={450} h={100} style={entrance(frame, fps, 16, { y: 14 })}><FitText text="লাইক দিন" width={450} maxLines={1} maxSize={64} minSize={48} /></Abs>
      <Abs x={MARGIN + 490} y={1080} w={450} h={100} style={entrance(frame, fps, 34, { y: 14 })}><FitText text="শেয়ার করুন" width={450} maxLines={1} maxSize={64} minSize={48} /></Abs>
    </Shift>
    </SceneShell>
  );
};

/** Outro 5 — follow CTA on a clean green background. */
export const OutroFollowScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = springIn(frame, fps, 0, theme.spring.bouncy);
  const btn = springIn(frame, fps, 30, theme.spring.bouncy);
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Shift dy={50}>
      <Abs x={MARGIN} y={470} w={CONTENT_W} h={280} style={{ transform: `scale(${Math.min(pop, 1.06)})`, opacity: prog(frame, 0, 8) }}><LogoMark size={260} /></Abs>
      <Abs x={MARGIN} y={790} w={CONTENT_W} h={170} style={entrance(frame, fps, 10, { y: 20 })}>
        <FitText text="আরবিক মাস্টার" width={CONTENT_W} maxLines={1} maxSize={110} minSize={72} color={C.primaryDark} />
      </Abs>
      <Abs x={MARGIN} y={970} w={CONTENT_W} h={90} style={entrance(frame, fps, 16, { y: 16 })}>
        <FitText text="Arabic Master" script="en" width={CONTENT_W} maxLines={1} maxSize={60} minSize={44} weight={600} color={C.textDim} />
      </Abs>
      <Abs x={MARGIN} y={1140} w={CONTENT_W} h={150} style={{ transform: `scale(${Math.min(btn, 1.06)})`, opacity: prog(frame, 30, 8) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 140, padding: "0 70px", borderRadius: 70, background: C.accent, boxShadow: `0 16px 34px ${C.shadow}` }}>
          <PlusIcon size={64} color={C.text} />
          <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 70, color: C.text }}>Follow</span>
        </div>
      </Abs>
      <Abs x={MARGIN} y={1340} w={CONTENT_W} h={200} style={entrance(frame, fps, 40, { y: 16 })}>
        <FitText text="প্রতিদিন নতুন নতুন আরবি শেখার জন্য" width={CONTENT_W} maxLines={2} maxSize={56} minSize={44} weight={600} />
      </Abs>
    </Shift>
    </SceneShell>
  );
};

/** Outro 6 — Day 19 teaser. */
export const OutroNextScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Shift dy={60}>
      <Abs x={MARGIN} y={520} w={CONTENT_W} h={130} style={entrance(frame, fps, 0, { y: -16 })}>
        <FitText text="আগামী পর্বে" width={CONTENT_W} maxLines={1} maxSize={88} minSize={60} weight={600} color={C.textDim} />
      </Abs>
      <Abs x={MARGIN} y={680} w={CONTENT_W} h={300} style={entrance(frame, fps, 8, { x: 140, y: 0, scale: 0.9 })}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <span style={num(210, C.primary)}>DAY</span>
          <span style={num(210, C.accent)}>{episodeConfig.nextDay}</span>
        </div>
      </Abs>
      <Abs x={MARGIN} y={1040} w={CONTENT_W} h={120} style={entrance(frame, fps, 20, { y: 14 })}>
        <div style={{ transform: `translateX(${breathe(frame, fps, 10, 1.2)}px)` }}><ArrowIcon size={100} color={C.primary} /></div>
      </Abs>
      <Abs x={MARGIN} y={1200} w={CONTENT_W} h={100} style={entrance(frame, fps, 26, { y: 14 })}>
        <Chip label="Next Episode" size={40} bg={C.primary} />
      </Abs>
    </Shift>
    </SceneShell>
  );
};

/** Outro 7 — final logo, smooth fade-out to a clean final frame. */
export const OutroFinalScene: React.FC<P> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Abs x={MARGIN} y={760} w={CONTENT_W} h={200} style={entrance(frame, fps, 0, { y: 14, scale: 0.92 })}><BrandLogo size={150} /></Abs>
      <Abs x={MARGIN} y={1010} w={CONTENT_W} h={110} style={entrance(frame, fps, 6, { y: 14 })}>
        <FitText text="মা'আস সালামা" width={CONTENT_W} maxLines={1} maxSize={72} minSize={52} weight={600} color={C.textDim} />
      </Abs>
    </SceneShell>
  );
};


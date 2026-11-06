import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { toBn } from "../lib/bn";
import { useBreathe, useEnter } from "../lib/anim";
import type { EpisodeConfig } from "../types";
import { theme } from "../theme";
import { font, LogoMark } from "./Brand";

const c = theme.colors;

const Pop: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const p = useEnter(delay, theme.spring.bouncy);
  return (
    <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + 0.3 * p})`, ...style }}>
      {children}
    </div>
  );
};

const useCount = (to: number, from: number, delay: number, dur: number): number => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.inOut,
  });
  return Math.round(v);
};

const Sparkles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      {[[90, 110, 26, 0], [760, 70, 20, 2], [800, 420, 16, 4], [60, 440, 18, 1]].map(([x, y, s, ph], i) => (
        <svg key={i} style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
          <path
            d="M0 -1 C0.15 -0.3 0.3 -0.15 1 0 C0.3 0.15 0.15 0.3 0 1 C-0.15 0.3 -0.3 0.15 -1 0 C-0.3 -0.15 -0.15 -0.3 0 -1Z"
            transform={`scale(${s! * (0.6 + 0.4 * Math.sin(t * 3 + ph!))})`}
            fill={i % 2 ? c.primary : c.accent}
          />
        </svg>
      ))}
    </>
  );
};

const LogoVisual: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const b = useBreathe(8, 3);
  const w = useEnter(10, theme.spring.snappy);
  return (
    <div style={{ position: "relative", width: 880, height: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
      <Sparkles />
      <Pop style={{ transform: `translateY(${b}px)` }}>
        <div style={{ filter: "drop-shadow(0 28px 36px rgba(14,159,110,0.35))" }}>
          <LogoMark size={300} uid="big" />
        </div>
      </Pop>
      <div style={{ ...font, fontSize: 92, fontWeight: 700, color: c.text, letterSpacing: -2, opacity: w, transform: `translateY(${(1 - w) * 30}px)` }}>
        {ep.brandName}
      </div>
    </div>
  );
};

const DayGridVisual: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = 6;
  const pulse = 1 + 0.06 * Math.sin((frame / fps) * 5);
  return (
    <div style={{ position: "relative", width: 880, height: 600, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: 22 }}>
      {Array.from({ length: ep.totalDays }, (_, i) => {
        const day = i + 1;
        const done = day < ep.episodeNumber;
        const cur = day === ep.episodeNumber;
        return (
          <DayDot key={day} i={i} cols={cols} day={day} done={done} cur={cur} pulse={cur ? pulse : 1} />
        );
      })}
    </div>
  );
};

const DayDot: React.FC<{ i: number; cols: number; day: number; done: boolean; cur: boolean; pulse: number }> = ({ i, day, done, cur, pulse }) => {
  const p = useEnter(i * 2, theme.spring.snappy);
  return (
    <div
      style={{
        width: 118,
        height: 118,
        borderRadius: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...font,
        fontSize: 46,
        fontWeight: 700,
        color: done || cur ? c.white : c.textDim,
        background: cur ? c.accent : done ? c.primary : c.white,
        border: done || cur ? "none" : `3px solid ${c.line}`,
        opacity: p,
        transform: `scale(${(0.5 + 0.5 * p) * pulse})`,
        boxShadow: cur ? "0 14px 34px rgba(245,158,11,0.45)" : done ? "0 8px 20px rgba(14,159,110,0.25)" : "none",
      }}
    >
      {toBn(day)}
    </div>
  );
};

const ProgressBar: React.FC<{ total: number; value: number; seg?: { from: number; to: number }; label: string; sub?: string }> = ({
  total,
  value,
  seg,
  label,
  sub,
}) => {
  const frame = useCurrentFrame();
  const barW = 840;
  const segP = seg ? interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out }) : 0;
  return (
    <div style={{ width: 880, height: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44, ...font }}>
      <Pop>
        <div style={{ fontSize: 190, fontWeight: 700, color: c.primary, lineHeight: 1.2, letterSpacing: -4 }}>
          {label}
          <span style={{ fontSize: 72, color: c.textDim, fontWeight: 600 }}>{sub}</span>
        </div>
      </Pop>
      <div style={{ position: "relative", width: barW, height: 64, borderRadius: 32, background: c.white, boxShadow: theme.shadow.card, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (barW * value) / total, background: `linear-gradient(90deg, ${c.primary}, ${c.primaryDark})`, borderRadius: 32 }} />
        {seg ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: (barW * seg.from) / total,
              width: ((barW * (seg.to - seg.from)) / total) * segP,
              background: c.accent,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const ProgressBefore: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const v = useCount(ep.completedBefore, 0, 6, 40);
  return <ProgressBar total={ep.totalSentences} value={v} label={toBn(v)} sub={` / ${toBn(ep.totalSentences)}`} />;
};

const ProgressRange: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => (
  <ProgressBar
    total={ep.totalSentences}
    value={ep.completedBefore}
    seg={{ from: ep.completedBefore, to: ep.completedSentences }}
    label={`${ep.sentenceStartNumber}–${ep.sentenceEndNumber}`}
  />
);

const ProgressAfter: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const v = useCount(ep.completedSentences, ep.completedBefore, 6, 40);
  return <ProgressBar total={ep.totalSentences} value={v} label={toBn(v)} sub={` / ${toBn(ep.totalSentences)}`} />;
};

const JourneyVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = 5;
  const x = interpolate(frame, [12, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.inOut });
  return (
    <div style={{ position: "relative", width: 880, height: 600 }}>
      <svg width={880} height={600} viewBox="0 0 880 600">
        <path d="M70 420 C 240 420 240 240 440 300 S 650 160 810 190" fill="none" stroke={c.line} strokeWidth={18} strokeLinecap="round" strokeDasharray="4 34" />
        {Array.from({ length: steps }, (_, i) => {
          const t = i / (steps - 1);
          const px = 70 + t * 740;
          const py = 420 - Math.sin(t * Math.PI) * 140 - t * 190 + 0;
          const done = t <= x + 0.001;
          return <circle key={i} cx={px} cy={py} r={i === steps - 1 ? 40 : 28} fill={done ? c.primary : c.white} stroke={c.primary} strokeWidth={6} />;
        })}
        {(() => {
          const px = 70 + x * 740;
          const py = 420 - Math.sin(x * Math.PI) * 140 - x * 190;
          return (
            <g transform={`translate(${px} ${py - 74})`}>
              <path d="M0 62 C-40 24 -34 -34 0 -34 C34 -34 40 24 0 62z" fill={c.accent} />
              <circle cx={0} cy={-6} r={14} fill={c.white} />
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

const CheckRing: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const frame = useCurrentFrame();
  const n = ep.sentences.length;
  const ring = interpolate(frame, [6, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.inOut });
  const tick = interpolate(frame, [38, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out });
  const R = 220;
  const circ = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: 880, height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Sparkles />
      <svg width={560} height={560} viewBox="0 0 560 560">
        <circle cx={280} cy={280} r={R} fill={c.white} stroke={c.mint} strokeWidth={40} />
        <circle
          cx={280}
          cy={280}
          r={R}
          fill="none"
          stroke={c.primary}
          strokeWidth={40}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - ring)}
          transform="rotate(-90 280 280)"
        />
        <path d="M190 290 L250 350 L372 214" fill="none" stroke={c.primary} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 * (1 - tick)} />
        <text x={280} y={448} textAnchor="middle" fontSize={64} fontWeight={700} fill={c.text} style={font}>
          {toBn(n)}/{toBn(n)}
        </text>
      </svg>
    </div>
  );
};

const PracticeVisual: React.FC = () => {
  const b1 = useBreathe(8, 2.4);
  const b2 = useBreathe(8, 2.4, 1.6);
  return (
    <div style={{ position: "relative", width: 880, height: 600 }}>
      <Pop style={{ position: "absolute", left: 40, top: 80, transform: `translateY(${b1}px)` }}>
        <svg width={520} height={260} viewBox="0 0 520 260">
          <path d="M40 10 h380 a40 40 0 0 1 40 40 v100 a40 40 0 0 1 -40 40 h-250 l-70 56 v-56 h-60 a40 40 0 0 1 -40 -40 v-100 a40 40 0 0 1 40 -40z" fill={c.primary} />
          {[0, 1, 2].map((i) => <rect key={i} x={110 + i * 110} y={100 - (i === 1 ? 30 : 8)} width={46} height={(i === 1 ? 60 : 16) + 16} rx={23} fill={c.white} />)}
        </svg>
      </Pop>
      <Pop delay={14} style={{ position: "absolute", right: 20, top: 300, transform: `translateY(${b2}px)` }}>
        <svg width={520} height={260} viewBox="0 0 520 260">
          <path d="M80 10 h380 a40 40 0 0 1 40 40 v100 a40 40 0 0 1 -40 40 h-60 v56 l-70 -56 h-250 a40 40 0 0 1 -40 -40 v-100 a40 40 0 0 1 40 -40z" fill={c.accent} />
          {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 110} y={100 - (i === 1 ? 6 : 30)} width={46} height={(i === 1 ? 16 : 60) + 16} rx={23} fill={c.white} />)}
        </svg>
      </Pop>
    </div>
  );
};

const FollowVisual: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const frame = useCurrentFrame();
  const tap = interpolate(frame, [40, 50, 60], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ripple = interpolate(frame, [48, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out });
  return (
    <div style={{ position: "relative", width: 880, height: 600, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
      <Pop>
        <div style={{ filter: "drop-shadow(0 20px 30px rgba(14,159,110,0.3))" }}>
          <LogoMark size={190} uid="fol" />
        </div>
      </Pop>
      <Pop delay={10}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -10, borderRadius: 999, border: `6px solid ${c.accent}`, opacity: 1 - ripple, transform: `scale(${1 + ripple * 0.35})` }} />
          <div
            style={{
              ...font,
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: c.primary,
              color: c.white,
              fontSize: 64,
              fontWeight: 700,
              padding: "26px 64px",
              borderRadius: 999,
              boxShadow: theme.shadow.glow,
              transform: `scale(${1 - tap * 0.06})`,
            }}
          >
            <svg width={54} height={54} viewBox="0 0 54 54"><path d="M27 8 v38 M8 27 h38" stroke={c.white} strokeWidth={9} strokeLinecap="round" /></svg>
            {ep.brandName}
          </div>
        </div>
      </Pop>
    </div>
  );
};

const CommentVisual: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const b = useBreathe(7, 2.6);
  return (
    <div style={{ position: "relative", width: 880, height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Pop style={{ transform: `translateY(${b}px)` }}>
        <div style={{ position: "relative", background: c.white, borderRadius: 64, padding: "58px 84px", boxShadow: theme.shadow.card }}>
          <div style={{ ...font, fontSize: 104, fontWeight: 700, color: c.primary, letterSpacing: -2 }}>{ep.ctaText}</div>
          <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 90, bottom: -58 }}>
            <path d="M0 0 H90 L20 70 Z" fill={c.white} />
          </svg>
        </div>
      </Pop>
      <Pop delay={16} style={{ position: "absolute", right: 70, top: 70 }}>
        <svg width={120} height={110} viewBox="0 0 120 110"><path d="M60 100 C-24 40 20 -14 60 28 C100 -14 144 40 60 100z" fill={theme.ill.red} /></svg>
      </Pop>
    </div>
  );
};

const NextVisual: React.FC<{ ep: EpisodeConfig }> = ({ ep }) => {
  const b = useBreathe(7, 2.6);
  const slide = useBreathe(14, 1.6);
  return (
    <div style={{ position: "relative", width: 880, height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Pop style={{ transform: `translateY(${b}px)` }}>
        <div style={{ ...font, display: "flex", alignItems: "center", gap: 36, background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`, color: c.white, borderRadius: 72, padding: "54px 80px", boxShadow: theme.shadow.glow }}>
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -3 }}>DAY {ep.nextEpisodeNumber}</div>
          <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: `translateX(${slide}px)` }}>
            <path d="M24 55 H84 M56 24 L88 55 L56 86" fill="none" stroke={c.accent} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Pop>
    </div>
  );
};

export const StageVisual: React.FC<{ kind: string; ep: EpisodeConfig }> = ({ kind, ep }) => {
  switch (kind) {
    case "logo": return <LogoVisual ep={ep} />;
    case "dayGrid": return <DayGridVisual ep={ep} />;
    case "progressBefore": return <ProgressBefore ep={ep} />;
    case "progressRange": return <ProgressRange ep={ep} />;
    case "journey": return <JourneyVisual />;
    case "checkRing": return <CheckRing ep={ep} />;
    case "progressAfter": return <ProgressAfter ep={ep} />;
    case "practice": return <PracticeVisual />;
    case "follow": return <FollowVisual ep={ep} />;
    case "comment": return <CommentVisual ep={ep} />;
    case "next": return <NextVisual ep={ep} />;
    default: throw new Error(`Unknown stage visual '${kind}'`);
  }
};

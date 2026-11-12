import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { EPISODE } from "../episode/day20";
import { Caption } from "../components/Caption";
import { Chip } from "../components/Chip";
import { endF, entry, startF } from "../timing";
import { ease, useBreath, useEnter, useFrame } from "../anim";

type Props = { sceneStart: number; sceneEnd: number };

const R = 210;
const STROKE = 40;
const CIRC = 2 * Math.PI * R;

/** 200 / 300 milestone + CTA + closing. SRT entries 64–69. */
export const MilestoneScene: React.FC<Props> = ({ sceneStart, sceneEnd }) => {
  const f = useFrame();
  const L = (n: number) => startF(n) - sceneStart;
  const E = (n: number) => endF(n) - sceneStart;
  const end = sceneEnd - sceneStart;
  const ringIn = useEnter(2, { y: 50, from: 0.8, config: theme.spring.pop });
  const fill = ease(f, 8, 70, theme.ease.out);
  const value = EPISODE.previous + (EPISODE.current - EPISODE.previous) * fill;
  const frac = value / EPISODE.total;
  const breath = useBreath(5, 80);
  const closing = ease(f, end - 20, end, theme.ease.in);
  const hit = ease(f, 70, 80, theme.ease.out) * (1 - ease(f, 80, 100, theme.ease.inOut));
  const cta = useEnter(L(66), { y: 30, from: 0.92 });

  // confetti (subtle, deterministic, kept inside the ring zone)
  const dots = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2 + 0.3;
    const rad = R + 40 + ((i * 37) % 70);
    const p = ease(f, 70 + (i % 4) * 3, 108 + (i % 4) * 3, theme.ease.out);
    return { x: Math.cos(a) * rad * p, y: Math.sin(a) * rad * p + p * p * 24, o: Math.min(ease(f, 70, 78), 1 - ease(f, 100, 124)), c: i % 3 === 0 ? theme.colors.amber : i % 3 === 1 ? theme.colors.primary : "#86EFAC", s: 7 + (i % 3) * 3 };
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - closing, transform: `scale(${1 - closing * 0.03})` }}>
      {/* ring */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, height: 520, display: "flex", justifyContent: "center", alignItems: "center", opacity: ringIn.opacity, transform: `${ringIn.transform} translateY(${breath}px)` }}>
        <div style={{ position: "relative", width: 480, height: 480 }}>
          <svg width={480} height={480} viewBox="-240 -240 480 480" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <circle r={R} fill={theme.colors.white} stroke={theme.colors.soft} strokeWidth={STROKE} />
            <circle r={R} fill="none" stroke={theme.colors.primary} strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={`${CIRC * frac} ${CIRC}`} transform="rotate(-90)" />
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={d.c} opacity={d.o} />
            ))}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${1 + hit * 0.06})` }}>
            <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 170, lineHeight: 1, letterSpacing: -4, color: theme.colors.dark }}>{Math.round(value)}</div>
            <div style={{ fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 56, color: theme.colors.muted, lineHeight: 1.2 }}>/ {EPISODE.total}</div>
          </div>
        </div>
      </div>

      {/* stat chips — each appears with its SRT entry */}
      <div style={{ position: "absolute", left: 100, top: 790 }}><Chip text="20 DAYS COMPLETED" start={L(64) + 24} tone="green" /></div>
      <div style={{ position: "absolute", left: 100, top: 890 }}><Chip text="100 SENTENCES TO GO" start={L(67)} tone="green" /></div>
      <div style={{ position: "absolute", left: 100, top: 990 }}><Chip text="DAY 21 — COMING NEXT" start={L(68)} tone="amber" /></div>

      {/* CTA row (share / follow) */}
      <div style={{ position: "absolute", left: 100, top: 1100, width: 880, display: "flex", gap: 24, opacity: cta.opacity, transform: cta.transform }}>
        <Chip text="শেয়ার করুন" start={L(66)} tone="dark" width={428} font="bn" icon={<ShareIcon />} />
        <Chip text="ফলো করুন" start={L(66) + 6} tone="dark" width={428} font="bn" icon={<FollowIcon />} />
      </div>

      {/* narration captions */}
      <div style={{ position: "absolute", left: 100, top: 1220, width: 880, height: 340 }}>
        {[64, 65, 66, 67, 68, 69].map((n, i, arr) => (
          <Caption key={n} text={entry(n).text} from={L(n)} to={i < arr.length - 1 ? L(arr[i + 1]) : end - 4} width={860} height={320} maxSize={54} maxLines={4} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ShareIcon: React.FC = () => (
  <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" />
  </svg>
);
const FollowIcon: React.FC = () => (
  <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M19 8v6M16 11h6" />
  </svg>
);

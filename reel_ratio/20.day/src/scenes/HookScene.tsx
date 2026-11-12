import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Caption } from "../components/Caption";
import { WorkplaceIllustration } from "../components/WorkplaceIllustration";
import { IllustrationKey } from "../episode/day20";
import { endF, entry, startF } from "../timing";
import { ease, TimeScale, useEnter, useExit } from "../anim";
import { Breathe, CardBox, Check, Clock, IdCard, Lines, Briefcase, Pop } from "../illustrations/kit";

type Props = { sceneStart: number; sceneEnd: number };
const { card } = theme.layout;

/** Opening hook: SRT entries 1–8 — task → meeting → Iqama → job search → "say it in Arabic". */
export const HookScene: React.FC<Props> = ({ sceneStart, sceneEnd }) => {
  const L = (n: number) => startF(n) - sceneStart;
  const end = sceneEnd - sceneStart;
  const frame = useCurrentFrame();
  const enter = useEnter(0, { y: 90, from: 0.97 });
  const exit = useExit(end, 8);

  // illustration phases (frames from the SRT entries that talk about them)
  const phases: { kind: IllustrationKey | "grid"; from: number; to: number; rate: number }[] = [
    { kind: "notMyTask", from: 0, to: L(5), rate: 1 },
    { kind: "meeting", from: L(5), to: L(6), rate: 1.7 },
    { kind: "iqamaExpired", from: L(6), to: L(7), rate: 1.6 },
    { kind: "jobSearch", from: L(7), to: L(8), rate: 1.7 },
    { kind: "grid", from: L(8), to: end, rate: 1.4 },
  ];

  return (
    <AbsoluteFill>
      {phases.map((p, i) => (
        <Sequence key={i} from={p.from} durationInFrames={p.to - p.from} layout="none">
          <Phase dur={p.to - p.from} last={i === phases.length - 1}>
            <TimeScale rate={p.rate}>{p.kind === "grid" ? <SlotGrid /> : <WorkplaceIllustration kind={p.kind} />}</TimeScale>
          </Phase>
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          left: card.x,
          top: card.y,
          width: card.w,
          height: card.h,
          boxSizing: "border-box",
          padding: card.pad,
          background: theme.colors.white,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: card.radius,
          boxShadow: theme.shadow.card,
          opacity: enter.opacity * (1 - exit),
          transform: `${enter.transform} translateY(${exit * 30}px)`,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i, arr) => (
            <Caption
              key={n}
              text={entry(n).text}
              from={L(n)}
              to={i < arr.length - 1 ? L(arr[i + 1]) : end}
              width={860}
              height={560}
              maxSize={n === 1 ? 96 : 72}
              minSize={44}
              maxLines={4}
              weight={700}
              color={n === 1 ? theme.colors.dark : theme.colors.text}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Fade/slide a phase in (fast) and out (faster) so phases chain smoothly. */
const Phase: React.FC<{ dur: number; last: boolean; children: React.ReactNode }> = ({ dur, last, children }) => {
  const f = useCurrentFrame();
  const i = ease(f, 0, 14, theme.ease.out);
  const o = last ? 0 : ease(f, dur - 7, dur, theme.ease.in);
  return (
    <AbsoluteFill style={{ opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 16}px) scale(${0.97 + 0.03 * i})` }}>{children}</AbsoluteFill>
  );
};

/** Final hook beat: the four situations as one tidy 2×2 grid. */
const SlotGrid: React.FC = () => {
  const { x, y, w, h } = theme.layout.illus;
  const tile = (i: number, cx: number, cy: number, children: React.ReactNode, tone: string) => (
    <Pop key={i} start={4 + i * 6} x={cx} y={cy} dy={30} from={0.8}>
      <rect width={440} height={260} rx={32} fill={tone} stroke={theme.colors.border} strokeWidth={3} />
      {children}
    </Pop>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg viewBox="0 0 960 580" width={w} height={h}>
        {tile(0, 20, 10, <g transform="translate(220 140) scale(1.1)"><Lines x={-90} y={-50} widths={[180, 120]} gap={30} color="#CBD5E1" h={16} /><circle cx={80} cy={50} r={22} fill={theme.colors.amber} /></g>, "#FFFFFF")}
        {tile(1, 500, 10, <Clock x={220} y={130} r={84} hour={10} min={0} />, "#FFFFFF")}
        {tile(2, 20, 300, <g transform="translate(70 40) scale(0.72)"><IdCard x={0} y={0} w={480} h={300} accent={theme.colors.danger} /></g>, "#FFFFFF")}
        {tile(3, 500, 300, <Breathe amp={3}><Briefcase x={220} y={140} s={1.5} /></Breathe>, "#FFFFFF")}
      </svg>
    </div>
  );
};

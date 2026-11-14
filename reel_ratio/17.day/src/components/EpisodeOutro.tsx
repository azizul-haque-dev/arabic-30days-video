import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { episode } from "../episodes/active";
import { cueOffset, cueStart } from "../episodes/timeline";
import { breathe, enterStyle, useEnter } from "../motion";
import { theme } from "../theme";
import { Column } from "./Column";
import { FitText } from "./FitText";
import { Logo, LogoMark } from "./Logo";
import { ProgressIndicator } from "./ProgressIndicator";
import { SceneShell } from "./SceneShell";

const c = theme.colors;
type BeatProps = { durationInFrames: number; startSec: number; cues: [number, number] };

/** Narration 1 — 170/300, 56.67% */
export const OutroProgressBeat: React.FC<BeatProps> = ({ durationInFrames }) => {
  const h1 = useEnter(0.0);
  const h2 = useEnter(0.12);
  const cnt = useEnter(0.2, "bouncy");
  const bar = useEnter(0.35);
  const pct = useEnter(0.5);
  const chip = useEnter(1.4, "bouncy");
  return (
    <SceneShell label="outro-progress" durationInFrames={durationInFrames}>
      <Column gap={24}>
        <FitText box="o-1" font="bn" weight={700} maxSize={84} maxW={880} color={c.primary} text="আজকের ১০টি সহ" style={enterStyle(h1, 26)} />
        <FitText box="o-2" font="bn" weight={700} maxSize={70} maxW={880} color={c.text} text="মোট ১৭০টি বাক্য শেষ" style={enterStyle(h2, 26)} />
        <ProgressIndicator
          from={episode.previousCompleted}
          to={episode.currentCompleted}
          total={episode.totalSeries}
          startSec={0.5}
          durSec={1.8}
          countStyle={enterStyle(cnt, 30, 0.9)}
          barStyle={enterStyle(bar, 24)}
          labelStyle={enterStyle(pct, 24)}
        />
        <div
          data-box="plus-ten"
          data-kind="chrome"
          style={{
            height: 80,
            padding: "0 44px",
            borderRadius: 40,
            background: c.accent,
            color: c.text,
            fontFamily: theme.fonts.en,
            fontWeight: 800,
            fontSize: 44,
            lineHeight: "80px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            ...enterStyle(chip, 30, 0.7),
          }}
        >
          +10 TODAY
        </div>
      </Column>
    </SceneShell>
  );
};

const IconCard: React.FC<{ box: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ box, style, children }) => (
  <div
    data-box={box}
    data-kind="chrome"
    style={{
      width: 300,
      height: 300,
      borderRadius: 60,
      background: c.white,
      boxShadow: `0 24px 60px ${c.shadow}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Narration 2 — save + repeat practice */
export const SaveBeat: React.FC<BeatProps> = ({ durationInFrames, startSec, cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueAt = cueOffset(cues[0], startSec);
  const a = useEnter(cueAt, "bouncy");
  const b = useEnter(cueAt, "bouncy");
  const t1 = useEnter(cueAt);
  const t2 = useEnter(cueAt);
  const spin = (frame / fps) * 140;
  return (
    <SceneShell label="save" durationInFrames={durationInFrames}>
      <Column gap={64}>
        <div style={{ display: "flex", gap: 60, flexShrink: 0 }}>
          <IconCard box="save-icon" style={enterStyle(a, 40, 0.6)}>
            <svg width={170} height={170} viewBox="0 0 24 24">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" fill={c.accent} stroke={c.text} strokeWidth={1.2} strokeLinejoin="round" />
              <path d="M8.5 8.5h7" stroke={c.white} strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </IconCard>
          <IconCard box="repeat-icon" style={enterStyle(b, 40, 0.6)}>
            <svg width={170} height={170} viewBox="0 0 24 24" style={{ transform: `rotate(${spin}deg)` }}>
              <path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" fill="none" stroke={c.primary} strokeWidth={2.2} strokeLinecap="round" />
              <path d="M18.5 2.5v4.2h-4.2M5.5 21.5v-4.2h4.2" fill="none" stroke={c.primary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconCard>
        </div>
        <FitText box="save-1" font="bn" weight={700} maxSize={88} maxW={880} color={c.text} text="ভিডিওটি সেভ করুন" style={enterStyle(t1, 26)} />
        <FitText box="save-2" font="bn" weight={700} maxSize={80} maxW={880} color={c.primary} text="বারবার প্র্যাকটিস করুন" style={enterStyle(t2, 26)} />
      </Column>
    </SceneShell>
  );
};

/** Narration 3 — follow CTA */
export const FollowBeat: React.FC<BeatProps> = ({ durationInFrames, startSec, cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueAt = cueOffset(cues[0], startSec);
  const logo = useEnter(cueAt, "bouncy");
  const btn = useEnter(cueAt, "bouncy");
  const txt = useEnter(cueAt);
  const pulse = 1 + breathe(frame, fps, 1.2) * 0.025;
  return (
    <SceneShell label="follow" durationInFrames={durationInFrames}>
      <Column gap={56}>
        <div style={{ flexShrink: 0, ...enterStyle(logo, 36, 0.8) }}>
          <Logo width={640} height={130} box="follow-logo" center />
        </div>
        <div
          data-box="follow-button"
          data-kind="chrome"
          style={{
            width: 560,
            height: 140,
            borderRadius: 70,
            background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
            boxShadow: `0 24px 50px ${c.shadow}`,
            color: c.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            fontFamily: theme.fonts.bn,
            fontWeight: 700,
            fontSize: 70,
            flexShrink: 0,
            ...enterStyle(btn, 30, 0.8),
            transform: `${enterStyle(btn, 30, 0.8).transform} scale(${pulse})`,
          }}
        >
          <svg width={60} height={60} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke={c.white} strokeWidth={3.2} strokeLinecap="round" />
          </svg>
          ফলো করুন
        </div>
        <FitText box="follow-text" font="bn" weight={600} maxSize={60} maxW={880} color={c.textSoft} text="পরের পর্বগুলো পেতে" style={enterStyle(txt, 24)} />
      </Column>
    </SceneShell>
  );
};

/** Narration 4+5 — Day 18 teaser, then logo closing with a clean final frame */
export const ClosingBeat: React.FC<BeatProps> = ({ durationInFrames, startSec, cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const byeAt = (cueStart(cues[1]) - startSec) * fps; // "আল্লাহ হাফেজ"
  const swap = byeAt;
  const phase2 = frame >= swap + 7;
  const phase1Exit = interpolate(frame, [swap - 0, swap + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.easing.in });

  const tt = useEnter(0.0);
  const num = useEnter(0.12, "bouncy");
  const rem = useEnter(0.3);

  const b1 = interpolate(frame, [swap + 7, swap + 7 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.easing.out });
  const fadeOut = interpolate(frame, [durationInFrames - Math.round(0.7 * fps), durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.easing.inOut,
  });

  return (
    <SceneShell label="closing" durationInFrames={durationInFrames} noExit>
      {!phase2 && (
        <Column gap={44}>
          <div style={{ display: "contents" }}>
            <FitText box="t-1" font="bn" weight={700} maxSize={90} maxW={880} color={c.textSoft} text="আগামীকাল" style={{ ...enterStyle(tt, 24), opacity: (enterStyle(tt, 24).opacity as number) * (1 - phase1Exit) }} />
            <div
              data-box="next-day"
              style={{
                width: 520,
                height: 520,
                borderRadius: "50%",
                background: c.accent,
                color: c.text,
                textAlign: "center",
                boxShadow: `0 30px 70px ${c.shadow}`,
                flexShrink: 0,
                ...enterStyle(num, 34, 0.6),
                opacity: (enterStyle(num, 34, 0.6).opacity as number) * (1 - phase1Exit),
              }}
            >
              <div style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 34, letterSpacing: 10, marginTop: 84 }}>DAY</div>
              <div style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 270, lineHeight: "290px" }}>{episode.nextDay}</div>
            </div>
            <FitText box="t-2" font="bn" weight={700} maxSize={70} maxW={880} color={c.primary} text="আবার দেখা হবে" style={{ ...enterStyle(rem, 24), opacity: (enterStyle(rem, 24).opacity as number) * (1 - phase1Exit) }} />
          </div>
        </Column>
      )}
      {phase2 && (
        <Column gap={70}>
          <div style={{ flexShrink: 0, ...enterStyle(b1, 30, 0.9) }}>
            <Logo width={720} height={140} box="closing-logo" center />
          </div>
          <FitText box="bye" font="bn" weight={800} maxSize={130} maxW={880} color={c.primary} text="আল্লাহ হাফেজ" style={{ ...enterStyle(b1, 24, 0.92), opacity: b1 * fadeOut }} />
        </Column>
      )}
    </SceneShell>
  );
};

export { LogoMark };

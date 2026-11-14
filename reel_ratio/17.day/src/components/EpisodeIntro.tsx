import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { episode } from "../episodes/active";
import { cueEnd, cueOffset, cueStart } from "../episodes/timeline";
import { breathe, enterStyle, useEnter } from "../motion";
import { theme } from "../theme";
import { Column } from "./Column";
import { FitText } from "./FitText";
import { LogoMark } from "./Logo";
import { ProgressIndicator } from "./ProgressIndicator";
import { SceneShell } from "./SceneShell";
import { VectorIllustration } from "./VectorIllustration";

const c = theme.colors;
const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

type BeatProps = { durationInFrames: number; startSec: number; cues: [number, number] };

/** Narration 2 — "Arabic Master পেজের পক্ষ থেকে আপনাদের স্বাগতম" */
export const WelcomeBeat: React.FC<BeatProps> = ({ durationInFrames, startSec, cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = useEnter(0.0, "bouncy");
  const l1 = useEnter(cueOffset(cues[0], startSec));
  const l2 = useEnter(cueOffset(cues[1], startSec));
  return (
    <SceneShell label="welcome" durationInFrames={durationInFrames}>
      <Column gap={56}>
        <div
          data-box="logo-mark"
          data-kind="chrome"
          style={{ width: 260, height: 260, flexShrink: 0, ...enterStyle(logo, 40, 0.5), filter: `drop-shadow(0 20px 30px ${c.shadow})` }}
        >
          <div style={{ transform: `translateY(${breathe(frame, fps, 3) * 5}px)` }}>
            <LogoMark size={260} />
          </div>
        </div>
        <FitText box="welcome-1" font="bn" weight={600} maxSize={60} maxW={880} color={c.textSoft} text={`${episode.brand} পেজের পক্ষ থেকে`} style={enterStyle(l1, 24)} />
        <FitText box="welcome-2" font="bn" weight={700} maxSize={120} maxW={880} color={c.primary} text="আপনাদের স্বাগতম" style={enterStyle(l2, 30)} />
      </Column>
    </SceneShell>
  );
};

/** Narration 3 — day 17, 30-Day Survival Arabic badge, animated number */
export const DayBeat: React.FC<BeatProps> = ({ durationInFrames, startSec, cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = useEnter(cueOffset(cues[0], startSec));
  const ring = useEnter(cueOffset(cues[1], startSec), "bouncy");
  const text = useEnter(cueOffset(cues[1], startSec));
  const cStart = cueOffset(cues[1], startSec) * fps;
  const cEndF = (cueEnd(cues[1]) - startSec) * fps;
  const count = interpolate(frame, [cStart, cEndF], [0, episode.day], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.easing.out });
  return (
    <SceneShell label="day" durationInFrames={durationInFrames}>
      <Column gap={50}>
        <div
          data-box="series-badge"
          data-kind="chrome"
          style={{
            height: 92,
            padding: "0 52px",
            borderRadius: 46,
            background: c.accent,
            color: c.text,
            fontFamily: theme.fonts.en,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 1,
            lineHeight: "92px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            ...enterStyle(badge, 30),
          }}
        >
          {episode.series}
        </div>
        <div
          data-box="day-number"
          style={{
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: c.white,
            border: `18px solid ${c.primary}`,
            boxSizing: "border-box",
            boxShadow: `0 30px 70px ${c.shadow}`,
            flexShrink: 0,
            textAlign: "center",
            ...enterStyle(ring, 30, 0.6),
          }}
        >
          <div style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: c.textSoft, marginTop: 92 }}>DAY</div>
          <div style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 290, lineHeight: "300px", color: c.primary, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(count)}
          </div>
        </div>
        <FitText box="day-text" font="bn" weight={700} maxSize={96} maxW={880} color={c.text} text={`আজ ${toBn(episode.day)}তম দিন`} style={enterStyle(text, 28)} />
      </Column>
    </SceneShell>
  );
};

/** Narration 4 — 160/300, 53.33% */
export const IntroProgressBeat: React.FC<BeatProps> = ({ durationInFrames }) => {
  const h1 = useEnter(0.0);
  const h2 = useEnter(0.12);
  const cnt = useEnter(0.2, "bouncy");
  const bar = useEnter(0.35);
  const pct = useEnter(0.5);
  return (
    <SceneShell label="intro-progress" durationInFrames={durationInFrames}>
      <Column gap={26}>
        <FitText box="p-1" font="bn" weight={700} maxSize={92} maxW={880} color={c.primary} text="আলহামদুলিল্লাহ" style={enterStyle(h1, 26)} />
        <FitText box="p-2" font="bn" weight={600} maxSize={58} maxW={880} color={c.textSoft} text="জরুরি আরবি বাক্য শেষ" style={enterStyle(h2, 26)} />
        <ProgressIndicator
          from={0}
          to={episode.previousCompleted}
          total={episode.totalSeries}
          startSec={0.45}
          durSec={1.6}
          countStyle={enterStyle(cnt, 30, 0.9)}
          barStyle={enterStyle(bar, 24)}
          labelStyle={enterStyle(pct, 24)}
        />
      </Column>
    </SceneShell>
  );
};

/** Narration 5 — restaurant illustration + 161–170 */
export const RangeBeat: React.FC<BeatProps> = ({ durationInFrames, startSec, cues }) => {
  const art = useEnter(cueOffset(cues[0], startSec), "soft");
  const rng = useEnter(cueOffset(cues[1], startSec), "bouncy");
  const cap = useEnter(cueOffset(cues[0], startSec));
  return (
    <SceneShell label="range" durationInFrames={durationInFrames}>
      <Column gap={44}>
        <VectorIllustration id="hero" flow style={enterStyle(art, 40, 0.94)} />
        <div
          data-box="range"
          style={{
            width: 860,
            height: 190,
            lineHeight: "190px",
            textAlign: "center",
            fontFamily: theme.fonts.en,
            fontWeight: 800,
            fontSize: 170,
            letterSpacing: -3,
            color: c.primary,
            flexShrink: 0,
            ...enterStyle(rng, 34, 0.85),
          }}
        >
          {episode.sentenceFrom}
          <span style={{ color: c.accent }}>–</span>
          {episode.sentenceTo}
        </div>
        <FitText box="range-caption" font="bn" weight={600} maxSize={60} maxW={880} color={c.textSoft} text={episode.titleBn} style={enterStyle(cap, 24)} />
      </Column>
    </SceneShell>
  );
};

/** Narration 6 — "চলুন, শুরু করি" then wipe into sentence 161 */
export const StartBeat: React.FC<BeatProps & { firstSentenceNo: number }> = ({ durationInFrames, startSec, cues, firstSentenceNo }) => {
  const t1 = useEnter(cueOffset(cues[0], startSec), "bouncy");
  const t2 = useEnter(cueOffset(cues[0], startSec));
  return (
    <SceneShell label="start" durationInFrames={durationInFrames} wipeOut>
      <Column gap={50}>
        <FitText box="start-1" font="bn" weight={800} maxSize={150} maxW={880} color={c.primary} text="চলুন, শুরু করি" style={enterStyle(t1, 40, 0.8)} />
        <div
          data-box="start-chip"
          data-kind="chrome"
          style={{
            height: 96,
            padding: "0 56px",
            borderRadius: 48,
            background: c.accent,
            color: c.text,
            fontFamily: theme.fonts.en,
            fontWeight: 800,
            fontSize: 48,
            letterSpacing: 2,
            lineHeight: "96px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            ...enterStyle(t2, 28),
          }}
        >
          SENTENCE {firstSentenceNo} →
        </div>
      </Column>
    </SceneShell>
  );
};

export { cueEnd };

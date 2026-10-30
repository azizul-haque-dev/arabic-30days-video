import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Card, Entrance, Pill, SceneExit, WordReveal, clamp, useBreath } from "../components/kit";
import { Sfx } from "../components/Sfx";

const C = theme.colors;
const textStyle = (
  size: number,
  weight: number = theme.weights.hero,
  color: string = C.text
): React.CSSProperties => ({
  fontFamily: theme.fonts.display,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.15,
  letterSpacing: 0,
});

/* ───────────── 1 · HOOK — Problem & Relief ───────────── */
export const HookScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reliefP = spring({ frame: frame - 48, fps, config: theme.spring.bouncy });

  return (
    <SceneExit dur={dur}>
      <Sfx name="thud" at={2} />
      <Sfx name="pop" at={24} />
      <Sfx name="chime" at={48} />

      {/* Top Tag */}
      <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={4} from={-20}>
          <Pill tone="soft" size={36}>আরব প্রবাসীদের জন্য</Pill>
        </Entrance>
      </div>

      {/* Core Hook Question */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
        }}
      >
        <WordReveal
          text="আরব দেশে থাকেন কিন্তু"
          delay={6}
          per={4}
          justify="center"
          gap={18}
          style={textStyle(58, theme.weights.strong, C.textDim)}
        />
        <WordReveal
          text="আরবি বলতে গিয়ে আটকে যান?"
          delay={18}
          per={4}
          justify="center"
          gap={20}
          style={textStyle(76, theme.weights.hero, C.text)}
          wordStyle={(i) => (i === 3 || i === 4 ? { color: C.primaryDeep } : {})}
        />
      </div>

      {/* "চিন্তা নেই!" Relief Card */}
      {frame >= 44 && (
        <div
          style={{
            position: "absolute",
            bottom: 180,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${interpolate(reliefP, [0, 1], [0.7, 1])}) translateY(${interpolate(
                reliefP,
                [0, 1],
                [40, 0]
              )}px)`,
              opacity: interpolate(reliefP, [0, 0.4], [0, 1], clamp),
              background: C.surface,
              borderRadius: 44,
              padding: "28px 56px",
              boxShadow: `${theme.shadow.card}, 0 0 50px ${C.glow}`,
              border: `2px solid ${C.primary}`,
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                background: C.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 20px ${C.glow}`,
              }}
            >
              <svg viewBox="0 0 24 24" width={34} height={34} fill="none" stroke={C.white} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={textStyle(62, theme.weights.hero, C.primaryDeep)}>চিন্তা নেই!</div>
          </div>
        </div>
      )}
    </SceneExit>
  );
};

/* ───────────── 2 · INTRO — Arabic Master & 30-Day Ring (Day 9) ───────────── */
export const IntroScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath(30, 0.014);

  const R = 220;
  const numP = spring({ frame: frame - 28, fps, config: theme.spring.bouncy });

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="chime" at={30} />
      <Sfx name="pop" at={64} rate={1.1} />

      {/* Brand Companion Pill */}
      <div style={{ position: "absolute", top: 80, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={3} from={-20}>
          <Pill tone="soft" size={32}>আপনার প্রতিদিনের আরবি শেখার সঙ্গী</Pill>
        </Entrance>
      </div>

      {/* Brand Title: Arabic Master */}
      <div style={{ position: "absolute", top: 156, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal
          text="Arabic Master"
          delay={8}
          per={5}
          justify="center"
          gap={24}
          style={{ ...textStyle(84, theme.weights.hero, C.primaryDeep), textShadow: `0 8px 30px ${C.glow}` }}
        />
      </div>

      {/* 30-Day Ring with Day 9 Highlighted */}
      <div
        style={{
          position: "absolute",
          left: 540 - R - 36,
          top: 320,
          width: (R + 36) * 2,
          height: (R + 36) * 2,
          transform: `scale(${breath.scale})`,
        }}
      >
        <svg
          viewBox={`${-R - 36} ${-R - 36} ${(R + 36) * 2} ${(R + 36) * 2}`}
          width={(R + 36) * 2}
          height={(R + 36) * 2}
        >
          {Array.from({ length: 30 }).map((_, i) => {
            const p = spring({ frame: frame - 10 - i * 0.9, fps, config: theme.spring.snappy });
            const isCompleted = i < 9; // Day 1 to 9
            const isToday = i === 8; // Day 9 active
            const litP = isCompleted ? spring({ frame: frame - 25 - i * 2.2, fps, config: theme.spring.snappy }) : 0;
            return (
              <rect
                key={i}
                x={-8}
                y={-R}
                width={16}
                height={interpolate(p, [0, 1], [0, 48])}
                rx={8}
                fill={isToday ? C.accent : isCompleted && litP > 0.5 ? C.primary : C.primarySoft}
                transform={`rotate(${i * 12}) translate(0 ${isToday ? -8 : -litP * 4})`}
                style={{
                  filter: isToday ? `drop-shadow(0 0 12px ${C.accent})` : isCompleted ? `drop-shadow(0 0 8px ${C.glow})` : undefined,
                }}
              />
            );
          })}
        </svg>

        {/* Center Badge: Day 9 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${interpolate(numP, [0, 1], [0.65, 1])})`,
            opacity: interpolate(numP, [0, 0.5], [0, 1], clamp),
          }}
        >
          <div style={textStyle(52, theme.weights.strong, C.textDim)}>Day</div>
          <div style={{ ...textStyle(210, theme.weights.hero, C.primaryDeep), marginTop: -24, lineHeight: 0.9 }}>
            9
          </div>
          <div style={{ ...textStyle(42, theme.weights.strong, C.accent), marginTop: 8 }}>আজ নবম দিন</div>
        </div>
      </div>

      {/* Series Footer Tag */}
      <div style={{ position: "absolute", bottom: 90, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={36} from={30}>
          <Card style={{ padding: "18px 46px", borderRadius: 36, border: `1.5px solid ${C.primarySoft}` }}>
            <span style={textStyle(46, theme.weights.strong, C.text)}>
              ৩০ দিনের <span style={{ color: C.primaryDeep }}>Survival Arabic Series</span>
            </span>
          </Card>
        </Entrance>
      </div>
    </SceneExit>
  );
};

/* ───────────── 3 · PROGRESS — Milestone 80 / 300 ───────────── */
export const ProgressScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress fills from 0 to 26.7% (80/300)
  const barP = spring({ frame: frame - 20, fps, config: theme.spring.smooth });
  const countVal = Math.round(interpolate(barP, [0, 1], [0, 80]));

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="tick" at={24} />
      <Sfx name="chime" at={48} rate={1.05} />

      {/* Header Pill */}
      <div style={{ position: "absolute", top: 100, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={4} from={-20}>
          <Pill tone="soft" size={38}>
            <span style={{ color: C.primaryDeep }}>আলহামদুলিল্লাহ!</span>
          </Pill>
        </Entrance>
      </div>

      {/* Subtitle */}
      <div style={{ position: "absolute", top: 190, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal
          text="ইতিমধ্যে আমরা শিখে ফেলেছি"
          delay={10}
          per={4}
          justify="center"
          gap={18}
          style={textStyle(54, theme.weights.strong, C.textDim)}
        />
      </div>

      {/* Dashboard Card */}
      <div style={{ position: "absolute", top: 290, left: 80, right: 80 }}>
        <Entrance delay={14} from={40} config={theme.spring.snappy}>
          <Card style={{ padding: "50px 48px", borderRadius: 48, position: "relative" }}>
            {/* Big Milestone Numbers */}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 16 }}>
              <span style={{ ...textStyle(170, theme.weights.hero, C.primaryDeep), fontVariantNumeric: "tabular-nums" }}>
                {countVal}
              </span>
              <span style={textStyle(80, theme.weights.strong, C.textDim)}>/ ৩০০টি বাক্য</span>
            </div>

            {/* Progress Bar Container */}
            <div
              style={{
                marginTop: 36,
                height: 28,
                borderRadius: 14,
                background: C.primarySoft,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(countVal / 300) * 100}%`,
                  background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
                  borderRadius: 14,
                  boxShadow: `0 0 20px ${C.glow}`,
                }}
              />
            </div>

            {/* Bottom percentage & milestone note */}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={textStyle(36, theme.weights.strong, C.primaryDeep)}>৮০টি দরকারি বাক্য সম্পন্ন</span>
              <span style={{ ...textStyle(36, theme.weights.hero, C.accent), fontVariantNumeric: "tabular-nums" }}>
                {((countVal / 300) * 100).toFixed(1)}% সম্পন্ন
              </span>
            </div>
          </Card>
        </Entrance>
      </div>

      {/* Bottom badge */}
      <div style={{ position: "absolute", bottom: 110, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={36} from={26}>
          <Pill tone="white" size={36}>
            <span style={{ color: C.text }}>৮ দিনে প্রতিদিন ১০টি করে বাক্য</span>
          </Pill>
        </Entrance>
      </div>
    </SceneExit>
  );
};

/* ───────────── 4 · TODAY — Target Sentences 81 to 90 ───────────── */
export const TodayScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const targetP = spring({ frame: frame - 18, fps, config: theme.spring.bouncy });

  return (
    <SceneExit dur={dur}>
      <Sfx name="whoosh" at={2} />
      <Sfx name="pop" at={20} />
      <Sfx name="chime" at={42} />

      {/* Top Tag */}
      <div style={{ position: "absolute", top: 100, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={4} from={-20}>
          <Pill tone="hero" size={36}>আজকের লক্ষ্য</Pill>
        </Entrance>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: 200, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal
          text="আজ শিখব আরও ১০টি নতুন বাক্য"
          delay={10}
          per={4}
          justify="center"
          gap={18}
          style={textStyle(62, theme.weights.hero, C.text)}
        />
      </div>

      {/* Big 81 - 90 Range Card */}
      <div style={{ position: "absolute", top: 320, left: 90, right: 90 }}>
        <Entrance delay={16} from={44} config={theme.spring.snappy}>
          <Card
            style={{
              padding: "54px 40px",
              borderRadius: 50,
              textAlign: "center",
              border: `2px solid ${C.primarySoft}`,
              background: `linear-gradient(180deg, ${C.surface}, ${C.bgAlt})`,
            }}
          >
            <div style={textStyle(42, theme.weights.strong, C.textDim)}>বাক্য নম্বর</div>
            <div
              style={{
                ...textStyle(176, theme.weights.hero, C.primaryDeep),
                lineHeight: 1.05,
                marginTop: 6,
                transform: `scale(${interpolate(targetP, [0, 1], [0.85, 1])})`,
              }}
            >
              ৮১ — ৯০
            </div>
            <div style={{ marginTop: 14 }}>
              <Pill tone="accent" size={34}>মোবাইল, ইন্টারনেট ও দৈনন্দিন কথা</Pill>
            </div>
          </Card>
        </Entrance>
      </div>

      {/* Call to action teaser */}
      <div style={{ position: "absolute", bottom: 110, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={36} from={30}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={textStyle(48, theme.weights.strong, C.primaryDeep)}>
              চলুন, শেখার যাত্রা এগিয়ে নিয়ে যাই →
            </span>
          </div>
        </Entrance>
      </div>
    </SceneExit>
  );
};


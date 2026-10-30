import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BEATS, SCENES } from "../timing";
import { SENTENCES } from "../content";
import { Card, Counter, Entrance, Pill, SceneExit, WordReveal, clamp, useBreath } from "../components/kit";
import { Icon } from "../components/Icons";
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
  lineHeight: 1.16,
  letterSpacing: 0,
});

const arabicStyle = (size: number, color: string = C.primaryDeep): React.CSSProperties => ({
  fontFamily: theme.fonts.arabic,
  fontSize: size,
  fontWeight: 700,
  color,
  lineHeight: 1.25,
  direction: "rtl",
  textAlign: "center",
});

const CHIME_RATES = [1, 1.08, 0.95, 1.04];

type SentenceProps = { i: number; dur: number };

const useBeats = (i: number) => {
  const from = SCENES.find((s) => s.id === `s${i + 91}`)!.from;
  return {
    say: Math.max(8, BEATS[i].say - from),
    mean: Math.max(24, BEATS[i].mean - from),
  };
};

/** Highlight sweep that animates across the Arabic phrase while spoken. */
const RepeatSweep: React.FC<{ say: number; mean: number; color: string; height?: number }> = ({
  say,
  mean,
  color,
  height = 8,
}) => {
  const frame = useCurrentFrame();
  const half = Math.max(18, (mean - say) / 2);
  const k = (frame - say - 6) / half;
  const s = k < 0 || k >= 2 ? 0 : interpolate(k % 1, [0, 0.85], [0, 1], { ...clamp, easing: theme.ease.out });
  const fade = k < 0 || k >= 2 ? 0 : 1 - interpolate(k % 1, [0.85, 1], [0, 1], clamp) * 0.7;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -4,
        height,
        borderRadius: height,
        background: color,
        opacity: fade,
        clipPath: `inset(0 ${100 - s * 100}% 0 0)`,
      }}
    />
  );
};

const MeaningBadge: React.FC<{ text: string; delay: number; size: number; tone?: "accent" | "white" | "soft" }> = ({
  text,
  delay,
  size,
  tone = "accent",
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
    <Entrance delay={delay} config={theme.spring.bouncy} from={20} scaleFrom={0.7}>
      <Pill tone={tone} size={size * 0.58}>অর্থ</Pill>
    </Entrance>
    <WordReveal
      text={text}
      delay={delay + 4}
      per={3}
      justify="center"
      gap={size * 0.24}
      style={textStyle(size, theme.weights.strong)}
    />
  </div>
);

/* ───── Layout 1 · Glossy Chat Mockup (Sentence 91, 94, 97, 100) ───── */
export const ChatLayout: React.FC<SentenceProps> = ({ i, dur }) => {
  const s = SENTENCES[i];
  const { say, mean } = useBeats(i);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typing = interpolate(frame, [say - 24, say - 16, say - 2, say + 4], [0, 1, 1, 0], clamp);
  const replyP = spring({ frame: frame - say, fps, config: theme.spring.snappy });
  const arabicFontSize = s.arabic.length > 24 ? 64 : 80;
  const pronFontSize = s.pronunciation.length > 22 ? 50 : 64;

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="chime" at={12} rate={CHIME_RATES[i % 4]} gain={0.8} />
      <Sfx name="pop" at={say} rate={1.04} />
      <Sfx name="pop" at={mean + 1} rate={1.1} />

      {/* Progress counter */}
      <div style={{ position: "absolute", left: 80, top: 60 }}>
        <Counter n={s.n} nBn={s.nBn} />
      </div>

      {/* Vector Icon */}
      <div style={{ position: "absolute", left: 70, top: 160 }}>
        <Icon id={s.icon} size={230} delay={4} />
      </div>

      {/* Situation Query Bubble (Left side) */}
      <div style={{ position: "absolute", left: 330, top: 190, width: 670 }}>
        <Entrance delay={8} from={26} config={theme.spring.snappy}>
          <Card style={{ padding: "26px 36px", borderRadius: 44, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: -12,
                top: 54,
                width: 26,
                height: 26,
                background: C.surface,
                transform: "rotate(45deg)",
                borderRadius: 5,
                borderLeft: `1px solid ${C.line}`,
                borderBottom: `1px solid ${C.line}`,
              }}
            />
            <WordReveal
              text={s.situation}
              delay={10}
              per={3}
              gap={14}
              style={textStyle(46, theme.weights.strong)}
            />
          </Card>
        </Entrance>
      </div>

      {/* Arabic Reply Speech Bubble (Right side) */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 450,
          maxWidth: 940,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        <Entrance delay={Math.max(0, say - 20)} from={16}>
          <Pill tone="soft" size={34}>আরবিতে বলুন</Pill>
        </Entrance>

        <div style={{ position: "relative" }}>
          {/* Typing Indicator */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              opacity: typing,
              display: "flex",
              gap: 12,
              padding: "26px 40px",
              borderRadius: 44,
              background: C.primary,
              boxShadow: theme.shadow.hero,
            }}
          >
            {[0, 1, 2].map((d) => (
              <div
                key={d}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 18,
                  background: C.white,
                  opacity: 0.6 + 0.4 * Math.sin(frame / 4 - d),
                  transform: `translateY(${Math.sin(frame / 4 - d) * -5}px)`,
                }}
              />
            ))}
          </div>

          {/* Core Response Card */}
          {frame >= say - 1 && (
            <div
              style={{
                background: C.primary,
                borderRadius: 48,
                padding: "32px 48px 36px",
                boxShadow: `${theme.shadow.hero}, 0 0 70px ${C.glow}`,
                opacity: interpolate(replyP, [0, 0.4], [0, 1], clamp),
                transform: `scale(${interpolate(replyP, [0, 1], [0.82, 1])}) translateY(${interpolate(
                  replyP,
                  [0, 1],
                  [20, 0]
                )}px)`,
                transformOrigin: "right center",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Arabic script */}
              <div style={{ ...arabicStyle(arabicFontSize, C.white), textShadow: "0 4px 18px rgba(0,0,0,0.2)" }}>
                {s.arabic}
              </div>

              {/* Bangla Pronunciation */}
              <div style={{ position: "relative", display: "inline-block", paddingBottom: 6 }}>
                <WordReveal
                  text={s.pronunciation}
                  delay={say + 2}
                  per={4}
                  justify="center"
                  gap={pronFontSize * 0.26}
                  style={textStyle(pronFontSize, theme.weights.hero, C.white)}
                />
                <RepeatSweep say={say} mean={mean} color={C.accent} height={8} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Meaning Card (Bottom) */}
      {frame >= mean - 2 && (
        <div style={{ position: "absolute", left: 70, right: 70, bottom: 90 }}>
          <Entrance delay={mean} from={32} config={theme.spring.snappy}>
            <Card style={{ padding: "28px 38px", borderRadius: 44 }}>
              <MeaningBadge text={s.meaning} delay={mean + 2} size={50} />
            </Card>
          </Entrance>
        </div>
      )}
    </SceneExit>
  );
};

/* ───── Layout 2 · Glass Stage Card (Sentence 92, 95, 98) ───── */
export const GlassLayout: React.FC<SentenceProps> = ({ i, dur }) => {
  const s = SENTENCES[i];
  const { say, mean } = useBeats(i);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath(28, 0.012);

  const heroP = spring({ frame: frame - say, fps, config: theme.spring.snappy });
  const arabicFontSize = s.arabic.length > 24 ? 68 : 84;
  const pronFontSize = s.pronunciation.length > 22 ? 52 : 68;

  return (
    <SceneExit dur={dur}>
      <Sfx name="whoosh" at={2} />
      <Sfx name="pop" at={10} rate={1.05} />
      <Sfx name="chime" at={say} rate={CHIME_RATES[i % 4]} gain={0.85} />
      <Sfx name="pop" at={mean} rate={1.1} />

      {/* Header Counter & Situation */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Counter n={s.n} nBn={s.nBn} />
        <Pill tone="soft" size={32}>প্রতিদিনের আরবি</Pill>
      </div>

      {/* Central Glassmorphic Main Card */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 70,
          right: 70,
          transform: `scale(${breath.scale})`,
        }}
      >
        <Card
          style={{
            padding: "44px 44px 48px",
            borderRadius: 52,
            background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bgAlt} 100%)`,
            border: `2px solid ${C.primarySoft}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            boxShadow: theme.shadow.card,
          }}
        >
          {/* Top Floating Icon */}
          <div style={{ marginTop: -8, marginBottom: 12 }}>
            <Icon id={s.icon} size={180} delay={6} />
          </div>

          {/* Context Tag */}
          <Entrance delay={8} from={16}>
            <Pill tone="white" size={34}>
              <span style={{ color: C.textDim }}>{s.situation}</span>
            </Pill>
          </Entrance>

          {/* Arabic phrase hero box */}
          {frame >= say - 2 && (
            <div
              style={{
                marginTop: 24,
                width: "100%",
                padding: "24px 20px 28px",
                borderRadius: 40,
                background: C.primarySoft,
                border: `1.5px solid ${C.primary}`,
                transform: `scale(${interpolate(heroP, [0, 1], [0.85, 1])})`,
                opacity: interpolate(heroP, [0, 0.4], [0, 1], clamp),
              }}
            >
              {/* Arabic script */}
              <div style={arabicStyle(arabicFontSize, C.primaryDeep)}>
                {s.arabic}
              </div>

              {/* Bangla Pronunciation */}
              <div style={{ position: "relative", display: "inline-block", marginTop: 8, paddingBottom: 6 }}>
                <WordReveal
                  text={s.pronunciation}
                  delay={say + 2}
                  per={4}
                  justify="center"
                  gap={pronFontSize * 0.26}
                  style={textStyle(pronFontSize, theme.weights.hero, C.text)}
                />
                <RepeatSweep say={say} mean={mean} color={C.accent} height={8} />
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Meaning Banner (Bottom) */}
      {frame >= mean - 2 && (
        <div style={{ position: "absolute", left: 70, right: 70, bottom: 84 }}>
          <Entrance delay={mean} from={32} config={theme.spring.snappy}>
            <Card style={{ padding: "26px 36px", borderRadius: 44, background: C.surface }}>
              <MeaningBadge text={s.meaning} delay={mean + 2} size={52} tone="accent" />
            </Card>
          </Entrance>
        </div>
      )}
    </SceneExit>
  );
};

/* ───── Layout 3 · Modern Bento Grid (Sentence 93, 96, 99) ───── */
export const BentoLayout: React.FC<SentenceProps> = ({ i, dur }) => {
  const s = SENTENCES[i];
  const { say, mean } = useBeats(i);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroP = spring({ frame: frame - say, fps, config: theme.spring.bouncy });
  const arabicFontSize = s.arabic.length > 24 ? 62 : 78;
  const pronFontSize = s.pronunciation.length > 22 ? 48 : 62;

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="click" at={12} rate={1.1} />
      <Sfx name="chime" at={say} rate={CHIME_RATES[i % 4]} gain={0.8} />
      <Sfx name="pop" at={mean} rate={1.08} />

      {/* Header Counter */}
      <div style={{ position: "absolute", left: 80, top: 60 }}>
        <Counter n={s.n} nBn={s.nBn} />
      </div>

      {/* Top Bento Row: Icon Card (left) + Context Card (right) */}
      <div style={{ position: "absolute", top: 160, left: 70, right: 70, display: "flex", gap: 24, height: 260 }}>
        {/* Left: Icon Bento Tile */}
        <Entrance delay={4} from={26} style={{ width: 260, height: 260 }}>
          <Card
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${C.surface}, ${C.primarySoft})`,
            }}
          >
            <Icon id={s.icon} size={190} delay={6} />
          </Card>
        </Entrance>

        {/* Right: Situation Tile */}
        <Entrance delay={8} from={26} style={{ flex: 1, height: 260 }}>
          <Card
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 44,
              padding: "34px 38px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Pill tone="soft" size={32}>পরিস্থিতি</Pill>
            <WordReveal
              text={s.situation}
              delay={12}
              per={3}
              gap={14}
              style={textStyle(46, theme.weights.strong)}
            />
          </Card>
        </Entrance>
      </div>

      {/* Middle Bento Tile: Arabic Phrase + Pronunciation */}
      <div style={{ position: "absolute", top: 450, left: 70, right: 70 }}>
        {frame >= say - 2 && (
          <Entrance delay={say} from={34} config={theme.spring.snappy}>
            <Card
              style={{
                padding: "36px 44px 42px",
                borderRadius: 48,
                background: C.surface,
                border: `2px solid ${C.primary}`,
                boxShadow: `${theme.shadow.card}, 0 0 50px ${C.glow}`,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transform: `scale(${interpolate(heroP, [0, 1], [0.88, 1])})`,
              }}
            >
              {/* Top Label */}
              <Pill tone="hero" size={32}>আরবিতে বলুন</Pill>

              {/* Arabic script */}
              <div style={{ ...arabicStyle(arabicFontSize, C.primaryDeep), marginTop: 6 }}>
                {s.arabic}
              </div>

              {/* Bangla Pronunciation */}
              <div style={{ position: "relative", display: "inline-block", paddingBottom: 6 }}>
                <WordReveal
                  text={s.pronunciation}
                  delay={say + 2}
                  per={4}
                  justify="center"
                  gap={pronFontSize * 0.26}
                  style={textStyle(pronFontSize, theme.weights.hero, C.text)}
                />
                <RepeatSweep say={say} mean={mean} color={C.accent} height={8} />
              </div>
            </Card>
          </Entrance>
        )}
      </div>

      {/* Bottom Bento Tile: Meaning */}
      {frame >= mean - 2 && (
        <div style={{ position: "absolute", left: 70, right: 70, bottom: 84 }}>
          <Entrance delay={mean} from={30} config={theme.spring.snappy}>
            <Card style={{ padding: "26px 36px", borderRadius: 44, background: C.bgAlt }}>
              <MeaningBadge text={s.meaning} delay={mean + 2} size={50} tone="accent" />
            </Card>
          </Entrance>
        </div>
      )}
    </SceneExit>
  );
};


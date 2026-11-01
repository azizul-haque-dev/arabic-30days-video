import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LessonItem } from "../content";
import { SentenceBeat } from "../timing";
import { theme } from "../theme";
import {
  Card,
  Counter,
  Entrance,
  Pill,
  SceneExit,
  WordReveal,
  clamp,
  useBreath,
} from "../components/kit";
import { Icon } from "../components/Icons";
import { Sfx } from "../components/Sfx";

interface Props {
  item: LessonItem;
  beat: SentenceBeat;
  index: number;
}

export const SentenceScene: React.FC<Props> = ({ item, beat, index }) => {
  const variant = (index - 1) % 3;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath();

  const arP = spring({
    frame: frame - (beat.firstAr - 5),
    fps,
    config: theme.spring.snappy,
  });
  const repeatP = spring({
    frame: frame - (beat.say - 4),
    fps,
    config: theme.spring.bouncy,
  });
  const meanP = spring({
    frame: frame - (beat.mean - 5),
    fps,
    config: theme.spring.smooth,
  });

  const pitchMod = 0.97 + ((index % 4) * 0.02);

  return (
    <SceneExit durationInFrames={beat.duration}>
      <Sfx name="pop" at={2} playbackRate={pitchMod} />
      <Sfx name="click" at={beat.firstAr - 3} playbackRate={pitchMod} />
      <Sfx name="tick" at={beat.say - 3} playbackRate={pitchMod} />
      <Sfx name="chime" at={beat.mean - 3} playbackRate={pitchMod} />

      <AbsoluteFill
        style={{
          padding: "56px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={0}>
          <Counter index={index} total={10} />
        </Entrance>

        {variant === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <Entrance delay={4}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Icon id={item.icon} size={76} />
                <Pill tone="soft" style={{ fontSize: 28 }}>
                  পরিস্থিতি: {item.situation}
                </Pill>
              </div>
            </Entrance>

            <div
              style={{
                opacity: arP,
                transform: `translateY(${interpolate(arP, [0, 1], [32, 0], clamp)}px) scale(${interpolate(repeatP, [0, 0.5, 1], [1, 1.03, 1], clamp)})`,
              }}
            >
              <Card
                style={{
                  border: `2.5px solid ${repeatP > 0.2 ? theme.colors.primary : theme.colors.line}`,
                  boxShadow: repeatP > 0.2 ? theme.shadows.hero : theme.shadows.card,
                  padding: "36px 40px",
                  ...breath,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <Pill tone={repeatP > 0.2 ? "hero" : "soft"} style={{ fontSize: 22, padding: "6px 18px" }}>
                    {repeatP > 0.2 ? "আরেকবার বলুন (Repeat)" : "আরবি উচ্চারণ"}
                  </Pill>
                  <span
                    style={{
                      fontFamily: theme.fonts.arabic,
                      fontSize: 44,
                      fontWeight: theme.weights.hero,
                      color: theme.colors.primaryDeep,
                      direction: "rtl",
                    }}
                  >
                    {item.arabic}
                  </span>
                </div>

                <WordReveal
                  text={item.pronunciation}
                  delay={beat.firstAr - 4}
                  per={4}
                  style={{
                    fontSize: 56,
                    fontWeight: theme.weights.hero,
                    color: theme.colors.text,
                  }}
                />
              </Card>
            </div>

            <div
              style={{
                opacity: meanP,
                transform: `translateY(${interpolate(meanP, [0, 1], [28, 0], clamp)}px)`,
              }}
            >
              <Card
                style={{
                  backgroundColor: theme.colors.accentSoft,
                  padding: "28px 36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 24, fontWeight: theme.weights.strong, color: theme.colors.textDim }}>
                    বাংলা অর্থ
                  </div>
                  <div style={{ fontSize: 46, fontWeight: theme.weights.hero, color: theme.colors.text }}>
                    {item.meaning}
                  </div>
                </div>
                <Pill tone="white" style={{ fontSize: 24 }}>
                  Sentence {item.num}
                </Pill>
              </Card>
            </div>
          </div>
        )}

        {variant === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
            <Card
              style={{
                width: "100%",
                textAlign: "center",
                padding: "42px 40px",
                border: `2.5px solid ${theme.colors.primary}`,
                boxShadow: theme.shadows.hero,
                ...breath,
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <Icon id={item.icon} size={84} />
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.arabic,
                  fontSize: 48,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.primaryDeep,
                  marginBottom: 12,
                  opacity: arP,
                }}
              >
                {item.arabic}
              </div>
              <WordReveal
                text={item.pronunciation}
                delay={beat.firstAr - 4}
                per={4}
                style={{
                  fontSize: 58,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.primary,
                  justifyContent: "center",
                }}
              />
              {repeatP > 0.1 && (
                <div style={{ marginTop: 16, opacity: repeatP }}>
                  <Pill tone="accent" style={{ fontSize: 22, padding: "6px 20px" }}>
                    সাথে বলুন &bull; {item.pronunciation}
                  </Pill>
                </div>
              )}
            </Card>

            <div
              style={{
                width: "100%",
                opacity: meanP,
                transform: `scale(${interpolate(meanP, [0, 1], [0.94, 1], clamp)})`,
              }}
            >
              <Card style={{ textAlign: "center", padding: "28px 36px" }}>
                <div style={{ fontSize: 24, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
                  বাংলা অর্থ
                </div>
                <div style={{ fontSize: 48, fontWeight: theme.weights.hero, color: theme.colors.text, marginTop: 4 }}>
                  {item.meaning}
                </div>
              </Card>
            </div>
          </div>
        )}

        {variant === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
              <Card
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.primarySoft,
                  padding: 24,
                }}
              >
                <Icon id={item.icon} size={88} />
                <div style={{ fontSize: 24, fontWeight: theme.weights.hero, color: theme.colors.primaryDeep, marginTop: 10 }}>
                  #{item.numBn}
                </div>
              </Card>

              <Card style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "28px 32px" }}>
                <div style={{ fontSize: 24, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
                  কখন বলবেন:
                </div>
                <div style={{ fontSize: 34, fontWeight: theme.weights.hero, color: theme.colors.text, marginTop: 6 }}>
                  {item.situation}
                </div>
              </Card>
            </div>

            <Card
              style={{
                padding: "34px 38px",
                border: `2.5px solid ${repeatP > 0.2 ? theme.colors.primary : theme.colors.line}`,
                ...breath,
              }}
            >
              <div style={{ fontFamily: theme.fonts.arabic, fontSize: 42, color: theme.colors.primaryDeep, marginBottom: 8 }}>
                {item.arabic}
              </div>
              <WordReveal
                text={item.pronunciation}
                delay={beat.firstAr - 4}
                per={4}
                style={{
                  fontSize: 54,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.primary,
                }}
              />
            </Card>

            <div style={{ opacity: meanP }}>
              <Card style={{ backgroundColor: theme.colors.surface, padding: "26px 36px", borderLeft: `10px solid ${theme.colors.accent}` }}>
                <div style={{ fontSize: 44, fontWeight: theme.weights.hero, color: theme.colors.text }}>
                  অর্থ: {item.meaning}
                </div>
              </Card>
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </AbsoluteFill>
    </SceneExit>
  );
};

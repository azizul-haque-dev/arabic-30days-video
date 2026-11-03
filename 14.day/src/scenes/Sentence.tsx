import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";
import { SentenceData } from "../content";
import { Entrance, SceneExit, Pill, Card, Counter, PulseRings, ShimmerSweep } from "../components/kit";
import { Icon } from "../components/Icons";

interface SentenceProps {
  data: SentenceData;
  sayBeat: number;
  meanBeat: number;
}

// 1. ChatLayout (Sentences 131, 134, 137, 140)
export const ChatLayout: React.FC<SentenceProps> = ({ data, sayBeat, meanBeat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSay = frame >= sayBeat;
  const isMean = frame >= meanBeat;

  // Typing indicator dots bounce
  const dot1 = Math.sin((frame * 8) * Math.PI / 180) * 4;
  const dot2 = Math.sin(((frame * 8) + 60) * Math.PI / 180) * 4;
  const dot3 = Math.sin(((frame * 8) + 120) * Math.PI / 180) * 4;

  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 60px 48px 60px",
          fontFamily: theme.fonts.display,
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Pill text={data.situation} tone="soft" style={{ fontSize: 26 }} />
          <Counter current={data.num - 130} />
        </div>

        {/* Central Chat Stream */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "auto 0" }}>
          {/* Incoming Driver Question Bubble */}
          <Entrance delay={4} preset="snappy">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: theme.gradients.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(16, 35, 29, 0.08)",
                }}
              >
                <Icon name="car" size={28} color={theme.colors.primaryDeep} />
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.96)",
                  padding: "20px 32px",
                  borderRadius: "28px 28px 28px 8px",
                  border: `1.5px solid ${theme.colors.line}`,
                  fontSize: 32,
                  color: theme.colors.textDim,
                  fontWeight: theme.weights.strong,
                  boxShadow: theme.shadows.card,
                }}
              >
                ড্রাইভারকে দিক নির্দেশনা দিন:
              </div>
            </div>
          </Entrance>

          {/* Typing indicator or Arabic Speech Bubble */}
          {!isSay ? (
            /* Typing indicator before speech starts */
            <Entrance delay={10}>
              <div
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  padding: "20px 32px",
                  borderRadius: "28px 28px 8px 28px",
                  border: `1.5px solid ${theme.colors.line}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 6px 18px rgba(16, 35, 29, 0.05)",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: theme.colors.primary, transform: `translateY(${dot1}px)` }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: theme.colors.primary, transform: `translateY(${dot2}px)` }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: theme.colors.primary, transform: `translateY(${dot3}px)` }} />
              </div>
            </Entrance>
          ) : (
            /* Active Arabic Response Bubble */
            <Entrance delay={0} preset="bouncy">
              <div
                style={{
                  alignSelf: "flex-end",
                  background: theme.gradients.primary,
                  color: "#FFFFFF",
                  padding: "32px 48px",
                  borderRadius: "36px 36px 8px 36px",
                  boxShadow: theme.shadows.glow,
                  border: "2px solid rgba(255, 255, 255, 0.35)",
                  textAlign: "right",
                  maxWidth: "85%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <ShimmerSweep />
                <div
                  style={{
                    fontSize: 82,
                    fontWeight: 700,
                    fontFamily: theme.fonts.arabic,
                    direction: "rtl",
                    marginBottom: 10,
                    lineHeight: 1.25,
                    textShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {data.arabic}
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: theme.weights.hero,
                    color: theme.colors.accentSoft,
                    letterSpacing: "0.01em",
                  }}
                >
                  {data.translit}
                </div>
              </div>
            </Entrance>
          )}

          {/* Meaning Strip */}
          {isMean && (
            <Entrance delay={0} preset="snappy" fromY={20}>
              <div
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  padding: "20px 48px",
                  borderRadius: theme.radius.pill,
                  border: `2px solid ${theme.colors.accent}`,
                  fontSize: 44,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.text,
                  boxShadow: theme.shadows.accentGlow,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                <span style={{ color: theme.colors.accent, fontWeight: 800 }}>অর্থ:</span>
                <span>{data.meaning}</span>
              </div>
            </Entrance>
          )}
        </div>

        {/* Bottom Banner */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
            Gulf Arabic • Survival Day 14
          </span>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

// 2. GlassLayout (Sentences 132, 135, 138)
export const GlassLayout: React.FC<SentenceProps> = ({ data, sayBeat, meanBeat }) => {
  const frame = useCurrentFrame();
  const isSay = frame >= sayBeat;
  const isMean = frame >= meanBeat;

  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 60px 48px 60px",
          fontFamily: theme.fonts.display,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Pill text={data.situation} tone="accent" style={{ fontSize: 26 }} />
          <Counter current={data.num - 130} />
        </div>

        <Entrance delay={6} preset="smooth">
          <Card
            glow={isSay}
            style={{
              alignItems: "center",
              textAlign: "center",
              padding: "54px 44px 48px 44px",
              position: "relative",
            }}
          >
            <ShimmerSweep />

            {/* Icon with radar pulse */}
            <div
              style={{
                position: "relative",
                width: 104,
                height: 104,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 26,
              }}
            >
              <PulseRings size={120} color={theme.colors.primary} />
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: theme.gradients.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(14, 159, 110, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                }}
              >
                <Icon name={data.icon} size={52} color={theme.colors.primaryDeep} />
              </div>
            </div>

            {/* Arabic Phrase */}
            <div
              style={{
                fontSize: 92,
                fontWeight: 700,
                fontFamily: theme.fonts.arabic,
                direction: "rtl",
                color: theme.colors.primary,
                marginBottom: 14,
                lineHeight: 1.25,
                textShadow: "0 4px 20px rgba(14, 159, 110, 0.2)",
              }}
            >
              {data.arabic}
            </div>

            {/* Bengali Transliteration */}
            <div
              style={{
                fontSize: 58,
                fontWeight: theme.weights.hero,
                color: theme.colors.text,
                marginBottom: 32,
                letterSpacing: "-0.01em",
              }}
            >
              {data.translit}
            </div>

            {/* Meaning Strip */}
            {isMean && (
              <Entrance delay={0} preset="bouncy">
                <div
                  style={{
                    background: theme.gradients.accent,
                    color: "#FFFFFF",
                    padding: "18px 52px",
                    borderRadius: theme.radius.pill,
                    fontSize: 42,
                    fontWeight: theme.weights.hero,
                    boxShadow: theme.shadows.accentGlow,
                    border: "1.5px solid rgba(255, 255, 255, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.9, fontSize: 36 }}>অর্থ:</span>
                  <span>{data.meaning}</span>
                </div>
              </Entrance>
            )}
          </Card>
        </Entrance>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
            Gulf Arabic • Survival Day 14
          </span>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

// 3. BentoLayout (Sentences 133, 136, 139)
export const BentoLayout: React.FC<SentenceProps> = ({ data, sayBeat, meanBeat }) => {
  const frame = useCurrentFrame();
  const isSay = frame >= sayBeat;
  const isMean = frame >= meanBeat;

  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 60px 48px 60px",
          fontFamily: theme.fonts.display,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Pill text={data.situation} tone="soft" style={{ fontSize: 26 }} />
          <Counter current={data.num - 130} />
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: 22,
            margin: "auto 0",
          }}
        >
          {/* Main Phrase Card */}
          <Entrance delay={6}>
            <Card style={{ justifyContent: "center", padding: "40px 36px", height: "100%" }}>
              <div
                style={{
                  fontSize: 84,
                  fontWeight: 700,
                  fontFamily: theme.fonts.arabic,
                  direction: "rtl",
                  color: theme.colors.primary,
                  marginBottom: 12,
                  lineHeight: 1.25,
                }}
              >
                {data.arabic}
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.text,
                  letterSpacing: "-0.01em",
                }}
              >
                {data.translit}
              </div>
            </Card>
          </Entrance>

          {/* Icon & Direction Card */}
          <Entrance delay={14}>
            <div
              style={{
                background: theme.gradients.primary,
                borderRadius: 36,
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.shadows.glow,
                border: "2px solid rgba(255, 255, 255, 0.35)",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Icon name={data.icon} size={54} color="#FFFFFF" />
              </div>
              <span
                style={{
                  fontSize: 30,
                  fontWeight: theme.weights.hero,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                }}
              >
                দিক নির্দেশনা
              </span>
            </div>
          </Entrance>

          {/* Full Width Meaning Card */}
          <div style={{ gridColumn: "span 2" }}>
            <Entrance delay={20} preset="bouncy">
              <div
                style={{
                  background: isMean ? theme.gradients.accent : "rgba(255, 255, 255, 0.95)",
                  color: isMean ? "#FFFFFF" : theme.colors.text,
                  borderRadius: 32,
                  padding: "24px 38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 18,
                  border: isMean
                    ? "2px solid rgba(255, 255, 255, 0.4)"
                    : `2px solid ${theme.colors.line}`,
                  boxShadow: isMean ? theme.shadows.accentGlow : theme.shadows.card,
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: theme.weights.strong,
                    opacity: isMean ? 0.9 : 0.7,
                  }}
                >
                  বাংলা অর্থ:
                </span>
                <span
                  style={{
                    fontSize: 46,
                    fontWeight: theme.weights.hero,
                  }}
                >
                  {data.meaning}
                </span>
              </div>
            </Entrance>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
            Gulf Arabic • Survival Day 14
          </span>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, WordReveal, SceneExit, Pill, Card, PulseRings, ShimmerSweep } from "../components/kit";
import { Icon } from "../components/Icons";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          textAlign: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        {/* Car / Navigation Icon with pulsing radar rings */}
        <Entrance delay={4} preset="bouncy">
          <div
            style={{
              position: "relative",
              width: 140,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 34,
            }}
          >
            <PulseRings size={160} color={theme.colors.primary} />
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: theme.gradients.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.shadows.glow,
                border: "2px solid rgba(255, 255, 255, 0.9)",
              }}
            >
              <Icon name="car" size={68} color={theme.colors.primaryDeep} />
            </div>
          </div>
        </Entrance>

        {/* Topic Tag */}
        <Entrance delay={14}>
          <Pill
            text="যাতায়াত ও রাস্তা ঘাট"
            tone="accent"
            style={{ marginBottom: 32, fontSize: 28, padding: "12px 32px" }}
          />
        </Entrance>

        {/* Core Hook Question */}
        <WordReveal
          text="আরব দেশে যাতায়াতের সময় রাস্তা চিনতে সমস্যা হয়?"
          delay={24}
          style={{
            fontSize: 64,
            fontWeight: theme.weights.hero,
            color: theme.colors.text,
            lineHeight: 1.25,
            maxWidth: 920,
            letterSpacing: "-0.01em",
          }}
        />

        {/* Modern Solution Banner */}
        <Entrance delay={65} fromY={30}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: theme.gradients.surface,
              padding: "18px 42px",
              borderRadius: theme.radius.pill,
              border: `1.5px solid ${theme.colors.line}`,
              boxShadow: theme.shadows.card,
              marginTop: 40,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: theme.colors.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="map-pin" size={22} color={theme.colors.primaryDeep} />
            </div>
            <p
              style={{
                fontSize: 34,
                color: theme.colors.textDim,
                fontWeight: theme.weights.strong,
                margin: 0,
              }}
            >
              ট্যাক্সি ড্রাইভারকে স্পষ্ট দিক নির্দেশনা দিন সহজে!
            </p>
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const TitleScene: React.FC = () => {
  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          textAlign: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={6} preset="snappy">
          <Pill
            text="Arabic Master"
            tone="hero"
            style={{ marginBottom: 28, fontSize: 26, padding: "10px 28px" }}
          />
        </Entrance>

        <Entrance delay={18}>
          <h1
            style={{
              fontSize: 84,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              margin: "8px 0",
              letterSpacing: "-0.01em",
            }}
          >
            ৩০ দিনে ৩০০টি
          </h1>
        </Entrance>

        <Entrance delay={32} preset="bouncy">
          <div
            style={{
              position: "relative",
              fontSize: 68,
              fontWeight: theme.weights.hero,
              color: "#FFFFFF",
              background: theme.gradients.primary,
              padding: "20px 58px",
              borderRadius: theme.radius.md,
              border: "2px solid rgba(255, 255, 255, 0.35)",
              boxShadow: theme.shadows.glow,
              margin: "20px 0",
              letterSpacing: "0.02em",
              overflow: "hidden",
            }}
          >
            <ShimmerSweep />
            Survival Arabic
          </div>
        </Entrance>

        <Entrance delay={50}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: theme.gradients.accent,
              color: "#FFFFFF",
              padding: "14px 44px",
              borderRadius: theme.radius.pill,
              fontSize: 44,
              fontWeight: theme.weights.hero,
              boxShadow: theme.shadows.accentGlow,
              border: "1.5px solid rgba(255, 255, 255, 0.4)",
              marginTop: 15,
            }}
          >
            <span>আজ ১৪তম দিন</span>
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const CountScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          textAlign: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={8}>
          <Pill text="অগ্রগতি চেক" tone="soft" style={{ marginBottom: 28 }} />
        </Entrance>

        <Entrance delay={20}>
          <div
            style={{
              fontSize: 44,
              fontWeight: theme.weights.strong,
              color: theme.colors.textDim,
              marginBottom: 16,
            }}
          >
            আলহামদুলিল্লাহ! ইতিমধ্যে শেখা শেষ
          </div>
        </Entrance>

        {/* Big Highlighted Count */}
        <Entrance delay={36} preset="bouncy">
          <div
            style={{
              position: "relative",
              fontSize: 150,
              fontWeight: theme.weights.hero,
              color: theme.colors.primary,
              letterSpacing: "-0.03em",
              textShadow: "0 14px 40px rgba(14, 159, 110, 0.35)",
              lineHeight: 1.1,
            }}
          >
            ১৩০টি
          </div>
        </Entrance>

        <Entrance delay={58}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontSize: 38,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "16px 44px",
              borderRadius: theme.radius.pill,
              border: `1.5px solid ${theme.colors.line}`,
              boxShadow: theme.shadows.card,
              marginTop: 24,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: theme.colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              ✓
            </div>
            <span>দৈনন্দিন দরকারি বাক্য</span>
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const ReadyScene: React.FC = () => {
  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          textAlign: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={6}>
          <Pill text="আজকের লেসন" tone="accent" style={{ marginBottom: 32 }} />
        </Entrance>

        <WordReveal
          text="যাতায়াত ও রাস্তার দিক নির্দেশনা দেওয়ার আরও ১০টি বাক্য"
          delay={20}
          style={{
            fontSize: 58,
            fontWeight: theme.weights.hero,
            color: theme.colors.text,
            lineHeight: 1.3,
            maxWidth: 920,
            letterSpacing: "-0.01em",
          }}
        />

        <Entrance delay={55} preset="bouncy">
          <div
            style={{
              marginTop: 48,
              fontSize: 46,
              fontWeight: theme.weights.hero,
              color: "#FFFFFF",
              background: theme.gradients.primary,
              padding: "20px 64px",
              borderRadius: theme.radius.pill,
              boxShadow: theme.shadows.glow,
              border: "2px solid rgba(255, 255, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span>চলুন শুরু করি!</span>
            <span style={{ fontSize: 40 }}>➔</span>
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

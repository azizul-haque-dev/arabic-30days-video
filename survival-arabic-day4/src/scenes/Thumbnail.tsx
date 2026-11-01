import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { BgMesh, Grade, Grain, Vignette } from "../components/Chrome";
import { Card, Pill } from "../components/kit";

export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1080,
        fontFamily: theme.fonts.display,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BgMesh />

      <AbsoluteFill
        style={{
          padding: "68px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            width: "100%",
            marginTop: 8,
          }}
        >
          <Pill
            tone="hero"
            style={{
              fontSize: 32,
              padding: "12px 32px",
              fontWeight: theme.weights.hero,
              boxShadow: theme.shadows.hero,
              letterSpacing: 0.5,
            }}
          >
            DAY 04 • চতুর্থ দিন
          </Pill>

          <Pill
            tone="accent"
            style={{
              fontSize: 28,
              padding: "12px 28px",
              fontWeight: theme.weights.strong,
            }}
          >
            প্রবাসীদের দৈনন্দিন আরবি
          </Pill>
        </div>

        {/* Center Hero Card */}
        <Card
          style={{
            width: "100%",
            padding: "52px 46px",
            textAlign: "center",
            boxShadow: theme.shadows.card,
            border: `2px solid ${theme.colors.primarySoft}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              lineHeight: 1.22,
              letterSpacing: 0,
            }}
          >
            <span
              style={{
                color: theme.colors.primary,
                textShadow: `0 0 24px ${theme.colors.glow}`,
              }}
            >
              আরব
            </span>{" "}
            দেশে থাকেন?
          </div>

          <div
            style={{
              fontSize: 50,
              fontWeight: theme.weights.strong,
              color: theme.colors.textDim,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            কিন্তু আরবি বলতে গিয়ে{" "}
            <span
              style={{
                color: theme.colors.accent,
                fontWeight: theme.weights.hero,
              }}
            >
              আটকে
            </span>{" "}
            যান?
          </div>

          {/* Highlights Row */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Pill
              tone="soft"
              style={{
                fontSize: 26,
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
              }}
            >
              ✓ বাক্য ৩১ – ৪০
            </Pill>
            <Pill
              tone="white"
              style={{
                fontSize: 26,
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
                border: `1.5px solid ${theme.colors.line}`,
              }}
            >
              ✓ ৩০ দিনের সহজ কোর্স
            </Pill>
            <Pill
              tone="soft"
              style={{
                fontSize: 26,
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
              }}
            >
              ✓ Arabic Master
            </Pill>
          </div>
        </Card>

        {/* Bottom Relief / Callout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <Pill
            tone="hero"
            style={{
              fontSize: 46,
              padding: "18px 56px",
              boxShadow: theme.shadows.hero,
              fontWeight: theme.weights.hero,
            }}
          >
            চিন্তা নেই! সহজে শিখুন
          </Pill>
        </div>
      </AbsoluteFill>

      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};


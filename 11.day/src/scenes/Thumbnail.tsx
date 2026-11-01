import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { BgMesh, Grade, Grain, Vignette } from "../components/Chrome";
import { Card, Pill } from "../components/kit";

const C = theme.colors;

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
        {/* Top Header */}
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
            size={34}
            style={{
              padding: "12px 32px",
              fontWeight: theme.weights.hero,
              boxShadow: theme.shadow.hero,
            }}
          >
            DAY 11 • ১১তম দিন
          </Pill>

          <Pill
            tone="accent"
            size={30}
            style={{
              padding: "12px 28px",
              fontWeight: theme.weights.strong,
            }}
          >
            প্রবাসীদের দৈনন্দিন আরবি
          </Pill>
        </div>

        {/* Center Card */}
        <Card
          style={{
            width: "100%",
            padding: "52px 46px",
            textAlign: "center",
            boxShadow: theme.shadow.card,
            border: `2px solid ${C.primarySoft}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: theme.weights.hero,
              color: C.text,
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            <span
              style={{
                color: C.primary,
                textShadow: `0 0 24px ${C.glow}`,
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
              color: C.textDim,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            কিন্তু আরবি বলতে গিয়ে{" "}
            <span
              style={{
                color: C.accent,
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
              size={26}
              style={{
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
              }}
            >
              ✓ বাক্য ১০১ – ১১০
            </Pill>
            <Pill
              tone="white"
              size={26}
              style={{
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
                border: `1.5px solid ${C.line}`,
              }}
            >
              ✓ ৩০ দিনের সহজ কোর্স
            </Pill>
            <Pill
              tone="soft"
              size={26}
              style={{
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
            size={46}
            style={{
              padding: "18px 56px",
              boxShadow: theme.shadow.hero,
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


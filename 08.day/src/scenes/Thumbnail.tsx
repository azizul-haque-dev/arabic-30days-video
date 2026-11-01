import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, withAlpha } from "../theme";
import { BgMesh, Grade, Grain, Vignette } from "../components/fx";

export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1080,
        fontFamily: theme.fonts.bn,
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
          <div
            style={{
              padding: "12px 32px",
              borderRadius: theme.radius.pill,
              background: theme.colors.primary,
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: 700,
              boxShadow: theme.shadow.hero,
            }}
          >
            DAY 08 • অষ্টম দিন
          </div>

          <div
            style={{
              padding: "12px 28px",
              borderRadius: theme.radius.pill,
              background: withAlpha(theme.colors.accent, 0.22),
              color: theme.colors.text,
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            প্রবাসীদের দৈনন্দিন আরবি
          </div>
        </div>

        {/* Center Card */}
        <div
          style={{
            width: "100%",
            padding: "52px 46px",
            textAlign: "center",
            background: theme.colors.surface,
            borderRadius: theme.radius.card,
            boxShadow: theme.shadow.card,
            border: `1px solid ${theme.colors.line}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: theme.colors.text,
              lineHeight: 1.2,
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
              fontWeight: 600,
              color: theme.colors.textDim,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            কিন্তু আরবি বলতে গিয়ে{" "}
            <span
              style={{
                color: theme.colors.accent,
                fontWeight: 700,
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
            <div
              style={{
                padding: "10px 22px",
                borderRadius: theme.radius.pill,
                background: theme.colors.mint,
                color: theme.colors.primary,
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              ✓ বাক্য ৭১ – ৮০
            </div>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: theme.radius.pill,
                background: "#FFFFFF",
                color: theme.colors.text,
                fontSize: 26,
                fontWeight: 600,
                border: `1.5px solid ${theme.colors.line}`,
              }}
            >
              ✓ ৩০ দিনের সহজ কোর্স
            </div>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: theme.radius.pill,
                background: theme.colors.mint,
                color: theme.colors.primary,
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              ✓ Arabic Master
            </div>
          </div>
        </div>

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
          <div
            style={{
              padding: "18px 56px",
              borderRadius: theme.radius.pill,
              background: theme.colors.primary,
              color: "#FFFFFF",
              fontSize: 46,
              fontWeight: 700,
              boxShadow: theme.shadow.hero,
            }}
          >
            চিন্তা নেই! সহজে শিখুন
          </div>
        </div>
      </AbsoluteFill>

      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};


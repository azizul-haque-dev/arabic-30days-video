import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { Icon } from "../components/Icons";
import { BgMesh, Grade, Grain, Vignette } from "../components/Chrome";

export const Thumbnail: React.FC<{ isVideoIntro?: boolean }> = ({ isVideoIntro = false }) => {
  const frame = useCurrentFrame();

  // Subtle breathing/floating for video intro if active, static perfect on frame 0
  const float = isVideoIntro ? Math.sin(frame / 20) * 3 : 0;
  const scale = isVideoIntro ? interpolate(frame, [0, 24], [1, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1080,
        overflow: "hidden",
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.display,
        transform: `scale(${scale})`,
      }}
    >
      {/* Background layer */}
      <BgMesh />

      {/* Radiant Glow in the center */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 750,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14, 159, 110, 0.18) 0%, rgba(245, 158, 11, 0.10) 50%, transparent 75%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Main Content Layout */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "54px 50px 48px 50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Series Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "10px 24px",
              borderRadius: theme.radius.pill,
              border: `1.5px solid ${theme.colors.line}`,
              boxShadow: "0 6px 20px rgba(16, 35, 29, 0.08)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: theme.colors.primary,
                boxShadow: "0 0 10px rgba(14, 159, 110, 0.8)",
              }}
            />
            <span
              style={{
                fontSize: 24,
                fontWeight: theme.weights.hero,
                color: theme.colors.text,
                letterSpacing: "0.02em",
              }}
            >
              SURVIVAL ARABIC • ৩০ দিনে ৩০০ বাক্য
            </span>
          </div>

          {/* Golden Day Badge */}
          <div
            style={{
              background: theme.gradients.accent,
              color: "#FFFFFF",
              padding: "10px 28px",
              borderRadius: theme.radius.pill,
              fontSize: 26,
              fontWeight: theme.weights.hero,
              boxShadow: theme.shadows.accentGlow,
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
            }}
          >
            <span>DAY 14</span>
            <span style={{ opacity: 0.85, fontSize: 22 }}>•</span>
            <span style={{ fontSize: 24 }}>১৪তম দিন</span>
          </div>
        </div>

        {/* Center Hero Block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {/* Topic Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255, 255, 255, 0.95)",
              border: `1.5px solid ${theme.colors.primarySoft}`,
              padding: "10px 28px",
              borderRadius: theme.radius.pill,
              boxShadow: "0 8px 24px rgba(14, 159, 110, 0.12)",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: theme.colors.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="car" size={22} color={theme.colors.primaryDeep} />
            </div>
            <span
              style={{
                fontSize: 26,
                fontWeight: theme.weights.strong,
                color: theme.colors.primaryDeep,
              }}
            >
              যাতায়াত ও রাস্তা ঘাট
            </span>
          </div>

          {/* Main Headline (Huge & High-CTR) */}
          <h1
            style={{
              fontSize: 66,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 960,
              letterSpacing: "-0.01em",
            }}
          >
            আরব দেশে ট্যাক্সি ও রাস্তা চেনার
          </h1>

          <div
            style={{
              display: "inline-block",
              background: theme.gradients.primary,
              color: "#FFFFFF",
              padding: "12px 42px",
              borderRadius: 24,
              fontSize: 62,
              fontWeight: theme.weights.hero,
              boxShadow: theme.shadows.glow,
              marginTop: 14,
              marginBottom: 16,
              border: "1.5px solid rgba(255, 255, 255, 0.3)",
              letterSpacing: "0.01em",
            }}
          >
            ১০টি জরুরি বাক্য!
          </div>

          <p
            style={{
              fontSize: 30,
              fontWeight: theme.weights.strong,
              color: theme.colors.textDim,
              margin: 0,
            }}
          >
            ট্যাক্সি ড্রাইভারকে স্পষ্ট দিক নির্দেশনা দিন সহজেই
          </p>
        </div>

        {/* Floating 3D Showcase Preview Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            margin: "10px 0",
            transform: `translateY(${float}px)`,
          }}
        >
          {/* Preview Card 1 */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 252, 250, 0.92) 100%)",
              borderRadius: 28,
              padding: "20px 24px",
              border: "1.5px solid rgba(255, 255, 255, 0.9)",
              boxShadow: "0 18px 40px rgba(16, 35, 29, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transform: "rotate(-1deg)",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: theme.fonts.arabic,
                  fontSize: 44,
                  fontWeight: 700,
                  color: theme.colors.primary,
                  lineHeight: 1.2,
                }}
              >
                لف يمين
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.text,
                }}
              >
                লিফ ইয়ামীন <span style={{ color: theme.colors.accent, fontSize: 22 }}>• ডানে ঘুরুন</span>
              </div>
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: theme.colors.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="arrow-right" size={30} color={theme.colors.primaryDeep} />
            </div>
          </div>

          {/* Preview Card 2 */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 252, 250, 0.92) 100%)",
              borderRadius: 28,
              padding: "20px 24px",
              border: "1.5px solid rgba(255, 255, 255, 0.9)",
              boxShadow: "0 18px 40px rgba(16, 35, 29, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transform: "rotate(1deg)",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: theme.fonts.arabic,
                  fontSize: 44,
                  fontWeight: 700,
                  color: theme.colors.primary,
                  lineHeight: 1.2,
                }}
              >
                كمّل على طول
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.text,
                }}
              >
                কাম্মিল আলা তূল <span style={{ color: theme.colors.accent, fontSize: 22 }}>• সোজা চলুন</span>
              </div>
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: theme.colors.accentSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="arrow-up" size={30} color="#B45309" />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Social Proof & CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.92)",
            borderRadius: theme.radius.pill,
            padding: "12px 30px",
            border: `1.5px solid ${theme.colors.line}`,
            boxShadow: "0 8px 24px rgba(16, 35, 29, 0.06)",
          }}
        >
          {/* Creator / Channel */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 26,
                fontWeight: theme.weights.hero,
                color: theme.colors.text,
                letterSpacing: "0.02em",
              }}
            >
              Arabic Master
            </span>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: theme.colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              ✓
            </div>
          </div>

          {/* Action Callout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 24,
              fontWeight: theme.weights.strong,
              color: theme.colors.primaryDeep,
            }}
          >
            <span>📌 ভিডিওটি সেভ করে রাখুন</span>
          </div>

          {/* Sentence numbers */}
          <div
            style={{
              fontSize: 24,
              fontWeight: theme.weights.hero,
              color: theme.colors.accent,
            }}
          >
            বাক্য ১৩১ - ১৪০
          </div>
        </div>
      </div>

      {/* Grade and grain for texture */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};


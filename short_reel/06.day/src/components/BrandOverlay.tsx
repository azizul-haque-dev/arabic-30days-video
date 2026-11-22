import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const BrandOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    delay: 2,
    config: theme.spring.pop,
  });
  const titleY = interpolate(titleIn, [0, 1], [-70, 0]);
  const titleScale = interpolate(titleIn, [0, 1], [0.75, 1]);

  const followIn = spring({
    frame,
    fps,
    delay: Math.round(fps * 0.35),
    config: theme.spring.soft,
  });
  const followY = interpolate(followIn, [0, 1], [80, 0]);
  const pulse = 1 + Math.sin((frame / fps) * 2.8) * 0.025;
  const followOpacity = interpolate(frame, [0, Math.round(fps * 0.55)], [0, 1], clamp);

  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 20}}>
      <div
        style={{
          position: "absolute",
          top: 66,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: titleIn,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
        }}
      >
        <div
          style={{
            height: 108,
            minWidth: 520,
            padding: "12px 24px 12px 18px",
            borderRadius: 54,
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            border: `3px solid ${theme.colors.cardBorder}`,
            boxShadow: "0 18px 45px rgba(20, 83, 45, 0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: `'${theme.fonts.arabic}', ${theme.fonts.fallback}`,
              fontSize: 38,
              fontWeight: 700,
              direction: "rtl",
            }}
          >
            ع
          </div>
          <span
            style={{
              fontFamily: `'${theme.fonts.bengali}', ${theme.fonts.fallback}`,
              color: theme.colors.dark,
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            Arabic Master
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 62,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: followOpacity,
          transform: `translateY(${followY}px) scale(${followIn * pulse})`,
        }}
      >
        <div
          style={{
            height: 92,
            minWidth: 500,
            padding: "14px 34px",
            borderRadius: 46,
            backgroundColor: theme.colors.subtitleBg,
            boxShadow: "0 18px 50px rgba(20, 83, 45, 0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: theme.colors.accent,
              color: theme.colors.dark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontFamily: theme.fonts.fallback,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            +
          </div>
          <span
            style={{
              fontFamily: `'${theme.fonts.bengali}', ${theme.fonts.fallback}`,
              color: theme.colors.white,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Follow for more
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";
import {TimelineItem} from "../lib/timeline";
import {IconArt} from "./icons/IconArt";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/**
 * One vocabulary card. Rendered inside a <Sequence>, so useCurrentFrame() is local:
 * frame 0 = the frame its pronunciation cue starts.
 * Entrance is staggered and compact (works even for ~9-frame cues);
 * exit is faster than entrance and ends exactly when the next card starts.
 */
export const VocabCard: React.FC<{row: TimelineItem}> = ({row}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {item, pronText, meaningText} = row;

  const stagger = Math.round(fps * 0.14); // ~4 frames
  const meaningAt = row.meaningStart - row.start;
  const pronLen = Math.max(row.pronEnd - row.start, Math.round(fps * 0.3));
  const meaningLen = Math.max(row.meaningEnd - row.meaningStart, Math.round(fps * 0.3));

  const sp = (delay: number, config: object = theme.spring.snappy) =>
    spring({frame: frame - delay, fps, config});

  // ---- card shell -------------------------------------------------------
  const cardIn = sp(0, theme.spring.soft);
  const exitLen = Math.round(fps * 0.3);
  const exitStart = durationInFrames - exitLen;
  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {...clamp, easing: theme.easing.inCubic});
  const breathe = Math.sin((frame / fps) * 1.6) * 0.004;
  const cardScale = interpolate(cardIn, [0, 1], [0.92, 1]) * (1 - exit * 0.04) + breathe;
  const cardY = interpolate(cardIn, [0, 1], [50, 0]) - exit * 30;
  const cardOpacity = interpolate(frame, [0, Math.round(fps * 0.3)], [0, 1], clamp) * (1 - exit);

  // ---- pronunciation ----------------------------------------------------
  const pronP = sp(stagger * 0);
  const pronSweep = interpolate(frame, [0, pronLen], [0, 1], {...clamp, easing: theme.easing.inOutCubic});
  const pronActive = frame >= 0 && frame < row.pronEnd - row.start + Math.round(fps * 0.1);

  // ---- arabic -----------------------------------------------------------
  const arP = sp(stagger * 1.5);
  const arReveal = interpolate(arP, [0, 1], [100, 0]);

  // ---- icon -------------------------------------------------------------
  const iconP = sp(stagger * 2.5, theme.spring.pop);
  const iconMarks = sp(stagger * 2.5 + Math.round(fps * 0.35), theme.spring.soft);
  const floatY = Math.sin((frame / fps) * 2) * 7;

  // ---- divider ----------------------------------------------------------
  const divP = sp(stagger * 3);

  // ---- meaning ----------------------------------------------------------
  const mFrame = frame - meaningAt;
  const meaningP = spring({frame: mFrame, fps, config: theme.spring.snappy});
  const meaningActive = mFrame >= 0 && mFrame < meaningLen + Math.round(fps * 0.1);
  const meaningHi = interpolate(mFrame, [0, Math.round(fps * 0.2)], [0, 1], clamp);

  const pronSize = pronText.length > 14 ? 66 : pronText.length > 9 ? 88 : 116;

  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "flex-start", pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          top: theme.layout.cardTop,
          width: theme.layout.cardWidth,
          height: theme.layout.cardHeight,
          borderRadius: 64,
          backgroundColor: theme.colors.white,
          border: `3px solid ${theme.colors.cardBorder}`,
          boxShadow: `0 40px 90px -30px ${theme.colors.shadow}, 0 8px 24px -12px ${theme.colors.shadow}`,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 54,
        }}
      >
        {/* icon stage */}
        <div
          style={{
            width: 430,
            height: 430,
            borderRadius: "50%",
            backgroundColor: theme.colors.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: iconP > 0.01 ? 1 : 0,
            transform: `scale(${interpolate(iconP, [0, 1], [0.55, 1])}) translateY(${floatY}px) rotate(${interpolate(iconP, [0, 1], [-5, 0])}deg)`,
          }}
        >
          <div style={{width: 370, height: 370}}>
            <IconArt icon={item.icon} p={Math.min(1, Math.max(0, iconMarks))} />
          </div>
        </div>

        {/* arabic */}
        <div
          style={{
            marginTop: 26,
            height: 230,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            clipPath: `inset(0 0 ${arReveal}% 0)`,
            opacity: arP > 0.01 ? 1 : 0,
            transform: `translateY(${interpolate(arP, [0, 1], [60, 0])}px)`,
          }}
        >
          <span
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: `'${theme.fonts.arabic}', ${theme.fonts.fallback}`,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1.7,
              color: theme.colors.text,
              direction: "rtl",
              unicodeBidi: "isolate",
              whiteSpace: "nowrap",
            }}
          >
            {item.arabic}
          </span>
        </div>

        {/* accent divider */}
        <div
          style={{
            width: interpolate(divP, [0, 1], [0, 110]),
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.accent,
            marginTop: 8,
            marginBottom: 30,
            opacity: 0.9,
          }}
        />

        {/* pronunciation */}
        <div
          style={{
            position: "relative",
            maxWidth: 800,
            textAlign: "center",
            opacity: interpolate(pronP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(pronP, [0, 1], [70, 0])}px) scale(${interpolate(pronP, [0, 1], [0.88, 1])})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: pronSize * 0.06,
              height: pronSize * 0.28,
              borderRadius: 14,
              backgroundColor: theme.colors.accentSoft,
              transformOrigin: "left center",
              transform: `scaleX(${pronActive ? pronSweep : 1})`,
              opacity: pronActive ? 1 : 0.0,
            }}
          />
          <span
            style={{
              position: "relative",
              fontFamily: `'${theme.fonts.bengali}', ${theme.fonts.fallback}`,
              fontWeight: 700,
              fontSize: pronSize,
              lineHeight: 1.45,
              color: theme.colors.dark,
              textWrap: "balance",
            }}
          >
            {pronText}
          </span>
        </div>

        {/* meaning */}
        <div
          style={{
            marginTop: 26,
            padding: "10px 34px",
            borderRadius: 40,
            backgroundColor: meaningActive ? theme.colors.light : "rgba(220,252,231,0)",
            opacity: interpolate(meaningP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(meaningP, [0, 1], [34, 0])}px) scale(${interpolate(meaningP, [0, 1], [0.92, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: `'${theme.fonts.bengali}', ${theme.fonts.fallback}`,
              fontWeight: 600,
              fontSize: 62,
              lineHeight: 1.5,
              color: meaningActive ? theme.colors.dark : theme.colors.textDim,
              opacity: 0.55 + 0.45 * meaningHi,
            }}
          >
            {meaningText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

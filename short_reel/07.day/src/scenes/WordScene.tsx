import React from "react";
import {AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {VocabIcon} from "../components/Icons";
import type {Lesson} from "../data/lessons";
import type {WordSchedule} from "../timing";
import {theme} from "../theme";

const C = theme.colors;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** One vocabulary card. All timing comes from the SRT-derived schedule (absolute frames -> local frames). */
export const WordScene: React.FC<{lesson: Lesson; sched: WordSchedule}> = ({lesson, sched}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = (abs: number) => abs - sched.sceneIn;
  const pronS = L(sched.pronStart);
  const pronE = L(sched.pronEnd);
  const meanS = L(sched.meanStart);
  const meanE = L(sched.meanEnd);
  const exitF = Math.round(theme.motion.exitSec * fps);

  const enter = spring({frame, fps, config: theme.spring.soft, durationInFrames: Math.round(theme.motion.entranceSec * fps)});
  const exit = interpolate(frame, [meanE, meanE + exitF], [0, 1], {...clamp, easing: theme.ease.in});
  const sceneOpacity = interpolate(enter, [0, 0.35], [0, 1], clamp) * (1 - exit);

  // Arabic: right-to-left reveal at the exact pronunciation cue
  const revealF = Math.round(0.4 * fps);
  const reveal = interpolate(frame, [pronS, pronS + revealF], [0, 1], {...clamp, easing: theme.ease.out});
  const hl = interpolate(frame, [pronS - 2, pronS + 4, pronE, pronE + 10], [0, 1, 1, 0], {...clamp, easing: theme.ease.inOut});
  const arabicColor = interpolateColors(hl, [0, 1], [C.white, C.gold]);
  const sweep = interpolate(frame, [pronS, pronE + 6], [0, 1], {...clamp, easing: theme.ease.out});

  // Bangla pronunciation (staggered right after the Arabic starts)
  const pronIn = spring({frame: frame - (pronS + 5), fps, config: theme.spring.snappy});
  // Bangla meaning at the meaning cue
  const meanIn = spring({frame: frame - meanS, fps, config: theme.spring.pop});

  const stagePop = spring({frame: frame - 2, fps, config: theme.spring.pop});
  const idle = Math.sin((frame / fps) * 1.6);
  const placeholderPulse = 0.35 + 0.15 * Math.sin((frame / fps) * 4);

  const arabicSize = lesson.arabic.length > 4 ? 200 : 220;

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        transform: `translateY(${(1 - enter) * 80 - exit * 70}px) scale(${0.96 + 0.04 * enter - 0.03 * exit})`,
      }}
    >
      {/* Illustration stage */}
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 335,
          width: 700,
          height: 680,
          borderRadius: 72,
          background: `radial-gradient(circle at 50% 38%, rgba(155,232,194,0.22), ${C.glass} 70%)`,
          border: `3px solid ${C.glassBorder}`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.35), inset 0 0 60px rgba(255,255,255,0.04)",
          transform: `scale(${0.8 + 0.2 * stagePop + idle * 0.006})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        <div style={{transform: "translateY(-18px)"}}><VocabIcon icon={lesson.icon} size={600} /></div>
      </div>

      {/* Arabic word (no harakat) */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1050, height: 260, display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 190,
            borderRadius: 60,
            border: `4px dashed rgba(255,255,255,${placeholderPulse})`,
            opacity: 1 - reveal,
          }}
        />
        <div
          lang="ar"
          dir="rtl"
          style={{
            fontFamily: theme.fonts.arabic,
            fontWeight: 800,
            fontSize: arabicSize,
            lineHeight: 1.45,
            color: arabicColor,
            direction: "rtl",
            unicodeBidi: "isolate",
            whiteSpace: "nowrap",
            textShadow: `0 0 ${50 * hl}px rgba(247,201,72,${0.6 * hl}), 0 10px 0 rgba(0,0,0,0.25)`,
            transform: `translateX(${(1 - reveal) * 40}px) scale(${1 + 0.05 * hl})`,
            filter: `blur(${(1 - reveal) * 10}px)`,
            WebkitMaskImage: `linear-gradient(to left, #000 0%, #000 ${reveal * 120 - 20}%, transparent ${reveal * 120}%)`,
            maskImage: `linear-gradient(to left, #000 0%, #000 ${reveal * 120 - 20}%, transparent ${reveal * 120}%)`,
          }}
        >
          {lesson.arabic}
        </div>
        {/* highlight underline sweeping right → left */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: "50%",
            marginRight: -190,
            width: 380 * sweep,
            height: 10,
            borderRadius: 5,
            background: C.gold,
            opacity: hl * 0.9,
          }}
        />
      </div>

      {/* Bangla pronunciation */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1322,
          textAlign: "center",
          fontFamily: theme.fonts.bangla,
          fontWeight: 700,
          fontSize: 100,
          lineHeight: 1.3,
          color: C.mint,
          opacity: Math.min(1, pronIn * 2),
          transform: `translateY(${(1 - pronIn) * 30}px) scale(${0.9 + 0.1 * pronIn})`,
        }}
      >
        {lesson.pron}
      </div>

      {/* Bangla meaning */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1478, display: "flex", justifyContent: "center"}}>
        <div
          style={{
            fontFamily: theme.fonts.bangla,
            fontWeight: 700,
            fontSize: 98,
            lineHeight: 1.3,
            color: C.white,
            padding: "14px 80px 22px",
            borderRadius: 100,
            background: `linear-gradient(180deg, ${C.green}, ${C.greenDark})`,
            border: "3px solid rgba(255,255,255,0.35)",
            boxShadow: `0 18px 50px rgba(20,168,92,${0.45 * meanIn}), 0 8px 0 rgba(0,0,0,0.22)`,
            opacity: Math.min(1, meanIn * 2.5),
            transform: `translateY(${(1 - meanIn) * 40}px) scale(${0.7 + 0.3 * meanIn})`,
          }}
        >
          {lesson.meaning}
        </div>
      </div>
    </AbsoluteFill>
  );
};

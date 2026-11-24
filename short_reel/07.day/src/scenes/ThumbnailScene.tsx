import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {LogoMark} from "../components/Logo";
import {PopFrom} from "../components/Person";
import {VocabIcon} from "../components/Icons";
import {EPISODE, theme} from "../theme";

const C = theme.colors;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const LETTERS = [
  {ch: "ع", x: 40, y: 330, s: 420, r: -12},
  {ch: "ر", x: 760, y: 560, s: 380, r: 10},
  {ch: "ب", x: 90, y: 1160, s: 360, r: 8},
  {ch: "ي", x: 800, y: 1400, s: 380, r: -8},
];

/** Opening thumbnail. EVERYTHING is already visible on frame 0 (animations only move/scale, never start from empty). */
export const ThumbnailScene: React.FC<{holdFrames: number; exitFrames: number}> = ({holdFrames, exitFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = (delay: number, from = 0.86) => from + (1 - from) * spring({frame: frame - delay, fps, config: theme.spring.pop});
  const soft = (delay: number, from = 0.9) => from + (1 - from) * spring({frame: frame - delay, fps, config: theme.spring.soft});
  const ex = interpolate(frame, [holdFrames, holdFrames + exitFrames], [0, 1], {...clamp, easing: theme.ease.in});
  const shine = interpolate(frame, [4, 24], [-30, 130], {...clamp, easing: theme.ease.out});
  const t = frame / fps;

  return (
    <AbsoluteFill style={{opacity: 1 - ex, transform: `translateY(${-ex * 60}px) scale(${1 + ex * 0.05})`}}>
      {/* thumbnail-only backdrop: centre glow + rotating rays */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, rgba(20,168,92,0.55), rgba(4,26,19,0) 65%)`}} />
      <div
        style={{
          position: "absolute",
          left: 540 - 900,
          top: 800 - 900,
          width: 1800,
          height: 1800,
          background: `repeating-conic-gradient(from ${t * 6}deg at 50% 50%, rgba(155,232,194,0.10) 0deg 9deg, rgba(155,232,194,0) 9deg 24deg)`,
          WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 60%)",
          maskImage: "radial-gradient(circle, #000 0%, transparent 60%)",
        }}
      />
      {LETTERS.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: l.x,
            top: l.y + Math.sin(t * 0.9 + i) * 14,
            fontFamily: theme.fonts.arabic,
            fontWeight: 800,
            fontSize: l.s,
            lineHeight: 1,
            color: C.mint,
            opacity: 0.08,
            transform: `rotate(${l.r}deg)`,
          }}
        >
          {l.ch}
        </div>
      ))}

      {/* brand */}
      <div style={{position: "absolute", left: 0, right: 0, top: 228, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, transform: `scale(${pop(0)})`}}>
        <LogoMark size={104} />
        <span style={{fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 74, color: C.white, letterSpacing: 1}}>{EPISODE.brand}</span>
      </div>

      {/* episode badge */}
      <div style={{position: "absolute", left: 0, right: 0, top: 392, display: "flex", justifyContent: "center", transform: `scale(${pop(4)})`}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "16px 54px",
            borderRadius: 70,
            background: C.white,
            boxShadow: "0 12px 0 rgba(0,0,0,0.22)",
            fontFamily: theme.fonts.latin,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: 7,
            color: C.ink,
          }}
        >
          <span style={{width: 22, height: 22, borderRadius: 11, background: C.green}} />
          EPISODE {EPISODE.number}
        </div>
      </div>

      {/* headline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 510,
          textAlign: "center",
          fontFamily: theme.fonts.latin,
          fontWeight: 800,
          fontSize: 370,
          lineHeight: 1.05,
          color: C.gold,
          textShadow: `0 12px 0 ${C.goldDeep}, 0 28px 40px rgba(0,0,0,0.4)`,
          transform: `scale(${soft(0, 0.82)})`,
        }}
      >
        {EPISODE.headline}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 855,
          textAlign: "center",
          fontFamily: theme.fonts.latin,
          fontWeight: 800,
          fontSize: 106,
          letterSpacing: 3,
          color: C.white,
          textShadow: "0 8px 0 rgba(0,0,0,0.25)",
          transform: `scale(${soft(3, 0.86)})`,
        }}
      >
        {EPISODE.headlineSub}
      </div>

      {/* lesson range */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", transform: `scale(${pop(7)})`}}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "14px 56px",
            borderRadius: 70,
            background: "rgba(255,255,255,0.09)",
            border: `3px solid ${C.mint}`,
            fontFamily: theme.fonts.latin,
            fontWeight: 700,
            fontSize: 62,
            letterSpacing: 4,
            color: C.white,
          }}
        >
          WORD <span style={{color: C.mint}}>{EPISODE.firstWord}–{EPISODE.lastWord}</span>
          <div style={{position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "18%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.4), transparent)"}} />
        </div>
      </div>

      {/* family illustration + speech bubble */}
      <PopFrom.Provider value={0.8}>
        <div style={{position: "absolute", left: 240, top: 1090, width: 600, height: 600}}>
          <VocabIcon icon="family" size={600} />
        </div>
      </PopFrom.Provider>
      <div
        style={{
          position: "absolute",
          left: 690,
          top: 1110,
          width: 300,
          height: 160,
          borderRadius: 50,
          background: C.white,
          boxShadow: "0 12px 0 rgba(0,0,0,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pop(12, 0.8)}) rotate(${Math.sin(t * 2) * 1.5}deg)`,
        }}
      >
        <span lang="ar" dir="rtl" style={{fontFamily: theme.fonts.arabic, fontWeight: 800, fontSize: 100, lineHeight: 1.5, color: C.ink, direction: "rtl"}}>عائلة</span>
        <div style={{position: "absolute", left: 34, bottom: -26, width: 0, height: 0, borderLeft: "28px solid transparent", borderRight: "28px solid transparent", borderTop: `34px solid ${C.white}`}} />
      </div>
    </AbsoluteFill>
  );
};

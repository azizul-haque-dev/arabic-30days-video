import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {LogoMark} from "../components/Logo";
import {LESSONS} from "../data/lessons";
import {EPISODE, theme} from "../theme";

const C = theme.colors;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** Recap + animated FOLLOW FOR MORE call-to-action. Sits below the recap so it never covers lesson content. */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const enter = spring({frame, fps, config: theme.spring.soft});
  const logoPop = spring({frame: frame + 2, fps, config: theme.spring.pop});
  const ctaIn = spring({frame: frame - Math.round(0.45 * fps), fps, config: theme.spring.pop});
  const pulse = 1 + 0.035 * Math.sin(t * 5.2) * Math.min(1, ctaIn);
  const bounce = Math.abs(Math.sin(t * 4)) * 22;
  const bell = Math.sin(t * 9) * 14 * Math.max(0, Math.sin(t * 2.2));
  const ring = (offset: number) => {
    const p = ((t * 1.1 + offset) % 1);
    return {scale: 1 + p * 0.28, opacity: (1 - p) * 0.5 * Math.min(1, ctaIn)};
  };

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 2), transform: `translateY(${(1 - enter) * 50}px)`}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 215, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.7 + 0.3 * logoPop})`}}>
        <LogoMark size={170} />
        <div style={{fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 96, color: C.white, marginTop: 14, textShadow: "0 8px 0 rgba(0,0,0,0.25)"}}>{EPISODE.brand}</div>
        <div style={{fontFamily: theme.fonts.latin, fontWeight: 600, fontSize: 32, letterSpacing: 4, color: C.mint, marginTop: 4}}>
          EPISODE {EPISODE.number} · WORDS {EPISODE.firstWord}–{EPISODE.lastWord}
        </div>
      </div>

      {/* recap grid */}
      <div style={{position: "absolute", left: 60, right: 60, top: 655, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 22px"}}>
        {LESSONS.map((l, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const idx = col * 5 + row; // fill column by column so order reads top→bottom
          const lesson = LESSONS[idx];
          const p = spring({frame: frame - 6 - idx * 3, fps, config: theme.spring.snappy});
          return (
            <div
              key={l.id}
              style={{
                height: 98,
                borderRadius: 30,
                padding: "0 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.glass,
                border: `2px solid ${C.glassBorder}`,
                opacity: Math.min(1, p * 2.5),
                transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`,
              }}
            >
              <span style={{fontFamily: theme.fonts.bangla, fontWeight: 600, fontSize: 40, color: C.mint, lineHeight: 1.4}}>{lesson.meaning}</span>
              <span lang="ar" dir="rtl" style={{fontFamily: theme.fonts.arabic, fontWeight: 800, fontSize: 60, color: C.white, lineHeight: 1.5, direction: "rtl"}}>{lesson.arabic}</span>
            </div>
          );
        })}
      </div>

      {/* animated arrow */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1318 + bounce, display: "flex", justifyContent: "center", opacity: ctaIn}}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <path d="M14 22 L36 44 L58 22" fill="none" stroke={C.mint} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* FOLLOW FOR MORE button */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1432, display: "flex", justifyContent: "center"}}>
        <div style={{position: "relative", transform: `scale(${(0.6 + 0.4 * ctaIn) * pulse})`, opacity: Math.min(1, ctaIn * 2.5)}}>
          {[0, 0.5].map((o) => {
            const r = ring(o);
            return <div key={o} style={{position: "absolute", inset: 0, borderRadius: 100, border: `5px solid ${C.green}`, transform: `scale(${r.scale})`, opacity: r.opacity}} />;
          })}
          <div
            style={{
              position: "relative",
              padding: "34px 84px 38px",
              borderRadius: 100,
              background: `linear-gradient(180deg, #1BBE69, ${C.greenDark})`,
              border: "4px solid rgba(255,255,255,0.4)",
              boxShadow: "0 16px 0 rgba(0,0,0,0.25), 0 24px 60px rgba(20,168,92,0.5)",
              fontFamily: theme.fonts.latin,
              fontWeight: 800,
              fontSize: 66,
              letterSpacing: 3,
              color: C.white,
              whiteSpace: "nowrap",
            }}
          >
            {EPISODE.cta}
          </div>
          {/* notification accent */}
          <div style={{position: "absolute", right: -18, top: -30, width: 76, height: 76, borderRadius: 38, background: C.coral, border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${bell}deg)`}}>
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path d="M12 3 C8 3 6 6 6 10 L6 14 L4 17 L20 17 L18 14 L18 10 C18 6 16 3 12 3Z M10 19 C10 20.4 10.9 21 12 21 C13.1 21 14 20.4 14 19Z" fill="#fff" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

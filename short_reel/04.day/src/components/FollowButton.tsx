import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CTA_FRAME, ROW_H, ROW_GAP, ROW_TOP, PHRASES } from "../data";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BTN_W = 580;
const BTN_H = 112;

const PlusIcon: React.FC = () => (
  <svg width="56" height="56" viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="28" fill={theme.colors.text} />
    <path d="M28 15v26M15 28h26" stroke={theme.colors.accent} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Cursor: React.FC = () => (
  <svg width="86" height="86" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 8px 10px rgba(16,35,29,0.35))" }}>
    <path d="M5 3l14 7.5-6 1.8-2.2 6.2z" fill="#fff" stroke={theme.colors.text} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const FollowButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lastRowBottom = ROW_TOP + PHRASES.length * (ROW_H + ROW_GAP) - ROW_GAP;
  const top = lastRowBottom + 46;

  const enter = spring({ frame: frame - 12, fps, config: theme.spring.bouncy });
  const breathe = 1 + Math.sin(frame / 22) * 0.015;

  const cta = spring({ frame: frame - CTA_FRAME, fps, config: theme.spring.bouncy });
  const tapF = CTA_FRAME + 30;
  const press = interpolate(frame, [tapF, tapF + 4, tapF + 12], [0, 1, 0], { easing: theme.ease.out, ...clamp });
  const scale = enter * breathe * (1 + 0.1 * cta) * (1 - 0.07 * press);

  // cursor glides in, taps
  const cur = spring({ frame: frame - CTA_FRAME - 6, fps, config: theme.spring.smooth });
  const curOut = interpolate(frame, [tapF + 22, tapF + 34], [0, 1], { easing: theme.ease.in, ...clamp });
  const curX = interpolate(cur, [0, 1], [190, 118]);
  const curY = interpolate(cur, [0, 1], [190, 26]) + press * 6;

  // pulse rings after CTA starts
  const rings = [0, 1].map((k) => {
    const t = (frame - CTA_FRAME - 4 - k * 22) % 52;
    const valid = frame - CTA_FRAME - 4 - k * 22 >= 0;
    const q = valid ? interpolate(t, [0, 40], [0, 1], { easing: theme.ease.out, ...clamp }) : 0;
    return { s: 1 + q * 0.38, o: valid ? (1 - q) * 0.7 : 0 };
  });

  // tap ripple
  const rp = interpolate(frame, [tapF, tapF + 18], [0, 1], { easing: theme.ease.out, ...clamp });
  const rippleOn = frame >= tapF;

  return (
    <div style={{ position: "absolute", left: (1080 - BTN_W) / 2, top, width: BTN_W, height: BTN_H }}>
      {rings.map((r, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: BTN_H / 2,
          border: `4px solid ${theme.colors.accent}`, opacity: r.o, transform: `scale(${r.s})` }} />
      ))}
      <div style={{ position: "absolute", inset: 0, borderRadius: BTN_H / 2, background: theme.colors.accent,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 22, opacity: Math.min(1, enter),
        transform: `scale(${scale})`,
        boxShadow: `0 20px 40px -16px rgba(16,35,29,0.4), 0 0 ${46 * cta}px ${theme.colors.accentGlow}`,
        overflow: "hidden" }}>
        <PlusIcon />
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: theme.colors.text,
          letterSpacing: "-0.01em" }}>Follow for more</span>
        {rippleOn && (
          <div style={{ position: "absolute", left: BTN_W - 140, top: BTN_H / 2 - 20, width: 40, height: 40,
            marginLeft: -20, marginTop: -20, borderRadius: "50%", background: "rgba(255,255,255,0.65)",
            transform: `scale(${1 + rp * 9})`, opacity: (1 - rp) * 0.8 }} />
        )}
      </div>
      {frame >= CTA_FRAME + 6 && (
        <div style={{ position: "absolute", left: BTN_W - 140 + curX - 20, top: curY, opacity: (1 - curOut) * Math.min(1, cur * 2),
          transform: `scale(${1 - 0.12 * press}) translateY(${(1 - curOut) * 0 + curOut * 30}px)` }}>
          <Cursor />
        </div>
      )}
    </div>
  );
};

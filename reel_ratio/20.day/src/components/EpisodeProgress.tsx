import React from "react";
import { useFrame } from "../anim";
import { theme } from "../theme";
import { ease } from "../anim";
import { EPISODE } from "../episode/day20";

type Props = { start: number; dur?: number; width?: number };

/** Animated 190 → 200 / 300 progress bar with percentage (66.67%). */
export const EpisodeProgress: React.FC<Props> = ({ start, dur = 40, width = 880 }) => {
  const f = useFrame();
  const p = ease(f, start, start + dur, theme.ease.out);
  const value = EPISODE.previous + (EPISODE.current - EPISODE.previous) * p;
  const pct = (value / EPISODE.total) * 100;
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 88, color: theme.colors.dark, letterSpacing: -2, lineHeight: 1 }}>
          {Math.round(value)}
          <span style={{ fontSize: 52, color: theme.colors.muted, fontWeight: 500 }}> / {EPISODE.total}</span>
        </div>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 44, color: theme.colors.primary }}>{pct.toFixed(2)}%</div>
      </div>
      <div style={{ height: 30, borderRadius: 15, background: theme.colors.soft, border: `2px solid ${theme.colors.border}`, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 15, background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.dark})` }} />
      </div>
    </div>
  );
};

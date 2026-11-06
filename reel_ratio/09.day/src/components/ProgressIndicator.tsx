import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useSpringIn } from "../animations/presets";
import { script } from "../utils/timeline";

/** 10 pips for today's sentences + "81 / 300" counter. `current` = sentence number. */
export const ProgressIndicator: React.FC<{ current: number; delay?: number }> = ({ current, delay = 6 }) => {
  const { firstSentence, totalSentences } = script.episode;
  const c = theme.colors;
  const p = useSpringIn(delay, "smooth");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: Math.min(1, p),
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const n = firstSentence + i;
          const done = n < current;
          const now = n === current;
          return (
            <div
              key={n}
              style={{
                width: now ? 64 : 34,
                height: 14,
                borderRadius: 7,
                background: done || now ? c.primary : c.primaryMid,
                opacity: done ? 0.55 : 1,
              }}
            />
          );
        })}
      </div>
      <div style={{ fontFamily: theme.fonts.latin, fontWeight: 600, fontSize: 30, color: c.textDim, letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums" }}>
        <span style={{ color: c.text }}>{current}</span> / {totalSentences} sentences
      </div>
    </div>
  );
};

/** 30 day-segments (10 sentences each). `days` may be fractional while animating. */
export const SeriesProgressBar: React.FC<{ days: number; width?: number }> = ({ days, width = 936 }) => {
  const c = theme.colors;
  const gap = 8;
  const seg = (width - gap * 29) / 30;
  return (
    <div style={{ display: "flex", gap, width }}>
      {Array.from({ length: 30 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, days - i));
        return (
          <div key={i} style={{ width: seg, height: 40, borderRadius: 10, background: c.primaryMid, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: i === 8 ? c.accent : c.primary }} />
          </div>
        );
      })}
    </div>
  );
};

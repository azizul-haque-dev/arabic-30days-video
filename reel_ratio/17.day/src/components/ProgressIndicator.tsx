import React from "react";
import { ease, sec } from "../lib/anim";
import { theme } from "../theme";

/**
 * "160 / 300" counter + progress bar.
 * The bar animates from `fromPercent` to `toPercent`; the part gained today is drawn in accent.
 */
export const ProgressIndicator: React.FC<{
  idPrefix: string;
  frame: number;
  fps: number;
  startFrame: number;
  durationSec: number;
  fromCount: number;
  toCount: number;
  total: number;
  width: number;
  /** show the part of the bar that was already complete before today in a muted tint */
  baseCount?: number;
}> = ({ idPrefix, frame, fps, startFrame, durationSec, fromCount, toCount, total, width, baseCount }) => {
  const t = ease(frame, [startFrame, startFrame + sec(durationSec, fps)], [0, 1], theme.easings.inOut);
  const count = Math.round(fromCount + (toCount - fromCount) * t);
  const pct = ((fromCount + (toCount - fromCount) * t) / total) * 100;
  const finalPct = +((toCount / total) * 100).toFixed(2);
  const basePct = baseCount !== undefined ? (baseCount / total) * 100 : null;
  const showPct = (Math.round(pct * 100) / 100).toFixed(2);
  const barH = 40;
  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <div
        data-lbox={`${idPrefix}-count`}
        data-lkind="text"
        style={{ fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 200, lineHeight: "220px", height: 220, color: theme.colors.text, letterSpacing: -4, whiteSpace: "nowrap" }}
      >
        <span style={{ color: theme.colors.primary }}>{count}</span>
        <span style={{ color: theme.colors.textSecondary, fontSize: 120 }}>/{total}</span>
      </div>
      <div
        data-lbox={`${idPrefix}-bar`}
        data-lkind="chrome"
        style={{ width, height: barH, borderRadius: barH / 2, background: theme.colors.white, border: `3px solid ${theme.colors.primarySoft}`, boxSizing: "border-box", overflow: "hidden", position: "relative" }}
      >
        {basePct !== null ? (
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(pct, basePct)}%`, background: theme.colors.primary }} />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: basePct !== null ? `${basePct}%` : 0,
            top: 0,
            bottom: 0,
            width: basePct !== null ? `${Math.max(0, pct - basePct)}%` : `${pct}%`,
            background: basePct !== null ? theme.colors.accent : theme.colors.primary,
          }}
        />
      </div>
      <div
        data-lbox={`${idPrefix}-pct`}
        data-lkind="text"
        style={{ fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 64, lineHeight: "76px", height: 76, color: theme.colors.primaryDeep, whiteSpace: "nowrap" }}
      >
        {showPct}%
        <span style={{ fontFamily: theme.fonts.bengali, fontWeight: 600, fontSize: 40, color: theme.colors.textSecondary }}> সম্পন্ন</span>
      </div>
      <span data-final-pct={finalPct} style={{ display: "none" }} />
    </div>
  );
};

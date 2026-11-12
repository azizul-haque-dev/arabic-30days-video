import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, fonts, radius, shadow, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import { fitText } from "../lib/fit";

/** Clean section title card with measured, balanced wrapping. */
export const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 4, springs.smooth);
  const fit = React.useMemo(
    () =>
      fitText({
        text: title,
        fontFamily: fonts.bengali,
        fontWeight: 700,
        maxWidth: L.contentWidth - 96,
        maxFont: 72,
        minFont: 48,
        singleLineMinFont: 66,
        maxLines: 2,
        lineHeight: 1.3,
      }),
    [title],
  );
  return (
    <div
      style={{
        position: "absolute",
        left: L.side,
        top: 1030,
        width: L.contentWidth,
        height: 380,
        boxSizing: "border-box",
        padding: "0 48px",
        borderRadius: radius.card,
        background: colors.white,
        border: `2px solid ${colors.border}`,
        boxShadow: shadow.card,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
      }}
    >
      <div style={{ width: 96, height: 10, borderRadius: 5, background: colors.amber }} />
      {fit.lines.map((l, i) => (
        <div
          key={i}
          style={{ fontFamily: fonts.bengali, fontWeight: 700, fontSize: fit.fontSize, lineHeight: `${fit.lineHeightPx}px`, color: colors.dark, whiteSpace: "nowrap", textAlign: "center" }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

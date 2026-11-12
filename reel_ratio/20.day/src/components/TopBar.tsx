import React from "react";
import { theme } from "../theme";
import { EPISODE } from "../episode/day20";
import { useEnter } from "../anim";

/** Persistent brand bar (sits above the safe area, never overlaps content). */
export const TopBar: React.FC = () => {
  const e = useEnter(0, { y: -30, from: 0.96 });
  return (
    <div
      style={{
        position: "absolute",
        left: theme.safe.side,
        right: theme.safe.side,
        top: theme.layout.brandBarY,
        height: 84,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: e.opacity,
        transform: e.transform,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.dark})`,
            boxShadow: theme.shadow.soft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.colors.white,
            fontFamily: theme.fonts.ar,
            fontWeight: 700,
            fontSize: 40,
            lineHeight: 1,
            paddingBottom: 6,
          }}
        >
          ع
        </div>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 36, color: theme.colors.dark, letterSpacing: -0.5 }}>{EPISODE.brand}</div>
      </div>
      <div
        style={{
          fontFamily: theme.fonts.en,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 2,
          color: theme.colors.dark,
          background: theme.colors.soft,
          border: `2px solid ${theme.colors.primary}`,
          borderRadius: 999,
          padding: "10px 26px",
        }}
      >
        DAY {EPISODE.day}
      </div>
    </div>
  );
};

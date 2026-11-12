import React from "react";
import { theme } from "../theme";

export const Chip: React.FC<{
  label: string; size?: number; bg?: string; color?: string; style?: React.CSSProperties; bn?: boolean;
}> = ({ label, size = 34, bg = theme.colors.primary, color = theme.colors.white, style, bn }) => (
  <div
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap",
      height: Math.round(size * 1.75), padding: `0 ${Math.round(size * 0.7)}px`, borderRadius: 999,
      background: bg, color, fontFamily: bn ? theme.fonts.bn : theme.fonts.en, fontWeight: 600, fontSize: size,
      lineHeight: 1, ...style,
    }}
  >
    {label}
  </div>
);

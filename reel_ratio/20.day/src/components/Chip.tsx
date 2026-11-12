import React from "react";
import { theme } from "../theme";
import { useEnter } from "../anim";

type Props = { text: string; start: number; tone?: "green" | "amber" | "dark"; width?: number; icon?: React.ReactNode; font?: "en" | "bn" };

/** Rounded status chip (used for milestone stats and CTAs). */
export const Chip: React.FC<Props> = ({ text, start, tone = "green", width = 880, icon, font = "en" }) => {
  const e = useEnter(start, { y: 36, from: 0.9, config: theme.spring.pop });
  const palette = {
    green: { bg: theme.colors.soft, fg: theme.colors.dark, bd: theme.colors.primary },
    amber: { bg: theme.colors.amberSoft, fg: "#92400E", bd: theme.colors.amber },
    dark: { bg: theme.colors.dark, fg: theme.colors.white, bd: theme.colors.dark },
  }[tone];
  return (
    <div
      style={{
        width,
        height: 84,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: palette.bg,
        color: palette.fg,
        border: `3px solid ${palette.bd}`,
        borderRadius: 999,
        fontFamily: font === "en" ? theme.fonts.en : theme.fonts.bn,
        fontWeight: 700,
        fontSize: font === "en" ? 38 : 40,
        letterSpacing: font === "en" ? 2 : 0,
        opacity: e.opacity,
        transform: e.transform,
        boxShadow: theme.shadow.soft,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {text}
    </div>
  );
};

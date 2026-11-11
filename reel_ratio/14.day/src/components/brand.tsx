import React from "react";
import { theme } from "../config/theme";
import { TextBox } from "./layout";

const c = theme.colors;

/** Brand mark: green tile + navigation arrow. Pure SVG, no text. */
export const BrandMark: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <rect width="100" height="100" rx="26" fill={c.green} />
    <rect x="6" y="6" width="88" height="88" rx="21" fill="none" stroke={c.white} strokeWidth="3" opacity="0.35" />
    <path d="M28 70 V46 Q28 34 40 34 H62" fill="none" stroke={c.white} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 18 L80 34 L58 50 Z" fill={c.amber} />
  </svg>
);

/** Small logo (mark + wordmark) as one measured box. */
export const Logo: React.FC<{ id?: string }> = ({ id = "logo" }) => (
  <TextBox
    id={id}
    kind="logo"
    style={{ display: "flex", alignItems: "center", gap: 16, height: 72, whiteSpace: "nowrap" }}
  >
    <BrandMark size={56} />
    <span style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 40, color: c.text, letterSpacing: -0.5, lineHeight: 1 }}>
      Arabic Master
    </span>
  </TextBox>
);

export const Chip: React.FC<{ id: string; children: React.ReactNode; tone?: "green" | "amber" | "white"; size?: number }> = ({
  id, children, tone = "green", size = 40,
}) => {
  const bg = tone === "green" ? c.green : tone === "amber" ? c.amber : c.white;
  const fg = tone === "white" ? c.text : c.white;
  return (
    <TextBox
      id={id}
      style={{
        display: "inline-block",
        background: bg,
        color: fg,
        borderRadius: 999,
        padding: "12px 34px",
        fontFamily: theme.fonts.en,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        boxShadow: tone === "white" ? `inset 0 0 0 3px ${c.greenSoft}` : "none",
      }}
    >
      {children}
    </TextBox>
  );
};

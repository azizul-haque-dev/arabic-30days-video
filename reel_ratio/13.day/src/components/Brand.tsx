import React from "react";
import { Rect } from "../config/layout";
import { theme, FONT_WEIGHTS } from "../config/theme";
import { useReveal } from "../animation/motion";
import { Lv, Slot } from "./layoutPrimitives";

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Rounded-square monogram logo. */
export const LogoMark: React.FC<{ name: string; size: number }> = ({ name, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(145deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
      boxShadow: `0 ${size * 0.08}px ${size * 0.2}px ${theme.colors.shadow}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.colors.white,
      fontFamily: theme.fonts.en,
      fontWeight: FONT_WEIGHTS.en,
      fontSize: size * 0.42,
      letterSpacing: "-0.03em",
      flexShrink: 0,
    }}
  >
    {initials(name)}
  </div>
);

/** Small header brand lock-up (logo + wordmark). */
export const BrandHeader: React.FC<{ rect: Rect; name: string; delay?: number; instant?: boolean }> = ({
  rect,
  name,
  delay = 0,
  instant,
}) => {
  const style = useReveal(delay, { instant, y: 12 });
  return (
    <Slot id="brand" rect={rect} justify="flex-start">
      <Lv id="brand" kind="badge" slotId="brand" style={style}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, paddingLeft: 4 }}>
          <LogoMark name={name} size={84} />
          <span
            style={{
              fontFamily: theme.fonts.en,
              fontWeight: FONT_WEIGHTS.en,
              fontSize: 48,
              color: theme.colors.text,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
        </div>
      </Lv>
    </Slot>
  );
};

/** Pill with a single line of short text (episode badge, sentence number, ...). */
export const Pill: React.FC<{
  id: string;
  slotId: string;
  rect: Rect;
  text: string;
  fontSize: number;
  background: string;
  color: string;
  delay?: number;
  instant?: boolean;
  justify?: "center" | "flex-end" | "flex-start";
  paddingX?: number;
}> = ({ id, slotId, rect, text, fontSize, background, color, delay = 0, instant, justify = "center", paddingX = 40 }) => {
  const style = useReveal(delay, { instant, y: 12 });
  return (
    <Slot id={slotId} rect={rect} justify={justify}>
      <Lv id={id} kind="badge" slotId={slotId} style={style}>
        <div
          style={{
            background,
            color,
            fontFamily: theme.fonts.en,
            fontWeight: FONT_WEIGHTS.en,
            fontSize,
            lineHeight: 1.2,
            padding: `14px ${paddingX}px`,
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: `0 10px 24px ${theme.colors.shadow}`,
          }}
        >
          {text}
        </div>
      </Lv>
    </Slot>
  );
};

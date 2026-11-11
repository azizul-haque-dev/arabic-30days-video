import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";
import { Art, fitFont, TextBox, Zone } from "./layout";
import { enter, enterStyle, eased, exitProgress } from "../utils/motion";

const c = theme.colors;
const INNER = 940 - 2 * 44 - 64; // text width budget: card padding + room for the repeat pulse

/** Pronunciation card. Appears at the first narrated occurrence and reacts at the repeat. */
export const PronPanel: React.FC<{ variants: [string, string]; p1: number; p2: number; dur: number }> = ({ variants, p1, p2, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const differ = variants[0] !== variants[1];
  const swapped = frame >= p2;
  const text = differ && swapped ? variants[1] : variants[0];
  const start = differ && swapped ? p2 : p1;
  const lastVariantDur = differ && !swapped ? p2 - 6 : dur;
  const p = enter(frame, fps, start, differ && swapped ? "enter" : "pop");
  const showRepeat = frame >= p2;
  const pulse = showRepeat ? enter(frame, fps, p2, "pop") : 0;
  const bump = showRepeat ? 1 + 0.025 * Math.sin(Math.min(1, (frame - p2) / 14) * Math.PI) : 1;
  const out = differ && !swapped ? exitProgress(frame, p2, 6) : 0;
  const size = fitFont(text, INNER, 88, 50);
  if (frame < p1) return <Zone zone="pron" />;
  const es = enterStyle(p, 20, 0.94);
  return (
    <Zone zone="pron" gap={14}>
      <svg width={120} height={30} viewBox="0 0 120 30" style={{ opacity: es.opacity }}>
        <Art id="repeat-dots">
          <circle cx={30} cy={15} r={11} fill={c.green} />
          <circle cx={90} cy={15} r={11} fill={showRepeat ? c.green : c.greenSoft} transform={showRepeat ? `scale(${1 + 0.35 * (1 - Math.min(pulse, 1))})` : undefined} style={{ transformOrigin: "90px 15px" }} />
        </Art>
      </svg>
      <TextBox
        key={start}
        id={`pron-${differ && swapped ? 2 : 1}`}
        style={{
          background: c.white,
          borderRadius: 44,
          padding: "20px 44px",
          fontFamily: theme.fonts.bn,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.3,
          color: c.text,
          whiteSpace: "nowrap",
          boxShadow: `0 22px 44px -24px rgba(16,35,29,0.45), inset 0 0 0 4px ${showRepeat ? c.green : c.greenSoft}`,
          opacity: es.opacity * (1 - out),
          transform: `${es.transform} scale(${bump}) translateY(${out * -10}px)`,
        }}
      >
        {text}
      </TextBox>
    </Zone>
  );
};

/** Bengali meaning card. */
export const MeaningPanel: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return <Zone zone="meaning" />;
  const p = enter(frame, fps, at, "pop");
  const es = enterStyle(p, 26, 0.94);
  const size = fitFont(text, INNER, 84, 54);
  const glow = eased(frame, at, at + 24, 0, 1, theme.easings.out);
  return (
    <Zone zone="meaning">
      <TextBox
        id="meaning"
        style={{
          background: c.green,
          borderRadius: 44,
          padding: "20px 44px",
          fontFamily: theme.fonts.bn,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.3,
          color: c.white,
          whiteSpace: "nowrap",
          boxShadow: `0 24px 48px -22px rgba(14,159,110,${0.35 + 0.25 * glow}), inset 0 0 0 4px ${c.greenDark}`,
          ...es,
        }}
      >
        {text}
      </TextBox>
    </Zone>
  );
};

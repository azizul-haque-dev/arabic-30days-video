import React, { useMemo } from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { Rect, SLOT_PAD_X, TEXT_PAD_Y } from "../config/layout";
import { theme } from "../config/theme";
import { SpringName, useExitProgress, useSpringProgress } from "../animation/motion";
import { fitWords } from "./fitWords";
import { Slot } from "./layoutPrimitives";

export type FontKey = "bn" | "ar" | "en";

export type WordRowProps = {
  id: string;
  slotId: string;
  rect: Rect;
  text: string;
  font: FontKey;
  weight: number;
  color: string;
  maxFont: number;
  minFont: number;
  lineHeight?: number;
  /** local frame at which the first word starts to enter */
  delay?: number;
  stagger?: number;
  rtl?: boolean;
  preset?: SpringName;
  /** visible from frame 0 with no entrance (thumbnail) */
  instant?: boolean;
  /** local frames at which a highlight pulse (colour + 2% scale) starts */
  pulses?: number[];
  pulseColor?: string;
  letterSpacing?: string;
  /** vertical padding kept inside the slot (default TEXT_PAD_Y) */
  padY?: number;
  /** word travel in px (must be <= padY) */
  travel?: number;
  /** local frame at which this block starts fading out (before the scene ends) */
  exitAt?: number;
};

const GAP_EM = 0.26;

const Word: React.FC<{
  word: string;
  index: number;
  delay: number;
  stagger: number;
  preset: SpringName;
  instant: boolean;
  fontSize: number;
  lineHeight: number;
  family: string;
  weight: number;
  color: string;
  letterSpacing?: string;
  travel: number;
}> = ({ word, index, delay, stagger, preset, instant, fontSize, lineHeight, family, weight, color, letterSpacing, travel }) => {
  const p = useSpringProgress(delay + index * stagger, preset);
  const enter = instant ? 1 : p;
  return (
    <span
      data-lv-part="1"
      style={{
        display: "inline-block",
        fontFamily: family,
        fontWeight: weight,
        fontSize,
        lineHeight,
        color,
        letterSpacing,
        whiteSpace: "nowrap",
        opacity: enter,
        transform: `translateY(${((1 - enter) * travel).toFixed(2)}px) scale(${(0.92 + 0.08 * enter).toFixed(4)})`,
      }}
    >
      {word}
    </span>
  );
};

/**
 * One text block in one slot. The font size is MEASURED so the block always
 * fits inside (slot - padding). Words animate with a stagger; Arabic uses
 * rtl so the first word enters from the right.
 */
export const WordRow: React.FC<WordRowProps> = ({
  id,
  slotId,
  rect,
  text,
  font,
  weight,
  color,
  maxFont,
  minFont,
  lineHeight = 1.4,
  delay = 0,
  stagger = theme.motion.stagger,
  rtl = false,
  preset = "snappy",
  instant = false,
  pulses = [],
  pulseColor = theme.colors.accent,
  letterSpacing,
  padY = TEXT_PAD_Y,
  travel = 14,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const exit = useExitProgress();
  const family = theme.fonts[font];
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const fit = useMemo(
    () =>
      fitWords({
        words,
        fontFamily: family.split(",")[0].replace(/"/g, "").trim(),
        fontWeight: weight,
        maxWidth: rect.w - 2 * SLOT_PAD_X,
        maxHeight: rect.h - 2 * padY,
        maxFont,
        minFont,
        lineHeight,
        gapEm: GAP_EM,
      }),
    [words, family, weight, rect.w, rect.h, maxFont, minFont, lineHeight, padY],
  );

  const pulse = pulses.reduce((acc, start) => {
    const v = interpolate(frame - start, [0, 6, 20], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: theme.ease.out,
    });
    return Math.max(acc, v);
  }, 0);
  const tint = interpolateColors(pulse, [0, 1], [color, pulseColor]);
  const blockExit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + theme.motion.exitFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.in,
        });
  const out = Math.max(exit, blockExit);

  // Nothing is mounted before its entrance or after its own exit (no ghost boxes).
  if (!instant && frame < delay) return null;
  if (exitAt !== undefined && frame >= exitAt + theme.motion.exitFrames) return null;

  return (
    <Slot id={slotId} rect={rect}>
      <div
        data-lv={id}
        data-lv-kind="text"
        data-lv-slot={slotId}
        dir={rtl ? "rtl" : "ltr"}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: fit.fontSize * GAP_EM,
          rowGap: 0,
          maxWidth: rect.w - 2 * SLOT_PAD_X,
          opacity: 1 - out,
          transform: `translateY(${(-out * Math.min(10, padY - 2)).toFixed(2)}px) scale(${(1 + 0.02 * pulse).toFixed(4)})`,
        }}
      >
        {words.map((w, i) => (
          <Word
            key={`${w}-${i}`}
            word={w}
            index={i}
            delay={delay}
            stagger={stagger}
            preset={preset}
            instant={instant}
            fontSize={fit.fontSize}
            lineHeight={lineHeight}
            family={family}
            weight={weight}
            color={tint}
            letterSpacing={letterSpacing}
            travel={travel}
          />
        ))}
      </div>
    </Slot>
  );
};

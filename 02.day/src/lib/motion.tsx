import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, MOTION, SPRING } from "../theme";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

export const useSp = (delay = 0, config: (typeof SPRING)[keyof typeof SPRING] = SPRING.pop) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

export const tween = (
  frame: number, a: number, b: number, from: number, to: number,
  easing: (t: number) => number = EASE.out,
) => interpolate(frame, [a, Math.max(a + 1, b)], [from, to], { easing, ...CL });

export const useBreath = (amp = 6, period = 2.4, phase = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.sin((f / fps / period) * Math.PI * 2 + phase) * amp;
};

type EnterProps = {
  delay?: number; from?: "up" | "down" | "left" | "right" | "scale"; dist?: number;
  scaleFrom?: number; sp?: keyof typeof SPRING; rotate?: number;
  style?: React.CSSProperties; children?: React.ReactNode;
};
// ঢোকা = opacity + translate + scale একসাথে
export const Enter: React.FC<EnterProps> = ({
  delay = 0, from = "up", dist = 44, scaleFrom = 0.9, sp = "pop", rotate = 0, style, children,
}) => {
  const s = useSp(delay, SPRING[sp]);
  const f = useCurrentFrame();
  const o = tween(f, delay, delay + MOTION.enter * 0.6, 0, 1);
  const tx = from === "left" ? -dist : from === "right" ? dist : 0;
  const ty = from === "up" ? dist : from === "down" ? -dist : 0;
  return (
    <div style={{
      opacity: o,
      transform: `translate(${(1 - s) * tx}px, ${(1 - s) * ty}px) scale(${scaleFrom + (1 - scaleFrom) * s}) rotate(${(1 - s) * rotate}deg)`,
      ...style,
    }}>{children}</div>
  );
};

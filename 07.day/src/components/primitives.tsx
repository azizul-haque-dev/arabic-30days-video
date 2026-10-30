import React from "react";
import { Audio, Sequence, cancelRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { SfxName, alpha, theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useP = (delay = 0, cfg: Record<string, number> = theme.spring.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: cfg });
};

export const Enter: React.FC<{
  delay?: number; y?: number; x?: number; s?: number; rot?: number;
  cfg?: Record<string, number>; style?: React.CSSProperties; children: React.ReactNode;
}> = ({ delay = 0, y = 40, x = 0, s = 0.94, rot = 0, cfg = theme.spring.smooth, style, children }) => {
  const p = useP(delay, cfg);
  return (
    <div style={{ opacity: Math.min(1, p * 1.4), transform: `translate(${x * (1 - p)}px, ${y * (1 - p)}px) scale(${s + (1 - s) * p}) rotate(${rot * (1 - p)}deg)`, ...style }}>
      {children}
    </div>
  );
};

/** Word-by-word stagger. Splits ONLY on spaces — never inside a Bengali word. */
export const Words: React.FC<{
  text: string; delay?: number; per?: number; size: number; weight?: number; color?: string;
  align?: "left" | "center" | "right"; lh?: number; hot?: (w: string, i: number) => React.CSSProperties | undefined;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 4, size, weight = theme.font.heavy, color = theme.colors.text, align = "center", lh = 1.32, hot, style }) => {
  const words = text.split(" ");
  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: justify, columnGap: size * 0.26, rowGap: size * 0.02, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: 0, ...style }}>
      {words.map((w, i) => <Word key={i} w={w} d={delay + i * per} extra={hot?.(w, i)} />)}
    </div>
  );
};
const Word: React.FC<{ w: string; d: number; extra?: React.CSSProperties }> = ({ w, d, extra }) => {
  const p = useP(d, theme.spring.snappy);
  return <span style={{ display: "inline-block", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 34}px) scale(${0.9 + 0.1 * p})`, ...extra }}>{w}</span>;
};

/** Left→right mask sweep (safe for Bengali shaping). */
export const Sweep: React.FC<{ delay?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ delay = 0, dur = 16, style, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ clipPath: `inset(-24px ${(1 - p) * 100}% -24px -24px)`, opacity: p > 0 ? 1 : 0, transform: `translateX(${(1 - p) * -16}px)`, ...style }}>{children}</div>
  );
};

/** Meaning text with the key phrase highlighted by an amber marker sweep. */
export const Highlighted: React.FC<{ text: string; keyText: string; hlDelay: number; color?: string }> = ({ text, keyText, hlDelay, color = theme.colors.text }) => {
  const frame = useCurrentFrame();
  const i = text.indexOf(keyText);
  const p = interpolate(frame, [hlDelay, hlDelay + 14], [0, 1], { ...clamp, easing: theme.ease.out });
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ backgroundImage: `linear-gradient(${theme.colors.accent}, ${theme.colors.accent})`, backgroundRepeat: "no-repeat", backgroundSize: `${p * 100}% 100%`, backgroundPosition: "0 50%", color: p > 0.5 ? theme.colors.text : color, padding: "2px 14px", margin: "0 -6px", borderRadius: 16, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>{keyText}</span>
      {text.slice(i + keyText.length)}
    </>
  );
};

export const Sfx: React.FC<{ name: SfxName; at: number; vol?: number; rate?: number }> = ({ name, at, vol = 1, rate = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={36} layout="none">
    <Audio
      src={staticFile(`sfx/${name}.wav`)}
      volume={Math.min(0.35, theme.sfx[name] * vol)}
      playbackRate={rate}
      onError={(err) => {
        const error =
          err instanceof Error
            ? err
            : new Error(`Failed to load mandatory SFX "public/sfx/${name}.wav": ${String(err)}`);
        cancelRender(error);
      }}
    />
  </Sequence>
);

export const Card: React.FC<{ style?: React.CSSProperties; dark?: boolean; children?: React.ReactNode }> = ({ style, dark, children }) => (
  <div style={{
    position: "relative", borderRadius: theme.radius.card, overflow: "hidden",
    background: dark ? theme.colors.text : theme.colors.surface,
    border: `1px solid ${dark ? alpha("#FFFFFF", 0.08) : theme.colors.line}`,
    boxShadow: theme.shadow.card, ...style,
  }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${alpha("#FFFFFF", dark ? 0.1 : 0.7)} 0%, transparent 38%)`, pointerEvents: "none" }} />
    <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode; fill?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, fill = theme.colors.text, color = "#FFFFFF", size = 34, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", padding: `${size * 0.18}px ${size * 0.6}px`, borderRadius: 999, background: fill, color, fontSize: size, fontWeight: theme.font.mid, lineHeight: 1.35, letterSpacing: 0, ...style }}>{children}</div>
);

export const SceneShell: React.FC<{ dur: number; last?: boolean; children: React.ReactNode }> = ({ dur, last, children }) => {
  const frame = useCurrentFrame();
  const t = last ? 0 : interpolate(frame, [dur - 10, dur - 2], [0, 1], { ...clamp, easing: theme.ease.in });
  return <AbsoluteFill style={{ opacity: 1 - t, transform: `translateY(${-30 * t}px) scale(${1 - 0.03 * t})` }}>{children}</AbsoluteFill>;
};

export const Fill: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <AbsoluteFill style={{ padding: 72, ...style }}>{children}</AbsoluteFill>
);

export { clamp };

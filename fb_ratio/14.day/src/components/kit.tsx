import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  preset?: "smooth" | "snappy" | "bouncy";
  config?: { damping: number; stiffness: number; mass: number };
  fromY?: number;
  from?: number;
  scaleFrom?: number;
  x?: number;
  instantAtZero?: boolean;
}> = ({
  delay = 0,
  children,
  style,
  preset = "smooth",
  config,
  fromY,
  from,
  scaleFrom = 0.94,
  x = 0,
  instantAtZero = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If this component should be visible immediately on frame 0 (e.g. for thumbnails/covers)
  if (instantAtZero && frame === 0) {
    return <div style={{ opacity: 1, transform: "none", ...style }}>{children}</div>;
  }

  const p = spring({
    frame: frame - delay,
    fps,
    config: config ?? theme.spring[preset],
  });

  const startY = from ?? fromY ?? 32;

  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.7], [0, 1], clamp),
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(
          p,
          [0, 1],
          [startY, 0]
        )}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number, w: string) => React.CSSProperties;
  justify?: React.CSSProperties["justifyContent"];
  gap?: number | string;
  instantAtZero?: boolean;
}> = ({
  text,
  delay = 0,
  per = 3,
  style,
  wordStyle,
  justify = "center",
  gap = "0.28em",
  instantAtZero = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Preserving critical Bengali rule: text.split(" ") only, never by character!
  const words = text.split(" ");

  if (instantAtZero && frame === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: justify,
          gap,
          fontFamily: theme.fonts.display,
          ...style,
        }}
      >
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline-block", opacity: 1, ...(wordStyle ? wordStyle(i, word) : {}) }}>
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: justify,
        gap,
        fontFamily: theme.fonts.display,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 0.7], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(
                p,
                [0, 1],
                [0.94, 1]
              )})`,
              ...(wordStyle ? wordStyle(i, word) : {}),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const SceneExit: React.FC<{ children: React.ReactNode; dur?: number }> = ({ children, dur }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const total = dur ?? durationInFrames;
  const exitProgress = interpolate(
    frame,
    [total - 11, total - 2],
    [0, 1],
    clamp
  );
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: 1 - exitProgress,
        transform: `translateY(${exitProgress * -32}px) scale(${1 - exitProgress * 0.03})`,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{
  text?: string;
  children?: React.ReactNode;
  tone?: "hero" | "accent" | "soft" | "white" | "dark" | "glass";
  icon?: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, children, tone = "soft", icon, size, style }) => {
  let bg: string = theme.colors.primarySoft;
  let color: string = theme.colors.primaryDeep;
  let border: string = `1px solid ${theme.colors.line}`;
  let shadow: string = "0 4px 12px rgba(16, 35, 29, 0.05)";

  if (tone === "hero") {
    bg = theme.gradients.primary;
    color = "#FFFFFF";
    border = "1px solid rgba(255, 255, 255, 0.25)";
    shadow = theme.shadows.glow;
  } else if (tone === "accent") {
    bg = size ? theme.colors.accentSoft : theme.gradients.accent;
    color = size ? theme.colors.text : "#FFFFFF";
    border = size ? `1px solid ${theme.colors.line}` : "1px solid rgba(255, 255, 255, 0.3)";
    shadow = theme.shadows.accentGlow;
  } else if (tone === "white") {
    bg = "#FFFFFF";
    color = theme.colors.text;
    border = `1.5px solid ${theme.colors.line}`;
    shadow = "0 6px 18px rgba(16, 35, 29, 0.06)";
  } else if (tone === "glass") {
    bg = "rgba(255, 255, 255, 0.85)";
    color = theme.colors.primaryDeep;
    border = "1.5px solid rgba(255, 255, 255, 0.9)";
    shadow = "0 8px 24px rgba(16, 35, 29, 0.06)";
  } else if (tone === "dark") {
    bg = theme.colors.text;
    color = "#FFFFFF";
    border = "1px solid rgba(255, 255, 255, 0.15)";
    shadow = "0 8px 20px rgba(16, 35, 29, 0.15)";
  }

  const s = size ?? 26;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: size ? `${s * 0.28}px ${s * 0.7}px` : "10px 24px",
        borderRadius: theme.radius.pill,
        background: bg,
        color,
        fontFamily: theme.fonts.display,
        fontWeight: theme.weights.strong,
        fontSize: s,
        border,
        boxShadow: shadow,
        backdropFilter: tone === "glass" ? "blur(12px)" : undefined,
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {icon}
      <span>{children ?? text}</span>
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: boolean;
}> = ({ children, style, glow = false }) => {
  return (
    <div
      style={{
        background: theme.gradients.surface,
        borderRadius: 36,
        border: "1.5px solid rgba(255, 255, 255, 0.9)",
        boxShadow: glow
          ? `${theme.shadows.card}, 0 0 40px rgba(14, 159, 110, 0.15)`
          : theme.shadows.card,
        padding: "36px 44px",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle top inner light reflection */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 50%, transparent)",
        }}
      />
      {children}
    </div>
  );
};

export const Counter: React.FC<{ current: number; total?: number }> = ({
  current,
  total = 10,
}) => {
  const toBn = (n: number) => n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        padding: "9px 22px",
        borderRadius: theme.radius.pill,
        border: "1.5px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 6px 18px rgba(16, 35, 29, 0.05)",
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: theme.weights.hero,
          color: theme.colors.primaryDeep,
          fontSize: 25,
          letterSpacing: "-0.01em",
        }}
      >
        বাক্য {toBn(current)} / {toBn(total)}
      </span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < current;
          const isCurrent = i === current - 1;
          return (
            <div
              key={i}
              style={{
                width: isCurrent ? 18 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isDone ? theme.colors.primary : "rgba(14, 159, 110, 0.22)",
                boxShadow: isCurrent ? "0 0 8px rgba(14, 159, 110, 0.5)" : "none",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const PulseRings: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = theme.colors.primary,
}) => {
  const frame = useCurrentFrame();
  const ring1 = (frame * 1.5) % 60;
  const ring2 = ((frame * 1.5) + 30) % 60;

  const scale1 = interpolate(ring1, [0, 60], [1, 1.45]);
  const opacity1 = interpolate(ring1, [0, 45, 60], [0.35, 0.1, 0]);

  const scale2 = interpolate(ring2, [0, 60], [1, 1.45]);
  const opacity2 = interpolate(ring2, [0, 45, 60], [0.35, 0.1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          transform: `scale(${scale1})`,
          opacity: opacity1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          transform: `scale(${scale2})`,
          opacity: opacity2,
        }}
      />
    </div>
  );
};

export const ShimmerSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame % 90, [0, 45], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 140,
        transform: `translateX(${x}%) skewX(-20deg)`,
        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45) 50%, transparent)",
        pointerEvents: "none",
      }}
    />
  );
};

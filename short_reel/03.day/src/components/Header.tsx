import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { PAGE_NAME, TAGLINE } from "../data";

const LOGO_SIZE = 88;

const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: theme.spring.bouncy });
  const float = Math.sin(frame / 30) * 2;
  return (
    <div style={{ width: LOGO_SIZE, height: LOGO_SIZE, transform: `scale(${scale}) translateY(${float}px)`,
      filter: `drop-shadow(0 4px 12px rgba(16,35,29,0.18))` }}>
      <Img src={staticFile("logo.svg")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

const Word: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
  return (
    <span style={{ display: "inline-block", opacity: p,
      transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>
      {text}
    </span>
  );
};

export const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = PAGE_NAME.split(" ");
  const tag = spring({ frame: frame - 14, fps, config: theme.spring.smooth });
  const float = Math.sin(frame / 30) * 2;
  return (
    <div style={{ position: "absolute", top: 124, left: 0, width: "100%", display: "flex", justifyContent: "center",
      alignItems: "center", gap: 26, transform: `translateY(${float}px)` }}>
      <Logo />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80,
          lineHeight: 1.02, letterSpacing: "-0.03em", color: theme.colors.text }}>
          {words.map((w, i) => <Word key={i} text={w} delay={4 + i * 4} />)}
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 28, letterSpacing: "0.22em",
          color: theme.colors.textDim, opacity: tag, marginTop: 6,
          transform: `translateY(${interpolate(tag, [0, 1], [16, 0])}px)` }}>
          {TAGLINE}
        </div>
      </div>
    </div>
  );
};

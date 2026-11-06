import React from "react";
import { AbsoluteFill } from "remotion";
import { useBreathe, useSeconds } from "../lib/anim";
import { toBn } from "../lib/bn";
import { BrandHeader, font } from "../components/Brand";
import { TalkStuck } from "../components/Illustrations";
import type { EpisodeConfig } from "../types";
import { theme } from "../theme";
import { SceneShell } from "./SceneShell";

const c = theme.colors;

/** Frame 0 is already the finished thumbnail; motion is continuous micro-motion only. */
export const ThumbnailScene: React.FC<{ ep: EpisodeConfig; exitFrames: number }> = ({ ep, exitFrames }) => {
  const b = useBreathe(7, 3);
  const t = useSeconds();
  const shine = ((t * 0.5) % 2) * 1.6 - 0.3;
  return (
    <SceneShell exitFrames={exitFrames}>
      <BrandHeader brand={ep.brandName} />
      <AbsoluteFill style={{ alignItems: "center", ...font }}>
        <div style={{ position: "absolute", top: 262, fontSize: 56, fontWeight: 700, color: c.primaryDark, textAlign: "center" }}>
          {ep.seriesTitle}
        </div>
        <div
          style={{
            position: "absolute",
            top: 350,
            padding: "6px 70px 14px",
            borderRadius: 64,
            background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
            color: c.white,
            fontSize: 190,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.25,
            boxShadow: theme.shadow.glow,
            overflow: "hidden",
          }}
        >
          DAY {ep.episodeNumber}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine * 100}%`,
              width: "22%",
              background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)",
              transform: "skewX(-18deg)",
            }}
          />
        </div>
        <div style={{ position: "absolute", top: 640, width: 900, height: 480, transform: `translateY(${b}px)` }}>
          <TalkStuck />
        </div>
        <div style={{ position: "absolute", top: 1160, width: 920, display: "flex", justifyContent: "center" }}>
          <HookText hook={ep.hook} highlight={ep.hookHighlight} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 1560,
            display: "flex",
            gap: 20,
            fontSize: 38,
            fontWeight: 600,
            color: c.textDim,
          }}
        >
          <span style={{ background: c.white, padding: "10px 30px", borderRadius: 999, boxShadow: theme.shadow.card }}>
            {toBn(ep.sentences.length)}টি বাক্য · {ep.sentenceStartNumber}–{ep.sentenceEndNumber}
          </span>
          <span style={{ background: c.accentSoft, color: theme.colors.accentDark, padding: "10px 30px", borderRadius: 999 }}>
            {ep.dialectLabel}
          </span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/** Static (frame-0 complete) hook text with the highlighted phrase. */
const HookText: React.FC<{ hook: string; highlight: string }> = ({ hook, highlight }) => {
  const hl = new Set(highlight.split(" "));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 20, rowGap: 0 }}>
      {hook.split(" ").map((w, i) => (
        <span
          key={i}
          style={{
            position: "relative",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.45,
            color: hl.has(w) ? c.primary : c.text,
            ...font,
          }}
        >
          {w}
          {hl.has(w) ? (
            <span style={{ position: "absolute", left: 0, right: 0, bottom: 8, height: 14, borderRadius: 7, background: c.accent, opacity: 0.45, zIndex: -1 }} />
          ) : null}
        </span>
      ))}
    </div>
  );
};


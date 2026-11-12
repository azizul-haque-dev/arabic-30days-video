import React from "react";
import { AbsoluteFill } from "remotion";
import type { EpisodeConfig } from "../episodes/types";
import { idle } from "../lib/anim";
import { theme } from "../theme";
import { FitLine } from "./FitLine";
import { LayoutProbe, SafeRect } from "./LayoutProbe";
import { Logo } from "./Logo";
import { VectorIllustration } from "./VectorIllustration";

export const THUMB_ZONES = {
  x: theme.layout.safeX,
  width: theme.canvas.width - 2 * theme.layout.safeX,
  top: 126,
} as const;

/**
 * Day-17 thumbnail. Fully visible on frame 0 (no entrance animation - only gentle idle motion),
 * so the video never opens on a blank frame. Also rendered as a Still ("<episode>-thumbnail").
 */
export const EpisodeThumbnail: React.FC<{
  config: EpisodeConfig;
  frame: number;
  fps: number;
  opacity?: number;
  safe: SafeRect;
  layoutMode: "throw" | "collect";
  probe?: boolean;
}> = ({ config, frame, fps, opacity = 1, safe, layoutMode, probe = true }) => {
  const Z = THUMB_ZONES;
  const [title1, ...rest] = config.topicEn.split(" & ")[0].split(" ");
  const title2 = rest.join(" ");
  const float = idle(frame, fps, 4) * 3;
  return (
    <AbsoluteFill data-lroot="true" style={{ opacity }}>
      <div style={{ position: "absolute", left: Z.x, top: Z.top, width: Z.width, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Logo size={80} id="thumb-logo" />
        <div style={{ height: 14 }} />
        <FitLine id="thumb-day" text={`DAY ${config.dayNumber}`} maxWidth={Z.width} maxFontSize={190} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.primary} lineHeightRatio={1.08} letterSpacing="4px" translateY={float * 0.5} />
        <FitLine id="thumb-title-1" text={title1} maxWidth={Z.width} maxFontSize={108} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.text} lineHeightRatio={1.18} />
        <FitLine id="thumb-title-2" text={title2} maxWidth={Z.width} maxFontSize={108} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.text} lineHeightRatio={1.18} />
        <div style={{ height: 8 }} />
        <VectorIllustration illustration="thumbnail" frame={frame} fps={fps} maxWidth={Z.width} maxHeight={680} boxId="thumb-art" />
        <div style={{ height: 10 }} />
        <FitLine id="thumb-topic-bn" text={config.topicBn} maxWidth={Z.width} maxFontSize={64} fontFamily={theme.fonts.bengali} fontWeight={700} color={theme.colors.text} lineHeightRatio={1.3} />
        <div
          data-lbox="thumb-series"
          data-lkind="chrome"
          style={{ marginTop: 8, height: 60, padding: "0 30px", borderRadius: 30, background: theme.colors.accent, color: theme.colors.text, fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 32, lineHeight: "60px", whiteSpace: "nowrap" }}
        >
          {config.seriesTitle}
        </div>
      </div>
      {probe ? <LayoutProbe label="thumbnail" safe={safe} mode={layoutMode} /> : null}
    </AbsoluteFill>
  );
};

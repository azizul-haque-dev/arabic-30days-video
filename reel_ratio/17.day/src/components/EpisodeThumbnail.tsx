import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { breathe } from "../motion";
import { episode } from "../episodes/active";
import { theme } from "../theme";
import { Column } from "./Column";
import { FitText } from "./FitText";
import { Logo } from "./Logo";
import { SceneShell } from "./SceneShell";
import { VectorIllustration } from "./VectorIllustration";

const c = theme.colors;

/**
 * Frame 0 IS the thumbnail: everything is fully visible on the very first frame
 * (only idle motion, no entrance from nothing). The greeting narration plays on top.
 */
export const EpisodeThumbnail: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = breathe(frame, fps, 2.4);
  return (
    <SceneShell label="thumbnail" durationInFrames={durationInFrames}>
      <Column gap={26}>
        <Logo width={400} height={78} />
        <div
          data-box="day-badge"
          data-kind="chrome"
          style={{
            width: 240,
            height: 74,
            borderRadius: 37,
            background: c.accent,
            color: c.text,
            fontFamily: theme.fonts.en,
            fontWeight: 800,
            fontSize: 42,
            letterSpacing: 2,
            lineHeight: "74px",
            textAlign: "center",
            transform: `scale(${1 + b * 0.015})`,
            flexShrink: 0,
          }}
        >
          DAY {episode.day}
        </div>
        <FitText box="title-1" font="en" weight={800} maxSize={90} maxW={880} color={c.text} text="Restaurant" />
        <FitText box="title-2" font="en" weight={800} maxSize={90} maxW={880} color={c.primary} text="Communication" style={{ marginTop: -14 }} />
        <FitText box="title-bn" font="bn" weight={600} maxSize={54} maxW={880} color={c.textSoft} text={episode.titleBn} />
        <VectorIllustration id="hero" flow zoom={1 + b * 0.008} />
        <div
          data-box="greeting"
          data-kind="chrome"
          style={{
            height: 84,
            padding: "0 52px",
            borderRadius: 42,
            background: c.primary,
            color: c.white,
            fontFamily: theme.fonts.bn,
            fontWeight: 700,
            fontSize: 52,
            lineHeight: "84px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transform: `scale(${1 + b * 0.012})`,
          }}
        >
          আসসালামু আলাইকুম
        </div>
        <div
          data-box="series-tag"
          data-kind="chrome"
          style={{
            height: 60,
            padding: "0 36px",
            borderRadius: 30,
            background: c.white,
            border: `3px solid ${c.line}`,
            color: c.textSoft,
            fontFamily: theme.fonts.en,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 3,
            lineHeight: "54px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          30-DAY SURVIVAL ARABIC
        </div>
      </Column>
    </SceneShell>
  );
};

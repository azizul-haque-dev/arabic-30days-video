import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, useSpringIn } from "../animations/presets";
import { BrandLogo } from "../components/BrandLogo";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { AnimatedIllustration } from "../components/AnimatedIllustration";
import { SentenceCard } from "../components/SentenceCard";
import { SentenceBeats, SentenceData, beatFrame, script } from "../utils/timeline";

export const SentenceScene: React.FC<{
  data: SentenceData;
  beats: SentenceBeats;
  sceneStart: number;
  duration: number;
}> = ({ data, beats, sceneStart, duration }) => {
  const c = theme.colors;
  const ar = beatFrame(beats.arabic, sceneStart);
  const ar2 = beatFrame(beats.arabic2, sceneStart);
  const m = beatFrame(beats.meaning, sceneStart);
  const badge = useSpringIn(0, "bouncy");
  return (
    <AbsoluteFill>
      <SceneExit>
        <div style={{ position: "absolute", left: theme.layout.marginX, top: 96 }}>
          <BrandLogo size={62} />
        </div>
        <div style={{ position: "absolute", right: theme.layout.marginX, top: 100 }}>
          <Entrance delay={4} x={30} y={0}>
            <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 32, color: c.white, background: c.text, padding: "6px 28px 10px", borderRadius: 999, letterSpacing: "0.06em" }}>
              {script.episode.badge}
            </div>
          </Entrance>
        </div>
        {/* sentence number */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 214, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 22,
              background: c.primary, color: c.white, borderRadius: 999, padding: "8px 52px 14px",
              fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 56, letterSpacing: "0.05em",
              boxShadow: `0 18px 50px ${c.glow}`,
              opacity: Math.min(1, badge),
              transform: `scale(${interpolate(badge, [0, 1], [0.6, 1])})`,
            }}
          >
            <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "0.14em", opacity: 0.9 }}>SENTENCE</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{data.n}</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 72, top: 318 }}>
          <AnimatedIllustration kind={data.illustration} ar={ar} m={m} dur={duration} />
        </div>
        <div style={{ position: "absolute", left: 48, top: 896 }}>
          <SentenceCard arabic={data.arabic} pron={data.pron} meaning={data.meaning} arFrame={ar} ar2Frame={ar2} meaningFrame={m} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1650, display: "flex", justifyContent: "center" }}>
          <ProgressIndicator current={data.n} />
        </div>
      </SceneExit>
    </AbsoluteFill>
  );
};

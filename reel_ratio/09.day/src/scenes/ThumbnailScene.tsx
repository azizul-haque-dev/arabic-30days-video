import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, useBreathe } from "../animations/presets";
import { BrandLogo } from "../components/BrandLogo";
import { HeroCluster } from "../illustrations/scenes2";
import { script } from "../utils/timeline";
import { useSpringIn } from "../animations/presets";

/** Opening thumbnail — fully designed from frame 0 (entrances start at frame 0 and are already visible on it). */
export const ThumbnailScene: React.FC = () => {
  const c = theme.colors;
  const breathe = useBreathe(60, 0.012);
  const day = useSpringIn(-60, "bouncy");
  return (
    <AbsoluteFill>
      <SceneExit>
        <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center" }}>
          <BrandLogo size={84} shadow delay={-60} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 262, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Entrance delay={-60} y={30}>
            <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 92, lineHeight: 1.02, letterSpacing: "-0.01em", color: c.text, textAlign: "center" }}>
              30 DAYS<br />
              <span style={{ color: c.primary }}>SURVIVAL ARABIC</span>
            </div>
          </Entrance>
          <div style={{ opacity: Math.min(1, day), transform: `scale(${interpolate(day, [0, 1], [0.5, 1])}) rotate(${interpolate(day, [0, 1], [-8, -2])}deg)` }}>
            <div style={{ fontFamily: theme.fonts.latin, fontWeight: 700, fontSize: 60, color: c.text, background: c.accent, padding: "4px 44px 10px", borderRadius: 24, letterSpacing: "0.08em", boxShadow: `0 16px 40px ${c.accentSoft}` }}>
              {script.episode.badge}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 72, top: 600, width: 936, height: 520, transform: `scale(${breathe})` }}>
          <svg viewBox="0 0 600 520" width={936} height={520}>
            <HeroCluster delay={-60} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {script.thumbnail.hook.map((line, i) => (
            <Entrance key={i} delay={-60} y={34}>
              <div lang="bn" style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 76, lineHeight: 1.25, color: c.text, textAlign: "center" }}>
                {i === 1 ? <span style={{ background: `linear-gradient(transparent 62%, ${c.accent}99 62%)`, padding: "0 10px" }}>{line}</span> : line}
              </div>
            </Entrance>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center" }}>
          <Entrance delay={-60} y={30} preset="bouncy">
            <div lang="bn" style={{ fontFamily: theme.fonts.bengali, fontWeight: 600, fontSize: 48, color: c.white, background: c.primary, padding: "8px 46px 14px", borderRadius: 999, boxShadow: `0 20px 50px ${c.glow}` }}>
              {script.thumbnail.support}
            </div>
          </Entrance>
        </div>
      </SceneExit>
    </AbsoluteFill>
  );
};

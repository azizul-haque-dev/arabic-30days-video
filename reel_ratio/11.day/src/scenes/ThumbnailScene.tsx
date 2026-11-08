import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { episodeConfig as cfg } from "../config/episode";
import { BrandLockup, Pill, SceneShell } from "../components/primitives";
import { ShoppingCluster } from "../illustrations/scenes";
import type { SceneTiming } from "../types/episode";

const c = theme.colors;

/** Fully designed from frame 0 (no black / empty first frame): elements only "settle", never fade from nothing. */
const Settle: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const f = useCurrentFrame();
  const k = interpolate(f - delay, [0, 22], [1, 0], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ transform: `translateY(${k * 22}px) scale(${1 + k * 0.05})`, ...style }}>{children}</div>;
};

export const ThumbnailScene: React.FC<{ timing: SceneTiming }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const l1 = cfg.intro.lines.find((l) => l.id === "hook1")!.text;
  const l2 = cfg.intro.lines.find((l) => l.id === "hook2")!.text;
  const [w1, w2, ...rest] = l2.split(" ");
  return (
    <SceneShell duration={timing.duration}>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Settle><BrandLockup name={cfg.brandName} size={92} /></Settle>
      </div>
      <div style={{ position: "absolute", top: 310, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Settle delay={2}><Pill size={44} px={42} py={16}>{cfg.seriesBn}</Pill></Settle>
      </div>

      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Settle delay={3}>
          <div
            style={{
              background: c.accent,
              borderRadius: 64,
              padding: "14px 80px 10px",
              boxShadow: `0 28px 60px ${c.shadow}`,
              display: "flex",
              alignItems: "baseline",
              gap: 26,
              transform: `rotate(${-3 + Math.sin(frame / 30) * 0.6}deg)`,
              fontFamily: theme.fonts.en,
              color: c.text,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 84 }}>DAY</span>
            <span style={{ fontSize: 230, lineHeight: 1 }}>{cfg.episodeNumber}</span>
          </div>
        </Settle>
      </div>

      <div style={{ position: "absolute", top: 760, left: theme.safe.x, right: theme.safe.x, textAlign: "center", fontFamily: theme.fonts.bn, color: c.text }}>
        <Settle delay={5}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.25 }}>{l1}</div>
        </Settle>
        <Settle delay={8}>
          <div style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.4, marginTop: 10 }}>
            {w1} {w2} {rest.slice(0, 2).join(" ")}{" "}
            <span style={{ color: c.primary, fontWeight: 700 }}>{rest.slice(2).join(" ")}</span>
          </div>
        </Settle>
      </div>

      <div style={{ position: "absolute", left: 90, top: 1060, width: 900, height: 600 }}>
        <ShoppingCluster delay={0} />
      </div>
    </SceneShell>
  );
};

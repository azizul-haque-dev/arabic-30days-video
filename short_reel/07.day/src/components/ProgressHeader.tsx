import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {LogoMark} from "./Logo";
import {EPISODE, theme} from "../theme";
import {SCHEDULE} from "../timing";

const C = theme.colors;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** Persistent brand + progress header (visible from the first card until the outro). */
export const ProgressHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = SCHEDULE.words[0].sceneIn;
  const inP = spring({frame: frame - first, fps, config: theme.spring.soft});
  const out = interpolate(frame, [SCHEDULE.outroIn - 6, SCHEDULE.outroIn + 4], [1, 0], {...clamp, easing: theme.ease.in});
  const active = SCHEDULE.words.reduce((a, w) => (frame >= w.sceneIn ? w.index : a), 0);
  const w = SCHEDULE.words[active];
  const numPop = spring({frame: frame - w.sceneIn, fps, config: theme.spring.pop});

  return (
    <div style={{position: "absolute", inset: 0, opacity: Math.min(1, inP * 2) * out, transform: `translateY(${(1 - inP) * -30}px)`}}>
      <div style={{position: "absolute", left: 70, right: 70, top: 188, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <LogoMark size={70} />
          <span style={{fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 44, color: C.white}}>{EPISODE.brand}</span>
        </div>
        <div
          style={{
            fontFamily: theme.fonts.latin,
            fontWeight: 700,
            fontSize: 38,
            color: C.mintSoft,
            padding: "10px 28px",
            borderRadius: 40,
            background: C.glass,
            border: `2px solid ${C.glassBorder}`,
            transform: `scale(${0.85 + 0.15 * numPop})`,
          }}
        >
          WORD {EPISODE.firstWord + active}
        </div>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 284, display: "flex", justifyContent: "center", gap: 14}}>
        {SCHEDULE.words.map((x) => {
          const isActive = x.index === active;
          const done = x.index < active;
          return (
            <div
              key={x.index}
              style={{
                width: isActive ? 64 : 22,
                height: 22,
                borderRadius: 11,
                background: isActive ? C.mint : done ? C.green : "rgba(255,255,255,0.2)",
                boxShadow: isActive ? `0 0 22px ${C.mint}` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

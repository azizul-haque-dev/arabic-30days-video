import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import {C, E, H} from "../theme";
import {ip, useT} from "../anim";
import {BOUNDARIES} from "../timing";

const HALF = 0.28; // seconds each side of the boundary

/** Two staggered shape-wipes centred on each scene boundary hide the cut. */
export const Wipes: React.FC = () => {
  const {t, fps} = useT();
  return (
    <>
      {BOUNDARIES.map((b, i) => {
        const u = t - (b - HALF);
        if (u < -0.1 || u > HALF * 2 + 0.2) return null;
        const panel = (delay: number, color: string, z: number) => {
          const v = u - delay;
          const y =
            v < HALF
              ? ip(v, [0, HALF], [H * 1.25, 0], E.inOut) // slower entrance
              : ip(v, [HALF, HALF * 1.7], [0, -H * 1.25], E.in); // faster exit
          return (
            <div
              key={z}
              style={{
                position: "absolute", left: -60, right: -60, top: -80, height: H + 160,
                background: color, transform: `translateY(${y}px)`,
                borderRadius: "50% / 170px", zIndex: z,
                boxShadow: "0 0 80px rgba(20,83,45,.35)",
              }}
            />
          );
        };
        const logoP = ip(u, [HALF - 0.08, HALF + 0.12], [0, 1], E.back);
        const logoOut = ip(u, [HALF + 0.1, HALF + 0.26], [1, 0], E.in);
        return (
          <React.Fragment key={i}>
            <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
              {panel(0, C.dark, 1)}
              {panel(0.05, C.primary, 2)}
              <div
                style={{
                  position: "absolute", left: 0, right: 0, top: H / 2 - 70, textAlign: "center", zIndex: 3,
                  opacity: Math.min(logoP, logoOut), transform: `scale(${0.7 + 0.3 * logoP})`,
                  fontFamily: "Poppins", fontWeight: 800, fontSize: 56, letterSpacing: 6, color: C.white,
                }}
              >
                ARABIC MASTER
              </div>
            </AbsoluteFill>
            <Sequence from={Math.max(0, Math.round((b - HALF) * fps))} durationInFrames={Math.round(0.7 * fps)}>
              <Audio src={staticFile("sfx/whoosh.wav")} volume={0.16} />
            </Sequence>
          </React.Fragment>
        );
      })}
    </>
  );
};

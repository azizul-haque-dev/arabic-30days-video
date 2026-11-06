import React from "react";
import {AbsoluteFill, staticFile} from "remotion";
import {C} from "../theme";
import {useT, breathe} from "../anim";

/** Layer 1 — animated gradient mesh (never a flat colour). */
export const BgMesh: React.FC<{tone?: "light" | "dark"}> = ({tone = "light"}) => {
  const {t} = useT();
  const dark = tone === "dark";
  const base = dark ? C.dark : C.bg;
  const b1 = dark ? "#166534" : C.soft;
  const b2 = dark ? "#052E16" : "#BBF7D0";
  return (
    <AbsoluteFill style={{background: base}}>
      <div
        style={{
          position: "absolute", inset: -200,
          background: [
            `radial-gradient(700px 700px at ${25 + breathe(t, 6, 0.5)}% ${18 + breathe(t, 4, 0.4)}%, ${b1}, transparent 70%)`,
            `radial-gradient(800px 800px at ${80 + breathe(t, 5, 0.45, 2)}% ${62 + breathe(t, 5, 0.35, 1)}%, ${b2}, transparent 70%)`,
            `radial-gradient(600px 600px at ${30 + breathe(t, 6, 0.3, 4)}% 92%, ${dark ? "#14532D" : "#FEF3C7"}, transparent 70%)`,
          ].join(","),
        }}
      />
      {/* subtle dot grid for an "educational" texture */}
      <div
        style={{
          position: "absolute", inset: 0, opacity: dark ? 0.08 : 0.35,
          backgroundImage: `radial-gradient(${dark ? C.soft : C.primary}22 2px, transparent 2.5px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${t * 6}px ${t * 4}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Layers 4–5 — colour grade, film grain and vignette (always on top). */
export const Finish: React.FC = () => {
  const {frame} = useT();
  const gx = (frame * 53) % 256;
  const gy = (frame * 97) % 256;
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.primary}10, transparent 40%, ${C.dark}14)`, mixBlendMode: "soft-light"}} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("grain.png")})`,
          backgroundSize: "256px 256px",
          backgroundPosition: `${gx}px ${gy}px`,
          opacity: 0.16, mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 58%, ${C.dark}30 100%)`}} />
    </AbsoluteFill>
  );
};

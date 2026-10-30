import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

// লেয়ার ১: ব্যাকগ্রাউন্ড মেশ (ভাসমান গ্রেডিয়েন্ট ব্লব + হালকা জ্যামিতিক প্যাটার্ন)
export const BgMesh: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  const blob = (color: string, size: number, x: number, y: number, px: number, py: number, op: number) => (
    <div style={{
      position: "absolute", width: size, height: size, borderRadius: "50%",
      left: x + Math.sin(t / px) * 90 - size / 2, top: y + Math.cos(t / py) * 80 - size / 2,
      background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 68%)`, opacity: op,
    }} />
  );
  const star = "M40 6 L48 24 L66 16 L58 34 L74 40 L58 46 L66 64 L48 56 L40 74 L32 56 L14 64 L22 46 L6 40 L22 34 L14 16 L32 24 Z";
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {blob(C.heroSoft, 900, width * 0.1, height * 0.12, 3.1, 4.3, 0.9)}
      {blob(C.accentSoft, 700, width * 0.95, height * 0.9, 4.1, 3.3, 0.55)}
      {blob(C.white, 800, width * 0.7, height * 0.2, 5.2, 3.7, 0.9)}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.07, transform: `translate(${(t * 6) % 80}px, ${(t * 4) % 80}px)` }}>
        <defs>
          <pattern id="star" width="80" height="80" patternUnits="userSpaceOnUse" x="-80" y="-80">
            <path d={star} fill="none" stroke={C.hero} strokeWidth="2" />
          </pattern>
        </defs>
        <rect x="-80" y="-80" width={width + 160} height={height + 160} fill="url(#star)" />
      </svg>
    </AbsoluteFill>
  );
};

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.14 0 0 0 0 0.11 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// লেয়ার ৪+৫: কালার গ্রেড + গ্রেইন + ভিগনেট (সবার ওপরে)
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(14,159,110,0.05) 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "260px", opacity: 0.07, mixBlendMode: "multiply", transform: `translate(${(f * 37) % 260}px, ${(f * 53) % 260}px)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(16,35,29,0.10) 100%)" }} />
    </AbsoluteFill>
  );
};

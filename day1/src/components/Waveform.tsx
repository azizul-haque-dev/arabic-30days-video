import React from "react";
import { useCurrentFrame } from "remotion";

export const Waveform: React.FC<{ bars?: number; width: number; height: number; amp: number; color: string; seed?: number }> = ({ bars = 26, width, height, amp, color, seed = 0 }) => {
  const frame = useCurrentFrame();
  const gap = Math.max(4, width / bars * 0.38);
  const bw = (width - gap * (bars - 1)) / bars;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const env = 0.55 + 0.45 * Math.sin((i / (bars - 1)) * Math.PI); // taller in the middle
        const m = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.23 + i * 0.9 + seed) * Math.cos(frame * 0.11 + i * 0.37));
        const h = Math.max(bw, height * (0.1 + 0.9 * amp * env * m));
        return <div key={i} style={{ width: bw, height: h, borderRadius: bw, background: color }} />;
      })}
    </div>
  );
};

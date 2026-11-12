import React from "react";
import { theme } from "../theme";
import { entrance, prog } from "../lib/anim";

/** Three repetition indicators that light up 1 → 2 → 3. */
export const PracticeReminder: React.FC<{ frame: number; fps: number; delay: number; step?: number }> = ({ frame, fps, delay, step = 24 }) => (
  <div style={{ display: "flex", gap: 54, alignItems: "center", justifyContent: "center" }}>
    {[1, 2, 3].map((n, i) => {
      const on = prog(frame, delay + i * step, 10, theme.ease.out);
      const enter = entrance(frame, fps, delay - 12 + i * 4, { y: 20 });
      return (
        <div key={n} style={{ width: 170, height: 170, borderRadius: 85, display: "flex", alignItems: "center", justifyContent: "center", background: on > 0.5 ? theme.colors.primary : theme.colors.white, boxShadow: `0 10px 24px ${theme.colors.shadow}`, opacity: enter.opacity, transform: `${enter.transform} scale(${1 + 0.12 * Math.sin(on * Math.PI)})` }}>
          <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 92, color: on > 0.5 ? theme.colors.white : theme.colors.textDim }}>{n}</span>
        </div>
      );
    })}
  </div>
);

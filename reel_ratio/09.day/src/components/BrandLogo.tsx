import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useSpringIn } from "../animations/presets";

/** Arabic Master mark + wordmark. size = mark height in px. */
export const BrandLogo: React.FC<{ size?: number; delay?: number; showWord?: boolean; light?: boolean; shadow?: boolean }> = ({
  size = 64,
  delay = 0,
  showWord = true,
  light = false,
  shadow = false,
}) => {
  const p = useSpringIn(delay, "bouncy");
  const w = useSpringIn(delay + 5, "smooth");
  const c = theme.colors;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.28), opacity: Math.min(1, p) }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          background: light ? c.white : c.primary,
          color: light ? c.primary : c.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.fonts.arabic,
          fontWeight: 700,
          fontSize: size * 0.72,
          lineHeight: 1,
          paddingBottom: size * 0.06,
          transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${interpolate(p, [0, 1], [-25, 0])}deg)`,
          boxShadow: shadow ? `0 ${size * 0.2}px ${size * 0.5}px ${c.glow}` : `0 ${size * 0.1}px ${size * 0.25}px ${c.primaryMid}`,
        }}
      >
        ع
      </div>
      {showWord && (
        <div
          style={{
            fontFamily: theme.fonts.latin,
            fontWeight: 700,
            fontSize: size * 0.6,
            letterSpacing: "-0.01em",
            color: c.text,
            whiteSpace: "nowrap",
            opacity: Math.min(1, w),
            transform: `translateX(${interpolate(w, [0, 1], [-18, 0])}px)`,
          }}
        >
          Arabic <span style={{ color: c.primary }}>Master</span>
        </div>
      )}
    </div>
  );
};

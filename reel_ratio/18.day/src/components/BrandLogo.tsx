import React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../theme";
import { episodeConfig } from "../episodes/day-18/config";

/**
 * Arabic Master logo.
 * The original brand logo file was not supplied, so by default a clean vector PLACEHOLDER mark is drawn.
 * To use the real logo: put it at public/assets/logo.png and set `logo.mode = "image"` in config.ts.
 */
export const LogoMark: React.FC<{ size: number }> = ({ size }) => {
  if (episodeConfig.logo.mode === "image") {
    return <Img src={staticFile(episodeConfig.logo.src)} style={{ width: size, height: size, objectFit: "contain" }} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="4" y="4" width="92" height="92" rx="26" fill={theme.colors.primary} />
      <path d="M22 28 h56 a8 8 0 0 1 8 8 v26 a8 8 0 0 1 -8 8 h-30 l-14 12 v-12 h-12 a8 8 0 0 1 -8 -8 v-26 a8 8 0 0 1 8 -8z"
        fill={theme.colors.white} transform="translate(-4 -4) scale(1.08)" />
      <text x="50" y="62" textAnchor="middle" fontSize="40" fontWeight="700" fill={theme.colors.primary}
        fontFamily={theme.fonts.ar}>ع</text>
      <circle cx="80" cy="22" r="8" fill={theme.colors.accent} />
    </svg>
  );
};

/** Mark + "Arabic Master" wordmark in a row. Height is `size`. */
export const BrandLogo: React.FC<{ size?: number; color?: string }> = ({ size = 96, color = theme.colors.text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.24), height: size }}>
    <LogoMark size={size} />
    <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: Math.round(size * 0.5), color, letterSpacing: -0.5, lineHeight: 1 }}>
      Arabic Master
    </span>
  </div>
);

import React from "react";
import { theme } from "../theme";

/**
 * Arabic Master logo (vector placeholder built from the brand palette).
 * Replace the body of this component (or render an <Img src={staticFile("assets/logo.svg")}/>)
 * to use the final artwork - every scene reads the logo from here only.
 */
export const Logo: React.FC<{ size?: number; showWordmark?: boolean; id?: string; opacity?: number }> = ({
  size = 80,
  showWordmark = true,
  id = "logo",
  opacity = 1,
}) => (
  <div
    data-lbox={id}
    data-lkind="chrome"
    style={{ display: "inline-flex", alignItems: "center", gap: size * 0.26, opacity, height: size }}
  >
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: theme.colors.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 ${size * 0.08}px ${size * 0.2}px ${theme.colors.shadow}`,
      }}
    >
      <span style={{ fontFamily: theme.fonts.arabic, fontWeight: 700, fontSize: size * 0.7, lineHeight: 1, color: theme.colors.textOnPrimary, marginTop: -size * 0.04 }}>ع</span>
    </div>
    {showWordmark ? (
      <span style={{ fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: size * 0.46, color: theme.colors.text, letterSpacing: -0.5, whiteSpace: "nowrap" }}>
        Arabic <span style={{ color: theme.colors.primary }}>Master</span>
      </span>
    ) : null}
  </div>
);

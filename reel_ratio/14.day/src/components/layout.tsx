import React, { createContext, useContext } from "react";
import { theme, ZoneKey } from "../config/theme";

export type LayoutKind = "text" | "logo" | "cta" | "caption" | "art";

const ZoneCtx = createContext<ZoneKey | null>(null);

/** Absolute zone from the theme. Every text box inside is validated to stay within it. */
export const Zone: React.FC<{
  zone: ZoneKey;
  justify?: "center" | "flex-start" | "flex-end";
  gap?: number;
  dir?: "column" | "row";
  children?: React.ReactNode;
}> = ({ zone, justify = "center", gap = 0, dir = "column", children }) => {
  const z = theme.layout.zones[zone];
  return (
    <ZoneCtx.Provider value={zone}>
      <div
        data-zone-box={zone}
        style={{
          position: "absolute",
          left: z.x,
          top: z.y,
          width: z.w,
          height: z.h,
          display: "flex",
          flexDirection: dir,
          alignItems: "center",
          justifyContent: justify,
          gap,
        }}
      >
        {children}
      </div>
    </ZoneCtx.Provider>
  );
};

/** A measured text container. Its own box (including any pill/card background) is the bounding box. */
export const TextBox: React.FC<{
  id: string;
  kind?: Exclude<LayoutKind, "art">;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ id, kind = "text", style, children }) => {
  const zone = useContext(ZoneCtx);
  return (
    <div
      data-layout={kind}
      data-id={id}
      data-zone={zone ?? undefined}
      style={{ boxSizing: "border-box", maxWidth: "100%", textAlign: "center", ...style }}
    >
      {children}
    </div>
  );
};

/** Marks foreground illustration (SVG group) so overlap with text can be measured. */
export const Art: React.FC<{ id: string; transform?: string; opacity?: number; children?: React.ReactNode }> = ({
  id,
  transform,
  opacity,
  children,
}) => (
  <g data-layout="art" data-id={id} transform={transform} opacity={opacity}>
    {children}
  </g>
);

/** Rounded stage card containing an SVG canvas. Anything outside the card is clipped. */
export const Stage: React.FC<{
  zone: "stage" | "sStage";
  scale?: number;
  opacity?: number;
  translateY?: number;
  children: React.ReactNode;
}> = ({ zone, scale = 1, opacity = 1, translateY = 0, children }) => {
  const z = theme.layout.zones[zone];
  return (
    <div
      data-stage={zone}
      style={{
        position: "absolute",
        left: z.x,
        top: z.y,
        width: z.w,
        height: z.h,
        borderRadius: 56,
        overflow: "hidden",
        background: theme.colors.greenMist,
        boxShadow: `0 28px 60px -28px rgba(16,35,29,0.35), inset 0 0 0 3px ${theme.colors.white}`,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <svg width={z.w} height={z.h} viewBox={`0 0 ${z.w} ${z.h}`} style={{ display: "block" }}>
        {children}
      </svg>
    </div>
  );
};

/** Pick a font size so a single line is expected to fit `maxWidth` (validator verifies for real). */
export const fitFont = (text: string, maxWidth: number, maxSize: number, minSize: number, ratio = 0.56) =>
  Math.max(minSize, Math.min(maxSize, Math.floor(maxWidth / (Math.max(text.length, 1) * ratio))));

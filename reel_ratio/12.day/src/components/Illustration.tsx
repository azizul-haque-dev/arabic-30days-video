import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ASSETS } from "../config/assets";
import { theme } from "../theme";
import { fadeIn, useBreathe, useEnter } from "../utils/motion";
import type { EnterKind, IllusZone, LayerDef } from "../types";

const OFFSET: Record<EnterKind, { dx: number; dy: number; s: number }> = {
  none: { dx: 0, dy: 0, s: 1 }, left: { dx: -90, dy: 0, s: 0.92 }, right: { dx: 90, dy: 0, s: 0.92 },
  up: { dx: 0, dy: 80, s: 0.92 }, down: { dx: 0, dy: -80, s: 0.92 }, pop: { dx: 0, dy: 10, s: 0.5 },
};

const Layer: React.FC<{ layer: LayerDef; index: number; base: number }> = ({ layer, index, base }) => {
  const { fps } = useVideoConfig();
  const kind = layer.enter ?? "pop";
  const a = ASSETS[layer.a];
  if (!a) throw new Error(`Unknown illustration asset "${layer.a}"`);
  const delay = base + Math.round(((layer.d ?? index * 4) * fps) / 30);
  const p = useEnter(kind === "none" ? 0 : delay, kind === "pop" ? "pop" : "enter");
  const bob = useBreathe(layer.bob ?? 0, 3.2, index * 0.9);
  const o = OFFSET[kind];
  const h = (layer.w * a.h) / a.w;
  const ringPulse = 1 + useBreathe(0.06, 1.6);
  return (
    <>
      {layer.ring && (
        <div style={{ position: "absolute", left: layer.x + layer.w / 2 - layer.w * 0.75, top: layer.y + h / 2 - layer.w * 0.75, width: layer.w * 1.5, height: layer.w * 1.5, borderRadius: "50%", border: `8px solid ${theme.colors.accent}`, opacity: 0.85 * fadeIn(p), transform: `scale(${ringPulse * (0.6 + 0.4 * p)})` }} />
      )}
      <Img
        src={staticFile(a.file)}
        style={{
          position: "absolute", left: layer.x, top: layer.y, width: layer.w, height: h,
          opacity: kind === "none" ? 1 : fadeIn(p),
          transform: `translate(${o.dx * (1 - p)}px, ${o.dy * (1 - p) + bob}px) scale(${o.s + (1 - o.s) * p})`,
        }}
      />
    </>
  );
};

/** A clipped, rounded stage that holds a composition of SVG layers. Slow Ken Burns + per-layer breathing. */
export const IllustrationZone: React.FC<{ zone: IllusZone; duration: number; delay?: number; card?: boolean }> = ({ zone, duration, delay = 0, card = true }) => {
  const frame = useCurrentFrame();
  const p = useEnter(delay, "soft");
  const kb = interpolate(frame, [0, duration], [1, 1 + theme.motion.kenBurns], { easing: theme.easing.inOut, extrapolateRight: "clamp" });
  const r = zone.zone;
  return (
    <div
      style={{
        position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", borderRadius: theme.motion.radius,
        background: card ? "linear-gradient(180deg, #FFFFFF 0%, #E3F4EE 100%)" : "transparent",
        boxShadow: card ? `0 24px 60px ${theme.colors.shadow}` : "none",
        opacity: fadeIn(p), transform: `translateY(${40 * (1 - p)}px) scale(${0.96 + 0.04 * p})`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `scale(${kb})`, transformOrigin: "50% 50%" }}>
        {zone.layers.map((l, i) => (<Layer key={`${l.a}-${i}`} layer={l} index={i} base={delay} />))}
      </div>
    </div>
  );
};

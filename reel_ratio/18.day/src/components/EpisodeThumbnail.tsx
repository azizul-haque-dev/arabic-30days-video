import React from "react";
import { theme } from "../theme";
import { breathe, entrance, prog } from "../lib/anim";
import { BrandLogo } from "./BrandLogo";
import { Chip } from "./Chip";
import { FitText, Abs } from "./FitText";
import { MARGIN, CONTENT_W, THUMB_ZONES } from "../lib/layout";
import { episodeConfig } from "../episodes/day-18/config";
import { RestaurantMini, OfficeMini } from "../episodes/day-18/illustrations/minis";

const Card: React.FC<{ y: number; label: string; children: React.ReactNode; anim: React.CSSProperties }> = ({ y, label, children, anim }) => (
  <div style={{ position: "absolute", left: MARGIN, top: y, width: CONTENT_W, height: 380, borderRadius: 40, background: theme.colors.white, boxShadow: `0 18px 40px ${theme.colors.shadow}`, overflow: "hidden", ...anim }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 24px" }}>
      <Chip label={label} size={28} bg={theme.colors.primarySoft} color={theme.colors.primaryDark} />
    </div>
    <div style={{ height: 316 }}>{children}</div>
  </div>
);

/**
 * Thumbnail = also the opening frame. Everything is fully visible at frame 0;
 * the animation only adds life (shine, settle, bobbing) — never a blank start.
 */
export const EpisodeThumbnail: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const Z = THUMB_ZONES;
  const settle = 1 + 0.03 * (1 - prog(frame, 0, 14));
  const shine = prog(frame, 4, 22, theme.ease.inOut);
  const speech = Math.max(0, Math.sin(frame / 6));
  const lift = entrance(frame, fps, 0, { y: 0, scale: 1 });
  void lift;
  return (
    <>
      <div style={{ position: "absolute", left: MARGIN, top: Z.logo.y, width: CONTENT_W, height: Z.logo.h, display: "flex", justifyContent: "center", alignItems: "center", transform: `scale(${settle})`, overflow: "hidden" }}>
        <BrandLogo size={92} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-20 + shine * 140}%`, width: 90, background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.7), transparent)", transform: "skewX(-18deg)" }} />
      </div>
      <Abs x={MARGIN} y={Z.day.y} w={CONTENT_W} h={Z.day.h} style={{ transform: `translateY(${breathe(frame, fps, 3, 3)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 176, lineHeight: 1, color: theme.colors.primary, letterSpacing: -4 }}>DAY</span>
          <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 176, lineHeight: 1, color: theme.colors.accent, letterSpacing: -4 }}>{episodeConfig.day}</span>
        </div>
      </Abs>
      <Abs x={MARGIN} y={Z.title.y} w={CONTENT_W} h={Z.title.h}>
        <FitText text="Restaurant & Workplace Arabic" script="en" width={CONTENT_W} maxLines={2} maxSize={76} minSize={56} color={theme.colors.text} />
      </Abs>
      <Abs x={MARGIN} y={Z.bn.y} w={CONTENT_W} h={Z.bn.h}>
        <FitText text="রেস্টুরেন্ট ও কর্মক্ষেত্রের প্রয়োজনীয় বাক্য" script="bn" width={CONTENT_W} maxLines={2} maxSize={52} minSize={44} weight={600} color={theme.colors.textDim} />
      </Abs>
      <Card y={Z.cardA.y} label="Restaurant" anim={{}}>
        <RestaurantMini frame={frame} fps={fps} w={CONTENT_W} h={316} speech={speech} />
      </Card>
      <Card y={Z.cardB.y} label="Workplace" anim={{}}>
        <OfficeMini frame={frame} fps={fps} w={CONTENT_W} h={316} speech={speech} />
      </Card>
    </>
  );
};

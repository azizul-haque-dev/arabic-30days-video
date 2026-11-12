import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { entrance, prog } from "../lib/anim";
import { CONTENT_W, MARGIN } from "../lib/layout";
import { toBengaliDigits } from "../lib/format";
import { SECTIONS, type SectionId } from "../episodes/day-18/sentences";
import { OfficeOverview, RestaurantOverview } from "../episodes/day-18/illustrations";
import { Abs, FitText } from "./FitText";
import { Chip } from "./Chip";
import { SceneShell } from "./SceneShell";
import { TopBar } from "./TopBar";

/** Section opener. The workplace opener starts on the restaurant visual and wipes into the office. */
export const SectionIntro: React.FC<{ section: SectionId; durationInFrames: number }> = ({ section, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = SECTIONS[section];
  const wipe = prog(frame, 4, 26, theme.ease.inOut);
  const [a, b] = S.range.split("–");
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <TopBar frame={frame} fps={fps} />
      <div style={{ position: "absolute", left: MARGIN, top: 330, width: CONTENT_W, height: 540, borderRadius: 44, overflow: "hidden", boxShadow: `0 18px 40px ${theme.colors.shadow}`, border: `4px solid ${theme.colors.white}`, boxSizing: "border-box", ...entrance(frame, fps, 0, { y: 20, scale: 0.97 }) }}>
        {section === "restaurant" ? (
          <RestaurantOverview frame={frame} fps={fps} />
        ) : (
          <>
            {wipe < 1 ? <RestaurantOverview frame={frame} fps={fps} compact /> : null}
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)` }}>
              <OfficeOverview frame={frame} fps={fps} />
            </div>
          </>
        )}
      </div>
      <Abs x={MARGIN} y={930} w={CONTENT_W} h={240} style={entrance(frame, fps, 14, { y: 26 })}>
        <FitText text={S.titleEn} script="en" width={CONTENT_W} maxLines={2} maxSize={100} minSize={72} color={theme.colors.primary} />
      </Abs>
      <Abs x={MARGIN} y={1200} w={CONTENT_W} h={200} style={entrance(frame, fps, 22, { y: 22 })}>
        <FitText text={S.titleBn} script="bn" width={CONTENT_W} maxLines={2} maxSize={64} minSize={48} weight={600} />
      </Abs>
      <Abs x={MARGIN} y={1440} w={CONTENT_W} h={80} style={entrance(frame, fps, 30, { y: 16 })}>
        <Chip label={`বাক্য ${toBengaliDigits(a)}–${toBengaliDigits(b)}`} bn size={36} bg={theme.colors.accent} color={theme.colors.text} />
      </Abs>
    </SceneShell>
  );
};

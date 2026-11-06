import React from "react";
import { theme } from "../theme";
import { Entrance } from "../animations/presets";
import { ArabicText } from "./ArabicText";
import { BengaliMeaning, BengaliPronunciation } from "./BengaliText";

/**
 * White text card: Arabic (RTL) -> Bengali pronunciation -> Bengali meaning.
 * Positions are fixed so nothing shifts when the meaning appears.
 */
export const SentenceCard: React.FC<{
  arabic: string;
  pron: string;
  meaning: string;
  arFrame: number;
  ar2Frame: number;
  meaningFrame: number;
  width?: number;
  height?: number;
}> = ({ arabic, pron, meaning, arFrame, ar2Frame, meaningFrame, width = 984, height = 720 }) => {
  const c = theme.colors;
  const spoken: [number, number][] = [
    [arFrame, ar2Frame - 4],
    [ar2Frame, ar2Frame + (ar2Frame - arFrame) - 4],
  ];
  return (
    <Entrance delay={10} y={50} preset="smooth">
      <div
        style={{
          position: "relative",
          width,
          height,
          borderRadius: 56,
          background: c.white,
          border: `2px solid ${c.line}`,
          boxShadow: `0 40px 80px -34px ${c.primaryMid}`,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 252, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArabicText text={arabic} delay={arFrame} activeRanges={spoken} maxWidth={width - 70} fontSize={arabic.length > 22 ? 72 : 84} />
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 284, height: 3, borderRadius: 2, background: c.line }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 170, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 44px" }}>
          <BengaliPronunciation text={pron} delay={arFrame + 8} activeRanges={spoken} size={pron.length > 32 ? 46 : pron.length > 26 ? 50 : 54} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 486, height: 218, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 52px" }}>
          <BengaliMeaning text={meaning} delay={meaningFrame} />
        </div>
      </div>
    </Entrance>
  );
};

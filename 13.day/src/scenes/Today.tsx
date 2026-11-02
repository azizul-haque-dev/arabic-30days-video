import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { BEATS } from "../timing";
import { IconTile, Pop, Words } from "../components/primitives";
import { Icon } from "../components/icons";
import { Card, Pill, toBn, useRoll } from "../components/ui";

// আজকের পরিকল্পনা: বাজার + ট্যাক্সি, ১০টি বাক্য (Glass Cards)
export const Today: React.FC = () => {
  const { market, taxi, ten, go } = BEATS.today;
  const roll = useRoll(ten, 10);
  const cardStyle: React.CSSProperties = { width: 430, height: 410, background: theme.colors.glass, border: `3px solid ${theme.colors.white}`, borderRadius: theme.radius.card, boxShadow: theme.shadow.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 84, left: 0, right: 0 }}>
        <Words text="আজ শিখব" at={2} size={112} per={5} lineHeight={1.3} />
      </div>

      <div style={{ position: "absolute", top: 262, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
        <Pop at={market} kind="bouncy" y={60} scale={0.85}>
          <div style={cardStyle}>
            <IconTile at={market + 3} size={226} tilt={-3} round={56} floatPhase={0}><Icon id="crowd" size={172} /></IconTile>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 68, lineHeight: 1.3, color: theme.colors.text }}>বাজার</div>
          </div>
        </Pop>
        <Pop at={taxi} kind="bouncy" y={60} scale={0.85}>
          <div style={cardStyle}>
            <IconTile at={taxi + 3} size={226} tilt={3} round={56} floatPhase={2}><Icon id="taxi" size={172} /></IconTile>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 68, lineHeight: 1.3, color: theme.colors.text }}>ট্যাক্সি</div>
          </div>
        </Pop>
      </div>

      <div style={{ position: "absolute", top: 710, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pop at={ten} kind="bouncy" y={40} scale={0.9}>
          <Card style={{ padding: "6px 60px", display: "flex", alignItems: "baseline", gap: 26, borderRadius: 80 }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 56, color: theme.colors.textDim, lineHeight: 1.5 }}>আরও</span>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 116, color: theme.colors.text, lineHeight: 1.3, fontVariantNumeric: "tabular-nums" }}>{toBn(roll.value)}টি</span>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 56, color: theme.colors.textDim, lineHeight: 1.5 }}>বাক্য</span>
          </Card>
        </Pop>
      </div>

      <div style={{ position: "absolute", bottom: 66, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pop at={go} kind="bouncy" y={40} scale={0.8}>
          <Pill bg={theme.colors.accent} color={theme.colors.text} size={58} py={10} px={56}>চলুন শুরু করি!</Pill>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

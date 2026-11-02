import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { BEATS } from "../timing";
import { IconTile, Pop, Words } from "../components/primitives";
import { Icon, CheckBadge } from "../components/icons";
import { Pill } from "../components/ui";

// হুক: ফ্রেম ০-তেই পূর্ণ পোস্টার (থাম্বনেইল) — কালো/ফাঁকা ফ্রেম নয়। এন্ট্রি শুধু সামান্য settle।
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const bB = BEATS.hook.b;
  const settle = { minOpacity: 1, y: 16, scale: 0.97 } as const;
  const swap = frame >= bB;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 64, left: 72, right: 72, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Pop at={0} {...settle} exitAt={bB - 4}>
          <Pill bg={theme.colors.white} color={theme.colors.text} size={40} py={8} px={30} style={{ boxShadow: theme.shadow.soft }}>
            <span style={{ width: 20, height: 20, borderRadius: 20, background: theme.colors.hero, display: "inline-block" }} />Arabic Master
          </Pill>
        </Pop>
        <Pop at={0} {...settle}>
          <Pill bg={theme.colors.accent} color={theme.colors.text} size={44} py={8} px={34}>Day 13</Pill>
        </Pop>
      </div>

      {/* হেডলাইন A: সমস্যা (থাম্বনেইল পোস্টার) */}
      {frame < bB + 12 && <div style={{ position: "absolute", top: 180, left: 72, right: 72 }}>
        <Words text="বাজার ও ট্যাক্সিতে" at={0} size={108} per={0} settle align="left" lineHeight={1.3} exitAt={bB - 4} style={{ columnGap: 28 }} />
        <Words text="আরবি বলতে" at={0} size={108} per={0} settle align="left" lineHeight={1.3} exitAt={bB - 3} style={{ columnGap: 28 }} />
        <Words text="আটকে যান?" at={0} size={124} per={0} settle align="left" lineHeight={1.3} color={theme.colors.hero} highlightAt={10} exitAt={bB - 2} style={{ columnGap: 30 }} />
      </div>}

      {/* হেডলাইন B: সমাধান */}
      {frame >= bB - 1 && <div style={{ position: "absolute", top: 190, left: 72, right: 72, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <Words text="চিন্তা নেই!" at={bB} size={128} per={5} align="left" lineHeight={1.2} color={theme.colors.hero} highlightAt={bB + 14} style={{ columnGap: 36 }} />
        <Words text="আপনার প্রতিদিনের আরবি শেখার সঙ্গী" at={bB + 10} size={52} per={4} weight={600} align="left" mask color={theme.colors.textDim} lineHeight={1.4} />
        <Pop at={bB + 18} kind="bouncy" y={40} scale={0.85}>
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 22, background: theme.colors.white, borderRadius: 40, boxShadow: theme.shadow.card, padding: "10px 40px 10px 16px" }}>
            <div style={{ width: 72, height: 72, borderRadius: 72, background: theme.colors.text, color: theme.colors.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36 }}>AM</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 76, color: theme.colors.text, lineHeight: 1.25 }}>Arabic Master</div>
          </div>
        </Pop>
      </div>}

      {/* ভিজ্যুয়াল: বাজার + ট্যাক্সি */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center", gap: 44 }}>
        <IconTile at={0} size={270} tilt={-5} floatPhase={0} minOpacity={1}><Icon id="crowd" size={210} /></IconTile>
        <div style={{ position: "relative" }}>
          <IconTile at={0} size={270} tilt={5} floatPhase={2} minOpacity={1}><Icon id="taxi" size={210} /></IconTile>
          <div style={{ position: "absolute", top: -26, right: -26 }}>
            {swap ? (
              <Pop at={bB + 6} kind="bouncy" y={0} scale={0.3}><CheckBadge size={84} fill={theme.colors.hero} /></Pop>
            ) : (
              <Pop at={0} {...settle} y={0} scale={0.8}>
                <div style={{ width: 84, height: 84, borderRadius: 84, background: theme.colors.accent, border: `6px solid ${theme.colors.text}`, color: theme.colors.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 62, lineHeight: 1 }}>?</div>
              </Pop>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

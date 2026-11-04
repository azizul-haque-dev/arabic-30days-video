import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { BEATS } from "../timing";
import { Pop, Words } from "../components/primitives";
import { CheckBadge } from "../components/icons";
import { Card, toBn, useRoll } from "../components/ui";

// ৩০ দিনের ট্র্যাকার: ১৩তম দিন + ১২০টি বাক্য (Data Dashboard ধাঁচ — শুধু স্ক্রিপ্টের সংখ্যা)
export const Series: React.FC = () => {
  const frame = useCurrentFrame();
  const { day13, count } = BEATS.series;
  const roll = useRoll(count + 6, 120);
  const CHIP = 78, GAP = 12, gridW = 10 * CHIP + 9 * GAP;

  return (
    <AbsoluteFill style={{ padding: "0 72px" }}>
      <div style={{ position: "absolute", top: 84, left: 72, right: 72 }}>
        <Words text="৩০ দিনের" at={2} size={80} per={4} align="left" lineHeight={1.25} weight={600} color={theme.colors.textDim} />
        <Words text="Survival Arabic" at={8} size={118} per={5} align="left" lineHeight={1.2} color={theme.colors.hero} style={{ columnGap: 30 }} />
        <Words text="সিরিজ" at={20} size={64} per={4} align="left" lineHeight={1.3} weight={600} color={theme.colors.textDim} />
      </div>

      <div style={{ position: "absolute", top: 470, left: (1080 - gridW) / 2, width: gridW, display: "flex", flexWrap: "wrap", gap: GAP }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const done = i < 12;
          const isToday = i === 12;
          const doneP = done ? interpolate(frame, [count + i * 3, count + i * 3 + 8], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          const todayP = isToday ? interpolate(frame, [day13, day13 + 10], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          const pulse = isToday && frame > day13 ? 1 + Math.sin((frame - day13) / 6) * 0.04 : 1;
          return (
            <Pop key={i} at={10 + i * 2} y={22} scale={0.7} kind="snappy">
              <div style={{ width: CHIP, height: CHIP, borderRadius: 22, position: "relative", background: isToday && todayP > 0 ? theme.colors.accent : doneP > 0.5 ? theme.colors.text : theme.colors.white, boxShadow: theme.shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 + todayP * 0.14) * pulse})`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: isToday && todayP > 0 ? theme.colors.text : theme.colors.textDim }}>
                {doneP > 0.5 ? <CheckBadge size={44} fill={theme.colors.text} /> : toBn(i + 1)}
                {isToday && todayP > 0 && <div style={{ position: "absolute", inset: -8, borderRadius: 28, border: `4px solid ${theme.colors.accent}`, opacity: 0.55 }} />}
              </div>
            </Pop>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 72, right: 72, bottom: 72 }}>
        <Pop at={count} kind="bouncy" y={60} scale={0.9}>
          <Card style={{ padding: "26px 52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 132, lineHeight: 1.25, color: theme.colors.text, fontVariantNumeric: "tabular-nums" }}>{toBn(roll.value)}টি</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 52, lineHeight: 1.35, color: theme.colors.textDim, textAlign: "right" }}>দরকারি বাক্য<br />শেখা হয়েছে</div>
          </Card>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

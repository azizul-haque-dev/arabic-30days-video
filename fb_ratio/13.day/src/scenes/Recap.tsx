import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { BEATS, SCENES, SentenceScene } from "../timing";
import { Pop, Words } from "../components/primitives";
import { CheckBadge } from "../components/icons";
import { Card, toBn, useRoll } from "../components/ui";

// সমাপ্তি: Checklist Recap Grid + ১৩০/৩০০ প্রগ্রেস
export const Recap: React.FC = () => {
  const items = SCENES.filter((s): s is SentenceScene => s.kind === "sentence").map((s) => s.def);
  const { progress } = BEATS.recap;
  const roll = useRoll(progress + 4, 130);
  const fill = roll.value / 300;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 66, left: 72, right: 72 }}>
        <Words text="১০টি দরকারি বাক্য শেখা শেষ!" at={2} size={76} per={4} lineHeight={1.3} wordColors={{ 4: theme.colors.hero }} />
      </div>

      <div style={{ position: "absolute", top: 300, left: 92, width: 896, display: "flex", flexWrap: "wrap", columnGap: 14, rowGap: 20 }}>
        {items.map((d, i) => (
          <Pop key={d.n} at={12 + i * 5} y={30} scale={0.8} kind="snappy">
            <div style={{ width: 168, height: 220, borderRadius: 36, background: theme.colors.white, boxShadow: theme.shadow.soft, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 8px 40px" }}>
              <div style={{ position: "absolute", top: 12, left: 18, fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 30, color: theme.colors.textDim }}>{d.n}</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: d.keyword.length > 7 ? 32 : 42, lineHeight: 1.3, color: theme.colors.text, textAlign: "center" }}>{d.keyword}</div>
              <div style={{ position: "absolute", right: 12, bottom: 12 }}>
                <Pop at={22 + i * 5} kind="bouncy" y={0} scale={0.2}><CheckBadge size={42} fill={theme.colors.hero} /></Pop>
              </div>
            </div>
          </Pop>
        ))}
      </div>

      <div style={{ position: "absolute", left: 72, right: 72, bottom: 64 }}>
        <Pop at={progress} kind="bouncy" y={50} scale={0.92}>
          <Card style={{ padding: "22px 52px 34px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 108, lineHeight: 1.3, color: theme.colors.text, fontVariantNumeric: "tabular-nums" }}>
                {toBn(roll.value)}<span style={{ fontSize: 60, color: theme.colors.textDim }}> / ৩০০</span>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 46, color: theme.colors.textDim, lineHeight: 1.3 }}>বাক্য শেখা</div>
            </div>
            <div style={{ height: 26, borderRadius: 26, background: theme.colors.line, overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 26, background: theme.colors.hero }} />
            </div>
          </Card>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { BEATS } from "../timing";
import { Pop, Words } from "../components/primitives";
import { CheckBadge } from "../components/icons";
import { Card, Pill } from "../components/ui";

const TEXT = "DAY 13 DONE!";
const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// CTA: ফলো (বাটন ক্লিক) → কমেন্ট টাইপরাইটার (চ্যাট/ইনপুট UI) → "দেখা হবে Day 14-তে"
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { follow, comment, typing, bye } = BEATS.cta;
  const press = interpolate(frame, [follow + 8, follow + 12, follow + 18], [1, 0.92, 1], { easing: theme.ease.out, ...clampX });
  const followed = frame >= follow + 12;
  const chars = Math.max(0, Math.min(TEXT.length, Math.floor((frame - typing) / 1.5)));
  const caret = Math.floor(frame / 8) % 2 === 0 || chars < TEXT.length;
  const sendP = interpolate(frame, [typing + TEXT.length * 1.5 + 4, typing + TEXT.length * 1.5 + 10], [0, 1], { easing: theme.ease.out, ...clampX });
  const exitAt = bye - 4;

  return (
    <AbsoluteFill>
      {/* ধাপ ১: ফলো + কমেন্ট */}
      <div style={{ position: "absolute", top: 330, left: 72, right: 72, display: "flex", flexDirection: "column", gap: 64 }}>
        <Pop at={4} kind="bouncy" y={50} scale={0.92} exitAt={exitAt}>
          <Card style={{ padding: "28px 40px", display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ width: 120, height: 120, borderRadius: 120, background: theme.colors.text, color: theme.colors.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 56 }}>AM</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 62, lineHeight: 1.25, color: theme.colors.text }}>Arabic Master</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: theme.colors.textDim }}>Survival Arabic</div>
            </div>
            <div style={{ transform: `scale(${press})` }}>
              <Pill bg={followed ? theme.colors.hero : theme.colors.text} color={theme.colors.white} size={46} py={10} px={38}>
                {followed && <CheckBadge size={40} fill={theme.colors.heroDeep} />}Follow
              </Pill>
            </div>
          </Card>
        </Pop>

        <Pop at={comment - 6} kind="smooth" y={50} scale={0.94} exitAt={exitAt}>
          <div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 40, color: theme.colors.textDim, marginBottom: 12, paddingLeft: 12 }}>Comment</div>
            <Card style={{ padding: "30px 36px", display: "flex", alignItems: "center", gap: 24, borderRadius: 64 }}>
              <div style={{ width: 80, height: 80, borderRadius: 80, background: theme.colors.heroSoft, flexShrink: 0 }} />
              <div style={{ flex: 1, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 82, lineHeight: 1.3, color: theme.colors.text, whiteSpace: "nowrap" }}>
                {TEXT.slice(0, chars)}
                <span style={{ display: "inline-block", width: 6, height: 70, marginLeft: 6, verticalAlign: "middle", background: theme.colors.accent, opacity: caret ? 1 : 0 }} />
              </div>
              <div style={{ width: 84, height: 84, borderRadius: 84, flexShrink: 0, background: sendP > 0.5 ? theme.colors.hero : theme.colors.text, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(sendP * Math.PI) * 0.14})` }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20 H31 M21 9 L32 20 L21 31" stroke={theme.colors.white} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </Card>
          </div>
        </Pop>
      </div>

      {/* ধাপ ২: বিদায় */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words text="দেখা হবে" at={bye} size={104} per={5} lineHeight={1.3} />
        <Words text="Day 14-তে" at={bye + 8} size={168} per={6} lineHeight={1.2} color={theme.colors.hero} highlightAt={bye + 24} style={{ columnGap: 36 }} />
        <Words text="ইনশাআল্লাহ!" at={bye + 18} size={96} per={5} lineHeight={1.3} weight={600} color={theme.colors.textDim} />
        <Pop at={bye + 30} kind="bouncy" y={40} scale={0.85} style={{ marginTop: 34 }}>
          <Pill bg={theme.colors.white} color={theme.colors.text} size={52} py={10} px={40} style={{ boxShadow: theme.shadow.card }}>
            <span style={{ width: 22, height: 22, borderRadius: 22, background: theme.colors.hero, display: "inline-block" }} />Arabic Master
          </Pill>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

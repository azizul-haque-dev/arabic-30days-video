import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { EPISODE } from "../episode/day20";
import { Caption } from "../components/Caption";
import { EpisodeProgress } from "../components/EpisodeProgress";
import { Chip } from "../components/Chip";
import { endF, entry, startF } from "../timing";
import { ease, useBreath, useEnter, useExit, useFrame } from "../anim";

type Props = { sceneStart: number; sceneEnd: number };

/** Series introduction: branding, DAY 20, progress to 200 / 300. SRT entries 9–12. */
export const IntroScene: React.FC<Props> = ({ sceneStart, sceneEnd }) => {
  const L = (n: number) => startF(n) - sceneStart;
  const E = (n: number) => endF(n) - sceneStart;
  const end = sceneEnd - sceneStart;
  const exit = useExit(end, 8);
  const logo = useEnter(2, { y: 50, from: 0.7, config: theme.spring.pop });
  const series = useEnter(L(10), { y: 36, from: 0.92 });
  const day = useEnter(L(11), { y: 40, from: 0.75, config: theme.spring.pop });
  const prog = useEnter(L(11) + 8, { y: 40, from: 0.95 });
  const breath = useBreath(4, 90);
  const f = useFrame();
  const dayGlow = ease(f, L(11), L(11) + 12);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${exit * -24}px)` }}>
      {/* logo + brand */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: logo.opacity, transform: `${logo.transform} translateY(${breath}px)` }}>
        <div style={{ width: 170, height: 170, borderRadius: 52, background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.dark})`, boxShadow: theme.shadow.card, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: 118, lineHeight: 1, paddingBottom: 18 }}>ع</div>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 76, color: theme.colors.dark, letterSpacing: -2 }}>{EPISODE.brand}</div>
      </div>
      {/* series pill */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: series.opacity, transform: series.transform }}>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 40, color: theme.colors.white, background: theme.colors.primary, borderRadius: 999, padding: "16px 44px", boxShadow: theme.shadow.soft }}>{EPISODE.series}</div>
      </div>
      {/* DAY 20 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", justifyContent: "center", opacity: day.opacity, transform: day.transform }}>
        <div style={{ position: "relative", fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 170, lineHeight: 1.05, color: theme.colors.dark, letterSpacing: -4 }}>
          DAY {EPISODE.day}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 6, height: 14, borderRadius: 7, background: theme.colors.amber, transform: `scaleX(${dayGlow})`, transformOrigin: "left" }} />
        </div>
      </div>
      {/* progress + milestone */}
      <div style={{ position: "absolute", left: 100, top: 900, opacity: prog.opacity, transform: prog.transform }}>
        <EpisodeProgress start={L(12) + 6} dur={36} width={880} />
      </div>
      <div style={{ position: "absolute", left: 100, top: 1120 }}>
        <Chip text="200 Essential Sentences Learned" start={L(12) + 30} tone="amber" width={880} />
      </div>
      {/* narration caption (exact SRT wording) */}
      <div style={{ position: "absolute", left: 100, top: 1260, width: 880, height: 300 }}>
        {[9, 10, 11, 12].map((n, i, arr) => (
          <Caption key={n} text={entry(n).text} from={L(n)} to={i < arr.length - 1 ? L(arr[i + 1]) : Math.min(E(n) + 3, end)} width={860} height={280} maxSize={54} maxLines={3} />
        ))}
      </div>
    </AbsoluteFill>
  );
};


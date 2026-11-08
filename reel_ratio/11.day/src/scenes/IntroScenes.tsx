import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, springOf } from "../theme";
import { episodeConfig as cfg, progress } from "../config/episode";
import { BrandBar, BrandLockup, CaptionStack, Enter, LogoMark, Pill, ProgressRing, SceneShell, WordReveal } from "../components/primitives";
import { ShoppingCluster } from "../illustrations/scenes";
import type { SceneTiming } from "../types/episode";

const c = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lineText = (id: string) => cfg.intro.lines.find((l) => l.id === id)!.text;

/** 2 — Brand introduction */
export const BrandIntroScene: React.FC<{ timing: SceneTiming }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = springOf(frame, fps, 3, "pop");
  const rings = [0, 1, 2].map((i) => {
    const k = ((frame - 6 - i * 14) / 48) % 1;
    return frame < 6 + i * 14 ? 0 : k;
  });
  return (
    <SceneShell duration={timing.duration}>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 380, height: 380 }}>
          {rings.map((k, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 110,
                border: `6px solid ${c.primary}`,
                opacity: (1 - k) * 0.35,
                transform: `scale(${1 + k * 0.9})`,
              }}
            />
          ))}
          <div style={{ transform: `scale(${interpolate(pop, [0, 1], [0.3, 1])}) rotate(${(1 - pop) * -25 + Math.sin(frame / 22) * 2}deg)`, opacity: Math.min(1, pop * 2) }}>
            <LogoMark size={380} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 830, left: theme.safe.x, right: theme.safe.x }}>
        <WordReveal text={cfg.brandName} delay={14} fontSize={108} weight={700} family={theme.fonts.en} gap={24} stagger={7} wrap={false} />
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Enter delay={26}><Pill size={44} px={42} py={16}>{cfg.seriesBn}</Pill></Enter>
      </div>
      <div style={{ position: "absolute", left: theme.safe.x, right: theme.safe.x, top: 1250 }}>
        <CaptionStack
          lines={[
            { id: "relief", text: lineText("relief") },
            { id: "companion", text: lineText("companion") },
          ]}
          starts={timing.lines}
          fontSize={64}
          highlight={["Arabic", "Master!"]}
        />
      </div>
    </SceneShell>
  );
};

/** 3 — Episode introduction: Day badge → progress 100/300 → sentence range */
export const EpisodeIntroScene: React.FC<{ timing: SceneTiming }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dayAt = timing.lines.day;
  const learnedAt = timing.lines.learned;
  const rangeAt = timing.lines.range;
  const shift = interpolate(frame, [learnedAt - 4, learnedAt + 20], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const phase1Out = interpolate(frame, [learnedAt - 4, learnedAt + 6], [1, 0], clamp);
  const prevPercent = Math.round((progress.previous / progress.total) * 10000) / 100;
  const chips = cfg.sentences.map((s) => s.number);
  const badgeY = 320 - shift * 120;
  const badgeScale = 1 - shift * 0.45;
  return (
    <SceneShell duration={timing.duration}>
      <BrandBar name={cfg.brandName} right={<Pill bg={c.accent} color={c.text} size={38} px={30} py={12}>{cfg.seriesName}</Pill>} />

      <div style={{ position: "absolute", top: badgeY, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${badgeScale})` }}>
        <Enter delay={dayAt} y={70} scale={0.6} preset="pop" breathe={4}>
          <div style={{ background: c.accent, borderRadius: 72, padding: "18px 100px 10px", boxShadow: `0 30px 70px ${c.shadow}`, fontFamily: theme.fonts.en, fontWeight: 700, color: c.text, display: "flex", alignItems: "baseline", gap: 30 }}>
            <span style={{ fontSize: 100 }}>DAY</span>
            <span style={{ fontSize: 280, lineHeight: 1 }}>{cfg.episodeNumber}</span>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: phase1Out }}>
        <Enter delay={dayAt + 8}><Pill size={48} px={44} py={18}>{cfg.seriesBn}</Pill></Enter>
      </div>
      <div style={{ position: "absolute", top: 730, left: 110, width: 860, height: 380, opacity: phase1Out * 0.95 }}>
        <Enter delay={dayAt + 14} y={50}><ShoppingCluster delay={0} /></Enter>
      </div>

      {frame >= learnedAt - 2 && (
        <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Enter delay={learnedAt + 6} y={60} scale={0.7} preset="pop" breathe={3}>
            <ProgressRing value={progress.previous} total={progress.total} percent={prevPercent} delay={learnedAt + 10} size={440} />
          </Enter>
        </div>
      )}

      {frame >= rangeAt - 2 && (
        <div style={{ position: "absolute", top: 980, left: theme.safe.x, right: theme.safe.x, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
          {chips.map((n, i) => (
            <Enter key={n} delay={rangeAt + i * 3} y={30} scale={0.5} preset="pop">
              <Pill bg={i % 2 ? c.primaryDark : c.primary} size={46} px={30} py={12} style={{ minWidth: 150, justifyContent: "center" }}>{n}</Pill>
            </Enter>
          ))}
        </div>
      )}

      <div style={{ position: "absolute", left: theme.safe.x, right: theme.safe.x, top: 1510 }}>
        <CaptionStack
          lines={["day", "learned", "range"].map((id) => ({ id, text: lineText(id) }))}
          starts={timing.lines}
          fontSize={54}
          highlight={["১১তম", "১০০টি", "১০১", "১১০"]}
        />
      </div>
    </SceneShell>
  );
};

/** 4 — Topic introduction */
export const TopicScene: React.FC<{ timing: SceneTiming }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const [label] = lineText("topic").split(":");
  const topicAt = Math.max(0, timing.lines.topic);
  const startAt = timing.lines.start;
  const sweep = interpolate(frame, [topicAt + 14, topicAt + 36], [0, 100], { easing: theme.ease.out, ...clamp });
  return (
    <SceneShell duration={timing.duration}>
      <BrandBar name={cfg.brandName} right={<Pill bg={c.accent} color={c.text} size={38} px={30} py={12}>DAY {cfg.episodeNumber}</Pill>} />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Enter delay={topicAt} y={30}><Pill bg={c.primaryDark} size={48} px={44} py={16}>{label}</Pill></Enter>
      </div>
      <div style={{ position: "absolute", top: 520, left: theme.safe.x, right: theme.safe.x, textAlign: "center" }}>
        <WordReveal text={cfg.topicBn} delay={topicAt + 6} fontSize={236} weight={700} color={c.text} lineHeight={1.2} />
        <div style={{ margin: "0 auto", height: 20, width: `${sweep * 0.7}%`, borderRadius: 10, background: c.accent }} />
        <Enter delay={topicAt + 24} y={20}>
          <div style={{ marginTop: 22, fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 56, color: c.textSoft, letterSpacing: 6, textTransform: "uppercase" }}>{cfg.topic}</div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1010, width: 900, height: 480 }}>
        <ShoppingCluster delay={Math.round(timing.duration * 0.08) / 30} />
      </div>
      <div style={{ position: "absolute", top: 1540, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Enter delay={startAt} y={40} scale={0.7} preset="pop" breathe={4}>
          <Pill bg={c.accent} color={c.text} size={64} px={64} py={22}>{lineText("start")}</Pill>
        </Enter>
      </div>
    </SceneShell>
  );
};

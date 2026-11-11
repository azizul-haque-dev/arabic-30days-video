import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { useScene } from "../context";
import { ArtFrame, BrandHeader, Caption, Entrance, Pill, SceneShell, SparkMark } from "../components/common";
import { EntranceArt, PointingArt, ThumbnailArt, WaiterArt } from "../illustrations/compositions";
import { clamp01, fitFont, ramp, useSpring } from "../utils/anim";
import { Stack, heroFont, useSceneText } from "./helpers";

const C = theme.colors;

/* ===== 1. Thumbnail / hook — fully drawn from frame 0 (no entrances), only idle motion ===== */
export const ThumbnailScene: React.FC = () => {
  const { episode } = useScene();
  const frame = useCurrentFrame();
  const t = episode.thumbnail;
  const float = Math.sin(frame / 12) * 6;
  const [l1, l2] = t.lines;
  const idx = l2.indexOf(t.highlight);
  const parts = idx >= 0 ? [l2.slice(0, idx), t.highlight, l2.slice(idx + t.highlight.length)] : [l2, "", ""];
  const lineSize = fitFont(l1, 940, 70, 56, 1, 0.55);
  return (
    <SceneShell>
      <div style={{ position: "absolute", left: 60, right: 60, top: 120, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <SparkMark size={72} still />
          <div style={{ ...heroFont, fontSize: 48, letterSpacing: -0.5 }}>{episode.brandName}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 232, display: "flex", justifyContent: "center" }}>
        <Pill bg={C.accent} color={C.text} size={40} pad={36}>{t.seriesLine}</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", transform: `translateY(${float}px)` }}>
        <div style={{ ...heroFont, fontSize: 230, lineHeight: 1, color: C.white, background: C.primary, borderRadius: 56, padding: "6px 58px 18px", boxShadow: `0 18px 0 ${C.text}, 0 40px 70px -20px ${C.glow}` }}>
          DAY {episode.episodeNumber}
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, width: 1000, height: 620, borderRadius: 48, overflow: "hidden", boxShadow: `0 30px 70px -26px ${C.shadow}`, border: `6px solid ${C.white}` }}>
        <ThumbnailArt />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>
        <div style={{ fontSize: lineSize, color: C.text }}>{l1}</div>
        <div style={{ fontSize: lineSize, color: C.text, marginTop: 10 }}>
          {parts[0]}
          <span style={{ color: C.white, background: C.danger, borderRadius: 18, padding: "0 20px", marginLeft: 6 }}>{parts[1]}</span>
          {parts[2]}
        </div>
      </div>
    </SceneShell>
  );
};

/* ===== Intro scene 2: restaurant entrance -> food table ===== */
export const IntroEntranceScene: React.FC = () => {
  const { scene } = useScene();
  const frame = useCurrentFrame();
  const text = useSceneText();
  const t = clamp01(frame / scene.durationInFrames);
  return (
    <SceneShell>
      <BrandHeader />
      <Stack>
        <ArtFrame inline width={920} height={800}>
          <EntranceArt t={t} splitT={scene.cfg.splitAt ?? 0.42} />
        </ArtFrame>
        <Caption text={text} delay={8} />
      </Stack>
    </SceneShell>
  );
};

export const IntroWaiterScene: React.FC = () => {
  const text = useSceneText();
  return (
    <SceneShell>
      <BrandHeader />
      <Stack>
        <ArtFrame inline width={920} height={800}><WaiterArt /></ArtFrame>
        <Caption text={text} delay={8} />
      </Stack>
    </SceneShell>
  );
};

export const IntroPointingScene: React.FC = () => {
  const text = useSceneText();
  return (
    <SceneShell>
      <BrandHeader />
      <Stack>
        <ArtFrame inline width={920} height={800}><PointingArt /></ArtFrame>
        <Caption text={text} delay={8} />
      </Stack>
    </SceneShell>
  );
};

/* ===== Intro: brand ===== */
export const IntroBrandScene: React.FC = () => {
  const { episode } = useScene();
  const text = useSceneText();
  return (
    <SceneShell>
      <Stack gap={34}>
        <SparkMark size={380} delay={2} />
        <Entrance delay={12} y={50}><div style={{ ...heroFont, fontSize: 128 }}>{episode.brandName}</div></Entrance>
        <Entrance delay={20}><Pill bg={C.accent} color={C.text} size={38} pad={34}>{episode.seriesName}</Pill></Entrance>
        <Caption text={text} delay={28} />
      </Stack>
    </SceneShell>
  );
};

/* ===== Intro: episode title (day ring) ===== */
export const IntroEpisodeScene: React.FC = () => {
  const { episode } = useScene();
  const frame = useCurrentFrame();
  const text = useSceneText();
  const prog = interpolate(ramp(frame, 6, 56, theme.ease.out), [0, 1], [0, episode.episodeNumber / episode.totalDays]);
  const n = Math.round(interpolate(ramp(frame, 6, 50, theme.ease.out), [0, 1], [0, episode.episodeNumber]));
  const R = 220, circ = 2 * Math.PI * R;
  return (
    <SceneShell>
      <Stack gap={40}>
        <Entrance delay={0} preset="bouncy" scale={0.8}>
          <div style={{ position: "relative", width: 560, height: 560 }}>
            <svg width={560} height={560} viewBox="0 0 560 560" style={{ transform: "rotate(-90deg)" }}>
              <circle cx={280} cy={280} r={R} fill={C.white} stroke={`${C.primary}22`} strokeWidth={36} />
              <circle cx={280} cy={280} r={R} fill="none" stroke={C.primary} strokeWidth={36} strokeLinecap="round" strokeDasharray={`${circ * prog} ${circ}`} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ ...heroFont, fontSize: 56, color: C.textDim, letterSpacing: 6 }}>DAY</div>
              <div style={{ ...heroFont, fontSize: 240, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
              <div style={{ ...heroFont, fontSize: 40, color: C.textDim }}>/ {episode.totalDays}</div>
            </div>
          </div>
        </Entrance>
        <Entrance delay={14}><Pill bg={C.accent} color={C.text} size={38} pad={34}>{episode.seriesName}</Pill></Entrance>
        <Caption text={text} delay={22} />
      </Stack>
    </SceneShell>
  );
};

/* ===== Intro: topic + 10 sentence progress ===== */
export const IntroTopicScene: React.FC = () => {
  const { episode } = useScene();
  const frame = useCurrentFrame();
  const text = useSceneText();
  const count = episode.sentenceEnd - episode.sentenceStart + 1;
  const topicSize = fitFont(episode.topicBn, 900, 96, 70, 2);
  const pop = useSpring(0, "smooth");
  return (
    <SceneShell>
      <BrandHeader />
      <Stack gap={34}>
        <Entrance delay={2} y={50} style={{ textAlign: "center", width: 920 }}>
          <div style={{ fontSize: topicSize, fontWeight: 700, lineHeight: 1.2, color: C.text }}>{episode.topicBn}</div>
          <div style={{ ...heroFont, fontSize: 44, color: C.primary, marginTop: 12, letterSpacing: 0 }}>{episode.topic}</div>
        </Entrance>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 24, opacity: clamp01(pop) }}>
          {Array.from({ length: count }).map((_, i) => {
            const lit = ramp(frame, 18 + i * 7, 18 + i * 7 + 10);
            return (
              <div key={i} style={{ width: 150, height: 150, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", ...heroFont, fontSize: 48, letterSpacing: 0,
                background: lit > 0.5 ? C.primary : C.white, color: lit > 0.5 ? C.white : C.textDim, transform: `scale(${1 + 0.08 * Math.sin(lit * Math.PI)})`, boxShadow: `0 16px 30px -16px ${C.shadow}`, border: `3px solid ${C.primary}22` }}>
                {episode.sentenceStart + i}
              </div>
            );
          })}
        </div>
        <Caption text={text} delay={24} />
      </Stack>
    </SceneShell>
  );
};

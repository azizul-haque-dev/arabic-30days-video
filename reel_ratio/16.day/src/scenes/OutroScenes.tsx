import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progressOf } from "../config/episode";
import { useScene } from "../context";
import { BrandHeader, Caption, Card, Entrance, Pill, ProgressBar, SceneShell, SparkMark } from "../components/common";
import { FoodIcon, type IconKind } from "../illustrations/compositions";
import { clamp01, fitFont, ramp, useSpring } from "../utils/anim";
import { Stack, heroFont, useSceneText } from "./helpers";

const C = theme.colors;

const Check: React.FC<{ size: number; bg?: string }> = ({ size, bg = C.primary }) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><circle cx={20} cy={20} r={20} fill={bg} /><path d="M11 21 L18 28 L30 13" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ===== Outro 1: all 10 sentences done + progress + food selection ===== */
export const OutroSummaryScene: React.FC = () => {
  const { episode } = useScene();
  const frame = useCurrentFrame();
  const pct = progressOf(episode);
  const done = Math.round(interpolate(ramp(frame, 20, 70), [0, 1], [episode.previousCompletedSentences, episode.completedSentences]));
  const foods: IconKind[] = ["grilledChicken", "biryani", "meatKabsa", "fish", "orangeJuice", "water"];
  return (
    <SceneShell>
      <BrandHeader />
      <div style={{ position: "absolute", left: 0, right: 0, top: 225, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
        <Entrance delay={2} preset="bouncy" scale={0.7} style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Check size={92} />
          <div style={{ ...heroFont, fontSize: 96, color: C.primary }}>{episode.ctaText}</div>
        </Entrance>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 360, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {episode.sentences.map((s, i) => (
          <Entrance key={s.number} delay={8 + i * 4} y={24} preset="snappy">
            <Card style={{ height: 112, borderRadius: 28, display: "flex", alignItems: "center", gap: 14, padding: "0 18px" }}>
              <div style={{ ...heroFont, letterSpacing: 0, fontSize: 28, background: C.accent, color: C.text, borderRadius: 18, padding: "6px 12px", minWidth: 70, textAlign: "center" }}>{s.number}</div>
              <div style={{ flex: 1, fontSize: fitFont(s.pronunciation, 280, 34, 24, 2), fontWeight: 600, lineHeight: 1.2 }}>{s.pronunciation}</div>
              <Check size={34} />
            </Card>
          </Entrance>
        ))}
      </div>
      <Entrance delay={30} y={40} style={{ position: "absolute", left: 60, width: 960, top: 1040 }}>
        <Card style={{ padding: "26px 40px 34px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ ...heroFont, letterSpacing: 0, fontSize: 80, fontVariantNumeric: "tabular-nums" }}>{done} <span style={{ color: C.textDim, fontSize: 48 }}>/ {episode.totalSentences}</span></div>
            <div style={{ ...heroFont, letterSpacing: 0, fontSize: 64, color: C.primary, fontVariantNumeric: "tabular-nums" }}>{(pct * ramp(frame, 20, 70)).toFixed(2)}%</div>
          </div>
          <ProgressBar value={pct} delay={22} height={38} />
        </Card>
      </Entrance>
      <div style={{ position: "absolute", left: 60, width: 960, top: 1360, display: "flex", justifyContent: "space-between" }}>
        {foods.map((f, i) => (
          <Entrance key={f} delay={44 + i * 5} y={30} preset="bouncy" scale={0.6}>
            <div style={{ width: 150, height: 150, borderRadius: 40, background: C.white, boxShadow: `0 14px 28px -14px ${C.shadow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FoodIcon kind={f} size={136} />
            </div>
          </Entrance>
        ))}
      </div>
    </SceneShell>
  );
};

/* ===== Outro 2: comment CTA ===== */
export const OutroCommentScene: React.FC = () => {
  const text = useSceneText();
  const frame = useCurrentFrame();
  const bubble = useSpring(2, "bouncy");
  return (
    <SceneShell>
      <BrandHeader />
      <Stack>
        <div style={{ width: 760, height: 480, transform: `scale(${bubble})`, opacity: clamp01(bubble) }}>
          <svg viewBox="0 0 760 480" width={760} height={480}>
            <path d="M80 20 H680 Q740 20 740 80 V310 Q740 370 680 370 H330 L190 460 L220 370 H80 Q20 370 20 310 V80 Q20 20 80 20Z" fill={C.primary} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={270 + i * 110} cy={195 + Math.sin(frame / 5 - i * 1.2) * -14} r={30} fill={C.white} />
            ))}
            <circle cx={640} cy={70} r={38} fill={C.accent} />
            <path d="M640 92 C610 72 618 48 632 50 C638 51 640 58 640 58 C640 58 642 51 648 50 C662 48 670 72 640 92Z" fill={C.white} />
          </svg>
        </div>
        <Caption text={text} delay={10} />
      </Stack>
    </SceneShell>
  );
};

/* ===== Outro 3: grilled chicken vs meat kabsa ===== */
export const OutroCompareScene: React.FC = () => {
  const { scene } = useScene();
  const frame = useCurrentFrame();
  const labels = scene.cfg.compareLabels ?? ["", ""];
  const kinds: IconKind[] = ["grilledChicken", "meatKabsa"];
  const half = scene.durationInFrames / 2;
  return (
    <SceneShell>
      <BrandHeader />
      <Stack gap={0}>
        <div style={{ position: "relative", width: 960, height: 620, display: "flex", justifyContent: "space-between" }}>
          {kinds.map((k, i) => {
            const hi = i === 0 ? frame < half : frame >= half;
            const p = hi ? ramp(frame, i === 0 ? 0 : half, (i === 0 ? 0 : half) + 12) : 0;
            return (
              <Entrance key={k} delay={4 + i * 8} preset="bouncy" scale={0.8}>
                <Card style={{ width: 456, height: 620, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, border: `6px solid ${p > 0.4 ? C.accent : `${C.primary}22`}`, transform: `scale(${1 + 0.03 * p})` }}>
                  <FoodIcon kind={k} size={340} />
                  <div style={{ fontSize: fitFont(labels[i], 380, 58, 42, 2), fontWeight: 700, textAlign: "center", lineHeight: 1.2, padding: "0 20px" }}>{labels[i]}</div>
                </Card>
              </Entrance>
            );
          })}
          <div style={{ position: "absolute", left: 480 - 60, top: 310 - 60 }}>
            <Entrance delay={16} preset="bouncy" scale={0.4}>
              <div style={{ ...heroFont, width: 120, height: 120, borderRadius: 60, background: C.accent, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, boxShadow: `0 14px 30px -10px ${C.shadow}` }}>VS</div>
            </Entrance>
          </div>
        </div>
      </Stack>
    </SceneShell>
  );
};

/* ===== Outro 4: save + share ===== */
export const OutroSaveShareScene: React.FC = () => {
  const text = useSceneText();
  const frame = useCurrentFrame();
  const icons = [
    <svg key="b" viewBox="0 0 100 100" width={150} height={150}><path d="M28 12 H72 Q80 12 80 20 V90 L50 68 L20 90 V20 Q20 12 28 12Z" fill={C.white} /></svg>,
    <svg key="s" viewBox="0 0 100 100" width={150} height={150}><g stroke={C.white} strokeWidth={7} strokeLinecap="round"><line x1={30} y1={50} x2={70} y2={28} /><line x1={30} y1={50} x2={70} y2={72} /></g><g fill={C.white}><circle cx={26} cy={50} r={14} /><circle cx={74} cy={26} r={14} /><circle cx={74} cy={74} r={14} /></g></svg>,
  ];
  return (
    <SceneShell>
      <BrandHeader />
      <Stack gap={50}>
        <div style={{ display: "flex", gap: 60 }}>
          {icons.map((ic, i) => (
            <Entrance key={i} delay={2 + i * 8} preset="bouncy" scale={0.4}>
              <div style={{ width: 300, height: 300, borderRadius: 90, background: i ? C.accent : C.primary, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 30px 60px -22px ${C.glow}`, transform: `scale(${1 + Math.sin(frame / 10 - i * 1.6) * 0.04}) rotate(${Math.sin(frame / 14 - i) * 3}deg)` }}>{ic}</div>
            </Entrance>
          ))}
        </div>
        <Caption text={text} delay={14} />
      </Stack>
    </SceneShell>
  );
};

const ClickCursor: React.FC<{ size?: number }> = ({ size = 76 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35))" }}>
    <path
      d="M10 2a1.5 1.5 0 0 0-1.5 1.5v8.17l-1.63-1.63a1.5 1.5 0 1 0-2.12 2.12l4.8 4.8a6 6 0 0 0 4.24 1.76h2.46A4.75 4.75 0 0 0 21 14V9.5a1.5 1.5 0 0 0-3 0v.5h-.5a1.5 1.5 0 0 0-3 0V9a1.5 1.5 0 0 0-3 0v-1a1.5 1.5 0 0 0-3 0V3.5A1.5 1.5 0 0 0 10 2z"
      fill="#FFFFFF"
      stroke="#10231D"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </svg>
);

/* ===== Outro 5: follow ===== */
export const OutroFollowScene: React.FC = () => {
  const { episode } = useScene();
  const text = useSceneText();
  const frame = useCurrentFrame();

  const cursorIn = ramp(frame, 36, 56, theme.ease.out);
  const clickPress = frame >= 56 && frame <= 68 ? Math.sin(((frame - 56) / 12) * Math.PI) : 0;
  const isFollowed = frame >= 60;
  const cursorExit = ramp(frame, 84, 102, theme.ease.in);
  const cursorOpacity = Math.max(0, ramp(frame, 36, 44) * (1 - cursorExit));

  const cursorX = interpolate(cursorIn, [0, 1], [70, 20]);
  const cursorY = interpolate(cursorIn, [0, 1], [90, 20]) + cursorExit * 40;
  const cursorScale = (1 - clickPress * 0.18) * (1 + (1 - cursorIn) * 0.2);

  const buttonBounce = 1 - clickPress * 0.08;
  const idleScale = 1 + Math.sin(frame / 9) * 0.03;

  const rippleRamp = ramp(frame, 58, 78);
  const rippleScale = interpolate(rippleRamp, [0, 1], [0.5, 1.8]);
  const rippleOpacity = interpolate(rippleRamp, [0, 0.2, 1], [0, 0.7, 0]);

  return (
    <SceneShell>
      <Stack gap={40}>
        <SparkMark size={260} delay={0} />
        <Entrance delay={8}><div style={{ ...heroFont, fontSize: 104 }}>{episode.brandName}</div></Entrance>
        <Entrance delay={14} preset="bouncy" scale={0.6}>
          <div style={{ position: "relative", display: "inline-block" }}>
            {frame >= 58 && frame <= 78 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 999,
                  border: `4px solid ${C.accent}`,
                  transform: `scale(${rippleScale})`,
                  opacity: rippleOpacity,
                  pointerEvents: "none",
                }}
              />
            )}
            <Pill
              bg={isFollowed ? "#0B8258" : C.primary}
              size={60}
              pad={70}
              style={{
                transform: `scale(${idleScale * buttonBounce})`,
                boxShadow: isFollowed ? `0 14px 40px -10px ${C.primary}` : `0 20px 50px -14px ${C.glow}`,
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {isFollowed ? (
                <>
                  <span>FOLLOWED</span>
                  <svg width={42} height={42} viewBox="0 0 32 32">
                    <circle cx={16} cy={16} r={14} fill={C.white} />
                    <path d="M9 16.5 L14 21.5 L23 11" fill="none" stroke="#0B8258" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              ) : (
                "FOLLOW"
              )}
            </Pill>
            <div
              style={{
                position: "absolute",
                right: 30,
                bottom: -15,
                transform: `translate(${cursorX}px, ${cursorY}px) scale(${cursorScale})`,
                opacity: cursorOpacity,
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <ClickCursor size={76} />
            </div>
          </div>
        </Entrance>
        <Caption text={text} delay={20} />
      </Stack>
    </SceneShell>
  );
};

/* ===== Outro 6: next episode ===== */
export const OutroNextScene: React.FC = () => {
  const { episode } = useScene();
  const text = useSceneText();
  const frame = useCurrentFrame();
  const slide = Math.sin(frame / 8) * 10;
  return (
    <SceneShell>
      <BrandHeader />
      <Stack gap={44}>
        <Entrance delay={2} preset="bouncy" scale={0.7}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ ...heroFont, fontSize: 250, lineHeight: 1, color: C.white, background: C.primary, borderRadius: 64, padding: "10px 60px 24px", boxShadow: `0 20px 0 ${C.text}` }}>DAY {episode.nextEpisodeNumber}</div>
            <svg width={110} height={110} viewBox="0 0 100 100" style={{ transform: `translateX(${slide}px)` }}><path d="M25 20 L70 50 L25 80Z" fill={C.accent} /></svg>
          </div>
        </Entrance>
        <Caption text={text} delay={12} />
      </Stack>
    </SceneShell>
  );
};

/* ===== Outro 7: goodbye ===== */
export const OutroGoodbyeScene: React.FC = () => {
  const { episode } = useScene();
  const text = useSceneText();
  return (
    <SceneShell>
      <Stack gap={44}>
        <SparkMark size={300} delay={0} />
        <Entrance delay={4} y={50} preset="bouncy" scale={0.8}>
          <div style={{ fontSize: fitFont(text, 900, 128, 80, 1), fontWeight: 700, textAlign: "center", color: C.primary }}>{text}</div>
        </Entrance>
        <Entrance delay={10}><div style={{ ...heroFont, fontSize: 56 }}>{episode.brandName}</div></Entrance>
      </Stack>
    </SceneShell>
  );
};

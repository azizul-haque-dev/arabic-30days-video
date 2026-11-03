import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";
import { SENTENCES } from "../content";
import { Entrance, SceneExit, Pill, Card, WordReveal, clamp } from "../components/kit";
import { Icon } from "../components/Icons";
import { Sfx } from "../components/Sfx";

const C = theme.colors;
const txt = (size: number, weight: number = theme.weights.hero, color: string = C.text): React.CSSProperties => ({
  fontFamily: theme.fonts.display,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.14,
  letterSpacing: 0,
});

export const RecapScene: React.FC = () => {
  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "48px 56px",
          fontFamily: theme.fonts.display,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Pill text="এক নজরে ১০টি বাক্য" tone="accent" style={{ marginBottom: 12, fontSize: 24, padding: "8px 26px" }} />
          <h2
            style={{
              fontSize: 50,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            আজকের রিভিশন গ্রিড
          </h2>
        </div>

        {/* 10-Item Recap Grid adhering strictly to Rule #9 invariant */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 20,
            rowGap: 18,
            flex: 1,
          }}
        >
          {SENTENCES.map((s, i) => (
            <Entrance key={s.num} delay={i * 3} preset="snappy">
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 252, 250, 0.92) 100%)",
                  borderRadius: 30,
                  padding: "24px 26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1.5px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 8px 24px rgba(16, 35, 29, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 56,
                      height: 44,
                      borderRadius: theme.radius.pill,
                      background: theme.gradients.primarySoft,
                      color: theme.colors.primaryDeep,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: theme.weights.hero,
                      fontSize: 24,
                      boxShadow: "0 2px 8px rgba(14, 159, 110, 0.15)",
                    }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: theme.weights.hero,
                        color: theme.colors.text,
                        lineHeight: 1.2,
                      }}
                    >
                      {s.translit}
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        color: theme.colors.textDim,
                        fontWeight: theme.weights.strong,
                        marginTop: 2,
                      }}
                    >
                      {s.meaning}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: theme.gradients.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontWeight: 800,
                    boxShadow: "0 2px 8px rgba(14, 159, 110, 0.3)",
                  }}
                >
                  ✓
                </div>
              </div>
            </Entrance>
          ))}
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

/* ───── Follow + comment CTA — VO-synced (scene starts 107.2s) ─────
   Phase A: page card → cursor glides in → clicks "Follow" on "follow করুন"
   Phase B: card lifts, comment composer slides up → types "DAY 14 DONE!" → send → hearts */
const sec = (s: number, fps: number) => Math.round(s * fps);

const Cursor: React.FC<{ x: number; y: number; opacity: number; pressed: boolean }> = ({ x, y, opacity, pressed }) => (
  <svg
    viewBox="0 0 24 24"
    width={70}
    height={70}
    style={{
      position: "absolute",
      left: `calc(50% + ${x - 13}px)`,
      top: `calc(50% + ${y - 8}px)`,
      opacity,
      transform: `scale(${pressed ? 0.86 : 1})`,
      transformOrigin: "18% 12%",
      filter: `drop-shadow(0 8px 10px ${C.shadow})`,
      zIndex: 5,
      pointerEvents: "none",
    }}
  >
    <path d="M5 3 L19 12 L12 13.5 L9 20 Z" fill={C.text} stroke={C.white} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const Heart: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 21 C5 15.5 2 12.4 2 8.6 C2 5.6 4.4 3.4 7.2 3.4 C9.2 3.4 10.9 4.6 12 6.2 C13.1 4.6 14.8 3.4 16.8 3.4 C19.6 3.4 22 5.6 22 8.6 C22 12.4 19 15.5 12 21 Z" fill={color} />
  </svg>
);

export const FollowScene: React.FC<{ dur?: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sceneDur = dur ?? durationInFrames;
  const sp = (at: number, config: { damping: number; stiffness: number; mass: number } = theme.spring.snappy) =>
    spring({ frame: frame - at, fps, config });
  const ease = (input: number[], output: number[]) => interpolate(frame, input, output, { ...clamp, easing: theme.ease.out });

  /* VO beats (local frames) */
  const KICK = sec(1.65, fps);      // "প্রতিদিন নতুন আরবি বাক্য শিখতে"
  const CLICK = sec(4.75, fps);     // "follow করুন"
  const PHASE_B = sec(6.0, fps);    // "comment-এ লিখুন"
  const FOCUS = PHASE_B + 16;
  const TYPE = FOCUS + 10;          // "Day 14 Done"
  const label = "DAY 14 DONE!";
  const PER = 2;
  const TYPE_END = TYPE + Math.ceil(label.length * PER);
  const SEND = TYPE_END + 6;

  /* ── Phase A: page card ── */
  const clicked = frame >= CLICK;
  const lift = sp(PHASE_B, theme.spring.smooth);
  const cardY = interpolate(lift, [0, 1], [110, 0]);
  const breathe = Math.sin(frame / 22) * 4;
  const ringRot = frame * 1.6;

  const attention = interpolate(frame, [KICK, KICK + 20], [0, 1], clamp) * (clicked ? 0 : 1);
  const pressDown = interpolate(frame, [CLICK - 4, CLICK], [1, 0.9], { ...clamp, easing: theme.ease.in });
  const release = sp(CLICK, theme.spring.bouncy);
  const btnScale = clicked
    ? interpolate(release, [0, 1], [0.9, 1])
    : pressDown * (1 + Math.sin(frame / 6) * 0.025 * attention);
  const pulse = ((frame - KICK) % 32) / 32;
  const burst = ease([CLICK, CLICK + 24], [0, 1]);

  // follow cursor: glides in from lower-right, lands on button at CLICK
  const fcIn = CLICK - 34;
  const fcX = ease([fcIn, CLICK - 4], [230, 40]);
  const fcY = ease([fcIn, CLICK - 4], [190, 14]);
  const fcO = interpolate(frame, [fcIn, fcIn + 8, CLICK + 10, CLICK + 18], [0, 1, 1, 0], clamp);

  /* ── Phase B: comment composer ── */
  const focused = frame >= FOCUS;
  const ccX = ease([PHASE_B + 2, FOCUS - 2], [260, 60]);
  const ccY = ease([PHASE_B + 2, FOCUS - 2], [150, 18]);
  const ccO = interpolate(frame, [PHASE_B + 2, PHASE_B + 8, FOCUS + 6, FOCUS + 12], [0, 1, 1, 0], clamp);
  const n = Math.max(0, Math.min(label.length, Math.floor((frame - TYPE) / PER)));
  const caretOn = n < label.length ? true : Math.floor(frame / 10) % 2 === 0;
  const sendPress = frame >= SEND - 3 && frame < SEND + 3 ? 0.88 : 1;
  const sent = sp(SEND, theme.spring.bouncy);
  const doneP = sp(SEND + 2, theme.spring.bouncy);

  return (
    <SceneExit dur={sceneDur}>
      {/* SFX — 2–3 frames ahead of each visual hit */}
      <Sfx name="pop" at={6} />
      <Sfx name="pop" at={KICK - 2} volume={0.18} />
      <Sfx name="click" at={CLICK - 2} />
      <Sfx name="chime" at={CLICK + 2} rate={1.2} volume={0.22} />
      <Sfx name="whoosh" at={PHASE_B - 4} volume={0.16} />
      <Sfx name="click" at={FOCUS - 2} volume={0.2} rate={1.1} />
      {label.split("").map((ch, i) =>
        ch === " " ? null : <Sfx key={i} name="click" at={TYPE + Math.round(i * PER)} volume={0.11} rate={1.3 + (i % 3) * 0.08} />
      )}
      <Sfx name="click" at={SEND - 3} />
      <Sfx name="chime" at={SEND + 1} rate={1.1} />

      {/* Header */}
      <div style={{ position: "absolute", top: 70, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <WordReveal text="প্রতিদিন নতুন আরবি বাক্য শিখতে" delay={KICK} per={4} gap={14} style={txt(40, theme.weights.strong, C.textDim)} />
        <WordReveal text="follow করুন" delay={4} per={6} gap={24} style={txt(96)} wordStyle={(i) => (i === 0 ? { color: C.primary } : {})} />
      </div>

      {/* Page card */}
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${cardY + breathe}px)` }}>
        <Entrance delay={10} from={60} scaleFrom={0.9} config={theme.spring.smooth}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "40px 56px 40px 44px",
              borderRadius: 56,
              background: theme.gradients.surface,
              border: `1.5px solid ${C.lineLight}`,
              boxShadow: theme.shadow.card,
            }}
          >
            {/* Avatar with rotating brand ring */}
            <div style={{ position: "relative", width: 184, height: 184, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${ringRot}deg, ${C.primary}, ${C.accent}, ${C.primary})` }} />
              <div style={{ position: "absolute", inset: 7, borderRadius: "50%", background: C.white }} />
              <div
                style={{
                  position: "absolute",
                  inset: 15,
                  borderRadius: "50%",
                  background: theme.gradients.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontFamily: theme.fonts.display,
                  fontWeight: 700,
                  fontSize: 64,
                  lineHeight: 1,
                  paddingTop: 6,
                }}
              >
                AM
              </div>
              {/* verified badge pops on follow */}
              <div
                style={{
                  position: "absolute",
                  right: 2,
                  bottom: 6,
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  background: C.accent,
                  border: `5px solid ${C.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${interpolate(release, [0, 1], [0, 1]) * (clicked ? 1 : 0)})`,
                }}
              >
                <svg viewBox="0 0 24 24" width={26} height={26}>
                  <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.white} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Name + meta + button */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={txt(60)}>Arabic Master</div>
              <div style={{ ...txt(30, theme.weights.strong, C.textDim), marginBottom: 18 }}>
                ৩০ দিনে Survival Arabic · Day ১৪
              </div>

              <div style={{ position: "relative", width: 330, height: 92 }}>
                {/* attention pulse ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 92,
                    border: `3px solid ${C.primary}`,
                    opacity: (1 - pulse) * 0.55 * attention,
                    transform: `scale(${1 + pulse * 0.22})`,
                  }}
                />
                {/* click burst */}
                {clicked &&
                  Array.from({ length: 10 }).map((_, i) => {
                    const a = (i / 10) * Math.PI * 2;
                    const d = 60 + burst * 130;
                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: i % 2 ? 12 : 16,
                          height: i % 2 ? 12 : 16,
                          borderRadius: 16,
                          background: i % 2 ? C.accent : C.primary,
                          transform: `translate(-50%, -50%) translate(${Math.cos(a) * d * 1.4}px, ${Math.sin(a) * d * 0.7}px) scale(${1 - burst * 0.6})`,
                          opacity: 1 - burst,
                        }}
                      />
                    );
                  })}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    borderRadius: 92,
                    background: clicked ? C.surface : theme.gradients.primary,
                    border: clicked ? `3px solid ${C.primary}` : "3px solid transparent",
                    boxShadow: clicked ? theme.shadow.soft : theme.shadow.hero,
                    transform: `scale(${btnScale})`,
                    ...txt(44, theme.weights.hero, clicked ? C.primaryDeep : C.white),
                  }}
                >
                  {clicked ? (
                    <svg viewBox="0 0 24 24" width={42} height={42}>
                      <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.primary} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width={38} height={38}>
                      <path d="M12 4 V20 M4 12 H20" stroke={C.white} strokeWidth={3.6} strokeLinecap="round" />
                    </svg>
                  )}
                  <span>{clicked ? "Following" : "Follow"}</span>
                </div>
                <Cursor x={fcX} y={fcY} opacity={fcO} pressed={frame >= CLICK - 4 && frame < CLICK + 4} />
              </div>
            </div>
          </div>
        </Entrance>
      </div>

      {/* Comment label */}
      <div style={{ position: "absolute", top: 615, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={PHASE_B} from={30} config={theme.spring.bouncy}>
          <Pill tone="accent" size={44}>কমেন্টে লিখুন</Pill>
        </Entrance>
      </div>

      {/* Comment composer */}
      <div style={{ position: "absolute", top: 765, left: 90, right: 90 }}>
        <Entrance delay={PHASE_B + 6} from={60} config={theme.spring.snappy}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "24px 26px",
              borderRadius: 64,
              background: C.surface,
              border: `3px solid ${focused ? C.primary : C.line}`,
              boxShadow: focused ? `${theme.shadow.card}, 0 0 0 10px ${C.primarySoft}` : theme.shadow.card,
            }}
          >
            {/* user avatar */}
            <div style={{ width: 84, height: 84, borderRadius: 84, background: C.accentSoft, flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 27, top: 15, width: 30, height: 30, borderRadius: 30, background: C.accent }} />
              <div style={{ position: "absolute", left: 12, top: 52, width: 60, height: 50, borderRadius: 30, background: C.accent }} />
            </div>

            {/* input field */}
            <div style={{ position: "relative", flex: 1, height: 112, borderRadius: 56, background: C.bg, display: "flex", alignItems: "center", padding: "0 30px" }}>
              {n === 0 && !focused && <div style={txt(34, theme.weights.body, C.textDim)}>একটি কমেন্ট লিখুন…</div>}
              <div style={{ ...txt(66, theme.weights.hero, C.text), whiteSpace: "pre", fontVariantNumeric: "tabular-nums" }}>{label.slice(0, n)}</div>
              {focused && <div style={{ width: 6, height: 70, borderRadius: 3, background: C.primary, opacity: caretOn ? 1 : 0, marginLeft: 6 }} />}
              <Cursor x={ccX} y={ccY} opacity={ccO} pressed={frame >= FOCUS - 3 && frame < FOCUS + 3} />
            </div>

            {/* send button + hearts */}
            <div style={{ position: "relative", width: 104, height: 104, flexShrink: 0 }}>
              {frame >= SEND &&
                Array.from({ length: 6 }).map((_, i) => {
                  const t = interpolate(frame, [SEND + i * 1.5, SEND + i * 1.5 + 22], [0, 1], { ...clamp, easing: theme.ease.out });
                  const x = Math.sin(i * 1.9) * 50 + (i - 2.5) * 14;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 28,
                        top: 20,
                        transform: `translate(${x * t}px, ${-t * 170}px) scale(${interpolate(t, [0, 0.3, 1], [0.3, 1.1, 0.8])}) rotate(${(i - 2.5) * 8 * t}deg)`,
                        opacity: interpolate(t, [0, 0.12, 0.75, 1], [0, 1, 1, 0]),
                      }}
                    >
                      <Heart size={i % 2 ? 40 : 52} color={i % 3 === 0 ? C.accent : C.primary} />
                    </div>
                  );
                })}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 104,
                  background: n === label.length ? theme.gradients.primary : C.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: n === label.length ? theme.shadow.hero : "none",
                  transform: `scale(${sendPress * (frame >= SEND ? interpolate(sent, [0, 1], [0.88, 1]) : 1)})`,
                }}
              >
                <svg viewBox="0 0 24 24" width={48} height={48}>
                  <path d="M4 12 L20 4 L14 20 L11 13 Z" fill={C.white} stroke={C.white} strokeWidth={1.6} strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* posted badge */}
            <div
              style={{
                position: "absolute",
                right: -18,
                top: -34,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px 10px 12px",
                borderRadius: 60,
                background: C.accent,
                boxShadow: theme.shadow.soft,
                transform: `scale(${interpolate(doneP, [0, 1], [0, 1])})`,
                transformOrigin: "80% 50%",
                ...txt(30, theme.weights.hero, C.text),
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 40, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" width={26} height={26}>
                  <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.text} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              পোস্ট হয়েছে
            </div>
          </div>
        </Entrance>
      </div>
    </SceneExit>
  );
};

export const CtaScene = FollowScene;

export const EndScene: React.FC = () => {
  return (
    <SceneExit>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          textAlign: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={8}>
          <div
            style={{
              fontSize: 56,
              fontWeight: theme.weights.hero,
              color: theme.colors.primary,
              marginBottom: 22,
              letterSpacing: "0.01em",
            }}
          >
            দেখা হবে Day 15-তে
          </div>
        </Entrance>

        <Entrance delay={24} preset="bouncy">
          <div
            style={{
              fontSize: 78,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              letterSpacing: "-0.02em",
            }}
          >
            ইনশাআল্লাহ!
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

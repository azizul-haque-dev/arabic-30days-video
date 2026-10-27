import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { cueStart, markerAt, toFrame } from "../timing";
import { rel } from "../content";
import { bn, GlassCard, HeroCard, Icon, Pop, Tag, Words, useBreathe } from "../components/kit";

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ───────── 1. HOOK — kinetic typography ───────── */
export const Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const r = (s: number) => rel(from, s);
  const tLine = r(cueStart(1));
  const tA = r(markerAt(1, "আনা"));
  const tB = r(markerAt(1, "ইশারে"));
  const tC = r(markerAt(1, "কাজ"));
  const tEnd = r(markerAt(1, "আর কত"));
  const wobA = Math.sin(frame / 7) * 2.2;
  const wobB = Math.sin(frame / 6 + 1) * 2.6;
  const giveUp = interpolate(frame, [tEnd, tEnd + 14], [0, 1], { ...clampOpt, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 84, gap: 12 }}>
      <Pop at={3} dir="down" dist={30}>
        <Tag tone="soft" size={34}>Survival Arabic · Day 3</Tag>
      </Pop>
      <Words text="আরবিতে শুধু" at={tLine} size={84} align="center" style={{ marginTop: 14 }} />
      <div style={{ transform: `translateY(${giveUp * 8}px) scale(${1 - giveUp * 0.1})`, opacity: 1 - giveUp * 0.35 }}>
        <Pop at={tA} dir="scale" cfg="bouncy">
          <HeroCard style={{ padding: "6px 56px 14px", borderRadius: 90, transform: `rotate(${wobA - 2}deg)` }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 104, color: theme.colors.onPrimary, letterSpacing: 0, lineHeight: 1.3 }}>
              আনা-ইনতা
            </span>
          </HeroCard>
        </Pop>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `translateY(${giveUp * 8}px) scale(${1 - giveUp * 0.1})`, opacity: 1 - giveUp * 0.35 }}>
        <Words text="আর" at={tB - 4} size={60} color={theme.colors.textDim} />
        <Pop at={tB} dir="scale" cfg="bouncy">
          <div style={{
            padding: "6px 52px 14px", borderRadius: 90, background: theme.colors.accent,
            boxShadow: theme.shadow.soft, transform: `rotate(${-wobB + 2}deg)`,
          }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 104, color: theme.colors.text, letterSpacing: 0, lineHeight: 1.3 }}>
              ইশারায়
            </span>
          </div>
        </Pop>
      </div>
      <Words text="কাজ চালাচ্ছেন?" at={tC} size={62} color={theme.colors.textDim} align="center" />
      <Pop at={tEnd} dir="scale" cfg="bouncy" style={{ marginTop: 2 }}>
        <span style={{
          display: "inline-block", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 178,
          color: theme.colors.primary, letterSpacing: 0, lineHeight: 1.2,
          textShadow: `0 0 60px ${theme.colors.glow}`,
          transform: `rotate(${interpolate(giveUp, [0, 1], [-4, 0])}deg)`,
        }}>
          আর কত!
        </span>
      </Pop>
    </div>
  );
};

/* ───────── 2. PROMISE — ১০টি জাদুকরী বাক্য ───────── */
const Spark: React.FC<{ x: number; y: number; at: number; size: number }> = ({ x, y, at, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  const o = interpolate(frame, [at, at + 6, at + 50, at + 66], [0, 1, 1, 0], clampOpt);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40"
      style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${p}) rotate(${(frame - at) * 2}deg)` }}>
      <path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill={theme.colors.accent} />
    </svg>
  );
};

export const PromiseScene: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = (s: number) => rel(from, s);
  const t1 = r(cueStart(2));
  const tWords = r(markerAt(2, "জাদুকরী"));
  const t3 = r(cueStart(3));
  const burst = spring({ frame: frame - t3, fps, config: theme.spring.bouncy });
  const count = Math.round(
    interpolate(spring({ frame: frame - t1 - 4, fps, config: { damping: 30, stiffness: 70, mass: 1 } }), [0, 1], [0, 10]),
  );
  const br = useBreathe(24, 0.012, 5);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* fan of ten cards */}
      <div style={{ position: "absolute", left: 540, top: 620, width: 0, height: 0, transform: `translateY(${br.y}px)` }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const p = spring({ frame: frame - t1 - i * 3, fps, config: theme.spring.bouncy });
          const spread = interpolate(burst, [0, 1], [7.2, 9.6]);
          const ang = (i - 4.5) * spread;
          const lift = interpolate(burst, [0, 1], [0, 18]);
          return (
            <div key={i} style={{
              position: "absolute", left: -95, top: -270 - lift * Math.abs(i - 4.5) * 0.1, width: 190, height: 270,
              transformOrigin: "50% 640px", opacity: interpolate(p, [0, 0.5], [0, 1], clampOpt),
              transform: `rotate(${ang * p}deg) translateY(${interpolate(p, [0, 1], [90, 0])}px)`,
              borderRadius: 28, background: i % 2 ? theme.colors.card : theme.colors.primarySoft,
              border: `2px solid ${theme.colors.line}`, boxShadow: theme.shadow.soft,
            }}>
              <div style={{ margin: "30px auto 0", width: 64, height: 64, borderRadius: 32, background: i === 4 ? theme.colors.accent : theme.colors.primary, opacity: i === 4 ? 1 : 0.85 }} />
              <div style={{ margin: "26px auto 0", width: 110, height: 14, borderRadius: 7, background: theme.colors.line }} />
              <div style={{ margin: "14px auto 0", width: 80, height: 14, borderRadius: 7, background: theme.colors.line }} />
            </div>
          );
        })}
      </div>
      {/* counter */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", transform: `scale(${br.scale})` }}>
        <Pop at={t1 + 2} dir="scale" cfg="bouncy">
          <span style={{
            fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 330, lineHeight: 1.1, letterSpacing: 0,
            color: theme.colors.primary, fontVariantNumeric: "tabular-nums", WebkitTextStroke: `14px ${theme.colors.card}`, paintOrder: "stroke fill",
          }}>
            {bn(count)}
          </span>
        </Pop>
      </div>
      <Spark x={150} y={170} at={t3} size={64} />
      <Spark x={850} y={150} at={t3 + 4} size={80} />
      <Spark x={110} y={470} at={t3 + 8} size={48} />
      <Spark x={900} y={450} at={t3 + 12} size={56} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 790, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Words text="জাদুকরী আরবি বাক্য" at={tWords} size={84} align="center" accent={[0]} />
        <Words text="আরবরা চমকে যাবে!" at={t3} size={78} align="center" color={theme.colors.textDim} accent={[1]} accentColor={theme.colors.accent} />
      </div>
    </div>
  );
};

/* ───────── 3. CHALLENGE — dashboard of script numbers ───────── */
const Stat: React.FC<{ at: number; target: number; label: string; sub?: string }> = ({ at, target, label, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = Math.round(
    interpolate(spring({ frame: frame - at - 4, fps, config: { damping: 30, stiffness: 60, mass: 1 } }), [0, 1], [0, target]),
  );
  return (
    <Pop at={at} dir="up" style={{ flex: 1 }}>
      <GlassCard style={{ padding: "22px 30px 26px", textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, lineHeight: 1.12, letterSpacing: 0, color: theme.colors.primary, fontVariantNumeric: "tabular-nums", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 128 }}>{bn(v)}</span>
          <span style={{ fontSize: 66, color: theme.colors.text }}>{label}</span>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 34, color: theme.colors.textDim, letterSpacing: 0 }}>{sub ?? "\u00A0"}</div>
      </GlassCard>
    </Pop>
  );
};

export const Challenge: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = (s: number) => rel(from, s);
  const t4 = r(cueStart(4));
  const tDay = r(markerAt(4, "Day"));
  const tReady = r(cueStart(5));
  const tGo = r(cueStart(6));
  const dash = interpolate(frame, [tReady - 8, tReady - 1], [1, 0], { ...clampOpt, easing: theme.ease.in });
  const dashY = interpolate(frame, [tReady - 8, tReady - 1], [0, -30], { ...clampOpt, easing: theme.ease.in });
  const pulse = 1 + Math.sin(frame / 6) * 0.06;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, opacity: dash, transform: `translateY(${dashY}px)` }}>
        <div style={{ position: "absolute", left: 64, right: 64, top: 90 }}>
          <Words text="Survival Arabic চ্যালেঞ্জ" at={t4} size={72} align="center" accent={[0, 1]} />
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 230, display: "flex", gap: 28 }}>
          <Stat at={t4 + 6} target={30} label="দিনে" sub="চ্যালেঞ্জ" />
          <Stat at={t4 + 12} target={300} label="টি" sub="Survival Arabic" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 64px)", gap: 12 }}>
            {Array.from({ length: 30 }).map((_, i) => {
              const p = spring({ frame: frame - t4 - 24 - i * 1.5, fps, config: theme.spring.snappy });
              const today = i === 2;
              const done = i < 2;
              return (
                <div key={i} style={{
                  width: 64, height: 64, borderRadius: 18, opacity: interpolate(p, [0, 0.6], [0, 1], clampOpt),
                  transform: `scale(${interpolate(p, [0, 1], [0.5, 1]) * (today ? pulse : 1)})`,
                  background: today ? theme.colors.accent : done ? theme.colors.primary : theme.colors.card,
                  border: `2px solid ${today ? theme.colors.accent : done ? theme.colors.primary : theme.colors.line}`,
                  boxShadow: today ? `0 10px 24px -8px ${theme.colors.accent}` : "none",
                }} />
              );
            })}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 840, display: "flex", justifyContent: "center" }}>
          <Pop at={tDay} dir="scale" cfg="bouncy">
            <HeroCard style={{ padding: "4px 70px 12px", borderRadius: 80 }}>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 132, color: theme.colors.onPrimary, letterSpacing: 0, lineHeight: 1.2 }}>Day 3</span>
            </HeroCard>
          </Pop>
        </div>
      </div>
      {/* phase 2 */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <Pop at={tReady} dir="scale" cfg="bouncy">
          <HeroCard style={{ padding: "6px 60px 20px", borderRadius: 110 }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 136, color: theme.colors.onPrimary, letterSpacing: 0, lineHeight: 1.25, whiteSpace: "nowrap" }}>Ready তো?</span>
          </HeroCard>
        </Pop>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Pop at={tGo} dir="scale" cfg="bouncy">
            <div style={{ width: 112, height: 112, borderRadius: 56, background: theme.colors.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadow.soft }}>
              <svg width={48} height={48} viewBox="0 0 40 40"><path d="M10 5 L34 20 L10 35 Z" fill={theme.colors.text} /></svg>
            </div>
          </Pop>
          <Words text="চলুন, শুরু করা যাক!" at={tGo} size={68} />
        </div>
      </div>
    </div>
  );
};

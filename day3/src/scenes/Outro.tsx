import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { cueStart, markerAt } from "../timing";
import { rel, sentences } from "../content";
import { bn, GlassCard, HeroCard, Icon, Pop, Tag, Tick, Words, useBreathe } from "../components/kit";

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ───────── Recap — checklist grid ───────── */
export const Recap: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = rel(from, cueStart(48));
  const stagger = Math.max(8, Math.min(14, Math.floor((dur - 70) / 10)));
  const rays = Array.from({ length: 12 });
  const burst = spring({ frame: frame - t0, fps, config: theme.spring.bouncy });
  const burstO = interpolate(frame, [t0, t0 + 6, t0 + 26], [0, 1, 0], clampOpt);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 64, top: 36, display: "flex", alignItems: "center", gap: 34 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 100, top: 80, opacity: burstO }}>
            {rays.map((_, i) => (
              <div key={i} style={{ position: "absolute", width: 10, height: 70 * burst, borderRadius: 10, background: theme.colors.accent, transformOrigin: "50% 0%", transform: `translateX(-50%) rotate(${i * 30}deg) translateY(${86}px)` }} />
            ))}
          </div>
          <Pop at={t0} dir="scale" cfg="bouncy">
            <span style={{ display: "inline-block", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 132, color: theme.colors.primary, letterSpacing: 0, lineHeight: 1.2, textShadow: `0 0 50px ${theme.colors.glow}` }}>বুম!</span>
          </Pop>
        </div>
        <div style={{ width: 600 }}>
          <Words text="১০টি খাঁটি আরবি বাক্য আপনার পকেটে!" at={t0 + 8} size={52} lineHeight={1.25} accent={[0]} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 64, right: 64, top: 236, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {sentences.map((s, i) => {
          const at = t0 + 30 + i * stagger;
          return (
            <Pop key={s.n} at={at} dir={i % 2 ? "right" : "left"} dist={40} cfg="snappy">
              <GlassCard style={{ height: 148, boxSizing: "border-box", padding: "0 22px 0 20px", display: "flex", alignItems: "center", gap: 14, borderRadius: 32 }}>
                <div style={{ flex: "0 0 62px", height: 62, borderRadius: 31, background: theme.colors.primarySoft, color: theme.colors.primaryDark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, lineHeight: 1, paddingBottom: 4, letterSpacing: 0 }}>
                  {bn(s.n)}
                </div>
                <div style={{ flex: 1, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: s.phrase.length > 20 ? 31 : 36, lineHeight: 1.25, letterSpacing: 0, color: theme.colors.text }}>
                  {s.phrase}
                </div>
                <Tick at={at + 8} size={40} />
              </GlassCard>
            </Pop>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Follow — glossy UI mockup ───────── */
export const Follow: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tClick = rel(from, markerAt(49, "Follow"));
  const press = spring({ frame: frame - tClick, fps, config: theme.spring.bouncy });
  const done = frame >= tClick + 2;
  const br = useBreathe(26, 0.008, 4);
  const cx = interpolate(frame, [tClick - 40, tClick - 2], [250, 0], { ...clampOpt, easing: theme.ease.out });
  const cy = interpolate(frame, [tClick - 40, tClick - 2], [210, 0], { ...clampOpt, easing: theme.ease.out });
  const co = interpolate(frame, [tClick - 40, tClick - 30], [0, 1], clampOpt);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 230, gap: 90 }}>
      <Words text="হাসতে হাসতে আরবি শিখতে" at={0} size={68} align="center" accent={[3]} style={{ maxWidth: 900 }} />
      <Pop at={10} dir="up" cfg="bouncy" style={{ transform: `translateY(${br.y}px)` }}>
        <GlassCard style={{ width: 860, padding: "44px 48px 48px", borderRadius: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: `linear-gradient(145deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadow.hero }}>
              <Icon kind="chat" size={92} stroke={theme.colors.onPrimary} fill={theme.colors.accent} />
            </div>
            <div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 60, lineHeight: 1.2, letterSpacing: 0 }}>Survival Arabic</div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 38, color: theme.colors.textDim, letterSpacing: 0 }}>৩০ দিনের চ্যালেঞ্জ · Day 3</div>
            </div>
          </div>
          <div style={{ position: "relative", marginTop: 44 }}>
            <div style={{
              height: 118, borderRadius: 59, display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
              background: done ? theme.colors.primarySoft : theme.colors.primary,
              border: `3px solid ${theme.colors.primary}`,
              color: done ? theme.colors.primaryDark : theme.colors.onPrimary,
              fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 58, letterSpacing: 0,
              transform: `scale(${done ? 1 + (1 - press) * -0.06 : 1})`, boxShadow: done ? "none" : theme.shadow.hero,
            }}>
              {done && <Tick at={tClick + 2} size={50} />}
              <span style={{ lineHeight: 1.2, paddingBottom: 6 }}>{done ? "Following" : "Follow"}</span>
            </div>
            <svg width={72} height={72} viewBox="0 0 40 40" style={{ position: "absolute", left: "58%", top: "46%", opacity: co, transform: `translate(${cx}px, ${cy}px) scale(${done ? 1 - (1 - press) * 0.12 : 1})`, filter: `drop-shadow(0 6px 8px ${theme.colors.shadow})` }}>
              <path d="M8 4 L8 31 L15 25 L20 36 L25 34 L20 23 L29 23 Z" fill={theme.colors.text} stroke={theme.colors.card} strokeWidth={2} strokeLinejoin="round" />
            </svg>
          </div>
        </GlassCard>
      </Pop>
    </div>
  );
};

/* ───────── Comment — typewriter in chat/input UI ───────── */
export const Comment: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const tType = rel(from, markerAt(50, "Day"));
  const text = "DAY 3 DONE!";
  const per = 3;
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - tType) / per)));
  const typedDone = n >= text.length;
  const tSend = tType + text.length * per + 8;
  const sent = spring({ frame: frame - tSend, fps: 30, config: theme.spring.bouncy });
  const caret = typedDone ? 0 : Math.floor(frame / 8) % 2;
  const br = useBreathe(24, 0.008, 4);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 250, gap: 70 }}>
      <Words text="কমেন্টে ঝটপট লিখে ফেলুন" at={0} size={72} align="center" accent={[0]} style={{ maxWidth: 900 }} />
      <Pop at={8} dir="up" cfg="bouncy" style={{ transform: `translateY(${br.y}px)` }}>
        <GlassCard style={{ width: 900, padding: "36px 40px", borderRadius: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ flex: "0 0 92px", height: 92, borderRadius: 46, background: theme.colors.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon kind="bubbles" size={58} />
            </div>
            <div style={{
              flex: 1, height: 104, borderRadius: 52, display: "flex", alignItems: "center", padding: "0 38px",
              background: theme.colors.bg, border: `3px solid ${typedDone ? theme.colors.primary : theme.colors.line}`,
              fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 56, letterSpacing: 0, color: theme.colors.text,
            }}>
              <span>{text.slice(0, n)}</span>
              <span style={{ width: 4, height: 60, marginLeft: 4, background: theme.colors.primary, opacity: caret }} />
            </div>
            <div style={{ flex: "0 0 92px", height: 92, borderRadius: 46, background: typedDone ? theme.colors.primary : theme.colors.line, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${typedDone ? 1 + (1 - Math.min(1, sent)) * 0.18 : 1})` }}>
              <svg width={46} height={46} viewBox="0 0 40 40"><path d="M6 20 L34 7 L26 34 L19 23 Z" fill={theme.colors.onPrimary} /></svg>
            </div>
          </div>
        </GlassCard>
      </Pop>
      <Pop at={tSend} dir="up" cfg="bouncy">
        <HeroCard style={{ padding: "8px 56px 18px", borderRadius: 70 }}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, color: theme.colors.onPrimary, letterSpacing: 0, lineHeight: 1.25 }}>{text}</span>
        </HeroCard>
      </Pop>
    </div>
  );
};

/* ───────── Sign-off — minimal statement ───────── */
export const Signoff: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const t0 = rel(from, markerAt(50, "দেখা"));
  const tIn = rel(from, markerAt(50, "ইনশাআল্লাহ"));
  const br = useBreathe(30, 0.01, 6);
  const sweep = interpolate(frame, [tIn + 6, tIn + 26], [0, 1], { ...clampOpt, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, paddingBottom: 40 }}>
      <Pop at={t0 + 2} dir="scale" cfg="bouncy" style={{ transform: `translateY(${br.y}px)` }}>
        <Icon kind="check" size={150} />
      </Pop>
      <Words text="দেখা হচ্ছে পরের পর্বে" at={t0 + 8} size={92} align="center" style={{ maxWidth: 900 }} />
      <Pop at={tIn} dir="scale" cfg="bouncy">
        <div style={{ position: "relative", display: "inline-block", padding: "0 10px" }}>
          <div style={{ position: "absolute", left: 0, bottom: 14, height: 26, width: `${sweep * 100}%`, background: `${theme.colors.accent}99`, borderRadius: 13 }} />
          <span style={{ position: "relative", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, color: theme.colors.primary, letterSpacing: 0, lineHeight: 1.3, textShadow: `0 0 50px ${theme.colors.glow}` }}>ইনশাআল্লাহ</span>
        </div>
      </Pop>
      <Pop at={tIn + 12} dir="up" dist={24}>
        <Tag tone="soft" size={36}>Survival Arabic · Day 3</Tag>
      </Pop>
    </div>
  );
};

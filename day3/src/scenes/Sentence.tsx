import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { rel, Sentence as S } from "../content";
import {
  bn, fitSize, GlassCard, HeroCard, Icon, Pop, Shine, Tag, Waveform, Words, useBreathe, usePulse,
} from "../components/kit";

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type T = { sit: number; hint: number; phrase: number; echo: number; meaning: number; say: number };
type LayoutProps = { s: S; t: T };

const useT = (s: S, from: number): T => ({
  sit: rel(from, s.situationAt),
  hint: s.hintAt ? rel(from, s.hintAt) : 0,
  phrase: rel(from, s.phraseAt),
  echo: rel(from, s.echoAt),
  meaning: rel(from, s.meaningAt),
  say: s.sayAt ? rel(from, s.sayAt) : 0,
});

/* ───────── header: Sentence N + 10-step progress ───────── */
const Header: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Pop at={0} dir="left" dist={30}>
      <Tag tone="hero" size={38}>Sentence {n}</Tag>
    </Pop>
    <Pop at={4} dir="right" dist={30}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const cur = i + 1 === n;
          const done = i + 1 < n;
          return (
            <div key={i} style={{
              width: cur ? 46 : 18, height: 18, borderRadius: 9,
              background: cur ? theme.colors.accent : done ? theme.colors.primary : theme.colors.line,
            }} />
          );
        })}
      </div>
    </Pop>
  </div>
);

const Meaning: React.FC<{ s: S; at: number; size?: number; row?: boolean }> = ({ s, at, size = 52, row }) => (
  <Pop at={at} dir="up" cfg="smooth">
    <GlassCard style={{ padding: "26px 36px 28px 44px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: theme.colors.accent }} />
      <div style={{ display: "flex", flexDirection: row ? "row" : "column", alignItems: row ? "center" : "flex-start", gap: row ? 22 : 8 }}>
        <Tag tone="amber" size={34}>মানে</Tag>
        <div>
          <Words text={s.meaning} at={at + 4} size={size} lineHeight={1.3} />
          {s.sub && (
            <Pop at={at + 14} dir="up" dist={16}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 38, color: theme.colors.textDim, letterSpacing: 0, marginTop: 4 }}>{s.sub}</div>
            </Pop>
          )}
        </div>
      </div>
    </GlassCard>
  </Pop>
);

const PhraseText: React.FC<{ s: S; at: number; size: number; color?: string; align?: "left" | "center" | "right" }> = ({
  s, at, size, color = theme.colors.onPrimary, align = "left",
}) => <Words text={s.phrase} at={at + 3} size={size} color={color} align={align} lineHeight={1.25} />;

const SayWithMe: React.FC<{ at: number }> = ({ at }) => (
  <Pop at={at} dir="up" dist={24} cfg="bouncy">
    <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "10px 30px 12px", borderRadius: 60, background: theme.colors.card, border: `2px solid ${theme.colors.line}`, boxShadow: theme.shadow.soft }}>
      <Waveform bars={7} h={38} color={theme.colors.primary} />
      <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, letterSpacing: 0, color: theme.colors.text, lineHeight: 1.3 }}>আমার সাথে বলুন</span>
    </div>
  </Pop>
);

const Hint: React.FC<{ s: S; at: number; size?: number }> = ({ s, at, size = 34 }) =>
  s.hint ? (
    <Pop at={at} dir="up" dist={18} cfg="snappy" style={{ marginTop: 10 }}>
      <Tag tone="amber" size={size}>{s.hint}</Tag>
    </Pop>
  ) : null;

/* ───────── A · Glossy chat mockup ───────── */
const ChatLayout: React.FC<LayoutProps> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const pulse = usePulse(t.echo);
  const size = fitSize(s.phrase, 800, 2, 108, 64);
  const dots = interpolate(frame, [t.phrase - 26, t.phrase - 20, t.phrase - 2, t.phrase + 2], [0, 1, 1, 0], clampOpt);
  const br = useBreathe(30, 0.006, 2);
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 150, bottom: 50, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
        <Pop at={t.sit} dir="scale" cfg="bouncy">
          <div style={{ width: 132, height: 132, borderRadius: 66, background: theme.colors.primarySoft, border: `2px solid ${theme.colors.line}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${br.y * 2}px)` }}>
            <Icon kind={s.icon} size={84} />
          </div>
        </Pop>
        <Pop at={t.sit} dir="left" dist={50} style={{ maxWidth: 780 }}>
          <GlassCard style={{ padding: "24px 34px 28px", borderBottomLeftRadius: 12 }}>
            <Words text={s.situation} at={t.sit + 4} size={52} lineHeight={1.3} />
            <Hint s={s} at={t.hint} />
          </GlassCard>
        </Pop>
      </div>
      <div style={{ position: "relative", alignSelf: "flex-end", maxWidth: 900 }}>
        <div style={{ position: "absolute", right: 0, bottom: 0, opacity: dots }}>
          <GlassCard style={{ padding: "22px 34px", borderRadius: 40, display: "flex", gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: theme.colors.primary, transform: `translateY(${Math.sin(frame / 4 + i) * -6}px)` }} />
            ))}
          </GlassCard>
        </div>
        <Pop at={t.phrase} dir="right" dist={60} cfg="bouncy">
          <HeroCard style={{ padding: "36px 52px 42px", borderBottomRightRadius: 12, borderRadius: 52, transform: `scale(${pulse * br.scale})` }}>
            <PhraseText s={s} at={t.phrase} size={size} />
            <Shine at={t.echo} />
            <Shine at={t.meaning + 40} every={96} />
          </HeroCard>
        </Pop>
      </div>
      {s.sayAt && <div style={{ alignSelf: "flex-end" }}><SayWithMe at={t.say} /></div>}
      <Meaning s={s} at={t.meaning} />
    </div>
  );
};

/* ───────── B · Glass cards ───────── */
const GlassLayout: React.FC<LayoutProps> = ({ s, t }) => {
  const pulse = usePulse(t.echo);
  const br = useBreathe(28, 0.01, 6);
  const size = fitSize(s.phrase, 840, 2, 116, 64);
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 150, bottom: 50, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
        <Pop at={t.sit} dir="left" style={{ flex: 1.45 }}>
          <GlassCard style={{ padding: "28px 32px 30px", height: "100%", boxSizing: "border-box" }}>
            <Words text={s.situation} at={t.sit + 4} size={44} lineHeight={1.3} />
            <Hint s={s} at={t.hint} size={30} />
          </GlassCard>
        </Pop>
        <Pop at={t.sit + 4} dir="right" cfg="bouncy" style={{ flex: 1 }}>
          <GlassCard style={{ height: "100%", boxSizing: "border-box", background: theme.colors.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `translateY(${br.y}px) scale(${br.scale})` }}><Icon kind={s.icon} size={190} /></div>
          </GlassCard>
        </Pop>
      </div>
      <Pop at={t.phrase} dir="up" cfg="bouncy">
        <HeroCard style={{ padding: "52px 40px 58px", transform: `scale(${pulse})`, textAlign: "center" }}>
          <PhraseText s={s} at={t.phrase} size={size} align="center" />
          <Shine at={t.echo} />
            <Shine at={t.meaning + 40} every={96} />
        </HeroCard>
      </Pop>
      <Meaning s={s} at={t.meaning} row />
    </div>
  );
};

/* ───────── C · Bento grid ───────── */
const BentoLayout: React.FC<LayoutProps> = ({ s, t }) => {
  const pulse = usePulse(t.echo);
  const br = useBreathe(26, 0.012, 6);
  const size = fitSize(s.phrase, 410, 5, 100, 60);
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 150, bottom: 50, display: "grid", gridTemplateColumns: "1.15fr 1fr", gridTemplateRows: "270px 350px auto", gap: 22 }}>
      <Pop at={t.phrase} dir="scale" cfg="bouncy" style={{ gridColumn: 1, gridRow: "1 / span 2" }}>
        <HeroCard style={{ height: "100%", boxSizing: "border-box", padding: "36px 34px", display: "flex", alignItems: "center", transform: `scale(${pulse})` }}>
          <PhraseText s={s} at={t.phrase} size={size} />
          <Shine at={t.echo} />
            <Shine at={t.meaning + 40} every={96} />
        </HeroCard>
      </Pop>
      <Pop at={t.sit} dir="down" cfg="bouncy" style={{ gridColumn: 2, gridRow: 1 }}>
        <GlassCard style={{ height: "100%", boxSizing: "border-box", background: theme.colors.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `translateY(${br.y}px) scale(${br.scale})` }}><Icon kind={s.icon} size={160} /></div>
        </GlassCard>
      </Pop>
      <Pop at={t.sit + 3} dir="right" style={{ gridColumn: 2, gridRow: 2 }}>
        <GlassCard style={{ height: "100%", boxSizing: "border-box", padding: "26px 28px" }}>
          <Words text={s.situation} at={t.sit + 7} size={40} lineHeight={1.3} />
          <Hint s={s} at={t.hint} size={28} />
        </GlassCard>
      </Pop>
      <div style={{ gridColumn: "1 / span 2", gridRow: 3 }}>
        <Meaning s={s} at={t.meaning} size={48} row />
      </div>
    </div>
  );
};

/* ───────── D · Statement card ───────── */
const StatementLayout: React.FC<LayoutProps> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const pulse = usePulse(t.echo, 0.03);
  const br = useBreathe(26, 0.012, 7);
  const size = fitSize(s.phrase, 780, 2, 108, 64);
  const bar = interpolate(frame, [t.echo, t.echo + 16], [0, 1], { ...clampOpt, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 140, bottom: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Words text={s.situation} at={t.sit} size={46} align="center" color={theme.colors.textDim} lineHeight={1.3} />
      <Hint s={s} at={t.hint} size={32} />
      <div style={{ position: "relative", width: 900, marginTop: 96 }}>
        <div style={{ position: "absolute", inset: 0, transform: "translateY(16px) rotate(-2.4deg)", borderRadius: 56, background: theme.colors.primarySoft, border: `2px solid ${theme.colors.line}` }} />
        <Pop at={t.phrase} dir="up" cfg="bouncy">
          <div style={{ position: "relative", background: theme.colors.card, borderRadius: 56, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, padding: "92px 44px 50px", textAlign: "center", transform: `scale(${pulse})`, overflow: "visible" }}>
            <div style={{ position: "absolute", top: -78, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 156, height: 156, borderRadius: 78, background: theme.colors.card, border: `3px solid ${theme.colors.line}`, boxShadow: theme.shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${br.y}px) scale(${br.scale})` }}>
                <Icon kind={s.icon} size={96} />
              </div>
            </div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ position: "absolute", left: 0, bottom: 6, height: 20, width: `${bar * 100}%`, background: `${theme.colors.accent}88`, borderRadius: 10 }} />
              <div style={{ position: "relative" }}>
                <PhraseText s={s} at={t.phrase} size={size} color={theme.colors.primary} align="center" />
              </div>
            </div>
            <Shine at={t.echo} tone="amber" />
            <Shine at={t.meaning + 40} every={96} tone="amber" />
          </div>
        </Pop>
      </div>
      <Pop at={t.meaning} dir="up" cfg="bouncy" style={{ marginTop: 48, width: 900 }}>
        <div style={{ background: theme.colors.accent, borderRadius: 44, padding: "24px 40px 28px", textAlign: "center", boxShadow: theme.shadow.soft }}>
          <Words text={s.meaning} at={t.meaning + 4} size={48} align="center" color={theme.colors.text} lineHeight={1.3} />
          {s.sub && <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 36, letterSpacing: 0, color: theme.colors.text, opacity: 0.8 }}>{s.sub}</div>}
        </div>
      </Pop>
    </div>
  );
};

/* ───────── E · Timeline process flow ───────── */
const TimelineLayout: React.FC<LayoutProps> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const pulse = usePulse(t.echo);
  const br = useBreathe(26, 0.012, 5);
  const size = fitSize(s.phrase, 640, 2, 100, 60);
  const rail = interpolate(frame, [t.sit, t.meaning + 20], [0, 1], { ...clampOpt, easing: theme.ease.inOut });
  const Node: React.FC<{ n: number; at: number; hero?: boolean }> = ({ n, at, hero }) => (
    <Pop at={at} dir="scale" cfg="bouncy">
      <div style={{ width: 66, height: 66, borderRadius: 33, background: hero ? theme.colors.accent : theme.colors.primary, color: hero ? theme.colors.text : theme.colors.onPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, lineHeight: 1, paddingBottom: 6, letterSpacing: 0, boxShadow: theme.shadow.soft, border: `4px solid ${theme.colors.bg}` }}>
        {bn(n)}
      </div>
    </Pop>
  );
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 150, bottom: 50 }}>
      <div style={{ position: "absolute", left: 31, top: 30, bottom: 60, width: 6, borderRadius: 3, background: theme.colors.line }} />
      <div style={{ position: "absolute", left: 31, top: 30, bottom: 60, width: 6, borderRadius: 3, background: theme.colors.primary, transformOrigin: "top", transform: `scaleY(${rail})` }} />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
          <Node n={1} at={t.sit} />
          <Pop at={t.sit} dir="right" style={{ flex: 1 }}>
            <GlassCard style={{ padding: "26px 32px 30px", display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <Words text={s.situation} at={t.sit + 4} size={48} lineHeight={1.3} />
                <Hint s={s} at={t.hint} />
              </div>
              <div style={{ transform: `translateY(${br.y}px)` }}><Icon kind={s.icon} size={124} /></div>
            </GlassCard>
          </Pop>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
          <Node n={2} at={t.phrase} />
          <Pop at={t.phrase} dir="right" cfg="bouncy" style={{ flex: 1 }}>
            <HeroCard style={{ padding: "40px 44px 46px", transform: `scale(${pulse})` }}>
              <PhraseText s={s} at={t.phrase} size={size} />
              <Shine at={t.echo} />
            <Shine at={t.meaning + 40} every={96} />
            </HeroCard>
          </Pop>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
          <Node n={3} at={t.meaning} hero />
          <div style={{ flex: 1 }}><Meaning s={s} at={t.meaning} /></div>
        </div>
      </div>
    </div>
  );
};

const LAYOUTS = { chat: ChatLayout, glass: GlassLayout, bento: BentoLayout, statement: StatementLayout, timeline: TimelineLayout };

export const SentenceScene: React.FC<{ s: S; from: number }> = ({ s, from }) => {
  const t = useT(s, from);
  const Layout = LAYOUTS[s.layout];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Header n={s.n} />
      <Layout s={s} t={t} />
    </div>
  );
};

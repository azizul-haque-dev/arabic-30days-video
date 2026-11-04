import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Enter, Highlighted, Sfx, Sweep, Words, clamp } from "../components/primitives";
import { Icon } from "../components/icons";
import { SentenceData } from "../data/script";
import { loc } from "../timeline";
import { alpha, theme } from "../theme";

type Props = { d: SentenceData & { t0: number; tr: number; mean: number }; idx: number };
const C = theme.colors;

const TopBar: React.FC<{ n: number; idx: number }> = ({ n, idx }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 56, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p, transform: `translateY(${(1 - p) * -20}px)` }}>
      <Chip size={36} fill={C.text}>Sentence {n}</Chip>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width: 30, height: 12, borderRadius: 6, background: i === idx ? C.accent : i < idx ? C.text : C.line }} />
        ))}
      </div>
    </div>
  );
};

const sizeFor = (s: string) => (s.length <= 16 ? 104 : s.length <= 24 ? 90 : s.length <= 30 ? 80 : 70);
const meanSize = (s: string) => (s.length <= 22 ? 62 : s.length <= 30 ? 56 : 52);

export const Sentence: React.FC<Props> = ({ d, idx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = "s" + d.n;
  const fTr = Math.max(10, loc(id, d.tr));
  const fMean = loc(id, d.mean);
  const pAct = spring({ frame: frame - (fMean + 6), fps, config: theme.spring.bouncy });
  const float = Math.sin(frame / 20) * 6;
  const rate = 0.96 + (idx % 3) * 0.04;
  const sz = sizeFor(d.translit);
  const icon = (size: number) => <Icon n={d.n} p={pAct} t={frame} size={size} />;
  const translit = (scale: number, align: "left" | "center") => (
    <Words text={d.translit} delay={fTr} per={5} size={sz * scale} color={C.primary} align={align} lh={1.36} />
  );
  const meaning = (color: string) => (
    <Sweep delay={fMean} dur={18}>
      <div style={{ fontSize: meanSize(d.meaning), fontWeight: theme.font.heavy, lineHeight: 1.45, color, letterSpacing: 0 }}>
        <Highlighted text={d.meaning} keyText={d.key} hlDelay={fMean + 14} color={color} />
      </div>
    </Sweep>
  );
  const label = (dark: boolean) => (
    <Enter delay={fMean - 2} y={12} style={{ display: "inline-block" }}>
      <Chip size={30} fill={dark ? C.accent : C.accentSoft} color={C.text}>অর্থ</Chip>
    </Enter>
  );

  let body: React.ReactNode;
  if (d.layout === 1) {
    body = (<>
      <Enter delay={4} y={30} s={0.7} cfg={theme.spring.bouncy} style={{ position: "absolute", left: 405, top: 110, width: 270, height: 270 }}>
        <div style={{ width: 270, height: 270, borderRadius: 135, background: C.primarySoft, border: `3px solid ${C.surface}`, boxShadow: theme.shadow.soft, display: "grid", placeItems: "center", transform: `translateY(${float}px)` }}>{icon(200)}</div>
      </Enter>
      <Enter delay={fTr} y={50} style={{ position: "absolute", left: 72, top: 400, width: 936, height: 280 }}>
        <Card style={{ width: 936, height: 280 }}><div style={{ height: "100%", display: "grid", placeItems: "center", padding: "0 48px" }}>{translit(1, "center")}</div></Card>
      </Enter>
      <Enter delay={fMean - 4} y={50} style={{ position: "absolute", left: 72, top: 705, width: 936, height: 290 }}>
        <Card dark style={{ width: 936, height: 290 }}>
          <div style={{ padding: "26px 48px", display: "flex", flexDirection: "column", gap: 14 }}>{label(true)}{meaning(C.surface)}</div>
        </Card>
      </Enter>
    </>);
  } else if (d.layout === 2) {
    body = (<>
      <Enter delay={4} y={30} style={{ position: "absolute", left: 72, top: 135, width: 936, height: 340 }}>
        <div style={{ width: 936, height: 340, borderRadius: 56, background: C.primarySoft, border: `3px solid ${C.surface}`, boxShadow: theme.shadow.soft, display: "grid", placeItems: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 380, height: 380, borderRadius: 190, background: alpha(C.accent, 0.14), left: -90, bottom: -150 }} />
          <div style={{ transform: `translateY(${float}px)` }}>{icon(300)}</div>
        </div>
      </Enter>
      <div style={{ position: "absolute", left: 72, top: 512, width: 936 }}>{translit(1.04, "left")}</div>
      <div style={{ position: "absolute", left: 72, top: 790, width: 936, display: "flex", gap: 26 }}>
        <Enter delay={fMean - 4} x={-20} y={0} style={{ width: 10, borderRadius: 5, background: C.accent, height: 170 }}><div /></Enter>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>{label(false)}{meaning(C.text)}</div>
      </div>
    </>);
  } else if (d.layout === 3) {
    body = (<>
      <Enter delay={4} y={30} s={0.7} cfg={theme.spring.bouncy} style={{ position: "absolute", left: 72, top: 175, width: 250, height: 250 }}>
        <div style={{ width: 250, height: 250, borderRadius: 125, background: C.primarySoft, border: `3px solid ${C.surface}`, boxShadow: theme.shadow.soft, display: "grid", placeItems: "center", transform: `translateY(${float}px)` }}>{icon(190)}</div>
      </Enter>
      <Enter delay={fTr} x={-40} y={20} style={{ position: "absolute", left: 360, top: 130, width: 648, height: 380 }}>
        <div style={{ position: "relative", width: 648, height: 380 }}>
          <div style={{ position: "absolute", left: -16, top: 150, width: 44, height: 44, background: C.surface, transform: "rotate(45deg)", borderRadius: 8, boxShadow: theme.shadow.soft }} />
          <Card style={{ width: 648, height: 380, borderRadius: 56 }}><div style={{ height: "100%", display: "grid", placeItems: "center", padding: "0 40px" }}>{translit(0.78, "left")}</div></Card>
        </div>
      </Enter>
      <Enter delay={fMean - 4} x={50} y={20} style={{ position: "absolute", left: 170, top: 600, width: 838, height: 350 }}>
        <Card dark style={{ width: 838, height: 350, borderRadius: 56 }}>
          <div style={{ padding: "36px 52px", display: "flex", flexDirection: "column", gap: 18 }}>{label(true)}{meaning(C.surface)}</div>
        </Card>
      </Enter>
    </>);
  } else {
    body = (<>
      <div style={{ position: "absolute", left: 60, top: 110, fontSize: 330, fontWeight: theme.font.heavy, color: alpha(C.text, 0.07), lineHeight: 1.1, letterSpacing: 0 }}>{d.n}</div>
      <Enter delay={4} y={30} s={0.7} rot={-12} cfg={theme.spring.bouncy} style={{ position: "absolute", left: 690, top: 130, width: 300, height: 300 }}>
        <div style={{ transform: `translateY(${float}px) rotate(6deg)`, width: 300, height: 300, display: "grid", placeItems: "center", background: C.surface, borderRadius: 80, boxShadow: theme.shadow.card, border: `3px solid ${C.primarySoft}` }}>{icon(230)}</div>
      </Enter>
      <Enter delay={fTr} y={40} rot={-4} style={{ position: "absolute", left: 72, top: 450, width: 790, height: 250 }}>
        <Card style={{ width: 790, height: 250, transform: "rotate(-2deg)" }}><div style={{ height: "100%", display: "grid", placeItems: "center", padding: "0 44px" }}>{translit(0.86, "left")}</div></Card>
      </Enter>
      <Enter delay={fMean - 4} y={40} rot={3} style={{ position: "absolute", left: 190, top: 725, width: 818, height: 280 }}>
        <Card style={{ width: 818, height: 280, transform: "rotate(1.5deg)", background: alpha("#FFFFFF", 0.78), border: `2px solid ${C.accentSoft}` }}>
          <div style={{ padding: "26px 44px", display: "flex", flexDirection: "column", gap: 10 }}>{label(false)}{meaning(C.text)}</div>
        </Card>
      </Enter>
    </>);
  }

  return (
    <AbsoluteFill>
      <TopBar n={d.n} idx={idx} />
      {body}
      <Sfx name="pop" at={fTr + 2} rate={rate} />
      <Sfx name="click" at={fMean + 14} rate={rate} vol={0.9 + (idx % 2) * 0.1} />
    </AbsoluteFill>
  );
};

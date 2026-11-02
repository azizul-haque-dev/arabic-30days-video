import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import type { SentenceScene } from "../timing";
import { IconTile, Pop, Words } from "../components/primitives";
import { Icon } from "../components/icons";
import { Card, MeaningBlock, Pill } from "../components/ui";

const pronSize = (text: string, base: number) => {
  const n = text.replace(/\s/g, "").length;
  const k = n <= 12 ? 1 : n <= 16 ? 0.9 : n <= 20 ? 0.8 : 0.72;
  return Math.round(base * k);
};

const Header: React.FC<{ n: number; idx: number }> = ({ n, idx }) => (
  <div style={{ position: "absolute", top: 60, left: 72, right: 72, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Pop at={2} kind="snappy" y={20} scale={0.9}>
      <Pill bg={theme.colors.text} color={theme.colors.white} size={38} py={6} px={30}>Sentence {n}</Pill>
    </Pop>
    <Pop at={6} kind="snappy" y={20} scale={0.9}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? 34 : 16, height: 16, borderRadius: 16, background: i === idx ? theme.colors.accent : i < idx ? theme.colors.text : theme.colors.textFaint }} />
        ))}
      </div>
    </Pop>
  </div>
);

const TagPill: React.FC<{ tag?: string; at: number }> = ({ tag, at }) =>
  tag ? (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: -26, display: "flex", justifyContent: "center" }}>
      <Pop at={at} kind="bouncy" y={14} scale={0.7}>
        <Pill bg={theme.colors.text} color={theme.colors.white} size={38} py={4} px={26}>{tag}</Pill>
      </Pop>
    </div>
  ) : null;

export const Sentence: React.FC<{ scene: SentenceScene }> = ({ scene }) => {
  const { def, b, idx } = scene;
  const hl = b.pron + 30;
  const icon = (size: number, iconSize: number, tilt = 0, round?: number) => (
    <div style={{ position: "relative" }}>
      <IconTile at={4} size={size} tilt={tilt} round={round} floatPhase={idx}><Icon id={def.icon} size={iconSize} /></IconTile>
      <TagPill tag={def.tag} at={10} />
    </div>
  );

  let body: React.ReactNode;
  if (def.layout === "stack") {
    body = (
      <AbsoluteFill style={{ padding: "150px 72px 40px", alignItems: "center", justifyContent: "center", gap: 30, flexDirection: "column" }}>
        {icon(300, 226)}
        <Words text={def.pron} at={b.pron} size={pronSize(def.pron, 116)} per={5} highlightAt={hl} style={{ maxWidth: 936 }} />
        <Pop at={b.mean - 2} kind="smooth" y={30} scale={0.92}>
          <Card style={{ padding: "14px 48px 18px", borderRadius: 64 }}>
            <MeaningBlock at={b.mean} textAt={b.meanText} text={def.meaning} size={56} />
          </Card>
        </Pop>
      </AbsoluteFill>
    );
  } else if (def.layout === "row") {
    body = (
      <AbsoluteFill style={{ padding: "130px 72px 40px", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 52 }}>
        {icon(330, 250, -4, 64)}
        <div style={{ width: 556, display: "flex", flexDirection: "column", gap: 26 }}>
          <Words text={def.pron} at={b.pron} size={pronSize(def.pron, 92)} per={5} align="left" highlightAt={hl} />
          <Pop at={b.mean} y={0} scale={1} kind="smooth"><div style={{ width: 120, height: 8, borderRadius: 8, background: theme.colors.hero }} /></Pop>
          <MeaningBlock at={b.mean} textAt={b.meanText} text={def.meaning} size={50} align="left" />
        </div>
      </AbsoluteFill>
    );
  } else if (def.layout === "card") {
    body = (
      <AbsoluteFill style={{ padding: "112px 72px 40px", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ zIndex: 2, marginBottom: -104 }}>{icon(236, 178, 0, 118)}</div>
        <Pop at={b.pron - 4} kind="smooth" y={40} scale={0.94}>
        <Card style={{ width: 936, padding: "158px 48px 50px", display: "flex", flexDirection: "column", alignItems: "center", gap: 22, borderRadius: 72 }}>
          <Words text={def.pron} at={b.pron} size={pronSize(def.pron, 108)} per={5} highlightAt={hl} />
          <Pop at={b.mean} y={0} scale={1} kind="smooth"><div style={{ width: 820, height: 4, borderRadius: 4, background: theme.colors.line }} /></Pop>
          <MeaningBlock at={b.mean} textAt={b.meanText} text={def.meaning} size={56} />
        </Card>
        </Pop>
      </AbsoluteFill>
    );
  } else {
    body = (
      <AbsoluteFill style={{ padding: "140px 72px 40px", flexDirection: "column", justifyContent: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
          {icon(250, 190, 0, 125)}
          <Pop at={b.pron - 3} kind="bouncy" y={30} scale={0.85} style={{ flex: 1 }}>
            <div style={{ position: "relative", background: theme.colors.white, borderRadius: 60, borderBottomLeftRadius: 14, boxShadow: theme.shadow.card, padding: "26px 44px 30px" }}>
              <Words text={def.pron} at={b.pron + 2} size={pronSize(def.pron, 100)} per={5} align="left" highlightAt={hl} />
            </div>
          </Pop>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Pop at={b.mean} kind="bouncy" y={30} scale={0.85}>
            <div style={{ maxWidth: 800, background: theme.colors.text, borderRadius: 60, borderBottomRightRadius: 14, boxShadow: theme.shadow.card, padding: "20px 48px 26px" }}>
              <MeaningBlock at={b.mean + 2} textAt={b.meanText} text={def.meaning} size={60} align="left" dark />
            </div>
          </Pop>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Header n={def.n} idx={idx} />
      {body}
    </AbsoluteFill>
  );
};

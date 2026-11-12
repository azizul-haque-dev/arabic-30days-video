import React from "react";
import { AbsoluteFill } from "remotion";
import { SentenceConfig } from "../episode/day20";
import { SentenceCard, CardTimes } from "../components/SentenceCard";
import { WorkplaceIllustration } from "../components/WorkplaceIllustration";
import { endF, entry, startF } from "../timing";
import { useExit } from "../anim";

type Props = { cfg: SentenceConfig; /** global frame where this scene starts */ sceneStart: number; /** global frame where it ends */ sceneEnd: number };

/** One sentence-learning scene: illustration slot (top) + hierarchy card (bottom). All times come from the SRT. */
export const SentenceScene: React.FC<Props> = ({ cfg, sceneStart, sceneEnd }) => {
  const s = cfg.srt;
  const L = (n: number) => startF(n) - sceneStart;
  const E = (n: number) => endF(n) - sceneStart;
  const end = sceneEnd - sceneStart;
  const t: CardTimes = {
    label: L(s.label),
    setup: L(s.setup),
    lead: s.lead ? L(s.lead) : undefined,
    p1: L(s.pron1),
    p1e: E(s.pron1),
    p2: L(s.pron2),
    p2e: E(s.pron2),
    m: s.meaning ? L(s.meaning) : undefined,
    me: s.meaning ? E(s.meaning) : undefined,
    end,
  };
  const exit = useExit(end, 8);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${exit * -20}px)` }}>
        <WorkplaceIllustration kind={cfg.illustration} />
      </div>
      <SentenceCard cfg={cfg} t={t} setupText={entry(s.setup).text} leadText={s.lead ? entry(s.lead).text : undefined} />
    </AbsoluteFill>
  );
};

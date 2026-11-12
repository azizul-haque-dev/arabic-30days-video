import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ease, useEnter, useExit } from "../anim";
import { EPISODE, SentenceConfig } from "../episode/day20";
import { PronunciationText } from "./PronunciationText";
import { ArabicText } from "./ArabicText";
import { MeaningText } from "./MeaningText";
import { Caption } from "./Caption";

export type CardTimes = {
  label: number;
  setup: number;
  lead?: number;
  p1: number;
  p1e: number;
  p2: number;
  p2e: number;
  m?: number;
  me?: number;
  end: number;
};

type Props = { cfg: SentenceConfig; t: CardTimes; setupText: string; leadText?: string };

const { card } = theme.layout;
const HEADER_H = 64;

/** The mandatory hierarchy card: Bengali pronunciation > Arabic script > Bengali meaning + sentence number. */
export const SentenceCard: React.FC<Props> = ({ cfg, t, setupText, leadText }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(4, { y: 90, from: 0.97 });
  const exit = useExit(t.end, 8);

  const bodyH = card.h - card.pad * 2 - HEADER_H;
  const captionEnd = t.p1 - 2;
  const fill = ease(frame, t.p1, t.p1 + 24, theme.ease.out);
  const from = (cfg.no - 1) / EPISODE.total;
  const to = cfg.no / EPISODE.total;
  const barPct = (from + (to - from) * fill) * 100;
  const numEnter = useEnter(t.label, { y: 24, from: 0.8, config: theme.spring.pop });

  const meaningStart = t.m ?? t.p2;
  const meaningEnd = t.me ?? t.end - 10;

  return (
    <div
      style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: card.w,
        height: card.h,
        boxSizing: "border-box",
        padding: card.pad,
        background: theme.colors.white,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: card.radius,
        boxShadow: theme.shadow.card,
        opacity: enter.opacity * (1 - exit),
        transform: `${enter.transform} translateY(${exit * 30}px)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* header: sentence number + progress */}
      <div style={{ height: HEADER_H, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
          <div style={{ fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: theme.colors.muted }}>
            SENTENCE
          </div>
          <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 34, color: theme.colors.dark, opacity: numEnter.opacity, transform: numEnter.transform }}>
            {cfg.no}
            <span style={{ color: theme.colors.muted, fontWeight: 500 }}> / {EPISODE.total}</span>
          </div>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: theme.colors.soft, overflow: "hidden" }}>
          <div style={{ width: `${barPct}%`, height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.dark})` }} />
        </div>
      </div>

      {/* body */}
      <div style={{ position: "relative", height: bodyH - 16, marginTop: 16 }}>
        {/* narration captions before the pronunciation is spoken */}
        <LabelCaption no={cfg.no} from={t.label} to={t.setup} />
        <Caption text={setupText} from={t.setup} to={t.lead ?? captionEnd} />
        {leadText && t.lead !== undefined && <Caption text={leadText} from={t.lead} to={captionEnd} maxSize={64} />}

        {/* sentence layout — appears with the first pronunciation */}
        {frame >= t.p1 - 1 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <PronunciationText
              text={cfg.pron}
              enterFrame={t.p1}
              sweeps={[
                { from: t.p1, to: t.p1e },
                { from: t.p2, to: t.p2e },
              ]}
            />
            <ArabicText text={cfg.arabic} enterFrame={t.p1 + 8} />
            {frame >= meaningStart - 1 ? <MeaningText text={cfg.meaning} enterFrame={meaningStart} endFrame={meaningEnd} /> : <div style={{ height: 140 }} />}
          </div>
        )}
      </div>
    </div>
  );
};

/** "Sentence 191" narration label — big number, shown while the narrator says it. */
const LabelCaption: React.FC<{ no: number; from: number; to: number }> = ({ no, from, to }) => {
  const frame = useCurrentFrame();
  const e = useEnter(from, { y: 40, from: 0.85, config: theme.spring.pop });
  const exit = ease(frame, to - 6, to, theme.ease.in);
  if (frame < from || frame > to) return null;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: e.opacity * (1 - exit), transform: `${e.transform} translateY(${-exit * 14}px)` }}>
      <div style={{ fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: theme.colors.muted }}>SENTENCE</div>
      <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 220, lineHeight: 1.05, color: theme.colors.primary, letterSpacing: -6 }}>{no}</div>
    </div>
  );
};

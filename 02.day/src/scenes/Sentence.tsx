import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT, R, SHADOW, SPRING } from "../theme";
import { BEATS } from "../lib/timeline";
import { SENTENCES } from "../data/content";
import { Enter, tween, useBreath, useSp } from "../lib/motion";
import { Sweep, TypeWords, Words } from "../components/Text";
import { Medallion, Pill, glossy } from "../components/Ui";
import { Icon } from "../components/Icons";
import { Sfx, SceneShell } from "../components/Scene";

const fit = (t: string, big: number, mid: number, small: number) => (t.length > 40 ? small : t.length > 24 ? mid : big);
const TW = { textWrap: "balance" } as React.CSSProperties;

const Dots: React.FC<{ k: number }> = ({ k }) => (
  <Enter delay={6} from="down" dist={20} style={{ position: "absolute", left: 0, right: 0, bottom: 54, display: "flex", justifyContent: "center", gap: 14 }}>
    {SENTENCES.map((_, i) => (
      <div key={i} style={{ height: 16, width: i === k ? 56 : 16, borderRadius: 8, background: i === k ? C.accent : i < k ? C.hero : C.heroSoft }} />
    ))}
  </Enter>
);
const Label: React.FC<{ children: React.ReactNode; color?: string; icon?: "volume" }> = ({ children, color = C.muted, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: FONT.w.semi, color, letterSpacing: 0 }}>
    {icon && <Icon name={icon} size={40} color={color} />}{children}
  </div>
);

// A: Glossy Chat Window
const LayoutA: React.FC<{ k: number }> = ({ k }) => {
  const S = SENTENCES[k], bt = BEATS.sentences[k];
  const ps = fit(S.phrase, 64, 60, 52), ms = fit(S.meaning, 58, 54, 48);
  const words = S.phrase.split(" ").length;
  return (
    <div style={{ position: "absolute", left: 90, top: 150, width: 900 }}>
      <Enter delay={0} from="up" sp="soft">
        <div style={{ ...glossy(), overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 44px", borderBottom: `3px solid ${C.faint}` }}>
            <div style={{ width: 84 }}><Medallion size={84} icon={S.icon} /></div>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 0 }}>Sentence {S.n}</div>
          </div>
          <div style={{ padding: "36px 44px 48px", display: "flex", flexDirection: "column", gap: 30 }}>
            <Enter delay={bt.phrase} from="left" dist={50} style={{ alignSelf: "flex-start", maxWidth: 760 }}>
              <Label icon="volume">বলুন</Label>
              <div style={{ marginTop: 12, background: C.heroTint, borderRadius: "14px 40px 40px 40px", padding: "28px 44px", fontSize: ps, fontWeight: 700, lineHeight: 1.35, letterSpacing: 0, ...TW }}>
                <TypeWords text={S.phrase} start={bt.phrase + 4} end={bt.phrase + 4 + words * 6} />
              </div>
            </Enter>
            <Enter delay={bt.meaning} from="right" dist={50} style={{ alignSelf: "flex-end", maxWidth: 760 }}>
              <div style={{ background: `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})`, color: C.onHero, borderRadius: "40px 14px 40px 40px", padding: "26px 44px 30px", boxShadow: SHADOW.hero }}>
                <div style={{ fontSize: 34, fontWeight: FONT.w.semi, opacity: 0.85, letterSpacing: 0 }}>অর্থ</div>
                <div style={{ fontSize: ms, fontWeight: 700, lineHeight: 1.35, letterSpacing: 0, ...TW }}>{S.meaning}</div>
              </div>
            </Enter>
          </div>
        </div>
      </Enter>
    </div>
  );
};

// B: Flashcard
const LayoutB: React.FC<{ k: number }> = ({ k }) => {
  const S = SENTENCES[k], bt = BEATS.sentences[k];
  const f = useCurrentFrame();
  const ps = fit(S.phrase, 82, 72, 62), ms = fit(S.meaning, 62, 56, 50);
  const line = tween(f, bt.meaning - 4, bt.meaning + 12, 0, 1, EASE.inOut);
  return (
    <>
      <div style={{ position: "absolute", left: 110, top: 190, width: 860 }}>
        <Enter delay={0} from="up" sp="soft">
          <div style={{ ...glossy({ borderRadius: 56 }), padding: "150px 50px 60px", minHeight: 650, textAlign: "center" }}>
            <div style={{ position: "absolute", left: 40, top: 36 }}><Pill bg={C.heroTint} color={C.heroDeep} size={34}>Sentence {S.n}</Pill></div>
            <div style={{ display: "flex", justifyContent: "center", minHeight: 170 }}>
              <Words text={S.phrase} delay={bt.phrase} gap={5} size={ps} width={760} lh={1.3} />
            </div>
            <div style={{ position: "relative", height: 4, margin: "34px 40px 40px", background: C.faint, borderRadius: 2 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${line * 100}%`, background: C.hero, borderRadius: 2 }} />
              <div style={{ position: "absolute", left: "50%", top: -26, transform: `translateX(-50%) scale(${line})` }}><Pill bg={C.accent} color={C.text} size={30}>অর্থ</Pill></div>
            </div>
            <Enter delay={bt.meaning + 4} from="up" dist={30}>
              <div style={{ fontSize: ms, fontWeight: 700, lineHeight: 1.5, letterSpacing: 0, ...TW }}>
                <Sweep delay={bt.meaning + 10}>{S.meaning}</Sweep>
              </div>
            </Enter>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 450, top: 100 }}>
        <Enter delay={4} sp="pop" scaleFrom={0.4}><Medallion size={180} icon={S.icon} rings /></Enter>
      </div>
    </>
  );
};

// C: Glass Split
const LayoutC: React.FC<{ k: number }> = ({ k }) => {
  const S = SENTENCES[k], bt = BEATS.sentences[k];
  const f = useCurrentFrame();
  const ps = fit(S.phrase, 70, 64, 54), ms = fit(S.meaning, 58, 54, 48);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 96 }}>
        <Enter delay={0} from="left" dist={60}>
          <div style={{ fontSize: 40, fontWeight: FONT.w.semi, color: C.muted, letterSpacing: 0 }}>Sentence</div>
          <div style={{ fontSize: 230, fontWeight: 700, color: C.hero, lineHeight: 1.0, marginTop: 8, letterSpacing: 0 }}>{S.n}</div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 700, top: 90, width: 280, height: 280 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `4px dashed ${C.heroSoft}`, transform: `rotate(${f * 1.4}deg)` }}>
          <div style={{ position: "absolute", left: "50%", top: -14, marginLeft: -14, width: 28, height: 28, borderRadius: "50%", background: C.accent }} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 40 }}><Enter delay={4} scaleFrom={0.4}><Medallion size={200} icon={S.icon} /></Enter></div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 440, width: 820 }}>
        <Enter delay={bt.phrase} from="left" dist={90} sp="soft">
          <div style={{ ...glossy({ borderRadius: 44 }), padding: "30px 44px 36px", backgroundImage: undefined }}>
            <Label icon="volume">বলুন</Label>
            <div style={{ fontSize: ps, fontWeight: 700, lineHeight: 1.35, marginTop: 10, letterSpacing: 0, ...TW }}>{S.phrase}</div>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 170, top: 700, width: 820 }}>
        <Enter delay={bt.meaning} from="right" dist={90} sp="soft">
          <div style={{ background: `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})`, borderRadius: 44, padding: "30px 44px 36px", color: C.onHero, boxShadow: SHADOW.hero }}>
            <Label color="rgba(255,255,255,0.85)">অর্থ</Label>
            <div style={{ fontSize: ms, fontWeight: 700, lineHeight: 1.35, marginTop: 10, letterSpacing: 0, ...TW }}>{S.meaning}</div>
          </div>
        </Enter>
      </div>
    </>
  );
};

// D: Statement Card
const LayoutD: React.FC<{ k: number }> = ({ k }) => {
  const S = SENTENCES[k], bt = BEATS.sentences[k];
  const f = useCurrentFrame();
  const ps = fit(S.phrase, 92, 84, 70), ms = fit(S.meaning, 58, 52, 46);
  const reveal = tween(f, bt.meaning, bt.meaning + 14, 0, 100, EASE.inOut);
  return (
    <>
      <div style={{ position: "absolute", left: 90, width: 900, top: 90, display: "flex", justifyContent: "center" }}>
        <Enter delay={0} from="down" dist={24}><Pill bg={C.accent} color={C.text} size={42} shadow={SHADOW.accent}>Sentence {S.n}</Pill></Enter>
      </div>
      <div style={{ position: "absolute", left: 420, top: 190 }}>
        <Enter delay={4} scaleFrom={0.4}><Medallion size={240} icon={S.icon} rings /></Enter>
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 460, display: "flex", justifyContent: "center" }}>
        <Words text={S.phrase} delay={bt.phrase} gap={6} size={ps} width={860} />
      </div>
      <div style={{ position: "absolute", left: 100, width: 880, top: 730, clipPath: `inset(0 ${100 - reveal}% 0 0 round 40px)` }}>
        <div style={{ background: `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})`, borderRadius: 40, padding: "26px 40px 30px", textAlign: "center", color: C.onHero, fontSize: ms, fontWeight: 700, lineHeight: 1.35, letterSpacing: 0, boxShadow: SHADOW.hero, ...TW }}>{S.meaning}</div>
      </div>
    </>
  );
};

export const SentenceScene: React.FC<{ k: number; dur: number }> = ({ k, dur }) => {
  const bt = BEATS.sentences[k];
  const L = [LayoutA, LayoutB, LayoutC, LayoutD][k % 4];
  return (
    <SceneShell dur={dur}>
      <L k={k} />
      <Dots k={k} />
      <Sfx name="pop" at={bt.phrase + 2} rate={0.95 + (k % 3) * 0.05} />
      <Sfx name="pop" at={bt.meaning + 2} rate={1.12 + (k % 2) * 0.05} vol={0.9} />
    </SceneShell>
  );
};

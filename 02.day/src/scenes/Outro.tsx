import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT, R, SHADOW, SPRING } from "../theme";
import { BEATS } from "../lib/timeline";
import { SENTENCES } from "../data/content";
import { Enter, tween, useBreath, useSp } from "../lib/motion";
import { TypeWords, Words } from "../components/Text";
import { Burst, DrawCheck, Medallion, Pill, glossy } from "../components/Ui";
import { Icon } from "../components/Icons";
import { Sfx, SceneShell } from "../components/Scene";
import { bn } from "../lib/motion";

// ── Recap Grid ──
export const Recap: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.recap;
  const f = useCurrentFrame();
  const t0 = Math.max(18, b.count + 6);
  return (
    <SceneShell dur={dur} from="up">
      <div style={{ position: "absolute", left: 90, width: 900, top: 100, display: "flex", justifyContent: "center" }}>
        <Words text="১০টি বাক্য শেখা শেষ!" delay={b.count} gap={5} size={96} hi={[1, 2]} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 340, width: 900, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
        {SENTENCES.map((S, i) => {
          const inS = useSp(6 + i * 2, SPRING.pop);
          const tickAt = t0 + i * 4;
          const tS = useSp(tickAt, SPRING.snap);
          const done = f >= tickAt;
          return (
            <div key={i} style={{ ...glossy({ borderRadius: 36 }), height: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, position: "relative", transform: `scale(${0.8 + 0.2 * inS})`, opacity: Math.min(1, inS * 2), background: done ? `linear-gradient(180deg, ${C.white}, ${C.heroTint})` : undefined }}>
              <Icon name={S.icon} size={72} color={C.hero} stroke={3.6} />
              <div style={{ fontSize: 48, fontWeight: 700 }}>{bn(S.n)}</div>
              <div style={{ position: "absolute", right: -10, top: -12, width: 52, height: 52, borderRadius: "50%", background: C.hero, boxShadow: SHADOW.hero, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done ? tS : 0})` }}>
                <DrawCheck size={34} color={C.white} delay={tickAt + 2} stroke={7} />
              </div>
            </div>
          );
        })}
      </div>
      <Sfx name="tick" at={t0} />
      <Sfx name="tick" at={t0 + 9 * 4} rate={1.1} />
      <Sfx name="chime" at={t0 + 9 * 4 + 6} />
    </SceneShell>
  );
};

// ── Before / After Split ──
export const Contrast: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.contrast;
  const f = useCurrentFrame();
  const strike = tween(f, b.strike, b.strike + 12, 0, 1, EASE.inOut);
  const arrowS = useSp(b.right, SPRING.pop);
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 90, top: 210, width: 420 }}>
        <Enter delay={b.left} from="left" dist={70} sp="soft">
          <div style={{ ...glossy({ borderRadius: 52 }), height: 620, padding: "50px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: 0.92 }}>
            <Icon name="book" size={150} color={C.muted} stroke={3.4} />
            <div style={{ position: "relative", fontSize: 56, fontWeight: 700, textAlign: "center", lineHeight: 1.35, color: C.muted, letterSpacing: 0 }}>
              শুধু বাক্য মুখস্থ
              <div style={{ position: "absolute", left: 0, top: "50%", height: 6, width: `${strike * 100}%`, background: C.accentDeep, borderRadius: 3 }} />
            </div>
            <div style={{ marginTop: "auto", width: 84, height: 84, borderRadius: "50%", background: C.faint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${strike})` }}><Icon name="cross" size={44} color={C.muted} stroke={5} /></div>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 570, top: 210, width: 420 }}>
        <Enter delay={b.right} from="right" dist={70} sp="soft">
          <div style={{ borderRadius: 52, height: 620, padding: "50px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 30, background: `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})`, boxShadow: SHADOW.hero, color: C.onHero }}>
            <Icon name="bubble" size={150} color={C.white} stroke={3.4} />
            <div style={{ fontSize: 56, fontWeight: 700, textAlign: "center", lineHeight: 1.35, letterSpacing: 0 }}>প্রতিদিনের জীবনে বলার চেষ্টা</div>
            <div style={{ marginTop: "auto", width: 84, height: 84, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><DrawCheck size={52} color={C.text} delay={b.right + 12} stroke={7} /></div>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 540 - 48, top: 460, width: 96, height: 96, borderRadius: "50%", background: C.accent, boxShadow: SHADOW.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${arrowS})`, opacity: Math.min(1, arrowS * 2) }}><Icon name="arrow" size={54} color={C.text} stroke={5} /></div>
      <Sfx name="pop" at={b.left + 2} />
      <Sfx name="click" at={b.strike + 6} />
      <Sfx name="pop" at={b.right + 2} rate={1.12} />
    </SceneShell>
  );
};

// ── CTA: Follow + Comment UI (টাইপরাইটার শুধু ইনপুট UI-তে) ──
export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.cta;
  const f = useCurrentFrame();
  const press = tween(f, b.follow + 8, b.follow + 12, 0, 1, EASE.out) - tween(f, b.follow + 12, b.follow + 20, 0, 1, EASE.out);
  const following = f >= b.follow + 12;
  const typeStart = b.comment + 4, typeEnd = Math.max(typeStart + 20, b.done);
  const full = "DAY 2 DONE!";
  const n = Math.floor(tween(f, typeStart, typeEnd, 0, full.length + 0.99, EASE.inOut));
  const finished = n >= full.length;
  const sendS = useSp(typeEnd, SPRING.pop);
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <SceneShell dur={dur} from="up">
      <div style={{ position: "absolute", left: 90, top: 130, width: 900 }}>
        <Enter delay={0} from="up" sp="soft">
          <div style={{ ...glossy(), padding: "44px 50px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0 }}>Arabic Master</div>
              <div style={{ fontSize: 38, fontWeight: FONT.w.semi, color: C.muted, marginTop: 6 }}>প্রতিদিন নতুন বাক্য</div>
            </div>
            <Enter delay={b.follow} from="right" dist={40}>
              <div style={{ transform: `scale(${1 - press * 0.07})`, display: "flex", alignItems: "center", gap: 14, background: following ? C.heroDeep : C.hero, color: C.onHero, padding: "22px 36px", borderRadius: R.pill, fontSize: 44, fontWeight: 700, boxShadow: SHADOW.hero, letterSpacing: 0, whiteSpace: "nowrap" }}>
                <Icon name={following ? "check" : "userPlus"} size={44} color={C.white} stroke={5} />ফলো করুন
              </div>
            </Enter>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 90, top: 470, width: 900 }}>
        <Enter delay={b.comment - 4} from="up" sp="soft">
          <div style={{ ...glossy(), padding: "40px 50px 50px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 46, fontWeight: 700, letterSpacing: 0 }}>
              <Icon name="bubble" size={52} color={C.hero} />কমেন্টে লিখুন
            </div>
            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ flex: 1, height: 130, borderRadius: 36, background: C.white, border: `4px solid ${C.hero}`, display: "flex", alignItems: "center", padding: "0 36px", fontSize: 76, fontWeight: 700, letterSpacing: 0, whiteSpace: "nowrap" }}>
                {full.slice(0, n)}
                <span style={{ display: "inline-block", width: 6, height: 70, marginLeft: 6, background: C.hero, borderRadius: 3, opacity: blink || !finished ? 1 : 0 }} />
              </div>
              <div style={{ width: 130, height: 130, borderRadius: "50%", background: finished ? C.accent : C.heroSoft, boxShadow: finished ? SHADOW.accent : undefined, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${finished ? 0.85 + 0.15 * sendS : 1})` }}>
                <Icon name="arrow" size={64} color={finished ? C.text : C.muted} stroke={5} />
              </div>
            </div>
          </div>
        </Enter>
      </div>
      <Sfx name="pop" at={2} />
      <Sfx name="click" at={b.follow + 10} />
      <Sfx name="pop" at={b.comment - 2} rate={1.1} />
      <Sfx name="chime" at={typeEnd + 2} />
    </SceneShell>
  );
};

// ── সমাপ্তি: ক্যালেন্ডার ফ্লিপ ২ → ৩ ──
export const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.outro;
  const f = useCurrentFrame();
  const flip = tween(f, b.day3, b.day3 + 10, 0, 1, EASE.inOut);
  const breath = useBreath(5, 2.4);
  return (
    <SceneShell dur={dur} last from="scale">
      <Burst cx={540} cy={360} delay={b.day3 + 8} n={12} r0={260} r1={340} color={C.accent} w={12} />
      <div style={{ position: "absolute", left: 340, top: 110 + breath, width: 400 }}>
        <Enter delay={0} from="up" sp="soft">
          <div style={{ ...glossy({ borderRadius: 52 }), overflow: "hidden", height: 480 }}>
            <div style={{ background: `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})`, color: C.onHero, textAlign: "center", fontSize: 62, fontWeight: 700, padding: "12px 0 8px", letterSpacing: 4 }}>DAY</div>
            <div style={{ position: "relative", height: 380, perspective: 900 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 300, fontWeight: 700, color: C.text, transform: `rotateX(${-90 * flip}deg)`, opacity: flip < 1 ? 1 : 0 }}>2</div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 300, fontWeight: 700, color: C.hero, transform: `rotateX(${90 * (1 - flip)}deg)`, opacity: flip > 0 ? 1 : 0 }}>3</div>
            </div>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 650, display: "flex", justifyContent: "center" }}>
        <Words text="দেখা হবে" delay={2} gap={5} size={104} />
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 790, display: "flex", justifyContent: "center" }}>
        <Words text="ইনশাআল্লাহ" delay={b.insha} size={112} color={C.hero} />
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 950, textAlign: "center", fontSize: 40, fontWeight: FONT.w.semi, color: C.muted, letterSpacing: 0 }}>
        <Enter delay={b.insha + 6} from="up" dist={16}>Arabic Master</Enter>
      </div>
      <Sfx name="click" at={b.day3 + 3} />
      <Sfx name="chime" at={b.insha + 2} />
    </SceneShell>
  );
};

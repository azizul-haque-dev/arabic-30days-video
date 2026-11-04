import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {bn, theme, withAlpha} from "../theme";
import {SENTENCES, SM, Sentence, rel} from "../timing";
import {Pop, Sfx, Sweep, TopBar, WordStagger} from "../components/ui";
import {ICONS} from "../components/icons";
import {layoutLines} from "../components/measure";

const fill = {position: "absolute", inset: 0} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

type T = {num: number; ar: number; ar2: number; mean: number};
type LP = {s: Sentence; i: number; T: T};

const Icon: React.FC<{s: Sentence; size: number; t0: number}> = ({s, size, t0}) => {
  const frame = useCurrentFrame();
  const I = ICONS[s.n];
  return <I size={size} t={Math.max(0, frame - t0)} />;
};

const Arabic: React.FC<{s: Sentence; T: T; width: number; max: number; maxH: number; align?: "center" | "flex-start" | "flex-end"}> = ({s, T, width, max, maxH, align = "center"}) => {
  const frame = useCurrentFrame();
  const {lines, size, widest} = layoutLines(s.arabic, theme.fonts.ar, 900, width, max, maxH);
  const p = interpolate(frame, [T.ar2, T.ar2 + 20], [0, 1], {easing: theme.ease.out, ...clamp});
  let before = 0;
  return (
    <div style={{width, display: "flex", justifyContent: align === "flex-start" ? "flex-end" : align === "flex-end" ? "flex-start" : "center"}}>
      <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center"}}>
        {lines.map((ln, k) => {
          const d = T.ar + before * 5;
          before += ln.split(" ").length;
          return <WordStagger key={k} text={ln} rtl delay={d} per={5} size={Math.floor(size)} weight={900} font={theme.fonts.ar} gap={Math.round(size * 0.22)} lineHeight={1.35} align="center" />;
        })}
        <div style={{height: 10, width: Math.round((widest / 100) * Math.floor(size)), display: "flex", justifyContent: "flex-end", marginTop: 8, marginBottom: 12}}>
          <div style={{height: 10, width: `${p * 100}%`, borderRadius: 6, background: withAlpha(theme.colors.accent, 0.55)}} />
        </div>
      </div>
    </div>
  );
};

const Translit: React.FC<{s: Sentence; T: T; size?: number; align?: "center" | "left" | "right"; color?: string}> = ({s, T, size = 44, align = "center", color = theme.colors.textDim}) => (
  <Pop delay={T.ar + 10} dist={22} style={{textAlign: align}}>
    <div style={{fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: size, lineHeight: 1.35, color, letterSpacing: 0}}>{s.translit}</div>
  </Pop>
);

const NumberBadge: React.FC<{n: number; T: T; size?: number}> = ({n, T, size = 112}) => (
  <Pop delay={T.num} preset="bouncy" from={0.4} dist={0}>
    <div style={{width: size, height: size, borderRadius: "50%", background: theme.colors.text, color: theme.colors.surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: size * 0.48, boxShadow: theme.shadow.soft, letterSpacing: 0}}>{bn(n)}</div>
  </Pop>
);

const Tag: React.FC<{text: string; onDark?: boolean}> = ({text, onDark}) => (
  <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 30, letterSpacing: 0, padding: "2px 22px", borderRadius: 999, background: onDark ? withAlpha(theme.colors.surface, 0.22) : theme.colors.primary, color: theme.colors.onPrimary, whiteSpace: "nowrap"}}>{text}</span>
);

// ───────── Layout 1 · Stack (icon disc on top) ─────────
const LayoutStack: React.FC<LP> = ({s, i, T}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 20) * 5;
  return (
    <div style={fill}>
      <div style={{position: "absolute", left: 0, right: 0, top: 128, display: "flex", justifyContent: "center"}}>
        <Pop delay={T.num} preset="bouncy" from={0.6} style={{transform: `translateY(${bob}px)`}}>
          <div style={{position: "relative", width: 370, height: 370, borderRadius: "50%", background: theme.colors.surface, boxShadow: theme.shadow.card, border: `3px solid ${theme.colors.line}`, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{position: "absolute", inset: 18, borderRadius: "50%", background: theme.colors.mint, opacity: 0.55}} />
            <div style={{position: "relative"}}><Icon s={s} size={296} t0={T.num} /></div>
            <div style={{position: "absolute", left: -18, top: -10}}><NumberBadge n={s.n} T={T} /></div>
          </div>
        </Pop>
      </div>
      <div style={{position: "absolute", left: 70, right: 70, top: 520, bottom: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10}}>
        <Arabic s={s} T={T} width={940} max={124} maxH={230} />
        <Translit s={s} T={T} size={46} />
        <div style={{height: 14}} />
        <Pop delay={T.mean} preset="bouncy" from={0.8} dist={30}>
          <div style={{background: theme.colors.primary, color: theme.colors.onPrimary, borderRadius: 999, padding: "10px 52px", fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 58, boxShadow: theme.shadow.hero, textAlign: "center", letterSpacing: 0}}>{s.meaning}</div>
        </Pop>
      </div>
    </div>
  );
};

// ───────── Layout 2 · Split card (visual panel + overlapping card) ─────────
const LayoutSplit: React.FC<LP> = ({s, i, T}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 240], [0, -26], clamp);
  return (
    <div style={fill}>
      <Pop delay={T.num} dist={50} style={{position: "absolute", left: 70, top: 122, width: 940, height: 400}}>
        <div style={{position: "relative", width: 940, height: 400, borderRadius: 52, overflow: "hidden", background: `linear-gradient(135deg, ${theme.colors.mint}, ${theme.colors.surface})`, border: `3px solid ${theme.colors.line}`}}>
          <div style={{position: "absolute", right: 30 + drift, top: -60, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 420, lineHeight: 1, color: withAlpha(theme.colors.mintDeep, 0.5), letterSpacing: 0}}>{bn(s.n)}</div>
          <div style={{position: "absolute", left: 0, right: 0, top: 6, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(frame / 18) * 5}px)`}}><Icon s={s} size={340} t0={T.num} /></div>
          <div style={{position: "absolute", left: 28, top: 26}}><NumberBadge n={s.n} T={T} size={96} /></div>
        </div>
      </Pop>
      <Pop delay={T.num + 6} dist={60} style={{position: "absolute", left: 70, top: 470, width: 940, height: 540}}>
        <div style={{width: 940, height: 540, borderRadius: 52, background: theme.colors.surface, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 40px"}}>
          <Arabic s={s} T={T} width={860} max={108} maxH={220} />
          <Translit s={s} T={T} size={42} />
          <div style={{width: 760, height: 3, background: theme.colors.line, margin: "14px 0 8px"}} />
          <Pop delay={T.mean} dist={26} style={{display: "flex", alignItems: "center", gap: 22}}>
            <Tag text="অর্থ" />
            <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 50, color: theme.colors.text, letterSpacing: 0, lineHeight: 1.3}}>{s.meaning}</span>
          </Pop>
        </div>
      </Pop>
    </div>
  );
};

// ───────── Layout 3 · Three glass cards ─────────
const LayoutCards: React.FC<LP> = ({s, i, T}) => {
  const frame = useCurrentFrame();
  const card = {background: theme.colors.surface, borderRadius: 44, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`} as const;
  return (
    <div style={fill}>
      <div style={{position: "absolute", left: 70, top: 150, width: 940, display: "flex", flexDirection: "column", gap: 26}}>
        <Pop delay={T.num} dir="left" dist={90} preset="smooth">
          <div style={{...card, height: 380, display: "flex", alignItems: "center", position: "relative", overflow: "hidden"}}>
            <div style={{width: 330, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(frame / 18) * 5}px)`}}><Icon s={s} size={290} t0={T.num} /></div>
            <div style={{flex: 1, display: "flex", justifyContent: "center", paddingRight: 36}}><Arabic s={s} T={T} width={560} max={96} maxH={300} /></div>
            <div style={{position: "absolute", left: 22, top: 20}}><NumberBadge n={s.n} T={T} size={92} /></div>
          </div>
        </Pop>
        <Pop delay={T.ar + 8} dir="left" dist={90}>
          <div style={{...card, height: 130, display: "flex", alignItems: "center", gap: 24, padding: "0 36px"}}>
            <Tag text="উচ্চারণ" />
            <span style={{fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 42, color: theme.colors.text, letterSpacing: 0, lineHeight: 1.3}}>{s.translit}</span>
          </div>
        </Pop>
        <Pop delay={T.mean} dir="left" dist={90} preset="bouncy">
          <div style={{...card, background: theme.colors.primary, border: "none", boxShadow: theme.shadow.hero, minHeight: 170, display: "flex", alignItems: "center", gap: 26, padding: "10px 40px"}}>
            <Tag text="অর্থ" onDark />
            <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 54, color: theme.colors.onPrimary, letterSpacing: 0, lineHeight: 1.3}}>{s.meaning}</span>
          </div>
        </Pop>
      </div>
    </div>
  );
};

// ───────── Layout 4 · Left-accent with giant number watermark ─────────
const LayoutAccent: React.FC<LP> = ({s, i, T}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 240], [30, -30], clamp);
  return (
    <div style={fill}>
      <div style={{position: "absolute", left: -20 + drift, bottom: -160, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 760, lineHeight: 1, color: withAlpha(theme.colors.primary, 0.07), letterSpacing: 0}}>{bn(s.n)}</div>
      <div style={{position: "absolute", left: 70, top: 140}}>
        <WordStagger text={`বাক্য ${bn(s.n)}`} size={64} per={5} delay={T.num} hi={[1]} hiColor={theme.colors.primary} align="flex-start" />
      </div>
      <div style={{position: "absolute", left: 70, right: 70, top: 250, height: 340, display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
        <Arabic s={s} T={T} width={940} max={130} maxH={300} align="flex-start" />
      </div>
      <Pop delay={T.num + 4} dir="right" dist={80} preset="bouncy" style={{position: "absolute", left: 50, top: 600, transform: `translateY(${Math.sin(frame / 18) * 6}px)`}}>
        <Icon s={s} size={360} t0={T.num} />
      </Pop>
      <div style={{position: "absolute", left: 430, right: 70, top: 620, display: "flex", flexDirection: "column", gap: 22}}>
        <Translit s={s} T={T} size={42} align="left" />
        <Pop delay={T.mean} dir="up" dist={30} style={{background: theme.colors.surface, borderRadius: 36, padding: "22px 34px", boxShadow: theme.shadow.card, borderLeft: `12px solid ${theme.colors.primary}`}}>
          <div style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 56, color: theme.colors.text, lineHeight: 1.3, letterSpacing: 0}}>
            <Sweep delay={T.mean + 6} dur={24}>{s.meaning}</Sweep>
          </div>
        </Pop>
      </div>
    </div>
  );
};

// ───────── Layout 5 · Chat UI ─────────
const Typing: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 5, to - 3, to + 4], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{display: "inline-flex", gap: 10, padding: "20px 28px", borderRadius: 36, background: theme.colors.mint, opacity: o}}>
      {[0, 1, 2].map((k) => <div key={k} style={{width: 16, height: 16, borderRadius: "50%", background: theme.colors.text, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - k * 3) / 3)), transform: `translateY(${-Math.max(0, Math.sin((frame - k * 3) / 3)) * 6}px)`}} />)}
    </div>
  );
};
const LayoutChat: React.FC<LP> = ({s, i, T}) => {
  const frame = useCurrentFrame();
  return (
    <div style={fill}>
      <Pop delay={T.num} dist={60} style={{position: "absolute", left: 100, top: 200, width: 880, height: 720}}>
        <div style={{width: 880, height: 720, borderRadius: 60, background: theme.colors.surface, boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, overflow: "hidden", position: "relative"}}>
          <div style={{height: 120, background: theme.colors.mint, display: "flex", alignItems: "center", gap: 20, padding: "0 36px"}}>
            <div style={{width: 76, height: 76, borderRadius: "50%", background: theme.colors.surface, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}><Icon s={s} size={74} t0={T.num} /></div>
            <div>
              <div style={{fontFamily: theme.fonts.ar, fontWeight: 900, fontSize: 36, color: theme.colors.text, lineHeight: 1.2}}>Arabic Master</div>
              <div style={{fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 26, color: theme.colors.textDim, lineHeight: 1.2}}>বাক্য {bn(s.n)}</div>
            </div>
          </div>
          <div style={{padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28}}>
            <Pop delay={T.ar - 2} dir="left" dist={60} preset="snappy" style={{alignSelf: "flex-start", maxWidth: 720}}>
              <div style={{background: theme.colors.mint, borderRadius: "40px 40px 40px 10px", padding: "26px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
                <Arabic s={s} T={T} width={620} max={100} maxH={200} />
                <Translit s={s} T={T} size={38} />
              </div>
            </Pop>
            <div style={{alignSelf: "flex-end", minHeight: 80, position: "relative", maxWidth: 740}}>
              <div style={{position: "absolute", right: 0, top: 0}}><Typing from={Math.max(T.ar2, T.mean - 26)} to={T.mean} /></div>
              <Pop delay={T.mean} dir="right" dist={60} preset="bouncy">
                <div style={{background: theme.colors.primary, color: theme.colors.onPrimary, borderRadius: "40px 40px 10px 40px", padding: "24px 44px", fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 52, lineHeight: 1.3, letterSpacing: 0, boxShadow: theme.shadow.hero}}>{s.meaning}</div>
              </Pop>
            </div>
          </div>
          <div style={{position: "absolute", left: 36, bottom: 30, width: 560, height: 72, borderRadius: 36, background: theme.colors.bg, border: `2px solid ${theme.colors.line}`}} />
        </div>
      </Pop>
      <Pop delay={T.num + 8} preset="bouncy" from={0.4} style={{position: "absolute", right: 36, bottom: 90, transform: `rotate(${6 + Math.sin(frame / 20) * 3}deg)`}}>
        <div style={{width: 230, height: 230, borderRadius: "50%", background: theme.colors.surface, boxShadow: theme.shadow.card, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${theme.colors.line}`}}><Icon s={s} size={190} t0={T.num} /></div>
      </Pop>
    </div>
  );
};

const LAYOUTS: Record<number, React.FC<LP>> = {
  71: LayoutStack, 72: LayoutSplit, 73: LayoutCards, 74: LayoutAccent, 75: LayoutChat,
  76: LayoutStack, 77: LayoutSplit, 78: LayoutCards, 79: LayoutAccent, 80: LayoutChat,
};

export const SentenceScene: React.FC<{n: number}> = ({n}) => {
  const i = SENTENCES.findIndex((x) => x.n === n);
  const s = SENTENCES[i];
  const id = `s${n}`;
  const mk = SM[n];
  const T: T = {num: 0, ar: Math.max(6, rel(id, mk.ar.t)), ar2: rel(id, mk.ar2.t), mean: rel(id, mk.meaning.t)};
  const L = LAYOUTS[n];
  const rates = [1, 1.07, 0.94, 1.1];
  return (
    <div style={fill}>
      <TopBar current={i} />
      <L s={s} i={i} T={T} />
      <Sfx name="pop" at={T.mean} rate={rates[i % 4]} vol={0.26 + (i % 3) * 0.02} />
    </div>
  );
};

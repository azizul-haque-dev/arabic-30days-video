import React from "react";
import {C, E, FONT} from "../theme";
import {ip, useSpr, useT} from "../anim";

/** Index of the word being spoken inside [a,b] (weighted by letters). -1 before, len after. */
export const activeWord = (words: string[], a: number, b: number, g: number) => {
  if (g < a) return -1;
  if (g >= b) return words.length;
  const w = words.map((x) => Array.from(x).length + 1);
  const total = w.reduce((s, x) => s + x, 0);
  let acc = 0;
  const target = ((g - a) / (b - a)) * total;
  for (let i = 0; i < w.length; i++) {
    acc += w[i];
    if (target < acc) return i;
  }
  return words.length - 1;
};

type WordState = "idle" | "active" | "past" | "done";

const Word: React.FC<{text: string; i: number; size: number; state: WordState; at: number; hue?: "pron" | "meaning"}> = ({text, i, size, state, at, hue = "pron"}) => {
  const p = useSpr(at + i * 0.12, "pop");
  const act = state === "active";
  const color =
    hue === "pron"
      ? act ? C.white : state === "past" ? C.primary : state === "done" ? C.dark : C.text
      : act ? C.white : state === "past" || state === "done" ? C.dark : C.text;
  return (
    <span
      style={{
        display: "inline-block", fontFamily: FONT.bn, fontWeight: hue === "pron" ? 800 : 500, fontSize: size,
        lineHeight: 1.45, padding: hue === "pron" ? "0 12px" : "0 6px", margin: "0 3px", borderRadius: 26, color,
        background: act ? (hue === "pron" ? C.primary : C.dark) : "transparent",
        boxShadow: act ? `0 10px 26px ${C.primary}66` : "none",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 34}px) scale(${(0.9 + 0.1 * p) * (act ? 1.07 : 1)})`,
        transition: "none",
      }}
    >
      {text}
    </span>
  );
};

export const PronBlock: React.FC<{text: string; g: number; p1: number; p2: number; m: number}> = ({text, g, p1, p2, m}) => {
  const words = text.split(/\s+/);
  const len = Array.from(text).length;
  const size = Math.round(Math.max(62, Math.min(80, 80 - Math.max(0, len - 20) * 1.15)));
  const w1 = activeWord(words, p1, p2, g);
  const w2 = activeWord(words, p2, m, g);
  const idx = g < p2 ? w1 : g < m ? w2 : words.length;
  const finished = g >= m;
  return (
    <div style={{textAlign: "center", maxWidth: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: 6}}>
      {words.map((w, i) => (
        <Word key={i} text={w} i={i} size={size} at={0.2} hue="pron"
          state={finished ? "done" : idx === i ? "active" : idx > i ? "past" : "idle"} />
      ))}
    </div>
  );
};

export const MeaningBlock: React.FC<{text: string; g: number; m: number; end: number}> = ({text, g, m, end}) => {
  const {t} = useT();
  const words = text.split(/\s+/);
  const idx = activeWord(words, m, end, g);
  const on = ip(g, [m - 0.05, m + 0.35], [0, 1], E.out);
  const p = useSpr(0.45, "soft");
  return (
    <div
      style={{
        position: "relative", maxWidth: 940, padding: "10px 26px 12px 40px", borderRadius: 30,
        background: C.white, boxShadow: `0 14px 34px ${C.dark}1f`, textAlign: "center",
        opacity: (0.45 + 0.55 * on) * Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px) scale(${0.96 + 0.04 * p + 0.02 * on})`,
      }}
    >
      <div style={{position: "absolute", left: 14, top: 18, bottom: 18, width: 8, borderRadius: 4, background: C.amber}} />
      <div
        style={{
          position: "absolute", left: 28, top: -40, padding: "2px 18px", borderRadius: 20, background: C.amber, color: C.white,
          fontFamily: FONT.bn, fontWeight: 800, fontSize: 28, transform: `scale(${0.8 + 0.2 * on})`, opacity: on,
        }}
      >
        অর্থ
      </div>
      {words.map((w, i) => (
        <Word key={i} text={w} i={i} size={w.length > 28 ? 42 : 46} at={0.5} hue="meaning"
          state={g < m ? "idle" : idx === i ? "active" : "done"} />
      ))}
      <span style={{display: "none"}}>{t}</span>
    </div>
  );
};

export const ArabicPill: React.FC<{text: string; at: number}> = ({text, at}) => {
  const p = useSpr(at, "soft");
  const reveal = ip(p, [0, 1], [100, 0]);
  return (
    <div
      style={{
        direction: "rtl", fontFamily: FONT.ar, fontWeight: 700, fontSize: 40, color: C.dark, padding: "6px 36px 12px",
        borderRadius: 40, background: C.soft, border: `3px solid ${C.primary}55`, lineHeight: 1.5,
        clipPath: `inset(0 0 0 ${reveal}%)`, opacity: Math.min(1, p * 2),
      }}
    >
      {text}
    </div>
  );
};

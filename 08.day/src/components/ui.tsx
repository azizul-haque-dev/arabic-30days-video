import React, {useEffect, useState} from "react";
import {
  Audio, Sequence, cancelRender, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import {bn, theme, withAlpha} from "../theme";

// ---------- fonts (offline: files live in public/fonts) ----------
export const FontLoader: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = staticFile("fonts/fonts.css");
    link.onload = () => {
      Promise.all([
        document.fonts.load("700 40px 'Hind Siliguri'", "আঅ"),
        document.fonts.load("600 40px 'Hind Siliguri'", "আঅ"),
        document.fonts.load("700 40px 'Hind Siliguri'", "Abc"),
        document.fonts.load("700 40px 'Cairo'", "ابت"),
        document.fonts.load("900 40px 'Cairo'", "ابت"),
        document.fonts.load("900 40px 'Cairo'", "Abc"),
      ]).then(() => setReady(true));
    };
    link.onerror = () => setReady(true);
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);
  // children mount only after the fonts exist, so text measuring is always correct
  useEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);
  return <>{ready ? children : null}</>;
};

// ---------- SFX ----------
export type SfxName = "pop" | "click" | "whoosh" | "swipe" | "chime" | "thud";
const SFX_LEN: Record<SfxName, number> = {pop: 0.32, click: 0.19, whoosh: 0.8, swipe: 0.5, chime: 0.48, thud: 0.42};
const SFX_VOL: Record<SfxName, number> = {pop: 0.3, click: 0.34, whoosh: 0.24, swipe: 0.22, chime: 0.28, thud: 0.3};
export const Sfx: React.FC<{name: SfxName; at: number; vol?: number; rate?: number}> = ({name, at, vol, rate = 1}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={Math.ceil((SFX_LEN[name] / rate) * fps) + 3} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol ?? SFX_VOL[name]} playbackRate={rate} />
    </Sequence>
  );
};

// ---------- required voiceover ----------
export const PreviewAudio: React.FC = () => {
  const [ok, setOk] = useState(false);
  const [handle] = useState(() => delayRender("Loading required voiceover"));
  useEffect(() => {
    let dead = false;
    fetch(staticFile("voiceover.mp3"), {method: "HEAD"})
      .then((res) => {
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || ct.includes("text/html")) {
          throw new Error(`Required voiceover could not be loaded (HTTP ${res.status})`);
        }
        if (!dead) {
          setOk(true);
          continueRender(handle);
        }
      })
      .catch((error: unknown) => {
        if (!dead) {
          cancelRender(error instanceof Error ? error : new Error(String(error)));
        }
      });
    return () => {
      dead = true;
    };
  }, [handle]);
  if (!ok) return null;
  return <Audio src={staticFile("voiceover.mp3")} />;
};

// ---------- scene shell: enter + faster exit ----------
export const SceneShell: React.FC<{children: React.ReactNode; first?: boolean; last?: boolean}> = ({children, first, last}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = first ? 1 : Math.min(1, spring({frame, fps, config: theme.spring.smooth, durationInFrames: theme.motion.enterFrames}));
  const ex = interpolate(frame, [durationInFrames - theme.motion.exitFrames, durationInFrames - 1], [0, 1], {
    easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const exit = last ? 0 : ex;
  return (
    <div style={{position: "absolute", inset: 0, opacity: enter * (1 - exit), transform: `translateY(${(1 - enter) * 40 - exit * 26}px) scale(${0.97 + 0.03 * enter + exit * 0.02})`, filter: exit > 0.02 ? `blur(${exit * 6}px)` : undefined}}>
      {children}
    </div>
  );
};

// ---------- entrances ----------
type Dir = "up" | "down" | "left" | "right" | "none";
export const Pop: React.FC<{
  delay?: number; dir?: Dir; dist?: number; preset?: keyof typeof theme.spring; from?: number; style?: React.CSSProperties; children: React.ReactNode;
}> = ({delay = 0, dir = "up", dist = 40, preset = "smooth", from = 0.94, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring[preset]});
  const o = Math.max(0, Math.min(1, p));
  const k = (1 - p) * dist;
  const tx = dir === "left" ? -k : dir === "right" ? k : 0;
  const ty = dir === "up" ? k : dir === "down" ? -k : 0;
  const sc = interpolate(p, [0, 1], [from, 1]);
  return <div style={{opacity: o, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, ...style}}>{children}</div>;
};

// exit helper for sub-blocks inside a scene (faster than entrances)
export const useOut = (at: number, len = 9) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + len], [0, 1], {easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
};

// word-by-word stagger — splits ONLY on spaces (never inside a Bengali / Arabic word)
export const WordStagger: React.FC<{
  text: string; delay?: number; per?: number; size: number; weight?: number; color?: string; hi?: number[]; hiColor?: string;
  font?: string; rtl?: boolean; align?: "center" | "flex-start" | "flex-end"; gap?: number; lineHeight?: number; exitAt?: number; style?: React.CSSProperties;
}> = ({text, delay = 0, per = theme.motion.wordStagger, size, weight = 700, color = theme.colors.text, hi = [], hiColor = theme.colors.primary, font = theme.fonts.bn, rtl, align = "center", gap = 18, lineHeight = 1.3, exitAt, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 9], [0, 1], {easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{display: "flex", flexWrap: "wrap", justifyContent: align, columnGap: gap, rowGap: 0, fontFamily: font, fontSize: size, fontWeight: weight, lineHeight, letterSpacing: 0, color, opacity: 1 - out, transform: `translateY(${-out * 26}px)`, ...style}}>
      {text.split(" ").map((w, i) => {
        const p = spring({frame: frame - delay - i * per, fps, config: theme.spring.snappy});
        return (
          <span key={i} style={{display: "inline-block", whiteSpace: "nowrap", opacity: Math.max(0, Math.min(1, p)), color: hi.includes(i) ? hiColor : color, transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// highlight sweep behind text (marker style)
export const Sweep: React.FC<{delay: number; color?: string; dur?: number; rtl?: boolean; children: React.ReactNode; style?: React.CSSProperties}> = ({delay, color = withAlpha(theme.colors.accent, 0.45), dur = 16, rtl, children, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <span style={{backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: "no-repeat", backgroundSize: `${p * 100}% 38%`, backgroundPosition: rtl ? "100% 88%" : "0% 88%", ...style}}>{children}</span>
  );
};

// counter roll with Bengali digits (only for numbers that exist in the script)
export const Counter: React.FC<{from: number; to: number; delay: number; size: number; color?: string; dur?: number}> = ({from, to, delay, size, color = theme.colors.text, dur = 30}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + dur], [from, to], {easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: size, color, lineHeight: 1}}>{bn(Math.round(v))}</span>;
};

// persistent small header used on content scenes
export const TopBar: React.FC<{current?: number; total?: number; label?: string}> = ({current, total = 10, label}) => (
  <div style={{position: "absolute", top: 54, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
    <div style={{display: "flex", alignItems: "center", gap: 14}}>
      <span style={{fontFamily: theme.fonts.ar, fontWeight: 900, fontSize: 30, color: theme.colors.text}}>Arabic Master</span>
      <span style={{fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 22, color: theme.colors.text, background: withAlpha(theme.colors.text, 0.07), padding: "4px 16px", borderRadius: 999}}>{label ?? "Day 8"}</span>
    </div>
    {current !== undefined && (
      <div style={{display: "flex", gap: 10}}>
        {Array.from({length: total}).map((_, i) => (
          <div key={i} style={{width: i === current ? 34 : 14, height: 14, borderRadius: 14, background: i === current ? theme.colors.primary : i < current ? theme.colors.mintDeep : withAlpha(theme.colors.text, 0.14)}} />
        ))}
      </div>
    )}
  </div>
);

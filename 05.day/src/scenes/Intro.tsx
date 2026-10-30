import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BEATS, EXTRA, SCENES } from "../timing";
import { Card, Entrance, Pill, WordReveal, clamp, SceneExit } from "../components/kit";
import { Icon } from "../components/Icons";
import { Sfx } from "../components/Sfx";

const C = theme.colors;
const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const toBn = (n: number) => String(Math.round(n)).split("").map((d) => BN[+d]).join("");
const sceneFrom = (id: string) => SCENES.find((s) => s.id === id)!.from;
void BEATS;

const text = (size: number, weight: number = theme.weights.hero, color: string = C.text): React.CSSProperties => ({
  fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight, color, lineHeight: 1.12, letterSpacing: 0,
});

/** Chat bubble with typing dots (visual language for "কথাবার্তা"). */
const Bubble: React.FC<{ w: number; h: number; fill: string; delay: number; tail?: "l" | "r"; dots?: boolean }> = ({ w, h, fill, delay, tail = "l", dots = true }) => {
  const frame = useCurrentFrame();
  return (
    <Entrance delay={delay} config={theme.spring.bouncy} from={30} scaleFrom={0.6}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: h / 2.4, background: fill, boxShadow: theme.shadow.soft, border: `1px solid ${C.line}`,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ position: "absolute", bottom: -14, [tail === "l" ? "left" : "right"]: 44, width: 34, height: 34, background: fill, transform: "rotate(45deg)", borderRadius: 6 }} />
        {dots && [0, 1, 2].map((i) => (
          <div key={i} style={{ width: 20, height: 20, borderRadius: 20, background: C.text, opacity: 0.55 + 0.45 * Math.sin((frame - delay) / 5 - i * 0.9),
            transform: `translateY(${Math.sin((frame - delay) / 5 - i * 0.9) * -6}px)` }} />
        ))}
      </div>
    </Entrance>
  );
};

/* ───────────── 1 · HOOK — Kinetic + 30-day ring ───────────── */
export const HookScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = 262;
  const numP = spring({ frame: frame - 14, fps, config: theme.spring.bouncy });
  return (
    <SceneExit dur={dur}>
      <Sfx name="thud" at={2} />
      <Sfx name="chime" at={44} />
      <div style={{ position: "absolute", top: 96, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal text="৩০ দিনের" per={5} justify="center" gap={22} style={text(92)} />
      </div>
      <div style={{ position: "absolute", left: 540 - R - 40, top: 540 - R - 40 + 10, width: (R + 40) * 2, height: (R + 40) * 2 }}>
        <svg viewBox={`${-R - 40} ${-R - 40} ${(R + 40) * 2} ${(R + 40) * 2}`} width={(R + 40) * 2} height={(R + 40) * 2}>
          {Array.from({ length: 30 }).map((_, i) => {
            const p = spring({ frame: frame - 6 - i * 1.1, fps, config: theme.spring.snappy });
            const lit = i < 5;
            const litP = lit ? spring({ frame: frame - 26 - i * 3.2, fps, config: theme.spring.snappy }) : 0;
            return (
              <rect key={i} x={-9} y={-R} width={18} height={interpolate(p, [0, 1], [0, 56])} rx={9}
                fill={lit && litP > 0.5 ? C.primary : C.primarySoft} transform={`rotate(${i * 12}) scale(${1 + litP * 0.0}) translate(0 ${-litP * 8})`}
                style={{ filter: lit && litP > 0.5 ? `drop-shadow(0 0 10px ${C.glow})` : undefined }} />
            );
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(numP, [0, 1], [0.6, 1])})`, opacity: interpolate(numP, [0, 0.5], [0, 1], clamp) }}>
          <div style={text(66, theme.weights.strong, C.textDim)}>Day</div>
          <div style={{ ...text(290), marginTop: -34 }}>5</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 78, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal text="Survival Arabic" delay={22} per={6} justify="center" gap={26} style={text(112)}
          wordStyle={(i) => (i === 1 ? { color: C.primary } : {})} />
      </div>
    </SceneExit>
  );
};

/* ───────────── 2 · GULF — Statement + bubbles ───────────── */
export const GulfScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [46, 66], [0, 100], { ...clamp, easing: theme.ease.out });
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="pop" at={40} rate={1.08} />
      <div style={{ position: "absolute", top: 96, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance><Pill tone="white" size={44}><span style={{ color: C.primaryDeep }}>পর্ব ৫</span></Pill></Entrance>
      </div>
      <div style={{ position: "absolute", top: 250, left: 0, width: "100%", height: 330 }}>
        <div style={{ position: "absolute", left: 120, top: 10 }}><Bubble w={390} h={150} fill={C.surface} delay={8} /></div>
        <div style={{ position: "absolute", right: 110, top: 120 }}><Bubble w={350} h={150} fill={C.primarySoft} delay={16} tail="r" /></div>
        <div style={{ position: "absolute", left: 300, top: 238 }}><Bubble w={250} h={96} fill={C.accentSoft} delay={24} /></div>
      </div>
      <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <WordReveal text="Gulf দেশগুলোতে" delay={20} per={5} justify="center" style={text(104)} />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: -10, right: -10, bottom: 8, height: 34, borderRadius: 18, background: C.accentSoft, transformOrigin: "left", clipPath: `inset(0 ${100 - sweep}% 0 0)` }} />
          <WordReveal text="প্রতিদিনের কথাবার্তা" delay={34} per={5} justify="center" style={{ ...text(82, theme.weights.strong), position: "relative" }} />
        </div>
      </div>
    </SceneExit>
  );
};

/* ───────────── 3 · COUNT — counter roll + 10 bubbles ───────────── */
export const CountScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const roll = interpolate(spring({ frame: frame - 2, fps, config: { damping: 30, stiffness: 70, mass: 1 } }), [0, 1], [0, 10]);
  const shown = Math.min(10, Math.round(roll));
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={3} />
      <Sfx name="chime" at={26} rate={1.12} />
      <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 14 }}>
        <div style={{ ...text(360), color: C.primary, fontVariantNumeric: "tabular-nums", textShadow: `0 0 60px ${C.glow}` }}>{toBn(shown)}</div>
        <Entrance delay={20}><div style={text(120, theme.weights.strong)}>টি</div></Entrance>
      </div>
      <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal text="সহজ Arabic বাক্য" delay={14} per={4} justify="center" style={text(84)} />
      </div>
      <div style={{ position: "absolute", top: 720, left: 110, right: 110, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 26 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Entrance key={i} delay={12 + i * 3} config={theme.spring.bouncy} from={24} scaleFrom={0.5}>
            <div style={{ height: 96, borderRadius: 34, background: i % 2 ? C.accentSoft : C.surface, border: `1px solid ${C.line}`, boxShadow: theme.shadow.soft, position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center", ...text(40, theme.weights.strong, C.textDim) }}>
              {toBn(i + 1)}
              <div style={{ position: "absolute", bottom: -9, left: 24, width: 20, height: 20, background: i % 2 ? C.accentSoft : C.surface, transform: "rotate(45deg)", borderRadius: 4 }} />
            </div>
          </Entrance>
        ))}
      </div>
    </SceneExit>
  );
};

/* ───────────── 4 · HUB & SPOKE — three topics ───────────── */
const PersonPlus: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 240 240" width={size} height={size}>
    <circle cx={120} cy={120} r={112} fill={C.primarySoft} opacity={0.7} />
    <circle cx={104} cy={90} r={30} fill={C.white} stroke={C.text} strokeWidth={7} />
    <path d="M52 192 v-14 a52 52 0 0 1 104 0 v14z" fill={C.accent} stroke={C.text} strokeWidth={7} strokeLinejoin="round" />
    <path d="M178 70 v44 M156 92 h44" stroke={C.text} strokeWidth={9} strokeLinecap="round" />
  </svg>
);
export const HubScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = sceneFrom("hub");
  const spokes = EXTRA.hubSpokes.map((a) => a - from);
  const hub = { x: 540, y: 520 };
  const nodes = [
    { x: 250, y: 250, label: "পরিচিত হতে", icon: <PersonPlus size={132} /> },
    { x: 830, y: 270, label: "পরিবার নিয়ে কথা", icon: <Icon id="kids" size={132} delay={spokes[1] + 4} /> },
    { x: 540, y: 850, label: "প্রতিদিনের জীবন", icon: <Icon id="sunrise" size={132} delay={spokes[2] + 4} /> },
  ];
  const hubP = spring({ frame: frame - 2, fps, config: theme.spring.bouncy });
  const breath = 1 + Math.sin(frame / 24) * 0.02;
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={2} />
      {spokes.map((s, i) => <Sfx key={i} name="pop" at={s + 2} rate={[1, 1.06, 1.12][i]} />)}
      <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => {
          const p = interpolate(frame - spokes[i], [0, 16], [0, 1], { ...clamp, easing: theme.ease.out });
          return <line key={i} x1={hub.x} y1={hub.y} x2={hub.x + (n.x - hub.x) * p} y2={hub.y + (n.y - hub.y) * p} stroke={C.primary} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" opacity={0.7} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: hub.x - 150, top: hub.y - 150, width: 300, height: 300, borderRadius: 300, background: C.primary, boxShadow: `${theme.shadow.hero}, 0 0 90px ${C.glow}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(hubP, [0, 1], [0.4, 1]) * breath})`, opacity: interpolate(hubP, [0, 0.5], [0, 1], clamp) }}>
        <div style={text(104, theme.weights.hero, C.white)}>{toBn(10)}টি</div>
        <div style={text(54, theme.weights.strong, C.white)}>বাক্য</div>
      </div>
      {nodes.map((n, i) => (
        <div key={i} style={{ position: "absolute", left: n.x - 195, top: n.y - 125, width: 390 }}>
          <Entrance delay={spokes[i] + 6} config={theme.spring.snappy} from={30} scaleFrom={0.8}>
            <Card style={{ padding: "22px 20px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, borderRadius: theme.radius.lg }}>
              {n.icon}
              <div style={{ ...text(46, theme.weights.strong), textAlign: "center" }}>{n.label}</div>
            </Card>
          </Entrance>
        </div>
      ))}
    </SceneExit>
  );
};

/* ───────────── 5 · TWICE — headphones + waveform → "চলুন শুরু করি" ───────────── */
export const TwiceScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = sceneFrom("twice");
  const listenAt = EXTRA.twiceListen - from;
  const startAt = EXTRA.twiceStart - from;
  const one = interpolate(frame, [startAt - 12, startAt - 2], [1, 0], { ...clamp, easing: theme.ease.in });
  const two = interpolate(frame, [startAt - 4, startAt + 8], [0, 1], { ...clamp, easing: theme.ease.out });
  const bars = (offset: number, active: boolean) => Array.from({ length: 9 }).map((_, i) => {
    const h = 26 + (active ? 1 : 0.28) * (50 + 40 * Math.abs(Math.sin(frame / 5 + i * 0.9)));
    return <div key={i} style={{ width: 14, height: h, borderRadius: 10, background: active ? C.primary : C.primarySoft }} />;
  });
  const phase = Math.floor(Math.max(0, frame - 14) / 46) % 2;
  const hp = spring({ frame: frame - 2, fps, config: theme.spring.bouncy });
  const playP = spring({ frame: frame - startAt - 2, fps, config: theme.spring.bouncy });
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={2} />
      <Sfx name="click" at={listenAt} />
      <Sfx name="pop" at={startAt} rate={1.1} />
      <Sfx name="chime" at={startAt + 14} rate={1.12} />
      <AbsoluteFill style={{ opacity: one }}>
        <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${interpolate(hp, [0, 1], [0.5, 1])})`, opacity: interpolate(hp, [0, 0.5], [0, 1], clamp) }}>
          <svg viewBox="0 0 240 240" width={330} height={330}>
            <circle cx={120} cy={120} r={112} fill={C.primarySoft} opacity={0.7} />
            <path d="M62 150 C62 58 178 58 178 150" fill="none" stroke={C.text} strokeWidth={14} strokeLinecap="round" />
            <rect x={44} y={134} width={40} height={72} rx={18} fill={C.accent} stroke={C.text} strokeWidth={7} />
            <rect x={156} y={134} width={40} height={72} rx={18} fill={C.accent} stroke={C.text} strokeWidth={7} />
          </svg>
        </div>
        <div style={{ position: "absolute", top: 470, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
          <Entrance delay={12}><div style={{ display: "flex", alignItems: "center", gap: 8, height: 120 }}>{bars(0, phase === 0)}</div></Entrance>
          <Entrance delay={16}><div style={text(50, theme.weights.strong, C.textDim)}>×২</div></Entrance>
          <Entrance delay={20}><div style={{ display: "flex", alignItems: "center", gap: 8, height: 120 }}>{bars(1, phase === 1)}</div></Entrance>
        </div>
        <div style={{ position: "absolute", top: 650, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <WordReveal text="প্রতিটি বাক্য" delay={8} per={5} justify="center" style={text(96)} />
          <WordReveal text="দুইবার করে বলব" delay={20} per={5} justify="center" style={text(70, theme.weights.strong, C.textDim)} />
        </div>
        <div style={{ position: "absolute", top: 905, width: "100%", display: "flex", justifyContent: "center" }}>
          {frame >= listenAt - 2 && <Entrance delay={listenAt} config={theme.spring.snappy} from={26}><Pill tone="accent" size={46}>শুনে শুনে practice</Pill></Entrance>}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: two, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 300, height: 300, borderRadius: 300, background: C.primary, boxShadow: `${theme.shadow.hero}, 0 0 90px ${C.glow}`, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `translateY(-110px) scale(${interpolate(playP, [0, 1], [0.5, 1]) * (1 + Math.sin(frame / 14) * 0.02)})` }}>
          <div style={{ width: 0, height: 0, marginLeft: 20, borderTop: "70px solid transparent", borderBottom: "70px solid transparent", borderLeft: `116px solid ${C.white}` }} />
        </div>
        <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", justifyContent: "center" }}>
          <WordReveal text="চলুন শুরু করি।" delay={startAt + 4} per={6} justify="center" style={text(120)} wordStyle={(i) => (i === 1 ? { color: C.primary } : {})} />
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

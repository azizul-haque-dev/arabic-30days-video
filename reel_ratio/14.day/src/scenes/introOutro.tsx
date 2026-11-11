import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";
import { episodeConfig as cfg } from "../config/episodeConfig";
import type { BuiltScene } from "../config/timeline";
import { Art, Stage, TextBox, Zone } from "../components/layout";
import { Arrow, Block, CarTop, DestFlag, Palm, Passenger, Pin, QuestionMark, SignBoard, TaxiTop } from "../components/art";
import { BrandMark, Chip } from "../components/brand";
import { SceneShell, TopBar } from "../components/scene";
import { breathe, eased, enter, enterStyle, sec } from "../utils/motion";
import { Route, curve, line, P, arc } from "../utils/route";

const c = theme.colors;
const E = theme.easings;
const SW = theme.layout.zones.stage.w;
const SH = theme.layout.zones.stage.h;

const useF = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps };
};

const StageIn: React.FC<{ children: React.ReactNode; instant?: boolean }> = ({ children, instant }) => {
  const { frame, fps } = useF();
  const p = instant ? 1 : Math.min(enter(frame, fps, 2, "gentle"), 1.05);
  return (
    <Stage zone="stage" opacity={instant ? 1 : Math.min(1, p * 1.6)} scale={0.95 + 0.05 * Math.min(p, 1)} translateY={(1 - Math.min(p, 1)) * 40}>
      {children}
    </Stage>
  );
};

const Title: React.FC<{ children: React.ReactNode; delay?: number; gap?: number; instant?: boolean }> = ({ children, delay = 6, gap = 14, instant }) => {
  const { frame, fps } = useF();
  const p = instant ? 1 : enter(frame, fps, delay);
  return (
    <Zone zone="title" gap={gap}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap, maxWidth: "100%", ...(instant ? {} : enterStyle(p, 12, 0.94)) }}>{children}</div>
    </Zone>
  );
};

const big = (size: number, color: string = c.text): React.CSSProperties => ({
  fontFamily: theme.fonts.en, fontWeight: 800, fontSize: size, lineHeight: 1.18, color, letterSpacing: -1, whiteSpace: "nowrap",
});

/* -------------------------------------------------- 1. Thumbnail / Problem */
const ThumbArt: React.FC = () => {
  const { frame, fps } = useF();
  const w = SW, h = SH;
  const t = frame / fps;
  const taxiY = 700 - eased(frame, 0, sec(5, fps), 0, 70, E.soft) + breathe(frame, fps, 3, 2);
  const pulse = (t % 1.6) / 1.6;
  return (
    <g>
      <rect width={w} height={h} fill={c.grass} />
      <Block x={20} y={30} w={330} h={280} />
      <Block x={590} y={30} w={330} h={280} tone="b" />
      <Block x={20} y={560} w={330} h={240} tone="b" />
      <rect x={370} y={-30} width={200} height={h + 60} fill={c.road} />
      <rect x={-30} y={320} width={w + 60} height={200} fill={c.road} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={382 + i * 38} y={528} width={24} height={40} rx={5} fill={c.white} opacity={0.85} />)}
      <line x1={470} y1={-20} x2={470} y2={312} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" />
      <line x1={470} y1={572} x2={470} y2={h + 20} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" />
      <line x1={-20} y1={420} x2={360} y2={420} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" />
      <line x1={580} y1={420} x2={w + 20} y2={420} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" />
      <Palm x={420} y={60} s={0.0} />
      <Art id="sign-left"><SignBoard x={250} y={300} dir="left" s={0.82} sway={breathe(frame, fps, 1, 3)} /></Art>
      <Art id="sign-right"><SignBoard x={690} y={300} dir="right" s={0.82} sway={breathe(frame, fps, 1, 3, 1)} /></Art>
      <Art id="map-card">
        <g transform="translate(40 580)">
          <rect width={290} height={190} rx={30} fill={c.white} stroke={c.green} strokeWidth={6} />
          <rect x={14} y={14} width={262} height={162} rx={20} fill={c.greenMist} />
          <path d="M40 150 C80 90 120 150 160 100 S230 50 250 40" fill="none" stroke={c.green} strokeWidth={9} strokeLinecap="round" strokeDasharray="2 18" />
          <g transform="translate(250 56) scale(0.45)"><path d="M0 0 C-26 -34 -34 -48 -34 -68 A34 34 0 1 1 34 -68 C34 -48 26 -34 0 0 Z" fill={c.amber} /></g>
          <circle cx={46} cy={146} r={13} fill={c.green} stroke={c.white} strokeWidth={4} />
        </g>
      </Art>
      <Art id="passenger"><Passenger x={760} y={790} s={0.62} arm={-35 + breathe(frame, fps, 8, 1.4)} flip /></Art>
      <Art id="question"><QuestionMark x={760} y={560 + breathe(frame, fps, 6, 1.2)} s={0.95} color={c.amber} /></Art>
      <circle cx={760} cy={560} r={40 + pulse * 40} fill="none" stroke={c.amber} strokeWidth={5} opacity={0.5 * (1 - pulse)} />
      <Art id="taxi"><TaxiTop x={520} y={taxiY} rot={0} s={1.05} /></Art>
    </g>
  );
};

export const IntroProblem: React.FC<{ scene: BuiltScene }> = ({ scene }) => (
  <SceneShell dur={scene.dur}>
    <TopBar instant right={<Chip id="day-chip" tone="green" size={40}>{`Day ${cfg.episodeNumber}`}</Chip>} />
    <StageIn instant><ThumbArt /></StageIn>
    <Title instant gap={18}>
      <TextBox id="thumb-title" style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 112, lineHeight: 1.25, color: c.text, whiteSpace: "nowrap" }}>
        {cfg.thumbTitleBn}
      </TextBox>
      <Chip id="sentence-range" tone="amber" size={50}>{`Sentence ${cfg.sentenceStart}–${cfg.sentenceEnd}`}</Chip>
    </Title>
  </SceneShell>
);

/* -------------------------------------------------- 2. Brand */
export const IntroBrand: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const m = Math.min(enter(frame, fps, 6, "pop"), 1.15);
  const spin = eased(frame, 0, sec(1.2, fps), -40, 0, E.out);
  return (
    <SceneShell dur={scene.dur}>
      <StageIn>
        <rect width={SW} height={SH} fill={c.greenMist} />
        {[0, 1, 2].map((i) => {
          const r = 170 + i * 95 + breathe(frame, fps, 6, 3, i);
          return <circle key={i} cx={SW / 2} cy={SH / 2} r={r} fill="none" stroke={c.green} strokeWidth={4} opacity={0.22 - i * 0.05} strokeDasharray="6 22" />;
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = ((frame / fps) * 18 + i * 60) * (Math.PI / 180);
          return <circle key={i} cx={SW / 2 + Math.cos(a) * 340} cy={SH / 2 + Math.sin(a) * 340} r={i % 2 ? 11 : 16} fill={i % 2 ? c.amber : c.green} opacity={0.8} />;
        })}
        <Art id="brand-mark">
          <g transform={`translate(${SW / 2} ${SH / 2}) rotate(${spin}) scale(${3.3 * m}) translate(-50 -50)`}>
            <rect width="100" height="100" rx="26" fill={c.green} />
            <rect x="6" y="6" width="88" height="88" rx="21" fill="none" stroke={c.white} strokeWidth="3" opacity="0.35" />
            <path d="M28 70 V46 Q28 34 40 34 H62" fill="none" stroke={c.white} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M58 18 L80 34 L58 50 Z" fill={c.amber} />
          </g>
        </Art>
      </StageIn>
      <Title delay={sec(0.5, fps)}>
        <TextBox id="brand-name" kind="logo" style={big(124, c.text)}>Arabic Master</TextBox>
      </Title>
    </SceneShell>
  );
};

/* -------------------------------------------------- 3. Episode intro */
const dayRoute = new Route([curve(P(70, 700), P(260, 760), P(300, 560), P(470, 560)), curve(P(470, 560), P(650, 560), P(640, 380), P(830, 400)), curve(P(830, 400), P(900, 410), P(880, 200), P(740, 190)), curve(P(740, 190), P(560, 180), P(520, 120), P(330, 130))]);

export const IntroEpisode: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const n = Math.round(eased(frame, sec(0.3, fps), sec(1.6, fps), 0, cfg.episodeNumber, E.out));
  const reveal = eased(frame, sec(0.2, fps), sec(1.8, fps), 0, 1, E.out);
  const pos = dayRoute.at(0.46 * reveal);
  return (
    <SceneShell dur={scene.dur}>
      <StageIn>
        <rect width={SW} height={SH} fill={c.grass} />
        <Block x={30} y={60} w={250} h={190} tone="b" />
        <Block x={620} y={560} w={290} h={200} />
        <path d={dayRoute.d} fill="none" stroke={c.road} strokeWidth={70} strokeLinecap="round" />
        <path d={dayRoute.d} fill="none" stroke={c.white} strokeWidth={6} strokeDasharray="26 24" strokeLinecap="round" opacity={0.85} />
        <Palm x={150} y={520} s={0.8} sway={breathe(frame, fps, 4, 3)} />
        <Palm x={880} y={640} s={0.7} sway={breathe(frame, fps, 4, 3, 1)} />
        {Array.from({ length: 30 }).map((_, i) => {
          const q = dayRoute.at((i + 0.5) / 30);
          const done = i < cfg.episodeNumber;
          const a = Math.min(enter(frame, fps, 10 + i * 2, "pop"), 1);
          return (
            <g key={i} opacity={Math.min(1, a * 1.5)}>
              <circle cx={q.x} cy={q.y - 64} r={(done ? 13 : 10) * (0.4 + 0.6 * a)} fill={done ? c.green : c.white} stroke={done ? c.white : c.greenSoft} strokeWidth={4} />
            </g>
          );
        })}
        <Art id="signpost"><SignBoard x={170} y={330} dir="right" s={0.75} sway={breathe(frame, fps, 1, 3)} /></Art>
        <Art id="taxi"><TaxiTop x={pos.x} y={pos.y} rot={pos.angle} s={0.7} /></Art>
      </StageIn>
      <Title delay={sec(0.2, fps)} gap={4}>
        <TextBox id="day-label" style={{ ...big(58, c.muted), letterSpacing: 8 }}>DAY</TextBox>
        <TextBox id="day-number" style={big(176, c.green)}>{n}</TextBox>
      </Title>
    </SceneShell>
  );
};

/* -------------------------------------------------- progress scenes */
const ProgressStage: React.FC<{ from: number; to: number; a: number; b: number }> = ({ from, to, a, b }) => {
  const { frame, fps } = useF();
  const f = eased(frame, a, b, from / cfg.totalSentences, to / cfg.totalSentences, E.inOut);
  const x0 = 110, x1 = SW - 110, y = 470, hh = 74;
  const tx = x0 + (x1 - x0) * f;
  return (
    <>
      <rect width={SW} height={SH} fill={c.greenMist} />
      <Block x={60} y={90} w={260} h={190} tone="b" />
      <Block x={620} y={120} w={260} h={160} />
      <Palm x={420} y={200} s={0.9} sway={breathe(frame, fps, 4, 3)} />
      <rect x={x0 - 30} y={y - hh / 2 - 12} width={x1 - x0 + 60} height={hh + 24} rx={(hh + 24) / 2} fill={c.road} />
      <rect x={x0} y={y - hh / 2} width={x1 - x0} height={hh} rx={hh / 2} fill={c.roadEdge} />
      <rect x={x0} y={y - hh / 2} width={Math.max(hh, tx - x0)} height={hh} rx={hh / 2} fill={c.green} />
      <line x1={x0 + 24} y1={y} x2={Math.max(x0 + 24, tx - 24)} y2={y} stroke={c.white} strokeWidth={6} strokeDasharray="22 20" strokeLinecap="round" opacity={0.85} />
      {[0.25, 0.5, 0.75].map((m) => <rect key={m} x={x0 + (x1 - x0) * m - 3} y={y + hh / 2 + 24} width={6} height={30} rx={3} fill={c.muted} opacity={0.6} />)}
      <Art id="taxi"><TaxiTop x={tx} y={y - 110} rot={90} s={0.95} /></Art>
      <Art id="start-pin"><Pin x={x0} y={y + 150} s={0.8} /></Art>
      <Art id="end-flag"><DestFlag x={x1} y={y + 150} s={0.9} /></Art>
    </>
  );
};

const CountTitle: React.FC<{ v: number; pct: number; delay: number }> = ({ v, pct, delay }) => (
  <Title delay={delay} gap={18}>
    <TextBox id="count" style={{ ...big(150, c.green), display: "flex", gap: 20, alignItems: "baseline" }}>
      <span>{Math.round(v)}</span>
      <span style={{ color: c.muted, fontSize: 100 }}>{`/ ${cfg.totalSentences}`}</span>
    </TextBox>
    <Chip id="pct" tone="amber" size={52}>{`${pct.toFixed(2)}%`}</Chip>
  </Title>
);

export const IntroProgress: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const a = sec(0.3, fps), b = sec(2.6, fps);
  const f = eased(frame, a, b, 0, 1, E.out);
  return (
    <SceneShell dur={scene.dur}>
      <StageIn><ProgressStage from={0} to={cfg.previousCompletedSentences} a={a} b={b} /></StageIn>
      <CountTitle v={cfg.previousCompletedSentences * f} pct={cfg.previousProgressPercentage * f} delay={4} />
    </SceneShell>
  );
};

export const OutroProgress: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const a = sec(0.5, fps), b = sec(2.8, fps);
  const f = eased(frame, a, b, 0, 1, E.inOut);
  const v = cfg.previousCompletedSentences + (cfg.completedSentences - cfg.previousCompletedSentences) * f;
  const pct = cfg.previousProgressPercentage + (cfg.progressPercentage - cfg.previousProgressPercentage) * f;
  return (
    <SceneShell dur={scene.dur}>
      <StageIn><ProgressStage from={cfg.previousCompletedSentences} to={cfg.completedSentences} a={a} b={b} /></StageIn>
      <CountTitle v={v} pct={pct} delay={4} />
    </SceneShell>
  );
};

/* -------------------------------------------------- 5. Today's topic */
export const IntroTopic: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const taxi = new Route([line(P(520, 900), P(520, 640)), arc(P(520, 640), P(580, 580), P(580, 640)), line(P(580, 580), P(980, 580))]);
  const u = eased(frame, sec(0.6, fps), sec(4.4, fps), 0, 1, E.inOut);
  const q = taxi.at(u);
  const lp = 0.5 + 0.5 * Math.sin((frame / fps) * 5);
  const rp = 0.5 + 0.5 * Math.sin((frame / fps) * 5 + Math.PI);
  return (
    <SceneShell dur={scene.dur}>
      <StageIn>
        <rect width={SW} height={SH} fill={c.grass} />
        <Block x={30} y={30} w={330} h={250} />
        <Block x={600} y={30} w={310} h={250} tone="b" />
        <Block x={30} y={620} w={330} h={170} tone="b" />
        <rect x={380} y={-30} width={200} height={SH + 60} fill={c.road} />
        <rect x={-30} y={470} width={SW + 60} height={200} fill={c.road} />
        <line x1={480} y1={-20} x2={480} y2={460} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" />
        <line x1={480} y1={680} x2={480} y2={SH + 20} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" />
        <Palm x={880} y={720} s={0.8} sway={breathe(frame, fps, 4, 3)} />
        <Art id="sign-up"><SignBoard x={470} y={440} dir="up" s={0.95} sway={breathe(frame, fps, 1, 3)} /></Art>
        <Art id="arrow-left"><g transform={`translate(190 370) scale(${1 + 0.12 * lp})`} opacity={0.5 + 0.5 * lp}><circle r={58} fill={c.green} /><Arrow dir="left" s={1.0} /></g></Art>
        <Art id="arrow-right"><g transform={`translate(790 370) scale(${1 + 0.12 * rp})`} opacity={0.5 + 0.5 * rp}><circle r={58} fill={c.amber} /><Arrow dir="right" s={1.0} /></g></Art>
        <Art id="taxi"><TaxiTop x={q.x} y={q.y} rot={q.angle} s={0.9} /></Art>
      </StageIn>
      <Title delay={sec(0.3, fps)} gap={10}>
        <TextBox id="topic-en" style={{ ...big(70, c.text), whiteSpace: "normal", lineHeight: 1.12 }}>
          Directions &amp;<br />Road Navigation
        </TextBox>
        <TextBox id="topic-bn" style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 48, lineHeight: 1.3, color: c.muted, whiteSpace: "nowrap" }}>
          {cfg.topicBn}
        </TextBox>
      </Title>
    </SceneShell>
  );
};

/* -------------------------------------------------- outro 1 */
export const OutroComplete: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const ring = eased(frame, sec(0.3, fps), sec(1.5, fps), 0, 1, E.out);
  const tick = eased(frame, sec(1.2, fps), sec(1.9, fps), 0, 1, E.out);
  const pop = Math.min(enter(frame, fps, sec(1.2, fps), "pop"), 1.2);
  return (
    <SceneShell dur={scene.dur}>
      <StageIn>
        <rect width={SW} height={SH} fill={c.greenMist} />
        <Art id="check">
          <g transform={`translate(${SW / 2} 300) scale(${0.9 + 0.1 * pop})`}>
            <circle r={176} fill={c.green} opacity={0.14} />
            <circle r={148} fill={c.white} stroke={c.greenSoft} strokeWidth={14} />
            <circle r={148} fill="none" stroke={c.green} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${ring} 2`} transform="rotate(-90)" />
            <path d="M-62 4 L-18 48 L66 -46" fill="none" stroke={c.green} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${tick} 2`} />
          </g>
        </Art>
        {Array.from({ length: 10 }).map((_, i) => {
          const col = i % 5, row = Math.floor(i / 5);
          const a = Math.min(enter(frame, fps, sec(0.8, fps) + i * 5, "pop"), 1.1);
          return (
            <Art key={i} id={`dot-${i}`}>
              <g transform={`translate(${150 + col * 160} ${600 + row * 110}) scale(${a})`}>
                <circle r={40} fill={c.green} stroke={c.white} strokeWidth={6} />
                <path d="M-16 2 L-4 14 L18 -12" fill="none" stroke={c.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </Art>
          );
        })}
      </StageIn>
      <Title delay={sec(0.4, fps)} gap={18}>
        <TextBox id="ten" style={{ ...big(150, c.green) }}>10 / 10</TextBox>
        <Chip id="completed" tone="green" size={50}>{`Day ${cfg.episodeNumber} Completed`}</Chip>
      </Title>
    </SceneShell>
  );
};

/* -------------------------------------------------- outro 3 */
export const OutroFollow: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const m = Math.min(enter(frame, fps, 4, "pop"), 1.15);
  const heart = (i: number) => {
    const f = (((frame / fps) * 0.45 + i * 0.33) % 1);
    return { y: 560 - f * 360, o: Math.sin(f * Math.PI), x: [250, 470, 690][i] + Math.sin(f * 6 + i) * 24 };
  };
  return (
    <SceneShell dur={scene.dur}>
      <StageIn>
        <rect width={SW} height={SH} fill={c.greenMist} />
        {[0, 1].map((i) => <circle key={i} cx={SW / 2} cy={330} r={190 + i * 80 + breathe(frame, fps, 6, 3, i)} fill="none" stroke={c.green} strokeWidth={4} strokeDasharray="6 22" opacity={0.3} />)}
        <Art id="brand-mark">
          <g transform={`translate(${SW / 2} 330) scale(${2.5 * m}) translate(-50 -50)`}>
            <rect width="100" height="100" rx="26" fill={c.green} />
            <path d="M28 70 V46 Q28 34 40 34 H62" fill="none" stroke={c.white} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M58 18 L80 34 L58 50 Z" fill={c.amber} />
          </g>
        </Art>
        {[0, 1, 2].map((i) => {
          const h = heart(i);
          return (
            <Art key={i} id={`heart-${i}`} opacity={h.o}>
              <path transform={`translate(${h.x} ${h.y + 150}) scale(1.2)`} d="M0 18 C-34 -8 -26 -34 -8 -34 C-2 -34 0 -28 0 -26 C0 -28 2 -34 8 -34 C26 -34 34 -8 0 18 Z" fill={i === 1 ? c.amber : c.red} />
            </Art>
          );
        })}
        <Art id="comment-bubble">
          <g transform={`translate(${SW / 2} 690) scale(${m})`}>
            <rect x={-150} y={-60} width={300} height={120} rx={50} fill={c.white} stroke={c.green} strokeWidth={6} />
            <path d="M-40 56 L-62 96 L-6 58 Z" fill={c.white} stroke={c.green} strokeWidth={6} strokeLinejoin="round" />
            {[-60, 0, 60].map((x, i) => <circle key={i} cx={x} cy={0} r={13} fill={c.green} opacity={0.5 + 0.5 * Math.sin((frame / fps) * 6 - i)} />)}
          </g>
        </Art>
      </StageIn>
      <Title delay={sec(0.5, fps)} gap={22}>
        <TextBox id="cta-done" kind="cta" style={{ ...big(120, c.green) }}>{cfg.ctaText}</TextBox>
        <TextBox id="cta-follow" kind="cta" style={{ ...big(46, c.white), background: c.amber, borderRadius: 999, padding: "14px 40px", lineHeight: 1.2 }}>
          Follow Arabic Master
        </TextBox>
      </Title>
    </SceneShell>
  );
};

/* -------------------------------------------------- outro 4 */
export const OutroNext: React.FC<{ scene: BuiltScene }> = ({ scene }) => {
  const { frame, fps } = useF();
  const slide = Math.min(enter(frame, fps, 6, "enter"), 1.05);
  const chev = (i: number) => 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame / fps) * 5 - i * 1.1));
  const px = ((frame / fps) * 140) % 360;
  return (
    <SceneShell dur={scene.dur}>
      <StageIn>
        <rect width={SW} height={SH} fill={c.grass} />
        <rect y={420} width={SW} height={200} fill={c.road} />
        <line x1={0} y1={520} x2={SW} y2={520} stroke={c.white} strokeWidth={8} strokeDasharray="34 30" strokeLinecap="round" strokeDashoffset={-px} />
        <Palm x={120} y={340} s={0.8} sway={breathe(frame, fps, 4, 3)} />
        <Palm x={820} y={700} s={0.8} sway={breathe(frame, fps, 4, 3, 1)} />
        <Art id="teaser-card">
          <g transform={`translate(${SW / 2 + (1 - Math.min(slide, 1)) * 500} 210)`}>
            <rect x={-250} y={-130} width={500} height={240} rx={48} fill={c.white} stroke={c.green} strokeWidth={6} />
            <rect x={-220} y={-100} width={440} height={180} rx={32} fill={c.greenMist} />
            {[0, 1, 2].map((i) => <path key={i} d={`M${-90 + i * 80} -50 L${-40 + i * 80} -10 L${-90 + i * 80} 30`} fill="none" stroke={i === 2 ? c.amber : c.green} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" opacity={chev(i)} />)}
          </g>
        </Art>
        <Art id="taxi"><TaxiTop x={150 + ((frame / fps) * 150) % 760} y={500} rot={90} s={0.8} /></Art>
        <Art id="car-a"><g transform={`translate(${SW - 120 - ((frame / fps) * 90) % 600} 580) rotate(-90)`}><CarTop x={0} y={0} body={c.green} roof={c.greenSoft} brake={0} s={0.7} /></g></Art>
        <Art id="pin"><Pin x={760} y={770} s={0.7} /></Art>
        <Art id="flag"><DestFlag x={180} y={770} s={0.8} /></Art>
      </StageIn>
      <Title delay={sec(0.4, fps)} gap={14}>
        <TextBox id="next-day" style={{ ...big(160, c.green) }}>{`Day ${cfg.nextEpisodeNumber}`}</TextBox>
        <Chip id="coming-next" tone="amber" size={46}>Coming Next</Chip>
      </Title>
    </SceneShell>
  );
};

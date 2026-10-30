import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import type { IconId } from "../content";

const C = theme.colors;
const sw = 7; // stroke width for line art
const ink = { stroke: C.text, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const Sparkle: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <path d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14Z"
    transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={C.white} stroke={C.text} strokeWidth={4} strokeLinejoin="round" />
);

/** Flat vector icon (duotone: ink line + accent/mint fills). 240×240 box, animated with local frame. */
export const Icon: React.FC<{ id: IconId; size?: number; delay?: number }> = ({ id, size = 240, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  const pop = spring({ frame: f, fps, config: theme.spring.bouncy });
  const t = Math.max(0, f);
  const body = (() => {
    switch (id) {
      case "heart": {
        const beat = 1 + Math.max(0, Math.sin(t / 7)) ** 6 * 0.06;
        return (
          <>
            <g transform={`translate(120 120) scale(${beat}) translate(-120 -120)`}>
              <path d="M120 186 C58 146 48 96 82 82 C103 74 116 88 120 99 C124 88 137 74 158 82 C192 96 182 146 120 186Z" fill={C.accent} {...ink} />
              <path d="M84 100 C90 92 100 92 106 100" fill="none" stroke={C.white} strokeWidth={8} strokeLinecap="round" />
            </g>
            <Sparkle x={182} y={62 + Math.sin(t / 12) * 3} s={1.1} />
            <Sparkle x={58} y={72 - Math.sin(t / 10) * 3} s={0.8} r={15} />
          </>
        );
      }
      case "cake": {
        const flick = 1 + Math.sin(t / 3) * 0.08;
        return (
          <>
            <ellipse cx={120} cy={196} rx={78} ry={11} fill={C.primarySoft} stroke={C.text} strokeWidth={5} />
            <rect x={62} y={134} width={116} height={58} rx={16} fill={C.white} {...ink} />
            <rect x={74} y={104} width={92} height={34} rx={14} fill={C.accentSoft} {...ink} />
            <path d="M74 122 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0" fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            <rect x={115} y={70} width={10} height={34} rx={4} fill={C.white} {...ink} strokeWidth={5} />
            <path d="M120 38 C132 52 134 62 120 66 C106 62 108 52 120 38Z" fill={C.accent} {...ink} strokeWidth={5}
              transform={`translate(120 66) scale(${flick}) translate(-120 -66)`} />
          </>
        );
      }
      case "rings": {
        const r = Math.sin(t / 30) * 4;
        return (
          <>
            <g transform={`rotate(${-r} 100 140)`}><circle cx={96} cy={142} r={40} fill="none" stroke={C.text} strokeWidth={22} /><circle cx={96} cy={142} r={40} fill="none" stroke={C.accent} strokeWidth={10} /></g>
            <g transform={`rotate(${r} 150 130)`}><circle cx={146} cy={130} r={40} fill="none" stroke={C.text} strokeWidth={22} /><circle cx={146} cy={130} r={40} fill="none" stroke={C.white} strokeWidth={10} /></g>
            <path d="M82 78 L96 60 L114 60 L128 78 L105 104 Z" fill={C.white} {...ink} strokeWidth={5} />
            <path d="M82 78 H128 M96 60 L105 78 L114 60" fill="none" stroke={C.text} strokeWidth={4} strokeLinejoin="round" />
            <Sparkle x={160} y={66 + Math.sin(t / 9) * 3} s={0.9} />
          </>
        );
      }
      case "kids": {
        const kid = (x: number, h: number, fill: string, i: number) => {
          const bob = Math.sin(t / 10 + i * 1.6) * 5;
          return (
            <g key={i} transform={`translate(0 ${bob})`}>
              <path d={`M${x - 27} 200 v-${h * 0.55} a27 27 0 0 1 54 0 v${h * 0.55}z`} fill={fill} {...ink} strokeWidth={6} />
              <circle cx={x} cy={200 - h - 6} r={19} fill={C.white} {...ink} strokeWidth={6} />
            </g>
          );
        };
        return <>{kid(66, 76, C.primarySoft, 0)}{kid(120, 98, C.accent, 1)}{kid(174, 80, C.accentSoft, 2)}</>;
      }
      case "shield": {
        const glint = interpolate((t % 90) / 90, [0, 1], [-60, 260]);
        return (
          <>
            <path d="M120 36 L190 62 V118 C190 160 160 188 120 206 C80 188 50 160 50 118 V62 Z" fill={C.white} {...ink} />
            <clipPath id="shieldClip"><path d="M120 36 L190 62 V118 C190 160 160 188 120 206 C80 188 50 160 50 118 V62 Z" /></clipPath>
            <g clipPath="url(#shieldClip)"><rect x={glint} y={20} width={26} height={200} fill={C.accentSoft} opacity={0.85} transform={`skewX(-18)`} /></g>
            <path d="M120 164 C86 140 84 108 104 104 C112 102 118 108 120 112 C122 108 128 102 136 104 C156 108 154 140 120 164Z" fill={C.accent} {...ink} strokeWidth={5} />
          </>
        );
      }
      case "plane": {
        const fl = Math.sin(t / 16) * 7;
        return (
          <>
            <path d="M28 196 C60 170 70 206 104 176" fill="none" stroke={C.accent} strokeWidth={7} strokeLinecap="round" strokeDasharray="2 14" />
            <g transform={`translate(${fl} ${-fl})`}>
              <path d="M52 112 L206 48 L150 190 L118 142 Z" fill={C.white} {...ink} />
              <path d="M118 142 L206 48 L98 166 L118 142Z" fill={C.primarySoft} {...ink} strokeWidth={6} />
              <path d="M98 166 L118 142 L126 182 Z" fill={C.accent} {...ink} strokeWidth={6} />
            </g>
          </>
        );
      }
      case "calendar": {
        const p2 = 1 + Math.max(0, Math.sin(t / 8)) ** 8 * 0.07;
        return (
          <>
            <rect x={44} y={56} width={152} height={142} rx={22} fill={C.white} {...ink} />
            <path d="M44 100 V78 a22 22 0 0 1 22 -22 H174 a22 22 0 0 1 22 22 V100Z" fill={C.accent} {...ink} />
            <rect x={78} y={36} width={14} height={34} rx={7} fill={C.white} {...ink} strokeWidth={6} />
            <rect x={148} y={36} width={14} height={34} rx={7} fill={C.white} {...ink} strokeWidth={6} />
            <text x={120} y={172} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={700} fontSize={84} fill={C.text}
              transform={`translate(120 150) scale(${p2}) translate(-120 -150)`}>৫</text>
          </>
        );
      }
      case "cloud": {
        const dr = Math.sin(t / 26) * 6;
        return (
          <>
            <g transform={`rotate(${t * 0.6} 82 92)`}>
              {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={79} y={34} width={6} height={16} rx={3} fill={C.accent} transform={`rotate(${i * 45} 82 92)`} />)}
            </g>
            <circle cx={82} cy={92} r={26} fill={C.accent} {...ink} strokeWidth={6} />
            <g transform={`translate(${dr} 0)`}>
              <path d="M78 190 C44 190 40 146 74 142 C74 110 120 98 140 120 C170 106 200 132 188 158 C208 164 202 190 174 190 Z" fill={C.white} {...ink} />
            </g>
          </>
        );
      }
      case "sun": {
        const merc = interpolate(t, [0, 50], [30, 88], { extrapolateRight: "clamp", easing: theme.ease.out });
        return (
          <>
            <g transform={`rotate(${t * 0.9} 100 112)`}>
              {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={96} y={30} width={9} height={24} rx={4.5} fill={C.accent} stroke={C.text} strokeWidth={4} transform={`rotate(${i * 36} 100 112)`} />)}
            </g>
            <circle cx={100} cy={112} r={42} fill={C.accent} {...ink} />
            <path d="M80 104 C84 92 94 88 104 90" fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" />
            <rect x={168} y={46} width={30} height={118} rx={15} fill={C.white} {...ink} />
            <circle cx={183} cy={176} r={24} fill={C.white} {...ink} />
            <circle cx={183} cy={176} r={13} fill={C.accent} />
            <rect x={177} y={170 - merc * 0.9} width={12} height={merc * 0.9 + 6} rx={6} fill={C.accent} />
          </>
        );
      }
      case "sunrise": {
        const rise = interpolate(t, [0, 40], [46, 0], { extrapolateRight: "clamp", easing: theme.ease.out });
        return (
          <>
            <clipPath id="skyClip"><rect x={0} y={0} width={240} height={168} /></clipPath>
            <g clipPath="url(#skyClip)">
              <g transform={`translate(0 ${rise})`}>
                {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={116} y={52} width={9} height={26} rx={4.5} fill={C.accent} stroke={C.text} strokeWidth={4} transform={`rotate(${-90 + i * 30} 120 168) translate(0 0)`} />)}
                <circle cx={120} cy={168} r={52} fill={C.accent} {...ink} />
              </g>
            </g>
            <path d="M30 168 H210" stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
            <path d="M52 192 H188 M80 212 H160" stroke={C.primary} strokeWidth={7} strokeLinecap="round" opacity={0.55} />
          </>
        );
      }
    }
  })();
  const float = Math.sin(t / 30) * 5;
  return (
    <div style={{ width: size, height: size, transform: `translateY(${float}px) scale(${interpolate(pop, [0, 1], [0.5, 1])})`, opacity: interpolate(pop, [0, 0.5], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) }}>
      <svg viewBox="0 0 240 240" width={size} height={size} style={{ overflow: "visible" }}>
        <circle cx={120} cy={120} r={112} fill={C.primarySoft} opacity={0.7} />
        {body}
      </svg>
    </div>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import type { IconId } from "../content";

const C = theme.colors;
const sw = 7; // stroke width for clean line art
const ink = {
  stroke: C.text,
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Sparkle: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({
  x,
  y,
  s = 1,
  r = 0,
}) => (
  <path
    d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14Z"
    transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
    fill={C.white}
    stroke={C.text}
    strokeWidth={4}
    strokeLinejoin="round"
  />
);

/** Flat vector duotone icon (ink line + mint/amber fills). 240×240 box, animated with local frame. */
export const Icon: React.FC<{ id: IconId; size?: number; delay?: number }> = ({
  id,
  size = 240,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  const pop = spring({ frame: f, fps, config: theme.spring.bouncy });
  const t = Math.max(0, f);

  const body = (() => {
    switch (id) {
      case "battery": {
        const pulse = 0.5 + 0.5 * Math.sin(t / 6);
        return (
          <>
            {/* Battery body */}
            <rect x={44} y={74} width={136} height={92} rx={22} fill={C.white} {...ink} />
            {/* Terminal nub */}
            <path d="M182 104 C190 104 196 110 196 118 V122 C196 130 190 136 182 136" fill={C.text} {...ink} />
            {/* Low charge bar (flashing amber) */}
            <rect
              x={58}
              y={88}
              width={34}
              height={64}
              rx={12}
              fill={C.accent}
              opacity={0.6 + 0.4 * pulse}
              {...ink}
              strokeWidth={4}
            />
            {/* Exclamation badge */}
            <circle cx={146} cy={120} r={18} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
            <line x1={146} y1={110} x2={146} y2={122} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            <circle cx={146} cy={129} r={2.5} fill={C.text} />
            <Sparkle x={52} y={54} s={0.9} />
          </>
        );
      }

      case "charger": {
        const wobble = Math.sin(t / 8) * 4;
        return (
          <>
            {/* Charger plug head */}
            <g transform={`rotate(${wobble} 120 120)`}>
              <rect x={86} y={64} width={68} height={80} rx={18} fill={C.white} {...ink} />
              {/* Lightning pin */}
              <rect x={104} y={32} width={32} height={32} rx={6} fill={C.accentSoft} {...ink} strokeWidth={5} />
              <line x1={112} y1={42} x2={128} y2={42} stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
              <line x1={112} y1={50} x2={128} y2={50} stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
              {/* Cable coming down */}
              <path
                d="M120 144 C120 180 80 176 80 206 C80 220 95 226 120 226"
                fill="none"
                stroke={C.text}
                strokeWidth={sw}
                strokeLinecap="round"
              />
              {/* Apple-style spark */}
              <circle cx={120} cy={104} r={14} fill={C.primary} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={186} y={62} s={1.1} />
          </>
        );
      }

      case "wifi": {
        const pulse = Math.sin(t / 7);
        return (
          <>
            {/* Wi-Fi outer arc */}
            <path
              d="M44 94 C88 50 152 50 196 94"
              fill="none"
              stroke={C.text}
              strokeWidth={sw + 2}
              strokeLinecap="round"
            />
            {/* Wi-Fi mid arc */}
            <path
              d="M68 124 C98 94 142 94 172 124"
              fill="none"
              stroke={C.primary}
              strokeWidth={sw + 2}
              strokeLinecap="round"
            />
            {/* Wi-Fi inner arc */}
            <path
              d="M92 154 C108 138 132 138 148 154"
              fill="none"
              stroke={C.accent}
              strokeWidth={sw + 2}
              strokeLinecap="round"
            />
            {/* Bottom dot */}
            <circle cx={120} cy={184} r={14} fill={C.text} />
            {/* Key / password lock badge */}
            <g transform={`translate(160 140) scale(${1 + pulse * 0.05})`}>
              <rect x={0} y={16} width={38} height={30} rx={8} fill={C.white} {...ink} strokeWidth={5} />
              <path d="M10 16 V8 C10 3 28 3 28 8 V16" fill="none" stroke={C.text} strokeWidth={5} />
              <circle cx={19} cy={30} r={4} fill={C.accent} />
            </g>
          </>
        );
      }

      case "signal": {
        const alertBob = Math.sin(t / 5) * 3;
        return (
          <>
            {/* Signal base bar 1 (active - mint) */}
            <rect x={44} y={160} width={26} height={36} rx={8} fill={C.primary} {...ink} />
            {/* Bar 2 (dim outline) */}
            <rect x={82} y={130} width={26} height={66} rx={8} fill={C.white} stroke={C.line} strokeWidth={sw} />
            {/* Bar 3 (dim outline) */}
            <rect x={120} y={98} width={26} height={98} rx={8} fill={C.white} stroke={C.line} strokeWidth={sw} />
            {/* Bar 4 (dim outline) */}
            <rect x={158} y={64} width={26} height={132} rx={8} fill={C.white} stroke={C.line} strokeWidth={sw} />
            {/* Warning tag: Weak signal exclamation */}
            <g transform={`translate(140 ${40 + alertBob})`}>
              <circle cx={20} cy={20} r={24} fill={C.accent} {...ink} strokeWidth={5} />
              <line x1={20} y1={9} x2={20} y2={23} stroke={C.white} strokeWidth={5} strokeLinecap="round" />
              <circle cx={20} cy={31} r={3} fill={C.white} />
            </g>
          </>
        );
      }

      case "missedCall": {
        const ring = Math.sin(t / 4) * 6;
        return (
          <>
            {/* Phone handset */}
            <g transform={`translate(120 120) rotate(${ring - 25}) translate(-120 -120)`}>
              <path
                d="M74 86 C74 74 84 66 96 70 L112 76 C118 78 122 86 120 92 L114 104 C122 118 132 128 146 136 L158 130 C164 128 172 132 174 138 L180 154 C184 166 176 176 164 176 C114 176 74 136 74 86 Z"
                fill={C.white}
                {...ink}
              />
            </g>
            {/* Missed call incoming curved arrow */}
            <g transform="translate(136 54)">
              <circle cx={26} cy={26} r={28} fill={C.accentSoft} {...ink} strokeWidth={5} />
              <path
                d="M38 14 L14 38 M14 22 V38 H30"
                fill="none"
                stroke={C.accent}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </>
        );
      }

      case "silent": {
        return (
          <>
            {/* Bell body */}
            <path
              d="M120 54 C92 54 74 78 74 124 C74 150 62 164 54 168 H186 C178 164 166 150 166 124 C166 78 148 54 120 54 Z"
              fill={C.white}
              {...ink}
            />
            {/* Bell clapper */}
            <circle cx={120} cy={186} r={16} fill={C.accentSoft} {...ink} />
            {/* Silent slash stroke across */}
            <line
              x1={46}
              y1={196}
              x2={194}
              y2={48}
              stroke={C.accent}
              strokeWidth={sw + 3}
              strokeLinecap="round"
            />
            <Sparkle x={186} y={96} s={0.8} />
          </>
        );
      }

      case "location": {
        const float = Math.sin(t / 8) * 6;
        return (
          <>
            {/* Ground shadow ellipse */}
            <ellipse cx={120} cy={198} rx={44} ry={10} fill={C.primarySoft} opacity={0.7} />
            {/* Map pin */}
            <g transform={`translate(0 ${float})`}>
              <path
                d="M120 44 C88 44 64 68 64 100 C64 140 120 186 120 186 C120 186 176 140 176 100 C176 68 152 44 120 44 Z"
                fill={C.primary}
                {...ink}
              />
              <circle cx={120} cy={98} r={24} fill={C.white} {...ink} strokeWidth={5} />
              {/* WhatsApp badge */}
              <circle cx={120} cy={98} r={12} fill={C.accent} />
            </g>
            <Sparkle x={176} y={48} s={1} />
          </>
        );
      }

      case "photo": {
        const glance = Math.sin(t / 12) * 2;
        return (
          <>
            {/* Photo frame card */}
            <rect x={48} y={54} width={144} height={132} rx={22} fill={C.white} {...ink} />
            {/* Clip inner picture area */}
            <g clipPath="url(#photoClip)">
              <rect x={58} y={64} width={124} height={112} rx={14} fill={C.bg} />
              {/* Sun */}
              <circle cx={92} cy={94} r={16} fill={C.accent} />
              {/* Mountain hills */}
              <path d="M48 176 L100 124 L138 158 L160 138 L192 176 Z" fill={C.primarySoft} {...ink} strokeWidth={5} />
              <path d="M110 176 L144 138 L188 176 Z" fill={C.primary} {...ink} strokeWidth={5} />
            </g>
            <clipPath id="photoClip">
              <rect x={58} y={64} width={124} height={112} rx={14} />
            </clipPath>
            {/* Small corner eye badge */}
            <g transform={`translate(154 44) scale(${1 + glance * 0.05})`}>
              <circle cx={18} cy={18} r={20} fill={C.accentSoft} {...ink} strokeWidth={4} />
              <ellipse cx={18} cy={18} rx={10} ry={6} fill={C.white} {...ink} strokeWidth={3} />
              <circle cx={18} cy={18} r={3.5} fill={C.text} />
            </g>
          </>
        );
      }

      case "knock": {
        const knock = Math.sin(t / 3) > 0.5 ? 4 : 0;
        return (
          <>
            {/* Door outline */}
            <rect x={60} y={40} width={120} height={166} rx={16} fill={C.white} {...ink} />
            {/* Door upper panel */}
            <rect x={76} y={58} width={88} height={54} rx={8} fill={C.primarySoft} stroke={C.line} strokeWidth={4} />
            {/* Door lower panel */}
            <rect x={76} y={124} width={88} height={66} rx={8} fill={C.primarySoft} stroke={C.line} strokeWidth={4} />
            {/* Knocker ring & fist */}
            <circle cx={120} cy={86} r={14} fill={C.accentSoft} {...ink} strokeWidth={5} />
            {/* Knock sound shockwaves */}
            <g transform={`translate(${knock} 0)`}>
              <path d="M148 74 C158 80 158 92 148 98" fill="none" stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
              <path d="M158 66 C172 76 172 100 158 110" fill="none" stroke={C.primary} strokeWidth={6} strokeLinecap="round" />
            </g>
          </>
        );
      }

      case "door": {
        const open = interpolate(Math.min(1, t / 15), [0, 1], [0, 36]);
        return (
          <>
            {/* Door frame */}
            <rect x={54} y={38} width={132} height={170} rx={14} fill={C.bgAlt} {...ink} />
            {/* Warm light streaming through doorway */}
            <path d="M64 48 L176 48 L176 198 L64 198 Z" fill={C.accentSoft} />
            {/* Door swung open */}
            <path
              d={`M64 48 L${130 - open} 56 L${130 - open} 190 L64 198 Z`}
              fill={C.white}
              {...ink}
            />
            {/* Door knob */}
            <circle cx={124 - open} cy={126} r={7} fill={C.accent} {...ink} strokeWidth={4} />
            {/* Friendly visitor silhouette outside */}
            <circle cx={152} cy={96} r={14} fill={C.primary} />
            <path d="M136 146 C136 122 168 122 168 146 V180 H136 Z" fill={C.primary} />
          </>
        );
      }

      default:
        return null;
    }
  })();

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-block",
        transform: `scale(${pop})`,
        filter: `drop-shadow(0 14px 28px ${C.shadow})`,
      }}
    >
      <svg viewBox="0 0 240 240" width={size} height={size}>
        {body}
      </svg>
    </div>
  );
};


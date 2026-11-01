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
      // 21. Leave Politely — অনুমতি দিলে এবার আমি যাই
      case "leaveDoor": {
        const float = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Door Frame */}
              <rect x={64} y={44} width={96} height={152} rx={18} fill={C.primarySoft} {...ink} />
              {/* Open Door Panel */}
              <path
                d="M68 48 L132 62 L132 184 L68 192 Z"
                fill={C.white}
                {...ink}
              />
              {/* Door Handle */}
              <circle cx={118} cy={124} r={7} fill={C.accent} stroke={C.text} strokeWidth={4} />
              {/* Outgoing Arrow Badge */}
              <circle cx={166} cy={124} r={28} fill={C.primary} stroke={C.text} strokeWidth={5} />
              <path
                d="M154 124 L178 124 M168 114 L178 124 L168 134"
                fill="none"
                stroke={C.white}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <Sparkle x={48} y={64} s={1.0} />
            <Sparkle x={196} y={70} s={0.9} />
          </>
        );
      }

      // 22. Relax / Feel Comfortable — নিজের মতো আরাম করে থাকুন
      case "relaxCup": {
        const steam = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${steam * 0.6})`}>
              {/* Saucer */}
              <rect x={52} y={168} width={136} height={20} rx={10} fill={C.primarySoft} {...ink} />
              {/* Cup Handle */}
              <path
                d="M162 106 C190 106 190 150 162 150"
                fill="none"
                {...ink}
              />
              {/* Cup Body */}
              <path
                d="M66 92 L164 92 L156 154 C154 164 146 168 134 168 L96 168 C84 168 76 164 74 154 Z"
                fill={C.white}
                {...ink}
              />
              {/* Warm Tea band */}
              <rect x={80} y={114} width={70} height={28} rx={10} fill={C.accentSoft} stroke={C.text} strokeWidth={4} />
              {/* Steam lines */}
              <path
                d={`M98 ${76 + steam} C94 64 104 56 100 44`}
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <path
                d={`M130 ${76 - steam} C126 64 136 56 132 44`}
                fill="none"
                stroke={C.accent}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <Sparkle x={188} y={64} s={1.05} />
          </>
        );
      }

      // 23. My Home is Your Home — এটা তো আপনারই বাড়ি
      case "homeWelcome": {
        const pulse = 1 + 0.03 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${pulse}) translate(${120 * (1 - pulse)}, ${120 * (1 - pulse)})`}>
              {/* House Body */}
              <rect x={64} y={102} width={112} height={92} rx={16} fill={C.white} {...ink} />
              {/* Roof */}
              <path
                d="M46 108 L120 48 L194 108 Z"
                fill={C.primary}
                {...ink}
              />
              {/* Welcoming Arch Door */}
              <path
                d="M102 194 L102 146 C102 132 138 132 138 146 L138 194 Z"
                fill={C.accentSoft}
                stroke={C.text}
                strokeWidth={5}
              />
              {/* Warm Heart on Roof */}
              <circle cx={120} cy={92} r={14} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={52} y={64} s={1.0} />
            <Sparkle x={190} y={68} s={0.95} />
          </>
        );
      }

      // 24. Lit Up Jeddah — আপনার আসায় জেদ্দা আলোকিত হলো
      case "cityLight": {
        const float = Math.sin(t / 6) * 3.5;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Glowing Sun/Moon Halo */}
              <circle cx={120} cy={84} r={36} fill={C.accentSoft} stroke={C.text} strokeWidth={4} />
              {/* Left Building */}
              <rect x={56} y={114} width={42} height={78} rx={8} fill={C.primarySoft} {...ink} />
              {/* Center Tower */}
              <rect x={96} y={84} width={48} height={108} rx={10} fill={C.white} {...ink} />
              {/* Right Building */}
              <rect x={142} y={124} width={42} height={68} rx={8} fill={C.primary} {...ink} />
              {/* Tower Windows */}
              <rect x={110} y={104} width={20} height={16} rx={4} fill={C.accent} stroke={C.text} strokeWidth={3} />
              <rect x={110} y={132} width={20} height={16} rx={4} fill={C.primarySoft} stroke={C.text} strokeWidth={3} />
              {/* Base Line */}
              <line x1={44} y1={192} x2={196} y2={192} {...ink} />
            </g>
            <Sparkle x={62} y={62} s={1.1} />
            <Sparkle x={182} y={66} s={1.0} />
          </>
        );
      }

      // 25. The Light is Yours — এ আলো তো আপনারই
      case "sunGlow": {
        const rot = t * 0.8;
        return (
          <>
            <g transform={`translate(120, 120)`}>
              {/* Rotating Rays */}
              <g transform={`rotate(${rot})`}>
                {Array.from({ length: 8 }).map((_, idx) => (
                  <line
                    key={idx}
                    x1={0}
                    y1={-58}
                    x2={0}
                    y2={-78}
                    stroke={ idx % 2 === 0 ? C.accent : C.primary }
                    strokeWidth={7}
                    strokeLinecap="round"
                    transform={`rotate(${idx * 45})`}
                  />
                ))}
              </g>
              {/* Outer Glow Ring */}
              <circle cx={0} cy={0} r={46} fill={C.accentSoft} {...ink} />
              {/* Inner Core */}
              <circle cx={0} cy={0} r={28} fill={C.accent} stroke={C.text} strokeWidth={5} />
              <circle cx={-8} cy={-8} r={6} fill={C.white} />
            </g>
            <Sparkle x={52} y={60} s={1.0} />
            <Sparkle x={190} y={176} s={0.95} />
          </>
        );
      }

      // 26. Do You Speak Arabic? — আপনি কি আরবি বলতে পারেন?
      case "speakArabic": {
        const bounce = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${bounce})`}>
              {/* Back Bubble */}
              <rect x={86} y={56} width={104} height={76} rx={24} fill={C.primarySoft} {...ink} />
              {/* Front Speech Bubble */}
              <path
                d="M50 96 C50 82 62 72 76 72 L144 72 C158 72 170 82 170 96 L170 144 C170 158 158 168 144 168 L94 168 L68 190 L72 168 C58 166 50 156 50 144 Z"
                fill={C.white}
                {...ink}
              />
              {/* Arabic "ع" / Question Badge inside */}
              <circle cx={110} cy={120} r={28} fill={C.primary} stroke={C.text} strokeWidth={5} />
              <text
                x={110}
                y={132}
                textAnchor="middle"
                fill={C.white}
                fontSize={34}
                fontWeight={700}
                fontFamily={theme.fonts.arabic}
              >
                ع؟
              </text>
            </g>
            <Sparkle x={192} y={154} s={1.05} />
          </>
        );
      }

      // 27. Just a Little Bit — অল্প অল্প পারি
      case "littleBit": {
        const float = Math.sin(t / 6) * 3.5;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Gauge Card */}
              <rect x={48} y={62} width={144} height={120} rx={28} fill={C.white} {...ink} />
              {/* 3 Level Bars (1st lit, 2nd half, 3rd dim) */}
              <rect x={74} y={132} width={22} height={28} rx={6} fill={C.primary} stroke={C.text} strokeWidth={4} />
              <rect x={109} y={110} width={22} height={50} rx={6} fill={C.accent} stroke={C.text} strokeWidth={4} />
              <rect x={144} y={86} width={22} height={74} rx={6} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Small Badge */}
              <circle cx={85} cy={94} r={14} fill={C.accentSoft} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={46} y={56} s={1.0} />
            <Sparkle x={194} y={68} s={0.95} />
          </>
        );
      }

      // 28. Your Speech is Clear — আপনার কথা পরিষ্কার
      case "clearSpeech": {
        const pulse = 1 + 0.035 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${pulse}) translate(${120 * (1 - pulse)}, ${120 * (1 - pulse)})`}>
              {/* Crystal Speech Bubble */}
              <rect x={52} y={60} width={136} height={110} rx={30} fill={C.white} {...ink} />
              {/* Sound Wave Bars */}
              <line x1={82} y1={115} x2={82} y2={95} stroke={C.primary} strokeWidth={7} strokeLinecap="round" />
              <line x1={106} y1={130} x2={106} y2={82} stroke={C.primaryDeep} strokeWidth={7} strokeLinecap="round" />
              <line x1={130} y1={124} x2={130} y2={88} stroke={C.accent} strokeWidth={7} strokeLinecap="round" />
              <line x1={154} y1={115} x2={154} y2={95} stroke={C.primary} strokeWidth={7} strokeLinecap="round" />
              {/* Checkmark Badge */}
              <circle cx={168} cy={158} r={24} fill={C.primary} stroke={C.text} strokeWidth={5} />
              <path
                d="M158 158 L165 166 L179 150"
                fill="none"
                stroke={C.white}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <Sparkle x={188} y={56} s={1.1} />
          </>
        );
      }

      // 29. Did You Understand Me? — আমার কথা বুঝেছেন?
      case "questionBubble": {
        const sway = Math.sin(t / 6) * 3.5;
        return (
          <>
            <g transform={`translate(0, ${sway})`}>
              {/* Left Bubble */}
              <rect x={48} y={64} width={116} height={92} rx={26} fill={C.white} {...ink} />
              {/* Question Mark Badge */}
              <circle cx={106} cy={110} r={26} fill={C.accent} stroke={C.text} strokeWidth={5} />
              <text
                x={106}
                y={123}
                textAnchor="middle"
                fill={C.text}
                fontSize={38}
                fontWeight={800}
                fontFamily={theme.fonts.display}
              >
                ?
              </text>
              {/* Reply Mini Bubble */}
              <rect x={128} y={134} width={66} height={50} rx={18} fill={C.primarySoft} {...ink} />
              <circle cx={148} cy={159} r={5} fill={C.primaryDeep} />
              <circle cx={162} cy={159} r={5} fill={C.primaryDeep} />
              <circle cx={176} cy={159} r={5} fill={C.primaryDeep} />
            </g>
            <Sparkle x={186} y={64} s={1.05} />
          </>
        );
      }

      // 30. Yes, I Understood You — হ্যাঁ, আপনার কথা বুঝেছি
      case "understoodCheck": {
        const popScale = 1 + 0.035 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${popScale}) translate(${120 * (1 - popScale)}, ${120 * (1 - popScale)})`}>
              {/* Outer Shield / Circle */}
              <circle cx={120} cy={120} r={66} fill={C.white} {...ink} />
              <circle cx={120} cy={120} r={48} fill={C.primary} stroke={C.text} strokeWidth={5} />
              {/* Bold Checkmark */}
              <path
                d="M98 122 L114 138 L144 104"
                fill="none"
                stroke={C.white}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Amber Accent Star */}
              <circle cx={172} cy={68} r={18} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={52} y={66} s={1.1} />
            <Sparkle x={190} y={168} s={0.95} />
          </>
        );
      }
    }
  })();

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
        opacity: interpolate(pop, [0, 0.4], [0, 1]),
      }}
    >
      <svg viewBox="0 0 240 240" width={size} height={size} fill="none">
        {body}
      </svg>
    </div>
  );
};


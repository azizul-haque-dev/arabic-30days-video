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
      // 101. Price Tag — এটার দাম কত?
      case "priceTag": {
        const swing = Math.sin(t / 7) * 4;
        return (
          <>
            <g transform={`rotate(${swing} 120 55)`}>
              {/* Tag loop string */}
              <path d="M120 32 C108 32 102 44 112 56" fill="none" {...ink} strokeWidth={5} />
              {/* Price Tag body */}
              <path
                d="M72 78 L120 46 L168 78 L168 188 C168 198 160 206 150 206 L90 206 C80 206 72 198 72 188 Z"
                fill={C.white}
                {...ink}
              />
              {/* Tag hole */}
              <circle cx={120} cy={72} r={9} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Question / Price Circle */}
              <circle cx={120} cy={132} r={32} fill={C.primarySoft} stroke={C.text} strokeWidth={5} />
              <path
                d="M111 122 C111 113 129 113 129 124 C129 131 120 133 120 140"
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={6}
                strokeLinecap="round"
              />
              <circle cx={120} cy={151} r={3.5} fill={C.primaryDeep} />
              {/* Bottom barcode lines */}
              <line x1={94} y1={182} x2={146} y2={182} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
            </g>
            <Sparkle x={186} y={64} s={1.1} />
          </>
        );
      }

      // 102. Expensive — এটা অনেক দামি
      case "expensive": {
        const float = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Luxury Gem / Price Card */}
              <rect x={56} y={64} width={128} height={128} rx={28} fill={C.white} {...ink} />
              {/* Gem Polygon inside */}
              <polygon
                points="92,102 148,102 164,124 120,168 76,124"
                fill={C.accentSoft}
                stroke={C.text}
                strokeWidth={5}
                strokeLinejoin="round"
              />
              <line x1={76} y1={124} x2={164} y2={124} stroke={C.text} strokeWidth={4} />
              {/* Upward High-Price Arrow Badge */}
              <circle cx={172} cy={72} r={26} fill={C.accent} stroke={C.text} strokeWidth={5} />
              <path
                d="M172 84 L172 60 M162 69 L172 59 L182 69"
                fill="none"
                stroke={C.text}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <Sparkle x={52} y={56} s={1.0} />
            <Sparkle x={194} y={130} s={0.9} />
          </>
        );
      }

      // 103. Discount / Lower price — দামটা একটু কমান
      case "discount": {
        const drop = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${drop})`}>
              {/* Main Tag Card */}
              <rect x={54} y={54} width={132} height={136} rx={26} fill={C.white} {...ink} />
              {/* Soft mint inner banner */}
              <rect x={72} y={74} width={96} height={46} rx={12} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <line x1={88} y1={97} x2={152} y2={97} stroke={C.primaryDeep} strokeWidth={5} strokeLinecap="round" />
              {/* Downward Arrow Circle */}
              <circle cx={120} cy={154} r={26} fill={C.primary} stroke={C.text} strokeWidth={5} />
              <path
                d="M120 141 L120 166 M110 157 L120 167 L130 157"
                fill="none"
                stroke={C.white}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Amber corner badge */}
              <circle cx={176} cy={64} r={16} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={46} y={76} s={1.0} />
          </>
        );
      }

      // 104. Final Price — শেষ দাম কত?
      case "finalPrice": {
        const pulse = 1 + 0.035 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${pulse}) translate(${120 * (1 - pulse)}, ${120 * (1 - pulse)})`}>
              {/* Outer Seal / Deal Badge */}
              <circle cx={120} cy={120} r={74} fill={C.white} {...ink} />
              <circle cx={120} cy={120} r={54} fill={C.primarySoft} stroke={C.text} strokeWidth={5} />
              {/* Checkmark + Final Lock */}
              <path
                d="M96 122 L113 139 L146 104"
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Bottom ribbon */}
              <rect x={82} y={176} width={76} height={26} rx={13} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={186} y={58} s={1.1} />
          </>
        );
      }

      // 105. Bigger Size — আপনার কাছে বড় size আছে?
      case "sizeUp": {
        const grow = 1 + 0.04 * Math.sin(t / 6);
        return (
          <>
            <g transform={`scale(${grow}) translate(${120 * (1 - grow)}, ${120 * (1 - grow)})`}>
              {/* T-Shirt Silhouette */}
              <path
                d="M78 62 L98 62 C104 74 136 74 142 62 L162 62 L192 92 L172 116 L156 102 L156 188 L84 188 L84 102 L68 116 L48 92 Z"
                fill={C.white}
                {...ink}
              />
              {/* Expand / Plus Badge */}
              <circle cx={120} cy={128} r={26} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <line x1={120} y1={114} x2={120} y2={142} stroke={C.primaryDeep} strokeWidth={6} strokeLinecap="round" />
              <line x1={106} y1={128} x2={134} y2={128} stroke={C.primaryDeep} strokeWidth={6} strokeLinecap="round" />
              {/* Amber size tag */}
              <rect x={150} y={44} width={44} height={28} rx={10} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={52} y={52} s={1.0} />
          </>
        );
      }

      // 106. Smaller Size — আমি ছোট size চাই
      case "sizeDown": {
        const shrink = 1 - 0.035 * Math.sin(t / 6);
        return (
          <>
            <g transform={`scale(${shrink}) translate(${120 * (1 - shrink)}, ${120 * (1 - shrink)})`}>
              {/* Compact T-Shirt Silhouette */}
              <path
                d="M82 68 L100 68 C105 78 135 78 140 68 L158 68 L184 94 L166 116 L152 104 L152 182 L88 182 L88 104 L74 116 L56 94 Z"
                fill={C.primarySoft}
                {...ink}
              />
              {/* Inner Minus / Small Badge */}
              <circle cx={120} cy={130} r={24} fill={C.white} stroke={C.text} strokeWidth={4} />
              <line x1={108} y1={130} x2={132} y2={130} stroke={C.primaryDeep} strokeWidth={6} strokeLinecap="round" />
              {/* Inward arrows */}
              <path d="M44 130 L64 130 M56 122 L65 130 L56 138" fill="none" stroke={C.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M196 130 L176 130 M184 122 L175 130 L184 138" fill="none" stroke={C.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <Sparkle x={182} y={56} s={1.0} />
          </>
        );
      }

      // 107. Dislike — এটা আমার পছন্দ হচ্ছে না
      case "dislike": {
        const shake = Math.sin(t / 5) * 3;
        return (
          <>
            <g transform={`translate(${shake}, 0)`}>
              {/* Product Card */}
              <rect x={58} y={52} width={124} height={138} rx={26} fill={C.white} {...ink} />
              <rect x={76} y={72} width={88} height={54} rx={14} fill={C.bgAlt} stroke={C.text} strokeWidth={4} />
              {/* Polite Cross Circle */}
              <circle cx={120} cy={154} r={24} fill={C.accentSoft} stroke={C.text} strokeWidth={5} />
              <line x1={110} y1={144} x2={130} y2={164} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
              <line x1={130} y1={144} x2={110} y2={164} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            </g>
            <Sparkle x={188} y={66} s={0.9} />
          </>
        );
      }

      // 108. Another Color — আপনাদের কাছে অন্য রং আছে?
      case "colorPalette": {
        const fan = Math.sin(t / 7) * 4;
        return (
          <>
            {/* Back Swatch (Amber) */}
            <g transform={`rotate(${-18 - fan} 90 185)`}>
              <rect x={68} y={54} width={56} height={136} rx={16} fill={C.accent} {...ink} />
            </g>
            {/* Middle Swatch (Soft Mint) */}
            <g transform={`rotate(${2} 90 185)`}>
              <rect x={86} y={50} width={56} height={136} rx={16} fill={C.primarySoft} {...ink} />
            </g>
            {/* Front Swatch (Hero Emerald + White) */}
            <g transform={`rotate(${22 + fan} 90 185)`}>
              <rect x={104} y={54} width={58} height={136} rx={16} fill={C.white} {...ink} />
              <rect x={114} y={66} width={38} height={72} rx={10} fill={C.primary} stroke={C.text} strokeWidth={4} />
              <circle cx={133} cy={166} r={7} fill={C.text} />
            </g>
            <Sparkle x={188} y={58} s={1.1} />
          </>
        );
      }

      // 109. Try On — আমি এটা try করতে চাই
      case "tryOn": {
        const sway = Math.sin(t / 7) * 3;
        return (
          <>
            <g transform={`rotate(${sway} 120 60)`}>
              {/* Hanger Hook */}
              <path
                d="M120 44 C134 44 142 54 134 66 C128 74 120 76 120 86"
                fill="none"
                {...ink}
              />
              {/* Hanger Triangle */}
              <path
                d="M46 136 L120 86 L194 136 C198 140 195 148 188 148 L52 148 C45 148 42 140 46 136 Z"
                fill={C.white}
                {...ink}
              />
              {/* Draped Garment Tag */}
              <rect x={78} y={136} width={84} height={60} rx={16} fill={C.primarySoft} stroke={C.text} strokeWidth={5} />
              <path
                d="M106 166 L116 176 L136 156"
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <Sparkle x={186} y={68} s={1.1} />
          </>
        );
      }

      // 110. Fitting Room — ট্রায়াল রুম কোথায়?
      case "fittingRoom": {
        const float = Math.sin(t / 7) * 3;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Booth Frame */}
              <rect x={58} y={46} width={124} height={154} rx={18} fill={C.white} {...ink} />
              {/* Curtain Rod */}
              <line x1={58} y1={72} x2={182} y2={72} stroke={C.text} strokeWidth={6} />
              {/* Left & Right Curtains */}
              <path d="M62 72 L106 72 L92 196 L62 196 Z" fill={C.primarySoft} stroke={C.text} strokeWidth={5} strokeLinejoin="round" />
              <path d="M134 72 L178 72 L178 196 L148 196 Z" fill={C.primarySoft} stroke={C.text} strokeWidth={5} strokeLinejoin="round" />
              {/* Location Pin in Center */}
              <path
                d="M120 98 C104 98 94 110 94 124 C94 142 120 166 120 166 C120 166 146 142 146 124 C146 110 136 98 120 98 Z"
                fill={C.accent}
                stroke={C.text}
                strokeWidth={5}
                strokeLinejoin="round"
              />
              <circle cx={120} cy={122} r={8} fill={C.white} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={192} y={56} s={1.1} />
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


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
      // 111. Only This — শুধু এটা দিন
      case "onlyThis": {
        const float = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Selected Item Box */}
              <rect x={56} y={56} width={128} height={132} rx={26} fill={C.white} {...ink} />
              <rect x={76} y={76} width={88} height={52} rx={14} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Number "1" / Single item indicator inside */}
              <circle cx={120} cy={156} r={22} fill={C.primary} stroke={C.text} strokeWidth={5} />
              <path
                d="M108 156 L117 165 L133 148"
                fill="none"
                stroke={C.white}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Amber highlight badge */}
              <circle cx={176} cy={64} r={18} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={48} y={66} s={1.0} />
            <Sparkle x={192} y={126} s={0.9} />
          </>
        );
      }

      // 112. Shopping Bag — দয়া করে একটা ব্যাগ দিন
      case "shoppingBag": {
        const swing = Math.sin(t / 7) * 3.5;
        return (
          <>
            <g transform={`rotate(${swing} 120 70)`}>
              {/* Bag Handles */}
              <path
                d="M92 86 L92 64 C92 46 148 46 148 64 L148 86"
                fill="none"
                {...ink}
              />
              {/* Bag Body */}
              <path
                d="M62 84 L178 84 L190 192 C191 200 184 206 176 206 L64 206 C56 206 49 200 50 192 Z"
                fill={C.white}
                {...ink}
              />
              {/* Mint decorative stripe */}
              <rect x={68} y={118} width={104} height={58} rx={16} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Amber tag */}
              <circle cx={154} cy={104} r={14} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={188} y={62} s={1.1} />
          </>
        );
      }

      // 113. Credit Card — আপনারা কি কার্ড গ্রহণ করেন?
      case "creditCard": {
        const tilt = Math.sin(t / 7) * 3;
        return (
          <>
            <g transform={`rotate(${tilt} 120 120)`}>
              {/* Back Card Shadow */}
              <rect x={54} y={64} width={144} height={96} rx={18} fill={C.primarySoft} {...ink} />
              {/* Front Credit Card */}
              <rect x={42} y={84} width={148} height={98} rx={18} fill={C.white} {...ink} />
              {/* Magnetic stripe */}
              <rect x={42} y={104} width={148} height={22} fill={C.primary} stroke={C.text} strokeWidth={4} />
              {/* EMV Chip */}
              <rect x={62} y={140} width={32} height={24} rx={6} fill={C.accent} stroke={C.text} strokeWidth={4} />
              {/* Card digits line */}
              <line x1={108} y1={154} x2={168} y2={154} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
            </g>
            <Sparkle x={192} y={56} s={1.0} />
          </>
        );
      }

      // 114. Cash Payment — আমি নগদ দেব
      case "cashPay": {
        const float = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Back Banknote */}
              <rect x={54} y={64} width={142} height={86} rx={16} fill={C.primarySoft} {...ink} />
              {/* Front Banknote */}
              <rect x={42} y={86} width={146} height={88} rx={16} fill={C.white} {...ink} />
              {/* Inner center medallion */}
              <circle cx={115} cy={130} r={24} fill={C.primary} stroke={C.text} strokeWidth={5} />
              <circle cx={115} cy={130} r={10} fill={C.white} />
              {/* Corner accents */}
              <circle cx={64} cy={108} r={6} fill={C.accent} />
              <circle cx={166} cy={152} r={6} fill={C.accent} />
              {/* Gold Coin Overlay */}
              <circle cx={176} cy={166} r={26} fill={C.accent} stroke={C.text} strokeWidth={5} />
              <path d="M168 166 L184 166 M176 158 L176 174" stroke={C.text} strokeWidth={4} strokeLinecap="round" />
            </g>
            <Sparkle x={48} y={58} s={1.0} />
          </>
        );
      }

      // 115. Small Change / Coins — আপনার কাছে খুচরা আছে?
      case "changeCoins": {
        const bounce = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${bounce})`}>
              {/* Left Big Coin */}
              <circle cx={88} cy={132} r={42} fill={C.white} {...ink} />
              <circle cx={88} cy={132} r={26} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Right Top Coin */}
              <circle cx={158} cy={92} r={28} fill={C.accent} {...ink} />
              <circle cx={158} cy={92} r={14} fill={C.accentSoft} stroke={C.text} strokeWidth={3} />
              {/* Right Bottom Coin */}
              <circle cx={154} cy={164} r={30} fill={C.primary} {...ink} />
              <circle cx={154} cy={164} r={15} fill={C.white} stroke={C.text} strokeWidth={3} />
              {/* Exchange Arrow */}
              <path
                d="M110 66 C122 52 140 52 150 62"
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <Sparkle x={54} y={64} s={1.0} />
            <Sparkle x={196} y={128} s={0.95} />
          </>
        );
      }

      // 116. Keep the Change — বাকিটা আপনার
      case "keepChange": {
        const pulse = 1 + 0.035 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${pulse}) translate(${120 * (1 - pulse)}, ${120 * (1 - pulse)})`}>
              {/* Gift / Tip Card */}
              <rect x={54} y={66} width={132} height={116} rx={26} fill={C.white} {...ink} />
              {/* Coin inside */}
              <circle cx={120} cy={124} r={34} fill={C.accent} stroke={C.text} strokeWidth={5} />
              {/* Checkmark inside coin */}
              <path
                d="M106 124 L116 134 L135 114"
                fill="none"
                stroke={C.text}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Mint top pill */}
              <rect x={88} y={48} width={64} height={28} rx={14} fill={C.primary} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={188} y={60} s={1.1} />
          </>
        );
      }

      // 117. Receipt / Invoice — আমি রসিদ চাই
      case "receipt": {
        const float = Math.sin(t / 6) * 4;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Paper Receipt with zigzag bottom */}
              <path
                d="M68 46 L172 46 C178 46 182 50 182 56 L182 192 L166 180 L150 192 L134 180 L120 192 L106 180 L90 192 L74 180 L58 192 L58 56 C58 50 62 46 68 46 Z"
                fill={C.white}
                {...ink}
              />
              {/* Header badge */}
              <rect x={80} y={68} width={80} height={24} rx={8} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Receipt lines */}
              <line x1={80} y1={114} x2={136} y2={114} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
              <line x1={152} y1={114} x2={162} y2={114} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
              <line x1={80} y1={136} x2={126} y2={136} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
              <line x1={152} y1={136} x2={162} y2={136} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
              <line x1={80} y1={158} x2={160} y2={158} stroke={C.primary} strokeWidth={6} strokeLinecap="round" />
            </g>
            <Sparkle x={194} y={66} s={1.0} />
          </>
        );
      }

      // 118. Warranty Shield — এটার কি ওয়ারেন্টি আছে?
      case "warrantyShield": {
        const pulse = 1 + 0.035 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${pulse}) translate(${120 * (1 - pulse)}, ${120 * (1 - pulse)})`}>
              {/* Shield Body */}
              <path
                d="M120 44 L182 68 L182 122 C182 162 154 190 120 204 C86 190 58 162 58 122 L58 68 Z"
                fill={C.white}
                {...ink}
              />
              {/* Inner Shield Fill */}
              <path
                d="M120 64 L164 82 L164 120 C164 150 144 172 120 183 C96 172 76 150 76 120 L76 82 Z"
                fill={C.primarySoft}
                stroke={C.text}
                strokeWidth={4}
                strokeLinejoin="round"
              />
              {/* Checkmark inside shield */}
              <path
                d="M100 122 L114 136 L142 106"
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Amber star badge */}
              <circle cx={172} cy={62} r={16} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={48} y={62} s={1.0} />
          </>
        );
      }

      // 119. Return Item — আমি এটা ফেরত দিতে চাই
      case "returnBox": {
        const sway = Math.sin(t / 6) * 3.5;
        return (
          <>
            <g transform={`translate(0, ${sway})`}>
              {/* Parcel Box */}
              <rect x={58} y={68} width={124} height={120} rx={22} fill={C.white} {...ink} />
              {/* Box Tape */}
              <rect x={106} y={68} width={28} height={46} fill={C.accentSoft} stroke={C.text} strokeWidth={4} />
              {/* Return U-Turn Arrow Badge */}
              <circle cx={120} cy={146} r={28} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <path
                d="M132 146 C132 134 110 134 106 144 M104 134 L104 146 L116 146"
                fill="none"
                stroke={C.primaryDeep}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <Sparkle x={188} y={62} s={1.1} />
          </>
        );
      }

      // 120. Discount Today — আজ কি কোনো ছাড় / ডিসকাউন্ট আছে?
      case "discountTag": {
        const swing = Math.sin(t / 7) * 4;
        return (
          <>
            <g transform={`rotate(${swing} 120 55)`}>
              {/* Tag Body */}
              <path
                d="M66 80 L120 44 L174 80 L174 188 C174 198 166 206 156 206 L84 206 C74 206 66 198 66 188 Z"
                fill={C.white}
                {...ink}
              />
              {/* Tag Hole */}
              <circle cx={120} cy={70} r={8} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              {/* Percent Badge */}
              <circle cx={120} cy={138} r={38} fill={C.accentSoft} stroke={C.text} strokeWidth={5} />
              <line x1={104} y1={154} x2={136} y2={122} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
              <circle cx={106} cy={124} r={6} fill={C.primary} stroke={C.text} strokeWidth={3} />
              <circle cx={134} cy={152} r={6} fill={C.primary} stroke={C.text} strokeWidth={3} />
            </g>
            <Sparkle x={188} y={62} s={1.1} />
            <Sparkle x={50} y={120} s={0.95} />
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


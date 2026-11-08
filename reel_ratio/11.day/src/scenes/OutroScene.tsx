import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, springOf } from "../theme";
import { episodeConfig as cfg, progress } from "../config/episode";
import { BrandBar, BrandLockup, CaptionStack, Card, Enter, LogoMark, Pill, ProgressRing, SceneShell } from "../components/primitives";
import { Sparkle } from "../illustrations/kit";
import type { SceneTiming } from "../types/episode";

const c = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lineText = (id: string) => cfg.outro.lines.find((l) => l.id === id)!.text;

const CheckBadge: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springOf(frame, fps, delay, "pop");
  const draw = interpolate(frame - delay - 6, [0, 16], [1, 0], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ transform: `scale(${interpolate(p, [0, 1], [0.2, 1])}) rotate(${(1 - p) * -30}deg)`, opacity: Math.min(1, p * 2) }}>
      <svg width={170} height={170} viewBox="0 0 170 170">
        <circle cx={85} cy={85} r={78} fill={c.primary} />
        <circle cx={85} cy={85} r={78} fill="none" stroke={c.white} strokeWidth={6} opacity={0.35} />
        <path d="M 48 88 L 76 116 L 125 58" fill="none" stroke={c.white} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * draw} />
      </svg>
    </div>
  );
};

/** Deterministic confetti burst (no randomness). */
const Confetti: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const cols = [c.accent, c.primary, c.sky, c.rose, c.violet];
  return (
    <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 120, pointerEvents: "none" }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2 + (i % 2) * 0.2;
        const k = interpolate(frame - delay, [0, 34], [0, 1], { easing: theme.ease.out, ...clamp });
        const r = 170 + (i % 3) * 70;
        const op = interpolate(frame - delay, [20, 46], [1, 0], clamp);
        return (
          <rect
            key={i}
            x={540 + Math.cos(a) * r * k - 9}
            y={300 + Math.sin(a) * r * k - 9 + k * 30}
            width={18}
            height={i % 2 ? 18 : 30}
            rx={5}
            fill={cols[i % cols.length]}
            opacity={op}
            transform={`rotate(${i * 40 + k * 200} ${540 + Math.cos(a) * r * k} ${300 + Math.sin(a) * r * k})`}
          />
        );
      })}
    </svg>
  );
};

const FollowCard: React.FC<{ clickAt: number }> = ({ clickAt }) => {
  const frame = useCurrentFrame();
  const isClicked = frame >= clickAt + 3;

  // Cursor glide-in, press down, glide-out:
  const cursorProgress = interpolate(frame, [clickAt - 16, clickAt], [0, 1], clamp);
  const cursorExit = interpolate(frame, [clickAt + 8, clickAt + 22], [0, 1], clamp);
  const cursorPress = interpolate(frame, [clickAt, clickAt + 3, clickAt + 7], [1, 0.82, 1], clamp);

  // Button bounce on click:
  const buttonScale =
    frame < clickAt
      ? 1
      : interpolate(
          frame,
          [clickAt, clickAt + 3, clickAt + 8, clickAt + 14],
          [1, 0.88, 1.06, 1],
          clamp,
        );

  // Click ripple:
  const rippleK = interpolate(frame, [clickAt + 2, clickAt + 16], [0, 1], clamp);
  const rippleOp = interpolate(frame, [clickAt + 2, clickAt + 5, clickAt + 16], [0, 0.7, 0], clamp);

  return (
    <Card style={{ padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 190, position: "relative" }}>
      <BrandLockup name={cfg.brandName} size={84} />
      <div style={{ position: "relative" }}>
        {/* Follow Button with dynamic click state */}
        <div
          style={{
            transform: `scale(${buttonScale})`,
            background: isClicked ? c.mint : c.primary,
            border: isClicked ? `3px solid ${c.primary}` : `3px solid transparent`,
            color: isClicked ? c.primaryDark : c.white,
            borderRadius: theme.radius.pill,
            padding: "16px 36px",
            fontFamily: theme.fonts.en,
            fontSize: 42,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            boxShadow: isClicked ? "none" : `0 10px 24px ${c.shadow}`,
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {isClicked ? (
            <>
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Following</span>
            </>
          ) : (
            <>
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Follow</span>
            </>
          )}
        </div>

        {/* Click ripple circle */}
        {frame >= clickAt + 2 && frame < clickAt + 18 && (
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: theme.radius.pill,
              border: `4px solid ${c.primary}`,
              transform: `scale(${1 + rippleK * 0.35})`,
              opacity: rippleOp,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Cursor arrow tapping the button */}
        {frame >= clickAt - 16 && frame < clickAt + 22 && (
          <div
            style={{
              position: "absolute",
              right: 18 - (1 - cursorProgress) * 36 + cursorExit * 28,
              top: 22 + (1 - cursorProgress) * 40 + cursorExit * 32,
              opacity: Math.min(cursorProgress * 2, (1 - cursorExit) * 2),
              transform: `scale(${cursorPress})`,
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <svg width={50} height={50} viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36Z"
                fill="#10231D"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};

/** 15 — Episode outro */
export const OutroScene: React.FC<{ timing: SceneTiming }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const L = timing.lines;
  const chipsOut = Number.isFinite(L.follow)
    ? interpolate(frame, [L.follow - 6, L.follow], [0, 1], clamp)
    : 0;
  const showChips = frame >= L.practice - 2 && frame < L.follow;
  const prev = progress.previous;

  // The click effect fires when the speaker says "ফলো করুন" (~75 frames into the follow line):
  const followClickAt = L.follow + 75;

  const cards: { id: string; at: number; node: React.ReactNode }[] = [
    {
      id: "follow",
      at: L.follow,
      node: <FollowCard clickAt={followClickAt} />,
    },
    {
      id: "comment",
      at: L.comment,
      node: (
        <Card style={{ padding: "28px 40px", display: "flex", alignItems: "center", gap: 28, height: 190 }}>
          <svg width={92} height={92} viewBox="0 0 92 92">
            <path d="M 14 12 h 64 a 12 12 0 0 1 12 12 v 34 a 12 12 0 0 1 -12 12 h -36 l -22 18 v -18 h -6 a 12 12 0 0 1 -12 -12 v -34 a 12 12 0 0 1 12 -12z" fill={c.primary} />
            <circle cx={30} cy={42} r={6} fill={c.white} /><circle cx={46} cy={42} r={6} fill={c.white} /><circle cx={62} cy={42} r={6} fill={c.white} />
          </svg>
          <Pill bg={c.accent} color={c.text} size={56} px={36} py={16}>{cfg.ctaText}</Pill>
        </Card>
      ),
    },
    {
      id: "next",
      at: L.next,
      node: (
        <Card style={{ padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 190, background: c.primary }}>
          <div style={{ fontFamily: theme.fonts.en, color: c.white, fontWeight: 700 }}>
            <div style={{ fontSize: 40, opacity: 0.85 }}>Next</div>
            <div style={{ fontSize: 88, lineHeight: 1 }}>DAY {cfg.nextEpisodeNumber}</div>
          </div>
          <svg width={110} height={110} viewBox="0 0 110 110">
            <circle cx={55} cy={55} r={50} fill={c.white} />
            <path d="M 38 55 H 72 M 56 36 L 74 55 L 56 74" fill="none" stroke={c.primary} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Card>
      ),
    },
  ];

  return (
    <SceneShell duration={timing.duration}>
      <BrandBar name={cfg.brandName} right={<Pill bg={c.accent} color={c.text} size={38} px={30} py={12}>DAY {cfg.episodeNumber}</Pill>} />
      <Confetti delay={L.done + 8} />

      {/* progress ring + completed badge */}
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <Enter delay={L.done + 4} y={60} scale={0.7} preset="pop" breathe={3}>
            <ProgressRing
              value={frame >= L.progress ? progress.done : prev}
              fromValue={prev}
              total={progress.total}
              percent={frame >= L.progress ? progress.percent : Math.round((prev / progress.total) * 10000) / 100}
              delay={L.progress}
              size={440}
            />
          </Enter>
          <div style={{ position: "absolute", right: -50, top: -40 }}>
            <CheckBadge delay={L.done + 14} />
          </div>
        </div>
      </div>

      {/* "use them now": the 10 Arabic sentences */}
      {showChips && (
        <div style={{ position: "absolute", top: 800, left: theme.safe.x, right: theme.safe.x, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, opacity: 1 - chipsOut }}>
          {cfg.sentences.map((s, i) => (
            <Enter key={s.number} delay={L.practice + i * 4} y={30} scale={0.8} preset="pop">
              <div style={{ background: c.white, borderRadius: 30, boxShadow: `0 14px 30px ${c.shadow}`, padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 92 }}>
                <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: 32, color: c.textSoft }}>{s.number}</span>
                <span lang="ar" dir="rtl" style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: 40, color: c.text, unicodeBidi: "isolate" }}>{s.arabic}</span>
              </div>
            </Enter>
          ))}
        </div>
      )}

      {/* CTA cards */}
      {frame >= L.follow - 4 && (
        <div style={{ position: "absolute", top: 800, left: theme.safe.x, right: theme.safe.x, display: "flex", flexDirection: "column", gap: 26 }}>
          {cards.map((cd, i) => (
            <Enter key={cd.id} delay={cd.at} y={60} x={i % 2 ? 40 : -40} scale={0.92} preset="soft" breathe={i === 1 ? 3 : 0}>
              {cd.node}
            </Enter>
          ))}
        </div>
      )}
      <Sparkle x={930} y={760} s={1.2} />
      <Sparkle x={120} y={700} s={0.8} phase={2} />

      <div style={{ position: "absolute", left: theme.safe.x, right: theme.safe.x, top: 1510 }}>
        <CaptionStack
          lines={cfg.outro.lines.map((l) => ({ id: l.id, text: l.text }))}
          starts={L}
          fontSize={52}
          highlight={["Arabic", "Master", "DAY", "11", "DONE!"]}
        />
      </div>
    </SceneShell>
  );
};

import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "./fonts";
import { theme } from "./theme";
import { PAGE_NAME, PHRASES, WIDTH } from "./data";

// ─────────────── EKHANE EDIT KORBE (Thumbnail content) ───────────────
const TITLE_MAIN = "আরবি শব্দ শিখুন";
const TITLE_SUB = "বাংলায় সহজে";
const SUBTITLE = "সবচেয়ে প্রয়োজনীয় দৈনন্দিন শব্দ";

// Mot shobdo songkha — badge o hint dynamic: "৫০০+ শব্দ" / "... আরো ৪৯৭+ শব্দ ভিতরে!"
const TOTAL_WORDS = 500;

// Sample card: 3-ti, majher-ti highlight. 2-ti current reel (PHRASES theke n diye), 1-ti ager reel theke.
const EXTRA_CARD = { ar: "شكرا", bn: "শুকরান", meaning: "ধন্যবাদ" }; // ager reel
const CURRENT_PICKS: [number, number] = [37, 36]; // [majher highlight card, shesh card]
// ──────────────────────────────────────────────────────────────────────

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
const BADGE_TEXT = `${toBn(TOTAL_WORDS)}+ শব্দ`;
const HINT_TEXT = `... আরো ${toBn(TOTAL_WORDS - 3)}+ শব্দ ভিতরে!`;

const pick = (n: number) => {
  const p = PHRASES.find((x) => x.n === n);
  if (!p) throw new Error(`Thumbnail: phrase n=${n} PHRASES-e nei`);
  return { ar: p.ar, bn: p.bn, meaning: p.meaning };
};
const sampleCards = [EXTRA_CARD, pick(CURRENT_PICKS[0]), pick(CURRENT_PICKS[1])];

// Bhasoman arbi shobdo: card-er arbi shobdo theke-i neya, card-er mot shobdo-r beshi noy.
const cardWords = Array.from(new Set(sampleCards.flatMap((c) => c.ar.split(/\s+/))));
const FLOAT_SLOTS = [
  { x: 80, y: 380, size: 72, opacity: 0.07, rot: -12 },
  { x: 720, y: 320, size: 64, opacity: 0.06, rot: 8 },
  { x: 700, y: 1650, size: 66, opacity: 0.06, rot: 10 },
  { x: 90, y: 1630, size: 74, opacity: 0.06, rot: -14 },
  { x: 140, y: 1100, size: 80, opacity: 0.06, rot: 15 },
  { x: 780, y: 1020, size: 68, opacity: 0.07, rot: -6 },
  { x: 820, y: 640, size: 56, opacity: 0.05, rot: 5 },
  { x: 90, y: 720, size: 66, opacity: 0.06, rot: -8 },
];
const floatingWords = cardWords.slice(0, FLOAT_SLOTS.length).map((text, i) => ({ text, ...FLOAT_SLOTS[i] }));

const BTN_W = 540;
const BTN_H = 100;
const CARD_W = 960;
const CARD_H = 180;
const CARD_GAP = 22;
const CARDS_TOP = 820;
const CARDS_BOTTOM = CARDS_TOP + 3 * CARD_H + 2 * CARD_GAP;

export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    {/* Background gradient */}
    <AbsoluteFill style={{ background: `linear-gradient(168deg, ${theme.colors.bg} 0%, ${theme.colors.bgAlt} 40%, #D5F0E8 100%)` }} />

    {/* Decorative blobs */}
    <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", top: -300, left: -200,
      filter: "blur(80px)", background: `radial-gradient(circle, ${theme.colors.primary}25, transparent 65%)` }} />
    <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", bottom: -200, right: -250,
      filter: "blur(90px)", background: `radial-gradient(circle, ${theme.colors.accent}20, transparent 65%)` }} />
    <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: 600, left: 200,
      filter: "blur(70px)", background: `radial-gradient(circle, ${theme.colors.primary}15, transparent 60%)` }} />

    {/* Dot grid */}
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${theme.colors.text}12 2px, transparent 2.5px)`,
      backgroundSize: "54px 54px", opacity: 0.4 }} />

    {/* Floating Arabic words */}
    {floatingWords.map((w, i) => (
      <div key={i} dir="rtl" style={{ position: "absolute", left: w.x, top: w.y,
        fontFamily: theme.fonts.arabic, fontWeight: 800, fontSize: w.size,
        color: theme.colors.text, opacity: w.opacity,
        transform: `rotate(${w.rot}deg)` }}>{w.text}</div>
    ))}

    {/* Logo + Page Name */}
    <div style={{ position: "absolute", top: 130, left: 0, width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 14 }}>
      <div style={{ width: 110, height: 110, filter: "drop-shadow(0 6px 16px rgba(16,35,29,0.18))" }}>
        <Img src={staticFile("logo.svg")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: theme.colors.text,
        letterSpacing: "-0.02em" }}>{PAGE_NAME}</div>
    </div>

    {/* Center Title Section */}
    <div style={{ position: "absolute", top: 370, left: 0, width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center" }}>
      <div style={{ background: theme.colors.accent, borderRadius: 28, padding: "10px 38px",
        boxShadow: `0 10px 30px -8px ${theme.colors.accentGlow}`, marginBottom: 20 }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: theme.colors.text,
          letterSpacing: "-0.01em" }}>{BADGE_TEXT}</span>
      </div>
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 800, fontSize: 78, color: theme.colors.text,
        lineHeight: 1.15, textAlign: "center" }}>{TITLE_MAIN}</div>
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 800, fontSize: 74, color: theme.colors.primary,
        lineHeight: 1.15, textAlign: "center", marginTop: 4 }}>{TITLE_SUB}</div>
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 32, color: theme.colors.textDim,
        marginTop: 14, textAlign: "center" }}>{SUBTITLE}</div>
    </div>

    {/* Sample word cards (bigger; fixed paddings/gaps so text never touches edges) */}
    <div style={{ position: "absolute", top: CARDS_TOP, left: (WIDTH - CARD_W) / 2, width: CARD_W, display: "flex",
      flexDirection: "column", gap: CARD_GAP }}>
      {sampleCards.map((card, i) => {
        const hi = i === 1;
        return (
          <div key={i} style={{ width: CARD_W, height: CARD_H, boxSizing: "border-box", borderRadius: 38,
            background: theme.colors.card,
            border: `3px solid ${hi ? theme.colors.primary : theme.colors.line}`,
            boxShadow: hi
              ? `0 12px 32px -12px rgba(16,35,29,0.25), 0 0 40px ${theme.colors.glow}`
              : "0 8px 24px -12px rgba(16,35,29,0.12)",
            display: "flex", alignItems: "center", padding: "0 40px", gap: 28,
            transform: hi ? "scale(1.03)" : "scale(1)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, flexShrink: 0,
              background: hi ? theme.colors.accent : "rgba(16,35,29,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30,
              color: hi ? "#fff" : theme.colors.textDim }}>{i + 1}</div>
            <div style={{ width: 360, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 800, fontSize: 38, lineHeight: 1.2,
                color: theme.colors.text, whiteSpace: "nowrap" }}>{card.bn}</div>
              <div dir="rtl" style={{ textAlign: "left", fontFamily: theme.fonts.arabic, fontWeight: 700, fontSize: 36,
                lineHeight: 1.25, color: hi ? theme.colors.primary : theme.colors.textDim,
                whiteSpace: "nowrap" }}>{card.ar}</div>
            </div>
            <div style={{ width: 2, height: 96, flexShrink: 0, background: theme.colors.line }} />
            <div style={{ flex: 1, minWidth: 0, fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 30,
              lineHeight: 1.35, color: theme.colors.text }}>{card.meaning}</div>
          </div>
        );
      })}
    </div>

    {/* hint */}
    <div style={{ position: "absolute", top: CARDS_BOTTOM + 40, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 30, color: theme.colors.textDim,
        letterSpacing: "0.04em" }}>{HINT_TEXT}</div>
    </div>

    {/* Follow for more button */}
    <div style={{ position: "absolute", top: CARDS_BOTTOM + 130, left: (WIDTH - BTN_W) / 2, width: BTN_W, height: BTN_H }}>
      <div style={{ position: "absolute", inset: -6, borderRadius: BTN_H / 2 + 6,
        border: `3px solid ${theme.colors.accent}`, opacity: 0.4 }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: BTN_H / 2, background: theme.colors.accent,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
        boxShadow: `0 16px 36px -12px rgba(16,35,29,0.35), 0 0 50px ${theme.colors.accentGlow}` }}>
        <svg width="48" height="48" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="28" fill={theme.colors.text} />
          <path d="M28 15v26M15 28h26" stroke={theme.colors.accent} strokeWidth="6" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: theme.colors.text,
          letterSpacing: "-0.01em" }}>Follow for more</span>
      </div>
    </div>

    {/* Bottom tagline */}
    <div style={{ position: "absolute", bottom: 150, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em",
        color: theme.colors.textDim, textTransform: "uppercase" }}>SURVIVAL ARABIC</div>
    </div>

    {/* Subtle vignette */}
    <AbsoluteFill style={{ pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 55%, rgba(16,35,29,0.12) 100%)" }} />
  </AbsoluteFill>
);

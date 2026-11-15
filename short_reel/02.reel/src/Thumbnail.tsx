import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "./fonts";
import { theme } from "./theme";
import { PAGE_NAME, WIDTH } from "./data";

const TITLE_MAIN = "আরবি শব্দ শিখুন";
const TITLE_SUB = "বাংলায় সহজে";
const SUBTITLE = "সবচেয়ে প্রয়োজনীয় দৈনন্দিন শব্দ";

const BTN_W = 540;
const BTN_H = 100;

// Decorative Arabic words floating in background
const floatingWords = [
  { text: "شكرا", x: 80, y: 380, size: 72, opacity: 0.07, rot: -12 },
  { text: "مرحبا", x: 720, y: 320, size: 64, opacity: 0.06, rot: 8 },
  { text: "سلام", x: 140, y: 1100, size: 80, opacity: 0.06, rot: 15 },
  { text: "أهلا", x: 780, y: 1020, size: 68, opacity: 0.07, rot: -6 },
  { text: "حبيبي", x: 640, y: 1540, size: 60, opacity: 0.05, rot: 10 },
  { text: "يلا", x: 110, y: 1480, size: 74, opacity: 0.06, rot: -18 },
  { text: "تمام", x: 820, y: 640, size: 56, opacity: 0.05, rot: 5 },
  { text: "كيف", x: 90, y: 720, size: 66, opacity: 0.06, rot: -8 },
];

// Sample word cards for visual interest
const sampleCards = [
  { ar: "مرحبا", bn: "মারহাবা", meaning: "হ্যালো" },
  { ar: "شكرا", bn: "শুকরান", meaning: "ধন্যবাদ" },
  { ar: "طيب", bn: "তাইয়্যিব", meaning: "ভালো" },
];

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

    {/* Center Title Section (Clean Flex Column, Zero Overlap) */}
    <div style={{ position: "absolute", top: 380, left: 0, width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center" }}>
      
      {/* 500+ Badge */}
      <div style={{ background: theme.colors.accent, borderRadius: 28, padding: "10px 38px",
        boxShadow: `0 10px 30px -8px ${theme.colors.accentGlow}`, marginBottom: 20 }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: theme.colors.text,
          letterSpacing: "-0.01em" }}>৫০০+ শব্দ</span>
      </div>

      {/* Main Title Lines */}
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 800, fontSize: 78, color: theme.colors.text,
        lineHeight: 1.15, textAlign: "center" }}>{TITLE_MAIN}</div>
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 800, fontSize: 74, color: theme.colors.primary,
        lineHeight: 1.15, textAlign: "center", marginTop: 4 }}>{TITLE_SUB}</div>
      
      {/* Subtitle */}
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 32, color: theme.colors.textDim,
        marginTop: 14, textAlign: "center" }}>{SUBTITLE}</div>
    </div>

    {/* Sample word cards */}
    <div style={{ position: "absolute", top: 890, left: 0, width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 18 }}>
      {sampleCards.map((card, i) => (
        <div key={i} style={{ width: 860, height: 122, borderRadius: 30, background: theme.colors.card,
          border: `2.5px solid ${i === 1 ? theme.colors.primary : theme.colors.line}`,
          boxShadow: i === 1
            ? `0 12px 32px -12px rgba(16,35,29,0.25), 0 0 40px ${theme.colors.glow}`
            : "0 8px 24px -12px rgba(16,35,29,0.12)",
          display: "flex", alignItems: "center", padding: "0 28px", gap: 22,
          transform: i === 1 ? "scale(1.03)" : "scale(1)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 26,
            background: i === 1 ? theme.colors.accent : "rgba(16,35,29,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24,
            color: i === 1 ? "#fff" : theme.colors.textDim }}>{i + 1}</div>
          <div dir="rtl" style={{ width: 260, fontFamily: theme.fonts.arabic, fontWeight: 800, fontSize: 50,
            color: i === 1 ? theme.colors.primary : theme.colors.text, textAlign: "left" }}>{card.ar}</div>
          <div style={{ width: 2, height: 70, background: theme.colors.line }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 26,
              color: theme.colors.textDim }}>{card.bn}</div>
            <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 28,
              color: theme.colors.text }}>{card.meaning}</div>
          </div>
        </div>
      ))}
    </div>

    {/* "... আরো ৪৯৭+ শব্দ" hint */}
    <div style={{ position: "absolute", top: 1330, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 30, color: theme.colors.textDim,
        letterSpacing: "0.04em" }}>... আরো ৪৯৭+ শব্দ ভিতরে!</div>
    </div>

    {/* Follow for more button */}
    <div style={{ position: "absolute", top: 1430, left: (WIDTH - BTN_W) / 2, width: BTN_W, height: BTN_H }}>
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
    <div style={{ position: "absolute", bottom: 180, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em",
        color: theme.colors.textDim, textTransform: "uppercase" }}>SURVIVAL ARABIC</div>
    </div>

    {/* Subtle vignette */}
    <AbsoluteFill style={{ pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 55%, rgba(16,35,29,0.12) 100%)" }} />
  </AbsoluteFill>
);

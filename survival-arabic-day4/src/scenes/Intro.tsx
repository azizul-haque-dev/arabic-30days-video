import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { Card, Entrance, Pill, SceneExit, WordReveal, clamp, useBreath } from "../components/kit";
import { Sfx } from "../components/Sfx";

export const HookScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath();

  // Voiceover hits:
  // 0.28s (f=8): "আরব দেশে থাকেন?"
  // 1.62s (f=48): "কিন্তু আরবি বলতে গিয়ে আটকে যান?"
  // 3.66s (f=102): "চিন্তা নেই!"
  const pulse1 = spring({ frame: frame - 8, fps, config: theme.spring.bouncy });
  const pulse2 = spring({ frame: frame - 48, fps, config: theme.spring.bouncy });
  const pop = spring({ frame: frame - 102, fps, config: theme.spring.bouncy });

  const scale1 = interpolate(pulse1, [0, 0.5, 1], [1, 1.05, 1], clamp);
  const scale2 = interpolate(pulse2, [0, 0.5, 1], [1, 1.04, 1], clamp);
  const popScale = interpolate(pop, [0, 0.6, 1], [1, 1.15, 1], clamp);

  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="thud" at={2} />
      <Sfx name="pop" at={44} />
      <Sfx name="chime" at={102} />
      <AbsoluteFill
        style={{
          padding: "68px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        {/* Top Header / Day Pill - Always crisp and visible at frame 0 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            width: "100%",
            marginTop: 8,
          }}
        >
          <Pill
            tone="hero"
            style={{
              fontSize: 32,
              padding: "12px 32px",
              fontWeight: theme.weights.hero,
              boxShadow: theme.shadows.hero,
              letterSpacing: 0.5,
            }}
          >
            DAY 04 • চতুর্থ দিন
          </Pill>

          <Pill
            tone="accent"
            style={{
              fontSize: 28,
              padding: "12px 28px",
              fontWeight: theme.weights.strong,
            }}
          >
            প্রবাসীদের দৈনন্দিন আরবি
          </Pill>
        </div>

        {/* Center Card - Always fully formed and readable at frame 0 */}
        <Card
          style={{
            width: "100%",
            padding: "52px 46px",
            textAlign: "center",
            boxShadow: theme.shadows.card,
            border: `2px solid ${theme.colors.primarySoft}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            ...breath,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              lineHeight: 1.22,
              letterSpacing: 0,
              transform: `scale(${scale1})`,
              transformOrigin: "center center",
            }}
          >
            <span
              style={{
                color: theme.colors.primary,
                textShadow: `0 0 24px ${theme.colors.glow}`,
              }}
            >
              আরব
            </span>{" "}
            দেশে থাকেন?
          </div>

          <div
            style={{
              fontSize: 50,
              fontWeight: theme.weights.strong,
              color: theme.colors.textDim,
              lineHeight: 1.25,
              letterSpacing: 0,
              transform: `scale(${scale2})`,
              transformOrigin: "center center",
            }}
          >
            কিন্তু আরবি বলতে গিয়ে{" "}
            <span
              style={{
                color: theme.colors.accent,
                fontWeight: theme.weights.hero,
              }}
            >
              আটকে
            </span>{" "}
            যান?
          </div>

          {/* Highlights Row */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Pill
              tone="soft"
              style={{
                fontSize: 26,
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
              }}
            >
              ✓ বাক্য ৩১ – ৪০
            </Pill>
            <Pill
              tone="white"
              style={{
                fontSize: 26,
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
                border: `1.5px solid ${theme.colors.line}`,
              }}
            >
              ✓ ৩০ দিনের সহজ কোর্স
            </Pill>
            <Pill
              tone="soft"
              style={{
                fontSize: 26,
                padding: "10px 22px",
                fontWeight: theme.weights.strong,
              }}
            >
              ✓ Arabic Master
            </Pill>
          </div>
        </Card>

        {/* Bottom Relief / Callout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
            transform: `scale(${popScale})`,
            transformOrigin: "center center",
          }}
        >
          <Pill
            tone="hero"
            style={{
              fontSize: 46,
              padding: "18px 56px",
              boxShadow: theme.shadows.hero,
              fontWeight: theme.weights.hero,
            }}
          >
            চিন্তা নেই! সহজে শিখুন
          </Pill>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const BrandScene: React.FC<{ duration: number }> = ({ duration }) => {
  const breath = useBreath();
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="chime" at={4} />
      <Sfx name="pop" at={60} />
      <Sfx name="click" at={175} />
      <AbsoluteFill
        style={{
          padding: 72,
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
        }}
      >
        <Entrance delay={0}>
          <Pill tone="soft">আপনার প্রতিদিনের আরবি শেখার সঙ্গী</Pill>
        </Entrance>

        <Entrance delay={12} style={{ width: "100%" }}>
          <Card
            style={{
              textAlign: "center",
              padding: "52px 40px",
              border: `2px solid ${theme.colors.primary}`,
              boxShadow: theme.shadows.hero,
              ...breath,
            }}
          >
            <div
              style={{
                fontSize: 76,
                fontWeight: theme.weights.hero,
                color: theme.colors.primary,
                fontFamily: theme.fonts.display,
              }}
            >
              Arabic Master
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: theme.weights.strong,
                color: theme.colors.textDim,
                marginTop: 12,
                fontFamily: theme.fonts.display,
              }}
            >
              ৩০ দিনের Survival Arabic Series
            </div>
          </Card>
        </Entrance>

        <Entrance delay={170}>
          <Pill tone="accent" style={{ fontSize: 40, padding: "16px 44px" }}>
            আজ চতুর্থ দিন &bull; Day 4
          </Pill>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const ProgressScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countP = spring({
    frame: frame - 10,
    fps,
    config: { damping: 26, stiffness: 70, mass: 1 },
  });
  const learned = Math.round(interpolate(countP, [0, 1], [0, 30], clamp));

  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="pop" at={4} />
      <Sfx name="tick" at={25} />
      <Sfx name="click" at={130} />
      <AbsoluteFill
        style={{
          padding: 72,
          justifyContent: "center",
          gap: 28,
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={0}>
          <Pill tone="soft">আলহামদুলিল্লাহ &bull; অগ্রগতি ড্যাশবোর্ড</Pill>
        </Entrance>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Entrance delay={10}>
            <Card style={{ textAlign: "center", padding: "40px 28px" }}>
              <div
                style={{
                  fontSize: 78,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.primary,
                }}
              >
                {learned} / 300
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: theme.weights.strong,
                  color: theme.colors.textDim,
                  marginTop: 8,
                }}
              >
                বাক্য শেখা সম্পন্ন
              </div>
            </Card>
          </Entrance>

          <Entrance delay={130}>
            <Card
              style={{
                textAlign: "center",
                padding: "40px 28px",
                backgroundColor: theme.colors.primarySoft,
              }}
            >
              <div
                style={{
                  fontSize: 68,
                  fontWeight: theme.weights.hero,
                  color: theme.colors.primaryDeep,
                }}
              >
                ৩১ – ৪০
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: theme.weights.strong,
                  color: theme.colors.text,
                  marginTop: 8,
                }}
              >
                আজকের নতুন ১০টি বাক্য
              </div>
            </Card>
          </Entrance>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const TopicScene: React.FC<{ duration: number }> = ({ duration }) => {
  const breath = useBreath();
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="pop" at={3} />
      <Sfx name="chime" at={85} />
      <AbsoluteFill
        style={{
          padding: 72,
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={0}>
          <Pill tone="accent">Today&apos;s Topic</Pill>
        </Entrance>
        <Entrance delay={10} style={{ width: "100%" }}>
          <Card style={{ textAlign: "center", padding: "56px 44px", ...breath }}>
            <WordReveal
              text="গালফের দৈনন্দিন কথাবার্তা"
              delay={12}
              per={4}
              highlightWord="দৈনন্দিন"
              style={{
                fontSize: 64,
                fontWeight: theme.weights.hero,
                color: theme.colors.text,
                justifyContent: "center",
              }}
            />
          </Card>
        </Entrance>
        <Entrance delay={85}>
          <Pill tone="hero" style={{ fontSize: 36, padding: "14px 42px" }}>
            চলুন শুরু করি!
          </Pill>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

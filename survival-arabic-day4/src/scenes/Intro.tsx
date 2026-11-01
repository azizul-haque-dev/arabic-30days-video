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
  const pop = spring({ frame: frame - 102, fps, config: theme.spring.bouncy });

  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="thud" at={2} />
      <Sfx name="pop" at={44} />
      <Sfx name="chime" at={102} />
      <AbsoluteFill
        style={{
          padding: 72,
          justifyContent: "center",
          alignItems: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        <Entrance delay={0}>
          <Pill tone="accent" style={{ marginBottom: 28 }}>
            প্রবাসীদের দৈনন্দিন আরবি
          </Pill>
        </Entrance>

        <Card
          style={{
            width: "100%",
            padding: "48px 44px",
            textAlign: "center",
            ...breath,
          }}
        >
          <WordReveal
            text="আরব দেশে থাকেন?"
            delay={4}
            per={4}
            highlightWord="আরব"
            style={{
              fontSize: 64,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              justifyContent: "center",
              marginBottom: 20,
            }}
          />
          <WordReveal
            text="কিন্তু আরবি বলতে গিয়ে আটকে যান?"
            delay={44}
            per={4}
            highlightWord="আটকে"
            style={{
              fontSize: 46,
              fontWeight: theme.weights.strong,
              color: theme.colors.textDim,
              justifyContent: "center",
            }}
          />
        </Card>

        <div
          style={{
            marginTop: 36,
            opacity: pop,
            transform: `scale(${interpolate(pop, [0, 1], [0.8, 1], clamp)})`,
          }}
        >
          <Pill
            tone="hero"
            style={{
              fontSize: 44,
              padding: "18px 48px",
              boxShadow: theme.shadows.hero,
            }}
          >
            চিন্তা নেই!
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

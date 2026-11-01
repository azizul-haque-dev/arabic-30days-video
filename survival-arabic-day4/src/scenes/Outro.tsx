import React from "react";
import { AbsoluteFill } from "remotion";
import { LESSONS } from "../content";
import { theme } from "../theme";
import { Card, Entrance, Pill, SceneExit, WordReveal, useBreath } from "../components/kit";
import { Sfx } from "../components/Sfx";

export const RecapScene: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="pop" at={3} />
      <Sfx name="chime" at={125} />
      <AbsoluteFill
        style={{
          padding: "44px 52px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: theme.fonts.display,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pill tone="hero" style={{ fontSize: 28, padding: "10px 28px" }}>
            আজকের ১০টি বাক্য (৩১–৪০)
          </Pill>
          <Pill tone="accent" style={{ fontSize: 26, padding: "10px 26px" }}>
            আলহামদুলিল্লাহ ৪০ / ৩০০ সম্পন্ন
          </Pill>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 20,
            rowGap: 18,
          }}
        >
          {LESSONS.map((item, idx) => (
            <Entrance key={item.num} delay={4 + idx * 3}>
              <div
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: "24px 26px",
                  borderRadius: 30,
                  border: `1.5px solid ${theme.colors.line}`,
                  boxShadow: theme.shadows.soft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div
                    style={{
                      minWidth: 56,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: theme.colors.primarySoft,
                      color: theme.colors.primaryDeep,
                      fontSize: 24,
                      fontWeight: theme.weights.hero,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.numBn}
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: theme.weights.hero,
                      color: theme.colors.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.pronunciation}
                  </div>
                </div>

                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="16" cy="16" r="15" fill={theme.colors.primary} />
                  <path
                    d="M10 16.5L14 20.5L22 12"
                    stroke={theme.colors.surface}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Entrance>
          ))}
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const CommentScene: React.FC<{ duration: number }> = ({ duration }) => {
  const breath = useBreath();
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="pop" at={3} />
      <AbsoluteFill style={{ padding: 72, justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: "100%", textAlign: "center", padding: "56px 44px", ...breath }}>
          <Pill tone="accent" style={{ marginBottom: 24 }}>
            আপনার মতামত
          </Pill>
          <WordReveal
            text="আপনার সবচেয়ে কাজে লাগবে কোন বাক্যটি কমেন্টে জানান!"
            delay={4}
            per={3}
            highlightWord="কমেন্টে"
            style={{
              fontSize: 54,
              fontWeight: theme.weights.hero,
              color: theme.colors.text,
              justifyContent: "center",
            }}
          />
        </Card>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const StatementScene: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="thud" at={2} />
      <AbsoluteFill style={{ padding: 72, justifyContent: "center", alignItems: "center" }}>
        <Card
          style={{
            width: "100%",
            textAlign: "center",
            padding: "56px 44px",
            backgroundColor: theme.colors.primarySoft,
          }}
        >
          <WordReveal
            text="শুধু মুখস্থ করলে হবে না, কথাও বলতে হবে!"
            delay={3}
            per={3}
            highlightWord="কথাও"
            style={{
              fontSize: 56,
              fontWeight: theme.weights.hero,
              color: theme.colors.primaryDeep,
              justifyContent: "center",
            }}
          />
        </Card>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const FollowScene: React.FC<{ duration: number }> = ({ duration }) => {
  const breath = useBreath();
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="click" at={4} />
      <AbsoluteFill style={{ padding: 72, justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: "100%", textAlign: "center", padding: "52px 44px", ...breath }}>
          <div style={{ fontSize: 34, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
            প্রতিদিন নতুন বাক্য শিখতে ফলো করুন
          </div>
          <div
            style={{
              fontSize: 70,
              fontWeight: theme.weights.hero,
              color: theme.colors.primary,
              margin: "16px 0 24px",
            }}
          >
            Arabic Master
          </div>
          <Pill tone="hero" style={{ fontSize: 32, padding: "14px 44px" }}>
            + Follow Page
          </Pill>
        </Card>
      </AbsoluteFill>
    </SceneExit>
  );
};

export const EndScene: React.FC<{ duration: number }> = ({ duration }) => {
  const breath = useBreath();
  return (
    <SceneExit durationInFrames={duration}>
      <Sfx name="chime" at={4} />
      <Sfx name="pop" at={65} />
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
          <Pill tone="soft">আজকের চ্যালেঞ্জ</Pill>
        </Entrance>

        <Card
          style={{
            width: "100%",
            textAlign: "center",
            padding: "48px 40px",
            border: `2.5px solid ${theme.colors.primary}`,
            boxShadow: theme.shadows.hero,
            ...breath,
          }}
        >
          <div style={{ fontSize: 32, color: theme.colors.textDim, fontWeight: theme.weights.strong }}>
            কমেন্টে লিখুন:
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: theme.weights.hero,
              color: theme.colors.primary,
              marginTop: 8,
            }}
          >
            Day 4 Done
          </div>
        </Card>

        <Entrance delay={65}>
          <Pill tone="accent" style={{ fontSize: 36, padding: "14px 40px" }}>
            দেখা হবে Day 5-এ, ইনশাআল্লাহ!
          </Pill>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};

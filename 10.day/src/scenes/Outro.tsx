import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SENTENCES } from "../content";
import { Card, Entrance, Pill, SceneExit, WordReveal, clamp, useBreath } from "../components/kit";
import { Sfx } from "../components/Sfx";

const C = theme.colors;

const textStyle = (
  size: number,
  weight: number = theme.weights.hero,
  color: string = C.text
): React.CSSProperties => ({
  fontFamily: theme.fonts.display,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.15,
  letterSpacing: 0,
});

/* ───────────── 1 · RECAP — 10 Sentences & 100 / 300 Milestone ───────────── */
export const RecapScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress fills up to 100
  const p = spring({ frame: frame - 18, fps, config: theme.spring.smooth });
  const count = Math.round(interpolate(p, [0, 1], [90, 100]));

  return (
    <SceneExit dur={dur}>
      <Sfx name="whoosh" at={2} />
      <Sfx name="pop" at={16} />
      <Sfx name="chime" at={40} rate={1.05} />

      {/* Top Header */}
      <div style={{ position: "absolute", top: 70, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={4} from={-20}>
          <Pill tone="hero" size={34}>আজকের ১০টি বাক্য সম্পন্ন!</Pill>
        </Entrance>
      </div>

      {/* 10 Sentences 2-Column Summary Grid */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 70,
          right: 70,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {SENTENCES.map((s, idx) => {
          const itemP = spring({ frame: frame - 6 - idx * 2, fps, config: theme.spring.snappy });
          return (
            <div
              key={s.n}
              style={{
                background: C.surface,
                padding: "12px 18px",
                borderRadius: 22,
                border: `1px solid ${C.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: interpolate(itemP, [0, 0.5], [0, 1], clamp),
                transform: `translateY(${interpolate(itemP, [0, 1], [18, 0])}px)`,
                boxShadow: theme.shadow.soft,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 32,
                    borderRadius: 16,
                    background: C.primarySoft,
                    color: C.primaryDeep,
                    fontSize: 18,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.nBn}
                </div>
                <div style={{ ...textStyle(26, theme.weights.strong, C.text), maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.recap}
                </div>
              </div>
              {/* Checkmark */}
              <div style={{ width: 22, height: 22, borderRadius: 11, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={C.white} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* 100 / 300 Milestone Banner */}
      <div style={{ position: "absolute", bottom: 70, left: 70, right: 70 }}>
        <Entrance delay={30} from={36} config={theme.spring.snappy}>
          <Card
            style={{
              padding: "26px 36px",
              borderRadius: 38,
              border: `2px solid ${C.primary}`,
              background: `linear-gradient(135deg, ${C.surface}, ${C.bgAlt})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={textStyle(32, theme.weights.strong, C.textDim)}>আলহামদুলিল্লাহ মোট অগ্রগতি</div>
              <div style={{ ...textStyle(62, theme.weights.hero, C.primaryDeep), marginTop: 2 }}>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{count}</span> / ৩০০টি বাক্য
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Pill tone="accent" size={32}>৩৩.৩% সম্পন্ন</Pill>
              <div style={{ ...textStyle(26, theme.weights.strong, C.textDim), marginTop: 6 }}>
                ১০ দিন সফলভাবে শেষ
              </div>
            </div>
          </Card>
        </Entrance>
      </div>
    </SceneExit>
  );
};

/* ───────────── 2 · ADVICE — Real Life Speaking Tip ───────────── */
export const AdviceScene: React.FC<{ dur: number }> = ({ dur }) => {
  const breath = useBreath(28, 0.015);

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="thud" at={20} />
      <Sfx name="chime" at={44} />

      {/* Top Tag */}
      <div style={{ position: "absolute", top: 100, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={4} from={-20}>
          <Pill tone="accent" size={36}>জরুরি পরামর্শ</Pill>
        </Entrance>
      </div>

      {/* Main Advice Card */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 70,
          right: 70,
          transform: `scale(${breath.scale})`,
        }}
      >
        <Entrance delay={10} from={36} config={theme.spring.snappy}>
          <Card
            style={{
              padding: "54px 50px",
              borderRadius: 50,
              textAlign: "center",
              border: `2px solid ${C.primarySoft}`,
              boxShadow: theme.shadow.card,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            {/* Lightbulb / Speaking icon */}
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                background: C.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${C.glow}`,
              }}
            >
              <svg viewBox="0 0 24 24" width={48} height={48} fill="none" stroke={C.primaryDeep} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <WordReveal
              text="শুধু বাক্য মুখস্থ করলেই হবে না!"
              delay={14}
              per={4}
              justify="center"
              gap={18}
              style={textStyle(58, theme.weights.hero, C.textDim)}
            />

            <div
              style={{
                background: C.primary,
                borderRadius: 36,
                padding: "24px 36px",
                boxShadow: `${theme.shadow.hero}, 0 0 40px ${C.glow}`,
              }}
            >
              <WordReveal
                text="প্রতিদিনের জীবনে এগুলো বলার চেষ্টা করতে হবে"
                delay={26}
                per={4}
                justify="center"
                gap={18}
                style={textStyle(52, theme.weights.hero, C.white)}
              />
            </div>
          </Card>
        </Entrance>
      </div>

      {/* Bottom badge */}
      <div style={{ position: "absolute", bottom: 100, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={38} from={24}>
          <Pill tone="soft" size={34}>ব্যবহারেই আসবে সাবলীলতা</Pill>
        </Entrance>
      </div>
    </SceneExit>
  );
};

/* ───────────── 3 · CTA — Follow Page & Comment "DAY 10 DONE" ───────────── */
export const CtaScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btnP = spring({ frame: frame - 28, fps, config: theme.spring.bouncy });
  const commentP = spring({ frame: frame - 50, fps, config: theme.spring.bouncy });

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="click" at={30} rate={1.1} />
      <Sfx name="chime" at={54} rate={1.08} />

      {/* Header */}
      <div style={{ position: "absolute", top: 90, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={4} from={-20}>
          <Pill tone="soft" size={36}>প্রতিদিন নতুন বাক্য শিখতে</Pill>
        </Entrance>
      </div>

      {/* Follow Card */}
      <div style={{ position: "absolute", top: 190, left: 80, right: 80 }}>
        <Entrance delay={8} from={32} config={theme.spring.snappy}>
          <Card
            style={{
              padding: "40px 44px",
              borderRadius: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={textStyle(34, theme.weights.strong, C.textDim)}>ফেসবুক পেজ</div>
              <div style={{ ...textStyle(64, theme.weights.hero, C.primaryDeep), marginTop: 4 }}>
                Arabic Master
              </div>
            </div>

            {/* Follow Button with pulse */}
            <div
              style={{
                transform: `scale(${interpolate(btnP, [0, 1], [0.8, 1])})`,
                background: C.primary,
                color: C.white,
                padding: "20px 42px",
                borderRadius: 34,
                fontSize: 38,
                fontWeight: 700,
                boxShadow: `0 10px 30px ${C.glow}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span>Follow</span>
              <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </Card>
        </Entrance>
      </div>

      {/* Comment "DAY 10 DONE!" Card */}
      <div style={{ position: "absolute", top: 460, left: 80, right: 80 }}>
        <Entrance delay={30} from={40} config={theme.spring.snappy}>
          <Card
            style={{
              padding: "44px 44px",
              borderRadius: 48,
              textAlign: "center",
              border: `2px solid ${C.accent}`,
              background: `linear-gradient(180deg, ${C.surface}, ${C.bgAlt})`,
            }}
          >
            <div style={textStyle(42, theme.weights.strong, C.text)}>
              কমেন্টে এখনই লিখে জানান:
            </div>

            <div
              style={{
                marginTop: 20,
                display: "inline-block",
                transform: `scale(${interpolate(commentP, [0, 1], [0.85, 1])})`,
                background: C.accent,
                color: C.text,
                padding: "24px 56px",
                borderRadius: 36,
                fontSize: 62,
                fontWeight: 800,
                letterSpacing: 2,
                boxShadow: `0 12px 34px ${C.shadow}`,
              }}
            >
              DAY 10 DONE!
            </div>
          </Card>
        </Entrance>
      </div>

      {/* Bottom motivational text */}
      <div style={{ position: "absolute", bottom: 80, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={44} from={24}>
          <span style={textStyle(36, theme.weights.strong, C.textDim)}>
            আপনার উপস্থিতি আমাদের উৎসাহিত করে ❤️
          </span>
        </Entrance>
      </div>
    </SceneExit>
  );
};

/* ───────────── 4 · END — See You on Day 11 ───────────── */
export const EndScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popP = spring({ frame: frame - 12, fps, config: theme.spring.bouncy });

  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={4} />
      <Sfx name="chime" at={20} rate={1.1} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          textAlign: "center",
        }}
      >
        <Entrance delay={4} from={-30}>
          <Pill tone="soft" size={42}>আগামীকাল দেখা হবে</Pill>
        </Entrance>

        <div
          style={{
            transform: `scale(${interpolate(popP, [0, 1], [0.8, 1])})`,
            marginTop: 10,
          }}
        >
          <div style={{ ...textStyle(120, theme.weights.hero, C.primaryDeep), lineHeight: 1.05 }}>
            Day 11-এ
          </div>
          <div style={{ ...textStyle(68, theme.weights.strong, C.accent), marginTop: 12 }}>
            ইনশাআল্লাহ!
          </div>
        </div>

        <Entrance delay={24} from={30}>
          <div style={{ marginTop: 24 }}>
            <Pill tone="white" size={36}>
              <span style={{ color: C.textDim }}>Arabic Master</span>
            </Pill>
          </div>
        </Entrance>
      </div>
    </SceneExit>
  );
};


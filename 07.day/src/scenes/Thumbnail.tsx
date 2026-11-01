import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { BgMesh, Finish } from "../components/layers";
import { Card, Chip } from "../components/primitives";

const C = theme.colors;

export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1080,
        fontFamily: theme.font.family,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BgMesh />

      <AbsoluteFill
        style={{
          padding: "68px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Top Header */}
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
          <Chip
            fill={C.primary}
            color="#FFFFFF"
            size={34}
            style={{
              padding: "12px 32px",
              fontWeight: theme.font.heavy,
              boxShadow: theme.shadow.soft,
            }}
          >
            DAY 07 • সপ্তম দিন
          </Chip>

          <Chip
            fill={C.accentSoft}
            color={C.text}
            size={30}
            style={{
              padding: "12px 28px",
              fontWeight: theme.font.mid,
            }}
          >
            প্রবাসীদের দৈনন্দিন আরবি
          </Chip>
        </div>

        {/* Center Card */}
        <Card
          style={{
            width: "100%",
            padding: "52px 46px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: theme.font.heavy,
              color: C.text,
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            <span
              style={{
                color: C.primary,
                textShadow: `0 0 24px ${C.primarySoft}`,
              }}
            >
              আরব
            </span>{" "}
            দেশে থাকেন?
          </div>

          <div
            style={{
              fontSize: 50,
              fontWeight: theme.font.mid,
              color: C.textDim,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            কিন্তু আরবি বলতে গিয়ে{" "}
            <span
              style={{
                color: C.accent,
                fontWeight: theme.font.heavy,
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
            <Chip
              fill={C.primarySoft}
              color={C.primaryDeep}
              size={26}
              style={{
                padding: "10px 22px",
                fontWeight: theme.font.mid,
              }}
            >
              ✓ বাক্য ৬১ – ৭০
            </Chip>
            <Chip
              fill="#FFFFFF"
              color={C.text}
              size={26}
              style={{
                padding: "10px 22px",
                fontWeight: theme.font.mid,
                border: `1.5px solid ${C.line}`,
              }}
            >
              ✓ ৩০ দিনের সহজ কোর্স
            </Chip>
            <Chip
              fill={C.primarySoft}
              color={C.primaryDeep}
              size={26}
              style={{
                padding: "10px 22px",
                fontWeight: theme.font.mid,
              }}
            >
              ✓ Arabic Master
            </Chip>
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
          }}
        >
          <Chip
            fill={C.primary}
            color="#FFFFFF"
            size={46}
            style={{
              padding: "18px 56px",
              boxShadow: theme.shadow.soft,
              fontWeight: theme.font.heavy,
            }}
          >
            চিন্তা নেই! সহজে শিখুন
          </Chip>
        </div>
      </AbsoluteFill>

      <Finish />
    </AbsoluteFill>
  );
};


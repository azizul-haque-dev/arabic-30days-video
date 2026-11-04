import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {BgMesh, FinishLayers} from '../components/Backdrop';
import {Pill, cardStyle} from '../components/primitives';

const c = theme.colors;

export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1080,
        fontFamily: theme.fonts.family,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BgMesh />

      <AbsoluteFill
        style={{
          padding: '68px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            width: '100%',
            marginTop: 8,
          }}
        >
          <Pill
            bg={c.hero}
            color={c.white}
            size={34}
            style={{
              padding: '12px 32px',
              boxShadow: theme.shadow.pop,
            }}
          >
            DAY 06 • ষষ্ঠ দিন
          </Pill>

          <Pill
            bg={c.accentSoft}
            color={c.text}
            size={30}
            style={{
              padding: '12px 28px',
            }}
          >
            প্রবাসীদের দৈনন্দিন আরবি
          </Pill>
        </div>

        {/* Center Card */}
        <div
          style={{
            ...cardStyle,
            width: '100%',
            padding: '52px 46px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: c.text,
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            <span
              style={{
                color: c.hero,
                textShadow: `0 0 24px ${c.heroSoft}`,
              }}
            >
              গালফ
            </span>{' '}
            দেশে থাকেন?
          </div>

          <div
            style={{
              fontSize: 50,
              fontWeight: 600,
              color: c.muted,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            দৈনন্দিন কথাবার্তায়{' '}
            <span
              style={{
                color: c.accent,
                fontWeight: 700,
              }}
            >
              ১০টি দরকারি
            </span>{' '}
            বাক্য
          </div>

          {/* Highlights Row */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <Pill
              bg={c.heroSoft}
              color={c.heroDeep}
              size={26}
              style={{
                padding: '10px 22px',
              }}
            >
              ✓ বাক্য ৫১ – ৬০
            </Pill>
            <Pill
              bg={c.white}
              color={c.text}
              size={26}
              style={{
                padding: '10px 22px',
                border: `1.5px solid ${c.line}`,
              }}
            >
              ✓ ৩০ দিনের Survival Series
            </Pill>
            <Pill
              bg={c.heroSoft}
              color={c.heroDeep}
              size={26}
              style={{
                padding: '10px 22px',
              }}
            >
              ✓ Arabic Master
            </Pill>
          </div>
        </div>

        {/* Bottom Relief / Callout */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            marginBottom: 12,
          }}
        >
          <Pill
            bg={c.hero}
            color={c.white}
            size={46}
            style={{
              padding: '18px 56px',
              boxShadow: theme.shadow.pop,
            }}
          >
            সহজে আরবিতে কথা বলুন!
          </Pill>
        </div>
      </AbsoluteFill>

      <FinishLayers />
    </AbsoluteFill>
  );
};

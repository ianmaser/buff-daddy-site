import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D0E2B',
          position: 'relative',
          fontFamily: 'Arial Black, sans-serif',
        }}
      >
        {/* Synthwave grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,212,200,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,62,165,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            letterSpacing: '0.1em',
            marginBottom: 16,
          }}
        >
          <span style={{ color: '#FF3EA5' }}>BUFF</span>
          <span style={{ color: '#ffffff' }}>&nbsp;DADDY&apos;S</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 40,
            letterSpacing: '0.05em',
          }}
        >
          {siteConfig.tagline}
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'High Protein', bg: '#00D4C8', color: '#0D0E2B' },
            { label: 'Low Sugar', bg: '#FF3EA5', color: '#ffffff' },
            { label: 'Clean Ingredients', bg: '#EDE0FF', color: '#0D0E2B' },
          ].map((pill) => (
            <div
              key={pill.label}
              style={{
                background: pill.bg,
                color: pill.color,
                borderRadius: 999,
                padding: '10px 24px',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              {pill.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

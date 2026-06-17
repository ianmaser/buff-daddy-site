'use client';

import { content } from '@/content';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useParallax } from '@/hooks/useParallax';

const BADGE_POSITIONS = [
  '-top-6 -left-4',
  'top-1/2 -right-8 -translate-y-1/2',
  '-bottom-6 left-6',
] as const;

const BADGE_STYLES: Record<string, string> = {
  pink: 'bg-[var(--pink)] text-white',
  cyan: 'bg-[var(--cyan)] text-[var(--navy)]',
  lavender: 'bg-[var(--lavender)] text-[var(--navy)]',
};

export default function Hero(): React.ReactElement {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const parallaxY = useParallax(0.25);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blush via-lavender to-cyan/30 overflow-hidden">
      {/* Synthwave grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(0,212,200,0.1) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,62,165,0.06) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '60px 60px',
          transform: 'perspective(800px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16 w-full">
        {/* Left — copy */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`max-w-xl transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center bg-[var(--navy)] text-[var(--cyan)] rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6">
            {content.hero.eyebrow}
          </div>

          <h1 className="font-display leading-none text-[var(--navy)] mb-6" style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}>
            {content.hero.headline}{' '}
            <span className="text-[var(--pink)]">{content.hero.headlineAccent}</span>
          </h1>

          <p className="text-[var(--text-light)] text-lg leading-relaxed mb-8">
            {content.hero.subtext}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={content.hero.primaryCta.href}
              className="bg-[var(--pink)] text-white font-semibold px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,62,165,0.4)] active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2"
            >
              {content.hero.primaryCta.label}
            </a>
            <a
              href={content.hero.secondaryCta.href}
              className="border-2 border-[var(--navy)] text-[var(--navy)] font-semibold px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2"
            >
              {content.hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Right — badge cluster with parallax */}
        <div
          className="relative flex items-center justify-center w-72 h-72 shrink-0"
          style={{ transform: `translateY(${parallaxY}px)` }}
        >
          {/* Central circle */}
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-cyan to-pink flex items-center justify-center shadow-[0_0_60px_rgba(0,212,200,0.4)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan to-pink opacity-50 animate-pulse"
              style={{ transform: 'scale(1.15)' }}
            />
            <span className="text-6xl relative z-10" role="img" aria-label="flexed bicep">
              💪
            </span>
          </div>

          {/* Floating badges */}
          {content.hero.floatingBadges.map((badge, i) => (
            <div
              key={badge.label}
              className={`absolute ${BADGE_POSITIONS[i]} ${BADGE_STYLES[badge.variant] ?? ''} text-sm font-semibold px-4 py-2 rounded-full shadow-lg animate-bounce whitespace-nowrap`}
              style={{ animationDelay: `${i * 250}ms`, animationDuration: '3s' }}
            >
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

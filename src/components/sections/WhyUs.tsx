'use client';

import { useRef, useState, useCallback } from 'react';
import { content } from '@/content';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const GRID_OVERLAY_STYLE: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(rgba(0,212,200,0.07) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,62,165,0.04) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '60px 60px',
};

interface WhyCardProps {
  icon: string;
  title: string;
  body: string;
  delay: number;
  className?: string;
}

function WhyCard({ icon, title, body, delay, className = '' }: WhyCardProps): React.ReactElement {
  const { ref, isVisible } = useScrollReveal({ delay });
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 hover:border-cyan hover:bg-cyan/[0.06] hover:-translate-y-1.5 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        <span role="img" aria-label={title}>
          {icon}
        </span>
      </div>
      <h3 className="font-display text-2xl text-white tracking-wide mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

export default function WhyUs(): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = content.whyUs.cards.length;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / cardCount;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  }, [cardCount]);

  return (
    <section id="why" className="relative bg-[var(--navy)] py-20 overflow-hidden">
      {/* Synthwave grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={GRID_OVERLAY_STYLE}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <SectionEyebrow color="cyan">{content.whyUs.eyebrow}</SectionEyebrow>
          <h2 className="font-display text-5xl text-white mt-2 mb-4">
            {content.whyUs.headline}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">{content.whyUs.subtext}</p>
        </div>

        {/* Mobile: scroll-snap carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {content.whyUs.cards.map((card, i) => (
            <WhyCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              body={card.body}
              delay={i * 100}
              className="snap-start shrink-0 w-[82vw]"
            />
          ))}
        </div>

        {/* Mobile: dot indicators */}
        <div className="md:hidden flex justify-center gap-2 mt-5" aria-hidden="true">
          {content.whyUs.cards.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-5 h-2 bg-[var(--pink)]'
                  : 'w-2 h-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Desktop: 2×2 grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {content.whyUs.cards.map((card, i) => (
            <WhyCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              body={card.body}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

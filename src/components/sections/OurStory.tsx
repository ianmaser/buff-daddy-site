'use client';

import { content } from '@/content';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const GRID_OVERLAY_STYLE: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(rgba(0,212,200,0.08) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,62,165,0.05) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '40px 40px',
};

export default function OurStory(): React.ReactElement {
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal({
    threshold: 0.2,
    delay: 150,
  });

  const { pullQuote } = content.story;

  return (
    <section id="story" className="bg-[#FAF6FF] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — visual card */}
        <div
          ref={leftRef as React.RefObject<HTMLDivElement>}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy to-[#1A1B4B] p-10 flex flex-col justify-between min-h-[420px] transition-all duration-700 ${
            leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Synthwave grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={GRID_OVERLAY_STYLE}
          />

          {/* Emojis */}
          <div className="relative z-10 text-6xl leading-none" aria-hidden="true">
            💪🍰
          </div>

          {/* Pull quote */}
          <p className="relative z-10 font-display text-3xl leading-tight mt-8">
            <span className="text-white">{pullQuote.prefix}</span>
            <span className="text-[var(--pink)]">{pullQuote.accent}</span>
            <span className="text-white">{pullQuote.suffix}</span>
          </p>
        </div>

        {/* Right — text */}
        <div
          ref={rightRef as React.RefObject<HTMLDivElement>}
          className={`flex flex-col gap-5 transition-all duration-700 ${
            rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <SectionEyebrow>{content.story.eyebrow}</SectionEyebrow>

          <h2 className="font-display text-5xl text-[var(--navy)] leading-none">
            {content.story.headline}
          </h2>

          <div className="flex flex-col gap-4">
            {content.story.paragraphs.map((p, i) => (
              <p key={i} className="text-[var(--text-light)] leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {content.story.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[var(--lavender)] text-[var(--navy)] text-sm font-semibold px-4 py-1.5 rounded-full hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

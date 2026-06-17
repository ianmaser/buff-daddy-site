'use client';

import { content } from '@/content';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
}

function StatItem({ value, label, delay }: StatItemProps): React.ReactElement {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3, delay });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`flex flex-col items-center gap-1 px-8 py-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span className="font-display text-[42px] leading-none text-[var(--pink)]">
        {value}
      </span>
      <span className="text-xs uppercase tracking-widest text-[var(--cyan)]">
        {label}
      </span>
    </div>
  );
}

export default function StatsStrip(): React.ReactElement {
  return (
    <section className="bg-[var(--navy)]">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/10">
        {content.stats.map((stat, i) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            label={stat.label}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  );
}

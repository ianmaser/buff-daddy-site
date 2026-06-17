'use client';

import { useState } from 'react';
import { content } from '@/content';
import { products } from '@/data/products';
import type { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Cookies', value: 'cookies' },
  { label: 'Bars', value: 'bars' },
  { label: 'Muffins', value: 'muffins' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

interface RevealCardProps {
  product: Product;
  delay: number;
}

function RevealCard({ product, delay }: RevealCardProps): React.ReactElement {
  const { ref, isVisible } = useScrollReveal({ delay });
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <ProductCard product={product} />
    </div>
  );
}

export default function Products(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const filtered =
    activeTab === 'all' ? products : products.filter((p) => p.category === activeTab);

  return (
    <section id="products" className="bg-[var(--blush)] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionEyebrow>{content.products.eyebrow}</SectionEyebrow>
          <h2 className="font-display text-5xl text-[var(--navy)] mt-2 mb-4">
            {content.products.headline}
          </h2>
          <p className="text-[var(--text-light)] max-w-xl mx-auto">
            {content.products.subtext}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-5 py-2 rounded-full border text-sm font-semibold active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-[var(--pink)] text-white border-pink'
                    : 'bg-transparent text-[var(--navy)] border-[var(--navy)] hover:bg-[var(--cyan)] hover:text-navy hover:border-cyan'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div
          className="grid gap-7"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {filtered.map((product, i) => (
            <RevealCard key={product.id} product={product} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

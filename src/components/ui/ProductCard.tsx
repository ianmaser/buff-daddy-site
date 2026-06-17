'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import SectionEyebrow from './SectionEyebrow';
import MacroPill from './MacroPill';
import AllergenTag from './AllergenTag';

interface ProductCardProps {
  product: Product;
}

const GRID_OVERLAY_STYLE: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(rgba(0,212,200,0.08) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,62,165,0.05) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '30px 30px',
};

export default function ProductCard({ product }: ProductCardProps): React.ReactElement {
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  return (
    <article className="group bg-white rounded-2xl border-2 border-transparent hover:border-pink hover:shadow-[0_20px_48px_rgba(255,62,165,0.18)] hover:-translate-y-1.5 active:translate-y-0 active:shadow-md transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Image area */}
      <div className={`relative h-48 bg-gradient-to-br ${product.cardBg} overflow-hidden`}>
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt ?? product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span
              className="text-[72px] leading-none"
              role="img"
              aria-label={product.name}
            >
              {product.emoji}
            </span>
          </div>
        )}
        {/* Synthwave grid overlay — consistent aesthetic pre/post photo swap */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={GRID_OVERLAY_STYLE}
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <SectionEyebrow>{product.category}</SectionEyebrow>

        <h3 className="font-display text-[26px] leading-none text-[var(--navy)]">
          {product.name}
        </h3>

        <p className="text-sm text-[var(--text-light)] leading-snug">{product.tagline}</p>

        {/* Macros */}
        <div className="flex flex-wrap gap-1.5">
          <MacroPill value={product.macros.protein} label="protein" variant="protein" />
          <MacroPill value={product.macros.calories} label="cal" />
          <MacroPill value={product.macros.sugar} label="sugar" />
        </div>

        {/* Allergens */}
        {product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.allergens.map((a) => (
              <AllergenTag key={a} label={a} />
            ))}
          </div>
        )}

        {/* Ingredients toggle / coming soon CTA */}
        {product.comingSoon ? (
          <a
            href="#contact"
            className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan-deep)] hover:underline mt-1 focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 rounded"
          >
            Get Notified →
          </a>
        ) : (
          <div className="mt-1">
            <button
              onClick={() => setIngredientsOpen((o) => !o)}
              className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan-deep)] hover:text-[var(--cyan)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 rounded"
            >
              {ingredientsOpen ? '↑ Hide' : '↓ Ingredients'}
            </button>
            {ingredientsOpen && (
              <p className="mt-2 text-xs text-[var(--text-light)] leading-relaxed">
                {product.ingredients}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

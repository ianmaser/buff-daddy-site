'use client';

import { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site';
import { useScrolled } from '@/hooks/useScrolled';
import { useActiveSection } from '@/hooks/useActiveSection';

const SECTION_IDS = ['products', 'why', 'story', 'order', 'contact'];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeDrawer = () => setDrawerOpen(false);

  // Focus trap for mobile drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const isActive = (href: string) => {
    const id = href.replace('#', '');
    return activeSection === id;
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`sticky top-0 z-50 backdrop-blur-md border-b border-black/[0.06] transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(255,245,250,0.97)] shadow-sm'
            : 'bg-[rgba(255,245,250,0.80)]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 rounded">
            <div className="w-8 h-8 rounded-full bg-[var(--navy)] flex items-center justify-center text-base leading-none">
              <span aria-hidden="true">💪</span>
            </div>
            <span className="font-display text-xl tracking-widest leading-none">
              <span className="text-[var(--navy)]">BUFF</span>
              <span className="text-[var(--pink)]">DADDY&apos;S</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {siteConfig.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[var(--pink)]'
                    : 'text-[var(--navy)] hover:text-[var(--pink)]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Order Now + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#order"
              className="hidden md:inline-flex bg-[var(--pink)] text-white text-sm font-semibold px-5 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,62,165,0.4)] active:translate-y-0 active:scale-[0.98]"
            >
              Order Now
            </a>

            {/* Hamburger */}
            <button
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 text-[var(--navy)] text-xl focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 rounded"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div ref={drawerRef} className="absolute top-0 left-0 right-0 bg-[var(--navy)] px-6 py-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl tracking-widest text-white">
                BUFF<span className="text-[var(--pink)]">DADDY&apos;S</span>
              </span>
              <button
                aria-label="Close navigation menu"
                onClick={closeDrawer}
                className="text-white/60 hover:text-white text-2xl leading-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {siteConfig.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className="text-white/80 hover:text-white font-medium text-lg py-1 border-b border-white/[0.06] active:scale-95"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="#order"
              onClick={closeDrawer}
              className="bg-[var(--pink)] text-white font-semibold text-center py-3 rounded-full hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,62,165,0.4)] active:translate-y-0 active:scale-[0.98]"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </>
  );
}

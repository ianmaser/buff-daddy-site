import { useRef, useState, useEffect, type RefObject } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  delay?: number;
}

// One observer per threshold value, shared across all elements using the same threshold.
// WeakMap maps each observed element to its reveal callback.
const observers = new Map<number, IntersectionObserver>();
const elementCallbacks = new WeakMap<Element, () => void>();

function getObserver(threshold: number): IntersectionObserver {
  const cached = observers.get(threshold);
  if (cached) return cached;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const callback = elementCallbacks.get(entry.target);
          if (callback) {
            callback();
            observer.unobserve(entry.target);
            elementCallbacks.delete(entry.target);
          }
        }
      }
    },
    { threshold },
  );

  observers.set(threshold, observer);
  return observer;
}

export function useScrollReveal(options: ScrollRevealOptions = {}): {
  ref: RefObject<HTMLElement | null>;
  isVisible: boolean;
} {
  const { threshold = 0.15, delay = 0 } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.transitionDelay = `${delay}ms`;

    elementCallbacks.set(el, () => setIsVisible(true));
    const observer = getObserver(threshold);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      elementCallbacks.delete(el);
    };
  }, [threshold, delay]);

  return { ref, isVisible };
}

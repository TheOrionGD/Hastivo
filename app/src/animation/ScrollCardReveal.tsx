import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollCardRevealProps {
  children: React.ReactNode;
  className?: string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  stagger?: number;
  itemSelector?: string;
  variant?: 'fade-up' | 'scale-lift' | 'slide-in';
}

export const ScrollCardReveal: React.FC<ScrollCardRevealProps> = ({
  children,
  className = '',
  start = 'top 90%',
  end = 'bottom 60%',
  scrub = 0.8,
  stagger = 0.12,
  itemSelector = '.scroll-card-item',
  variant = 'fade-up',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const items = el.querySelectorAll<HTMLElement>(itemSelector);
    if (!items || items.length === 0) return;

    let ctx: gsap.Context | null = null;

    ctx = gsap.context(() => {
      let fromVars: gsap.TweenVars = {};

      if (variant === 'fade-up') {
        fromVars = {
          opacity: 0.12,
          y: 40,
          scale: 0.96,
        };
      } else if (variant === 'scale-lift') {
        fromVars = {
          opacity: 0.15,
          scale: 0.9,
          y: 25,
        };
      } else {
        fromVars = {
          opacity: 0.1,
          x: -30,
        };
      }

      gsap.fromTo(
        items,
        fromVars,
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: scrub === true ? 0.8 : scrub,
          },
        }
      );
    }, el);

    return () => {
      ctx?.revert();
    };
  }, [start, end, scrub, stagger, itemSelector, variant]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};


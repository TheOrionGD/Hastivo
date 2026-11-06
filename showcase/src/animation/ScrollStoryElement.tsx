import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type GranularityType = 'chars' | 'words' | 'lines';

interface ScrollStoryElementProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'li';
  className?: string;
  granularity?: GranularityType;
  /**
   * ScrollTrigger start position relative to element & viewport.
   * Defaults to entering the viewport smoothly.
   */
  start?: string;
  /**
   * ScrollTrigger end position.
   */
  end?: string;
  /**
   * Scrub smoothness. Number in seconds (e.g., 0.8) for smooth lag, or boolean.
   */
  scrub?: number | boolean;
  /**
   * Visual entrance style:
   * - 'progressive-clarity': words/chars start semi-dimmed (opacity: 0.18, subtle y shift) and illuminate to 100% crispness.
   * - 'chromatic-lift': chars/words rise from y: 24px with rotateX -15deg and glow into view.
   * - 'editorial-mask': high fashion clip-reveal from below baseline.
   */
  variant?: 'progressive-clarity' | 'chromatic-lift' | 'editorial-mask';
  /**
   * Stagger multiplier across target units.
   */
  stagger?: number;
  /**
   * Optional manual key trigger to force re-split on text changes
   */
  triggerKey?: any;
}

export const ScrollStoryElement: React.FC<ScrollStoryElementProps> = ({
  children,
  as: Component = 'div',
  className = '',
  granularity = 'words',
  start = 'top 88%',
  end = 'bottom 45%',
  scrub = 0.8,
  variant = 'progressive-clarity',
  stagger = 0.05,
  triggerKey,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let splitInstance: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    // Small delay to ensure layout has settled (especially with webfonts)
    const timer = setTimeout(() => {
      try {
        splitInstance = new SplitType(el, {
          types: granularity,
          tagName: 'span',
        });

        const targets =
          granularity === 'chars'
            ? splitInstance.chars
            : granularity === 'words'
            ? splitInstance.words
            : splitInstance.lines;

        if (!targets || targets.length === 0) return;

        targets.forEach((target) => {
          target.style.display = 'inline-block';
          target.style.willChange = 'opacity, transform, filter';
        });

        ctx = gsap.context(() => {
          let fromVars: gsap.TweenVars = {};
          let toVars: gsap.TweenVars = {};

          if (variant === 'progressive-clarity') {
            fromVars = {
              opacity: 0.14,
              y: 7,
              filter: 'blur(1.5px)',
            };
            toVars = {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              stagger,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start,
                end,
                scrub: scrub === true ? 0.7 : scrub,
              },
            };
          } else if (variant === 'chromatic-lift') {
            fromVars = {
              opacity: 0.08,
              y: 18,
              rotateX: -20,
              transformOrigin: '50% 100%',
            };
            toVars = {
              opacity: 1,
              y: 0,
              rotateX: 0,
              stagger: stagger * 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start,
                end,
                scrub: scrub === true ? 0.8 : scrub,
              },
            };
          } else {
            // editorial-mask
            fromVars = {
              opacity: 0,
              y: '100%',
            };
            toVars = {
              opacity: 1,
              y: '0%',
              stagger,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start,
                end,
                scrub: scrub === true ? 0.8 : scrub,
              },
            };
          }

          gsap.fromTo(targets, fromVars, toVars);
        }, el);
      } catch (err) {
        console.warn('ScrollStoryElement fallback:', err);
      }
    }, 60);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
      splitInstance?.revert();
    };
  }, [granularity, start, end, scrub, variant, stagger, triggerKey]);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `scroll-story-element ${className}`,
    },
    children
  );
};


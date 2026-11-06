import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

interface TextRevealProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  type?: 'chars' | 'words' | 'lines';
  delay?: number;
  duration?: number;
  stagger?: number;
  scrollTrigger?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  as: Component = 'div',
  className = '',
  type = 'words',
  delay = 0,
  duration = 0.85,
  stagger = 0.035,
  scrollTrigger = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let splitInstance: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    try {
      splitInstance = new SplitType(el, {
        types: type,
        tagName: 'span',
      });

      const targets =
        type === 'chars'
          ? splitInstance.chars
          : type === 'words'
          ? splitInstance.words
          : splitInstance.lines;

      if (!targets || targets.length === 0) return;

      // Wrap targets in an overflow-hidden wrapper if they aren't already
      targets.forEach((target) => {
        target.style.display = 'inline-block';
        target.style.willChange = 'transform, opacity';
      });

      ctx = gsap.context(() => {
        gsap.set(targets, {
          y: '110%',
          opacity: 0,
          rotateX: type === 'chars' ? -15 : 0,
        });

        const animConfig: gsap.TweenVars = {
          y: '0%',
          opacity: 1,
          rotateX: 0,
          duration,
          ease: 'power4.out',
          stagger,
          delay,
        };

        if (scrollTrigger) {
          animConfig.scrollTrigger = {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          };
        }

        gsap.to(targets, animConfig);
      }, el);
    } catch (e) {
      console.warn('TextReveal error, falling back:', e);
    }

    return () => {
      ctx?.revert();
      splitInstance?.revert();
    };
  }, [type, delay, duration, stagger, scrollTrigger]);

  return (
    <Component
      ref={containerRef as any}
      className={`overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      {children}
    </Component>
  );
};


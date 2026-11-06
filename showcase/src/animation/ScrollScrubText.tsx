import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

interface ScrollScrubTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  type?: 'chars' | 'words';
  start?: string;
  end?: string;
}

export const ScrollScrubText: React.FC<ScrollScrubTextProps> = ({
  children,
  as: Component = 'div',
  className = '',
  type = 'words',
  start = 'top 85%',
  end = 'bottom 45%',
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

      const targets = type === 'chars' ? splitInstance.chars : splitInstance.words;
      if (!targets || targets.length === 0) return;

      targets.forEach((target) => {
        target.style.display = 'inline-block';
        target.style.willChange = 'opacity, transform';
      });

      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          {
            opacity: 0.18,
            y: 8,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub: 0.8,
            },
          }
        );
      }, el);
    } catch (e) {
      console.warn('ScrollScrubText fallback:', e);
    }

    return () => {
      ctx?.revert();
      splitInstance?.revert();
    };
  }, [type, start, end]);

  return (
    <Component ref={containerRef as any} className={className}>
      {children}
    </Component>
  );
};


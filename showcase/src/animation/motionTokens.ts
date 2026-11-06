import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const MOTION_TOKENS = {
  duration: {
    fast: 0.25,
    normal: 0.45,
    editorial: 0.85,
    slow: 1.25,
  },
  ease: {
    editorial: 'power4.out',
    cinematic: 'power3.inOut',
    smooth: 'power2.out',
    cubic: [0.16, 1, 0.3, 1] as const,
  },
  stagger: {
    chars: 0.02,
    words: 0.045,
    lines: 0.08,
    cards: 0.1,
    tags: 0.05,
  }
};


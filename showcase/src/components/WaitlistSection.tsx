import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ScrollStoryElement } from '../animation/ScrollStoryElement';
import { ScrollCardReveal } from '../animation/ScrollCardReveal';
import { MagneticButton } from '../animation/MagneticButton';
import { AnimatedBadge } from '../animation/AnimatedBadge';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
  };

  return (
    <section
      id="waitlist"
      className="relative w-full py-28 md:py-36 border-t border-[var(--divider)] overflow-hidden transition-colors flex items-center justify-center min-h-[700px] bg-[#0c0e12]"
    >
      {/* Dynamic Ambient Fluid Light Ribbons Matching image_b853596c.png */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft dark fluid gradient underlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(30,34,42,0.85)_0%,#090a0d_80%)]" />

        {/* Amber & Golden Glowing Ribbons SVG */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Ribbon 1 Gradient: Warm Amber to Gold */}
            <linearGradient id="ribbonGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </linearGradient>

            {/* Ribbon 2 Gradient: Vibrant Orange to Peach */}
            <linearGradient id="ribbonGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#f97316" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </linearGradient>

            {/* Ribbon 3 Gradient: Deep Ambient Curve */}
            <linearGradient id="ribbonGlow3" x1="20%" y1="80%" x2="80%" y2="20%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.1" />
            </linearGradient>

            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="38" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="wideBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="70" />
            </filter>
          </defs>

          {/* Broad atmospheric back glow */}
          <path
            d="M -100 450 C 300 200, 750 150, 1100 380 C 1350 540, 1500 480, 1600 400"
            fill="none"
            stroke="url(#ribbonGlow1)"
            strokeWidth="110"
            filter="url(#wideBlur)"
            opacity="0.6"
          />

          {/* Golden Ribbon Loop 1 (Ambient behind card) */}
          <ellipse
            cx="860"
            cy="270"
            rx="320"
            ry="130"
            transform="rotate(-18 860 270)"
            fill="none"
            stroke="url(#ribbonGlow1)"
            strokeWidth="36"
            filter="url(#softGlow)"
            opacity="0.85"
          />

          {/* Dynamic Twisting Ribbon 2 (Flowing across card) */}
          <path
            d="M -50 320 Q 380 40, 780 230 T 1500 220"
            fill="none"
            stroke="url(#ribbonGlow2)"
            strokeWidth="28"
            filter="url(#softGlow)"
            opacity="0.9"
          />

          {/* Crisp highlight ribbon edge line for high-definition depth */}
          <path
            d="M -50 320 Q 380 40, 780 230 T 1500 220"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="3.5"
            opacity="0.85"
          />

          {/* Loop core bright filament */}
          <ellipse
            cx="860"
            cy="270"
            rx="255"
            ry="105"
            transform="rotate(-18 860 270)"
            fill="none"
            stroke="#fffbeb"
            strokeWidth="4"
            opacity="0.9"
          />

          {/* Lower subtle curve behind bottom card edge */}
          <path
            d="M 120 720 C 480 620, 880 780, 1400 680"
            fill="none"
            stroke="url(#ribbonGlow3)"
            strokeWidth="45"
            filter="url(#wideBlur)"
          />
        </svg>

        {/* Ambient atmospheric orange/amber light burst */}
        <div className="absolute top-[28%] left-[58%] -translate-x-1/2 w-[520px] h-[260px] bg-amber-500/30 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="max-w-[760px] w-full mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Top Floating Pill: ⚡ Waitlist matching reference image */}
        <AnimatedBadge variant="primary" pulse className="mb-6">
          <svg
            className="w-3.5 h-3.5 fill-current"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>Priority Waitlist</span>
        </AnimatedBadge>

        {/* Large Editorial Headline: Coming soon! - Character-Level scroll scrub */}
        <ScrollStoryElement
          as="h2"
          granularity="chars"
          variant="chromatic-lift"
          start="top 90%"
          end="bottom 60%"
          stagger={0.04}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight mb-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] select-none font-sans"
        >
          Coming soon!
        </ScrollStoryElement>

        {/* Frosted Glass Chassis Card with Card-Level scroll-driven reveal */}
        <ScrollCardReveal
          start="top 90%"
          end="bottom 55%"
          itemSelector=".waitlist-card-chassis"
          className="w-full"
        >
          <div className="waitlist-card-chassis w-full bg-[#1b1e24]/50 border border-white/[0.18] backdrop-blur-3xl rounded-[28px] sm:rounded-[34px] p-8 sm:p-12 md:p-14 shadow-[0_25px_90px_rgba(0,0,0,0.65)] text-white relative">
            {/* Subtle top edge specular highlight */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Word-level scroll headline */}
            <ScrollStoryElement
              as="h3"
              granularity="words"
              variant="chromatic-lift"
              start="top 92%"
              end="bottom 70%"
              className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-white tracking-tight mb-3 font-sans"
            >
              Join our waitlist!
            </ScrollStoryElement>

            {/* Passage-level scroll scrubbing narrative */}
            <ScrollStoryElement
              as="p"
              granularity="words"
              variant="progressive-clarity"
              start="top 92%"
              end="bottom 70%"
              className="text-sm sm:text-base text-neutral-300/90 max-w-md mx-auto mb-9 leading-relaxed font-sans"
            >
              Sign up for our newsletter to receive the latest updates and insights straight to your inbox.
            </ScrollStoryElement>

            {joined ? (
              <div className="py-4 px-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs sm:text-sm flex items-center justify-center gap-2.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You're on the priority waitlist! We'll reach out to {email} shortly.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-[460px] mx-auto flex flex-col sm:flex-row items-center gap-2.5 p-1.5 rounded-[28px] sm:rounded-full bg-[#0a0c10]/85 border border-white/[0.15] shadow-inner"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-5 py-3 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
                />
                <MagneticButton
                  type="submit"
                  strength={0.2}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm font-sans tracking-tight hover:bg-neutral-100 transition-all shadow-[0_0_25px_rgba(255,255,255,0.7)] hover:shadow-[0_0_35px_rgba(255,255,255,0.95)] shrink-0"
                >
                  Join Waitlist
                </MagneticButton>
              </form>
            )}
          </div>
        </ScrollCardReveal>

        {/* Bottom Social Media Frosted Buttons: 𝕏, f, 📷 with Points-Level Scroll entrance */}
        <ScrollCardReveal
          start="top 95%"
          end="bottom 75%"
          stagger={0.08}
          itemSelector=".social-pill-point"
          className="flex items-center gap-3 mt-7"
        >
          {/* X / Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter)"
            className="social-pill-point w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.18] backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <span className="font-bold text-sm select-none">𝕏</span>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="social-pill-point w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.18] backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm font-serif font-bold text-base select-none"
          >
            f
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-pill-point w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.18] backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm select-none"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </ScrollCardReveal>
      </div>
    </section>
  );
};

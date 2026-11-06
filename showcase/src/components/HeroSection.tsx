import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TextReveal } from '../animation/TextReveal';
import { MagneticButton } from '../animation/MagneticButton';
import { AnimatedBadge } from '../animation/AnimatedBadge';
import { CircularTagline } from './CircularTagline';

interface HeroSectionProps {
  onOpenDiscoveryCall: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDiscoveryCall }) => {
  const { t, language } = useTheme();

  return (
    <section id="top" className="relative w-full pt-16 sm:pt-20 md:pt-28 pb-28 md:pb-36 overflow-hidden">
      {/* Dynamic Background Rotating System Tagline Circle */}
      <div className="intro-circle red" aria-hidden="true">
        <CircularTagline
          text="• EVERY GESTURE DESERVES TO BE HEARD • HASTIVO AI SPATIAL LINGUISTICS • 60 FPS PROCEDURAL KINEMATICS "
          className="w-full h-full text-[var(--primary)] opacity-85 dark:opacity-90"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-8 md:px-14 relative z-10">
        <div className="grid grid-cols-12 gap-6 items-start relative">
          {/* Cinematic Editorial Hero Imagery (Replacing favicon emblem) */}
          <div
            className="absolute -right-8 sm:right-0 lg:right-6 -top-8 sm:-top-14 md:-top-20 z-0 pointer-events-none select-none w-[280px] sm:w-[380px] md:w-[480px] lg:w-[540px] xl:w-[580px] opacity-90 dark:opacity-95"
            aria-hidden="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[3/4] overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
            >
              <img
                src="./assets/hero-editorial.jpg"
                alt="HASTIVO Spatial Sign Language Communication"
                className="w-full h-full object-cover filter contrast-110 brightness-95"
              />
              {/* Subtle gradient vignette blend into the page */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/70 via-transparent to-transparent opacity-60" />

              {/* Technical Telemetry Badge overlay on image bottom-right */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/15 font-mono text-[10px] text-white/90 tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span>SPATIAL KINEMATICS • 60 FPS</span>
              </div>
            </motion.div>
          </div>

          {/* Left Column: Vertical Category Identifier */}
          <div className="col-span-12 md:col-span-1 relative pt-2">
            {/* Desktop Vertical Text */}
            <div className="hidden md:block">
              <span className="vertical-text-mode inline-block text-[14px] font-mono tracking-widest text-[var(--text-primary)] select-none opacity-80 uppercase">
                HASTIVO • AI Spatial Linguistics
              </span>
            </div>
            {/* Mobile Horizontal Text */}
            <div className="block md:hidden pb-4">
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-[var(--primary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                HASTIVO • AI Spatial Linguistics
              </span>
            </div>
          </div>

          {/* Right Column: Hero Headline & Narrative */}
          <div className="col-span-12 md:col-span-11 relative z-10">
            {/* Brand Title Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 md:mb-12 inline-flex items-center gap-2 select-none"
            >
              <span className="font-felix text-2xl sm:text-3xl md:text-4xl tracking-widest text-[var(--text-primary)] font-normal uppercase">
                HASTIVO
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
            </motion.div>

            {/* Large Editorial Headline: EVERY GESTURE DESERVES TO BE HEARD */}
            <div className="font-felix text-[46px] sm:text-[72px] md:text-[96px] lg:text-[120px] xl:text-[140px] leading-[0.92] tracking-[-0.02em] text-[var(--text-primary)] uppercase mb-12 md:mb-16 select-none">
              <TextReveal as="h1" type="lines" duration={1.1} stagger={0.12} scrollTrigger={false}>
                EVERY<br />
                GESTURE<br />
                DESERVES<br />
                <span className="text-[var(--primary)] drop-shadow-[0_2px_24px_rgba(255,111,97,0.35)]">
                  TO BE HEARD
                </span>
              </TextReveal>
            </div>

            {/* Narrative Description & CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-12 gap-6"
            >
              <div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-start-3 lg:col-span-9">
                <TextReveal as="p" type="words" duration={0.7} stagger={0.02} delay={0.3} scrollTrigger={false} className="font-exo text-lg sm:text-xl md:text-2xl lg:text-[25px] leading-relaxed md:leading-[1.7] text-[var(--text-secondary)] mb-10">
                  HASTIVO is an interactive, AI-assisted sign-language communication platform dedicated to the principle that every gesture deserves to be heard. By combining context-aware Subject-Object-Verb gloss parsing, 60 FPS markerless vision landmark telemetry, and WebGL procedural 3D avatar kinematics, we bridge spoken, written, and natural sign languages across seven regional languages.
                </TextReveal>

                {/* Action CTAs with Magnetic Floating Physics */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <MagneticButton
                    asAnchor
                    href="#simulator"
                    strength={0.25}
                    className="px-7 py-4 bg-[var(--text-primary)] text-[var(--text-inverse)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all shadow-md group"
                  >
                    <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                    <span>Launch 3D Simulator</span>
                  </MagneticButton>

                  <MagneticButton
                    asAnchor
                    href="#architecture"
                    strength={0.25}
                    className="px-6 py-4 border border-[var(--border)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all group bg-[var(--surface)]"
                  >
                    <span>Explore Architecture</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>

                  <MagneticButton
                    asAnchor
                    href="#waitlist"
                    strength={0.25}
                    className="px-6 py-4 bg-[var(--primary)] text-white font-mono text-xs uppercase tracking-widest hover:bg-[var(--primary-hover)] transition-all rounded-full shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Join Priority Waitlist</span>
                  </MagneticButton>
                </div>

                {/* Language Availability Animated Badges */}
                <div className="mt-8 pt-6 border-t border-[var(--divider)] flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-[var(--primary)] font-semibold mr-2">Supported:</span>
                  {[
                    'English (EN)',
                    'हिन्दी (Hindi)',
                    'தமிழ் (Tamil)',
                    'తెలుగు (Telugu)',
                    'ಕನ್ನಡ (Kannada)',
                    'മലയാളം (Malayalam)',
                    'اردو (Urdu RTL)',
                  ].map((lang, idx) => (
                    <AnimatedBadge key={idx} variant="neutral">
                      {lang}
                    </AnimatedBadge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { realSourcesData, RealSourceItem } from '../data/realSourcesData';
import {
  ArrowUpRight,
  ShieldCheck,
  FileCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import { ScrollStoryElement } from '../animation/ScrollStoryElement';
import { ScrollCardReveal } from '../animation/ScrollCardReveal';
import { TiltCard } from '../animation/TiltCard';
import { AnimatedBadge } from '../animation/AnimatedBadge';

export const BrandsSection: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<RealSourceItem | null>(null);

  return (
    <section
      id="partners"
      className="relative w-full py-24 md:py-36 border-t border-[var(--divider)] bg-[var(--background)] transition-colors"
      aria-label="06 Sources & Verified Resources"
    >
      <div className="max-w-[1720px] mx-auto px-8 md:px-14">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-20">
          <div className="col-span-12 md:col-span-1">
            <ScrollStoryElement
              as="span"
              granularity="words"
              start="top 92%"
              end="bottom 70%"
              className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              06 / Sources
            </ScrollStoryElement>
          </div>

          <div className="col-span-12 md:col-span-11">
            <ScrollStoryElement
              as="span"
              granularity="words"
              start="top 92%"
              end="bottom 70%"
              className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] block mb-2"
            >
              Corpora, Kinematics & Academic Provenance
            </ScrollStoryElement>

            {/* Title: Character-Level Scroll-Driven Animation */}
            <ScrollStoryElement
              as="h2"
              granularity="chars"
              variant="chromatic-lift"
              start="top 88%"
              end="bottom 55%"
              stagger={0.025}
              className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-6 select-none"
            >
              RESOURCES COLLECTED FROM AUTHORITIES.
            </ScrollStoryElement>

            {/* Passage-Level and Word-Level Scrubbing */}
            <ScrollStoryElement
              as="p"
              granularity="words"
              variant="progressive-clarity"
              start="top 85%"
              end="bottom 50%"
              stagger={0.03}
              className="font-exo text-lg sm:text-xl md:text-2xl leading-relaxed text-[var(--text-secondary)] max-w-4xl"
            >
              We build upon linguistic corpora, 3D kinematics datasets, computer vision models, and accessibility standards sourced directly from accredited global institutions and open research initiatives.
            </ScrollStoryElement>
          </div>
        </div>

        {/* 8-Logo Matrix Grid with Card-Level progressive scroll entrance */}
        <ScrollCardReveal
          start="top 88%"
          end="bottom 55%"
          stagger={0.06}
          itemSelector=".source-card-item"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--divider)]"
        >
          {realSourcesData.map((source) => (
            <div key={source.id} className="source-card-item">
              <TiltCard
                onClick={() => setSelectedSource(source)}
                maxTilt={5}
                scaleHover={1.02}
                className="p-8 sm:p-10 border-r border-b border-[var(--divider)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-all flex flex-col justify-between items-center text-center group min-h-[260px] relative cursor-pointer h-full"
                title={`${source.name} — Sourced from ${source.institution}`}
              >
                {/* Category chip top */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mb-4">
                  <AnimatedBadge variant="neutral" className="text-[9px] py-0.5">
                    {source.category}
                  </AnimatedBadge>
                  <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 text-[var(--primary)] transition-all">
                    Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Central Authority Image Logo */}
                <div className="my-auto py-2 flex items-center justify-center">
                  <img
                    src={source.logo}
                    alt={source.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                </div>

                {/* Bottom title & institution */}
                <div className="w-full mt-4 text-center">
                  <h3 className="font-felix text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors uppercase leading-tight line-clamp-1">
                    {source.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1 truncate">
                    {source.institution}
                  </p>
                </div>
              </TiltCard>
            </div>
          ))}
        </ScrollCardReveal>

        {/* Modal Deep-Dive popup */}
        <AnimatePresence>
          {selectedSource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
              onClick={() => setSelectedSource(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-2xl w-full bg-[var(--surface)] border border-[var(--border)] p-8 shadow-2xl relative"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="font-mono text-xs uppercase text-[var(--primary)] font-bold">
                      {selectedSource.category}
                    </span>
                    <h3 className="font-felix text-2xl sm:text-3xl text-[var(--text-primary)] uppercase mt-1">
                      {selectedSource.name}
                    </h3>
                    <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">
                      {selectedSource.institution}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="font-exo text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                  {selectedSource.description}
                </p>

                <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-2 font-mono text-xs mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Verified Badge:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {selectedSource.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Licensing:</span>
                    <span className="font-semibold text-[var(--secondary)]">
                      {selectedSource.license}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Source Status:</span>
                    <span className="font-semibold text-emerald-500">
                      {selectedSource.sourceStatus}
                    </span>
                  </div>
                </div>

                {/* Specific specs list */}
                <div className="mb-6 grid grid-cols-2 gap-2 text-xs font-mono">
                  {selectedSource.specs.map((spec, i) => (
                    <div key={i} className="p-2 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">{spec.label}</span>
                      <span className="text-[var(--text-primary)] font-semibold">{spec.val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <a
                    href={selectedSource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[var(--primary)] text-white font-mono text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    <span>View Provenance</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

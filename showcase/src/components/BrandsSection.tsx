import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { realSourcesData, RealSourceItem } from '../data/realSourcesData';
import {
  ArrowUpRight,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  FileCode,
  Info
} from 'lucide-react';
import { TextReveal } from '../animation/TextReveal';
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
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              06 / Sources
            </span>
          </div>

          <div className="col-span-12 md:col-span-11">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] block mb-2">
              Corpora, Kinematics & Academic Provenance
            </span>
            <TextReveal as="h2" type="chars" duration={0.9} stagger={0.025} className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-6 select-none">
              RESOURCES COLLECTED FROM AUTHORITIES.
            </TextReveal>
            <TextReveal as="p" type="words" duration={0.7} stagger={0.02} className="font-exo text-lg sm:text-xl md:text-2xl leading-relaxed text-[var(--text-secondary)] max-w-4xl">
              We build upon linguistic corpora, 3D kinematics datasets, computer vision models, and accessibility standards sourced directly from accredited global institutions and open research initiatives.
            </TextReveal>
          </div>
        </div>

        {/* 8-Logo Matrix Grid (Exact PACT.MEDIA Swiss Grid Layout with Tilt & Glare) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--divider)]">
          {realSourcesData.map((source) => (
            <TiltCard
              key={source.id}
              onClick={() => setSelectedSource(source)}
              maxTilt={5}
              scaleHover={1.02}
              className="p-8 sm:p-10 border-r border-b border-[var(--divider)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-all flex flex-col justify-between items-center text-center group min-h-[260px] relative cursor-pointer"
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

              {/* Central Authority SVG Logo with Grayscale to Color hover */}
              <div className="w-full h-24 flex items-center justify-center p-2">
                <img
                  src={source.logo}
                  alt={source.name}
                  className="max-h-16 max-w-[210px] w-full object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Source Name & Provenance Footnote */}
              <div className="w-full pt-4 border-t border-[var(--border-subtle)] mt-2">
                <span className="font-felix text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors uppercase truncate block">
                  {source.institution}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5 truncate">
                  {source.badge} • {source.license}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Clear Truthful Disclaimer Ribbon */}
        <div className="mt-12 p-6 bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 font-mono text-xs text-[var(--text-secondary)]">
          <div className="flex items-start sm:items-center gap-3">
            <Info className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="text-[var(--text-primary)]">
                Provenance & Compliance Notice:
              </strong>{' '}
              <span>
                Our platform is an independent open implementation; it is not officially affiliated with or endorsed by these institutions. All training tokens, 3D kinematics, and vision models are utilized strictly in accordance with their respective open research and Creative Commons licenses.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>WCAG 2.2 AA Aligned</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold px-2.5 py-1 bg-sky-500/10 border border-sky-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>ISO 639-3 ins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal for Selected Data Source */}
      <AnimatePresence>
        {selectedSource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6 sm:p-8 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--primary)] font-semibold">
                      06 / Source Provenance
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-sky-500/10 border border-sky-500/30 text-sky-400">
                      {selectedSource.sourceStatus}
                    </span>
                  </div>
                  <h3 className="font-felix text-2xl sm:text-3xl text-[var(--text-primary)] uppercase">
                    {selectedSource.name}
                  </h3>
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
                    Origin Authority: {selectedSource.institution}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="p-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                {/* Logo Banner in Modal */}
                <div className="w-full h-20 bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center p-4">
                  <img
                    src={selectedSource.logo}
                    alt={selectedSource.name}
                    className="max-h-12 max-w-[240px] object-contain"
                  />
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Corpus & Resource Description
                  </h4>
                  <p className="font-exo text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {selectedSource.description}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--surface)] border border-[var(--border)] font-mono text-xs">
                  {selectedSource.specs.map((sp, idx) => (
                    <div key={idx}>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">
                        {sp.label}
                      </span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        {sp.val}
                      </span>
                    </div>
                  ))}
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">License</span>
                    <span className="text-[var(--text-primary)] font-semibold">{selectedSource.license}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">Resource Status</span>
                    <span className="text-sky-400 font-semibold">{selectedSource.sourceStatus}</span>
                  </div>
                </div>

                {/* Local Repository Path */}
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Integrated Workspace Path
                  </h4>
                  <div className="p-3 bg-[var(--background)] border border-[var(--border)] font-mono text-xs text-[var(--primary)] truncate">
                    o:/sign/{selectedSource.repoPath}
                  </div>
                </div>

                {/* External Links / Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    Used strictly as an external research resource.
                  </span>
                  <div className="flex gap-3">
                    <a
                      href={selectedSource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[var(--primary)] text-white font-mono text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    >
                      Official Source <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

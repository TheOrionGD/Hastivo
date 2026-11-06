import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ARCHITECTURE_SERVICES, ArchitectureService } from '../data/hastivoData';
import { ChevronDown, ChevronUp, Cpu, ArrowUpRight } from 'lucide-react';
import { ScrollStoryElement } from '../animation/ScrollStoryElement';
import { ScrollCardReveal } from '../animation/ScrollCardReveal';
import { AnimatedBadge } from '../animation/AnimatedBadge';

export const ServicesSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("neural-sov-parser");

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="architecture"
      className="relative w-full py-24 md:py-36 border-t border-[var(--divider)] bg-[var(--background)] transition-colors"
    >
      <div className="max-w-[1720px] mx-auto px-8 md:px-14">
        {/* Section Header: WHAT WE DO. */}
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-1">
            <ScrollStoryElement
              as="span"
              granularity="words"
              start="top 92%"
              end="bottom 70%"
              className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold"
            >
              01 / Core
            </ScrollStoryElement>
          </div>

          <div className="col-span-12 md:col-span-11">
            {/* Section Title: Character-Level Scroll-Driven Animation */}
            <ScrollStoryElement
              as="h2"
              granularity="chars"
              variant="chromatic-lift"
              start="top 88%"
              end="bottom 55%"
              stagger={0.04}
              className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-8 select-none"
            >
              WHAT WE DO.
            </ScrollStoryElement>

            {/* Passage-Level and Word-Level Scrubbing */}
            <div className="max-w-3xl">
              <ScrollStoryElement
                as="p"
                granularity="words"
                variant="progressive-clarity"
                start="top 85%"
                end="bottom 50%"
                stagger={0.03}
                className="font-exo text-lg sm:text-xl md:text-2xl leading-relaxed text-[var(--text-secondary)]"
              >
                HASTIVO is engineered as a multi-service spatial linguistics architecture. We do not rely on naive word-by-word substitution or isolated still gestures. We integrate real-time neural syntactic parsing, 60 FPS markerless vision tracking, procedural WebGL 3D avatar kinematics, and bilateral duplex event orchestration across seven regional languages.
              </ScrollStoryElement>
            </div>
          </div>
        </div>

        {/* 6 Expandable Architectural Service Drawers with Card/Drawer-level Scroll reveals */}
        <ScrollCardReveal
          start="top 88%"
          end="bottom 55%"
          stagger={0.08}
          itemSelector=".architecture-drawer-item"
          className="border-t border-[var(--divider)]"
        >
          {ARCHITECTURE_SERVICES.map((service: ArchitectureService) => {
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                className="architecture-drawer-item border-b border-[var(--divider)] transition-colors"
              >
                {/* Header Row (Clickable Accordion Trigger) */}
                <button
                  onClick={() => toggleAccordion(service.id)}
                  className="w-full py-8 md:py-10 text-left flex items-start justify-between gap-6 group cursor-pointer focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  <div className="grid grid-cols-12 gap-4 md:gap-6 w-full items-baseline">
                    {/* Number with character-level clarity */}
                    <div className="col-span-2 md:col-span-1">
                      <span className="font-mono text-sm md:text-base font-semibold text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
                        {service.number}
                      </span>
                    </div>

                    {/* Title with word-level scroll scrub */}
                    <div className="col-span-10 md:col-span-6 lg:col-span-5">
                      <ScrollStoryElement
                        as="h3"
                        granularity="words"
                        variant="chromatic-lift"
                        start="top 92%"
                        end="bottom 65%"
                        className="font-felix text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors uppercase"
                      >
                        {service.title}
                      </ScrollStoryElement>
                    </div>

                    {/* Short Description (Desktop) */}
                    <div className="hidden lg:block lg:col-span-5">
                      <ScrollStoryElement
                        as="p"
                        granularity="words"
                        start="top 92%"
                        end="bottom 65%"
                        className="font-exo text-sm md:text-base text-[var(--text-muted)] line-clamp-2"
                      >
                        {service.shortDesc}
                      </ScrollStoryElement>
                    </div>

                    {/* Latency Pill */}
                    <div className="hidden md:flex md:col-span-4 lg:col-span-1 justify-end">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--surface-elevated)] text-[11px] font-mono text-[var(--primary)] uppercase tracking-wider font-semibold border border-[var(--border-subtle)]">
                        {service.latencyBenchmark}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Arrow */}
                  <div className="pt-2 flex-shrink-0 text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 transition-transform" />
                    ) : (
                      <ChevronDown className="w-6 h-6 transition-transform" />
                    )}
                  </div>
                </button>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="pb-12 pt-2 grid grid-cols-12 gap-6 animate-fadeIn">
                    <div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-start-2 lg:col-span-10">
                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)] font-mono text-xs">
                        <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                          <Cpu className="w-3.5 h-3.5 text-[var(--secondary)]" />
                          Pipeline Layer:
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {service.linguisticLayer}
                        </span>
                        <span className="text-[var(--border)]">|</span>
                        <span className="text-[var(--text-muted)]">Verified Latency:</span>
                        <span className="font-semibold text-[var(--primary)]">
                          {service.latencyBenchmark}
                        </span>
                      </div>

                      {/* Descriptive narrative passages */}
                      <div className="space-y-4 mb-8">
                        {service.content.map((paragraph, idx) => (
                          <ScrollStoryElement
                            key={idx}
                            as="p"
                            granularity="words"
                            variant="progressive-clarity"
                            start="top 95%"
                            end="bottom 70%"
                            className="font-exo text-base md:text-lg leading-relaxed text-[var(--text-secondary)]"
                          >
                            {paragraph}
                          </ScrollStoryElement>
                        ))}
                      </div>

                      {/* Specific Capabilities Points Grid */}
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
                          Verified Functional Capabilities
                        </h4>
                        {/* Animated capability tags / points */}
                        <ScrollCardReveal
                          start="top 95%"
                          end="bottom 75%"
                          stagger={0.05}
                          itemSelector=".capability-point-item"
                          className="flex flex-wrap gap-2"
                        >
                          {service.capabilities.map((cap, idx) => (
                            <div key={idx} className="capability-point-item">
                              <AnimatedBadge variant="primary">
                                {cap}
                              </AnimatedBadge>
                            </div>
                          ))}
                        </ScrollCardReveal>
                      </div>

                      {/* Direct jump to simulator action */}
                      <div className="mt-8 flex items-center gap-4">
                        <a
                          href="#simulator"
                          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[var(--primary)] hover:underline"
                        >
                          <span>Test in Live Avatar Simulator</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollCardReveal>
      </div>
    </section>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKTHROUGH_PROJECTS, BreakthroughProject } from '../data/hastivoData';
import { ArrowUpRight, Cpu, Layers, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { TextReveal } from '../animation/TextReveal';
import { ScrollScrubText } from '../animation/ScrollScrubText';
import { AnimatedBadge } from '../animation/AnimatedBadge';
import { TiltCard } from '../animation/TiltCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectsSectionProps {
  onSelectProject: (project: BreakthroughProject) => void;
  onOpenAllProjects: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
}) => {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    const container = pinContainerRef.current;
    const rightCol = rightColumnRef.current;
    if (!container || !rightCol) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = rightCol.querySelectorAll<HTMLElement>('.pinned-journey-card');
    if (!cards || cards.length === 0) return;

    const totalSteps = BREAKTHROUGH_PROJECTS.length;

    const ctx = gsap.context(() => {
      // Pin timeline pinned for (totalSteps * 100)vh of scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalSteps * 100}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const prog = self.progress;
            setProgressVal(prog);
            const step = Math.min(
              totalSteps - 1,
              Math.floor(prog * totalSteps)
            );
            setActiveStep(step);
          },
        },
      });

      // Animate card progressive vertical reveals in locked right container
      cards.forEach((card, i) => {
        if (i === 0) {
          // First card starts in view
          gsap.set(card, { opacity: 1, y: 0, scale: 1 });
        } else {
          // Cards start below and enter sequentially
          gsap.set(card, { opacity: 0, y: 60, scale: 0.94, filter: 'blur(4px)' });

          tl.to(
            cards[i - 1],
            {
              opacity: 0.15,
              scale: 0.92,
              y: -40,
              filter: 'blur(3px)',
              duration: 1,
              ease: 'power2.inOut',
            },
            `step-${i}`
          );

          tl.to(
            card,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power2.out',
            },
            `step-${i}`
          );
        }
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const currentProject = BREAKTHROUGH_PROJECTS[activeStep] || BREAKTHROUGH_PROJECTS[0];

  return (
    <section
      ref={pinContainerRef}
      id="breakthroughs"
      className="relative w-full h-screen border-t border-[var(--divider)] bg-[var(--background)] transition-colors overflow-hidden flex flex-col justify-center"
      aria-label="04 Research Breakthroughs Journey"
    >
      <div className="max-w-[1720px] w-full mx-auto px-6 sm:px-10 lg:px-14 h-full flex flex-col justify-between py-8 lg:py-14">
        {/* Top Header Row with Category & Progress Bar */}
        <div className="grid grid-cols-12 gap-6 items-center border-b border-[var(--divider)] pb-4 sm:pb-6">
          <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              04 / Research
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
              Vertical Journey
            </span>
          </div>

          {/* Progress Timeline Indicator */}
          <div className="col-span-12 sm:col-span-9 flex items-center justify-between sm:justify-end gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
              <span>MILESTONE</span>
              <strong className="text-[var(--text-primary)] font-bold text-sm">
                0{activeStep + 1}
              </strong>
              <span>/ 06</span>
            </div>

            {/* Segmented Progress Track */}
            <div className="w-36 sm:w-56 h-1.5 bg-[var(--surface-elevated)] border border-[var(--border)] relative overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-[var(--secondary)] via-[var(--primary)] to-amber-400 transition-all duration-150"
                style={{ width: `${Math.round(progressVal * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Pinned Split Content: Left Fixed Narrative & Right Progressive Cards */}
        <div className="grid grid-cols-12 gap-8 lg:gap-14 items-center flex-1 my-auto py-4">
          {/* Left Fixed Column: Bold Sticky Editorial Narrative */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <TextReveal
              as="h2"
              type="chars"
              duration={0.9}
              stagger={0.03}
              scrollTrigger={false}
              className="font-felix text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-4 sm:mb-6 select-none"
            >
              BREAKTHROUGHS.
            </TextReveal>

            {/* Scroll-Driven Character-by-Character Progress Narrative */}
            <ScrollScrubText
              type="words"
              className="font-exo text-base sm:text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-6 max-w-xl"
            >
              Six foundational research milestones powering HASTIVO's real-time spatial linguistics and accessibility architecture. Scroll continuously to advance the journey through neural SOV parsing, 60 FPS landmarks, and biometric synthesis.
            </ScrollScrubText>

            {/* Dynamic Step Index Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {BREAKTHROUGH_PROJECTS.map((p, idx) => (
                <div
                  key={p.id}
                  className={`px-3 py-1 text-xs font-mono transition-all duration-300 border ${
                    activeStep === idx
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white font-bold shadow-md scale-105'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] opacity-60'
                  }`}
                >
                  {p.number} • {p.category.split('&')[0]}
                </div>
              ))}
            </div>

            {/* Scroll Direction Indicator Prompt */}
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
              <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full animate-bounce" />
              <span>Scroll down to advance milestones • Scroll up to reverse</span>
            </div>
          </div>

          {/* Right Column: Progressive Pinned Journey Card Stage */}
          <div
            ref={rightColumnRef}
            className="col-span-12 lg:col-span-7 relative h-[420px] sm:h-[490px] md:h-[540px] flex items-center justify-center overflow-hidden"
          >
            {BREAKTHROUGH_PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                className="pinned-journey-card absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-colors rounded-none"
                style={{
                  zIndex: idx === activeStep ? 10 : 5,
                  pointerEvents: idx === activeStep ? 'auto' : 'none',
                }}
              >
                {/* Card Top: Number, Category & Organization */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] font-mono text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[var(--primary)] text-white font-bold text-xs uppercase tracking-wider">
                        MILESTONE {project.number}
                      </span>
                      <span className="text-[var(--text-secondary)] font-semibold">
                        {project.organization}
                      </span>
                    </div>
                    <span className="text-[var(--secondary)] font-bold">
                      {project.metrics[0].label}: {project.metrics[0].value}
                    </span>
                  </div>

                  {/* Visual Media & Description Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center mb-4">
                    <div className="sm:col-span-5 relative aspect-16/10 overflow-hidden bg-black border border-[var(--border-subtle)] shadow-inner">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover filter contrast-125 hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 font-mono text-[10px] text-white border border-white/10 uppercase">
                        {project.year}
                      </div>
                    </div>

                    <div className="sm:col-span-7">
                      <h3 className="font-felix text-2xl sm:text-3xl text-[var(--text-primary)] uppercase leading-tight mb-2">
                        {project.title}
                      </h3>
                      <div className="font-mono text-xs text-[var(--secondary)] font-semibold mb-2">
                        {project.subtitle}
                      </div>
                      <p className="font-exo text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Middle: Clinical Impact Strip */}
                <div className="p-3 bg-[var(--surface-elevated)] border-l-2 border-[var(--primary)] font-mono text-xs text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)] block mb-0.5">
                    Clinical Impact Benchmark:
                  </strong>
                  <span>{project.impact}</span>
                </div>

                {/* Card Bottom: Metrics & Action Inspect Button */}
                <div className="pt-4 mt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                    <Cpu className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className="truncate max-w-[240px]">
                      {project.technicalSpecs?.modelArchitecture}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-primary)] hover:text-[var(--primary)] font-mono text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
                  >
                    <span>Inspect Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status Ribbon */}
        <div className="border-t border-[var(--divider)] pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bi-directional continuous scroll synchronization verified</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Scroll Speed: Lenis Inertial Damping</span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--primary)] font-semibold">Zero Horizontal Shift</span>
          </div>
        </div>
      </div>
    </section>
  );
};

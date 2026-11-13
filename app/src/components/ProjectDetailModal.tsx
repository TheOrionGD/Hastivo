import React from 'react';
import { BreakthroughProject, BREAKTHROUGH_PROJECTS } from '../data/hastivoData';
import { ArrowLeft, ArrowRight, X, Cpu, Database, Activity, CheckCircle2 } from 'lucide-react';

interface ProjectDetailModalProps {
  project: BreakthroughProject | null;
  onClose: () => void;
  onSelectProject: (project: BreakthroughProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
}) => {
  if (!project) return null;

  const currentIndex = BREAKTHROUGH_PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0
      ? BREAKTHROUGH_PROJECTS[currentIndex - 1]
      : BREAKTHROUGH_PROJECTS[BREAKTHROUGH_PROJECTS.length - 1];
  const nextProject =
    currentIndex < BREAKTHROUGH_PROJECTS.length - 1
      ? BREAKTHROUGH_PROJECTS[currentIndex + 1]
      : BREAKTHROUGH_PROJECTS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a1d24] border border-neutral-300 dark:border-neutral-700 shadow-2xl p-6 sm:p-10 md:p-14 my-8 animate-in fade-in zoom-in-95 duration-200 text-[#212121] dark:text-[#f3f4f6]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="font-felix text-2xl text-[#FF6F61]">{project.number}</span>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold font-mono">
              {project.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Specification"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-2 font-mono">
            {project.organization} &bull; {project.year}
          </span>
          <h2 className="font-felix text-3xl sm:text-5xl md:text-6xl text-[#212121] dark:text-white uppercase tracking-tight mb-3">
            {project.title}
          </h2>
          <p className="font-mono text-sm text-[#FF6F61] font-semibold">
            {project.subtitle}
          </p>
        </div>

        {/* Image Display */}
        <div className="relative overflow-hidden mb-10 bg-neutral-900 border border-neutral-200 dark:border-neutral-800 aspect-16/9">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {project.metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-4 bg-neutral-50 dark:bg-[#20232B] border border-neutral-200 dark:border-neutral-800 text-center font-mono"
            >
              <div className="text-xs text-neutral-400 uppercase">{m.label}</div>
              <div className="text-2xl font-bold text-[#FF6F61] mt-1">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Summary Description */}
        <div className="mb-10">
          <h3 className="font-felix text-xl uppercase tracking-wider mb-4 text-[#212121] dark:text-white">
            Architecture Summary
          </h3>
          <p className="font-exo text-base sm:text-lg leading-relaxed text-[#464646] dark:text-[#c4c7cc]">
            {project.summary}
          </p>
        </div>

        {/* Technical Specification Grid */}
        {project.technicalSpecs && (
          <div className="mb-10 p-6 bg-neutral-50 dark:bg-[#121418] border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#6FA3EF]" />
              Engineering Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-neutral-400 block uppercase text-[10px]">Model Architecture</span>
                <span className="font-semibold text-[#212121] dark:text-white">
                  {project.technicalSpecs.modelArchitecture}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase text-[10px]">Dataset Provenance</span>
                <span className="font-semibold text-[#212121] dark:text-white">
                  {project.technicalSpecs.datasetProvenance}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase text-[10px]">Inference Latency</span>
                <span className="font-semibold text-[#FF6F61]">
                  {project.technicalSpecs.inferenceLatency}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase text-[10px]">Joint Precision</span>
                <span className="font-semibold text-emerald-500">
                  {project.technicalSpecs.jointPrecision}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Deliverables */}
        <div className="mb-10">
          <h4 className="font-felix text-lg uppercase tracking-wider mb-4 text-[#212121] dark:text-white">
            Key Breakthrough Deliverables
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-50 dark:bg-[#20232B] border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5 text-xs font-mono"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FF6F61] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User / Community Quote */}
        {project.quote && (
          <blockquote className="p-6 border-l-4 border-[#FF6F61] bg-neutral-50 dark:bg-[#20232B] italic font-exo text-base text-neutral-600 dark:text-neutral-300 mb-10">
            "{project.quote}"
          </blockquote>
        )}

        {/* Bottom Pagination Controls */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#FF6F61] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev: {prevProject.number}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 border border-neutral-300 dark:border-neutral-700 text-xs font-mono uppercase tracking-widest hover:bg-[#FF6F61] hover:text-white hover:border-[#FF6F61] transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#FF6F61] transition-colors cursor-pointer"
          >
            <span>Next: {nextProject.number}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

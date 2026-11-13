import React, { useState } from 'react';
import { BreakthroughProject, BREAKTHROUGH_PROJECTS } from '../data/hastivoData';
import { X, ArrowUpRight, Cpu } from 'lucide-react';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: BreakthroughProject) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [filter, setFilter] = useState<string>('All');

  if (!isOpen) return null;

  const categories = [
    'All',
    'Linguistic Topology',
    'Computer Vision',
    'Full-Duplex Telephony',
    'Speech Synthesis',
    'Regional Dialects'
  ];

  const filteredProjects = BREAKTHROUGH_PROJECTS.filter((p) => {
    if (filter === 'All') return true;
    return p.category.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#1a1d24] border border-neutral-300 dark:border-neutral-700 shadow-2xl p-6 sm:p-10 md:p-12 my-8 animate-in fade-in zoom-in-95 duration-200 text-[#212121] dark:text-[#f3f4f6]">
        {/* Top Bar with Close */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-1 font-mono">
              Research Portfolio
            </span>
            <h2 className="font-felix text-3xl sm:text-5xl text-[#212121] dark:text-white uppercase">
              ALL BREAKTHROUGHS
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Projects Gallery"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#FF6F61] text-white font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                onSelectProject(project);
                onClose();
              }}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#20232B] hover:border-[#FF6F61] transition-all p-5 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden mb-4 bg-neutral-900 aspect-16/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] uppercase">
                    {project.number}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                  <span className="text-[#FF6F61] font-bold">{project.category}</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="font-felix text-lg text-[#212121] dark:text-white uppercase mb-2 group-hover:text-[#FF6F61] transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="font-exo text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
                  {project.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono font-semibold text-[#FF6F61]">
                <span>View Full Spec</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowUpRight, Eye } from 'lucide-react';

const FILTERS = ['All', 'Web', 'Brand', 'App', 'Video', '3D'];

/* Example project data — replace with your real data if needed */
const PROJECTS = [
  { id:1, title:'Brand Identity Suite',      category:'Brand', tags:['Logo','Print'],   color:'#6366f1', size:'large'  },
  { id:2, title:'E-Commerce Platform',       category:'Web',   tags:['React','Node'],   color:'#06b6d4', size:'medium' },
  { id:3, title:'Mobile Banking App',        category:'App',   tags:['Flutter','UX'],   color:'#a855f7', size:'medium' },
  { id:4, title:'Architecture 3D Render',    category:'3D',    tags:['SketchUp'],        color:'#10b981', size:'large'  },
  { id:5, title:'Product Promo Video',       category:'Video', tags:['Premiere'],        color:'#ec4899', size:'medium' },
  { id:6, title:'Restaurant Brand + Web',    category:'Brand', tags:['Brand','Web'],     color:'#f59e0b', size:'medium' },
];

const ProjectCard: React.FC<{ project: typeof PROJECTS[0] }> = ({ project }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer
                  ${project.size === 'large' ? 'row-span-2' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ aspectRatio: project.size === 'large' ? '1/1.5' : '4/3',
               background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
               border: `1px solid ${project.color}20` }}
    >
      {/* Placeholder visual */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full opacity-10 animate-pulse-slow"
             style={{ background: project.color, filter: 'blur(20px)' }} />
        <span className="text-white/10 text-6xl font-black absolute">{project.id}</span>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end p-5
                       transition-all duration-500
                       ${hovered ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: `linear-gradient(to top, ${project.color}30, transparent)` }}>
        <div className="transform transition-transform duration-500"
             style={{ transform: hovered ? 'translateY(0)' : 'translateY(16px)' }}>
          <h3 className="font-black text-white text-sm">{project.title}</h3>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {project.tags.map(tag => (
              <span key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white/70"
                    style={{ background: `${project.color}25`, border: `1px solid ${project.color}40` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top-right icon */}
      <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                       bg-black/50 backdrop-blur-sm border border-white/10
                       transition-all duration-300
                       ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <Eye size={14} className="text-white" />
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === active);

  return (
    <section id="portfolio" className="section-pad relative overflow-hidden bg-black">
      <div className="grid-bg opacity-30" />
      <div className="glow-spot glow-spot-cyan w-[400px] h-[400px] top-0 right-0 opacity-10" />

      <div className="container-xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="label-tag w-fit">{t('Our Work', 'ស្នាដៃ')}</div>
            <h2 className="heading-display text-white">
              {t('Selected', '')} <span className="text-gradient">{t('Projects', 'ស្នាដៃ')}</span>
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActive(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                  transition-all duration-300 border
                                  ${active === f
                                    ? 'bg-brand-500 border-brand-500 text-white shadow-glow-sm'
                                    : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'
                                  }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#contact" className="btn-ghost inline-flex items-center gap-2 group">
            <span>{t('View All Projects', 'មើលស្នាដៃទាំងអស់')}</span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

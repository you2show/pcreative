import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Globe, Smartphone, Palette, Video, Languages,
  Wind, Building2, PenTool, Megaphone,
  ArrowUpRight,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,       color: '#6366f1', bg: 'rgba(99,102,241,0.08)',
    en: 'Web Development',   km: 'អភិវឌ្ឍន៍វេបសាយ',
    desc: 'Lightning-fast websites & PWAs built with cutting-edge tech.',
    tags: ['React', 'Next.js', 'TypeScript'],
    featured: true,
  },
  {
    icon: Smartphone,  color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',
    en: 'App Development',   km: 'ការអភិវឌ្ឍ App',
    desc: 'Cross-platform mobile apps that users love.',
    tags: ['Flutter', 'React Native'],
    featured: true,
  },
  {
    icon: Palette,     color: '#a855f7', bg: 'rgba(168,85,247,0.08)',
    en: 'Graphic Design',    km: 'ក្រាហ្វិកឌីហ្សាញ',
    desc: 'Logos, brand systems & print-ready artwork.',
    tags: ['Figma', 'Illustrator'],
    featured: true,
  },
  {
    icon: Video,       color: '#ec4899', bg: 'rgba(236,72,153,0.08)',
    en: 'Video Editing',     km: 'កែសម្រួលវីដេអូ',
    desc: 'Cinematic edits, reels & motion graphics.',
    tags: ['After Effects', 'Premiere'],
  },
  {
    icon: Megaphone,   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
    en: 'Digital Marketing', km: 'ទីផ្សារឌីជីថល',
    desc: 'Paid ads, SEO & social campaigns that convert.',
    tags: ['Meta Ads', 'Google', 'TikTok'],
  },
  {
    icon: Building2,   color: '#10b981', bg: 'rgba(16,185,129,0.08)',
    en: 'Architecture',      km: 'ស្ថាបត្យកម្ម',
    desc: 'CAD blueprints, 3D renders & interior design.',
    tags: ['AutoCAD', 'SketchUp', '3ds Max'],
  },
  {
    icon: PenTool,     color: '#f97316', bg: 'rgba(249,115,22,0.08)',
    en: 'Calligraphy',       km: '習字',
    desc: 'Arabic & decorative lettering for premium brands.',
    tags: ['Arabic', 'Khmer', 'Latin'],
  },
  {
    icon: Languages,   color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',
    en: 'Translation',       km: 'ការបកប្រែ',
    desc: 'Accurate translation: Khmer, English & Arabic.',
    tags: ['KM', 'EN', 'AR'],
  },
  {
    icon: Wind,        color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',
    en: 'HVAC & MEP',        km: 'HVAC & MEP',
    desc: 'Engineering drawings & ventilation system design.',
    tags: ['MEP', 'AutoCAD'],
  },
];

/* ─── Tilt Card ─────────────────────────────────────── */
const ServiceCard: React.FC<{ svc: typeof SERVICES[0]; index: number }> = ({ svc, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();
  const Icon = svc.icon;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    const y = ((e.clientX - rect.left) / rect.width  - 0.5) * -10;
    setTilt({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x:0, y:0 }); }}
      className={`group card-dark glass-border relative p-6 cursor-pointer
                  ${svc.featured ? 'ring-1 ring-brand-500/20' : ''}`}
      style={{
        transform: hovered
          ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px)`
          : 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)',
        transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: `${index * 40}ms`,
      }}
    >
      {/* Animated bg glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ background: `radial-gradient(circle at 50% 0%, ${svc.bg}, transparent 70%)` }} />

      {/* Icon */}
      <div className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5
                      transition-transform duration-300 group-hover:scale-110"
           style={{ background: svc.bg, boxShadow: `0 0 20px ${svc.color}30` }}>
        <Icon size={20} style={{ color: svc.color }} />
      </div>

      {/* Text */}
      <div className="relative z-10 space-y-2">
        <h3 className="font-black text-base text-white tracking-tight font-khmer">
          {t(svc.en, svc.km)}
        </h3>
        <p className="text-sm text-white/45 leading-relaxed">{svc.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {svc.tags.map(tag => (
            <span key={tag} className="chip text-[10px]">{tag}</span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                      transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <ArrowUpRight size={16} style={{ color: svc.color }} />
      </div>
    </div>
  );
};

/* ─── Section ─────────────────────────────────────── */
const Services: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="section-pad relative overflow-hidden bg-black">
      {/* Background */}
      <div className="dot-grid opacity-40" />
      <div className="glow-spot glow-spot-brand w-[500px] h-[500px] -top-32 -left-32 opacity-15" />
      <div className="glow-spot glow-spot-pink  w-[400px] h-[400px] -bottom-32 -right-32 opacity-10" />

      <div className="container-xl relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="label-tag mx-auto w-fit">
            {t('What We Do', 'សេវាកម្មរបស់យើង')}
          </div>
          <h2 className="heading-display text-white">
            {t('Services', 'សេវាកម្ម')}{' '}
            <span className="text-gradient">&</span>{' '}
            {t('Expertise', 'ជំនាញ')}
          </h2>
          <p className="text-white/45 text-lg max-w-lg mx-auto font-khmer">
            {t(
              'Full-spectrum creative & technical studio — everything under one roof.',
              'ស្ទូឌីយ៉ូច្នៃប្រឌិត & បច្ចេកទេស — ការប្រមូលផ្ដុំគ្រប់ការងារ'
            )}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.en} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

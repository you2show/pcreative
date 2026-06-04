
import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import ScrambleText from '../ScrambleText';
import { Palette, Globe, Building2, PenTool, Camera, Wind, Languages, Layout, Video } from 'lucide-react';

import HeroActions from './HeroActions';
import Hero3DScene from '../Hero3DScene';
import HeroLaunchPanel from './HeroLaunchPanel';

// Rotating words that cycle in the hero headline
const ROTATING_WORDS_EN = ['Websites', 'Brands', 'Apps', 'Campaigns', 'Experiences'];
const ROTATING_WORDS_KM = ['វេបសាយ', 'ម៉ាក', 'Apps', 'យុទ្ធនាការ', 'បទពិសោធន៍'];

const RotatingWord: React.FC<{ t: (en: string, km?: string) => string }> = ({ t }) => {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setIndex(current => {
        setPreviousIndex(current);
        return (current + 1) % ROTATING_WORDS_EN.length;
      });
    }, 2600);

    return () => window.clearInterval(cycle);
  }, []);

  const currentWord = t(ROTATING_WORDS_EN[index], ROTATING_WORDS_KM[index]);
  const previousWord = previousIndex === null ? null : t(ROTATING_WORDS_EN[previousIndex], ROTATING_WORDS_KM[previousIndex]);

  return (
    <span className="hero-word-stack" aria-live="polite" aria-label={currentWord}>
      {previousWord && (
        <span key={`prev-${previousIndex}-${index}`} className="hero-word-prev" aria-hidden="true">
          {previousWord}
        </span>
      )}
      <span key={`current-${index}`} className="hero-word-current">
        {currentWord}
      </span>
    </span>
  );
};


// Brand Reel Ticker: interactive pill-shaped service cards with icons and tooltips
const BRAND_REEL_SERVICES = [
  { icon: Palette, label: 'Graphic Design', labelKm: 'ក្រាហ្វិក', desc: 'Logos, posters & brand systems', descKm: 'ឡូហ្គោ Poster និង Brand', color: 'text-purple-400' },
  { icon: Globe, label: 'Web Development', labelKm: 'វេបសាយ', desc: 'Fast, modern websites & apps', descKm: 'វេបសាយ ទំនើប & App', color: 'text-indigo-400' },
  { icon: Building2, label: 'Architecture', labelKm: 'ស្ថាបត្យ', desc: 'Blueprints, 3D & interiors', descKm: 'ប្លង់ 3D & Interior', color: 'text-cyan-400' },
  { icon: PenTool, label: 'Calligraphy', labelKm: 'អក្សរផ្ចង់', desc: 'Arabic & decorative lettering', descKm: 'អក្សរអារ៉ាប់ & សិល្បៈ', color: 'text-pink-400' },
  { icon: Camera, label: 'Photo & Video', labelKm: 'រូបភាព & វីដេអូ', desc: 'Events, products & reels', descKm: 'ថតរូប វីដេអូ & Reel', color: 'text-blue-400' },
  { icon: Languages, label: 'Translation', labelKm: 'បកប្រែ', desc: 'Khmer, English & Arabic', descKm: 'ខ្មែរ អង់គ្លេស & អារ៉ាប់', color: 'text-orange-400' },
  { icon: Wind, label: 'HVAC Systems', labelKm: 'HVAC', desc: 'MEP engineering & ventilation', descKm: 'MEP & ប្រព័ន្ធខ្យល់', color: 'text-teal-400' },
  { icon: Layout, label: 'UI / UX', labelKm: 'ការរចនា UI/UX', desc: 'Product design & prototypes', descKm: 'ការរចនា & Prototype', color: 'text-fuchsia-400' },
  { icon: Video, label: 'Digital Marketing', labelKm: 'ទីផ្សារឌីជីថល', desc: 'Social, SEO & paid campaigns', descKm: 'Social SEO & Ads', color: 'text-yellow-400' },
];

const HeroTicker: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const duplicated = [...BRAND_REEL_SERVICES, ...BRAND_REEL_SERVICES];

  return (
    <div className="relative w-full overflow-hidden border-y border-gray-100 dark:border-white/5 py-3 bg-gray-50/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.04)]">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
      <div
        className="flex w-max gap-3 animate-hero-ticker px-3"
        style={{ animationPlayState: hoveredIndex !== null ? 'paused' : 'running' }}
      >
        {duplicated.map((svc, i) => {
          const Icon = svc.icon;
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className="relative shrink-0 group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 cursor-default select-none
                  ${isHovered
                    ? 'border-indigo-300/50 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-md shadow-indigo-500/20'
                    : 'border-gray-200 dark:border-white/8 bg-white/70 dark:bg-white/[0.04]'
                  }`}
              >
                <Icon size={13} className={`transition-colors ${isHovered ? svc.color : 'text-gray-400 dark:text-gray-500'}`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.16em] transition-colors font-khmer ${isHovered ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                  {svc.label}
                </span>
              </div>
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none">
                  <div className="whitespace-nowrap rounded-xl border border-indigo-300/30 bg-gray-950/95 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-xl">
                    <p className="text-[11px] font-bold text-white/90 font-khmer">{svc.desc}</p>
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t border-indigo-300/30 bg-gray-950/95" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { t } = useLanguage();

  // Parallax Refs for Background
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
    <section ref={containerRef} id="home" aria-label="Hero section" className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden perspective-1000">

      {/* 3D Background Scene */}
      <Hero3DScene />

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div
            className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-60"
        />
        <div
            className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] opacity-60"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Content - Typography & CTA */}
          <div className="space-y-6 text-center lg:text-left relative z-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md animate-fade-in group hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-default shadow-sm dark:shadow-indigo-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase font-khmer">
                  {t('Open for new projects', 'ទទួលគម្រោងថ្មីៗ')}
              </span>
            </div>

            {/* Main Headline */}
            <div className="relative space-y-3">
                <div className="absolute -left-6 top-4 hidden h-28 w-28 rounded-full bg-indigo-500/15 blur-3xl dark:block" aria-hidden="true" />
                <h1 className="hero-headline relative text-5xl sm:text-6xl md:text-7xl font-black leading-[1.02] tracking-[-0.045em] text-gray-950 dark:text-white font-khmer">
                    <span className="hero-line-reveal block">
                      {t('We Craft', 'យើងបង្កើត')}
                    </span>
                    <span className="hero-gradient-text relative inline-block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
                        <RotatingWord t={t} />
                    </span>
                    <span className="hero-subline block text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-500 dark:text-gray-300 tracking-[-0.01em]">
                        <ScrambleText
                          text={t('Seen & trusted — in days, not months.', 'ឃើញ & ទុកចិត្ត — ក្នុងថ្ងៃ មិនមែនខែ')}
                          delay={450}
                          duration={900}
                        />
                    </span>
                </h1>
            </div>

            <p className="hero-copy text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-md mx-auto lg:mx-0">
              {t(
                  'Bold digital visuals that make people stop, trust, and contact you.',
                  'រូបភាពឌីជីថលខ្លាំងៗ ឲ្យមនុស្សឈប់មើល ទុកចិត្ត និងទាក់ទងអ្នក។'
              )}
            </p>


            {/* Actions Component (Buttons & Stats) */}
            <HeroActions t={t} />
          </div>

          {/* Right Content - Interactive launch system. Team constellation moved to the dedicated Team page. */}
          <HeroLaunchPanel />
        </div>
      </div>


    </section>

      {/* Keyword ticker below hero */}
      <HeroTicker />
    </>
  );
};

export default Hero;

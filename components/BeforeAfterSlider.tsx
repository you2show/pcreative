import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, CheckCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const COMPARISONS = [
  {
    category: 'Brand',
    categoryKm: 'Brand',
    before: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    label: 'Brand Identity',
    labelKm: 'អត្តសញ្ញាណម៉ាក',
    beforeTag: 'Generic · No personality',
    beforeTagKm: 'ទូទៅ · គ្មានចរិតម៉ាក',
    afterTag: 'Ponloe Creative result',
    afterTagKm: 'លទ្ធផលពី Ponloe Creative',
    metrics: [
      { label: 'Revenue +40%', labelKm: 'Revenue +40%', desc: 'after rebrand', descKm: 'បន្ទាប់ rebrand' },
      { label: '3× recognition', labelKm: 'ស្គាល់ 3×', desc: 'brand recall', descKm: 'ចាំ brand' },
    ],
  },
  {
    category: 'Web',
    categoryKm: 'Web',
    before: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&q=80&w=1200',
    label: 'Website Redesign',
    labelKm: 'ការរចនា Website ឡើងវិញ',
    beforeTag: 'Outdated · Low conversion',
    beforeTagKm: 'ចាស់ · Conversion ទាប',
    afterTag: 'Ponloe Creative result',
    afterTagKm: 'លទ្ធផលពី Ponloe Creative',
    metrics: [
      { label: '3× more inquiries', labelKm: 'Inquiry +3×', desc: 'after new website', descKm: 'បន្ទាប់ website ថ្មី' },
      { label: '+65% session time', labelKm: 'ពេលនៅ +65%', desc: 'user engagement', descKm: 'អ្នកប្រើប្រាស់ engaged' },
    ],
  },
  {
    category: 'Print',
    categoryKm: 'Print',
    before: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200',
    label: 'Print & Media',
    labelKm: 'ការបោះពុម្ព & Media',
    beforeTag: 'Bland · Low impact',
    beforeTagKm: 'ខ្ចោល · impact ទាប',
    afterTag: 'Ponloe Creative result',
    afterTagKm: 'លទ្ធផលពី Ponloe Creative',
    metrics: [
      { label: '+50% share rate', labelKm: 'Share +50%', desc: 'social engagement', descKm: 'engagement សង្គម' },
      { label: 'Premium perception', labelKm: 'ទទួលស្គាល់ premium', desc: 'brand elevation', descKm: 'ការលើកកំពស់ brand' },
    ],
  },
  {
    category: 'Interior',
    categoryKm: 'Interior',
    before: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200',
    label: 'Interior Design',
    labelKm: 'ការរចនា Interior',
    beforeTag: 'Empty · No atmosphere',
    beforeTagKm: 'ទទេ · គ្មានបរិយាកាស',
    afterTag: 'Ponloe Creative result',
    afterTagKm: 'លទ្ធផលពី Ponloe Creative',
    metrics: [
      { label: 'Sold before build', labelKm: 'លក់មុនសាង', desc: '3D renders closed deals', descKm: '3D Render ជួយលក់' },
      { label: '+30% property value', labelKm: 'តម្លៃ +30%', desc: 'after interior', descKm: 'បន្ទាប់ interior' },
    ],
  },
];

interface SliderProps {
  before: string;
  after: string;
  beforeTag: string;
  afterTag: string;
  t: (en: string, km?: string) => string;
}

const ComparisonSlider: React.FC<SliderProps> = ({ before, after, beforeTag, afterTag, t }) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { if (isDragging) updatePosition(e.clientX); };
    const onTouchMove = (e: TouchEvent) => { if (isDragging) updatePosition(e.touches[0].clientX); };
    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[340px] md:h-[420px] overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/20 select-none cursor-col-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-label="Before and after comparison slider"
    >
      <img
        src={after}
        alt={t('After — Ponloe Creative result', 'បន្ទាប់ — លទ្ធផល Ponloe')}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        draggable="false"
      />
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-lg">
          <CheckCircle size={11} /> {t('After', 'បន្ទាប់')}
        </span>
        <p className="mt-1 text-right text-[10px] font-bold text-indigo-200/80 font-khmer">{t(afterTag)}</p>
      </div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={before}
          alt={t('Before — generic design', 'មុន — ការរចនាទូទៅ')}
          className="w-full h-full object-cover grayscale"
          loading="lazy"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gray-950/25" />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white/80 backdrop-blur-md shadow-lg">
          {t('Before', 'មុន')}
        </span>
        <p className="mt-1 text-[10px] font-bold text-white/60 font-khmer">{t(beforeTag)}</p>
      </div>
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_16px_rgba(255,255,255,0.8)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />
      <div
        className={`absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-2xl border-2 border-indigo-200 transition-transform duration-100 ${isDragging ? 'scale-110' : 'scale-100'}`}
        style={{ left: `${position}%` }}
      >
        <ArrowLeftRight size={18} className="text-indigo-600" />
      </div>
    </div>
  );
};

const BeforeAfterSlider: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = COMPARISONS[activeIndex];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="before-after-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.12),transparent_46%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.08),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-white/80 dark:bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300 shadow-md shadow-indigo-500/10 backdrop-blur-xl mb-6 font-khmer">
              <ArrowLeftRight size={14} />
              {t('Transformation Gallery', 'វិចិត្រសាល ការផ្លាស់ប្ដូរ')}
            </div>
            <h2 id="before-after-title" className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white font-khmer">
              {t('See the difference.', 'ឃើញភាពខុសគ្នា។')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                {t('Drag to reveal.', 'អូសសើ ដើម្បីបំភ្លឺ។')}
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Category filter tabs */}
        <RevealOnScroll delay={80}>
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {COMPARISONS.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`px-5 py-2 rounded-full text-sm font-black transition-all font-khmer ${
                  activeIndex === i
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
                }`}
              >
                {t(c.category, c.categoryKm)}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={160} variant="zoom-in">
          <ComparisonSlider
            key={activeIndex}
            before={active.before}
            after={active.after}
            beforeTag={active.beforeTag}
            afterTag={active.afterTag}
            t={t}
          />
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-600 font-khmer">
            ← {t('Drag the handle to compare', 'អូសសើ ដើម្បីប្រៀបធៀប')} →
          </p>
        </RevealOnScroll>

        {/* Metrics below slider */}
        <RevealOnScroll delay={260}>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {active.metrics.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/15 bg-white/80 dark:bg-indigo-500/5 px-5 py-4 backdrop-blur-sm"
              >
                <TrendingUp size={20} className="shrink-0 text-indigo-500" />
                <div>
                  <p className="font-black text-gray-950 dark:text-white text-sm font-khmer">{t(m.label, m.labelKm)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-khmer">{t(m.desc, m.descKm)}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;

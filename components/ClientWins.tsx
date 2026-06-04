import React, { useEffect, useRef, useState } from 'react';
import { Star, TrendingUp, Quote, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';
import { getSupabaseClient } from '../lib/supabase';
import { TESTIMONIALS } from '../constants';
import { Testimonial } from '../types';

type CardType = 'quote' | 'win' | 'rating';
type Category = 'All' | 'Branding' | 'Web' | 'Media' | 'Architecture';

interface UnifiedCard {
  id: string;
  type: CardType;
  category: Category;
  name: string;
  nameKm?: string;
  role: string;
  roleKm: string;
  msg: string;
  msgKm: string;
  avatar: string;
  rating: number;
  metric?: string;
  metricKm?: string;
  metricDesc?: string;
  metricDescKm?: string;
}

const STATIC_CARDS: UnifiedCard[] = [
  {
    id: 'c1', type: 'win', category: 'Branding',
    name: 'Ahmad Al-Rashid', role: 'CEO, TechStart KH', roleKm: 'CEO, TechStart KH',
    msg: 'Our new brand stopped people mid-scroll. Sales up 40% in 2 months.',
    msgKm: 'Brand ថ្មីទាក់ទាញ — ការលក់ឡើង 40% ក្នុង 2 ខែ។',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+R&background=6366f1&color=fff&size=80',
    rating: 5,
    metric: 'Revenue +40%', metricKm: 'Revenue +40%',
    metricDesc: 'after rebrand', metricDescKm: 'បន្ទាប់ rebrand',
  },
  {
    id: 'c2', type: 'quote', category: 'Web',
    name: 'Sophea Keo', role: 'Founder, Bloom Studio', roleKm: 'ស្ថាបនិក, Bloom Studio',
    msg: 'The website they built converts 3× better than our old one. Incredible.',
    msgKm: 'វេបសាយដែលគេបង្កើតឲ្យ convert ល្អជាងមុន 3 ដង។ ប្រោស!',
    avatar: 'https://ui-avatars.com/api/?name=Sophea+K&background=a855f7&color=fff&size=80',
    rating: 5,
  },
  {
    id: 'c3', type: 'rating', category: 'Web',
    name: 'David Chen', role: 'Marketing Dir., NovaCo', roleKm: 'ប្រធានទីផ្សារ, NovaCo',
    msg: 'Fastest agency I\'ve worked with. Delivered ahead of schedule, every time.',
    msgKm: 'Agency លឿនបំផុតដែលខ្ញុំធ្លាប់ធ្វើការ។ ផ្ញើមុនកាលកំណត់គ្រប់ដង។',
    avatar: 'https://ui-avatars.com/api/?name=David+C&background=06b6d4&color=fff&size=80',
    rating: 5,
  },
  {
    id: 'c4', type: 'win', category: 'Branding',
    name: 'Fatima Hassan', role: 'Owner, Al-Noor Restaurant', roleKm: 'ម្ចាស់, Al-Noor Restaurant',
    msg: 'Our logo and interior design together — perfection. Clients notice immediately.',
    msgKm: 'ឡូហ្គោ និង Interior Design ជាមួយគ្នា — ល្អឥតខ្ចោះ។ Client ស្គាល់ភ្លាម។',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+H&background=ec4899&color=fff&size=80',
    rating: 5,
    metric: 'Clients +60%', metricKm: 'ចូលម្ហូប +60%',
    metricDesc: 'new walk-ins', metricDescKm: 'អ្នកថ្មីចូល',
  },
  {
    id: 'c5', type: 'quote', category: 'Architecture',
    name: 'Ratha Nim', role: 'Director, KH Properties', roleKm: 'នាយក, KH Properties',
    msg: 'Architecture drawings were flawless. The 3D renders sold units before build.',
    msgKm: 'ប្លង់ស្ថាបត្យ​ ល្អឥតខ្ចោះ។ 3D Render លក់បន្ទប់បានមុនសាង។',
    avatar: 'https://ui-avatars.com/api/?name=Ratha+N&background=f59e0b&color=fff&size=80',
    rating: 5,
  },
  {
    id: 'c6', type: 'rating', category: 'Media',
    name: 'Maly Ros', role: 'Brand Manager, FreshCo', roleKm: 'ប្រធាន Brand, FreshCo',
    msg: 'The video reels they shot went viral on TikTok. 2M views in 3 days.',
    msgKm: 'Reel វីដេអូដែលថតក្លាយជា viral លើ TikTok — 2M views ក្នុង 3 ថ្ងៃ។',
    avatar: 'https://ui-avatars.com/api/?name=Maly+R&background=10b981&color=fff&size=80',
    rating: 5,
  },
  {
    id: 'c7', type: 'win', category: 'Media',
    name: 'Omar Khalil', role: 'CEO, KhalilGroup', roleKm: 'CEO, KhalilGroup',
    msg: 'Arabic branding, Khmer website, English pitch deck — all from one studio. Remarkable.',
    msgKm: 'Brand អារ៉ាប់ website ខ្មែរ pitch deck អង់គ្លេស — ពីស្ទូឌីអូតែមួយ។ អស្ចារ្យ!',
    avatar: 'https://ui-avatars.com/api/?name=Omar+K&background=f97316&color=fff&size=80',
    rating: 5,
    metric: 'Pitch success', metricKm: 'Pitch ទទួលជោគជ័យ',
    metricDesc: 'investor secured', metricDescKm: 'Investor ទទួលយក',
  },
];

const CATEGORIES: Category[] = ['All', 'Branding', 'Web', 'Media', 'Architecture'];

const QuoteCard: React.FC<{ card: UnifiedCard; t: (en: string, km?: string) => string }> = ({ card, t }) => (
  <div className="group relative flex flex-col gap-3 rounded-3xl border border-gray-100 dark:border-white/8 bg-white/90 dark:bg-gray-900/90 p-5 shadow-xl shadow-black/5 dark:shadow-black/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200/50 dark:hover:border-indigo-400/20">
    <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <Quote size={18} className="text-indigo-300/60" />
    <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300 font-khmer italic">
      "{t(card.msg, card.msgKm)}"
    </p>
    <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-white/5">
      <img src={card.avatar} alt={card.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20" loading="lazy" />
      <div>
        <p className="text-xs font-black text-gray-900 dark:text-white">{card.name}</p>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-khmer">{t(card.role, card.roleKm)}</p>
      </div>
    </div>
  </div>
);

const WinCard: React.FC<{ card: UnifiedCard; t: (en: string, km?: string) => string }> = ({ card, t }) => (
  <div className="group relative flex flex-col gap-3 rounded-3xl border border-yellow-100 dark:border-yellow-500/15 bg-gradient-to-br from-yellow-50/80 to-orange-50/40 dark:from-yellow-500/5 dark:to-orange-500/5 p-5 shadow-xl shadow-yellow-500/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1">
    {card.metric && (
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-yellow-200/50 dark:border-yellow-500/10">
        <TrendingUp size={16} className="text-yellow-500 shrink-0" />
        <div>
          <p className="text-sm font-black text-gray-900 dark:text-white font-khmer">{t(card.metric, card.metricKm)}</p>
          <p className="text-[10px] text-gray-500 font-khmer">{t(card.metricDesc || '', card.metricDescKm)}</p>
        </div>
      </div>
    )}
    <div className="flex gap-0.5">
      {Array.from({ length: card.rating }).map((_, i) => (
        <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300 font-khmer">
      "{t(card.msg, card.msgKm)}"
    </p>
    <div className="flex items-center gap-3 pt-1 border-t border-yellow-100 dark:border-white/5">
      <img src={card.avatar} alt={card.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-yellow-500/20" loading="lazy" />
      <div>
        <p className="text-xs font-black text-gray-900 dark:text-white">{card.name}</p>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-khmer">{t(card.role, card.roleKm)}</p>
      </div>
    </div>
  </div>
);

const RatingCard: React.FC<{ card: UnifiedCard; t: (en: string, km?: string) => string }> = ({ card, t }) => (
  <div className="group relative flex flex-col gap-3 rounded-3xl border border-gray-100 dark:border-white/8 bg-white/90 dark:bg-gray-900/80 p-5 shadow-xl shadow-black/5 dark:shadow-black/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
    <div className="flex gap-0.5 mb-1">
      {Array.from({ length: card.rating }).map((_, i) => (
        <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300 font-khmer">
      "{t(card.msg, card.msgKm)}"
    </p>
    <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-white/5">
      <img src={card.avatar} alt={card.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/20" loading="lazy" />
      <div>
        <p className="text-xs font-black text-gray-900 dark:text-white">{card.name}</p>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-khmer">{t(card.role, card.roleKm)}</p>
      </div>
    </div>
  </div>
);

const ClientWins: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [dbCards, setDbCards] = useState<UnifiedCard[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Load dynamic reviews from Supabase
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0 && mounted) {
        const cards: UnifiedCard[] = data.map((r: any, i: number) => ({
          id: `db-${r.id || i}`,
          type: 'rating' as CardType,
          category: 'All' as Category,
          name: r.name,
          role: r.role || 'Client',
          roleKm: r.role || 'Client',
          msg: r.content,
          msgKm: r.content,
          avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=random`,
          rating: r.rating || 5,
        }));
        setDbCards(cards);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Merge static TESTIMONIALS constant
  const staticFromConst: UnifiedCard[] = TESTIMONIALS.map((t: Testimonial, i: number) => ({
    id: `const-${t.id || i}`,
    type: 'quote' as CardType,
    category: 'All' as Category,
    name: t.name,
    role: t.role || 'Client',
    roleKm: t.role || 'Client',
    msg: t.content,
    msgKm: t.contentKm || t.content,
    avatar: t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`,
    rating: 5,
  }));

  const allCards = [...STATIC_CARDS, ...dbCards, ...staticFromConst];

  const filtered = compact
    ? STATIC_CARDS.slice(0, 3)
    : (activeCategory === 'All'
        ? allCards
        : allCards.filter(c => c.category === activeCategory || c.category === 'All' as Category));

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="client-wins-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(99,102,241,0.09),transparent_44%),radial-gradient(circle_at_85%_30%,rgba(236,72,153,0.06),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-400 shadow-md backdrop-blur-xl mb-6 font-khmer">
              <Star size={13} className="fill-yellow-500 text-yellow-500" />
              {t('Voices from our clients', 'សំលេងពីអតិថិជន')}
            </div>
            <h2 id="client-wins-title" className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white font-khmer">
              {t('Results clients', 'លទ្ធផលដែលអតិថិជន')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {t('can\'t stop sharing.', 'ចែករំលែកជានិច្ច។')}
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Category filter — full mode only */}
        {!compact && (
          <RevealOnScroll delay={80}>
            <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
              <Filter size={14} className="text-gray-400 shrink-0" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all font-khmer ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
                  }`}
                >
                  {t(cat, cat)}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {/* Card grid */}
        <div className={`gap-5 space-y-5 ${compact ? 'columns-1 sm:columns-3' : 'columns-1 sm:columns-2 lg:columns-3'}`}>
          {filtered.map((card, i) => (
            <RevealOnScroll key={card.id} delay={i * 60} className="break-inside-avoid mb-5">
              {card.type === 'win' ? (
                <WinCard card={card} t={t} />
              ) : card.type === 'rating' ? (
                <RatingCard card={card} t={t} />
              ) : (
                <QuoteCard card={card} t={t} />
              )}
            </RevealOnScroll>
          ))}
        </div>

        {/* Compact mode: "See all" link */}
        {compact && (
          <RevealOnScroll delay={200}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-sm font-black text-gray-700 dark:text-gray-300 font-khmer">
                <span className="text-gray-950 dark:text-white">5.0</span>
                {' · '}
                {t('80+ verified clients', 'អតិថិជនជាង 80+ បានផ្ទៀងផ្ទាត់')}
              </p>
              <a
                onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/company'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                href="/company"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors font-khmer"
              >
                {t('Meet our clients →', 'ស្គាល់អតិថិជន →')}
              </a>
            </div>
          </RevealOnScroll>
        )}

        {/* Aggregate rating — full mode only */}
        {!compact && (
          <RevealOnScroll delay={320}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={18} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-sm font-black text-gray-700 dark:text-gray-300 font-khmer">
                <span className="text-gray-950 dark:text-white">5.0</span>
                {' · '}
                {t('80+ verified clients', 'អតិថិជនជាង 80+ បានផ្ទៀងផ្ទាត់')}
              </p>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
};

export default ClientWins;

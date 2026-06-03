import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const WIN_CARDS = [
  {
    name: 'Ahmad Al-Rashid',
    role: 'CEO, TechStart KH',
    roleKm: 'CEO, TechStart KH',
    msg: 'Our new brand stopped people mid-scroll. Sales up 40% in 2 months.',
    msgKm: 'Brand ថ្មីទាក់ទាញអ្នកមើល ការលក់ឡើង 40% ក្នុង 2 ខែ។',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+R&background=6366f1&color=fff&size=80',
    rating: 5,
    delay: 0,
  },
  {
    name: 'Sophea Keo',
    role: 'Founder, Bloom Studio',
    roleKm: 'ស្ថាបនិក, Bloom Studio',
    msg: 'The website they built converts 3x better than our old one. Incredible.',
    msgKm: 'វេបសាយដែលគេបង្កើតឲ្យ convert ល្អជាងមុន 3 ដង។ ប្រោស!',
    avatar: 'https://ui-avatars.com/api/?name=Sophea+K&background=a855f7&color=fff&size=80',
    rating: 5,
    delay: 600,
  },
  {
    name: 'David Chen',
    role: 'Marketing Dir., NovaCo',
    roleKm: 'ប្រធានទីផ្សារ, NovaCo',
    msg: 'Fastest agency I\'ve worked with. Delivered ahead of schedule, every time.',
    msgKm: 'Agency លឿនបំផុតដែលខ្ញុំធ្លាប់ធ្វើការ។ ផ្ញើមុនកាលកំណត់គ្រប់ដង។',
    avatar: 'https://ui-avatars.com/api/?name=David+C&background=06b6d4&color=fff&size=80',
    rating: 5,
    delay: 1200,
  },
  {
    name: 'Fatima Hassan',
    role: 'Owner, Al-Noor Restaurant',
    roleKm: 'ម្ចាស់, Al-Noor Restaurant',
    msg: 'Our logo and interior design together — perfection. Clients notice immediately.',
    msgKm: 'ឡូហ្គោ និង Interior Design ជាមួយគ្នា — ល្អឥតខ្ចោះ។ Client ស្គាល់ភ្លាម។',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+H&background=ec4899&color=fff&size=80',
    rating: 5,
    delay: 1800,
  },
  {
    name: 'Ratha Nim',
    role: 'Director, KH Properties',
    roleKm: 'នាយក, KH Properties',
    msg: 'Architecture drawings were flawless. The 3D renders sold units before build.',
    msgKm: 'ប្លង់ស្ថាបត្យ​ ល្អឥតខ្ចោះ។ 3D Render លក់បន្ទប់បានមុនសាង។',
    avatar: 'https://ui-avatars.com/api/?name=Ratha+N&background=f59e0b&color=fff&size=80',
    rating: 5,
    delay: 2400,
  },
];

interface WinCardProps {
  name: string;
  role: string;
  msg: string;
  avatar: string;
  rating: number;
  isVisible: boolean;
  t: (en: string, km?: string) => string;
  roleKm: string;
  msgKm: string;
}

const WinCard: React.FC<WinCardProps> = ({ name, role, roleKm, msg, msgKm, avatar, rating, isVisible, t }) => (
  <div
    className={`group relative flex flex-col gap-3 rounded-3xl border border-gray-100 dark:border-white/8 bg-white/90 dark:bg-gray-900/90 p-5 shadow-xl shadow-black/5 dark:shadow-black/40 backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200/50 dark:hover:border-indigo-400/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    style={{ transitionProperty: 'opacity, transform, box-shadow, border-color' }}
  >
    {/* Glow */}
    <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* Stars */}
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>

    {/* Message */}
    <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300 font-khmer">
      "{t(msg, msgKm)}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-white/5">
      <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20" loading="lazy" />
      <div>
        <p className="text-xs font-black text-gray-900 dark:text-white">{name}</p>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-khmer">{t(role, roleKm)}</p>
      </div>
    </div>
  </div>
);

const ClientWins: React.FC = () => {
  const { t } = useLanguage();
  const [visibleCards, setVisibleCards] = useState<boolean[]>(WIN_CARDS.map(() => false));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          WIN_CARDS.forEach((card, i) => {
            setTimeout(() => {
              setVisibleCards(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, card.delay);
          });
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasTriggered]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="client-wins-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(99,102,241,0.10),transparent_44%),radial-gradient(circle_at_85%_30%,rgba(236,72,153,0.07),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-400 shadow-md backdrop-blur-xl mb-6 font-khmer">
              <Star size={13} className="fill-yellow-500 text-yellow-500" />
              {t('Client Wins', 'ជោគជ័យអតិថិជន')}
            </div>
            <h2 id="client-wins-title" className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white font-khmer">
              {t('Results clients', 'លទ្ធផលដែលអតិថិជន')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {t('actually share.', 'ចែករំលែកជាក់ស្ដែង។')}
              </span>
            </h2>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400 font-khmer max-w-xl mx-auto">
              {t(
                'Real feedback from businesses that trusted us to transform their brand and digital presence.',
                'មតិកែលម្អពិតៗ ពីអាជីវកម្មដែលទុកចិត្តយើង ដើម្បីផ្លាស់ប្ដូរ Brand និងវត្តមានឌីជីថល។'
              )}
            </p>
          </div>
        </RevealOnScroll>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {WIN_CARDS.map((card, i) => (
            <WinCard
              key={i}
              {...card}
              isVisible={visibleCards[i]}
              t={t}
            />
          ))}
        </div>

        {/* Aggregate star rating */}
        <RevealOnScroll delay={300}>
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
      </div>
    </section>
  );
};

export default ClientWins;

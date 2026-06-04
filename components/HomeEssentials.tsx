import React from 'react';
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Images, MessageCircle } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import { useLanguage } from '../contexts/LanguageContext';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const tiles = [
  {
    label: 'Work',
    labelKm: 'ស្នាដៃ',
    micro: 'See proof',
    microKm: 'មើលភស្តុតាង',
    href: '/projects',
    icon: Images,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=85&w=1200',
    className: 'md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[560px]',
  },
  {
    label: 'Services',
    labelKm: 'សេវា',
    micro: 'Pick path',
    microKm: 'ជ្រើសផ្លូវ',
    href: '/services',
    icon: BriefcaseBusiness,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=85&w=900',
    className: 'min-h-[260px]',
  },
  {
    label: 'Trust',
    labelKm: 'ទំនុកចិត្ត',
    micro: 'Real team',
    microKm: 'ក្រុមពិត',
    href: '/company',
    icon: BadgeCheck,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=900',
    className: 'min-h-[260px]',
  },
  {
    label: 'Start',
    labelKm: 'ចាប់ផ្តើម',
    micro: 'Send brief',
    microKm: 'ផ្ញើ brief',
    href: '/contact',
    icon: MessageCircle,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=900',
    className: 'md:col-span-2 min-h-[250px]',
  },
];

const HomeEssentials: React.FC = () => {
  const { t } = useLanguage();

  const navigateToPage = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    window.history.pushState(null, '', `${getLanguagePrefix()}${href}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-gray-950 md:py-28" aria-labelledby="home-essentials-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_82%_78%,rgba(236,72,153,0.10),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="mask-in" className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-khmer text-xs font-black uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">
              {t('Only essentials', 'បង្ហាញតែចាំបាច់')}
            </span>
            <h2 id="home-essentials-title" className="mt-3 font-khmer text-4xl font-black leading-none tracking-[-0.05em] text-gray-950 dark:text-white md:text-7xl">
              {t('Look. Choose. Start.', 'មើល។ ជ្រើស។ ចាប់ផ្តើម។')}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-khmer text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
            <span>{t('No clutter', 'មិនរញ៉េរញ៉ៃ')}</span>
            <span>{t('Visual first', 'រូបភាពមុន')}</span>
            <span>{t('Fast action', 'សកម្មភាពលឿន')}</span>
          </div>
        </RevealOnScroll>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-4">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <RevealOnScroll key={tile.href} variant={index % 2 === 0 ? 'tilt-in' : 'float-in'} delay={index * 80}>
                <a
                  href={tile.href}
                  onClick={(event) => navigateToPage(event, tile.href)}
                  className={`group essential-tile tilt-hover spotlight-hover relative block overflow-hidden rounded-[2.2rem] bg-gray-950 text-white shadow-2xl shadow-gray-950/15 outline-none ring-1 ring-white/10 transition-all duration-500 focus-visible:ring-2 focus-visible:ring-indigo-300 ${tile.className}`}
                >
                  <img
                    src={tile.image}
                    alt={t(tile.label, tile.labelKm)}
                    className="absolute inset-0 h-full w-full object-cover opacity-72 transition-all duration-700 group-hover:scale-110 group-hover:opacity-88"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-fuchsia-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-6 md:p-8">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/12 px-3 py-1.5 font-khmer text-[10px] font-black uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl">
                        0{index + 1}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-950 shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <Icon size={20} />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-khmer text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">
                        {t(tile.label, tile.labelKm)}
                      </h3>
                      <div className="mt-4 inline-flex translate-y-2 items-center gap-2 rounded-full bg-white/14 px-4 py-2 font-khmer text-sm font-black opacity-0 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {t(tile.micro, tile.microKm)}
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </a>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeEssentials;

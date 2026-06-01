import React, { useMemo } from 'react';
import { ArrowRight, BriefcaseBusiness, Images, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const navigateToPage = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('/')) return;
  event.preventDefault();
  window.history.pushState(null, '', `${getLanguagePrefix()}${href}` || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=85&w=1400',
  'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&q=85&w=1400',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=1400',
];

const HomeVisualGateway: React.FC = () => {
  const { t } = useLanguage();
  const { projects = [], services = [] } = useData();

  const projectImages = useMemo(() => projects.map(project => project.image).filter(Boolean), [projects]);
  const serviceCount = Math.max(services.length, 6);

  const gateways = [
    {
      href: '/services',
      image: projectImages[0] || fallbackImages[0],
      icon: BriefcaseBusiness,
      eyebrow: `${serviceCount}+`,
      title: 'Services',
      titleKm: 'សេវាកម្ម',
      caption: 'Choose the right path',
      captionKm: 'ជ្រើសផ្លូវសេវាកម្ម',
      className: 'lg:row-span-2 min-h-[520px]',
    },
    {
      href: '/projects',
      image: projectImages[1] || fallbackImages[1],
      icon: Images,
      eyebrow: 'Gallery',
      title: 'Projects',
      titleKm: 'ស្នាដៃ',
      caption: 'See visual proof',
      captionKm: 'មើលភស្តុតាងជារូប',
      className: 'min-h-[250px]',
    },
    {
      href: '/contact',
      image: projectImages[2] || fallbackImages[2],
      icon: MessageCircle,
      eyebrow: 'Brief',
      title: 'Contact',
      titleKm: 'ទំនាក់ទំនង',
      caption: 'Start with one click',
      captionKm: 'ចាប់ផ្តើមដោយចុចមួយ',
      className: 'min-h-[250px]',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-950 py-20 text-white md:py-28" aria-labelledby="home-gateway-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.24),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(236,72,153,0.16),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.28em] text-indigo-200 font-khmer">
                {t('Homepage structure', 'រចនាសម្ព័ន្ធ Homepage')}
              </span>
              <h2 id="home-gateway-title" className="mt-3 text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl font-khmer">
                {t('Keep the homepage short. Let pages do the detail.', 'រក្សា Homepage ឲ្យខ្លី។ ឲ្យ Page ផ្សេងរៀបរាប់លម្អិត។')}
              </h2>
            </div>
            <p className="max-w-sm text-sm font-bold leading-6 text-gray-300 font-khmer">
              {t('Scroll should feel like a visual menu, not a full website repeated on one page.', 'ពេល scroll គួរមានអារម្មណ៍ដូច menu រូបភាព មិនមែនយក website ទាំងមូលមកស្ទួន។')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {gateways.map((gateway, index) => {
            const Icon = gateway.icon;
            return (
              <RevealOnScroll key={gateway.href} delay={index * 90}>
                <a
                  href={gateway.href}
                  onClick={(event) => navigateToPage(event, gateway.href)}
                  className={`group relative block overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 outline-none transition-all duration-500 hover:-translate-y-1 hover:border-indigo-300/50 focus-visible:ring-2 focus-visible:ring-indigo-300 ${gateway.className}`}
                >
                  <img
                    src={gateway.image}
                    alt={t(gateway.title, gateway.titleKm)}
                    className="absolute inset-0 h-full w-full object-cover opacity-78 transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/28 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-950/45 via-transparent to-transparent opacity-80" />
                  <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] backdrop-blur-xl">
                        {gateway.eyebrow}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-950 shadow-xl transition-transform group-hover:rotate-6 group-hover:scale-110">
                        <Icon size={23} />
                      </span>
                    </div>

                    <div>
                      <h3 className="text-4xl font-black tracking-[-0.04em] md:text-6xl font-khmer">{t(gateway.title, gateway.titleKm)}</h3>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black backdrop-blur-xl font-khmer">
                        {t(gateway.caption, gateway.captionKm)}
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
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

export default HomeVisualGateway;

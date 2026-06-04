import React from 'react';
import { ArrowRight, Palette, Clock, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};
const navigateTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('/')) return;
  event.preventDefault();
  window.history.pushState(null, '', `${getLanguagePrefix()}${href}` || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const DIFFERENTIATORS = [
  {
    icon: Palette,
    color: 'from-indigo-500 to-purple-600',
    glowColor: 'rgba(99,102,241,0.3)',
    borderColor: 'border-indigo-500/20',
    title: 'Every pixel is custom.',
    titleKm: 'ប្រ៊ីស Pixel គ្រប់ពណ៌ — ផ្ទាល់ខ្លួន',
    desc: "We don't use templates. Every brand, every website, every layout is built from zero for you.",
    descKm: 'យើងមិនប្រើ template ទេ។ Brand វេបសាយ layout — ទាំងអស់សង់ពីដំបូងសម្រាប់អ្នក។',
    badge: '100% Custom',
    badgeKm: '100% ផ្ទាល់ខ្លួន',
  },
  {
    icon: Clock,
    color: 'from-pink-500 to-rose-600',
    glowColor: 'rgba(236,72,153,0.3)',
    borderColor: 'border-pink-500/20',
    title: '48-hour first draft.',
    titleKm: 'ដ្រាហ្វដំបូងក្នុង ៤៨ ម៉ោង',
    desc: 'Most agencies take weeks just to reply. We deliver your first creative draft within 48 hours of briefing.',
    descKm: 'Agency ភាគច្រើនត្រូវការជាច្រើនសប្ដាហ៍ ដើម្បីឆ្លើយ។ យើងផ្ញើដ្រាហ្វ creative ដំបូងក្នុង ៤៨ ម៉ោងបន្ទាប់ brief។',
    badge: 'Fast delivery',
    badgeKm: 'ផ្ញើបានលឿន',
  },
  {
    icon: Globe,
    color: 'from-cyan-500 to-teal-600',
    glowColor: 'rgba(6,182,212,0.3)',
    borderColor: 'border-cyan-500/20',
    title: '3 languages. 1 studio.',
    titleKm: 'ភាសា ៣ — ស្ទូឌីអូ ១',
    desc: 'Khmer. English. Arabic. We create content, design, and communication in all three — no outsourcing.',
    descKm: 'ខ្មែរ។ អង់គ្លេស។ អារ៉ាប់។ យើងបង្កើតមាតិកា ការរចនា និងការទំនាក់ទំនងទាំងបី — គ្មាន outsource។',
    badge: 'KH · EN · AR',
    badgeKm: 'ខ្មែរ · EN · AR',
  },
];

const HomeConversion: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gray-950" aria-labelledby="why-different-title">
      {/* Background grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-pink-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/60 backdrop-blur-xl mb-6 font-khmer">
              ✦ {t('Why choose us', 'ហេតុអ្វីជ្រើសរើសយើង')}
            </div>
            <h2 id="why-different-title" className="text-4xl md:text-6xl font-black leading-tight tracking-[-0.04em] text-white font-khmer">
              {t('Different by', 'ខុសគ្នា')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                {t('design.', 'ដោយការរចនា។')}
              </span>
            </h2>
            <p className="mt-4 text-base text-white/50 font-khmer max-w-xl mx-auto">
              {t(
                'Three things that separate Ponloe Creative from every other agency in the region.',
                'រឿង ៣ ដែលញែក Ponloe Creative ពី Agency ផ្សេងៗក្នុងតំបន់។'
              )}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-5">
          {DIFFERENTIATORS.map((item, i) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={item.title} delay={i * 100}>
                <div
                  className={`group relative overflow-hidden rounded-[2rem] border ${item.borderColor} bg-white/[0.03] p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2`}
                  style={{ boxShadow: `0 0 0 0px ${item.glowColor}`, transition: 'all 0.5s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 60px -10px ${item.glowColor}`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
                >
                  {/* Glow layer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${item.glowColor}, transparent 60%)` }}
                  />

                  {/* Icon */}
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-xl`}>
                    <Icon size={26} className="text-white" />
                  </div>

                  {/* Badge */}
                  <div className="mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-[0.22em] bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {t(item.badge, item.badgeKm)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 font-khmer">
                    {t(item.title, item.titleKm)}
                  </h3>

                  {/* Desc */}
                  <p className="text-sm text-white/50 leading-relaxed font-khmer">
                    {t(item.desc, item.descKm)}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* CTA row */}
        <RevealOnScroll delay={320}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              onClick={e => navigateTo(e, '/contact')}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-gray-950 hover:bg-indigo-100 transition-all hover:-translate-y-0.5 shadow-lg shadow-white/10 font-khmer"
            >
              {t('Start your project', 'ចាប់ផ្ដើមគម្រោងអ្នក')} <ArrowRight size={16} />
            </a>
            <a
              href="/services"
              onClick={e => navigateTo(e, '/services')}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-black text-white/70 hover:text-white hover:bg-white/10 transition-all font-khmer"
            >
              {t('Explore services', 'ស្វែងរកសេវាកម្ម')}
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default HomeConversion;

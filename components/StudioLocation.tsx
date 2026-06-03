import React from 'react';
import { MapPin, Clock, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const WHATSAPP_NUMBER = '85512345678'; // placeholder — can be updated in admin

const StudioLocation: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(t(
      'Hello Ponloe Creative! I\'d like to start a project.',
      'សួស្ដី Ponloe Creative! ខ្ញុំចង់ចាប់ផ្ដើមគម្រោងមួយ។'
    ));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="studio-location-title">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.09),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <span className="text-[11px] font-black uppercase tracking-[0.26em] text-indigo-500 dark:text-indigo-400 font-khmer">
              {t('Find us', 'រកយើង')}
            </span>
            <h2 id="studio-location-title" className="mt-2 text-4xl md:text-5xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white font-khmer">
              {t('Based in', 'ស្ថិតនៅ')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500"> {t('Phnom Penh.', 'ភ្នំពេញ។')}</span>
              <span className="block text-gray-400 dark:text-gray-500 font-medium text-xl md:text-2xl mt-1">
                {t('Available globally.', 'ខ្ញុំ Available ជាអន្ដរជាតិ។')}
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Map embed card */}
          <RevealOnScroll variant="slide-right" delay={80}>
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 bg-gray-100 dark:bg-gray-900 min-h-[320px]">
              <iframe
                title={t('Ponloe Creative Studio — Phnom Penh', 'ស្ទូឌីយោ Ponloe Creative — ភ្នំពេញ')}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31348.90684888929!2d104.89182!3d11.56245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951d95b4cd46f%3A0x1b80e6ca73fb0893!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1686000000000"
                className="w-full h-full min-h-[320px] border-0 saturate-[0.7]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Overlay pin */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="flex items-center gap-2 rounded-full bg-white/95 dark:bg-gray-950/95 px-4 py-2 shadow-xl border border-white/50 dark:border-white/10 backdrop-blur-md">
                  <MapPin size={14} className="text-indigo-500" />
                  <span className="text-xs font-black text-gray-900 dark:text-white font-khmer">
                    {t('Phnom Penh, Cambodia', 'ភ្នំពេញ, កម្ពុជា')}
                  </span>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Info + CTA card */}
          <RevealOnScroll variant="slide-left" delay={120}>
            <div className="flex flex-col gap-5 h-full">
              {/* Office hours */}
              <div className="flex-1 rounded-3xl border border-gray-100 dark:border-white/8 bg-white/80 dark:bg-white/[0.03] p-6 shadow-lg dark:shadow-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-indigo-500" />
                  <span className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-white font-khmer">
                    {t('Studio Hours', 'ម៉ោងបើកដំណើរការ')}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { days: 'Monday – Friday', daysKm: 'ច័ន្ទ – សុក្រ', hours: '8:00 AM – 6:00 PM' },
                    { days: 'Saturday', daysKm: 'សៅរ៍', hours: '9:00 AM – 4:00 PM' },
                    { days: 'Sunday', daysKm: 'អាទិត្យ', hours: t('Closed', 'បិទ') },
                  ].map(({ days, daysKm, hours }) => (
                    <div key={days} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400 font-khmer">{t(days, daysKm)}</span>
                      <span className={`text-sm font-black ${hours === t('Closed', 'បិទ') ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}>{hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 font-khmer">
                    {t('Currently open for new projects', 'ទទួលគម្រោងថ្មីកំពុងបើក')}
                  </span>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 p-5 shadow-lg hover:bg-green-100 dark:hover:bg-green-500/20 hover:border-green-300 dark:hover:border-green-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/15"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 shadow-lg shadow-green-500/30">
                    <MessageCircle size={22} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-green-800 dark:text-green-300 font-khmer">{t('Chat on WhatsApp', 'ផ្ញើសារតាម WhatsApp')}</p>
                    <p className="text-xs font-bold text-green-600 dark:text-green-500 font-khmer">{t('Usually replies within 1 hour', 'ជាធម្មតាឆ្លើយក្នុងមួយម៉ោង')}</p>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-green-600 dark:text-green-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>

              {/* Email CTA */}
              <a
                href="mailto:hello@ponloecreative.com"
                className="group flex items-center justify-between gap-4 rounded-3xl border border-gray-100 dark:border-white/8 bg-white/80 dark:bg-white/[0.03] p-5 shadow-md hover:border-indigo-200 dark:hover:border-indigo-400/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div>
                  <p className="font-black text-gray-900 dark:text-white font-khmer">{t('Send an email', 'ផ្ញើអ៊ីមែល')}</p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">hello@ponloecreative.com</p>
                </div>
                <ArrowUpRight size={18} className="text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default StudioLocation;

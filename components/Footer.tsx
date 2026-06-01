import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowUpRight, Facebook, Send, Instagram, Mail, MapPin, Download, ArrowRight, Check, Loader2 } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import RevealOnScroll from './RevealOnScroll';
import { sendTelegramMessage } from '../lib/telegram-send';

const NewsletterForm: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const text = `📧 *Newsletter Subscription* 📧\n\nEmail: ${email}`;
    try {
      const ok = await sendTelegramMessage(text);
      if (ok) { setStatus('success'); setEmail(''); }
      else throw new Error();
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {status === 'success' ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-khmer">
          <Check size={16} /> {t('Subscribed! Thank you.', 'ចុះឈ្មោះបានហើយ! អរគុណ។')}
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-khmer"
            placeholder={t('Your email', 'អ៊ីមែលរបស់អ្នក')}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-60"
          >
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          </button>
        </>
      )}
    </form>
  );
};

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { isInstallable, installPWA } = usePWA();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-gray-950 pt-16 overflow-hidden" role="contentinfo" aria-label="Site footer">
      {/* Decorative Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Big CTA */}
        <div className="flex flex-col items-center text-center mb-16 relative border-b border-gray-100 dark:border-white/5 pb-16">
            <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-bold tracking-wider mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                    <span className="font-khmer">{t("Available for new projects", "ទទួលគម្រោងថ្មីៗ")}</span>
                </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white font-khmer leading-[1.1] tracking-tight max-w-5xl mx-auto mb-10">
                    {t("Let's create something", "តោះបង្កើតអ្វីមួយ")} <br />
                    <span className="relative inline-block">
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-30 pointer-events-none"></span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            {t("extraordinary together.", "ដែលអស្ចារ្យទាំងអស់គ្នា។")}
                        </span>
                    </span>
                </h2>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200} className="flex flex-col items-center">
                <a 
                    href={`/${language}/contact`} 
                    className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-full font-bold text-xl hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:-translate-y-1"
                >
                    <span className="font-khmer">{t("Start a Project", "ចាប់ផ្តើមគម្រោង")}</span>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 duration-500 transition-transform">
                        <ArrowUpRight size={20} />
                    </div>
                </a>
            </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-24 pt-4">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-8">
                <a href="#" className="flex items-center gap-3 group w-fit">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform text-xl border border-white/10 group-hover:border-indigo-400/50">P</div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-300 transition-colors">ponloe<span className="text-gray-500 group-hover:text-gray-400">.creative</span></span>
                </a>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-sm text-base">
                    {t(
                        "Pioneering the future of digital design and architectural innovation in Cambodia. We build brands that matter.",
                        "ត្រួសត្រាយអនាគតនៃការរចនាឌីជីថល និងនវានុវត្តន៍ស្ថាបត្យកម្មនៅកម្ពុជា។ យើងកសាងម៉ាកយីហោដែលមានតម្លៃ។"
                    )}
                </p>
                <div className="flex gap-4">
                    {[
                        { icon: Facebook, href: "https://facebook.com" },
                        { icon: Send, href: "https://telegram.org" }, 
                        { icon: Instagram, href: "https://instagram.com" }
                    ].map((Item, idx) => (
                        <a key={idx} href={Item.href} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-950 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300">
                            <Item.icon size={20} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-2 md:col-span-1">
                <h4 className="text-gray-900 dark:text-white font-bold mb-8 font-khmer text-lg">{t("Services", "សេវាកម្ម")}</h4>
                <ul className="space-y-4">
                    {['Web Development', 'App Development', 'Graphic Design', 'Architecture', 'MVAC System'].map((item) => (
                        <li key={item}>
                            <a href={`/${language}/services`} className="text-gray-500 hover:text-indigo-400 transition-colors text-sm md:text-base font-khmer block hover:translate-x-2 duration-300 flex items-center gap-2 group">
                                <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity box-shadow-[0_0_10px_#6366f1]"></span>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="lg:col-span-2 md:col-span-1">
                <h4 className="text-gray-900 dark:text-white font-bold mb-8 font-khmer text-lg">{t("Company", "ក្រុមហ៊ុន")}</h4>
                <ul className="space-y-4">
                    {[
                        { label: t('About Us', 'អំពីយើង'), href: `/${language}/company` },
                        { label: t('Careers', 'ឱកាសការងារ'), href: `/${language}/careers` },
                        { label: t('Insights', 'អត្ថបទ'), href: `/${language}/blog` },
                        { label: t('Privacy Policy', 'គោលការណ៍​ភាព​ឯកជន'), href: '#privacy' }
                    ].map((item) => (
                        <li key={item.href}>
                            <a 
                                href={item.href} 
                                className="text-gray-500 hover:text-indigo-400 transition-colors text-sm md:text-base font-khmer block hover:translate-x-2 duration-300 flex items-center gap-2 group"
                            >
                                <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {item.label}
                            </a>
                        </li>
                    ))}
                     <li>
                        <a href="#admin" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm md:text-base font-khmer block hover:translate-x-2 duration-300 flex items-center gap-2 group">
                             <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                             Admin Login
                        </a>
                    </li>
                </ul>
            </div>

            {/* Contact Column - Stylized Card */}
            <div className="lg:col-span-4 md:col-span-2">
                 <div className="bg-gradient-to-br from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                     {/* Glow Effect */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                     
                     <h4 className="text-gray-900 dark:text-white font-bold mb-6 font-khmer text-lg relative z-10">{t("Contact Info", "ព័ត៌មានទំនាក់ទំនង")}</h4>
                     <div className="space-y-6 relative z-10">
                        <a href="mailto:creative.ponloe.org@gmail.com" className="flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group/link">
                            <div className="p-3 bg-white dark:bg-gray-950 rounded-xl group-hover/link:bg-indigo-600 transition-colors border border-gray-100 dark:border-white/5 group-hover/link:shadow-[0_0_15px_rgba(99,102,241,0.5)]"><Mail size={20} /></div>
                            <span className="text-sm md:text-base font-medium break-all">creative.ponloe.org@gmail.com</span>
                        </a>
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 group/link">
                            <div className="p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-white/5"><MapPin size={20} /></div>
                            <span className="text-sm md:text-base font-medium font-khmer">Russey Keo, Phnom Penh, Cambodia</span>
                        </div>
                     </div>
                 </div>

                 {/* Newsletter Subscription */}
                 <div className="mt-6 bg-gray-50 dark:bg-white/[0.03] rounded-3xl p-6 border border-gray-100 dark:border-white/5">
                     <h4 className="text-gray-900 dark:text-white font-bold mb-2 font-khmer text-sm">{t('Stay Updated', 'ទទួលព័ត៌មានថ្មី')}</h4>
                     <p className="text-gray-500 text-xs font-khmer mb-4">{t('Get insights, tips & project updates.', 'ទទួលដំណឹង គន្លឹះ & ការអាប់ដេតគម្រោង។')}</p>
                     <NewsletterForm />
                 </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-gray-100 dark:border-white/5 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-4 z-20">
             <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
               <p className="text-gray-600 text-sm font-khmer">
                  © {currentYear} Ponloe Creative. All Rights Reserved.
               </p>
               {isInstallable && (
                 <button 
                   onClick={installPWA}
                   className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-indigo-400 text-sm font-bold transition-all duration-300 group"
                 >
                   <Download size={16} className="group-hover:bounce" />
                   <span className="font-khmer">{t("Install App", "ដំឡើងកម្មវិធី")}</span>
                 </button>
               )}
             </div>
             <p className="text-gray-600 text-sm font-khmer flex items-center gap-1.5">
                Made with <span className="text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">♥</span> in Cambodia
             </p>
        </div>
        
        {/* Massive Watermark Text - Fixed Position at bottom with SHINE Animation */}
        <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden z-0">
            <h1 className="text-[18vw] md:text-[22vw] font-black leading-none tracking-tighter scale-y-110 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-clip-text text-transparent animate-text-shine bg-[length:200%_auto]">
                PONLOE
            </h1>
        </div>
      </div>

      <style>{`
        @keyframes shine {
            to {
                background-position: 200% center;
            }
        }
        .animate-text-shine {
            animation: shine 8s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;

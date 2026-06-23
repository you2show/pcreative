import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Github, Instagram, Facebook, Youtube, Zap, ArrowUpRight } from 'lucide-react';

const LINKS = {
  services: ['Web Development','App Development','Graphic Design','Video Editing','Digital Marketing'],
  company:  ['About Us','Our Team','Careers','Blog','Contact'],
  legal:    ['Privacy Policy','Terms of Use','Cookie Policy'],
};

const SOCIALS = [
  { icon: Facebook,  href: '#', label: 'Facebook'  },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube,   href: '#', label: 'YouTube'   },
  { icon: Github,    href: '#', label: 'GitHub'    },
];

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/[0.04] overflow-hidden">
      {/* Background grid */}
      <div className="grid-bg opacity-20" />

      {/* Glow */}
      <div className="glow-spot glow-spot-brand w-[400px] h-[400px]
                      bottom-0 left-1/2 -translate-x-1/2 opacity-10" />

      {/* Big CTA strip */}
      <div className="border-b border-white/[0.04] py-20 relative z-10">
        <div className="container-xl text-center space-y-6">
          <p className="label-tag mx-auto w-fit">{t('Ready?', 'ត្រៀមខ្លួន?')}</p>
          <h2 className="heading-display text-white">
            {t("Let's Build", 'តោះបង្កើត')}{' '}
            <span className="text-gradient">{t('Something', 'អ្វីមួយ')}</span>
            <br />
            <span className="text-white/40">{t('Extraordinary', 'អស្ចារ្យ')}</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <a href="#contact" className="btn-glow">
              <span>{t('Start a Project', 'ចាប់ផ្ដើមគម្រោង')}</span>
            </a>
            <a href="mailto:hello@pcreative.studio" className="btn-ghost">
              <span>hello@pcreative.studio</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="container-xl py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand col */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                P<span className="text-gradient">Creative</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-khmer">
              {t(
                'Bold digital studio crafting experiences that convert.',
                'ស្ទូឌីយ៉ូឌីជីថល ច្នៃប្រឌិតបទពិសោធន៍ ដែលបំប្លែង'
              )}
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(s => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} aria-label={s.label}
                     className="w-9 h-9 rounded-full border border-white/8 flex items-center justify-center
                                text-white/40 hover:text-white hover:border-white/25
                                hover:bg-white/5 transition-all duration-300">
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">
              {t('Services', 'សេវាកម្ម')}
            </h4>
            <ul className="space-y-3">
              {LINKS.services.map(l => (
                <li key={l}>
                  <a href="#services"
                     className="text-sm text-white/45 hover:text-white transition-colors duration-200 font-medium">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">
              {t('Company', 'ក្រុមហ៊ុន')}
            </h4>
            <ul className="space-y-3">
              {LINKS.company.map(l => (
                <li key={l}>
                  <a href="#"
                     className="text-sm text-white/45 hover:text-white transition-colors duration-200 font-medium">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">
              {t('Contact', 'ទំនាក់ទំនង')}
            </h4>
            <ul className="space-y-3 text-sm text-white/45">
              <li>📍 Phnom Penh, Cambodia</li>
              <li>📧 hello@pcreative.studio</li>
              <li>📱 +855 xx xxx xxxx</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gradient-line mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4
                        text-xs text-white/25">
          <span>© {year} PCreative Studio. {t('All rights reserved.','រក្សាសិទ្ធិទាំងអស់។')}</span>
          <div className="flex gap-5">
            {LINKS.legal.map(l => (
              <a key={l} href="#"
                 className="hover:text-white/60 transition-colors duration-200">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Zap } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

const NAV_LINKS = [
  { href: '#services',  labelEn: 'Services', labelKm: 'សេវាកម្ម' },
  { href: '#portfolio', labelEn: 'Work',     labelKm: 'ស្នាដៃ'   },
  { href: '#about',     labelEn: 'About',    labelKm: 'អំពីយើង'  },
  { href: '#insights',  labelEn: 'Blog',     labelKm: 'ទស្សនា'   },
  { href: '#contact',   labelEn: 'Contact',  labelKm: 'ទំនាក់ទំនង'},
];

const Header: React.FC = () => {
  const { t }   = useLanguage();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-[100]
                  transition-all duration-500
                  ${scrolled
                    ? 'py-3 border-b border-white/[0.06] backdrop-blur-2xl bg-black/80'
                    : 'py-5 bg-transparent'
                  }`}
    >
      <div className="container-xl flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group no-underline">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-80
                            group-hover:opacity-100 transition-opacity duration-300
                            group-hover:shadow-glow" />
            <div className="absolute inset-0 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            P<span className="text-gradient">Creative</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a key={link.href}
               href={link.href}
               onClick={() => setActiveLink(link.href)}
               className={`relative px-4 py-2 rounded-full text-sm font-medium
                          transition-all duration-300 font-khmer
                          ${activeLink === link.href
                            ? 'text-white'
                            : 'text-white/50 hover:text-white/90'
                          }`}>
              {t(link.labelEn, link.labelKm)}
              {activeLink === link.href && (
                <span className="absolute inset-0 rounded-full bg-white/10 border border-white/10" />
              )}
            </a>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden lg:flex" />

          <a href="#contact"
             className="hidden md:inline-flex btn-glow text-sm px-5 py-2.5">
            <span>{t('Get Quote', 'ទទួលតម្លៃ')}</span>
          </a>

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? t('Close menu', 'បិទម៉ឺនុយ') : t('Open menu', 'បើកម៉ឺនុយ')}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full
                       border border-white/10 text-white/70 hover:text-white
                       hover:border-white/20 hover:bg-white/5 transition-all duration-300">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500
                       ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-xl py-4 flex flex-col gap-1 border-t border-white/[0.04] mt-3">
          <div className="flex items-center justify-between px-4 py-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">{t('Language', 'ភាសា')}</span>
            <LanguageToggle />
          </div>
          <div className="gradient-line mb-2 opacity-30" />
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}
               onClick={() => setMenuOpen(false)}
               className="px-4 py-3 rounded-xl text-white/60 hover:text-white
                          hover:bg-white/5 transition-all duration-200 font-medium font-khmer">
              {t(link.labelEn, link.labelKm)}
            </a>
          ))}
          <a href="#contact" className="btn-glow mt-3 justify-center">
            <span>{t('Get Quote', 'ទទួលតម្លៃ')}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

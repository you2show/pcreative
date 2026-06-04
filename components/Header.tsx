import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Check, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { smoothScrollTo } from '../utils/scroll';
import { hapticLanguageChange, hapticTap } from '../utils/haptic';
import PonloeLogo from './PonloeLogo';
import ThemeToggle from './ThemeToggle';
import SoundToggle from './SoundToggle';

interface HeaderProps {
  onGetQuote?: () => void;
}

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getPathWithoutLanguage = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const start = segments[0] && supportedLangs.includes(segments[0]) ? 1 : 0;
  const path = `/${segments.slice(start).join('/')}`;
  return path === '/' ? '/' : path.replace(/\/$/, '');
};

const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const Header: React.FC<HeaderProps> = ({ onGetQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const { language, setLanguage, t, languageName } = useLanguage();

  const navRef = useRef<HTMLElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  
  const isManualScrolling = useRef(false);
  
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navLinks = [
    { key: 'services', name: t('Services', 'សេវាកម្ម'), href: '/services' },
    { key: 'projects', name: t('Projects', 'គម្រោង'), href: '/projects' },
    { key: 'company', name: t('About', 'អំពីយើង'), href: '/about' },
    { key: 'blog', name: t('Blog', 'អត្ថបទ'), href: '/blog' },
    { key: 'careers', name: t('Careers', 'ការងារ'), href: '/careers' },
    { key: 'contact', name: t('Contact', 'ទំនាក់ទំនង'), href: '/contact' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: 'https://upload.wikimedia.org/wikipedia/commons/1/13/United-kingdom_flag_icon_round.svg' },
    { code: 'km', label: 'ខ្មែរ', flag: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg' },
    { code: 'fr', label: 'Français', flag: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg' },
    { code: 'ja', label: '日本語', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg' },
    { code: 'ko', label: '한국어', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg' },
    { code: 'de', label: 'Deutsch', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg' },
    { code: 'zh-CN', label: '中文', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg' },
    { code: 'es', label: 'Español', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg' },
    { code: 'ar', label: 'العربية', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg' },
  ];

  const currentFlag = languages.find(l => l.code === language)?.flag || languages[0].flag;

  const syncActivePageFromPath = useCallback(() => {
    const path = getPathWithoutLanguage();
    if (path === '/services' || path.startsWith('/services/')) setActiveSection('services');
    else if (path === '/projects' || path.startsWith('/projects/') || path === '/portfolio' || path.startsWith('/portfolio/')) setActiveSection('projects');
    else if (path === '/company' || path.startsWith('/company/') || path === '/about' || path.startsWith('/about/')) setActiveSection('company');
    else if (path === '/blog' || path.startsWith('/blog/') || path === '/insights' || path.startsWith('/insights/')) setActiveSection('blog');
    else if (path === '/contact' || path.startsWith('/contact/') || path === '/estimator' || path.startsWith('/estimator/')) setActiveSection('contact');
    else if (path === '/careers' || path.startsWith('/careers/')) setActiveSection('careers');
    else setActiveSection('home');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setIsLangMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', syncActivePageFromPath);
    window.addEventListener('hashchange', syncActivePageFromPath);
    syncActivePageFromPath();
    
    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current || getPathWithoutLanguage() !== '/') return;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          const newSection = entry.target.id;
          setActiveSection(newSection === 'portfolio' ? 'projects' : newSection);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    const observeAllSections = () => {
      document.querySelectorAll('section').forEach(section => {
        if (section.id) observer.observe(section);
      });
    };

    observeAllSections();

    const mutationObserver = new MutationObserver((mutations) => {
      const hasNewSection = mutations.some(m =>
        Array.from(m.addedNodes).some(n =>
          n instanceof Element && (n.tagName === 'SECTION' || n.querySelector('section'))
        )
      );
      if (hasNewSection) observeAllSections();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', syncActivePageFromPath);
      window.removeEventListener('hashchange', syncActivePageFromPath);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [syncActivePageFromPath]);

  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.key === activeSection);
    if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
        const { offsetLeft, offsetWidth } = itemsRef.current[activeIndex]!;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection, language]);

  const navigateTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, key?: string) => {
    e.preventDefault();
    hapticTap();

    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        isManualScrolling.current = true;
        setActiveSection(targetId);
        window.history.pushState(null, '', href);
        smoothScrollTo(element.getBoundingClientRect().top + window.scrollY - 80, 1000);
        setTimeout(() => { isManualScrolling.current = false; }, 1100);
      }
      setIsMenuOpen(false);
      return;
    }

    const nextPath = `${getLanguagePrefix()}${href}` || '/';
    window.history.pushState(null, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setActiveSection(key || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (langCode: string) => {
    hapticLanguageChange();
    setLanguage(langCode as any);
    setIsLangMenuOpen(false);
  };

  const toggleMenu = () => {
    hapticTap();
    setIsMenuOpen(!isMenuOpen);
  };

  const mobileNavLinks = navLinks;

  const SCROLL_FADE_THRESHOLD = 4;

  const updateFades = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > SCROLL_FADE_THRESHOLD);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - SCROLL_FADE_THRESHOLD);
  }, []);

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateFades);
      ro.disconnect();
    };
  }, [updateFades, language]);

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4">
        <div className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 md:py-3 rounded-full border transition-all duration-300 w-full max-w-7xl ${isScrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-200 dark:border-white/10 shadow-2xl shadow-indigo-500/10' : 'bg-gray-100 dark:bg-white/5 backdrop-blur-md border-gray-100 dark:border-white/5'}`}>
          <a href="/" onClick={(e) => navigateTo(e, '/')} className="flex items-center gap-2 group relative z-50">
            <PonloeLogo size={40} />
            <span className="flex items-center">
              <span className="text-lg md:text-xl font-bold font-khmer tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">p</span>
              <span className="text-gray-500 font-normal text-lg md:text-xl font-khmer">.creative</span>
            </span>
          </a>

          <nav ref={navRef} className="hidden lg:flex items-center relative">
            <div className={`absolute left-0 top-0 bottom-0 w-8 rounded-l-full bg-gradient-to-r from-white/60 dark:from-gray-950/60 to-transparent pointer-events-none z-20 transition-opacity duration-200 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} />
            <div
              ref={navScrollRef}
              className="flex items-center relative bg-gray-100 dark:bg-white/5 p-1.5 rounded-full border border-gray-100 dark:border-white/5 overflow-x-auto scrollbar-hide max-w-[46vw] xl:max-w-none"
              style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              <div className="absolute top-1.5 bottom-1.5 rounded-full bg-gray-200 dark:bg-white/10 transition-all duration-500 ease-out" style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px`, opacity: indicatorStyle.opacity }} />
              {navLinks.map((link, index) => (
                <a key={link.name} href={link.href} ref={(el) => { itemsRef.current[index] = el }} onClick={(e) => navigateTo(e, link.href, link.key)} className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium font-khmer transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${activeSection === link.key ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{link.name}</a>
              ))}
            </div>
            <div className={`absolute right-0 top-0 bottom-0 w-8 rounded-r-full bg-gradient-to-l from-white/60 dark:from-gray-950/60 to-transparent pointer-events-none z-20 transition-opacity duration-200 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} />
          </nav>

          <div className="flex items-center gap-2 md:gap-4 relative z-50">
             <div className="relative" ref={langMenuRef}>
                 <button 
                   onClick={() => {
                     hapticTap();
                     setIsLangMenuOpen(!isLangMenuOpen);
                   }}
                   className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 transition-all text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                 >
                    <img src={currentFlag} alt={language} className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover" />
                    <span className="uppercase hidden md:inline">{languageName}</span>
                    <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isLangMenuOpen && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-scale-up origin-top-right">
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-white/5 mb-1 flex items-center gap-2 text-gray-600 dark:text-gray-500">
                          <Globe size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Select Language</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                          {languages.map((lang) => (
                              <button 
                                key={lang.code} 
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center justify-between w-full px-4 py-2 text-xs md:text-sm rounded-xl transition-colors font-khmer ${language === lang.code ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                              >
                                  <span className="flex items-center gap-3"><img src={lang.flag} alt={lang.label} className="w-5 h-5 rounded-full object-cover" /><span>{lang.label}</span></span>
                                  {language === lang.code && <Check size={14} />}
                              </button>
                          ))}
                        </div>
                     </div>
                 )}
             </div>

             <button onClick={() => { hapticTap(); onGetQuote?.(); }} className="hidden sm:flex group px-5 py-2.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold text-sm hover:scale-105 transition-all duration-300 items-center gap-2 font-khmer">
              {t("Get a Quote", "ស្នើសុំតម្លៃ")} <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </button>

            <div className="hidden sm:flex items-center gap-1">
              <ThemeToggle />
              <SoundToggle />
            </div>

            <button onClick={toggleMenu} className="lg:hidden text-gray-900 dark:text-white p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 bg-white dark:bg-gray-950 z-40 flex items-center justify-center transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm px-6 overflow-y-auto max-h-[calc(100dvh-6rem)] py-8">
          {mobileNavLinks.map((link, idx) => (
            <a key={link.name} href={link.href} onClick={(e) => navigateTo(e, link.href, link.key)} className={`text-3xl font-bold font-khmer text-gray-900 dark:text-white hover:text-indigo-400 transition-all transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${idx * 80}ms` }}>{link.name}</a>
          ))}
          <a href="/contact" onClick={(e) => navigateTo(e, '/contact', 'contact')} className={`w-full text-center px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg font-khmer shadow-xl transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${mobileNavLinks.length * 80}ms` }}>{t("Start a Project", "ចាប់ផ្តើមគម្រោង")}</a>
        </div>
      </div>
    </>
  );
};

export default Header;

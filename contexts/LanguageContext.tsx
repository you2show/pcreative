
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extended language support
type Language = 'en' | 'km' | 'fr' | 'ja' | 'ko' | 'de' | 'zh-CN' | 'es' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, km: string) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


const SUPPORTED_LANGUAGES: Language[] = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
const GOOGLE_LANGUAGES: Language[] = ['fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
const getLocalizedPath = (lang: Language) => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const start = segments[0] && SUPPORTED_LANGUAGES.includes(segments[0] as Language) ? 1 : 0;
  const rest = segments.slice(start).join('/');
  const suffix = rest ? `/${rest}` : '/';
  return `/${lang}${suffix}${window.location.search}${window.location.hash}`;
};
const GOOGLE_TRANSLATE_ELEMENT_ID = 'google_translate_element';
const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-script';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

let googleTranslateLoader: Promise<void> | null = null;

const ensureGoogleTranslateElement = () => {
  if (typeof document === 'undefined') return;
  if (!document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID)) {
    const element = document.createElement('div');
    element.id = GOOGLE_TRANSLATE_ELEMENT_ID;
    document.body.appendChild(element);
  }
};

const loadGoogleTranslateScript = () => {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.google?.translate?.TranslateElement) {
    ensureGoogleTranslateElement();
    if (!document.querySelector(`#${GOOGLE_TRANSLATE_ELEMENT_ID} .goog-te-gadget`)) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,km,fr,ja,ko,de,zh-CN,es,ar',
          autoDisplay: false,
        },
        GOOGLE_TRANSLATE_ELEMENT_ID
      );
    }
    return Promise.resolve();
  }

  if (googleTranslateLoader) return googleTranslateLoader;

  googleTranslateLoader = new Promise<void>((resolve, reject) => {
    ensureGoogleTranslateElement();

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,km,fr,ja,ko,de,zh-CN,es,ar',
            autoDisplay: false,
          },
          GOOGLE_TRANSLATE_ELEMENT_ID
        );
      }
      resolve();
    };

    const existingScript = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      googleTranslateLoader = null;
      reject(new Error('Failed to load Google Translate script'));
    };
    document.body.appendChild(script);
  });

  return googleTranslateLoader;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Helper to get cookie
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const setGoogleCookie = (lang: Language) => {
     // If it's a Google supported language (that we don't translate manually), set cookie
     if (GOOGLE_LANGUAGES.includes(lang)) {
         document.cookie = `googtrans=/en/${lang}; path=/;`;
     } else {
         // Clear cookie for EN/KM (Manual translation)
         document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
         document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
     }
  };

  // Helper: Update SEO Metadata
  const updateSEOMetadata = (lang: Language) => {
      if (lang === 'km') {
          document.title = "Ponloe Creative | ទទួលធ្វើវេបសាយ, កម្មវិធីទូរស័ព្ទ, និងរចនាប្លង់";
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
              metaDesc.setAttribute('content', 'ទទួលធ្វើវេបសាយ Mobile App រចនាក្រាហ្វិក និងប្លង់ស្ថាបត្យកម្ម ក្នុងតម្លៃសមរម្យ។ ក្រុមការងារជំនាញនៅភ្នំពេញ ផ្តល់ជូនដំណោះស្រាយល្អបំផុតសម្រាប់អាជីវកម្មរបស់អ្នក។');
          }
      } else {
          document.title = "Ponloe Creative | Web App, Design & Architecture Services in Cambodia";
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
              metaDesc.setAttribute('content', 'Leading creative agency in Phnom Penh offering Web Development, Mobile Apps, Architecture, and Graphic Design. We provide high-quality solutions for every budget.');
          }
      }
  };

  // INITIALIZATION
  useEffect(() => {
    // 1. Check URL Path first (e.g., /fr, /km)
    const path = window.location.pathname.split('/')[1] as Language;
    
    if (SUPPORTED_LANGUAGES.includes(path)) {
        setLanguageState(path);
        setGoogleCookie(path);
        updateSEOMetadata(path); // Update Title on Load
        if (GOOGLE_LANGUAGES.includes(path)) {
            void loadGoogleTranslateScript().catch(() => {});
        }
        // Ensure trailing slash exists only when at the language root (e.g. /en → /en/)
        // Do NOT rewrite sub-paths like /en/about → /en/ which would break deep links
        if (window.location.pathname === `/${path}`) {
             window.history.replaceState(null, '', getLocalizedPath(path));
        }
    } else {
        // If root "/" or invalid, default to 'en' or saved pref, then rewrite URL
        const savedLang = (localStorage.getItem('app_lang') as Language) || 'en';
        setLanguageState(savedLang);
        updateSEOMetadata(savedLang); // Update Title on Load
        
        // Rewrite URL to include the language prefix without dropping deep links.
        window.history.replaceState(null, '', getLocalizedPath(savedLang));
        setGoogleCookie(savedLang);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    const prevLang = language;
    setLanguageState(newLang);
    localStorage.setItem('app_lang', newLang);
    updateSEOMetadata(newLang); // Update Title Immediately

    // Update only the language segment and preserve the current page, query, and hash.
    window.history.pushState(null, '', getLocalizedPath(newLang));

    const isPrevGoogle = GOOGLE_LANGUAGES.includes(prevLang);
    const isNewGoogle = GOOGLE_LANGUAGES.includes(newLang);

    // Handling Google Translate Logic
    if (isNewGoogle) {
        setGoogleCookie(newLang);
        void loadGoogleTranslateScript()
          .catch(() => {})
          .finally(() => {
            setTimeout(() => window.location.reload(), 50);
          });
    } else {
        // Switching to Manual (EN/KM)
        setGoogleCookie(newLang);
        if (isPrevGoogle) {
            // If we were in Google mode, we MUST reload to remove the iframe/DOM injections
            setTimeout(() => window.location.reload(), 50);
        }
        // If switching EN <-> KM, no reload needed, React handles it instantly
    }
  };

  // The translation function
  const t = (en: string, km: string) => {
    return language === 'km' ? km : en;
  };

  const languageNames: Record<Language, string> = {
    'en': 'English',
    'km': 'ខ្មែរ',
    'fr': 'Français',
    'ja': '日本語',
    'ko': '한국어',
    'de': 'Deutsch',
    'zh-CN': '中文',
    'es': 'Español',
    'ar': 'العربية'
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageName: languageNames[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

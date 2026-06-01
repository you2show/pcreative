import { useState, useEffect, useCallback } from 'react';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const sectionPageRoutes: Record<string, string> = {
  portfolio: 'projects',
  insights: 'blog',
  team: 'company',
  estimator: 'contact',
};

const sectionRouteAliases: Record<string, string[]> = {
  portfolio: ['projects'],
  insights: ['blog'],
  team: ['company', 'about'],
  estimator: ['contact'],
};

const getLanguagePrefix = () => {
  const currentLang = window.location.pathname.split('/').filter(Boolean)[0];
  return currentLang && supportedLangs.includes(currentLang) ? `/${currentLang}` : '';
};

const getRouteSections = (section: string) => [section, ...(sectionRouteAliases[section] || [])];

const getPageRoute = (section: string) => sectionPageRoutes[section] || section;

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const toPath = (langPrefix: string, path: string) => `${langPrefix}${path}` || '/';

/**
 * Custom Hook សម្រាប់គ្រប់គ្រង Routing
 * 
 * @param section ឈ្មោះ Section (ឧទាហរណ៍៖ 'portfolio')
 * @param idPrefix បុព្វបទសម្រាប់ ID (ប្រសិនបើមាន)
 * @param usePathRouting កំណត់ឱ្យប្រើ Path-based routing ជំនួសឱ្យ Hash
 */
export const useRouter = (section: string, idPrefix: string = '', usePathRouting: boolean = false) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Helper: បំប្លែង Data ID ទៅជា URL ID
  const toUrlId = useCallback((dataId: string) => {
    if (!idPrefix) return dataId;
    return dataId.startsWith(idPrefix) ? dataId.substring(idPrefix.length) : dataId;
  }, [idPrefix]);

  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      if (usePathRouting) {
        // ១. Path-based routing: /section/slug, /lang/section/slug, or a page alias.
        const routeSections = getRouteSections(section);
        const escapedSections = routeSections.map(route => route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`\\/(?:${escapedSections.join('|')})\\/([^/]+)`);
        const match = regex.exec(pathname);
        
        if (match && match[1]) {
          setActiveId(safeDecodeURIComponent(match[1]));
        } else {
          setActiveId(null);
        }
      } else {
        // ២. Hash-based routing សម្រាប់ Section ផ្សេងៗ: #section/id
        const prefix = `#${section}/`;

        if (hash.startsWith(prefix)) {
          const urlId = hash.replace(prefix, '');
          setActiveId(urlId ? safeDecodeURIComponent(urlId) : null);
        } else {
          setActiveId(null);
        }
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [section, usePathRouting]);

  const openItem = useCallback((dataId: string) => {
    const urlId = encodeURIComponent(toUrlId(dataId));
    const langPrefix = getLanguagePrefix();

    if (usePathRouting) {
      // ប្តូរទៅជា Clean Path URL: /page/slug
      const newPath = toPath(langPrefix, `/${getPageRoute(section)}/${urlId}`);
      window.history.pushState({ section, id: urlId }, '', newPath);
      window.dispatchEvent(new Event('popstate'));
    } else {
      // ប្រើ Hash ធម្មតា: #section/id
      window.location.hash = `${section}/${urlId}`;
    }
  }, [section, toUrlId, usePathRouting]);

  const closeItem = useCallback(() => {
    const langPrefix = getLanguagePrefix();

    try {
        if (usePathRouting) {
          // ពេលបិទ ឱ្យត្រឡប់ទៅ page route វិញភ្លាមៗ
          const newUrl = toPath(langPrefix, `/${getPageRoute(section)}`);
          window.history.pushState(null, '', newUrl);
          window.dispatchEvent(new Event('popstate'));
          window.dispatchEvent(new Event('hashchange'));
        } else {
          // សម្រាប់ Hash ឱ្យត្រឡប់មក #section វិញ
          window.history.pushState(null, '', toPath(langPrefix, `/#${section}`));
          window.dispatchEvent(new Event('hashchange'));
        }
    } catch (e) {
        window.location.hash = section;
    }
  }, [section, usePathRouting]);

  return {
    activeId,
    openItem,
    closeItem
  };
};

/**
 * Hook សម្រាប់គ្រប់គ្រងការបើក Admin Login តាមរយៈ Hash #admin
 */
export const useAdminRouter = () => {
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    useEffect(() => {
        const checkHash = () => {
            setIsAdminOpen(window.location.hash === '#admin');
        };
        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    const closeAdmin = () => {
        try {
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch (e) {
            window.location.hash = '';
        }
        window.dispatchEvent(new Event('hashchange'));
    };

    return { isAdminOpen, closeAdmin };
};

import { useEffect } from 'react';

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
    section?: string;
  };
  jsonLd?: object | null;
}

const DEFAULT_TITLE = 'Ponloe Creative | ពន្លឺច្នៃប្រឌិត – Web Design, App & Digital Services Cambodia';
const DEFAULT_DESCRIPTION =
  'Ponloe Creative (ពន្លឺច្នៃប្រឌិត) – Cambodia\'s leading creative agency for website design, web app development, mobile apps, graphic design, UI/UX, Canva design, digital marketing, and architecture. Based in Phnom Penh.';
const DEFAULT_IMAGE =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuEcfaETv68lAV6WDzh7Gub7lzi2fwpPjmPmcq0EMklRIUB4K8t4rHJBcB7uAK_LMpvQnJpuFV8T_XjnDSoSEIII9FDpOFBU4i1hRpWCxYW5QQQmFoRTRneazGjdgZT8ZME6cDx652INDsd2s6FnV9DiiKyo40XwgHA5gRXn1QM0pD0gr440JEjV1pock/s1600/ponloe.jpg';
const DEFAULT_URL = 'https://ponloe.org/';
const JSON_LD_ID = 'dynamic-json-ld';

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const parts = selector.match(/\[(\w+[\w:]*?)=['"](.+?)['"]\]/);
    if (parts) el.setAttribute(parts[1], parts[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-dynamic]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.setAttribute('data-dynamic', '1');
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeLink(rel: string) {
  const el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-dynamic]`);
  if (el) el.remove();
}

function injectJsonLd(data: object) {
  let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = JSON_LD_ID;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd() {
  const el = document.getElementById(JSON_LD_ID);
  if (el) el.remove();
}

/**
 * useSEO – updates document <head> (title, meta tags, JSON-LD) for the current page.
 * Restores defaults on unmount so the main site head is preserved.
 */
export function useSEO(options: SEOOptions) {
  useEffect(() => {
    const { title, description, image, url, type = 'website', article, jsonLd } = options;

    const resolvedTitle = title || DEFAULT_TITLE;
    const resolvedDesc = description || DEFAULT_DESCRIPTION;
    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedUrl = url || DEFAULT_URL;

    // Page title
    document.title = resolvedTitle;

    // Primary meta
    setMeta('meta[name="description"]', 'content', resolvedDesc);
    setMeta('meta[name="title"]', 'content', resolvedTitle);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', resolvedTitle);
    setMeta('meta[property="og:description"]', 'content', resolvedDesc);
    setMeta('meta[property="og:image"]', 'content', resolvedImage);
    setMeta('meta[property="og:url"]', 'content', resolvedUrl);
    setMeta('meta[property="og:type"]', 'content', type);

    // Article-specific Open Graph tags
    if (type === 'article' && article) {
      if (article.publishedTime) {
        setMeta('meta[property="article:published_time"]', 'content', article.publishedTime);
      }
      if (article.author) {
        setMeta('meta[property="article:author"]', 'content', article.author);
      }
      if (article.section) {
        setMeta('meta[property="article:section"]', 'content', article.section);
      }
    }

    // Twitter
    setMeta('meta[property="twitter:title"]', 'content', resolvedTitle);
    setMeta('meta[property="twitter:description"]', 'content', resolvedDesc);
    setMeta('meta[property="twitter:image"]', 'content', resolvedImage);
    setMeta('meta[property="twitter:url"]', 'content', resolvedUrl);

    // Canonical
    setLink('canonical', resolvedUrl);

    // JSON-LD
    if (jsonLd) {
      injectJsonLd(jsonLd);
    } else {
      removeJsonLd();
    }

    // Restore defaults on unmount
    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[name="title"]', 'content', DEFAULT_TITLE);
      setMeta('meta[property="og:title"]', 'content', 'Ponloe Creative | ពន្លឺច្នៃប្រឌិត – Web, Design & Digital Services in Cambodia');
      setMeta('meta[property="og:description"]', 'content', 'Cambodia\'s #1 creative studio for websites, web apps, mobile apps, graphic design, Canva, branding & architecture. Affordable prices. Start your project today!');
      setMeta('meta[property="og:image"]', 'content', DEFAULT_IMAGE);
      setMeta('meta[property="og:url"]', 'content', DEFAULT_URL);
      setMeta('meta[property="og:type"]', 'content', 'website');
      setMeta('meta[property="twitter:title"]', 'content', 'Ponloe Creative | ពន្លឺច្នៃប្រឌិត – Web, Design & Digital Services Cambodia');
      setMeta('meta[property="twitter:description"]', 'content', 'Website design, web apps, graphic design, branding & architecture from Cambodia\'s top creative agency. Start your project today!');
      setMeta('meta[property="twitter:image"]', 'content', DEFAULT_IMAGE);
      setMeta('meta[property="twitter:url"]', 'content', DEFAULT_URL);
      removeLink('canonical');
      removeJsonLd();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.title,
    options.description,
    options.image,
    options.url,
    options.type,
    options.jsonLd,
  ]);
}

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '../types';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer - Renders Markdown/MDX content with GFM support
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert prose-indigo max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-gray-300 mb-4">{children}</ol>,
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            return isInline ? (
              <code className="bg-gray-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
            ) : (
              <pre className="bg-gray-900 border border-white/10 rounded-xl p-4 overflow-x-auto mb-4">
                <code className="text-sm text-gray-200">{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400 my-4">{children}</blockquote>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-xl my-4 w-full object-cover max-h-[400px]" loading="lazy" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-white/10 rounded-xl overflow-hidden">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="bg-gray-800 px-4 py-2 text-left text-sm font-semibold text-white border-b border-white/10">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2 text-sm text-gray-300 border-b border-white/5">{children}</td>,
          hr: () => <hr className="border-white/10 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

/**
 * BlogSEOHead - Injects SEO meta tags for blog posts
 */
export const BlogSEOHead: React.FC<{ post: Post }> = ({ post }) => {
  React.useEffect(() => {
    // Update document title
    const originalTitle = document.title;
    document.title = `${post.title} | Ponloe Creative Insights`;

    // Update/create meta tags
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', post.excerpt || post.title);
    setMeta('og:title', post.title, true);
    setMeta('og:description', post.excerpt || post.title, true);
    setMeta('og:type', 'article', true);
    if (post.coverImage) setMeta('og:image', post.coverImage, true);
    setMeta('article:published_time', post.date, true);
    if (post.category) setMeta('article:tag', post.category, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', post.title);
    setMeta('twitter:description', post.excerpt || post.title);

    return () => {
      document.title = originalTitle;
    };
  }, [post]);

  return null;
};

export default MarkdownRenderer;

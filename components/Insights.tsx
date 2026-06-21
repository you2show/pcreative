import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Calendar, Tag, X } from 'lucide-react';
import { Post } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import ScrollBackgroundText from './ScrollBackgroundText';
import RevealOnScroll from './RevealOnScroll';
import { ArticleDetailModal } from './TeamModals';
import { useRouter } from '../hooks/useRouter';

interface InsightsProps {
  showPopupOnMount?: boolean;
  usePathRouting?: boolean;
}

const Insights: React.FC<InsightsProps> = ({ showPopupOnMount = false, usePathRouting = false }) => {
  const { t } = useLanguage();
  const { insights = [], team = [] } = useData();

  // Use Router Hook for Posts: Section 'insights'
  const { activeId, openItem, closeItem } = useRouter('insights', '', usePathRouting);
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  const [isViewAllOpen, setIsViewAllOpen] = useState(showPopupOnMount || false);

  // Sync Router Active ID with Data (Support finding by ID or Slug)
  useEffect(() => {
      if (activeId && insights) {
          const found = insights.find(p => p.slug === activeId || p.id === activeId);
          setSelectedPost(found || null);
      } else {
          setSelectedPost(null);
      }
  }, [activeId, insights]);

  // Sync isViewAllOpen with showPopupOnMount prop
  useEffect(() => {
    setIsViewAllOpen(showPopupOnMount);
  }, [showPopupOnMount]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (selectedPost || isViewAllOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost, isViewAllOpen]);

  const handleAuthorClick = (authorId: string) => {
    const author = (team || []).find(t => t.id === authorId);
    if (author) {
      setSelectedPost(null);
      // Navigate to the team member's profile URL so Team's router opens the modal
      const slug = author.slug || author.id;
      const currentPath = window.location.pathname;
      const parts = currentPath.split('/');
      const currentLang = parts[1];
      const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
      const langPrefix = currentLang && supportedLangs.includes(currentLang) ? `/${currentLang}` : '';
      window.history.pushState({ section: 'team', id: slug }, '', `${langPrefix}/company/${slug}`);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const handleViewAllClick = () => {
    setIsViewAllOpen(true);
    if (usePathRouting) {
      const currentLang = window.location.pathname.split('/')[1];
      const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
      const langPrefix = currentLang && supportedLangs.includes(currentLang) ? `/${currentLang}` : '';
      window.history.pushState({ insightsOpen: true }, '', `${langPrefix}/blog`);
      window.dispatchEvent(new Event('popstate'));
    } else {
      window.location.hash = 'insights';
    }
  };

  const handleViewAllClose = () => {
    setIsViewAllOpen(false);
    closeItem();
  };

  const handleArticleDetailClose = () => {
    closeItem();
  };

  // Helper component to render Author Info on Card
  const AuthorBadge = ({ authorId }: { authorId: string }) => {
      const author = (team || []).find(t => t.id === authorId);
      if (!author) return null;
      return (
          <div className="flex items-center gap-2 group/author z-10 relative">
             <img 
                src={author.image} 
                alt={author.name} 
                className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-white/20 group-hover/author:border-indigo-400 transition-colors" 
             />
             <span className="text-xs text-gray-600 dark:text-gray-400 font-bold group-hover/author:text-indigo-300 transition-colors truncate max-w-[100px]">
                 {author.name}
             </span>
          </div>
      );
  };

  return (
    <section id="insights" className="py-24 bg-black relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Background Text */}
        <ScrollBackgroundText text="JOURNAL" className="top-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div className="max-w-2xl">
                <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-4 block font-khmer">{t('Our Journal', 'អត្ថបទរបស់យើង')}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-khmer">
                  {t('Insights &', 'ចំណេះដឹង &')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{t('Articles', 'អត្ថបទ')}</span>
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-khmer">
                    {t('Sharing knowledge, technology, and creative ideas.', 'ចែករំលែកចំណេះដឹង បច្ចេកវិទ្យា និងគំនិតច្នៃប្រឌិត។')}
                </p>
             </div>
             
             <button 
               onClick={handleViewAllClick}
               className="hidden md:flex items-center gap-2 text-gray-900 dark:text-white hover:text-indigo-400 transition-colors font-bold group font-khmer cursor-pointer"
             >
                {t('View All Posts', 'មើលអត្ថបទទាំងអស់')} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          {/* Display only first 3 items on the main page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(insights || []).slice(0, 3).map((post) => (
              <article 
                key={post.id} 
                className="group flex flex-col h-full glass-card border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => openItem(post.slug || post.id)}
              >
                {/* Image Container */}
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white backdrop-blur-sm text-black text-xs font-black uppercase tracking-widest flex items-center gap-1 border border-white/10">
                      <Tag size={12} /> {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Meta Row: Date & Author */}
                  <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-mono">
                        <Calendar size={12} />
                        <span>{post.date}</span>
                      </div>
                      <AuthorBadge authorId={post.authorId} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2 font-khmer">
                    {t(post.title, post.titleKm)}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 font-khmer">
                    {post.excerpt}
                  </p>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                     <button 
                       onClick={(e) => { e.stopPropagation(); openItem(post.slug || post.id); }}
                       className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-400 transition-colors font-khmer"
                     >
                       {t('Read Article', 'អានអត្ថបទ')} <ArrowRight size={16} />
                     </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 md:hidden text-center">
               <button 
                  onClick={handleViewAllClick}
                  className="inline-flex items-center gap-2 text-gray-900 dark:text-white hover:text-indigo-400 transition-colors font-bold font-khmer cursor-pointer"
               >
                {t('View All Posts', 'មើលអត្ថបទទាំងអស់')} <ArrowRight />
             </button>
          </div>
        </RevealOnScroll>
      </div>

      {/* "View All Posts" Full Screen Overlay */}
      {isViewAllOpen && createPortal(
         <div className="fixed inset-0 z-[10001] flex flex-col overflow-hidden bg-black">
              {/* Header */}
                <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-200 dark:border-white/10 bg-black shrink-0">
                     <div>
                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer">{t('All Articles', 'អត្ថបទទាំងអស់')}</h3>
                         <p className="text-gray-600 dark:text-gray-400 text-sm font-khmer">{t('Explore our latest thoughts and updates', 'ស្វែងរកគំនិត និងព័ត៌មានថ្មីៗរបស់យើង')}</p>
                     </div>
                     <button 
                         onClick={handleViewAllClose}
                         className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-full transition-all border border-gray-100 dark:border-white/5"
                     >
                         <X size={24} />
                     </button>
                 </div>

                 {/* Grid Content */}
                 <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {(insights || []).map((post) => (
                              <article 
                                 key={post.id} 
                                 className="group flex flex-col glass-card border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                 onClick={() => openItem(post.slug || post.id)}
                             >
                                 <div className="relative h-48 overflow-hidden">
                                     <img 
                                         src={post.image} 
                                         alt={post.title} 
                                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                     />
                                     <div className="absolute top-3 left-3">
                                         <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10">
                                             <Tag size={10} /> {post.category}
                                         </span>
                                     </div>
                                 </div>
                                 <div className="p-5 flex-1 flex flex-col">
                                      <div className="flex items-center justify-between mb-2">
                                         <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-mono">
                                             <Calendar size={12} />
                                             <span>{post.date}</span>
                                         </div>
                                         <AuthorBadge authorId={post.authorId} />
                                      </div>
                                     
                                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2 font-khmer">
                                         {t(post.title, post.titleKm)}
                                     </h3>
                                     <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 font-khmer">
                                         {post.excerpt}
                                     </p>
                                 </div>
                             </article>
                         ))}
                     </div>
                 </div>
         </div>,
         document.body
      )}

      {/* Reused Modals from Team Section for seamless experience */}
      {selectedPost && (
          <ArticleDetailModal 
            post={selectedPost}
            onClose={handleArticleDetailClose}
            onAuthorClick={handleAuthorClick}
          />
      )}
    </section>
  );
};

export default Insights;

 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/components/Hero/index.tsx b/components/Hero/index.tsx
index 8b5d9e0e638150027defe0b80563c1735a6f23e4..684881fa4bef3ae77588b24c5f9031d0cdbc4659 100644
b/components/Hero/index.tsx
@@ -105,96 +105,86 @@ const Hero: React.FC = () => {
       const posts = insights.filter(p => p.authorId === member.id);
       setAuthorPosts(posts);
   };
 
   return (
     <>
     <section ref={containerRef} id="home" aria-label="Hero section" className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden perspective-1000">
       
       {/* 3D Background Scene */}
       <Hero3DScene />
 
       {/* Background Ambience */}
       <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div 
             className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-60"
         />
         <div 
             className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] opacity-60"
         />
       </div>
 
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
         <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           
           {/* Left Content - Typography & CTA */}
          <div className="space-y-6 text-center lg:text-left relative z-20">
             {/* Badge */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md animate-fade-in group hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-default">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase font-khmer">
                   {t('Open for new projects', 'ទទួលគម្រោងថ្មីៗ')}
               </span>
             </div>
             
             {/* Main Headline */}
            <div className="relative space-y-3">
                 <div className="absolute -left-6 top-4 hidden h-28 w-28 rounded-full bg-indigo-500/15 blur-3xl dark:block" aria-hidden="true" />
                 <h1 className="hero-headline relative text-5xl sm:text-6xl md:text-7xl font-black leading-[1.02] tracking-[-0.045em] text-gray-950 dark:text-white font-khmer">
                     <span className="hero-line-reveal block">
                       {t('We Craft', 'យើងបង្កើត')}
                     </span>
                     <span className="hero-gradient-text relative inline-block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
                         <RotatingWord t={t} />
                     </span>
                     <span className="hero-subline block text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-500 dark:text-gray-300 tracking-[-0.01em]">
                         <ScrambleText
                           text={t('With Digital Perfection', 'ដោយភាពល្អឥតខ្ចោះ')}
                           delay={450}
                           duration={900}
                         />
                     </span>
                 </h1>
             </div>
            
            <p className="hero-copy text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-lg mx-auto lg:mx-0">
               {t(
                  'Premium digital products that feel simple, fast, and trustworthy.',
                  'ផលិតផលឌីជីថល premium ដែលសាមញ្ញ លឿន និងគួរឱ្យទុកចិត្ត។'
               )}
             </p>
             
             {/* Actions Component (Buttons & Stats) */}
             <HeroActions t={t} />
           </div>
           
           {/* Right Content - Visuals */}
           <Suspense fallback={<div className="min-h-[220px] lg:h-[600px] w-full" />}>
             <HeroVisuals team={team} onMemberClick={setSelectedMember} />
           </Suspense>
         </div>
       </div>
 
       {/* Modals */}
       {selectedMember && (
           <MemberDetailModal 
             member={selectedMember} 
             onClose={() => setSelectedMember(null)}
             onShowArticles={handleShowArticles}
           />
       )}
 
       {authorPosts && selectedMember && (
           <AuthorArticlesModal 
 
EOF
)

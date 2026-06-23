import React, { useEffect, useState, Suspense } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Services from './components/Services';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Insights from './components/Insights';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollButton from './components/ScrollButton';
import ScrollProgress from './components/ScrollProgress';
import FloatingChat from './components/FloatingChat';
import OfflinePage from './components/OfflinePage';
import InstallPrompt from './components/InstallPrompt';
import Stats from './components/Stats';
import FAQ from './components/FAQ';
import StickyCTA, { ConsultationModal } from './components/StickyCTA';
import ExitIntentPopup from './components/ExitIntentPopup';
import VideoShowreel from './components/VideoShowreel';
import Preloader from './components/Preloader';
import ChatbotAI from './components/ChatbotAI';
import SkipToContent from './components/SkipToContent';
import { SectionTransition } from './components/PageTransition';
import AnimatedBlurBackground from './components/AnimatedBlurBackground';
import { Lock, ArrowRight, X } from 'lucide-react';
import { useAdminRouter } from './hooks/useRouter';
import CinematicIntro from './components/CinematicIntro';
import CustomCursor from './components/CustomCursor';
import CelebrationSystem from './components/CelebrationSystem';
import { useEmotionalColors } from './hooks/useEmotionalColors';

// New homepage creative components
import WorkMarquee from './components/WorkMarquee';
import LiveStudioBar from './components/LiveStudioBar';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import CursorGallery from './components/CursorGallery';
import GlowCursor from './components/GlowCursor';
import ClientWins from './components/ClientWins';
import StudioLocation from './components/StudioLocation';
import ClosingCTA from './components/ClosingCTA';
import HomeVisualGateway from './components/HomeVisualGateway';
import HomeEssentials from './components/HomeEssentials';

// Pages
import Careers from './components/Careers';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';

// Lazy Load Heavy Components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const CostEstimator = React.lazy(() => import('./components/CostEstimator'));
const ClientPortal = React.lazy(() => import('./components/ClientPortal'));
const TeamPage = React.lazy(() => import('./components/TeamPage'));

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getPathWithoutLanguage = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const start = segments[0] && supportedLangs.includes(segments[0]) ? 1 : 0;
  const path = `/${segments.slice(start).join('/')}`;
  return path === '/' ? '/' : path.replace(/\/$/, '');
};


const ComponentFallback: React.FC = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-black">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-gray-600 dark:text-gray-400 text-sm font-khmer">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const [isViewingSite, setIsViewingSite] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showCinematicIntro, setShowCinematicIntro] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);

  // Popups state for legacy deep links only.
  const [shouldShowPortfolioPopup, setShouldShowPortfolioPopup] = useState(false);
  const [shouldShowServicesPopup, setShouldShowServicesPopup] = useState(false);
  const [shouldShowInsightsPopup, setShouldShowInsightsPopup] = useState(false);
  const [shouldShowTeamPopup, setShouldShowTeamPopup] = useState(false);
  const [shouldShowEstimatorPopup, setShouldShowEstimatorPopup] = useState(false);

  const { currentUser, logout, login } = useAuth();
  const { isAdminOpen, closeAdmin } = useAdminRouter();
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState(false);
  const { team } = useData();
  const { t } = useLanguage();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const { isDark } = useTheme();

  useEmotionalColors();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('ponloe_visited');
    if (hasVisited) {
      setShowPreloader(false);
    } else {
      const timer = setTimeout(() => {
        setShowPreloader(false);
        setShowCinematicIntro(true);
        sessionStorage.setItem('ponloe_visited', '1');
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
        const pathWithoutLang = getPathWithoutLanguage();
        const hash = window.location.hash;

        setShouldShowPortfolioPopup(pathWithoutLang === '/portfolio');
        setShouldShowServicesPopup(false);
        setShouldShowInsightsPopup(pathWithoutLang === '/insights');
        setShouldShowTeamPopup(false);
        setShouldShowEstimatorPopup(false);

        if (pathWithoutLang === '/services' || pathWithoutLang.startsWith('/services/')) {
            setActivePage('services');
        } else if (pathWithoutLang === '/projects' || pathWithoutLang.startsWith('/projects/') || pathWithoutLang === '/portfolio' || pathWithoutLang.startsWith('/portfolio/')) {
            setActivePage('projects');
        } else if (pathWithoutLang === '/company' || pathWithoutLang.startsWith('/company/') || hash === '#about') {
            setActivePage('company');
        } else if (pathWithoutLang === '/about' || pathWithoutLang.startsWith('/about/')) {
            setActivePage('about');
        } else if (pathWithoutLang === '/team' || pathWithoutLang.startsWith('/team/')) {
            setActivePage('team');
        } else if (pathWithoutLang === '/blog' || pathWithoutLang.startsWith('/blog/') || pathWithoutLang === '/insights' || pathWithoutLang.startsWith('/insights/')) {
            setActivePage('blog');
        } else if (pathWithoutLang === '/contact' || pathWithoutLang.startsWith('/contact/') || pathWithoutLang === '/estimator' || pathWithoutLang.startsWith('/estimator/')) {
            setActivePage('contact');
        } else if (hash === '#careers' || pathWithoutLang === '/careers') {
            setActivePage('careers');
        } else if (hash === '#privacy' || pathWithoutLang === '/privacy') {
            setActivePage('privacy');
        } else {
            setActivePage(null);
        }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
        window.removeEventListener('hashchange', handleRouteChange);
        window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const adminPin = import.meta.env.VITE_ADMIN_PIN || '1234';
      if (pin === adminPin) {
          login({ role: 'admin', name: 'Super Admin' });
          closeAdmin(); setPin(''); setIsViewingSite(false);
          return;
      }
      const foundMember = team.find(m => m.pinCode === pin);
      if (foundMember) {
          login({ role: 'member', id: foundMember.id, name: foundMember.name });
          closeAdmin(); setPin(''); setIsViewingSite(false);
          return;
      }
      setLoginError(true); setPin('');
      setTimeout(() => setLoginError(false), 500);
  };

  const PageHero = ({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent: string; description: string }) => (
    <section className="relative pt-32 pb-24 md:pt-56 md:pb-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <RevealOnScroll variant="fadeUp">
          <span className="text-brand-400 font-black tracking-[0.3em] uppercase text-xs mb-6 block font-khmer opacity-80">{eyebrow}</span>
          <h1 className="h1-premium font-black text-white leading-[0.9] tracking-tightest mb-10 font-khmer">
            <span>{title}</span> <br/>
            <span className="premium-text-gradient"><span>{accent}</span></span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl font-khmer leading-relaxed font-light">
            {description}
          </p>
        </RevealOnScroll>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[20%] -left-[5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>
    </section>
  );


  const renderHome = () => (
    <>
      {/* 1. Hero */}
      <Hero />
      {/* 2. Real-Time Activity Bar */}
      <LiveStudioBar />
      {/* 3. Work Marquee — dual-row proof in motion */}
      <WorkMarquee />
      {/* 4. Visual Gateway — reuse hidden page-entry section as an interactive homepage menu */}
      <SectionTransition delay={0.05} variant="revealMask"><HomeVisualGateway /></SectionTransition>
      {/* 5. Essentials — visual-only choices with almost no copy */}
      <SectionTransition delay={0.1} variant="cinematicRise"><HomeEssentials /></SectionTransition>
      {/* 6. Cursor Gallery — hover-preview portfolio effect */}
      <SectionTransition delay={0.15} variant="parallaxRight"><CursorGallery /></SectionTransition>
      {/* 7. Transformation Gallery — Before/After with category filters */}
      <SectionTransition delay={0.1} variant="revealMask"><BeforeAfterSlider /></SectionTransition>
      {/* 8. Client Wins — compact teaser (3 quotes) */}
      <SectionTransition delay={0.15} variant="cinematicRise"><ClientWins compact /></SectionTransition>
      {/* 9. Bold Closing CTA */}
      <SectionTransition delay={0.2} variant="depthPop"><ClosingCTA /></SectionTransition>
    </>
  );

  const renderServicesPage = () => (
    <>
      <PageHero
        eyebrow={t('What we build', 'អ្វីដែលយើងបង្កើត')}
        title={t('Services designed for', 'សេវាកម្មសម្រាប់')}
        accent={t('serious brands.', 'ម៉ាកយីហោផ្លូវការ')}
        description={t('Explore the creative, digital, architecture, and communication services that turn ideas into polished business systems.', 'ស្វែងយល់ពីសេវាកម្មឌីជីថល ច្នៃប្រឌិត ស្ថាបត្យកម្ម និងទំនាក់ទំនង ដែលបំលែងគំនិតទៅជាប្រព័ន្ធអាជីវកម្មមានគុណភាព។')}
      />
      <SectionTransition variant="slideLeft"><Services showPopupOnMount={shouldShowServicesPopup} usePathRouting={true} /></SectionTransition>
      <SectionTransition variant="slideRight"><Process /></SectionTransition>
      <SectionTransition variant="fadeScale"><FAQ /></SectionTransition>
    </>
  );

  const renderProjectsPage = () => (
    <>
      <PageHero
        eyebrow={t('Proof in motion', 'ភស្តុតាងក្នុងស្នាដៃ')}
        title={t('Projects that make', 'គម្រោងដែលធ្វើឲ្យ')}
        accent={t('people stop.', 'មនុស្សឈប់មើល')}
        description={t('A curated gallery of websites, brand systems, visuals, and digital products crafted for clarity, emotion, and measurable impact.', 'បណ្តុំស្នាដៃ website, brand, visual និង digital product ដែលរចនាឡើងសម្រាប់ភាពច្បាស់ អារម្មណ៍ និងលទ្ធផលពិត។')}
      />
      <SectionTransition variant="fadeBlur"><VideoShowreel /></SectionTransition>
      <SectionTransition variant="fadeScale"><Portfolio showPopupOnMount={shouldShowPortfolioPopup} usePathRouting={true} /></SectionTransition>
      <SectionTransition variant="slideLeft"><Testimonials /></SectionTransition>
    </>
  );

  const renderCompanyPage = () => (
    <>
      <PageHero
        eyebrow={t('The studio', 'ស្ទូឌីយោ')}
        title={t('A creative company with', 'ក្រុមហ៊ុនច្នៃប្រឌិតដែលមាន')}
        accent={t('real discipline.', 'វិន័យពិតប្រាកដ')}
        description={t('Meet the people, process, and principles behind Ponloe Creative, a Phnom Penh studio built for thoughtful digital work.', 'ស្គាល់មនុស្ស ដំណើរការ និងគោលការណ៍នៅពីក្រោយ Ponloe Creative ស្ទូឌីយោភ្នំពេញសម្រាប់ការងារឌីជីថលដែលគិតល្អិតល្អន់។')}
      />
      <SectionTransition variant="fadeScale"><Stats /></SectionTransition>
      <SectionTransition variant="fadeBlur"><Partners /></SectionTransition>
      <SectionTransition variant="fadeBlur"><Team showPopupOnMount={shouldShowTeamPopup} usePathRouting={true} /></SectionTransition>
      <SectionTransition variant="fadeUp"><StudioLocation /></SectionTransition>
    </>
  );

  const renderBlogPage = () => (
    <>
      <PageHero
        eyebrow={t('Studio journal', 'ទស្សនាវដ្តីស្ទូឌីយោ')}
        title={t('Ideas worth', 'គំនិតដែលគួរ')}
        accent={t('bookmarking.', 'រក្សាទុក')}
        description={t('Insights, guides, and creative notes from the team, written to help clients make smarter digital decisions.', 'អត្ថបទ ចំណេះដឹង និងកំណត់ចំណាំច្នៃប្រឌិតពីក្រុមការងារ ដើម្បីជួយអតិថិជនសម្រេចចិត្តឌីជីថលឲ្យឆ្លាតជាងមុន។')}
      />
      <SectionTransition variant="slideRight"><Insights showPopupOnMount={shouldShowInsightsPopup} usePathRouting={true} /></SectionTransition>
    </>
  );

  const renderContactPage = () => (
    <>
      <PageHero
        eyebrow={t('Start the conversation', 'ចាប់ផ្តើមការពិភាក្សា')}
        title={t('Tell us what you want', 'ប្រាប់យើងអ្វីដែលអ្នកចង់')}
        accent={t('to build.', 'បង្កើត')}
        description={t('Use the estimator, send a project brief, or contact the team directly. This is where ideas become a real plan.', 'ប្រើឧបករណ៍ប៉ាន់តម្លៃ ផ្ញើ brief គម្រោង ឬទាក់ទងក្រុមការងារដោយផ្ទាល់។ ទីនេះគឺជាកន្លែងដែលគំនិតក្លាយជាផែនការពិត។')}
      />
      <Suspense fallback={<div className="h-96 bg-gray-50 dark:bg-gray-900/50" />}>
        <SectionTransition variant="fadeScale"><CostEstimator showPopupOnMount={shouldShowEstimatorPopup} usePathRouting={true} /></SectionTransition>
      </Suspense>
      <SectionTransition variant="fadeUp"><Contact /></SectionTransition>
    </>
  );

  const renderAboutPage = () => (
    <>
      <PageHero
        eyebrow={t('The vision', 'ចក្ខុវិស័យ')}
        title={t('We don\'t just design.', 'យើងមិនគ្រាន់តែរចនា')}
        accent={t('We define.', 'យើងកំណត់')}
        description={t('Ponloe Creative is a digital alchemy lab where code meets art, and imagination becomes infrastructure.', 'Ponloe Creative គឺជាមន្ទីរពិសោធន៍គីមីសាស្ត្រឌីជីថល ដែលកូដជួបជាមួយសិល្បៈ ហើយការស្រមើលស្រមៃក្លាយជាហេដ្ឋារចនាសម្ព័ន្ធពិតប្រាកដ។')}
      />
      <SectionTransition variant="fadeScale">
        <About />
      </SectionTransition>
    </>
  );

  const renderCareersPage = () => (
    <>
      <PageHero
        eyebrow={t('Join our team', 'ចូលរួមក្រុមការងារ')}
        title={t('Work on things that', 'ធ្វើការលើអ្វីដែល')}
        accent={t('matter.', 'មានន័យ')}
        description={t('We are always looking for talented individuals passionate about design, technology, and innovation. Help us build the future of Cambodia\'s digital landscape.', 'យើងតែងតែស្វែងរកបុគ្គលដែលមានទេពកោសល្យ និងចំណង់ចំណូលចិត្តលើការរចនា បច្ចេកវិទ្យា និងការច្នៃប្រឌិត។')}
      />
      <SectionTransition variant="fadeScale">
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Careers />
        </div>
      </SectionTransition>
    </>
  );

  const renderMainContent = () => {
    if (activePage === 'services') return renderServicesPage();
    if (activePage === 'projects') return renderProjectsPage();
    if (activePage === 'company') return renderCompanyPage();
    if (activePage === 'about') return renderAboutPage();
    if (activePage === 'team') return (
      <Suspense fallback={<ComponentFallback />}>
        <TeamPage />
      </Suspense>
    );
    if (activePage === 'blog') return renderBlogPage();
    if (activePage === 'contact') return renderContactPage();
    if (activePage === 'careers') return renderCareersPage();
    return renderHome();
  };

  if (currentUser && !isViewingSite) {
      return (
        <Suspense fallback={<ComponentFallback />}>
          <AdminDashboard currentUser={currentUser} onLogout={logout} onViewSite={() => setIsViewingSite(true)} />
        </Suspense>
      );
  }

  return (
    <div className={`min-h-screen bg-black text-white overflow-x-hidden selection:bg-brand-500/30 selection:text-white relative`}>
      <SkipToContent />
      <div className="noise-overlay" />
      {showPreloader && <Preloader />}
      {showCinematicIntro && <CinematicIntro onComplete={() => setShowCinematicIntro(false)} />}
      <GlowCursor />
      <CelebrationSystem />
      <OfflinePage />
      <InstallPrompt />
      <ScrollProgress />

      <AnimatedBlurBackground />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_45%)]" />

      <Header onGetQuote={() => setIsConsultationOpen(true)} />

      <main id="main-content" className="relative z-10" role="main">
        {renderMainContent()}
      </main>

      <Footer hideCTA={activePage === 'home' || activePage === 'contact'} />
      <FloatingChat />
      <ChatbotAI />
      <ScrollButton />
      <StickyCTA onConsultationOpen={() => setIsConsultationOpen(true)} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      <ExitIntentPopup onConsultationOpen={() => setIsConsultationOpen(true)} />

      <Suspense fallback={null}>
        <ClientPortal isOpen={isClientPortalOpen} onClose={() => setIsClientPortalOpen(false)} />
      </Suspense>

      {activePage === 'privacy' && <PrivacyPolicy onClose={() => window.location.hash = ''} />}

      {isAdminOpen && (
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm relative z-[12001]">
                  <button onClick={closeAdmin} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
                  <div className="flex flex-col items-center mb-6">
                      <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 text-indigo-400"><Lock size={32} /></div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer">Access Control</h3>
                  </div>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus className={`w-full bg-gray-100 dark:bg-gray-800 border ${loginError ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`} placeholder="••••" maxLength={6} />
                      <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">Verify Identity <ArrowRight size={18} /></button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AccessibilityProvider>
          <DataProvider>
            <LanguageProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </LanguageProvider>
          </DataProvider>
        </AccessibilityProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

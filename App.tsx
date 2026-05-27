import React, { useEffect, useState, Suspense } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
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

// Pages
import About from './components/About';
import Careers from './components/Careers';
import PrivacyPolicy from './components/PrivacyPolicy';

// Lazy Load Heavy Components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const CostEstimator = React.lazy(() => import('./components/CostEstimator'));
const ClientPortal = React.lazy(() => import('./components/ClientPortal'));

const ComponentFallback: React.FC = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-950">
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
  
  // Popups state
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
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const { isDark } = useTheme();

  // Activate emotional color intelligence
  useEmotionalColors();

  // Hide preloader after first load, then show cinematic intro once per session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('ponloe_visited');
    if (hasVisited) {
      setShowPreloader(false);
    } else {
      const timer = setTimeout(() => {
        setShowPreloader(false);
        // Show cinematic intro right after preloader (first visit this session)
        setShowCinematicIntro(true);
        sessionStorage.setItem('ponloe_visited', '1');
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- ROUTING LOGIC ---
  useEffect(() => {
    const handleRouteChange = () => {
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        
        // Language prefix regex
        const langRegex = /^\/(en|km|fr|ja|ko|de|zh-CN|es|ar)?/;
        const pathWithoutLang = pathname.replace(langRegex, '');

        // Check for path-based popups (deep-linking support)
        // We use .startsWith and check for exactly the section or a subpath
        setShouldShowPortfolioPopup(pathWithoutLang === '/portfolio' || pathWithoutLang.startsWith('/portfolio/'));
        setShouldShowServicesPopup(pathWithoutLang === '/services' || pathWithoutLang.startsWith('/services/'));
        setShouldShowInsightsPopup(pathWithoutLang === '/insights' || pathWithoutLang.startsWith('/insights/'));
        setShouldShowTeamPopup(pathWithoutLang === '/team' || pathWithoutLang.startsWith('/team/'));
        setShouldShowEstimatorPopup(pathWithoutLang === '/estimator' || pathWithoutLang.startsWith('/estimator/'));

        // Check for hash-based or path-based pages
        if (hash === '#about' || pathWithoutLang === '/about') {
            setActivePage('about');
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

  if (currentUser && !isViewingSite) {
      return (
        <Suspense fallback={<ComponentFallback />}>
          <AdminDashboard currentUser={currentUser} onLogout={logout} onViewSite={() => setIsViewingSite(true)} />
        </Suspense>
      );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} overflow-x-hidden selection:bg-indigo-500 selection:text-white relative`}>
      <SkipToContent />
      {showPreloader && <Preloader />}
      {/* Cinematic intro — first visit this session only */}
      {showCinematicIntro && <CinematicIntro onComplete={() => setShowCinematicIntro(false)} />}
      {/* AI-powered cursor evolution */}
      <CustomCursor />
      {/* Celebration system (return visitor greeting + scroll badge) */}
      <CelebrationSystem />
      <OfflinePage />
      <InstallPrompt />
      <ScrollProgress />
      
      <AnimatedBlurBackground />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_45%)]" />
      
      <Header onGetQuote={() => setIsConsultationOpen(true)} />
      
      <main id="main-content" className="relative z-10" role="main">
        <Hero />
        <SectionTransition variant="fadeBlur"><Partners /></SectionTransition>
        <SectionTransition delay={0.1} variant="fadeScale"><Stats /></SectionTransition>
        
        <SectionTransition delay={0.1} variant="slideLeft">
          <Services 
              showPopupOnMount={shouldShowServicesPopup}
              usePathRouting={true}
          />
        </SectionTransition>

        <Suspense fallback={<div className="h-96 bg-gray-50 dark:bg-gray-900/50" />}>
          <SectionTransition variant="fadeScale">
            <CostEstimator 
              showPopupOnMount={shouldShowEstimatorPopup}
              usePathRouting={true}
            />
          </SectionTransition>
        </Suspense>

        <SectionTransition variant="slideRight"><Process /></SectionTransition>
        <SectionTransition variant="fadeBlur"><VideoShowreel /></SectionTransition>
        
        <SectionTransition variant="fadeScale">
          <Portfolio 
              showPopupOnMount={shouldShowPortfolioPopup} 
              usePathRouting={true} 
          />
        </SectionTransition>
        <SectionTransition variant="slideLeft"><Testimonials /></SectionTransition>

        <SectionTransition variant="fadeBlur">
          <Team 
              showPopupOnMount={shouldShowTeamPopup}
              usePathRouting={true}
          />
        </SectionTransition>

        <SectionTransition variant="slideRight">
          <Insights 
              showPopupOnMount={shouldShowInsightsPopup}
              usePathRouting={true}
          />
        </SectionTransition>

        <SectionTransition variant="fadeScale"><FAQ /></SectionTransition>
        <SectionTransition variant="fadeUp"><Contact /></SectionTransition>
      </main>
      
      <Footer />
      <FloatingChat />
      <ChatbotAI />
      <ScrollButton />
      <StickyCTA onConsultationOpen={() => setIsConsultationOpen(true)} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      <ExitIntentPopup onConsultationOpen={() => setIsConsultationOpen(true)} />
      
      {/* Client Portal */}
      <Suspense fallback={null}>
        <ClientPortal isOpen={isClientPortalOpen} onClose={() => setIsClientPortalOpen(false)} />
      </Suspense>
      
      {/* Overlay Pages */}
      {activePage === 'about' && <About onClose={() => { if (window.location.pathname.includes('/about')) { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } else { window.location.hash = ''; } }} />}
      {activePage === 'careers' && <Careers onClose={() => { if (window.location.pathname.includes('/careers')) { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } else { window.location.hash = ''; } }} />}
      {activePage === 'privacy' && <PrivacyPolicy onClose={() => window.location.hash = ''} />}
      
      {/* Admin Login Modal */}
      {isAdminOpen && (
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md overflow-hidden">
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

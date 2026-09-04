'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language } from '../types';
import { getDirection } from '../lib/i18n';
import { stripLocalePrefix } from '../lib/locale-router';
import { getNavPath } from '../lib/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import dynamic from 'next/dynamic';

const PathFinderAssessment = dynamic(
  () => import('./PathFinderAssessment').then((m) => m.PathFinderAssessment),
  { ssr: false }
);

import { I18nParityBanner } from './I18nParityBanner';
import { PhoneCall, Sparkles, Menu, Search } from './Icons';

// Create a context so page components can access global state and functions
export const AppContext = createContext<{
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}>({
  currentLang: 'fa',
  onNavigate: () => {},
  onOpenEvaluationModal: () => {},
});

export const useAppContext = () => useContext(AppContext);

export function AppLayout({ children, initialLang }: { children: React.ReactNode; initialLang?: Language }) {
  const [currentLang, setCurrentLang] = useState<Language>(initialLang || 'fa');
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const pathname = usePathname() || '/';
  const router = useRouter();

  // Derive activeRoute from pathname to keep compatibility with Header/Footer props
  const barePath = stripLocalePrefix(pathname);
  let activeRoute = barePath === '/' ? 'home' : barePath.substring(1);

  useEffect(() => {
    // Only synchronize currentLang if the Next.js pathname explicitly contains a locale prefix
    const explicitLocale = pathname.split('/')[1];

    if (explicitLocale === 'fa' || explicitLocale === 'en') {
      if (currentLang !== explicitLocale) {
        setCurrentLang(explicitLocale as Language);
      }
    }
    // If there is no explicit prefix (e.g. rewritten legacy route like /start-here),
    // we preserve the current authoritative language state (currentLang) and do not force a fallback to fa.
  }, [pathname, currentLang]);

  useEffect(() => {
    const dir = getDirection(currentLang);
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const handleLanguageChange = (newLang: Language) => {
    // Avoid transient state flashes before hard navigation
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname;
      const bare = stripLocalePrefix(currentUrl);
      const newPath = bare === '/' ? `/${newLang}` : `/${newLang}${bare}`;
      const searchAndHash = window.location.search + window.location.hash;
      window.location.assign(newPath + searchAndHash);
    }
  };

  const handleNavigate = (route: string) => {
    const targetPath = getNavPath(route, pathname);
    router.push(targetPath);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const contextValue = {
    currentLang,
    onNavigate: handleNavigate,
    onOpenEvaluationModal: () => setIsEvaluationModalOpen(true)
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col justify-between bg-[#f7f9fc] text-[#142033] font-sans selection:bg-[#2F6FED] selection:text-white pb-20 lg:pb-0">

        {/* Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
          onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
          mobileDrawerOpen={mobileDrawerOpen}
          onMobileDrawerOpenChange={setMobileDrawerOpen}
          searchDialogOpen={searchDialogOpen}
          onSearchDialogOpenChange={setSearchDialogOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 sm:pt-24">
          <I18nParityBanner currentLang={currentLang} routePath={pathname} />
          {children}
        </main>

        {/* Footer */}
        <Footer
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          onNavigate={handleNavigate}
        />

        {/* Mobile Sticky Bottom Navigation */}
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#071B3D]/97 backdrop-blur-md border-t border-white/10 shadow-2xl grid grid-cols-4 items-stretch"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          aria-label={currentLang === 'fa' ? 'ناوبری پایین صفحه' : 'Bottom navigation'}
        >
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-slate-300 hover:text-white cursor-pointer"
            aria-label={currentLang === 'fa' ? 'باز کردن منو' : 'Open menu'}
          >
            <Menu size={19} />
            <span className="text-[10px] font-semibold">{currentLang === 'fa' ? 'منو' : 'Menu'}</span>
          </button>

          <button
            onClick={() => setSearchDialogOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-slate-300 hover:text-white cursor-pointer"
            aria-label={currentLang === 'fa' ? 'جستجو' : 'Search'}
          >
            <Search size={19} />
            <span className="text-[10px] font-semibold">{currentLang === 'fa' ? 'جستجو' : 'Search'}</span>
          </button>

          <button
            onClick={() => setIsEvaluationModalOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] cursor-pointer"
            aria-label={currentLang === 'fa' ? 'فرم ارزیابی رایگان' : 'Free Assessment'}
          >
            <span className="absolute top-1 flex items-center justify-center w-9 h-9 rounded-full bg-[#2F6FED] shadow-lg -translate-y-2.5">
              <Sparkles size={16} className="text-white" />
            </span>
            <span className="text-[10px] font-extrabold text-[#5B93F5] mt-4">
              {currentLang === 'fa' ? 'ارزیابی رایگان' : 'Assessment'}
            </span>
          </button>

          <button
            onClick={() => handleNavigate('contact')}
            className="flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-slate-300 hover:text-white cursor-pointer"
            aria-label={currentLang === 'fa' ? 'تماس با ما' : 'Contact us'}
          >
            <PhoneCall size={19} />
            <span className="text-[10px] font-semibold">{currentLang === 'fa' ? 'تماس' : 'Contact'}</span>
          </button>
        </nav>

        {/* Evaluation Modal — DORVIA PathFinder assessment (replaces the old
            3-step LeadForm as of the PathFinder Phase 1 rollout; see
            claude/dorvia-pathfinder-full-spec-v1-2026-09-04.md). Every
            existing entry point above (Header, Footer, mobile nav) and every
            <EvaluationCTA> on any page all just call onOpenEvaluationModal(),
            so this single swap upgrades all of them at once. */}
        {isEvaluationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-[#dfe6ef]">
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 w-9 h-9 rounded-full bg-[#eef3f8] hover:bg-slate-200 text-[#142033] flex items-center justify-center text-lg font-bold transition-colors cursor-pointer border border-[#dfe6ef]"
                aria-label="Close modal"
              >
                ×
              </button>
              <div className="p-2 sm:p-4">
                <PathFinderAssessment
                  currentLang={currentLang}
                  isModal={true}
                  onSuccess={() => setIsEvaluationModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </AppContext.Provider>
  );
}

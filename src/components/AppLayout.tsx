'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language } from '../types';
import { getDirection } from '../lib/i18n';
import { getLocalizedRoute } from '../lib/locale-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { LeadForm } from './LeadForm';
import { PhoneCall, Sparkles } from './Icons';

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
  
  const pathname = usePathname() || '/';
  const router = useRouter();

  // Derive activeRoute from pathname to keep compatibility with Header/Footer props
  let activeRoute = pathname === '/' ? 'home' : pathname.substring(1);

  useEffect(() => {
    const dir = getDirection(currentLang);
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    document.body.style.fontFamily = currentLang === 'fa' ? "'Vazirmatn', sans-serif" : "'Manrope', sans-serif";
  }, [currentLang]);

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    // Route-specific correction for About, Contact, and Home migration
    if (pathname === '/about' || pathname === '/fa/about' || pathname === '/en/about') {
      const result = getLocalizedRoute('/about', newLang);
      if (result.status === 'success') {
        router.push(result.path);
      }
    }
    else if (pathname === '/contact' || pathname === '/fa/contact' || pathname === '/en/contact') {
      const result = getLocalizedRoute('/contact', newLang);
      if (result.status === 'success') {
        router.push(result.path);
      }
    }
    else if (pathname === '/' || pathname === '/fa' || pathname === '/en' || pathname === '/fa/' || pathname === '/en/') {
      const result = getLocalizedRoute('/', newLang);
      if (result.status === 'success') {
        router.push(result.path);
      }
    }
  };

  const handleNavigate = (route: string) => {
    const targetPath = route === 'home' ? '/' : `/${route}`;
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
      <div className="min-h-screen flex flex-col justify-between bg-[#f7f9fc] text-[#142033] font-sans selection:bg-[#2F6FED] selection:text-white pb-16 lg:pb-0">
        
        {/* Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
          onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 sm:pt-24">
          {children}
        </main>

        {/* Footer */}
        <Footer
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          onNavigate={handleNavigate}
        />

        {/* Mobile Sticky Action Bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#071B3D]/95 backdrop-blur-md border-t border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl max-h-[64px]">
          <button
            onClick={() => handleNavigate('contact')}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center space-x-1.5 rtl:space-x-reverse border border-white/15 cursor-pointer"
          >
            <PhoneCall size={14} className="text-[#2F6FED]" />
            <span>{currentLang === 'fa' ? 'تماس / مشاوره' : 'Call Advisory'}</span>
          </button>

          <button
            onClick={() => setIsEvaluationModalOpen(true)}
            className="flex-1 bg-[#2F6FED] hover:bg-[#1A5BB8] text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center space-x-1.5 rtl:space-x-reverse shadow-md cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{currentLang === 'fa' ? 'فرم ارزیابی رایگان' : 'Free Assessment'}</span>
          </button>
        </div>

        {/* Evaluation Modal */}
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
                <LeadForm
                  currentLang={currentLang}
                  isModal={true}
                  onSuccess={() => {
                    setTimeout(() => setIsEvaluationModalOpen(false), 2500);
                  }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </AppContext.Provider>
  );
}

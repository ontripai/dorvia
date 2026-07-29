import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { getDirection } from './lib/i18n';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MainContent } from './components/MainContent';
import { LeadForm } from './components/LeadForm';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fa');
  const [activeRoute, setActiveRoute] = useState('home');
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  // Sync document root dir & lang attributes on language switch
  useEffect(() => {
    const dir = getDirection(currentLang);
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    document.body.style.fontFamily = currentLang === 'fa' ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  }, [currentLang]);

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
  };

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-900 selection:bg-[#002B7F] selection:text-white">
      
      {/* Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <MainContent
          currentLang={currentLang}
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
          onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
      />

      {/* Evaluation Modal Popup */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setIsEvaluationModalOpen(false)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xl font-bold transition-colors"
              aria-label="Close modal"
            >
              ✕
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
  );
}

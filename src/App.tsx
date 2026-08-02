'use client';

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { getDirection } from './lib/i18n';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MainContent } from './components/MainContent';
import { LeadForm } from './components/LeadForm';
import { PhoneCall, Sparkles } from './components/Icons';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fa');
  const [activeRoute, setActiveRoute] = useState('home');
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  useEffect(() => {
    const dir = getDirection(currentLang);
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    document.body.style.fontFamily = currentLang === 'fa' ? "'Vazirmatn', sans-serif" : "'Manrope', sans-serif";
  }, [currentLang]);

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
  };

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
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

      {/* Mobile Sticky Action Bar (Max height 64px, safe area insets) */}
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
          <span>{currentLang === 'fa' ? 'ارزیابی رایگان' : 'Free Assessment'}</span>
        </button>
      </div>

      {/* Interactive Multi-Step Evaluation Modal */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-[#dfe6ef]">
            <button
              onClick={() => setIsEvaluationModalOpen(false)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 w-9 h-9 rounded-full bg-[#eef3f8] hover:bg-slate-200 text-[#142033] flex items-center justify-center text-lg font-bold transition-colors cursor-pointer border border-[#dfe6ef]"
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

import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeRoute,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const t = getTranslations(currentLang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'immigration', label: t.nav.immigration },
    { id: 'study', label: t.nav.study },
    { id: 'work', label: t.nav.work },
    { id: 'company', label: t.nav.company },
    { id: 'living', label: t.nav.living },
    { id: 'universities', label: t.nav.universities },
    { id: 'cities', label: t.nav.cities },
    { id: 'services', label: t.nav.services },
    { id: 'about-romania', label: t.nav.aboutRomania },
    { id: 'articles', label: t.nav.articles },
    { id: 'about', label: t.nav.aboutUs },
    { id: 'contact', label: t.nav.contact }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Romanian Flag Tricolor Bar */}
      <div className="h-1.5 w-full flex">
        <div className="bg-[#002B7F] w-1/3" />
        <div className="bg-[#FCD116] w-1/3" />
        <div className="bg-[#CE1126] w-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002B7F] to-[#0038A8] text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="text-[#FCD116]">D</span>R
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-tight group-hover:text-[#002B7F] transition-colors">
                {t.brand.name}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Dar Romania | In Romania
              </span>
            </div>
          </div>

          {/* Desktop Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 rtl:space-x-reverse">
            {navItems.slice(0, 9).map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'text-[#002B7F] bg-blue-50/80 font-bold border-b-2 border-[#002B7F]'
                      : 'text-slate-700 hover:text-[#002B7F] hover:bg-slate-50'
                  }`}

                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />

            <button
              onClick={onOpenEvaluationModal}
              className="bg-[#002B7F] hover:bg-[#002266] text-white px-4 py-2.5 rounded-xl font-semibold text-xs xl:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span className="w-2 h-2 rounded-full bg-[#FCD116] animate-pulse"></span>
              <span>{t.nav.freeEvaluation}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse lg:hidden">
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:text-[#002B7F] hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-start px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeRoute === item.id
                  ? 'bg-blue-50 text-[#002B7F] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}

            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEvaluationModal();
              }}
              className="w-full bg-[#002B7F] text-white py-3 rounded-xl font-semibold text-center text-sm shadow-md flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span className="w-2 h-2 rounded-full bg-[#FCD116]"></span>
              <span>{t.nav.freeEvaluation}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

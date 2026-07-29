'use client';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE5EE] shadow-sm transition-all">
      {/* 4px Top Romanian Tricolor Line */}
      <div className="romania-tricolor-bar">
        <div />
        <div />
        <div />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Area */}
          <div 
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#071E3D] text-white flex items-center justify-center font-black text-lg shadow-sm border border-slate-700 relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col">
                <div className="h-1/3 bg-[#0038A8]" />
                <div className="h-1/3 bg-[#FCD116]" />
                <div className="h-1/3 bg-[#CE1126]" />
              </div>
              <span className="text-white">D</span>
              <span className="text-[#FCD116]">R</span>
            </div>

            <div>
              <span className="text-lg sm:text-xl font-bold text-[#122033] tracking-tight block leading-snug group-hover:text-[#0038A8] transition-colors">
                {t.brand.name}
              </span>
              <span className="text-[11px] text-[#516174] font-medium block">
                {t.brand.subtitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 rtl:space-x-reverse">
            {navItems.slice(0, 9).map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-medium transition-all duration-150 relative ${
                    isActive
                      ? 'text-[#0038A8] font-bold'
                      : 'text-[#122033] hover:text-[#0038A8]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FCD116] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />

            <button
              onClick={onOpenEvaluationModal}
              className="bg-[#0038A8] hover:bg-[#002B7F] text-white px-4 py-2.5 rounded-xl font-bold text-xs xl:text-sm shadow-sm hover:shadow transition-all flex items-center space-x-2 rtl:space-x-reverse border border-[#002B7F]"
            >
              <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
              <span>{t.nav.freeEvaluation}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse lg:hidden">
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#122033] hover:text-[#0038A8] hover:bg-slate-100 transition-colors"
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DDE5EE] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-start px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeRoute === item.id
                  ? 'bg-blue-50 text-[#0038A8] font-bold'
                  : 'text-[#122033] hover:bg-slate-50'
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
              className="w-full bg-[#0038A8] text-white py-3 rounded-xl font-bold text-center text-sm shadow-sm flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
              <span>{t.nav.freeEvaluation}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

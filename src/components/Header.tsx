'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { DesktopMegaMenu } from './DesktopMegaMenu';
import { ChevronDown, Menu, X } from './Icons';

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
  const [activeMegaMenu, setActiveMegaMenu] = useState<'immigration' | 'romania' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'immigration', label: currentLang === 'fa' ? 'مهاجرت' : 'Immigration', megaMenu: 'immigration' as const },
    { id: 'study', label: currentLang === 'fa' ? 'تحصیل' : 'Study' },
    { id: 'work', label: currentLang === 'fa' ? 'کار' : 'Work' },
    { id: 'company', label: currentLang === 'fa' ? 'کسب‌وکار' : 'Business' },
    { id: 'living', label: currentLang === 'fa' ? 'زندگی در رومانی' : 'Living in Romania' },
    { id: 'about-romania', label: currentLang === 'fa' ? 'رومانی را بشناسید' : 'Discover Romania', megaMenu: 'romania' as const },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.megaMenu) {
      setActiveMegaMenu(activeMegaMenu === item.megaMenu ? null : item.megaMenu);
    } else {
      setActiveMegaMenu(null);
      onNavigate(item.id);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#dfe6ef] h-[80px] flex flex-col justify-between transition-all duration-300">
      
      {/* 4px Top Romanian Tricolor Line */}
      <div className="romania-tricolor-bar">
        <div />
        <div />
        <div />
      </div>

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Brand Logo Mark */}
        <div 
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          onClick={() => {
            setActiveMegaMenu(null);
            onNavigate('home');
          }}
        >
          {/* Polished Logo: Letter D + Letter R + 3 vertical color bars */}
          <div className="w-10 h-10 rounded-xl bg-[#06162d] text-white flex items-center justify-center font-black text-lg shadow-sm border border-[#0038a8]/30 relative overflow-hidden group-hover:scale-105 transition-transform">
            <div className="absolute top-0 bottom-0 left-0 w-1.5 flex flex-col">
              <div className="h-1/3 bg-[#0038a8]" />
              <div className="h-1/3 bg-[#fcd116]" />
              <div className="h-1/3 bg-[#ce1126]" />
            </div>
            <span className="text-white ml-0.5">D</span>
            <span className="text-[#fcd116]">R</span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#142033] group-hover:text-[#0038a8] transition-colors leading-tight">
              در رومانی
            </span>
            <span className="text-[10px] text-[#526174] tracking-widest uppercase font-semibold">
              DAR ROMANIA
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7 rtl:space-x-reverse text-xs font-semibold text-[#142033]">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id || (item.megaMenu && activeMegaMenu === item.megaMenu);
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-1.5 rtl:space-x-reverse py-2 transition-colors cursor-pointer ${
                    isActive ? 'text-[#0038a8] font-bold' : 'hover:text-[#0038a8]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.megaMenu && <ChevronDown size={14} className="text-[#788697]" />}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Right Desktop Header Actions */}
        <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
          
          {/* Language Switch: FA | EN */}
          <div className="flex items-center p-1 rounded-xl bg-[#eef3f8] border border-[#dfe6ef]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'fa' ? 'bg-[#0038a8] text-white shadow-xs' : 'text-[#142033] hover:text-[#0038a8]'
              }`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'en' ? 'bg-[#0038a8] text-white shadow-xs' : 'text-[#142033] hover:text-[#0038a8]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Primary Header CTA in Romanian Blue */}
          <button
            onClick={onOpenEvaluationModal}
            className="bg-[#0038a8] hover:bg-[#1554bd] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {currentLang === 'fa' ? 'ارزیابی رایگان' : 'Free Assessment'}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse lg:hidden">
          <div className="flex items-center p-0.5 rounded-lg bg-[#eef3f8] border border-[#dfe6ef] text-[11px]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-2 py-0.5 rounded font-bold ${currentLang === 'fa' ? 'bg-[#0038a8] text-white' : 'text-[#142033]'}`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded font-bold ${currentLang === 'en' ? 'bg-[#0038a8] text-white' : 'text-[#142033]'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={onOpenEvaluationModal}
            className="bg-[#0038a8] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
          >
            {currentLang === 'fa' ? 'ارزیابی' : 'Audit'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#eef3f8] text-[#142033] border border-[#dfe6ef] cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Render Active Desktop Mega Menu */}
      {activeMegaMenu && (
        <DesktopMegaMenu
          type={activeMegaMenu}
          currentLang={currentLang}
          onNavigate={(route) => {
            setActiveMegaMenu(null);
            onNavigate(route);
          }}
          onClose={() => setActiveMegaMenu(null)}
          onOpenEvaluationModal={onOpenEvaluationModal}
        />
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#dfe6ef] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(item.id);
              }}
              className={`w-full text-start px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeRoute === item.id ? 'bg-blue-50 text-[#0038a8] font-bold' : 'text-[#142033] hover:bg-[#eef3f8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

    </header>
  );
};

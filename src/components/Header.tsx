'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { DesktopMegaMenu } from './DesktopMegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { Button } from './Button';
import { ChevronDown, Menu } from './Icons';

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
  const [activeMegaMenu, setActiveMegaMenu] = useState<'immigration' | 'study' | 'business' | 'romania' | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const primaryNavItems = [
    { id: 'immigration', label: currentLang === 'fa' ? 'مهاجرت' : 'Immigration', megaMenu: 'immigration' as const },
    { id: 'study', label: currentLang === 'fa' ? 'تحصیل' : 'Study', megaMenu: 'study' as const },
    { id: 'work', label: currentLang === 'fa' ? 'کار' : 'Work' },
    { id: 'company', label: currentLang === 'fa' ? 'کسب‌وکار' : 'Business', megaMenu: 'business' as const },
    { id: 'living', label: currentLang === 'fa' ? 'زندگی در رومانی' : 'Living in Romania' },
    { id: 'about-romania', label: currentLang === 'fa' ? 'شناخت رومانی' : 'Discover Romania', megaMenu: 'romania' as const },
  ];

  const handleNavClick = (item: typeof primaryNavItems[0]) => {
    if (item.megaMenu) {
      setActiveMegaMenu(activeMegaMenu === item.megaMenu ? null : item.megaMenu);
    } else {
      setActiveMegaMenu(null);
      onNavigate(item.id);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#dfe6ef] h-[80px] flex flex-col justify-between transition-all duration-300">
      
      {/* 4px Top Romanian Tricolor Signature */}
      <div className="romania-tricolor-bar">
        <div />
        <div />
        <div />
      </div>

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Brand Logo Wordmark & Symbol */}
        <div 
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          onClick={() => {
            setActiveMegaMenu(null);
            onNavigate('home');
          }}
        >
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
              {currentLang === 'fa' ? 'در رومانی' : 'IN ROMANIA'}
            </span>
            <span className="text-[10px] text-[#788697] tracking-widest uppercase font-semibold">
              {currentLang === 'fa' ? 'راهنمای تحصیل، کار و زندگی' : 'Study • Work • Business • Life'}
            </span>
          </div>
        </div>

        {/* Primary Desktop Navigation (Max 6 Items) */}
        <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse text-xs font-semibold text-[#142033]">
          {primaryNavItems.map((item) => {
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
          
          {/* Segmented Language Switcher (36px height) */}
          <div className="flex items-center h-[36px] p-0.5 rounded-xl bg-[#eef3f8] border border-[#dfe6ef]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-3 py-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'fa' ? 'bg-[#0038a8] text-white shadow-xs' : 'text-[#06162d] hover:text-[#0038a8]'
              }`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'en' ? 'bg-[#0038a8] text-white shadow-xs' : 'text-[#06162d] hover:text-[#0038a8]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Primary Header CTA */}
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenEvaluationModal}
          >
            {currentLang === 'fa' ? 'ارزیابی رایگان' : 'Free Assessment'}
          </Button>

        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse lg:hidden">
          <div className="flex items-center h-[32px] p-0.5 rounded-lg bg-[#eef3f8] border border-[#dfe6ef] text-[11px]">
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

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenEvaluationModal}
            className="!px-3 !py-1 !text-[11px] !min-h-[32px]"
          >
            {currentLang === 'fa' ? 'ارزیابی' : 'Audit'}
          </Button>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl bg-[#eef3f8] text-[#142033] border border-[#dfe6ef] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        </div>

      </div>

      {/* Render Desktop Mega Menu */}
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

      {/* Render Mobile Drawer */}
      {mobileDrawerOpen && (
        <MobileDrawer
          currentLang={currentLang}
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          onClose={() => setMobileDrawerOpen(false)}
          onOpenEvaluationModal={onOpenEvaluationModal}
        />
      )}

    </header>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { DesktopMegaMenu } from './DesktopMegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { SearchDialog } from './SearchDialog';
import { Button } from './Button';
import { ChevronDown, Menu, Search } from './Icons';
import Image from 'next/image';

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
  const [activeMegaMenu, setActiveMegaMenu] = useState<'starthere' | 'immigration' | 'study' | 'work' | 'business' | 'needs' | 'romania' | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // EXACT 8 PRIMARY NAVIGATION ITEMS
  const primaryNavItems = [
    { id: 'start-here', label: currentLang === 'fa' ? 'شروع از اینجا' : 'Start Here', megaMenu: 'starthere' as const },
    { id: 'immigration', label: currentLang === 'fa' ? 'مهاجرت' : 'Immigration', megaMenu: 'immigration' as const },
    { id: 'study', label: currentLang === 'fa' ? 'تحصیل' : 'Study', megaMenu: 'study' as const },
    { id: 'work', label: currentLang === 'fa' ? 'کار' : 'Work', megaMenu: 'work' as const },
    { id: 'company', label: currentLang === 'fa' ? 'کسب‌وکار' : 'Business', megaMenu: 'business' as const },
    { id: 'needs', label: currentLang === 'fa' ? 'نیازها در رومانی' : 'Essentials in Romania', megaMenu: 'needs' as const },
    { id: 'romania', label: currentLang === 'fa' ? 'رومانی' : 'Romania', megaMenu: 'romania' as const },
    { id: 'about', label: currentLang === 'fa' ? 'درباره ما' : 'About Us' },
  ];

  const handleNavClick = (item: typeof primaryNavItems[0]) => {
    if (item.megaMenu) {
      setActiveMegaMenu(activeMegaMenu === item.megaMenu ? null : item.megaMenu);
    } else {
      setActiveMegaMenu(null);
    }
    // Always navigate to the hub page, even if it has a mega menu
    onNavigate(item.id);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#dfe6ef] h-[80px] flex flex-col justify-between transition-all duration-300">
      
      {/* Removed Romanian Tricolor Signature */}

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Brand Logo Wordmark & Symbol */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          onClick={() => {
            setActiveMegaMenu(null);
          }}
        >
          <img src="/images/logo/dorvia-logo-primary-transparent-3000.png" alt="DORVIA" className="h-[32px] sm:h-[36px] w-auto group-hover:scale-105 transition-transform" />

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#142033] group-hover:text-[#2F6FED] transition-colors leading-tight">
              {currentLang === 'fa' ? t.brand.siteName : t.brand.siteName.toUpperCase()}
            </span>
            <span className="text-[10px] text-[#788697] tracking-widest uppercase font-semibold">
              {currentLang === 'fa' ? 'راهنمای تحصیل، کار و زندگی' : 'Study • Work • Business • Life'}
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation (Exact 6 Items) */}
        <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse text-xs font-semibold text-[#142033]">
          {primaryNavItems.map((item) => {
            const isActive = activeRoute === item.id || (item.megaMenu && activeMegaMenu === item.megaMenu);
            return (
              <div key={item.id} className="relative">
                <Link
                  href={`/${item.id === 'home' ? '' : item.id}`}
                  onClick={() => {
                    if (item.megaMenu) {
                      setActiveMegaMenu(activeMegaMenu === item.megaMenu ? null : item.megaMenu);
                    } else {
                      setActiveMegaMenu(null);
                    }
                  }}
                  className={`flex items-center space-x-1.5 rtl:space-x-reverse py-2 transition-colors cursor-pointer ${
                    isActive ? 'text-[#2F6FED] font-bold' : 'hover:text-[#2F6FED]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.megaMenu && <ChevronDown size={14} className="text-[#788697]" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right Desktop Header Actions & Utilities */}
        <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse">
          
          {/* Functional Search Button */}
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="p-2 rounded-xl bg-[#eef3f8] text-[#142033] hover:bg-[#dfe6ef] transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center border border-[#dfe6ef]"
            aria-label="Search"
            title={currentLang === 'fa' ? 'جستجو' : 'Search'}
          >
            <Search size={18} className="text-[#2F6FED]" />
          </button>

          {/* Segmented Language Switcher (36px height) */}
          <div className="flex items-center h-[36px] p-0.5 rounded-xl bg-[#eef3f8] border border-[#dfe6ef]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-3 py-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'fa' ? 'bg-[#2F6FED] text-white shadow-xs' : 'text-[#071B3D] hover:text-[#2F6FED]'
              }`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'en' ? 'bg-[#2F6FED] text-white shadow-xs' : 'text-[#071B3D] hover:text-[#2F6FED]'
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
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="p-2 rounded-lg bg-[#eef3f8] text-[#142033] border border-[#dfe6ef] min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Search size={18} className="text-[#2F6FED]" />
          </button>

          <div className="flex items-center h-[32px] p-0.5 rounded-lg bg-[#eef3f8] border border-[#dfe6ef] text-[11px]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-2 py-0.5 rounded font-bold ${currentLang === 'fa' ? 'bg-[#2F6FED] text-white' : 'text-[#142033]'}`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded font-bold ${currentLang === 'en' ? 'bg-[#2F6FED] text-white' : 'text-[#142033]'}`}
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

      {/* Render Modal Search Dialog Overlay */}
      {searchDialogOpen && (
        <SearchDialog
          currentLang={currentLang}
          onClose={() => setSearchDialogOpen(false)}
          onNavigate={onNavigate}
        />
      )}

    </header>
  );
};

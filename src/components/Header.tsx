'use client';

import React, { useState } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { usePathname } from 'next/navigation';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { getNavPath } from '../lib/navigation';
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
  mobileDrawerOpen: boolean;
  onMobileDrawerOpenChange: (open: boolean) => void;
  searchDialogOpen: boolean;
  onSearchDialogOpenChange: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeRoute,
  onNavigate,
  onOpenEvaluationModal,
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
  searchDialogOpen,
  onSearchDialogOpenChange
}) => {
  const t = getTranslations(currentLang);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'starthere' | 'immigration' | 'study' | 'work-business' | 'needs' | 'romania' | null>(null);
  const setMobileDrawerOpen = onMobileDrawerOpenChange;
  const setSearchDialogOpen = onSearchDialogOpenChange;
  const pathname = usePathname() || '/';

  // PRIMARY NAVIGATION ITEMS
  const primaryNavItems = [
    { id: 'assessment', label: currentLang === 'fa' ? 'مسیر من چیست؟' : 'Find My Path' },
    { id: 'start-here', label: currentLang === 'fa' ? 'شروع از اینجا' : 'Start Here', megaMenu: 'starthere' as const },
    { id: 'immigration', label: currentLang === 'fa' ? 'مهاجرت و اقامت' : 'Immigration', megaMenu: 'immigration' as const },
    { id: 'study', label: currentLang === 'fa' ? 'تحصیل و بورسیه' : 'Study', megaMenu: 'study' as const },
    { id: 'work', label: currentLang === 'fa' ? 'کار و کسب‌وکار' : 'Work & Business', megaMenu: 'work-business' as const },
    { id: 'needs', label: currentLang === 'fa' ? 'نیازهای زندگی' : 'Essentials', megaMenu: 'needs' as const },
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
          href={getNavPath('home', pathname)}
          aria-label="DORVIA EUROP"
          className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse cursor-pointer group shrink min-w-0"
          onClick={() => {
            setActiveMegaMenu(null);
          }}
        >
          <Image
            src="/images/logo/dorvia-logo-primary-transparent-3000.png"
            alt="DORVIA EUROP"
            width={3000}
            height={679}
            sizes="(max-width: 640px) 140px, 160px"
            priority
            className="h-[32px] sm:h-[36px] w-auto group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Primary Desktop Navigation (Exact 6 Items) */}
        <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse text-xs font-semibold text-[#142033]">
          {primaryNavItems.map((item) => {
            const isActive = activeRoute === item.id || (item.megaMenu && activeMegaMenu === item.megaMenu);
            return (
              <div key={item.id} className="relative">
                <Link
                  href={getNavPath(item.id, pathname)}
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
            className="p-2 rounded-xl bg-[#eef3f8] text-[#142033] hover:bg-[#dfe6ef] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#dfe6ef]"
            aria-label="Search"
            title={currentLang === 'fa' ? 'جستجو' : 'Search'}
          >
            <Search size={18} className="text-[#2F6FED]" />
          </button>

          {/* Segmented Language Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#eef3f8] border border-[#dfe6ef]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-3 py-1 h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'fa' ? 'bg-[#2F6FED] text-white shadow-xs' : 'text-[#071B3D] hover:text-[#2F6FED]'
              }`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            {currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation'}
          </Button>

        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse lg:hidden shrink-0">
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="p-2 rounded-lg bg-[#eef3f8] text-[#142033] border border-[#dfe6ef] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={18} className="text-[#2F6FED]" />
          </button>

          <div className="flex items-center p-0.5 rounded-lg bg-[#eef3f8] border border-[#dfe6ef] text-[11px]">
            <button
              onClick={() => onLanguageChange('fa')}
              className={`px-2 py-0.5 h-[44px] min-w-[44px] flex items-center justify-center rounded font-bold ${currentLang === 'fa' ? 'bg-[#2F6FED] text-white' : 'text-[#142033]'}`}
            >
              FA
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 h-[44px] min-w-[44px] flex items-center justify-center rounded font-bold ${currentLang === 'en' ? 'bg-[#2F6FED] text-white' : 'text-[#142033]'}`}
            >
              EN
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenEvaluationModal}
            className="hidden sm:inline-flex !px-3 !py-1 !text-[11px] !min-h-[44px]"
          >
            {currentLang === 'fa' ? '🔎 ارزیابی' : '🔎 Assessment'}
          </Button>

          <button
            id="mobile-menu-button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl bg-[#eef3f8] hover:bg-[#dfe6ef] text-[#142033] border border-[#dfe6ef] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 z-10"
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
          onOpenSearch={() => setSearchDialogOpen(true)}
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

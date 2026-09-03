'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { usePathname } from 'next/navigation';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { getNavPath } from '../lib/navigation';
import { X, ChevronDown, Search, ArrowLeft, ArrowRight } from './Icons';
import { Button } from './Button';
import Image from 'next/image';

interface MobileDrawerProps {
  currentLang: Language;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
  onOpenEvaluationModal: () => void;
  onOpenSearch: () => void;
}

interface NavLeaf {
  id: string;
  label: string;
  isHub?: boolean;
}

interface NavSection {
  heading?: string;
  items: NavLeaf[];
}

interface NavGroup {
  id: string;
  label: string;
  hasHub: boolean;
  matchPrefixes: string[];
  sections: NavSection[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  currentLang,
  activeRoute,
  onNavigate,
  onClose,
  onOpenEvaluationModal,
  onOpenSearch
}) => {
  const t = getTranslations(currentLang);
  const isFa = currentLang === 'fa';
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || '/';
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  // Grouped navigation matching the desktop mega-menu information architecture.
  const groups: NavGroup[] = [
    {
      id: 'start-here',
      label: isFa ? 'شروع از اینجا' : 'Start Here',
      hasHub: true,
      matchPrefixes: ['start-here'],
      sections: [
        {
          items: [
            { id: 'start-here/planning-to-come', label: isFa ? 'قصد آمدن به رومانی دارم' : 'Planning to come' },
            { id: 'start-here/newly-arrived', label: isFa ? 'به‌تازگی وارد شده‌ام' : 'Just arrived' },
            { id: 'start-here/settling-in', label: isFa ? 'استقرار و ماه اول' : 'Settling In' },
            { id: 'start-here/long-term-stay', label: isFa ? 'اقامت بلندمدت می‌خواهم' : 'Looking for long-term stay' },
            { id: 'start-here/citizenship-goal', label: isFa ? 'هدفم تابعیت رومانی است' : 'My goal is citizenship' },
          ]
        }
      ]
    },
    {
      id: 'immigration',
      label: isFa ? 'مهاجرت و اقامت' : 'Immigration & Residence',
      hasHub: true,
      matchPrefixes: ['immigration'],
      sections: [
        {
          items: [
            { id: 'immigration/residence-renewal', label: isFa ? 'تمدید اقامت' : 'Residence Renewal' },
            { id: 'immigration/long-term-residence', label: isFa ? 'اقامت بلندمدت' : 'Long-term Residence' },
            { id: 'immigration/citizenship', label: isFa ? 'تابعیت' : 'Citizenship' },
            { id: 'immigration/family-reunification', label: isFa ? 'پیوست خانواده' : 'Family Reunification' },
          ]
        }
      ]
    },
    {
      id: 'study',
      label: isFa ? 'تحصیل و بورسیه' : 'Study & Scholarships',
      hasHub: true,
      matchPrefixes: ['study', 'universities'],
      sections: [
        {
          heading: isFa ? 'دانشگاه‌ها و رشته‌ها' : 'Universities & Fields',
          items: [
            { id: 'universities', label: isFa ? 'همه دانشگاه‌های رومانی' : 'All Universities in Romania', isHub: true },
            { id: 'universities?area=medicine_dentistry', label: isFa ? 'پزشکی و دندانپزشکی' : 'Medicine & Dentistry' },
            { id: 'universities?area=computer_it', label: isFa ? 'مهندسی کامپیوتر و IT' : 'Computer Science & IT' },
            { id: 'universities?area=engineering', label: isFa ? 'مهندسی برق و مکانیک' : 'Engineering Degrees' },
            { id: 'universities?area=management_business', label: isFa ? 'مدیریت و تجارت بین‌الملل' : 'Management & Business' },
          ]
        },
        {
          heading: isFa ? 'راهنمای پذیرش' : 'Admission Guidance',
          items: [
            { id: 'study/requirements', label: isFa ? 'مدارک و الزامات پذیرش' : 'Required Documents' },
            { id: 'study/visa-type-d', label: isFa ? 'ویزای تحصیلی تایپ D' : 'Type D Visa' },
            { id: 'study/tuition-overview', label: isFa ? 'شهریه‌های تحصیلی' : 'Tuition Rates' },
            { id: 'study/preparatory-year', label: isFa ? 'سال زبان' : 'Preparatory Year' },
            { id: 'study/scholarships', label: isFa ? 'بورسیه تحصیلی' : 'Scholarships' },
            { id: 'study/part-time-work', label: isFa ? 'مجوز کار دانشجویی' : 'Student Work Permits' },
          ]
        }
      ]
    },
    {
      id: 'work-business',
      label: isFa ? 'کار و کسب‌وکار' : 'Work & Business',
      hasHub: false,
      matchPrefixes: ['work', 'company'],
      sections: [
        {
          heading: isFa ? 'استخدام و کار' : 'Employment & Career',
          items: [
            { id: 'work', label: isFa ? 'هاب اصلی کار' : 'Work Hub', isHub: true },
            { id: 'work/finding-job', label: isFa ? 'پیدا کردن کار' : 'Find a Job' },
            { id: 'work/work-permit', label: isFa ? 'مجوز کار (Aviz de Muncă)' : 'Work Permit' },
            { id: 'work/work-visa', label: isFa ? 'ویزای کاری' : 'Work Visa' },
            { id: 'work/employment-contract', label: isFa ? 'قرارداد استخدام' : 'Employment Contract' },
            { id: 'work/taxes-salaries', label: isFa ? 'حقوق و مالیات' : 'Salary & Tax' },
            { id: 'work/insurance', label: isFa ? 'بیمه' : 'Insurance' },
            { id: 'work/digital-nomad', label: isFa ? 'ویزای دیجیتال نومد' : 'Digital Nomad Visa' },
          ]
        },
        {
          heading: isFa ? 'ثبت شرکت و سرمایه‌گذاری' : 'Business & Investment',
          items: [
            { id: 'company', label: isFa ? 'هاب اصلی کسب‌وکار' : 'Business Hub', isHub: true },
            { id: 'company/registration', label: isFa ? 'مراحل ثبت شرکت (SRL)' : 'Registration Steps (SRL)' },
            { id: 'company/tax-types', label: isFa ? 'انواع مالیات شرکتی' : 'Tax Types' },
            { id: 'company/bank-account', label: isFa ? 'افتتاح حساب بانکی' : 'Bank Account' },
            { id: 'company/residency', label: isFa ? 'اقامت از طریق ثبت شرکت' : 'Executive Residency' },
            { id: 'company/real-estate-investment', label: isFa ? 'سرمایه‌گذاری در املاک' : 'Real Estate Investment' },
            { id: 'company/startup-tech-investment', label: isFa ? 'سرمایه‌گذاری استارتاپ' : 'Tech Startups' },
            { id: 'company/annual-tax-reporting', label: isFa ? 'گزارش مالیاتی سالانه' : 'Tax Compliance' },
          ]
        }
      ]
    },
    {
      id: 'needs',
      label: isFa ? 'نیازهای زندگی' : 'Essentials',
      hasHub: true,
      matchPrefixes: ['needs'],
      sections: [
        {
          items: [
            { id: 'needs/currency-exchange', label: isFa ? 'صرافی و تبدیل پول' : 'Currency Exchange' },
            { id: 'needs/driving-license', label: isFa ? 'گواهینامه رانندگی' : 'Driving License' },
            { id: 'needs/certified-translation', label: isFa ? 'دارالترجمه رسمی' : 'Certified Translation' },
            { id: 'needs/notary-public', label: isFa ? 'دفتر اسناد رسمی' : 'Notary Public' },
            { id: 'needs/iranian-embassy-and-mikhak', label: isFa ? 'سفارت ایران و سامانه میخک' : 'Iranian Embassy & Mikhak' },
            { id: 'needs/housing', label: isFa ? 'اجاره و خرید مسکن' : 'Housing' },
            { id: 'needs/first-days-checklist', label: isFa ? 'چک‌لیست روزهای نخست' : 'First-Days Checklist' },
          ]
        }
      ]
    },
    {
      id: 'romania',
      label: isFa ? 'درباره رومانی' : 'About Romania',
      hasHub: true,
      matchPrefixes: ['romania'],
      sections: [
        {
          items: [
            { id: 'romania/cities', label: t.nav.cities },
            { id: 'romania/economy', label: isFa ? 'اقتصاد و درآمدها' : 'Economy & Wages' },
            { id: 'romania/society', label: isFa ? 'جامعه و زندگی اجتماعی' : 'Society & Etiquette' },
            { id: 'romania/culture-and-arts', label: isFa ? 'فرهنگ، هنر و تاریخ' : 'Culture, Arts & Heritage' },
            { id: 'romania/laws-and-regulations', label: isFa ? 'قوانین و مقررات' : 'Laws & Regulations' },
            { id: 'romania/tourism', label: isFa ? 'گردشگری و جاذبه‌ها' : 'Tourism & Itineraries' },
          ]
        }
      ]
    },
  ];

  const findActiveGroupId = () => {
    const found = groups.find((g) => g.matchPrefixes.some((p) => activeRoute === p || activeRoute.startsWith(p + '/')));
    return found ? found.id : null;
  };

  const [openGroupId, setOpenGroupId] = useState<string | null>(findActiveGroupId());

  useEffect(() => {
    setMounted(true);

    // Save previous overflow value
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      document.getElementById('mobile-menu-button')?.focus();
    };
  }, [onClose]);

  const handleLeafClick = (id: string) => {
    onClose();
    onNavigate(id);
  };

  if (!mounted) return null;

  const drawerContent = (
    <div
      className="fixed inset-0 bg-[#071B3D] flex flex-col overflow-y-auto overscroll-contain animate-fadeIn"
      style={{
        zIndex: 2147483647,
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        minHeight: '100dvh',
        height: '100dvh'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >

      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 px-6 pt-4 shrink-0">
        <Link
          href={getNavPath('home', pathname)}
          aria-label="DORVIA EUROP"
          className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse cursor-pointer shrink min-w-0"
          onClick={() => handleLeafClick('home')}
        >
          <Image
            src="/images/logo/dorvia-logo-primary-transparent-3000.png"
            alt="DORVIA EUROP"
            width={3000}
            height={679}
            sizes="140px"
            className="h-[28px] w-auto brightness-0 invert"
          />
        </Link>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 text-white border border-white/20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close Mobile Menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Search Entry Point */}
      <div className="px-6 pt-4 shrink-0">
        <button
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="w-full flex items-center gap-2.5 rtl:space-x-reverse px-4 py-3 rounded-xl bg-white/10 text-slate-200 border border-white/15 min-h-[48px] text-sm font-semibold hover:bg-white/15 transition-colors cursor-pointer"
        >
          <Search size={18} className="text-[#5B93F5] shrink-0" />
          <span>{isFa ? 'جستجوی راهنماها و خدمات...' : 'Search guides & services...'}</span>
        </button>
      </div>

      {/* Main Drawer Accordion */}
      <div className="py-4 space-y-1.5 flex-1 px-6">
        {groups.map((group) => {
          const isOpen = openGroupId === group.id;
          const isActiveGroup = group.matchPrefixes.some((p) => activeRoute === p || activeRoute.startsWith(p + '/'));
          return (
            <div key={group.id} className={`rounded-xl overflow-hidden border ${isActiveGroup ? 'border-[#2F6FED]/40' : 'border-transparent'}`}>
              <div
                className={`w-full flex items-center justify-between min-h-[48px] rounded-xl transition-colors ${
                  isActiveGroup ? 'bg-[#2F6FED]/15' : 'hover:bg-white/5'
                }`}
              >
                {group.hasHub ? (
                  <Link
                    href={getNavPath(group.id, pathname)}
                    onClick={() => handleLeafClick(group.id)}
                    className={`flex-1 text-start px-4 py-3 text-sm font-bold ${isActiveGroup ? 'text-white' : 'text-slate-100'}`}
                  >
                    {group.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => setOpenGroupId(isOpen ? null : group.id)}
                    className={`flex-1 text-start px-4 py-3 text-sm font-bold cursor-pointer ${isActiveGroup ? 'text-white' : 'text-slate-100'}`}
                  >
                    {group.label}
                  </button>
                )}
                <button
                  onClick={() => setOpenGroupId(isOpen ? null : group.id)}
                  aria-label={isOpen ? (isFa ? 'بستن بخش' : 'Collapse section') : (isFa ? 'باز کردن بخش' : 'Expand section')}
                  aria-expanded={isOpen}
                  className="px-4 py-3 min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer text-slate-400"
                >
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isOpen && (
                <div className="pb-3 pt-1 space-y-3">
                  {group.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      {section.heading && (
                        <div className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {section.heading}
                        </div>
                      )}
                      {section.items.map((item) => (
                        item.isHub ? (
                          <Link
                            key={item.id}
                            href={getNavPath(item.id, pathname)}
                            onClick={() => handleLeafClick(item.id)}
                            className="mx-2 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-[#7FA8F7] hover:bg-white/5 min-h-[44px]"
                          >
                            <span>{item.label}</span>
                            <ArrowIcon size={13} />
                          </Link>
                        ) : (
                          <Link
                            key={item.id}
                            href={getNavPath(item.id, pathname)}
                            onClick={() => handleLeafClick(item.id)}
                            className={`mx-2 flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold min-h-[44px] ${
                              activeRoute === item.id ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            {item.label}
                          </Link>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Direct Links (no children) */}
        <div className="pt-2 space-y-1.5">
          {[
            { id: 'about', label: t.nav.aboutUs },
            { id: 'services', label: t.nav.services },
            { id: 'articles', label: t.nav.articles },
          ].map((item) => (
            <Link
              key={item.id}
              href={getNavPath(item.id, pathname)}
              onClick={() => handleLeafClick(item.id)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold min-h-[48px] flex items-center ${
                activeRoute === item.id ? 'bg-[#2F6FED] text-white font-bold' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-4 border-t border-slate-800 space-y-3 px-6 mt-4 pb-6 shrink-0">
        <Button
          variant="accent"
          size="md"
          onClick={() => {
            onClose();
            onOpenEvaluationModal();
          }}
          className="w-full min-h-[44px]"
        >
          {currentLang === 'fa' ? 'ارزیابی رایگان' : 'Free Assessment'}
        </Button>

        <Button
          variant="outline"
          size="md"
          href={getNavPath('contact', pathname)}
          onClick={() => handleLeafClick('contact')}
          className="w-full min-h-[44px]"
        >
          {currentLang === 'fa' ? 'تماس با ما' : 'Contact Us'}
        </Button>
      </div>

    </div>
  );

  return createPortal(drawerContent, document.body);
};

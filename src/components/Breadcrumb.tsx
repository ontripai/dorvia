'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { PAGE_META } from '../lib/pageMeta';
import { getCanonicalOrigin } from '../lib/metadata';
import { ROUTE_REGISTRY } from '../lib/routeRegistry';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Home } from './Icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  slugRoute?: string; // e.g. 'needs/driving-license' or 'immigration/citizenship'
  customTitle?: string;
  customParentPath?: string;
  customParentTitle?: string;
  items?: BreadcrumbItem[];
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  slugRoute,
  customTitle,
  customParentPath,
  customParentTitle,
  items,
  currentLang,
  onNavigate
}) => {
  const meta = slugRoute ? PAGE_META[slugRoute] : null;

  // Determine parent and current title from either meta or custom props
  const parentPath = customParentPath || meta?.parentPath || null;
  const parentTitle = customParentTitle || (meta ? (currentLang === 'fa' ? meta.parentTitleFa : meta.parentTitleEn) : null);
  const currentTitle = customTitle || (meta ? (currentLang === 'fa' ? meta.titleFa : meta.titleEn) : null);
  const homeTitle = currentLang === 'fa' ? 'خانه' : 'Home';
  const Separator = currentLang === 'fa' ? ChevronLeft : ChevronRight;
  const BackArrow = currentLang === 'fa' ? ArrowRight : ArrowLeft;

  if (!items && (!parentPath || !parentTitle || !currentTitle)) {
    return null; // Don't show breadcrumbs for top-level pages without parents
  }

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const baseUrl = getCanonicalOrigin();
  const canonicalPath = slugRoute ? (ROUTE_REGISTRY[slugRoute]?.canonical || `/${slugRoute}`) : (parentPath ? `${parentPath}/${customTitle}` : '');
  const cleanPath = canonicalPath === '/' ? '' : canonicalPath;
  const parentCanonical = parentPath === '/' ? '' : (parentPath || '');

  // Construct JSON-LD BreadcrumbList
  const breadcrumbElements = items ? (
    [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeTitle,
        item: `${baseUrl}/${currentLang}`,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: `${baseUrl}/${currentLang}${item.href.startsWith('/') ? item.href : `/${item.href}`}` } : {})
      }))
    ]
  ) : (
    [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeTitle,
        item: `${baseUrl}/${currentLang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: parentTitle,
        item: `${baseUrl}/${currentLang}${parentCanonical}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentTitle,
        item: `${baseUrl}/${currentLang}${cleanPath}`,
      },
    ]
  );

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbElements,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* MOBILE STICKY PARENT BACK BAR (موبایل و تبلت - چسبان زیر هدر) */}
      {parentPath && parentTitle && (
        <div className="md:hidden sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-sm text-xs transition-all">
          <div className="flex items-center justify-between max-w-[1280px] mx-auto">
            <Link
              href={parentPath}
              onClick={() => handleNav(parentPath.replace('/', ''))}
              className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-[#2F6FED] hover:text-blue-700 transition-colors"
            >
              <BackArrow size={14} />
              <span>{parentTitle}</span>
            </Link>
            <span className="text-slate-500 font-medium truncate max-w-[160px] text-left rtl:text-right">
              {currentTitle}
            </span>
          </div>
        </div>
      )}

      {/* DESKTOP BREADCRUMB BAR (دسکتاپ و نمایش متنی بالای صفحه) */}
      <nav aria-label="Breadcrumb" className={`py-3 px-4 max-w-[1280px] mx-auto text-xs font-semibold text-slate-500 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <li>
            <Link
              href="/"
              onClick={() => handleNav('home')}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse hover:text-[#2F6FED] transition-colors"
            >
              <Home size={13} className="text-slate-400" />
              <span>{homeTitle}</span>
            </Link>
          </li>

          {items ? (
            items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <React.Fragment key={idx}>
                  <li className="flex items-center text-slate-400">
                    <Separator size={12} className="mx-0.5" />
                  </li>
                  {item.href && !isLast ? (
                    <li>
                      <Link href={item.href} className="hover:text-[#2F6FED] transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li className="text-[#142033] font-bold truncate max-w-[240px] sm:max-w-xs" aria-current="page">
                      {item.label}
                    </li>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>
              <li className="flex items-center text-slate-400">
                <Separator size={12} className="mx-0.5" />
              </li>

              <li>
                <Link
                  href={parentPath!}
                  onClick={() => handleNav(parentPath!.replace('/', ''))}
                  className="hover:text-[#2F6FED] transition-colors"
                >
                  {parentTitle}
                </Link>
              </li>

              <li className="flex items-center text-slate-400">
                <Separator size={12} className="mx-0.5" />
              </li>

              <li className="text-[#142033] font-bold truncate max-w-[280px] sm:max-w-md" aria-current="page">
                {currentTitle}
              </li>
            </>
          )}
        </ol>
      </nav>
    </>
  );
};

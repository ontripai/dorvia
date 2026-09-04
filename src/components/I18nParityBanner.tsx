'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { X, ShieldCheck, ExternalLink } from './Icons';

interface I18nParityBannerProps {
  currentLang: Language;
  routePath?: string;
}

export const I18nParityBanner: React.FC<I18nParityBannerProps> = ({
  currentLang,
  routePath = ''
}) => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only check after hydration
    const isDismissed = sessionStorage.getItem('dorvia_i18n_parity_dismissed');
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('dorvia_i18n_parity_dismissed', 'true');
    } catch {}
  };

  if (dismissed) {
    return null;
  }

  const isFa = currentLang === 'fa';

  return (
    <aside
      aria-label={isFa ? 'اطلاعیه همگام‌سازی محتوا' : 'Content synchronization notice'}
      className="bg-blue-50/90 border-b border-blue-200/80 text-[#142033] py-2 px-4 text-[11px] sm:text-xs transition-all animate-fadeIn"
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-0">
          <span className="shrink-0 text-sm">⚖️</span>
          <span className="truncate leading-tight">
            {isFa ? (
              <>
                <strong className="font-bold text-[#2F6FED]">همگام‌سازی لحظه‌ای:</strong> کلیه محتواها و راهنماها بر اساس آخرین قوانین مهاجرتی ۲۰۲۶ رومانی و اتحادیه اروپا به دو زبان فارسی و انگلیسی بازبینی و منطبق شده‌اند.
              </>
            ) : (
              <>
                <strong className="font-bold text-[#2F6FED]">Regulatory Currency:</strong> All guides and data are continuously synchronized with current 2026 Romanian legislation and EU Schengen directives.
              </>
            )}
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-blue-100 rounded-md transition-colors shrink-0 cursor-pointer"
          aria-label={isFa ? 'بستن اطلاعیه' : 'Dismiss notice'}
          title={isFa ? 'بستن' : 'Dismiss'}
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
};

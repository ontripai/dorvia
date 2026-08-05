import React from 'react';
import { Language } from '../types';
import { languages } from '../lib/i18n';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200 shadow-inner">
      {languages.map((lang) => {
        const isActive = currentLang === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={`px-3 py-1.5 min-h-[44px] min-w-[44px] justify-center text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-1.5 rtl:space-x-reverse ${
              isActive
                ? 'bg-[#071B3D] text-white shadow-sm font-bold'
                : 'text-slate-700 hover:text-[#071B3D] hover:bg-slate-200/60'
            }`}

            aria-label={`Switch to ${lang.label}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.id.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

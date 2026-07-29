import React from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, onNavigate }) => {
  const t = getTranslations(currentLang);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      {/* Top Subtle Tricolor Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="bg-[#002B7F] w-1/3" />
        <div className="bg-[#FCD116] w-1/3" />
        <div className="bg-[#CE1126] w-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 rounded-xl bg-[#002B7F] text-white flex items-center justify-center font-bold text-xl shadow-inner border border-slate-700">
                <span className="text-[#FCD116]">D</span>R
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  {t.brand.name}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {t.brand.subtitle}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {t.brand.description}
            </p>

            <div className="pt-2 flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-xs text-slate-400 font-semibold">{currentLang === 'fa' ? 'زبان:' : 'Language:'}</span>
              <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-white text-base font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('immigration')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.immigration}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('study')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.study}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('work')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.work}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('company')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.company}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('living')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.living}
                </button>
              </li>
            </ul>
          </div>

          {/* Information Portals */}
          <div className="space-y-3">
            <h3 className="text-white text-base font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
              {t.footer.servicesTitle}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('universities')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.universities}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cities')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.cities}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about-romania')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.aboutRomania}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('articles')} className="hover:text-[#FCD116] transition-colors">
                  {t.nav.articles}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Contact Info */}
          <div className="space-y-3">
            <h3 className="text-white text-base font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
              {t.footer.legalTitle}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('legal/privacy')} className="hover:text-[#FCD116] transition-colors">
                  {currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal/terms')} className="hover:text-[#FCD116] transition-colors">
                  {currentLang === 'fa' ? 'شرایط و ضوابط' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal/disclaimer')} className="hover:text-[#FCD116] transition-colors">
                  {currentLang === 'fa' ? 'تکذیبیه و مسئولیت' : 'Legal Disclaimer'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#FCD116] transition-colors font-semibold text-[#FCD116]">
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#FCD116] font-bold mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{t.disclaimer.title}</span>
          </div>
          <p>{t.disclaimer.text}</p>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>{t.footer.copyright}</p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <span className="hover:text-slate-400 cursor-pointer">Romania • Bucharest</span>
            <span className="hover:text-slate-400 cursor-pointer">European Union (Schengen)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

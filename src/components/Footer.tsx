'use client';

import React from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AlertCircle, MapPin, Mail } from './Icons';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, onNavigate }) => {
  const t = getTranslations(currentLang);

  return (
    <footer className="bg-[#061A35] text-slate-300 border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      {/* 4px Top Romanian Tricolor Line */}
      <div className="romania-tricolor-bar absolute top-0 left-0 right-0">
        <div />
        <div />
        <div />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 rounded-xl bg-[#071E3D] text-white flex items-center justify-center font-black text-lg shadow-sm border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col">
                  <div className="h-1/3 bg-[#0038A8]" />
                  <div className="h-1/3 bg-[#FCD116]" />
                  <div className="h-1/3 bg-[#CE1126]" />
                </div>
                <span>D</span>
                <span className="text-[#FCD116]">R</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight block">
                  {t.brand.name}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {t.brand.subtitle}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {t.brand.description}
            </p>

            <div className="pt-2 flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-xs text-slate-400 font-bold">{currentLang === 'fa' ? 'زبان:' : 'Language:'}</span>
              <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
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

          {/* Column 4: Services */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
              {t.footer.servicesTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
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

          {/* Column 5: Legal & Contact */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
              {t.footer.legalTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
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
                  {currentLang === 'fa' ? 'تکذیبیه و شفافیت' : 'Legal Disclaimer'}
                </button>
              </li>
              <li className="pt-2 text-xs text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <MapPin className="w-3.5 h-3.5 text-[#FCD116]" />
                  <span>{t.footer.address}</span>
                </div>
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <Mail className="w-3.5 h-3.5 text-[#FCD116]" />
                  <span>{t.footer.email}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Notice Footer Banner */}
        <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 leading-relaxed flex items-start space-x-3 rtl:space-x-reverse">
          <AlertCircle className="w-4 h-4 text-[#FCD116] shrink-0 mt-0.5" />
          <p>{t.disclaimer.text}</p>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0 border-t border-slate-800/60">
          <p>{t.footer.copyright}</p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <span>Bucharest, Romania</span>
            <span>•</span>
            <span>European Union (Schengen)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

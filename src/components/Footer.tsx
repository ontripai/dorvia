'use client';

import React from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { ShieldCheck } from './Icons';
import Image from 'next/image';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, onNavigate }) => {
  const t = getTranslations(currentLang);

  return (
    <footer className="bg-[#071B3D] text-white pt-0 pb-12 relative border-t border-[#0b2b55] overflow-hidden">
      
      {/* Removed Romanian Tricolor Top Border */}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-slate-300">
          
          {/* Col 1: Brand Statement */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => onNavigate('home')}>
                <img src="/images/logo/dorvia-logo-primary-transparent-3000.png" alt="DORVIA" className="h-[28px] sm:h-[32px] w-auto" />
              <span className="text-lg font-extrabold text-white">در رومانی</span>
            </div>

            <p className="text-[#788697] leading-relaxed">
              {t.brand.tagline}
            </p>

            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[11px] text-slate-400">
              {/* EU GDPR Removed */}
            </div>
          </div>

          {/* Col 2: Pathways */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              {currentLang === 'fa' ? 'مسیرهای مهاجرت' : 'Pathways'}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => onNavigate('study')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{t.pathways.study.title}</button></li>
              <li><button onClick={() => onNavigate('work')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{t.pathways.work.title}</button></li>
              <li><button onClick={() => onNavigate('company')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{t.pathways.company.title}</button></li>
              <li><button onClick={() => onNavigate('immigration')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{t.pathways.investment.title}</button></li>
              <li><button onClick={() => onNavigate('immigration')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{t.pathways.family.title}</button></li>
            </ul>
          </div>

          {/* Col 3: Essentials in Romania */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              {currentLang === 'fa' ? 'نیازها در رومانی' : 'Essentials'}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => onNavigate('needs/currency-exchange')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'صرافی و نرخ BNR' : 'Currency & BNR Rates'}</button></li>
              <li><button onClick={() => onNavigate('needs/driving-license')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'گواهینامه رانندگی' : 'Driving License'}</button></li>
              <li><button onClick={() => onNavigate('needs/certified-translation')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'دارالترجمه رسمی' : 'Certified Translation'}</button></li>
              <li><button onClick={() => onNavigate('needs/notary-public')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'دفتر اسناد رسمی' : 'Notary Public'}</button></li>
              <li><button onClick={() => onNavigate('needs/iranian-embassy-and-mikhak')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سفارت ایران و میخک' : 'Iranian Embassy & Mikhak'}</button></li>
              <li><button onClick={() => onNavigate('needs/housing')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Housing Guide'}</button></li>
            </ul>
          </div>

          {/* Col 4: Romania & Legal */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              {currentLang === 'fa' ? 'شناخت رومانی و حقوقی' : 'Romania & Legal'}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => onNavigate('romania/economy')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'اقتصاد و صنایع رومانی' : 'Economy & Industries'}</button></li>
              <li><button onClick={() => onNavigate('romania/cities')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'شهرهای رومانی' : 'Key Cities'}</button></li>
              <li><button onClick={() => onNavigate('romania/tourism')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'راهنمای گردشگری' : 'Tourism Guide'}</button></li>
              <li><button onClick={() => onNavigate('legal/privacy')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy'}</button></li>
              <li><button onClick={() => onNavigate('legal/disclaimer')} className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سلب مسئولیت قانونی' : 'Legal Disclaimer'}</button></li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>📍 {t.footer.address}</li>
              <li>✉️ <span dir="ltr" className="inline-block">{t.footer.email}</span></li>
              <li>📞 <span dir="ltr" className="inline-block">{t.footer.phone}</span></li>
            </ul>
          </div>

        </div>

        {/* Short Legal Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            {currentLang === 'fa'
              ? 'این وب‌سایت نتیجه صدور ویزا، پذیرش یا اقامت را تضمین نمی‌کند. تصمیم‌گیری نهایی در صلاحیت سفارت و اداره کل مهاجرت رومانی (IGI) است.'
              : 'This platform does not guarantee visa, admission, or residency outcomes. Final approvals belong to official Romanian authorities.'}
          </span>
          <button
            onClick={() => onNavigate('legal/disclaimer')}
            className="text-[#F4F7FC] font-bold hover:underline shrink-0 cursor-pointer"
          >
            {currentLang === 'fa' ? 'مطالعه سلب مسئولیت کامل' : 'Read Full Disclaimer'}
          </button>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#788697] gap-4">
          <p>{t.footer.copyright}</p>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => onLanguageChange(currentLang === 'fa' ? 'en' : 'fa')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {currentLang === 'fa' ? 'English (EN)' : 'فارسی (FA)'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

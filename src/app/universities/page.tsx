'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../components/AppLayout';
import { featuredUniversities } from '../../lib/data';
import { getTranslations } from '../../lib/i18n';
import { UniversityCard } from '../../components/UniversityCard';
import { EvaluationCTA } from '../../components/EvaluationCTA';

export default function UniversitiesPage() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang);
  const [uniSearch, setUniSearch] = useState('');

  const filteredUnis = featuredUniversities.filter((uni) => {
    const nameStr = currentLang === 'fa' ? uni.nameFa : uni.nameEn;
    const cityStr = currentLang === 'fa' ? uni.cityFa : uni.cityEn;
    const nameMatches = nameStr.toLowerCase().includes(uniSearch.toLowerCase());
    const cityMatches = cityStr.toLowerCase().includes(uniSearch.toLowerCase());
    return nameMatches || cityMatches;
  });

  const group1 = filteredUnis.filter(u => u.groupId === 1);
  const group2 = filteredUnis.filter(u => u.groupId === 2);
  const group3 = filteredUnis.filter(u => u.groupId === 3);

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.universities}</h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === 'fa' ? 'فهرست دانشگاه‌های معتبر رومانی' : 'Accredited Romanian Universities'}
        </p>
      </div>

      <div className="bg-[#eef3f8] p-4 rounded-2xl border border-[#dfe6ef]">
        <input
          type="text"
          value={uniSearch}
          onChange={(e) => setUniSearch(e.target.value)}
          placeholder={currentLang === 'fa' ? 'جستجوی دانشگاه یا شهر...' : 'Search university or city...'}
          className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
        />
      </div>

      {group1.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
            {currentLang === 'fa' ? 'دانشگاه‌های علوم پزشکی (مورد تأیید وزارت بهداشت)' : 'Medical Universities (Iran MOH Approved)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group1.map((uni) => (
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} />
            ))}
          </div>
        </section>
      )}

      {group2.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
            {currentLang === 'fa' ? 'دانشگاه‌های جامع، فنی و اقتصادی' : 'Comprehensive, Technical & Economic Universities'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group2.map((uni) => (
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} />
            ))}
          </div>
        </section>
      )}

      {group3.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-800 border-b border-amber-200 pb-2 flex items-center space-x-2 rtl:space-x-reverse">
            <span>⚠</span>
            <span>{currentLang === 'fa' ? 'دانشگاه‌های نیازمند بررسی مجدد' : 'Universities Requiring Special Verification'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group3.map((uni) => (
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} />
            ))}
          </div>
        </section>
      )}

      {filteredUnis.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          {currentLang === 'fa' ? 'موردی یافت نشد.' : 'No universities found.'}
        </div>
      )}

      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}

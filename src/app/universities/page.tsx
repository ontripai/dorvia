'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../components/AppLayout';
import { featuredUniversities } from '../../lib/data';
import { getTranslations } from '../../lib/i18n';
import { UniversityCard } from '../../components/UniversityCard';

export default function UniversitiesPage() {
  const { currentLang, onNavigate } = useAppContext();
  const t = getTranslations(currentLang);
  const [uniSearch, setUniSearch] = useState('');

  const filteredUnis = featuredUniversities.filter((uni) => {
    const nameMatches = uni.name[currentLang].toLowerCase().includes(uniSearch.toLowerCase());
    const cityMatches = uni.city[currentLang].toLowerCase().includes(uniSearch.toLowerCase());
    return nameMatches || cityMatches;
  });

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnis.map((uni) => (
          <UniversityCard key={uni.id} university={uni} currentLang={currentLang} href="/study" />
        ))}
      </div>
    </div>
  );
}

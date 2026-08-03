'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../components/AppLayout';
import { featuredCities } from '../../lib/data';
import { getTranslations } from '../../lib/i18n';
import { CityCard } from '../../components/CityCard';

export default function CitiesPage() {
  const { currentLang } = useAppContext();
  const t = getTranslations(currentLang);
  const [citySearch, setCitySearch] = useState('');

  const filteredCities = featuredCities.filter((c) =>
    c.name[currentLang].toLowerCase().includes(citySearch.toLowerCase()) ||
    c.romanianName.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.cities}</h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === 'fa' ? 'شهرهای کلیدی کشور رومانی' : 'Key Romanian Cities'}
        </p>
      </div>

      <div className="bg-[#eef3f8] p-4 rounded-2xl border border-[#dfe6ef]">
        <input
          type="text"
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
          placeholder={currentLang === 'fa' ? 'جستجوی شهر...' : 'Search city...'}
          className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <CityCard key={city.id} city={city} currentLang={currentLang} onSelect={() => {}} />
        ))}
      </div>
    </div>
  );
}

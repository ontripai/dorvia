'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '../../components/AppLayout';
import { featuredUniversities } from '../../lib/data';
import { getTranslations } from '../../lib/i18n';
import { UniversityCard } from '../../components/UniversityCard';
import { StudyAreaId, TeachingLanguage } from '../../types';
import { EvaluationCTA } from '../../components/EvaluationCTA';

function UniversitiesContent() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang) as any;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [uniSearch, setUniSearch] = useState('');

  const dirKeys = t.directory || {
    filters: { studyArea: "Study Area", allStudyAreas: "All Areas", language: "Teaching Language", allLanguages: "All Languages" },
    studyAreas: { medicine_dentistry: "Medicine & Dentistry", computer_it: "Computer Engineering & IT", engineering: "Electrical & Mechanical Engineering", management_business: "Management & International Business", law_political_science: "Law & Political Science", foreign_languages: "Foreign Languages", other: "Other Programs" },
    languages: { RO: "Romanian", EN: "English", FR: "French", UNKNOWN: "Unknown / Needs Verification" }
  };

  const rawArea = searchParams.get('area') || '';
  const rawLang = searchParams.get('lang') || '';

  const isValidArea = rawArea && Object.keys(dirKeys.studyAreas).includes(rawArea);
  const normalizedArea = (isValidArea ? rawArea : '') as StudyAreaId | '';

  const availableLanguages = Array.from(new Set(
    featuredUniversities.flatMap(uni =>
      uni.programs
        .filter(p => !normalizedArea || p.studyAreaId === normalizedArea)
        .flatMap(p => p.languages)
    )
  )).filter(lang => lang !== 'UNKNOWN') as TeachingLanguage[];

  const isValidLang = rawLang && availableLanguages.includes(rawLang as TeachingLanguage);
  const normalizedLang = (isValidLang ? rawLang : '') as TeachingLanguage | '';

  useEffect(() => {
    if (rawArea !== normalizedArea || rawLang !== normalizedLang) {
      const params = new URLSearchParams(searchParams.toString());
      if (normalizedArea) params.set('area', normalizedArea);
      else params.delete('area');

      if (normalizedLang) params.set('lang', normalizedLang);
      else params.delete('lang');

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [rawArea, rawLang, normalizedArea, normalizedLang, searchParams, router]);

  const updateFilters = (area: string, lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (area) params.set('area', area);
    else params.delete('area');

    if (lang) params.set('lang', lang);
    else params.delete('lang');

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStudyAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as StudyAreaId | '';

    let nextLang = normalizedLang;
    if (nextLang && val) {
      const validLangs = Array.from(new Set(
        featuredUniversities.flatMap(uni =>
          uni.programs
            .filter(p => p.studyAreaId === val)
            .flatMap(p => p.languages)
        )
      )).filter(lang => lang !== 'UNKNOWN');

      if (!validLangs.includes(nextLang as any)) {
        nextLang = '';
      }
    }
    updateFilters(val, nextLang);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    updateFilters(normalizedArea, val);
  };

  const cleanQuery = uniSearch.trim().toLowerCase();

  const filteredUnis = featuredUniversities.filter((uni) => {
    // text search
    if (cleanQuery) {
      const nameStr = currentLang === 'fa' ? uni.nameFa : uni.nameEn;
      const cityStr = currentLang === 'fa' ? uni.cityFa : uni.cityEn;
      const officialNameStr = uni.officialRomanianName;

      const matchesSearch = nameStr.toLowerCase().includes(cleanQuery) ||
                            cityStr.toLowerCase().includes(cleanQuery) ||
                            officialNameStr.toLowerCase().includes(cleanQuery);
      if (!matchesSearch) return false;
    }

    if (!normalizedArea && !normalizedLang) return true;

    // A university matches if it has AT LEAST ONE program that satisfies the active filters
    const hasMatchingProgram = uni.programs?.some(program => {
      const matchesArea = normalizedArea ? program.studyAreaId === normalizedArea : true;
      const matchesLang = normalizedLang ? program.languages.includes(normalizedLang) : true;
      return matchesArea && matchesLang;
    });

    return hasMatchingProgram;
  });

  const group1 = filteredUnis.filter(u => u.groupId === 1);
  const group2 = filteredUnis.filter(u => u.groupId === 2);
  const group3 = filteredUnis.filter(u => u.groupId === 3);



  const orderedLanguages = availableLanguages.sort((a, b) => {
    const order = { 'RO': 1, 'EN': 2, 'FR': 3 };
    const aOrder = order[a as keyof typeof order] || 99;
    const bOrder = order[b as keyof typeof order] || 99;
    return aOrder - bOrder;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.universities}</h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === 'fa' ? 'فهرست دانشگاه‌های معتبر رومانی' : 'Accredited Romanian Universities'}
        </p>
      </div>

      <div className="bg-[#eef3f8] p-4 rounded-2xl border border-[#dfe6ef] space-y-4">
        <input
          type="text"
          value={uniSearch}
          onChange={(e) => setUniSearch(e.target.value)}
          placeholder={currentLang === 'fa' ? 'جستجوی دانشگاه یا شهر...' : 'Search university or city...'}
          aria-label={currentLang === 'fa' ? 'جستجوی دانشگاه' : 'Search universities'}
          className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#526174] mb-1">{dirKeys.filters.studyArea}</label>
            <select
              value={normalizedArea}
              onChange={handleStudyAreaChange}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            >
              <option value="">{dirKeys.filters.allStudyAreas}</option>
              {Object.keys(dirKeys.studyAreas).map(key => (
                <option key={key} value={key}>{dirKeys.studyAreas[key]}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#526174] mb-1">{dirKeys.filters.language}</label>
            <select
              value={normalizedLang}
              onChange={handleLanguageChange}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            >
              <option value="">{dirKeys.filters.allLanguages}</option>
              {orderedLanguages.map(key => (
                <option key={key} value={key}>{dirKeys.languages[key]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {group1.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
            {currentLang === 'fa' ? 'دانشگاه‌های علوم پزشکی (مورد تأیید وزارت بهداشت)' : 'Medical Universities (Iran MOH Approved)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group1.map((uni) => (
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} activeStudyAreaId={normalizedArea as StudyAreaId | undefined} activeLanguage={normalizedLang as TeachingLanguage | undefined} />
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
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} activeStudyAreaId={normalizedArea as StudyAreaId | undefined} activeLanguage={normalizedLang as TeachingLanguage | undefined} />
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
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} activeStudyAreaId={normalizedArea as StudyAreaId | undefined} activeLanguage={normalizedLang as TeachingLanguage | undefined} />
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

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading...</div>}>
      <UniversitiesContent />
    </Suspense>
  );
}

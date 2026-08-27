"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/components/AppLayout";
import { featuredUniversities } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import { UniversityCard } from "@/components/UniversityCard";
import { StudyAreaId, TeachingLanguage } from "@/types";
import { EvaluationCTA } from "@/components/EvaluationCTA";

function UniversitiesContent() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang) as any;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [uniSearch, setUniSearch] = useState("");

  const dirKeys = t.directory || {
    filters: {
      studyArea: "Study Area",
      allStudyAreas: "All Areas",
      language: "Teaching Language",
      allLanguages: "All Languages",
      city: "City",
      allCities: "All Cities",
    },
    studyAreas: {
      medicine_dentistry: "Medicine & Dentistry",
      computer_it: "Computer Engineering & IT",
      engineering: "Electrical & Mechanical Engineering",
      management_business: "Management & International Business",
      law_political_science: "Law & Political Science",
      foreign_languages: "Foreign Languages",
      other: "Other Programs",
    },
    languages: {
      RO: "Romanian",
      EN: "English",
      FR: "French",
      DE: "German",
      UNKNOWN: "Unknown / Needs Verification",
    },
  };

  const rawArea = searchParams.get("area") || "";
  const rawLang = searchParams.get("lang") || "";
  const rawCity = searchParams.get("city") || "";

  const isValidArea =
    rawArea && Object.keys(dirKeys.studyAreas).includes(rawArea);
  const normalizedArea = (isValidArea ? rawArea : "") as StudyAreaId | "";

  const orderedLanguages = ["RO", "EN", "FR", "DE"] as TeachingLanguage[];
  const isValidLang =
    rawLang && orderedLanguages.includes(rawLang as TeachingLanguage);
  const normalizedLang = (isValidLang ? rawLang : "") as TeachingLanguage | "";

  const toSlug = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const cityOptionsMap = Array.from(
    new Set(featuredUniversities.map((u) => u.cityEn)),
  )
    .sort()
    .map((cityEn) => {
      const slug = toSlug(cityEn);
      const faName =
        featuredUniversities.find((u) => u.cityEn === cityEn)?.cityFa || cityEn;
      return { slug, cityEn, cityFa: faName };
    });

  const validCitySlugs = cityOptionsMap.map((c) => c.slug);
  const isValidCity = rawCity && validCitySlugs.includes(rawCity);
  const normalizedCity = isValidCity ? rawCity : "";

  useEffect(() => {
    if (
      rawArea !== normalizedArea ||
      rawLang !== normalizedLang ||
      rawCity !== normalizedCity
    ) {
      const params = new URLSearchParams(searchParams.toString());
      if (normalizedArea) params.set("area", normalizedArea);
      else params.delete("area");

      if (normalizedLang) params.set("lang", normalizedLang);
      else params.delete("lang");

      if (normalizedCity) params.set("city", normalizedCity);
      else params.delete("city");

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    rawArea,
    rawLang,
    rawCity,
    normalizedArea,
    normalizedLang,
    normalizedCity,
    searchParams,
    router,
  ]);

  const updateFilters = (area: string, lang: string, city: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (area) params.set("area", area);
    else params.delete("area");

    if (lang) params.set("lang", lang);
    else params.delete("lang");

    if (city) params.set("city", city);
    else params.delete("city");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStudyAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters(e.target.value, normalizedLang, normalizedCity);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters(normalizedArea, e.target.value, normalizedCity);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters(normalizedArea, normalizedLang, e.target.value);
  };

  const cleanQuery = uniSearch.trim().toLowerCase();

  const filteredUnis = featuredUniversities.filter((uni) => {
    // text search
    if (cleanQuery) {
      const nameStr = currentLang === "fa" ? uni.nameFa : uni.nameEn;
      const cityStr = currentLang === "fa" ? uni.cityFa : uni.cityEn;
      const officialNameStr = uni.officialRomanianName;

      const matchesSearch =
        nameStr.toLowerCase().includes(cleanQuery) ||
        cityStr.toLowerCase().includes(cleanQuery) ||
        officialNameStr.toLowerCase().includes(cleanQuery);
      if (!matchesSearch) return false;
    }

    if (!normalizedArea && !normalizedLang && !normalizedCity) return true;

    const matchesCity = normalizedCity
      ? toSlug(uni.cityEn) === normalizedCity
      : true;

    // A university matches if it has AT LEAST ONE program that satisfies the active filters
    const hasMatchingProgram = uni.programs?.some((program) => {
      const matchesArea = normalizedArea
        ? program.studyAreaId === normalizedArea
        : true;
      const matchesLang = normalizedLang
        ? program.languages.includes(normalizedLang)
        : true;
      return matchesArea && matchesLang;
    });

    return hasMatchingProgram && matchesCity;
  });

  const group1 = filteredUnis.filter((u) => u.groupId === 1);
  const group2 = filteredUnis.filter((u) => u.groupId === 2);
  const group3 = filteredUnis.filter((u) => u.groupId === 3);

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
          {t.nav.universities}
        </h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === "fa"
            ? "فهرست دانشگاه‌های معتبر رومانی"
            : "Accredited Romanian Universities"}
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-[#526174] text-sm leading-relaxed bg-white p-5 sm:p-6 rounded-2xl border border-[#dfe6ef] shadow-sm">
        {currentLang === "fa"
          ? "این فهرست به سه گروه تقسیم شده است: دانشگاه‌های علوم پزشکی که در فهرست رسمی وزارت بهداشت ایران قرار دارند (گروه اول)، دانشگاه‌های جامع، فنی و اقتصادی محبوب برای رشته‌های غیرپزشکی (گروه دوم)، و دانشگاه‌هایی که نیازمند بررسی مجدد وضعیت تأییدشان هستند (گروه سوم، با نشان هشدار). برای رشته پزشکی، همیشه پیش از تصمیم‌گیری نهایی، آخرین نسخه فهرست رسمی وزارت بهداشت را از سایت edd.behdasht.gov.ir استعلام کنید، چون این فهرست هر سال به‌روزرسانی می‌شود."
          : "This list is organized into three groups: medical universities currently listed by Iran's Ministry of Health (Group 1), popular comprehensive, technical, and economic universities for non-medical fields (Group 2), and universities whose approval status needs re-verification (Group 3, flagged with a warning). For medical programs, always check the latest version of the official Ministry of Health list at edd.behdasht.gov.ir before making a final decision, since that list is updated annually."}
      </div>

      <div className="bg-[#eef3f8] p-4 rounded-2xl border border-[#dfe6ef] space-y-4">
        <input
          type="text"
          value={uniSearch}
          onChange={(e) => setUniSearch(e.target.value)}
          placeholder={
            currentLang === "fa"
              ? "جستجوی دانشگاه یا شهر..."
              : "Search university or city..."
          }
          aria-label={
            currentLang === "fa" ? "جستجوی دانشگاه" : "Search universities"
          }
          className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
        />

        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-[#526174] mb-1">
              {dirKeys.filters.studyArea}
            </label>
            <select
              value={normalizedArea}
              onChange={handleStudyAreaChange}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            >
              <option value="">{dirKeys.filters.allStudyAreas}</option>
              {Object.keys(dirKeys.studyAreas).map((key) => (
                <option key={key} value={key}>
                  {dirKeys.studyAreas[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-[#526174] mb-1">
              {dirKeys.filters.language}
            </label>
            <select
              value={normalizedLang}
              onChange={handleLanguageChange}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            >
              <option value="">{dirKeys.filters.allLanguages}</option>
              {orderedLanguages.map((key) => (
                <option key={key} value={key}>
                  {dirKeys.languages[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-[#526174] mb-1">
              {dirKeys.filters.city}
            </label>
            <select
              value={normalizedCity}
              onChange={handleCityChange}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            >
              <option value="">{dirKeys.filters.allCities}</option>
              {cityOptionsMap.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {currentLang === "fa" ? c.cityFa : c.cityEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {group1.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
            {currentLang === "fa"
              ? "دانشگاه‌های علوم پزشکی (مورد تأیید وزارت بهداشت)"
              : "Medical Universities (Iran MOH Approved)"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group1.map((uni) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                currentLang={currentLang}
                activeStudyAreaId={normalizedArea as StudyAreaId | undefined}
                activeLanguage={normalizedLang as TeachingLanguage | undefined}
              />
            ))}
          </div>
        </section>
      )}

      {group2.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
            {currentLang === "fa"
              ? "دانشگاه‌های جامع، فنی و اقتصادی"
              : "Comprehensive, Technical & Economic Universities"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group2.map((uni) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                currentLang={currentLang}
                activeStudyAreaId={normalizedArea as StudyAreaId | undefined}
                activeLanguage={normalizedLang as TeachingLanguage | undefined}
              />
            ))}
          </div>
        </section>
      )}

      {group3.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-800 border-b border-amber-200 pb-2 flex items-center space-x-2 rtl:space-x-reverse">
            <span>⚠</span>
            <span>
              {currentLang === "fa"
                ? "دانشگاه‌های نیازمند بررسی مجدد"
                : "Universities Requiring Special Verification"}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group3.map((uni) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                currentLang={currentLang}
                activeStudyAreaId={normalizedArea as StudyAreaId | undefined}
                activeLanguage={normalizedLang as TeachingLanguage | undefined}
              />
            ))}
          </div>
        </section>
      )}

      {filteredUnis.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          {currentLang === "fa" ? "موردی یافت نشد." : "No universities found."}
        </div>
      )}

      <EvaluationCTA
        currentLang={currentLang}
        onOpenModal={onOpenEvaluationModal}
      />
    </div>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
      }
    >
      <UniversitiesContent />
    </Suspense>
  );
}

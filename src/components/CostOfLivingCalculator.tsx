'use client';

import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import {
  CityId,
  HouseholdType,
  AccommodationType,
  LifestyleLevel,
  Currency,
  ROMANIAN_CITIES_COST,
  calculateMonthlyCost,
  EUR_TO_RON_RATE
} from '../lib/costOfLivingData';
import { useAppContext } from './AppLayout';
import { FaqSchema } from './FaqSchema';
import { Breadcrumb } from './Breadcrumb';
import { Button } from './Button';
import {
  Building2,
  House,
  Users,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from './Icons';

interface CostOfLivingCalculatorProps {
  currentLang: Language;
  initialCityId?: CityId;
  hideBreadcrumb?: boolean;
}

export const CostOfLivingCalculator: React.FC<CostOfLivingCalculatorProps> = ({
  currentLang,
  initialCityId = 'bucharest',
  hideBreadcrumb = false,
}) => {
  const { onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang);
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  // State
  const [selectedCityId, setSelectedCityId] = useState<CityId>(initialCityId);
  const [compareCityId, setCompareCityId] = useState<CityId>('cluj-napoca');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [household, setHousehold] = useState<HouseholdType>('single');
  const [accommodation, setAccommodation] = useState<AccommodationType>('one_bed_center');
  const [lifestyle, setLifestyle] = useState<LifestyleLevel>('balanced');
  const [eatingOutWeekly, setEatingOutWeekly] = useState<number>(3);
  const [usePublicTransit, setUsePublicTransit] = useState<boolean>(true);
  const [rideShareTrips, setRideShareTrips] = useState<number>(6);
  const [includeGym, setIncludeGym] = useState<boolean>(true);
  const [showItemized, setShowItemized] = useState<boolean>(false);

  // Sync default accommodation when household profile changes
  const handleHouseholdChange = (newHousehold: HouseholdType) => {
    setHousehold(newHousehold);
    if (newHousehold === 'student') {
      setAccommodation('dorm');
      setLifestyle('frugal');
      setEatingOutWeekly(2);
      setRideShareTrips(2);
    } else if (newHousehold === 'family') {
      setAccommodation('three_bed');
      setLifestyle('balanced');
      setEatingOutWeekly(2);
      setRideShareTrips(8);
    } else if (newHousehold === 'couple') {
      setAccommodation('two_bed_center');
    } else {
      setAccommodation('one_bed_center');
    }
  };

  // Primary calculation
  const breakdown = useMemo(() => {
    return calculateMonthlyCost({
      cityId: selectedCityId,
      household,
      accommodation,
      lifestyle,
      eatingOutWeeklyCount: eatingOutWeekly,
      usePublicTransit,
      rideShareTripsMonthly: rideShareTrips,
      includeGym,
      currency,
    });
  }, [selectedCityId, household, accommodation, lifestyle, eatingOutWeekly, usePublicTransit, rideShareTrips, includeGym, currency]);

  // Comparison calculation for secondary city
  const compareBreakdown = useMemo(() => {
    return calculateMonthlyCost({
      cityId: compareCityId,
      household,
      accommodation,
      lifestyle,
      eatingOutWeeklyCount: eatingOutWeekly,
      usePublicTransit,
      rideShareTripsMonthly: rideShareTrips,
      includeGym,
      currency,
    });
  }, [compareCityId, household, accommodation, lifestyle, eatingOutWeekly, usePublicTransit, rideShareTrips, includeGym, currency]);

  const activeCity = ROMANIAN_CITIES_COST[selectedCityId] || ROMANIAN_CITIES_COST['bucharest'];
  const compareCity = ROMANIAN_CITIES_COST[compareCityId] || ROMANIAN_CITIES_COST['cluj-napoca'];

  // Currency symbol and formatting helper
  const formatMoney = (amount: number, curr: Currency = currency) => {
    if (isFa) {
      const formatted = amount.toLocaleString('fa-IR');
      return curr === 'EUR' ? `${formatted} یورو` : `${formatted} رون (RON)`;
    } else {
      const formatted = amount.toLocaleString('en-US');
      return curr === 'EUR' ? `€${formatted}` : `${formatted} RON`;
    }
  };

  // Secondary currency representation
  const secondaryTotal = useMemo(() => {
    if (currency === 'EUR') {
      return Math.round(breakdown.totalMonthly * EUR_TO_RON_RATE);
    } else {
      return Math.round(breakdown.totalMonthly / EUR_TO_RON_RATE);
    }
  }, [breakdown.totalMonthly, currency]);

  // Comparison difference
  const diffPercent = useMemo(() => {
    if (breakdown.totalMonthly === 0) return 0;
    const diff = ((compareBreakdown.totalMonthly - breakdown.totalMonthly) / breakdown.totalMonthly) * 100;
    return Math.round(diff);
  }, [breakdown.totalMonthly, compareBreakdown.totalMonthly]);

  // Cost of living FAQs for SEO Rich Snippets
  const faqList = useMemo(() => [
    {
      qFa: 'میانگین هزینه زندگی ماهانه برای یک دانشجو در رومانی چقدر است؟',
      qEn: 'What is the average monthly cost of living for a student in Romania?',
      aFa: 'هزینه زندگی یک دانشجو در رومانی بسته به شهر بین ۴۰۰ تا ۶۵۰ یورو در ماه متغیر است. در صورت اقامت در خوابگاه دولتی یا اتاق اشتراکی و با استفاده از تخفیف ۹۰ درصدی کارت حمل‌ونقل دانشجویی، مخارج ماهانه به حداقل می‌رسد.',
      aEn: 'A student in Romania typically spends between €400 to €650 per month. Living in campus dormitories or shared apartments alongside the 90% student public transit discount keeps expenses very affordable.',
    },
    {
      qFa: 'گران‌ترین و ارزان‌ترین شهرهای رومانی برای زندگی کدامند؟',
      qEn: 'Which Romanian cities are the most expensive and most affordable?',
      aFa: 'بر اساس داده‌های Numbeo در سال ۲۰۲۶، کلوژ-نپوکا و بخارست گران‌ترین شهرهای رومانی هستند (به‌ویژه در بخش اجاره مسکن). در مقابل، شهرهایی مانند یاش، کرایووا و سیبیو بین ۱۵ تا ۲۵ درصد هزینه مسکن و زندگی اقتصادی‌تری دارند.',
      aEn: 'According to 2026 data, Cluj-Napoca and Bucharest are the most expensive cities (particularly for apartment rents). Conversely, cities like Iași, Craiova, and Sibiu are roughly 15% to 25% more affordable.',
    },
    {
      qFa: 'هزینه قبوض آب، برق، گاز و اینترنت در رومانی چقدر است؟',
      qEn: 'How much are monthly utilities and internet bills in Romania?',
      aFa: 'هزینه قبوض پایه برای یک آپارتمان یک‌خوابه معمولاً بین ۸۰ تا ۱۲۰ یورو در ماه است که در ماه‌های سرد زمستان به دلیل گرمایش کمی افزایش می‌یابد. رومانی یکی از پرسرعت‌ترین و ارزان‌ترین اینترنت‌های فیبرنوری جهان را با هزینه حدود ۸ تا ۱۰ یورو در ماه ارائه می‌دهد.',
      aEn: 'Standard utilities for a 1-bedroom apartment range between €80 to €120/month, slightly higher during winter heating months. Romania offers some of the fastest and cheapest fiber internet in the world at around €8-€10/month.',
    },
  ], []);

  const citiesList = Object.values(ROMANIAN_CITIES_COST);

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <FaqSchema
        items={faqList.map((item) => ({
          q: isFa ? item.qFa : item.qEn,
          a: isFa ? item.aFa : item.aEn,
        }))}
      />

      {!hideBreadcrumb && (
        <Breadcrumb slugRoute="needs/cost-of-living" currentLang={currentLang} />
      )}

      {/* HERO SECTION */}
      <div className="dark-hero-panel rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-2xl border border-slate-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#2F6FED] text-xs font-bold">
              <Sparkles size={14} />
              <span>{t.costOfLiving.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {t.costOfLiving.title}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.costOfLiving.subtitle}
            </p>
          </div>

          {/* Currency Switcher Pill */}
          <div className="flex items-center bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 backdrop-blur self-start md:self-auto">
            <span className="text-[11px] font-medium text-slate-400 px-3 hidden sm:inline">
              {t.costOfLiving.results.currencySwitch}
            </span>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                currency === 'EUR'
                  ? 'bg-[#2F6FED] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              EUR (€)
            </button>
            <button
              onClick={() => setCurrency('RON')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                currency === 'RON'
                  ? 'bg-[#2F6FED] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              RON (lei)
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CALCULATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROLS & PREFERENCES (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. City Selection */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span>🏙️</span>
                <span>{t.costOfLiving.selectCity}</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {activeCity.region[currentLang]}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {citiesList.map((c) => {
                const isSelected = c.id === selectedCityId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCityId(c.id)}
                    className={`p-3 rounded-2xl text-start transition-all border text-xs font-bold flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#2F6FED] text-[#2F6FED] shadow-sm ring-1 ring-[#2F6FED]'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-extrabold text-sm">{c.name[currentLang]}</span>
                    <span className="text-[10px] text-slate-500 font-normal mt-1">{c.romanianName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Household Profile */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <label className="text-sm font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>👥</span>
              <span>{t.costOfLiving.householdProfile}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['student', 'single', 'couple', 'family'] as HouseholdType[]).map((type) => {
                const isSelected = household === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleHouseholdChange(type)}
                    className={`p-4 rounded-2xl text-start transition-all border flex items-center space-x-3 rtl:space-x-reverse ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#2F6FED] text-[#2F6FED] ring-1 ring-[#2F6FED]'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">
                      {type === 'student' ? '🎓' : type === 'single' ? '💼' : type === 'couple' ? '👫' : '👨‍👩‍👦'}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold">{t.costOfLiving.profiles[type]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Accommodation Type */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <label className="text-sm font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏠</span>
              <span>{t.costOfLiving.accommodation}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(['dorm', 'shared', 'one_bed_center', 'one_bed_suburb', 'two_bed_center', 'three_bed'] as AccommodationType[]).map((type) => {
                const isSelected = accommodation === type;
                const costRon = activeCity.rent[type];
                const isEstimated = type === 'dorm' && activeCity.rent.isDormEstimated;
                return (
                  <button
                    key={type}
                    onClick={() => setAccommodation(type)}
                    className={`p-3.5 rounded-2xl text-start transition-all border text-xs flex justify-between items-center ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#2F6FED] text-[#2F6FED] font-bold ring-1 ring-[#2F6FED]'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <span className="font-semibold">{t.costOfLiving.accommodations[type]}</span>
                      {isEstimated && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {t.costOfLiving.results.estimatedTag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {formatMoney(currency === 'RON' ? Math.round(costRon) : Math.round(costRon / EUR_TO_RON_RATE))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Lifestyle & Habit Customizers */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span>✨</span>
                <span>{t.costOfLiving.lifestyle}</span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {(['frugal', 'balanced', 'comfort'] as LifestyleLevel[]).map((level) => {
                  const isSelected = lifestyle === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setLifestyle(level)}
                      className={`py-3 px-2 rounded-2xl text-center transition-all border text-xs font-bold ${
                        isSelected
                          ? 'bg-blue-50/80 border-[#2F6FED] text-[#2F6FED] ring-1 ring-[#2F6FED]'
                          : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t.costOfLiving.lifestyles[level]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider: Eating out per week */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span>🍽️</span>
                  <span>{t.costOfLiving.lifestyleDetails.diningOut}</span>
                </span>
                <span className="font-extrabold text-[#2F6FED] bg-blue-50 px-2.5 py-0.5 rounded-md text-xs">
                  {isFa ? `${eatingOutWeekly.toLocaleString('fa-IR')} بار در هفته` : `${eatingOutWeekly} times / week`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                value={eatingOutWeekly}
                onChange={(e) => setEatingOutWeekly(Number(e.target.value))}
                className="w-full accent-[#2F6FED] cursor-pointer"
              />
            </div>

            {/* Toggles: Transit & Gym */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:bg-slate-100/70 transition-all">
                  <input
                    type="checkbox"
                    checked={usePublicTransit}
                    onChange={(e) => setUsePublicTransit(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2F6FED] focus:ring-[#2F6FED]"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {t.costOfLiving.lifestyleDetails.publicTransit}
                  </span>
                </label>

                <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:bg-slate-100/70 transition-all">
                  <input
                    type="checkbox"
                    checked={includeGym}
                    onChange={(e) => setIncludeGym(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2F6FED] focus:ring-[#2F6FED]"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {t.costOfLiving.lifestyleDetails.gymMembership}
                  </span>
                </label>
              </div>

              {usePublicTransit && (
                <div className="text-[11px] text-slate-500 bg-blue-50/70 border border-blue-100 p-3 rounded-xl flex items-start space-x-2 rtl:space-x-reverse leading-relaxed">
                  <Info size={14} className="text-[#2F6FED] shrink-0 mt-0.5" />
                  <span>{t.costOfLiving.results.studentTransitNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC RESULTS DASHBOARD (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">

          {/* HERO SUMMARY CARD */}
          <div className="bg-gradient-to-br from-[#071B3D] via-[#0D2A5E] to-[#143B7C] text-white p-7 sm:p-8 rounded-3xl shadow-xl border border-slate-700/50 space-y-6 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2F6FED]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t.costOfLiving.results.monthlyTotal}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                  📍 {activeCity.name[currentLang]}
                </span>
              </div>

              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {formatMoney(breakdown.totalMonthly)}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {isFa ? '/ در ماه' : '/ month'}
                </span>
              </div>

              <div className="text-xs text-slate-300 flex items-center space-x-2 rtl:space-x-reverse pt-1">
                <span>≈ {formatMoney(secondaryTotal, currency === 'EUR' ? 'RON' : 'EUR')}</span>
                <span>•</span>
                <span>{t.costOfLiving.results.annualTotal}: {formatMoney(breakdown.totalAnnual)}</span>
              </div>
            </div>

            {/* City Rank Gauge */}
            <div className="relative z-10 bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-slate-300 text-[11px] font-medium">{t.costOfLiving.results.rankInRomania}</div>
                <div className="font-extrabold text-white text-sm">
                  {isFa ? `رتبه ${activeCity.costIndexRank.toLocaleString('fa-IR')} از ۸ شهر کلیدی` : `#${activeCity.costIndexRank} of 8 key cities`}
                </div>
              </div>
              <div className="text-end space-y-0.5">
                <div className="text-slate-300 text-[11px] font-medium">{t.costOfLiving.results.costIndexVsBucharest}</div>
                <div className="font-extrabold text-white text-sm">
                  {activeCity.costIndexVsBucharest}%
                </div>
              </div>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="relative z-10 space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-200">
                {t.costOfLiving.results.breakdownTitle}
              </div>

              {/* Rent */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>🏠 {t.costOfLiving.categories.rent}</span>
                  <span className="font-bold text-white">{formatMoney(breakdown.rent)} ({breakdown.categoryPercentages.rent}%)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-300" style={{ width: `${breakdown.categoryPercentages.rent}%` }} />
                </div>
              </div>

              {/* Utilities */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>⚡ {t.costOfLiving.categories.utilities}</span>
                  <span className="font-bold text-white">{formatMoney(breakdown.utilities)} ({breakdown.categoryPercentages.utilities}%)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${breakdown.categoryPercentages.utilities}%` }} />
                </div>
              </div>

              {/* Food */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>🛒 {t.costOfLiving.categories.food}</span>
                  <span className="font-bold text-white">{formatMoney(breakdown.food)} ({breakdown.categoryPercentages.food}%)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${breakdown.categoryPercentages.food}%` }} />
                </div>
              </div>

              {/* Transport */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>🚌 {t.costOfLiving.categories.transport}</span>
                  <span className="font-bold text-white">{formatMoney(breakdown.transport)} ({breakdown.categoryPercentages.transport}%)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full transition-all duration-300" style={{ width: `${breakdown.categoryPercentages.transport}%` }} />
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>🎯 {t.costOfLiving.categories.lifestyle}</span>
                  <span className="font-bold text-white">{formatMoney(breakdown.lifestyle)} ({breakdown.categoryPercentages.lifestyle}%)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full transition-all duration-300" style={{ width: `${breakdown.categoryPercentages.lifestyle}%` }} />
                </div>
              </div>
            </div>

            {/* Toggle Itemized Breakdown */}
            <button
              onClick={() => setShowItemized(!showItemized)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t.costOfLiving.results.detailedTable}</span>
              {showItemized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* ITEMIZE DETAILS ACCORDION */}
          {showItemized && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                {t.costOfLiving.results.detailedTable}
              </h4>
              <div className="space-y-3">
                {breakdown.itemizedDetails.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#2F6FED]">
                      {t.costOfLiving.categories[cat.categoryKey as keyof typeof t.costOfLiving.categories]}
                    </div>
                    {cat.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                        <span>{t.costOfLiving.itemLabels[item.labelKey as keyof typeof t.costOfLiving.itemLabels] || item.labelKey}</span>
                        <span className="font-bold text-slate-900">{formatMoney(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CITY COMPARISON WIDGET */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span>⚖️</span>
                <span>{t.costOfLiving.cityComparison}</span>
              </h4>
            </div>

            <div className="space-y-3">
              <select
                value={compareCityId}
                onChange={(e) => setCompareCityId(e.target.value as CityId)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#2F6FED] outline-none"
              >
                {citiesList
                  .filter((c) => c.id !== selectedCityId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[currentLang]} ({c.romanianName})
                    </option>
                  ))}
              </select>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-500 font-medium">{compareCity.name[currentLang]}</div>
                  <div className="font-extrabold text-[#142033] text-sm mt-0.5">
                    {formatMoney(compareBreakdown.totalMonthly)}
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 rtl:space-x-reverse ${
                  diffPercent > 0
                    ? 'bg-amber-100 text-amber-800'
                    : diffPercent < 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {diffPercent > 0 ? (
                    <>
                      <TrendingUp size={14} />
                      <span>{isFa ? `${diffPercent.toLocaleString('fa-IR')}% گران‌تر` : `${diffPercent}% more expensive`}</span>
                    </>
                  ) : diffPercent < 0 ? (
                    <>
                      <TrendingDown size={14} />
                      <span>{isFa ? `${Math.abs(diffPercent).toLocaleString('fa-IR')}% ارزان‌تر` : `${Math.abs(diffPercent)}% cheaper`}</span>
                    </>
                  ) : (
                    <span>{isFa ? 'هم‌قیمت' : 'Equal cost'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CTA & CONSULTATION CARD */}
          <div className="bg-[#EEF4FF] p-6 rounded-3xl border border-blue-200/80 space-y-4 text-center sm:text-start">
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-[#142033]">
                {t.costOfLiving.cta.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.costOfLiving.cta.desc}
              </p>
            </div>
            <Button
              onClick={onOpenEvaluationModal}
              className="w-full py-3 bg-[#2F6FED] hover:bg-[#2058c7] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t.costOfLiving.cta.button}</span>
              <ArrowIcon size={14} />
            </Button>
          </div>

        </div>
      </div>

      {/* SOURCE & METHODOLOGY NOTE (DRE-P50) */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs leading-relaxed flex items-start space-x-3 rtl:space-x-reverse">
        <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-slate-600">
          <p className="font-semibold text-slate-700 leading-relaxed">
            {t.costOfLiving.results.sourceNote}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.costOfLiving.results.disclaimer}
          </p>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#142033] border-b border-slate-100 pb-3">
          {isFa ? 'سوالات متداول درباره هزینه‌های زندگی در رومانی' : 'Frequently Asked Questions: Cost of Living in Romania'}
        </h3>
        <div className="space-y-5">
          {faqList.map((faq, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED]">●</span>
                <span>{isFa ? faq.qFa : faq.qEn}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-4 rtl:pr-4 ltr:pl-4">
                {isFa ? faq.aFa : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

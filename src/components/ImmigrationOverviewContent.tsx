'use client';

import React from 'react';
import { Language } from '../types';

interface ImmigrationOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const ImmigrationOverviewContent: React.FC<ImmigrationOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  switch (subRoute) {
    case 'residence-renewal':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تمدید اقامت' : 'Residence Renewal'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI)، آیین‌نامه اتباع خارجی (OUG 194/2002) — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI), Foreigners Regime (OUG 194/2002) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'شرایط کلی تمدید' : 'General Conditions for Renewal'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'طبق آیین‌نامه اتباع خارجی رومانی (OUG 194/2002)، حق اقامت موقت به‌صورت متوالی و هر بار برای حداکثر یک سال قابل تمدید است، به شرط اینکه شرایط اولیه ورود همچنان برقرار باشد.' : 'According to the Romanian Foreigners Regime (OUG 194/2002), the right of temporary residence can be renewed successively for a maximum of one year each time, provided the initial entry conditions are still met.'}</li>
                <li>{currentLang === 'fa' ? 'در موارد خاص یا بر اساس معاهدات دوجانبه، تمدید برای دوره‌های بیش از یک سال هم ممکن است.' : 'In special cases or based on bilateral treaties, renewal for periods exceeding one year may also be possible.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'نحوه درخواست' : 'Application Process'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست تمدید باید نزد اداره کل مهاجرت (IGI) یا شعبه منطقه‌ای آن در محل اقامت متقاضی ثبت شود.' : 'The renewal application must be submitted to the General Inspectorate for Immigration (IGI) or its regional branch where the applicant resides.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکات مهم' : 'Important Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تمدید برای اعضای خانواده به‌طور جداگانه و معمولاً همزمان با دوره اقامت فرد اصلی (Sponsor) انجام می‌شود.' : 'Renewal for family members is processed separately and usually concurrently with the residence period of the primary applicant (Sponsor).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'long-term-residence':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI) — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'چیستی اقامت بلندمدت' : 'What is Long-term Residence'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اقامت بلندمدت (Drept de Ședere pe Termen Lung) سطحی از اقامت است که پس از یک دوره اقامت قانونی مستمر در رومانی و با احراز شرایط مشخص توسط IGI اعطا می‌شود.' : 'Long-term residence (Drept de Ședere pe Termen Lung) is a status granted by IGI after a continuous period of legal residence in Romania, subject to meeting specific conditions.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرایط از دست دادن اقامت بلندمدت' : 'Conditions for Losing Long-term Residence'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'غیبت بیش از ۱۲ ماه متوالی از خاک رومانی (با استثنائاتی مثل داشتن اقامت موقت در کشور دیگر عضو اتحادیه اروپا در همین بازه).' : 'Absence of more than 12 consecutive months from Romanian territory (with exceptions such as holding temporary residence in another EU member state during this period).'}</li>
                <li>{currentLang === 'fa' ? 'غیبت بیش از ۶ سال متوالی، حتی با وجود استثنائات بالا.' : 'Absence of more than 6 consecutive years, even with the aforementioned exceptions.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'بعد از پایان اعتبار' : 'After Expiration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'در صورت پایان اقامت بلندمدت در حالی که فرد هنوز در رومانی است، ظرف ۳۰ روز از تاریخ اطلاع‌رسانی می‌تواند برای اقامت موقت با اهداف مشخص‌شده در قانون درخواست دهد.' : 'If long-term residence expires while the individual is still in Romania, they can apply for temporary residence for legally specified purposes within 30 days from the date of notification.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'citizenship':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تابعیت' : 'Citizenship'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: سازمان ملی تابعیت رومانی (ANC، cetatenie.just.ro)، قانون تابعیت رومانی (Legea 21/1991) — آخرین بررسی: ۲۰۲۶'
                : 'Source: National Authority for Citizenship (ANC, cetatenie.just.ro), Romanian Citizenship Law (Legea 21/1991) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'شرایط اصلی اخذ تابعیت' : 'Main Conditions for Citizenship'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سکونت قانونی مستمر حداقل ۸ سال در خاک رومانی؛ این مدت برای فردی که با شهروند رومانیایی ازدواج کرده و با او زندگی می‌کند، به ۵ سال از تاریخ ازدواج کاهش می‌یابد.' : 'Continuous legal residence of at least 8 years in Romanian territory; this period is reduced to 5 years from the date of marriage for an individual married to and living with a Romanian citizen.'}</li>
                <li>{currentLang === 'fa' ? 'غیبت بیش از ۶ ماه در یک سال، آن سال را از محاسبه دوره سکونت حذف می‌کند.' : 'Absence of more than 6 months in a single year excludes that year from the calculation of the residence period.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'سایر شرایط قانونی' : 'Other Legal Requirements'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اثبات وفاداری به دولت رومانی از طریق رفتار و عملکرد، و نداشتن سابقه اقدام علیه نظم عمومی یا امنیت ملی.' : 'Proving loyalty to the Romanian state through conduct and actions, and having no record of activities against public order or national security.'}</li>
                <li>{currentLang === 'fa' ? 'آشنایی با زبان رومانیایی (خواندن و نوشتن)، قانون اساسی و سرود ملی، و آگاهی مقدماتی از فرهنگ و تمدن رومانی.' : 'Familiarity with the Romanian language (reading and writing), the constitution, the national anthem, and basic knowledge of Romanian culture and civilization.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'زمان‌بندی و مرجع رسیدگی' : 'Timeline and Processing Authority'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست‌ها نزد سازمان ملی تابعیت (Autoritatea Națională pentru Cetățenie / ANC) ثبت می‌شود.' : 'Applications are submitted to the National Authority for Citizenship (Autoritatea Națională pentru Cetățenie / ANC).'}</li>
                <li>{currentLang === 'fa' ? 'میانگین زمان رسیدگی به پرونده‌های ماده ۸ در حال حاضر حدود ۲ سال است (بر اساس آمار رسمی ANC).' : 'The average processing time for Article 8 cases is currently around 2 years (based on official ANC statistics).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'family-reunification':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI)، آیین‌نامه اتباع خارجی (OUG 194/2002) — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI), Foreigners Regime (OUG 194/2002) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'چارچوب کلی' : 'General Framework'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اعضای خانواده (همسر و فرزندان) شهروند رومانیایی یا دارنده اقامت بلندمدت رومانی می‌توانند برای پیوستن و اخذ حق اقامت موقت با هدف «پیوست خانواده» اقدام کنند.' : 'Family members (spouse and children) of a Romanian citizen or a long-term residence holder can apply to join them and obtain a temporary residence right for the purpose of "family reunification".'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'زمان رسیدگی' : 'Processing Time'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'زمان رسیدگی به درخواست اولیه اقامت موقت به‌عنوان عضو خانواده شهروند رومانیایی تا ۹۰ روز است؛ برای درخواست‌های بعدی (تمدید) این زمان به ۳۰ روز کاهش می‌یابد.' : 'The processing time for an initial temporary residence application as a family member of a Romanian citizen is up to 90 days; for subsequent applications (renewals), this time is reduced to 30 days.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته مهم' : 'Important Note'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'IGI بررسی می‌کند که ازدواج مبنای درخواست، «ازدواج صوری» نباشد؛ در صورت احراز صوری بودن، درخواست رد می‌شود.' : 'IGI will investigate to ensure the marriage forming the basis of the application is not a "marriage of convenience"; if proven so, the application will be denied.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مهاجرت به رومانی' : 'Immigration to Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'مروری بر مسیرهای قانونی اقامت، مراحل تمدید، پیوست خانواده و دریافت شهروندی رومانی.'
                : 'An overview of legal residence pathways, renewal procedures, family reunification, and acquiring Romanian citizenship.'}
            </p>
          </div>
        </div>
      );
  }
};

'use client';

import React from 'react';
import { Language } from '../types';

interface StudyDetailsContentProps {
  subRoute: string;
  currentLang: Language;
}

export const StudyDetailsContent: React.FC<StudyDetailsContentProps> = ({ subRoute, currentLang }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  switch (subRoute) {
    case 'requirements':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مدارک و الزامات پذیرش' : 'Admission Requirements & Documents'}
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
                <span>{currentLang === 'fa' ? 'مدارک پایه برای پذیرش' : 'Basic Admission Documents'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'نامه پذیرش رسمی از دانشگاه معتبر رومانیایی (تاییدشده توسط وزارت آموزش رومانی).' : 'Official letter of acceptance from an accredited Romanian university (endorsed by the Ministry of Education).'}</li>
                <li>{currentLang === 'fa' ? 'مدرک تمکن مالی، رسید پرداخت حداقل یک سال شهریه (در صورت نداشتن بورسیه).' : 'Proof of financial means and a receipt for at least one year\'s tuition fee (if not on scholarship).'}</li>
                <li>{currentLang === 'fa' ? 'بیمه درمانی معتبر برای کل دوره اقامت، گواهی عدم سوءپیشینه، و دو قطعه عکس پاسپورتی.' : 'Valid health insurance for the entire stay, a police clearance certificate, and two passport photos.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مراحل عمومی' : 'General Procedure'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ابتدا باید در موسسه آموزشی ثبت‌نام و پذیرفته شوید؛ سپس اقدام برای ویزای بلندمدت تحصیلی از سفارت/کنسولگری رومانی در کشور محل اقامت انجام می‌شود.' : 'First, you must enroll and be accepted by an educational institution; then apply for a long-stay study visa at the Romanian embassy/consulate in your country of residence.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'منبع رسمی راهنما' : 'Official Guide Source'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اداره کل مهاجرت رومانی (IGI) فهرست کامل و به‌روز مدارک لازم برای هر مقطع (کارشناسی، ارشد، دکتری، برنامه تبادل دانشجویی) را منتشر می‌کند.' : 'The General Inspectorate for Immigration (IGI) publishes the complete and updated list of required documents for each level of study (bachelor\'s, master\'s, PhD, exchange programs).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'visa-type-d':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ویزای تحصیلی تایپ D' : 'Type D/SD Student Visa'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره کل مهاجرت رومانی (IGI)، وزارت امور خارجه رومانی (MAE) — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI), Ministry of Foreign Affairs (MAE) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'چیستی ویزای D' : 'What is the Type D Visa?'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ویزای بلندمدت تحصیلی (نماد D/SD) برای دانشجویانی صادر می‌شود که در یک برنامه تمام‌وقت در موسسه آموزشی معتبر رومانیایی (دولتی یا خصوصی تاییدشده) پذیرفته شده‌اند.' : 'The long-stay student visa (symbol D/SD) is issued to students accepted into a full-time program at an accredited Romanian educational institution (public or approved private).'}</li>
                <li>{currentLang === 'fa' ? 'این ویزا ۱۸۰ روز اعتبار دارد و اجازه اقامت تجمعی ۹۰ روز در همان بازه را می‌دهد؛ پس از ورود باید برای کارت اقامت دانشجویی اقدام شود.' : 'This visa is valid for 180 days and allows a cumulative stay of 90 days within that period; upon arrival, you must apply for a student residence permit.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'زمان رسیدگی و محل درخواست' : 'Processing Time & Application'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'زمان معمول رسیدگی به درخواست ویزای تحصیلی تا ۶۰ روز از تاریخ ثبت مدارک در کنسولگری است.' : 'The typical processing time for a student visa application is up to 60 days from the date of submission at the consulate.'}</li>
                <li>{currentLang === 'fa' ? 'درخواست باید حضوری در سفارت/کنسولگری رومانی در کشور محل اقامت ثبت شود.' : 'Applications must be submitted in person at the Romanian embassy/consulate in the applicant\'s country of residence.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'بعد از ورود به رومانی' : 'After Arriving in Romania'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'دارنده ویزای D باید ظرف مهلت قانونی برای کارت اقامت موقت تحصیلی نزد اداره کل مهاجرت (IGI) اقدام کند.' : 'Holders of a Type D visa must apply for a temporary student residence permit at the General Inspectorate for Immigration (IGI) within the legal timeframe.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'tuition-overview':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'شهریه‌های تحصیلی (نمای کلی)' : 'Tuition Rates & Overview'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: وب‌سایت‌های رسمی دانشگاه‌های رومانی — آخرین بررسی: ۲۰۲۶ (ارقام تقریبی؛ برای مبلغ دقیق به سایت هر دانشگاه مراجعه شود)'
                : 'Source: Official Romanian university websites — Last reviewed: 2026 (Approximate figures; check specific university websites for exact amounts)'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'بازه کلی شهریه‌ها' : 'General Tuition Range'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شهریه دانشگاه‌های دولتی رومانی برای دانشجویان بین‌المللی معمولاً بین ۲,۰۰۰ تا ۱۰,۰۰۰ یورو در سال بسته به رشته و دانشگاه متغیر است (رشته‌های پزشکی و دندانپزشکی معمولاً در بالای این بازه قرار دارند).' : 'Tuition at Romanian public universities for international students typically ranges from €2,000 to €10,000 per year, depending on the field and university (medicine and dentistry are usually at the higher end).'}</li>
                <li>{currentLang === 'fa' ? 'برای ارقام دقیق هر دانشگاه، باید به بخش دانشگاه‌های معتبر در همین سایت یا مستقیماً به سایت رسمی دانشگاه مراجعه شود.' : 'For exact figures per university, please refer to the Featured Universities section on this site or directly to the official university website.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'هزینه‌های جانبی' : 'Additional Costs'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'علاوه بر شهریه، هزینه‌های ثبت‌نام، بیمه درمانی سالانه، و خوابگاه دانشجویی (در صورت وجود ظرفیت) باید در نظر گرفته شود.' : 'Besides tuition, you should account for enrollment fees, annual health insurance, and student dormitories (subject to availability).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'مسیرهای کاهش هزینه' : 'Cost Reduction Pathways'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'برنامه‌های ' : 'Programs like the '}
                  <a href="#" onClick={(e) => { e.preventDefault(); /* navigation handled elsewhere if needed */ }} className="text-[#2F6FED] hover:underline font-medium">
                    {currentLang === 'fa' ? 'بورسیه تحصیلی دولتی رومانی' : 'Romanian Government Scholarships'}
                  </a>
                  {currentLang === 'fa' ? ' می‌تواند شهریه را به‌طور کامل پوشش دهد.' : ' can cover tuition fees completely.'}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'part-time-work':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مجوز کار پاره‌وقت دانشجویی' : 'Student Part-time Work Permit'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره کل مهاجرت رومانی (IGI)، وزارت کار رومانی — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI), Ministry of Labor — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'حق کار دانشجویان بین‌المللی' : 'Work Rights for International Students'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'دانشجویان دارای اقامت موقت تحصیلی می‌توانند بدون نیاز به مجوز کار جداگانه (Aviz de Muncă)، صرفاً با قرارداد کار پاره‌وقت فعالیت کنند.' : 'Students holding a temporary study residence permit can work without needing a separate work permit (Aviz de Muncă), simply based on a part-time employment contract.'}</li>
                <li>{currentLang === 'fa' ? 'حداکثر ساعت مجاز کار ۴ ساعت در روز است (نه در دو شغل همزمان به‌طور جداگانه؛ مجموع ساعات کار در همه مشاغل نباید از ۴ ساعت در روز بیشتر شود).' : 'The maximum allowed working time is 4 hours per day (this applies cumulatively; the total working hours across all jobs must not exceed 4 hours per day).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرط اساسی' : 'Key Condition'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'روی کارت اقامت دانشجویی باید عبارت «حق کار» (Drept de Muncă) درج شده باشد؛ بدون این عبارت، اشتغال غیرقانونی محسوب می‌شود.' : 'The student residence permit must include the phrase "Right to Work" (Drept de Muncă); working without this endorsement is considered illegal employment.'}</li>
                <li>{currentLang === 'fa' ? 'کارفرما و کارمند موظف‌اند ظرف ۱۰ روز از انعقاد قرارداد کار، اداره کل مهاجرت (IGI) را از این قرارداد مطلع کنند.' : 'The employer and employee are obligated to notify the General Inspectorate for Immigration (IGI) within 10 days of signing the employment contract.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته احتیاطی' : 'Cautionary Note'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'دانش‌آموزان دبیرستانی بالای ۱۸ سال، با وجود واجد شرایط بودن ظاهری، معمولاً از سوی اداره مهاجرت اشتغال غیرقانونی تلقی می‌شوند؛ توصیه می‌شود در موارد مبهم استعلام رسمی از IGI گرفته شود.' : 'High school students over 18, despite appearing eligible, are often viewed by immigration authorities as engaging in illegal employment; official confirmation from IGI is strongly advised in ambiguous cases.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { EvaluationCTA } from './EvaluationCTA';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface WorkOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const WorkOverviewContent: React.FC<WorkOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  const sourceLine = (
    <div className="text-[11px] text-slate-400 mt-2">
      {currentLang === 'fa' 
        ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
        : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: August 2026'}
    </div>
  );

  switch (subRoute) {
    case 'work-permit':
    case 'permit':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="work/work-permit" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مجوز کار در رومانی (Aviz de Muncă)' : 'Work Permit (Aviz de Muncă)'}
            </h1>
            {sourceLine}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'فرآیند اخذ مجوز کار در رومانی (Aviz de Muncă) گام اصلی برای اشتغال قانونی اتباع خارج از اتحادیه اروپا در این کشور است. برخلاف تصور عمومی، این مجوز منحصراً توسط کارفرمای رومانیایی و از طریق اداره کل مهاجرت (IGI) درخواست می‌شود، نه توسط خود فرد متقاضی. این بدان معناست که پیش‌نیاز قطعی صدور مجوز کار، داشتن یک پیشنهاد شغلی رسمی و قطعی از یک شرکت ثبت‌شده در رومانی است که نتوانسته آن موقعیت را با شهروندان محلی یا اروپایی پر کند. دریافت این سند برای ورود به مراحل بعدی نظیر اخذ ویزای بلندمدت کاری ضروری است.'
              : 'Obtaining a work permit in Romania (Aviz de Muncă) is the primary step for non-EU citizens seeking legal employment. Contrary to popular belief, this permit is exclusively requested by the Romanian employer through the General Inspectorate for Immigration (IGI), not by the applicant. This means that having a confirmed official job offer from a registered Romanian company—which could not fill the position with local or EU citizens—is a strict prerequisite. Securing this document is essential before moving forward with a long-stay work visa application.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'نقش کارفرما' : 'Employer\'s Role'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست مجوز کار توسط کارفرمای رومانیایی نزد IGI ثبت می‌شود، نه خودِ متقاضی.' : 'The work permit application is submitted by the Romanian employer to IGI, not by the applicant.'}</li>
                <li>{currentLang === 'fa' ? 'معمولاً کارفرما باید نشان دهد این جایگاه شغلی توسط شهروند رومانی/اتحادیه اروپا/فضای اقتصادی اروپا پر نشده است.' : 'Generally, the employer must demonstrate that the position could not be filled by a Romanian/EU/EEA citizen.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مدارک موردنیاز متقاضی' : 'Applicant\'s Required Documents'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'قرارداد کاری یا پیشنهاد رسمی استخدام.' : 'Employment contract or official job offer.'}</li>
                <li>{currentLang === 'fa' ? 'مدارک تحصیلی و/یا سوابق کاری مرتبط با جایگاه شغلی.' : 'Educational degrees and/or work experience relevant to the position.'}</li>
                <li>{currentLang === 'fa' ? 'گواهی عدم سوءپیشینه.' : 'Criminal record certificate.'}</li>
                <li>{currentLang === 'fa' ? 'مدرک تسلط به زبان (در صورت نیاز جایگاه شغلی).' : 'Proof of language proficiency (if required for the role).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'پس از صدور مجوز' : 'After Issuance'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مجوز کار، پایه‌ی درخواست ویزای بلندمدت کاری (نوع D/AM) نزد سفارت رومانی است.' : 'The work permit serves as the basis for the long-stay work visa (Type D/AM) application at the Romanian embassy.'}</li>
                <li>
                  {currentLang === 'fa'
                    ? 'از آگوست ۲۰۲۶ کارفرما موظف است این درخواست را از طریق پلتفرم دولتی جدید workinromania.gov.ro پیش ببرد.'
                    : 'Since August 2026, employers must process this application through the new mandatory government platform workinromania.gov.ro.'}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          {/* REAL AVIZ DE MUNCĂ CATEGORIES */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>📂</span>
              <span>{currentLang === 'fa' ? '۸ نوع واقعی مجوز کار طبق قانون رومانی' : 'The 8 Real Aviz de Muncă Categories Under Romanian Law'}</span>
            </h2>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'برخلاف تصور رایج که «مجوز کار» یک نوع واحد است، قانون رومانی (OG 25/2014، ماده ۲) هشت دسته متمایز از مجوز کار تعریف می‌کند که هر کدام مسیر و شرایط خاص خود را دارند:'
                : 'Contrary to the common assumption that "work permit" is a single category, Romanian law (OG 25/2014, Art. 2) defines eight distinct work-permit categories, each with its own pathway and conditions:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#526174]">
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۱. دائمی (Lucrător permanent)' : '1. Permanent (Lucrător permanent)'}</strong> — {currentLang === 'fa' ? 'رایج‌ترین دسته؛ قرارداد کار نامحدود یا محدود با کارفرمای رومانیایی.' : 'the most common category; indefinite or fixed-term contract with a Romanian employer.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۲. کارآموز (Lucrător stagiar)' : '2. Trainee (Lucrător stagiar)'}</strong> — {currentLang === 'fa' ? 'دوره کارآموزی حرفه‌ای در یک شرکت رومانیایی.' : 'a professional traineeship placement at a Romanian company.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۳. فصلی (Lucrător sezonier)' : '3. Seasonal (Lucrător sezonier)'}</strong> — {currentLang === 'fa' ? 'مشاغل فصلی مانند کشاورزی یا گردشگری.' : 'seasonal work such as agriculture or tourism.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۴. مرزنشین (Lucrător transfrontalier)' : '4. Cross-border (Lucrător transfrontalier)'}</strong> — {currentLang === 'fa' ? 'مخصوص اتباع کشورهای هم‌مرز با رومانی.' : 'for citizens of countries bordering Romania.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۵. اعزامی (Lucrător detașat)' : '5. Posted worker (Lucrător detașat)'}</strong> — {currentLang === 'fa' ? 'اعزام‌شده توسط یک شرکت خارج از رومانی برای پروژه‌ای در رومانی.' : 'posted by a company outside Romania to work on a project inside Romania.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۶. انتقالی درون‌شرکتی (ICT)' : '6. Intra-corporate transferee (ICT)'}</strong> — {currentLang === 'fa' ? 'انتقال مدیر یا متخصص از شعبه خارجی همان شرکت به شعبه رومانیایی.' : 'transferred from a foreign branch of the same company to its Romanian branch.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۷. متخصص عالی‌رتبه (کارت آبی اتحادیه اروپا)' : '7. Highly-qualified worker (EU Blue Card)'}</strong> — {currentLang === 'fa' ? 'مسیر ویژه با مزایای بیشتر، جزئیات در ادامه.' : 'the special-track route with extra benefits, detailed below.'}</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">{currentLang === 'fa' ? '۸. اوپر (Au pair)' : '8. Au pair'}</strong> — {currentLang === 'fa' ? 'اقامت و کار محدود نزد یک خانواده میزبان رومانیایی.' : 'live-in, limited work arrangement with a Romanian host family.'}</div>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentLang === 'fa'
                ? 'منبع: igi.mai.gov.ro و متن رسمی OG 25/2014. (فعالیت اقتصادی مستقل اتباع خارجی یک رژیم اقامتی جداگانه است، نه یک دسته «Aviz de Muncă»؛ اگر این مسیر برای شما مطرح است، حتماً موردی جداگانه با IGI بررسی کنید.)'
                : 'Source: igi.mai.gov.ro and the official text of OG 25/2014. (Independent economic activity by a foreigner is a separate residence-status regime, not an "Aviz de Muncă" category — if this route applies to you, verify it separately with IGI.)'}
            </p>
          </div>

          {/* EU BLUE CARD */}
          <div className="bg-[#071B3D] text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold flex items-center space-x-2 rtl:space-x-reverse">
              <span>🔷</span>
              <span>{currentLang === 'fa' ? 'کارت آبی اتحادیه اروپا (EU Blue Card) — مسیر متخصصان عالی‌رتبه' : 'EU Blue Card — The High-Skilled Track'}</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر مدرک تحصیلات تکمیلی یا سابقه کاری تخصصی دارید، مسیر کارت آبی معمولاً سریع‌تر و با مزایای بیشتری همراه است. طبق قانون ۲۸/۲۰۲۴ (اجرایی از مارس ۲۰۲۴)، حداقل حقوق ناخالص لازم برای واجد شرایط بودن از «۲ برابر میانگین حقوق ناخالص کشوری» به «۱ برابر میانگین حقوق ناخالص کشوری» کاهش یافت. طبق آخرین آمار رسمی (مرکز آمار ملی، مه ۲۰۲۶)، میانگین حقوق ناخالص کشوری حدود ۹,۴۸۳ لئو در ماه است — این رقم را حتماً پیش از اقدام با IGI/کارفرمای خود تایید کنید چون به‌روزرسانی می‌شود.'
                : 'If you hold an advanced degree or specialized professional experience, the EU Blue Card route is typically faster and comes with more benefits. Under Law 28/2024 (effective March 2024), the minimum gross salary threshold to qualify was reduced from "2× the average national gross salary" to "1× the average national gross salary." Per the latest official statistics (National Statistics Institute, May 2026), the average national gross salary is around 9,483 RON/month — always confirm this current figure with IGI/your employer before applying, since it updates periodically.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 bg-[#0b2b55] rounded-xl space-y-1">
                <span className="font-extrabold text-blue-300">{currentLang === 'fa' ? 'شرایط احراز' : 'Eligibility'}</span>
                <p className="text-slate-300">{currentLang === 'fa' ? 'مدرک تحصیلات تکمیلی، یا ۵ سال سابقه کاری تخصصی مرتبط (۳ سال برای متخصصان IT)، به‌همراه قرارداد کاری حداقل ۶ ماهه تمام‌وقت.' : 'An advanced degree, or 5 years of relevant professional experience (3 years for IT specialists), plus a full-time contract of at least 6 months.'}</p>
              </div>
              <div className="p-4 bg-[#0b2b55] rounded-xl space-y-1">
                <span className="font-extrabold text-blue-300">{currentLang === 'fa' ? 'مزایا نسبت به مجوز عادی' : 'Advantages over Standard Permit'}</span>
                <p className="text-slate-300">{currentLang === 'fa' ? 'اعتبار تا ۳ سال (به‌جای ۱ سال معمول)، امکان ثبت هم‌زمان درخواست پیوست خانواده، و امکان جابجایی درون اتحادیه اروپا بدون نیاز به مجوز جدید پس از مدتی.' : 'Validity up to 3 years (vs. the usual 1 year), simultaneous family-reunification filing, and EU intra-mobility without needing a fresh permit after a qualifying period.'}</p>
              </div>
            </div>
          </div>

          {/* NARRATIVE: THE REAL WORKINROMANIA.GOV.RO ROLLOUT & PERMIT BACKLOG */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>⚠️</span>
              <span>{currentLang === 'fa' ? 'واقعیت راه‌اندازی workinromania.gov.ro: چرا کارفرمای شما ممکن است دچار مشکل شود' : 'The Real workinromania.gov.ro Rollout: Why Your Employer Might Hit Trouble'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'پلتفرم جدید workinromania.gov.ro طبق فرمان فوری دولت شماره ۳۲/۲۰۲۶ (اجرایی از ۲۷ آوریل ۲۰۲۶، با دوره گذار تا ۷ آگوست ۲۰۲۶) راه‌اندازی شد، اما راه‌اندازی آن با مشکلات واقعی همراه بوده است. طبق گزارش Economica.net، دو نهاد دولتی درگیر (IGI و وزارت امور خارجه) قوانین OUG 32/2026 را متفاوت تفسیر می‌کنند — مدارکی که IGI تایید کرده، توسط سفارت‌ها و MAE پذیرفته نمی‌شود. طبق گزارش Wall-Street.ro، صدها پرونده که از مارس تا آوریل ۲۰۲۶ (پیش از راه‌اندازی پلتفرم) ثبت شده بودند، پس از فعال شدن سامانه جدید، مجبور به شروع مجدد از صفر شدند؛ کارفرمایان هزینه‌ای معادل ~۱۰۰ یورو به‌ازای هر پرونده از دست دادند بدون سازوکار بازپرداخت اعلام‌شده.'
                : 'The new workinromania.gov.ro platform launched under Emergency Government Ordinance 32/2026 (in force since April 27, 2026, with a transition period through August 7, 2026), but its rollout has come with real problems. Per Economica.net, the two government bodies involved (IGI and the Ministry of Foreign Affairs) are interpreting OUG 32/2026 differently — documents IGI has approved are not being accepted by embassies/MAE. Per Wall-Street.ro, hundreds of files submitted between March and April 2026 (before the platform launched) were forced to restart from scratch once the new system went live; employers lost roughly €100 per file with no announced refund mechanism.'}
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'یک مثال واقعی از اندازه مشکل:' : 'A real example of the scale:'}</strong>
              {currentLang === 'fa'
                ? 'طبق گزارش Digi24، سیستم مرکزی صدور مجوز کار حدود آوریل ۲۰۲۶ عملاً به‌خاطر بازنگری قانونی متوقف شد و زمان رسیدگی به حدود ۴ تا ۵ ماه از تاریخ ثبت مدارک رسید. یک کارفرمای بخش ساخت‌وساز که ۴۵۰ کارگر آزمایش کرده و ۱۳۰ نفر را انتخاب کرده بود، نتوانست به‌خاطر کمبود مجوز آن‌ها را وارد رومانی کند. این یعنی نه فقط شما، بلکه خود کارفرمای شما هم ممکن است در این فرآیند با تاخیر غیرمنتظره مواجه شود — پیگیری منظم و مستندسازی هر مرحله (رسید ثبت، شماره پرونده) اهمیت زیادی دارد.'
                : 'Per Digi24, the central work-permit issuance system was effectively suspended around April 2026 amid a legislative overhaul, pushing processing to roughly 4-5 months from document submission. One construction employer who screened 450 workers and selected 130 could not bring them into Romania due to the permit shortage. This means your employer — not just you — may hit unexpected delays in this process; keeping your own records (submission receipt, file number) at every stage is worth doing.'}
            </div>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: Economica.net، Wall-Street.ro، Adevărul، Digi24، PwC Romania (تحلیل OUG 32/2026)، Romania-Insider، mai.gov.ro. طبق تحلیل PwC، OUG 32/2026 همچنین شرایط جدیدی برای کارفرمایان (حداقل ۲۴ ماه سابقه فعالیت، حداقل ۵۰ کارمند به‌طور میانگین، تضمین مالی ۱٬۰۰۰ یورو به‌ازای هر کارگر خارجی) و انواع ویزای جدید D/AM1 (متخصص) و D/AM2 (مشاغل کمبود نیرو) معرفی کرده است.'
                : 'Sources: Economica.net, Wall-Street.ro, Adevărul, Digi24, PwC Romania (OUG 32/2026 analysis), Romania-Insider, mai.gov.ro. Per PwC\'s analysis, OUG 32/2026 also introduced new employer eligibility requirements (minimum 24 months in business, minimum 50 average employees, a €1,000-per-worker financial guarantee) and new visa subtypes D/AM1 (skilled) and D/AM2 (shortage-occupation).'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم خودم مستقیماً برای مجوز کار درخواست دهم؟' : 'Can I apply for the work permit directly by myself?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. درخواست مجوز کار منحصراً باید توسط کارفرمای رومانیایی شما به اداره مهاجرت (IGI) ارائه شود.' : 'No. The work permit application must be submitted exclusively by your Romanian employer to IGI.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'بررسی درخواست مجوز چقدر طول می‌کشد؟' : 'How long does the permit application process take?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق گزارش‌های خبری ۲۰۲۶ (Digi24)، در دوره بازنگری سیستم، زمان رسیدگی تا ۴-۵ ماه هم گزارش شده؛ این عدد رسمی نیست اما نشان می‌دهد «چند هفته تا چند ماه» می‌تواند در عمل به سمت انتهای بازه یا فراتر از آن برود.' : 'Per 2026 news coverage (Digi24), during the system overhaul period, processing times of up to 4-5 months have been reported; this is not an official figure but shows "a few weeks to several months" can in practice run toward the long end or beyond.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'کارت آبی اتحادیه اروپا با مجوز کار عادی چه فرقی دارد؟' : 'How is the EU Blue Card different from a standard work permit?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'کارت آبی مخصوص متخصصان با مدرک تحصیلات تکمیلی یا سابقه تخصصی است و اعتبار طولانی‌تر (تا ۳ سال) و مسیر ساده‌تر پیوست خانواده دارد.' : 'The Blue Card is for specialists with an advanced degree or specialized experience and offers longer validity (up to 3 years) and a simpler family-reunification path.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر پرونده من قبل از راه‌اندازی پلتفرم جدید ثبت شده بود چه می‌شود؟' : 'What happens if my file was submitted before the new platform launched?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق گزارش‌های رسانه‌ای، صدها پرونده ثبت‌شده پیش از راه‌اندازی کامل پلتفرم (اوت ۲۰۲۶) مجبور به شروع مجدد شدند. با کارفرمای خود پیگیری کنید که پرونده شما تحت روال جدید هم معتبر شناخته شده یا نیاز به ثبت مجدد دارد.' : 'Per media reports, hundreds of files submitted before the platform\'s full launch (August 2026) were forced to restart. Check with your employer whether your file is recognized under the new procedure or needs to be resubmitted.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="work/work-permit" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'work-visa':
    case 'visa':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="work/work-visa" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ویزای بلندمدت کاری (D/AM)' : 'Long-Stay Work Visa (D/AM)'}
            </h1>
            {sourceLine}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'ویزای بلندمدت کاری رومانی (نوع D/AM) مجوزی است که به شما اجازه می‌دهد برای ورود به خاک رومانی با هدف اشتغال اقدام کنید. این ویزا تنها پس از آنکه کارفرمای شما مجوز کار (Aviz de Muncă) را با موفقیت از مراجع ذی‌ربط دریافت کرد، در سفارت یا کنسولگری رومانی قابل درخواست است. پس از ورود به رومانی با استفاده از این ویزا، شما مهلت مشخصی دارید تا پیش از پایان اعتبار حق اقامت اولیه خود، نسبت به دریافت کارت اقامت موقت کاری از IGI اقدام نمایید؛ در غیر این صورت، حضور شما غیرقانونی تلقی خواهد شد.'
              : 'The Romanian long-stay work visa (Type D/AM) is the authorization allowing you to enter Romania for employment purposes. You can only apply for this visa at a Romanian embassy or consulate after your employer has successfully obtained your work permit (Aviz de Muncă). Once you enter Romania using this visa, you have a specific timeframe to apply for a temporary residence permit at IGI before your initial right of stay expires; otherwise, your presence will be considered illegal.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مراحل درخواست' : 'Application Process'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پس از دریافت مجوز کار توسط کارفرما، متقاضی می‌تواند برای ویزای بلندمدت کاری در سفارت/کنسولگری رومانی اقدام کند.' : 'After the employer obtains the work permit, the applicant can apply for the long-stay work visa at the Romanian embassy/consulate.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'پس از ورود به رومانی' : 'After Arrival in Romania'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست کارت اقامت موقت برای اشتغال نزد ادارات محلی IGI، حداقل ۳۰ روز قبل از پایان اعتبار حق اقامت اولیه.' : 'Apply for a temporary residence permit for employment at local IGI offices, at least 30 days before the initial right of stay expires.'}</li>
                <li>{currentLang === 'fa' ? 'رسیدگی معمولاً ظرف ۳۰ روز (قابل تمدید تا ۱۵ روز در صورت نیاز به بررسی بیشتر).' : 'Processing typically takes 30 days (extendable by up to 15 days for further checks).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'تغییر کارفرما' : 'Changing Employers'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تغییر کارفرما معمولاً نیازمند بازبینی یا صدور مجدد مجوز کار است.' : 'Changing employers usually requires a review or re-issuance of the work permit.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          {/* NARRATIVE: THE TEHRAN EMBASSY PROCESS FOR THIS VISA */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🇮🇷</span>
              <span>{currentLang === 'fa' ? 'دریافت ویزای D/AM از سفارت رومانی در تهران' : 'Getting the D/AM Visa at the Romanian Embassy in Tehran'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'همانند ویزای نوع D عمومی، ویزای کاری D/AM هم باید در خود سفارت رومانی در تهران دریافت شود چون هیچ مرکز خدمات ویزای VFS Global در ایران وجود ندارد. فرآیند از طریق سامانه آنلاین eViza شروع می‌شود: ابتدا پرونده و مدارک را در این سامانه بارگذاری می‌کنید، و فقط پس از آنکه وضعیت پرونده به «Valid» تغییر کرد، امکان رزرو نوبت حضوری در سفارت فراهم می‌شود — یعنی نمی‌توانید همزمان با ثبت اولیه نوبت بگیرید. هزینه استاندارد ویزای نوع D حدود ۱۲۰ یورو گزارش شده است.'
                : 'Just like the general Type D visa, the D/AM work visa must also be obtained in person at the Romanian Embassy in Tehran, since Iran has no VFS Global visa service center. The process starts through the online eViza system: you first upload your file and documents there, and only once the file status changes to "Valid" can you book an in-person embassy appointment — you cannot book a slot at the same time as your initial submission. The standard Type D visa fee is reported at around €120.'}
            </p>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: stinwo.ro، mae.ro. زمان انتظار واقعی برای نوبت‌دهی در سفارت تهران در منابع رسمی/خبری یافت نشد؛ این بخش رو برای برنامه‌ریزی زودتر از موعد، نه به‌عنوان تضمین زمانی، در نظر بگیرید.'
                : 'Sources: stinwo.ro, mae.ro. Real-world wait times for Tehran embassy appointments were not found in official/news sources; treat this section as a reason to plan early, not as a timing guarantee.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا با ویزای D/AM می‌توانم کارفرمای خود را تغییر دهم؟' : 'Can I change employers with a D/AM visa?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'تغییر کارفرما معمولاً نیازمند طی کردن مجدد روند قانونی و صدور مجوز کار جدید توسط کارفرمای جدید است.' : 'Changing employers usually requires going through the legal process again and issuing a new work permit by the new employer.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چه زمانی باید برای کارت اقامت موقت اقدام کنم؟' : 'When should I apply for the temporary residence permit?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما موظفید حداقل ۳۰ روز پیش از به پایان رسیدن اعتبار ویزای نوع D خود، درخواست کارت اقامت را به IGI تحویل دهید.' : 'You must submit your temporary residence permit application to IGI at least 30 days before your Type D visa expires.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم برای ویزای D/AM از مرکز VFS در تهران اقدام کنم؟' : 'Can I apply for the D/AM visa through a VFS center in Tehran?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. رومانی هیچ مرکز VFS Global در ایران ندارد؛ باید از طریق سامانه eViza پرونده بسازید و سپس شخصاً به سفارت رومانی در تهران مراجعه کنید.' : 'No. Romania has no VFS Global center in Iran; you must build your file through the eViza system and then attend the Romanian Embassy in Tehran in person.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="work/work-visa" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'finding-job':
    case 'find-job':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="work/finding-job" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'پیدا کردن کار در رومانی' : 'Finding a Job in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: پورتال EURES اتحادیه اروپا، آژانس ملی استخدام رومانی (ANOFM) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: EU EURES Portal, National Agency for Employment (ANOFM) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'پیدا کردن کار در رومانی برای ایرانیان و سایر اتباع غیراروپایی نیازمند شناخت دقیق از منابع رسمی و نیازمندی‌های بازار کار است. برای جستجوی موقعیت‌های معتبر، استفاده از پورتال‌های رسمی مانند پورتال EURES و آژانس ملی استخدام رومانی (ANOFM) توصیه می‌شود که آگهی‌های تأییدشده را نمایش می‌دهند. با توجه به الزامات سخت‌گیرانه دریافت مجوز کار، تمرکز بر تخصص‌هایی که در بازار محلی رومانی با کمبود نیروی کار مواجه‌اند و همچنین ارتقای مهارت در زبان انگلیسی یا رومانیایی، می‌تواند شانس یافتن کارفرمایی که مایل به انجام امور اداری جذب نیروی خارجی باشد را به میزان قابل‌توجهی افزایش دهد.'
              : 'Finding a job in Romania as a non-EU citizen requires a clear understanding of official resources and job market demands. To find legitimate opportunities, it is highly recommended to use official portals such as the EU EURES network and the Romanian National Agency for Employment (ANOFM), which display verified postings. Given the strict requirements for obtaining a work permit, focusing on specialized skills facing local shortages and improving your English or Romanian proficiency will significantly increase your chances of finding an employer willing to navigate the hiring process for foreigners.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'سایت‌های کاریابی واقعی رومانی' : 'Real Romanian Job Search Sites'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پورتال EURES رومانی (eures.europa.eu / eures.anofm.ro) — بخش رسمی شبکه کاریابی اتحادیه اروپا؛ و آژانس ملی استخدام (ANOFM، anofm.ro) با آگهی‌های داخلی.' : 'The Romanian EURES portal (eures.europa.eu / eures.anofm.ro) — the official EU employment network; and the National Agency for Employment (ANOFM, anofm.ro) with domestic listings.'}</li>
                <li><strong className="text-[#142033]">eJobs.ro</strong> {currentLang === 'fa' ? '— پرترافیک‌ترین پورتال عمومی رومانی با بیش از ۳ میلیون رزومه فعال.' : '— Romania\'s highest-traffic general portal, 3M+ active CVs.'}</li>
                <li><strong className="text-[#142033]">BestJobs.ro</strong> {currentLang === 'fa' ? '— پورتال عمومی پرحجم دیگر با محتوای آموزشی رزومه/مصاحبه.' : '— another high-volume general portal, with CV/interview coaching content.'}</li>
                <li><strong className="text-[#142033]">Hipo.ro</strong> {currentLang === 'fa' ? '— مخصوص فارغ‌التحصیلان و سطوح حرفه‌ای، با فهرست «۵۰۰ کارفرمای برتر رومانی».' : '— targets graduates & professionals, publishes Romania\'s "Top 500 Employers" list.'}</li>
                <li><strong className="text-[#142033]">Undelucram.ro</strong> {currentLang === 'fa' ? '— ترکیب آگهی شغلی + نظرات کارمندان درباره کارفرما (شبیه Glassdoor) با ابزار مقایسه حقوق.' : '— job board + employee employer-reviews (Glassdoor-style) with a salary-comparison tool.'}</li>
                <li><strong className="text-[#142033]">Jobber.ro</strong> {currentLang === 'fa' ? '— تخصصی حوزه IT (توسعه، ادمین سیستم، تست).' : '— IT-specific (dev, sysadmin, QA/testing).'}</li>
                <li>{currentLang === 'fa' ? 'Posturi.gov.ro برای مشاغل دولتی رسمی، و Careerjet.ro/Indeed.com به‌عنوان تجمیع‌کننده آگهی از چند منبع.' : 'Posturi.gov.ro for official public-sector jobs, and aggregators like Careerjet.ro/Indeed.com.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرایط برای اتباع خارج از اتحادیه اروپا' : 'Conditions for Non-EU Citizens'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'اتباع خارج از اتحادیه اروپا/منطقه اقتصادی اروپا برای اشتغال قانونی نیاز به ' : 'Non-EU/EEA citizens require a '}
                  <Link href="/work/work-permit" className="text-[#2F6FED] font-medium hover:underline focus:outline-none">
                    {currentLang === 'fa' ? 'مجوز کار (Aviz de Muncă)' : 'Work Permit (Aviz de Muncă)'}
                  </Link>
                  {currentLang === 'fa' ? ' دارند که باید توسط کارفرما از اداره کل مهاجرت (IGI) درخواست شود.' : ' for legal employment, which must be requested by the employer from the General Inspectorate for Immigration (IGI).'}
                </li>
                <li>{currentLang === 'fa' ? 'پیش‌نیاز شروع این فرآیند، داشتن پیشنهاد شغلی رسمی از یک کارفرمای ثبت‌شده در رومانی است.' : 'A prerequisite to initiating this process is having an official job offer from a registered employer in Romania.'}</li>
                <li>
                  {currentLang === 'fa'
                    ? 'از آگوست ۲۰۲۶، کارفرمایان و آژانس‌های کاریابی موظفند استخدام اتباع غیر اتحادیه اروپا را از طریق پلتفرم دولتی جدید و اجباری workinromania.gov.ro ثبت کنند (خودتان به‌عنوان کارجو مستقیماً از این سامانه استفاده نمی‌کنید، اما بدانید کارفرمای شما باید از آن عبور کند).'
                    : 'Since August 2026, employers and staffing agencies are required to process non-EU hiring through the new mandatory government platform workinromania.gov.ro (you as the job seeker don\'t use it directly, but your employer must go through it).'}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکات عملی' : 'Practical Considerations'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'حداقل حقوق قانونی رومانی: ۴,۳۲۵ لئو ناخالص در ماه (حدود ۸۵۰ یورو)، طبق تصمیم دولت شماره ۱۴۶/۲۰۲۶، معتبر از ژوئیه ۲۰۲۶ به بعد.' : 'Minimum legal gross salary in Romania: 4,325 RON per month (approx. €850), per Government Decision 146/2026, effective July 2026.'}</li>
                <li>{currentLang === 'fa' ? 'رزومه به فرمت اروپاس (Europass CV) در سراسر اتحادیه اروپا و رومانی رایج و مرسوم است — الزام قانونی نیست، اما انتظار می‌رود.' : 'The Europass CV format is customary and widely expected across the EU and Romania — not a strict legal requirement, but expected.'}</li>
                <li>{currentLang === 'fa' ? 'تسلط به زبان رومانیایی یا انگلیسی مزیت رقابتی مهمی در بازار کار محسوب می‌شود.' : 'Proficiency in Romanian or English is considered a significant competitive advantage in the job market.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span>🏗️</span>
                <span>{currentLang === 'fa' ? 'آژانس‌های کاریابی برای اتباع غیر اتحادیه اروپا' : 'Recruitment Agencies for Non-EU Workers'}</span>
              </h2>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'برای مشاغل غیرتخصصی (ساخت‌وساز، کشاورزی، هتلداری، لجستیک)، برخلاف پورتال‌های عمومی بالا، معمولاً کارفرمایان از طریق آژانس‌های استخدام تخصصی نیروی خارجی به شما دسترسی پیدا می‌کنند — یعنی شما مستقیماً برای این آژانس‌ها درخواست نمی‌دهید، بلکه آن‌ها با کارفرمایان قرارداد دارند و افراد را معرفی می‌کنند. نمونه‌های واقعی فعال در رومانی:'
                  : 'For non-specialist roles (construction, agriculture, hospitality, logistics), unlike the general portals above, employers typically source foreign candidates through specialized foreign-worker recruitment agencies — you don\'t apply to these agencies directly; they are contracted by employers and place candidates. Real, currently active examples in Romania:'}
              </p>
              <ul className="space-y-1.5 text-sm text-[#526174] list-disc list-inside">
                <li><strong className="text-[#142033]">GlobalWorker.ro</strong> {currentLang === 'fa' ? '— استخدام برای ساخت‌وساز، کشاورزی، هتلداری و لجستیک.' : '— placements for construction, agriculture, hospitality, logistics.'}</li>
                <li><strong className="text-[#142033]">GoBester.com</strong> {currentLang === 'fa' ? '— آژانس نیروی کار برای اتباع غیراروپایی.' : '— staffing agency for non-European workers.'}</li>
                <li><strong className="text-[#142033]">AtoZSerwisPlus.ro</strong> {currentLang === 'fa' ? '— آژانس استخدام نیروی خارجی.' : '— foreign-worker recruitment agency.'}</li>
              </ul>
              <p className="text-[11px] italic text-slate-400">
                {currentLang === 'fa' ? 'قبل از پرداخت هرگونه هزینه به یک آژانس، اعتبار آن را با دقت بررسی کنید؛ آژانس‌های قانونی معمولاً هزینه اصلی را از کارفرما دریافت می‌کنند، نه از کارجو.' : 'Verify any agency\'s legitimacy carefully before paying it anything; legitimate agencies are typically paid by the employer, not the job seeker.'}
              </p>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span>📋</span>
                <span>{currentLang === 'fa' ? 'مشاغل کمبود نیرو و سهمیه سالانه' : 'Shortage Occupations & Annual Quota'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa'
                    ? 'وزارت کار رومانی هر سال «فهرست مشاغل کمبود نیرو» (Lista ocupațiilor deficitare) را منتشر می‌کند؛ برای سال ۲۰۲۶ این فهرست ۲۳۶ شغل را دربرمی‌گیرد (فرمان فوری دولت شماره ۳۲/۲۰۲۶)، عمدتاً در ساخت‌وساز (جوشکار، بنا، برقکار، لوله‌کش)، هتلداری/غذایی، حمل‌ونقل، تولید، نظافت و مراقبت سالمندان/بهداشت.'
                    : 'Romania\'s Ministry of Labor publishes an annual "shortage occupations list" (Lista ocupațiilor deficitare); for 2026 it covers 236 occupations (Emergency Ordinance 32/2026), mainly in construction (welders, masons, electricians, plumbers), hospitality/food service, transport/logistics, manufacturing, cleaning, and elder care/healthcare.'}
                </li>
                <li>
                  {currentLang === 'fa'
                    ? 'داشتن مهارتی که در این فهرست باشد، عملاً احتمال یافتن کارفرمایی که مایل به طی کردن مراحل مجوز کار باشد را افزایش می‌دهد.'
                    : 'Holding a skill on this list practically increases the chance of finding an employer willing to go through the work permit process.'}
                </li>
                <li>
                  {currentLang === 'fa'
                    ? 'رومانی برای سال ۲۰۲۶ سهمیه‌ای معادل ۹۰,۰۰۰ کارگر جدید غیر اتحادیه اروپا تعیین کرده است (تصمیم دولت شماره ۱۱۶۹/۲۰۲۵)؛ طبق آمار خودِ IGI، در چهار ماه اول ۲۰۲۶ حدود ۴۹,۶۷۶ مجوز کار صادر شده که بخش عمده آن از نوع دائمی بوده است.'
                    : 'Romania set a quota of 90,000 new non-EU workers for 2026 (Government Decision 1169/2025); per IGI\'s own statistics, roughly 49,676 work permits were issued in the first four months of 2026, the large majority being permanent-worker permits.'}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          {/* NARRATIVE: THE REAL LABOR-MARKET FRICTION FOR NON-EU JOBSEEKERS */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🗣️</span>
              <span>{currentLang === 'fa' ? 'بزرگ‌ترین مانع واقعی برای کارجویان غیر اتحادیه اروپا' : 'The Real Biggest Barrier for Non-EU Jobseekers'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق گزارش‌های سازمانی درباره دسترسی اتباع خارجی به بازار کار رومانی (AIDA/ECRE)، «زبان» به‌صراحت به‌عنوان بزرگ‌ترین مانع دسترسی به بازار کار توصیف شده — کلاس‌های زبان رومانیایی رایگان دولتی اغلب در ساعات کاری برگزار می‌شوند (که برای شاغلان عملاً غیرقابل استفاده است)، و بسیاری از خدمات رسمی کاریابی فقط به زبان رومانیایی ارائه می‌شوند. این گزارش همچنین به وجود «گفتمان‌های بیگانه‌هراسانه» در برخی محیط‌های کاری اشاره می‌کند. توجه: این یافته مربوط به پناهندگان/دارندگان حمایت بین‌المللی است، اما به‌طور منطقی برای هر کارجوی غیر اتحادیه اروپا هم صادق است.'
                : 'Per reports on foreign nationals\' labor-market access in Romania (AIDA/ECRE), language is explicitly described as the biggest access barrier — free state Romanian classes are often scheduled during working hours (effectively unusable for employed people), and many official employment services are only offered in Romanian. The report also notes the presence of "xenophobic discourses" in some workplaces. Note: this specific finding is documented for refugees/international-protection holders, but it logically extends to any non-EU jobseeker.'}
            </p>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: AIDA/ECRE (asylumineurope.org). این سایت نتوانست آمار یا گزارش مشخصی درباره حضور یا برتری حرفه‌ای ایرانیان در بخش خاصی از بازار کار رومانی (مثل IT یا نفت‌وگاز) پیدا کند — پس چنین ادعایی را بدون منبع معتبر منتشر نمی‌کنیم.'
                : 'Sources: AIDA/ECRE (asylumineurope.org). This site could not find specific data or reports on Iranian professional presence or advantage in any particular sector of the Romanian labor market (e.g. IT or oil & gas) — so no such claim is published without a credible source.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'حداقل حقوق قانونی در رومانی چقدر است؟' : 'What is the minimum legal salary in Romania?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بر اساس تصمیم دولت شماره ۱۴۶/۲۰۲۶، حداقل حقوق ناخالص ۴,۳۲۵ لئو در ماه است که از ژوئیه ۲۰۲۶ در رومانی اعمال می‌شود.' : 'Per Government Decision 146/2026, the minimum gross salary is 4,325 RON per month, applicable from July 2026 in Romania.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا دانستن زبان رومانیایی برای استخدام الزامی است؟' : 'Is knowing the Romanian language mandatory for employment?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'اگرچه برای بسیاری از مشاغل بین‌المللی و شرکت‌های چندملیتی تسلط به زبان انگلیسی کافیست، اما دانستن زبان رومانیایی مزیت رقابتی بسیار بزرگی در کاریابی محسوب می‌شود.' : 'While English is sufficient for many international roles and multinational companies, proficiency in Romanian is a massive competitive advantage in finding a job.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'workinromania.gov.ro چیست و آیا خودم باید در آن ثبت‌نام کنم؟' : 'What is workinromania.gov.ro, and do I need to register on it myself?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'این سامانه دولتی (فعال از آگوست ۲۰۲۶) اجباری برای کارفرمایان و آژانس‌های کاریابی است که نیروی غیر اتحادیه اروپا استخدام می‌کنند؛ کارجو مستقیماً در آن ثبت‌نام نمی‌کند، اما خوب است بدانید کارفرمای آینده شما موظف است از این مسیر رسمی عبور کند.' : 'This government platform (active since August 2026) is mandatory for employers and staffing agencies hiring non-EU workers; job seekers don\'t register on it directly, but it\'s worth knowing your future employer is required to go through this official channel.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="work/finding-job" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'employment-contract':
    case 'contract':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="work/employment-contract" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قرارداد استخدام در رومانی' : 'Employment Contract in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: قانون کار رومانی (Legea 53/2003)، بازرسی کار رومانی (Inspecţia Muncii، inspectiamuncii.ro) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Romanian Labor Code (Legea 53/2003), Romanian Labor Inspection (Inspecţia Muncii, inspectiamuncii.ro) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'قرارداد استخدام در رومانی سند اصلی و رسمی است که حقوق، وظایف و شرایط کاری شما را تضمین می‌کند. بر اساس قانون کار رومانی (Codul Muncii)، هرگونه فعالیت کاری باید بر پایه یک قرارداد کتبی و رسمی استوار باشد که پیش از آغاز کار در سامانه ملی ثبت کارکنان (REVISAL) درج شده باشد. این قراردادها معمولاً شامل یک دوره آزمایشی مشخص (Perioada de Probă) هستند که طی آن هر دو طرف می‌توانند تناسب شغلی را ارزیابی کنند. نظارت بر اجرای صحیح این قراردادها مستقیماً بر عهده نهادی به نام بازرسی کار رومانی (Inspecția Muncii) است که از حقوق نیروی کار داخلی و خارجی محافظت می‌کند.'
              : 'An employment contract in Romania is the fundamental official document that guarantees your rights, duties, and working conditions. Based on the Romanian Labor Code (Codul Muncii), any employment activity must be founded on a formal written contract registered in the National Register of Employees (REVISAL) before work begins. These contracts typically include a designated probationary period (Perioada de Probă) allowing both parties to evaluate the occupational fit. The proper execution of these contracts is strictly overseen by the Romanian Labor Inspection (Inspecția Muncii), which protects the rights of both domestic and foreign workers.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'الزامات قانونی قرارداد و ثبت REVISAL' : 'Legal Contract Requirements & REVISAL Registration'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'طبق قانون کار رومانی (Legea 53/2003 – Codul Muncii)، هر قرارداد استخدام باید پیش از شروع فعالیت در سامانه ملی ثبت کارکنان (Registrul General de Evidenţă a Salariaţilor / REVISAL) ثبت شود.' : 'According to the Romanian Labor Code (Legea 53/2003 – Codul Muncii), every employment contract must be registered in the National Register of Employees (Registrul General de Evidenţă a Salariaţilor / REVISAL) prior to starting work.'}</li>
                <li><strong className="text-[#142033]">{currentLang === 'fa' ? 'مهلت دقیق: ' : 'Exact deadline: '}</strong>{currentLang === 'fa' ? 'کارفرما موظف است حداقل یک روز کاری پیش از شروع کار شما، ثبت REVISAL را انجام دهد.' : 'the employer must complete the REVISAL registration at least one working day before your first day of work.'}</li>
                <li>{currentLang === 'fa' ? 'در صورت به‌کارگیری فرد بدون ثبت قبلی، جریمه می‌تواند تا ۲۰,۰۰۰ لئو به‌ازای هر کارمند (سقف ۲۰۰,۰۰۰ لئو) برسد؛ اگر کارفرما ظرف ۴۸ ساعت جریمه را بپردازد، مبلغ به ۱۰,۰۰۰ لئو کاهش می‌یابد.' : 'Letting someone work without prior registration can carry a fine of up to 20,000 RON per employee (capped at 200,000 RON); paying within 48 hours reduces it to 10,000 RON.'}</li>
                <li>{currentLang === 'fa' ? 'کارفرما موظف است پیش از شروع کار، یک نسخه از قرارداد را به کارمند تحویل دهد.' : 'The employer is obligated to provide the employee with a copy of the contract before they commence work.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'دوره آزمایشی (Perioada de Probă)' : 'Probationary Period (Perioada de Probă)'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'در طول یک قرارداد استخدام، فقط یک دوره آزمایشی مجاز است، مگر در موارد استثنا (مثل شروع در سمت یا حرفه جدید نزد همان کارفرما، یا مشاغل با شرایط سخت/مضر/خطرناک).' : 'During an employment contract, only one probationary period is permitted, except in special cases (such as starting a new position/profession with the same employer, or jobs with difficult/harmful/dangerous conditions).'}</li>
                <li><strong className="text-[#142033]">{currentLang === 'fa' ? 'سقف قانونی (ماده ۳۱ قانون کار): ' : 'Legal maximum (Codul Muncii Art. 31): '}</strong>{currentLang === 'fa' ? 'حداکثر ۹۰ روز تقویمی برای مشاغل اجرایی معمولی، ۱۲۰ روز برای سمت‌های مدیریتی، و ۳۰ روز برای افراد دارای معلولیت.' : 'up to 90 calendar days for standard execution roles, 120 days for management positions, and 30 days for persons with disabilities.'}</li>
                <li>{currentLang === 'fa' ? 'دوره آزمایشی به‌عنوان سابقه کار محسوب می‌شود.' : 'The probationary period is counted as official employment history.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نظارت و مرجع رسمی' : 'Supervision and Official Authority'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بازرسی کار رومانی (Inspecţia Muncii) و ادارات منطقه‌ای آن (Inspectoratul Teritorial de Muncă) مرجع رسمی نظارت بر اجرای صحیح قراردادهای کار هستند.' : 'The Romanian Labor Inspection (Inspecţia Muncii) and its regional offices (Inspectoratul Teritorial de Muncă) are the official authorities overseeing the proper execution of labor contracts.'}</li>
                <li>{currentLang === 'fa' ? 'هرگونه تغییر در بندهای قرارداد در طول اجرای آن نیاز به الحاقیه رسمی (act adiţional) دارد، مگر در مواردی که قانون صراحتاً استثنا کرده باشد.' : 'Any modification to contract clauses during its execution requires a formal addendum (act adiţional), unless the law explicitly provides an exception.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          {/* BASIC LABOR RIGHTS EVERY FIRST-TIME EMPLOYEE SHOULD KNOW */}
          <div className="bg-[#f0f4f9] p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>📋</span>
              <span>{currentLang === 'fa' ? 'حقوق پایه‌ای کار که هر کارمند تازه‌وارد باید بداند' : 'Basic Labor Rights Every First-Time Employee Should Know'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'مرخصی سالانه (ماده ۱۴۵)' : 'Annual Leave (Art. 145)'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'حداقل ۲۰ روز کاری مرخصی استحقاقی با حقوق در سال، طبق قانون کار.' : 'A statutory minimum of 20 paid working days of annual leave per year.'}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'سقف ساعات کاری (ماده ۱۱۴)' : 'Working Hours Cap (Art. 114)'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'حداکثر ۴۸ ساعت در هفته شامل اضافه‌کاری (معمولاً ۴۰ ساعت + حداکثر ۸ ساعت اضافه‌کاری)، به‌طور میانگین در بازه ۴ ماهه.' : 'Up to 48 hours/week including overtime (typically 40h + up to 8h OT), averaged over a 4-month reference period.'}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'مهلت اطلاع فسخ (ماده ۷۵ و ۸۱)' : 'Notice Period (Art. 75 & 81)'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'استعفای کارمند: حداکثر ۲۰ روز کاری برای مشاغل اجرایی (تا ۴۵ روز برای مدیریت)؛ اخراج غیرانضباطی توسط کارفرما: حداقل ۲۰ روز کاری اطلاع قبلی.' : 'Employee resignation: up to 20 working days for execution roles (up to 45 for management); employer non-disciplinary termination: minimum 20 working days\' notice.'}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'حداقل سن اشتغال' : 'Minimum Employment Age'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? '۱۶ سال برای اشتغال تمام‌وقت؛ از ۱۵ سالگی با رضایت والدین/سرپرست قانونی فقط برای کارهای متناسب با سن.' : '16 for full-time employment; from age 15 with parental/guardian consent, only for age-appropriate work.'}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentLang === 'fa' ? 'منبع: قانون کار رومانی (Codul Muncii) — مواد ۳۱، ۷۵، ۸۱(۴)، ۱۱۴، ۱۴۵.' : 'Source: Romanian Labor Code (Codul Muncii) — Articles 31, 75, 81(4), 114, 145.'}
            </p>
          </div>

          {/* NARRATIVE: REAL LABOR-RIGHTS VIOLATIONS & ENFORCEMENT REALITY */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🚧</span>
              <span>{currentLang === 'fa' ? 'موارد واقعی نقض حقوق کار خارجیان — و آنچه بازرسی کار انجام می‌دهد' : 'Real Documented Labor-Rights Violations — and What the Labor Inspection Does About It'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'قوانین کار بالا روی کاغذ محکم هستند، اما گزارش‌های خبری نشان می‌دهند برخی کارفرمایان، به‌ویژه در بخش‌های ساخت‌وساز و خدماتی، این قوانین را رعایت نمی‌کنند. طبق تحقیق Business & Human Rights Centre (بر پایه گزارش Beet/Meduza، آوریل ۲۰۲۳)، ۱۱ کارگر نپالی ماه‌ها بدون حقوق کار کردند و کارفرما برای فسخ قرارداد از آن‌ها پول مطالبه کرد؛ ۴ نفر دیگر اجاره‌ای دو برابر نرخ بازار از حقوقشان کسر شده داشتند. طبق گزارش الجزیره (دسامبر ۲۰۲۳)، یک کارگر سریلانکایی ۳٬۰۰۰ یورو کارمزد آژانس پرداخت کرده بود اما فقط ۵۰۰ یورو در ماه (به‌جای ۸۰۰ یورو وعده‌داده‌شده) دریافت می‌کرد؛ NGO ضدقاچاق eLiberare هم از شرایط «وخیم» کارگران سریلانکایی در یک کارخانه گوشت خبر داده است.'
                : 'The labor laws above are solid on paper, but news investigations show some employers — particularly in construction and service sectors — don\'t follow them. Per the Business & Human Rights Centre (based on a Beet/Meduza investigation, April 2023), 11 Nepali workers went unpaid for months, with their employer demanding money to let them break their contracts; 4 others had rent deducted at roughly double the market rate. Per Al Jazeera (December 2023), one Sri Lankan worker paid a €3,000 agency fee but received only €500/month against a promised €800; anti-trafficking NGO eLiberare also reported "terrible" conditions for Sri Lankan workers at a meat-processing factory.'}
            </p>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'خبر خوب: بازرسی کار واقعاً وارد عمل می‌شود' : 'The good news: the Labor Inspection does act'}</strong>
              {currentLang === 'fa'
                ? 'طبق گزارش Gandul.ro، در یک کارزار هدفمند (۲۸ ژوئیه تا ۱ آگوست ۲۰۲۵)، بازرسی کار (Inspecția Muncii) بیش از ۱٬۰۰۰ بازرسی از کارفرمایان دارای کارگر خارجی انجام داد: از ۶۵۸ بازرسی روابط کاری، ۲۰۷ مورد جریمه شدند؛ از ۴۲۹ بازرسی ایمنی، ۴۲۳ مورد جریمه شدند؛ ۶۴ کارگر غیرقانونی (۴۰ نفر خارجی) کشف شد؛ مجموع جرایم بیش از ۲ میلیون لئو بود و ۲ محل کار تعطیل شدند. اگر کارفرمای شما قرارداد کتبی رسمی به شما نداد یا شرایط قانونی بالا را رعایت نکرد، می‌توانید شکایت را به دفتر منطقه‌ای بازرسی کار (Inspectoratul Teritorial de Muncă) گزارش دهید.'
                : 'Per Gandul.ro, in one targeted campaign (July 28 – August 1, 2025), the Labor Inspection (Inspecția Muncii) ran over 1,000 inspections of employers with foreign workers: of 658 labor-relations checks, 207 resulted in sanctions; of 429 safety checks, 423 resulted in sanctions; 64 undeclared workers were found (40 foreign nationals); total fines exceeded 2 million RON and 2 workplaces were suspended. If your employer doesn\'t give you a formal written contract or doesn\'t follow the legal requirements above, you can report it to your regional Labor Inspection office (Inspectoratul Teritorial de Muncă).'}
            </div>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'یک تغییر قانونی مهم دیگر از OUG 32/2026: قراردادهای کاری که به زبان رومانیایی تنظیم نشده باشند، جریمه‌ای تا ۶٬۰۰۰ لئو به‌ازای هر تخلف برای کارفرما دارد — یعنی شما حق دارید یک نسخه رومانیایی رسمی از قرارداد خود بخواهید، حتی اگر نسخه انگلیسی یا فارسی هم به شما داده شده باشد.'
                : 'One more important regulatory change from OUG 32/2026: employment contracts not drafted in Romanian carry a fine of up to 6,000 RON per violation for the employer — meaning you have the right to request an official Romanian-language version of your contract, even if you were also given an English or Persian copy.'}
            </p>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: Business & Human Rights Centre، Al Jazeera، Gandul.ro، PwC Romania (تحلیل OUG 32/2026). موارد بالا مربوط به کارگران نپالی و سریلانکایی است، نه لزوماً ایرانی — اما الگوی سوءاستفاده و راهکار قانونی شکایت برای هر تبعه خارجی یکسان است.'
                : 'Sources: Business & Human Rights Centre, Al Jazeera, Gandul.ro, PwC Romania (OUG 32/2026 analysis). The cases above concern Nepali and Sri Lankan workers, not necessarily Iranian ones — but the abuse pattern and the legal complaint route are the same for any foreign national.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا قرارداد کاری می‌تواند بیش از یک دوره آزمایشی داشته باشد؟' : 'Can an employment contract have more than one probationary period?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'اصولاً فقط یک دوره آزمایشی مجاز است، مگر در موارد خاص مانند ارتقاء شغلی یا تغییر سمت نزد همان کارفرما. سقف قانونی ۹۰ روز (اجرایی) یا ۱۲۰ روز (مدیریتی) است.' : 'Generally, only one probationary period is permitted, except in special cases like a promotion or changing positions with the same employer. The legal cap is 90 days (execution roles) or 120 days (management).'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر شرایط کارم تغییر کند چه اتفاقی می‌افتد؟' : 'What happens if my working conditions change?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'هرگونه تغییر در حقوق و دستمزد یا شرایط اصلی کار باید از طریق ثبت و امضای یک الحاقیه رسمی (act adițional) انجام شود.' : 'Any changes to your salary or main working conditions must be recorded and signed through a formal addendum (act adițional).'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'کارفرما تا کی باید مرا در REVISAL ثبت کند؟' : 'By when must my employer register me in REVISAL?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'حداقل یک روز کاری پیش از شروع کار شما. کار کردن بدون این ثبت قبلی، کارفرما را مشمول جریمه‌ای تا ۲۰,۰۰۰ لئو به‌ازای هر کارمند می‌کند.' : 'At least one working day before your first day of work. Letting you work without this prior registration exposes the employer to a fine of up to 20,000 RON per employee.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر کارفرمایم حقوقم را ندهد یا شرایط قرارداد را نقض کند چه کار کنم؟' : 'What if my employer doesn\'t pay me or violates my contract terms?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'می‌توانید شکایت را مستقیماً به دفتر منطقه‌ای بازرسی کار (Inspectoratul Teritorial de Muncă) گزارش دهید؛ این نهاد کارزارهای بازرسی مشخصی برای کارفرمایان دارای کارگر خارجی دارد و جرایم واقعی صادر می‌کند.' : 'You can report it directly to your regional Labor Inspection office (Inspectoratul Teritorial de Muncă); this authority runs targeted inspection campaigns for employers of foreign workers and does issue real fines.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا حق دارم نسخه رومانیایی رسمی از قراردادم داشته باشم؟' : 'Am I entitled to an official Romanian-language version of my contract?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله. طبق OUG 32/2026، قراردادهایی که به زبان رومانیایی تنظیم نشوند برای کارفرما جریمه‌ای تا ۶٬۰۰۰ لئو به‌ازای هر تخلف دارند؛ همیشه یک نسخه رومانیایی رسمی درخواست کنید، حتی اگر ترجمه انگلیسی یا فارسی هم داشته باشید.' : 'Yes. Under OUG 32/2026, contracts not drafted in Romanian carry a fine of up to 6,000 RON per violation for the employer; always request an official Romanian-language version, even if you also have an English or Persian translation.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="work/employment-contract" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'taxes-salaries':
    case 'tax':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="work/taxes-salaries" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'حقوق و مالیات' : 'Salary and Taxes'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: سازمان امور مالیاتی رومانی (ANAF)، قانون مالیاتی رومانی (Codul Fiscal) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Romanian National Agency for Fiscal Administration (ANAF), Romanian Fiscal Code (Codul Fiscal) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'سیستم پرداخت حقوق و مالیات بر درآمد در رومانی بر پایه کسر مستقیم از مبدأ بنا شده است؛ به این معنا که کارفرما موظف است تمام کسورات قانونی اعم از مالیات بر درآمد و حق بیمه‌های سلامت و بازنشستگی را پیش از واریز حقوق، محاسبه و مستقیماً به سازمان امور مالیاتی رومانی (ANAF) پرداخت کند. حقوقی که در قرارداد کار ذکر می‌شود، در واقع حقوق ناخالص (Salariu Brut) است، اما مبلغ نهایی که به حساب بانکی شما واریز می‌گردد، حقوق خالص (Net) خواهد بود. درک این تفاوت و آگاهی از سهم بیمه‌ها برای برنامه‌ریزی مالی هر فرد شاغل در رومانی از اهمیت بالایی برخوردار است.'
              : 'The salary and income tax system in Romania operates on a direct withholding basis; meaning the employer is obligated to calculate and pay all statutory deductions—including income tax, health, and pension insurance contributions—directly to the National Agency for Fiscal Administration (ANAF) before transferring your pay. The salary stated in your employment contract is actually the gross salary (Salariu Brut), while the final amount deposited into your bank account is the net salary (Net). Understanding this difference and the exact contribution rates is crucial for the financial planning of anyone working in Romania.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'کسورات قانونی از حقوق' : 'Statutory Salary Deductions'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'از حقوق ناخالص (Salariu Brut) هر کارمند سه کسر اجباری انجام می‌شود: مالیات بر درآمد ۱۰٪، سهم بازنشستگی (CAS) ۲۵٪، و سهم بیمه سلامت (CASS) ۱۰٪.' : 'Three mandatory deductions are made from each employee\'s gross salary (Salariu Brut): 10% income tax, 25% pension contribution (CAS), and 10% health insurance contribution (CASS).'}</li>
                <li>{currentLang === 'fa' ? 'این کسورات توسط کارفرما محاسبه و مستقیماً به سازمان امور مالیاتی (ANAF) پرداخت می‌شود؛ کارمند حقوق خالص (Net) را دریافت می‌کند.' : 'These deductions are calculated by the employer and paid directly to the National Agency for Fiscal Administration (ANAF); the employee receives the net salary (Net).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'سهم کارفرما' : 'Employer Contributions'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'علاوه بر کسورات کارمند، کارفرما موظف است سهم بیمه کار (CAM) به میزان ۲.۲۵٪ روی حقوق ناخالص بپردازد که صرف بیمه بیکاری و حوادث کاری می‌شود.' : 'In addition to employee deductions, the employer is obligated to pay a 2.25% work insurance contribution (CAM) on the gross salary, covering unemployment and workplace accidents.'}</li>
                <li>{currentLang === 'fa' ? 'حقوق خالص معمولاً حدود ۵۷ تا ۶۰ درصد حقوق ناخالص است.' : 'The net salary is typically around 57 to 60 percent of the gross salary.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'تکالیف اظهارنامه' : 'Declaration Obligations'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کارفرما موظف است هرماه اظهارنامه ۱۱۲ (Declarația 112) شامل کسورات و بیمه کارکنان را به‌صورت الکترونیکی به ANAF ارسال کند.' : 'The employer must electronically submit Declaration 112 (Declarația 112), detailing employee deductions and insurance, to ANAF on a monthly basis.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950 leading-relaxed">
            <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'توضیح در مورد پیلار دوم بازنشستگی خصوصی' : 'Clarification: Pillar II Private Pension'}</strong>
            {currentLang === 'fa'
              ? 'ممکن است شنیده باشید که مشارکت در «پیلار دوم» بازنشستگی خصوصی از ژانویه ۲۰۲۵ اجباری شده است. این یک کسر جداگانه و اضافه بر ۲۵٪ سهم CAS نیست؛ بخشی از همان ۲۵٪ (در حال حاضر حدود ۴.۷۵ درصد از کل ۲۵٪) به‌طور خودکار به حساب شخصی پیلار دوم شما هدایت می‌شود و باقی‌مانده صرف صندوق عمومی بازنشستگی (پیلار اول) می‌گردد. یعنی مجموع سهم بازنشستگی از حقوق شما همان ۲۵٪ باقی می‌ماند.'
              : 'You may have heard that Pillar II private pension participation became mandatory from January 2025. This is not a separate, additional deduction on top of the 25% CAS contribution; a portion of that same 25% (currently around 4.75 percentage points) is automatically redirected to your individual Pillar II account, with the rest funding the public Pillar I pension system. Your total pension contribution from salary stays 25%.'}
          </div>

          {/* NARRATIVE: THE IRAN-ROMANIA DOUBLE TAXATION TREATY — A GENUINELY REASSURING FACT */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🤝</span>
              <span>{currentLang === 'fa' ? 'اگر همچنان درآمدی از ایران دارید: خبر خوب درباره مالیات مضاعف' : 'If You Still Have Income From Iran: Good News on Double Taxation'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر ملک اجاره‌ای، کسب‌وکار خانوادگی یا مشتریان فریلنس در ایران دارید در حالی که در رومانی مقیم مالیاتی هستید، نگران مالیات مضاعف نباشید: بین ایران و رومانی یک «موافقت‌نامه اجتناب از اخذ مالیات مضاعف» واقعی و فعال وجود دارد. این توافق در ۳ اکتبر ۲۰۰۱ امضا، با قانون شماره ۲۷۹/۲۰۰۲ توسط رومانی تصویب، و از ۱ ژانویه ۲۰۰۸ لازم‌الاجرا شده است — صفحه رسمی آن هنوز روی سایت سازمان امور مالیاتی رومانی (ANAF) در دسترس است. اصل کلی این نوع توافق‌ها این است که کشور محل اقامت مالیاتی شما (اینجا: رومانی، اگر بیش از ۱۸۳ روز در سال آنجا باشید یا مرکز منافع حیاتی‌تان آنجا باشد) باید مالیات پرداخت‌شده در کشور دیگر را از طریق اعتبار مالیاتی یا معافیت، از مالیات نهایی شما کسر کند — یعنی روی یک درآمد دوبار به‌طور کامل مالیات پرداخت نمی‌کنید.'
                : 'If you have rental property, a family business, or freelance clients in Iran while being a Romanian tax resident, don\'t worry about double taxation: a real, active double-taxation avoidance treaty exists between Iran and Romania. It was signed October 3, 2001, ratified by Romania under Law 279/2002, and has been in force since January 1, 2008 — its official page is still live on the Romanian tax authority\'s (ANAF) website. The general principle of this kind of treaty is that your tax-residence country (here: Romania, if you spend over 183 days/year there or your center of vital interests is there) must credit or exempt tax already paid in the other country from your final bill — meaning you don\'t pay full tax twice on the same income.'}
            </p>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: صفحه رسمی ANAF برای ایران (static.anaf.ro)، فهرست تلفیقی noulcodfiscal.ro و infofisc.ro. جزئیات دقیق ماده‌به‌ماده این توافق (مثلاً روش دقیق اعمال آن برای هر نوع درآمد خاص) در این صفحه پوشش داده نشده — برای پرونده شخصی خود حتماً با یک مشاور مالیاتی متخصص در قوانین بین‌المللی مشورت کنید.'
                : 'Sources: official ANAF page for Iran (static.anaf.ro), consolidated lists at noulcodfiscal.ro and infofisc.ro. The precise article-by-article details of the treaty (e.g. exactly how it applies to each specific income type) are not covered on this page — consult a tax advisor specializing in international law for your specific case.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'تفاوت حقوق ناخالص و خالص چقدر است؟' : 'What is the difference between gross and net salary?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'پس از کسر مالیات و بیمه‌های اجباری، حقوق خالصی که دریافت می‌کنید معمولاً حدود ۵۷ تا ۶۰ درصد حقوق ناخالص قرارداد شما خواهد بود.' : 'After mandatory tax and insurance deductions, the net salary you receive is typically around 57% to 60% of your gross contract salary.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا کارمند باید مالیات خود را جداگانه به دولت بپردازد؟' : 'Does the employee have to pay their taxes separately to the government?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، نیازی به پرداخت جداگانه نیست؛ تمام کسورات قانونی برای کارمندان مستقیماً توسط کارفرما محاسبه، کسر و به اداره مالیات پرداخت می‌شود.' : 'No, separate payment is not required; all statutory deductions for employees are calculated, withheld, and paid directly to the tax authorities by the employer.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا پیلار دوم بازنشستگی سهم CAS من را افزایش می‌دهد؟' : 'Does Pillar II increase my CAS contribution?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. پیلار دوم بخشی از همان سهم ۲۵٪ CAS است که به یک حساب شخصی هدایت می‌شود، نه کسر اضافه.' : 'No. Pillar II is a carve-out within the same 25% CAS contribution redirected to a personal account, not an additional deduction.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر همچنان درآمدی از ایران داشته باشم، آیا هم در ایران و هم در رومانی مالیات می‌دهم؟' : 'If I still have income from Iran, will I be taxed in both Iran and Romania?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، نه به‌طور کامل. یک موافقت‌نامه اجتناب از مالیات مضاعف بین ایران و رومانی از سال ۲۰۰۸ فعال است (قانون ۲۷۹/۲۰۰۲)؛ کشور محل اقامت مالیاتی شما باید مالیات پرداخت‌شده در کشور دیگر را از طریق اعتبار یا معافیت مالیاتی لحاظ کند. برای پرونده شخصی خود با یک مشاور مالیاتی متخصص مشورت کنید.' : 'No, not fully. A double-taxation avoidance treaty between Iran and Romania has been in force since 2008 (Law 279/2002); your tax-residence country must credit or exempt tax already paid in the other country. Consult a specialized tax advisor for your specific case.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="work/taxes-salaries" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'insurance':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="work/insurance" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'بیمه' : 'Insurance'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: سازمان ملی بیمه سلامت رومانی (CNAS)، سازمان ملی بازنشستگی عمومی (CNPP) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: National Health Insurance House (CNAS), National Public Pension House (CNPP) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'نظام بیمه سلامت و بازنشستگی در رومانی، چتر حمایتی جامعی برای نیروی کار شاغل در این کشور فراهم می‌کند. هر فردی که با یک قرارداد رسمی در رومانی مشغول به کار است، با کسر خودکار سهم بیمه سلامت (CASS) و سهم بیمه بازنشستگی (CAS) از حقوق ماهیانه‌اش، تحت پوشش بیمه عمومی دولت (مجموعه‌های CNAS و CNPP) قرار می‌گیرد. با داشتن این بیمه و دریافت کارت ملی بیمه سلامت، کارمندان خارجی نیز درست همانند شهروندان رومانیایی حق دسترسی مستقیم به خدمات درمانی عمومی را پیدا می‌کنند و سوابق بازنشستگی آن‌ها به‌صورت رسمی و قانونی ثبت می‌شود.'
              : 'The health and pension insurance system in Romania provides a comprehensive safety net for the workforce in the country. Anyone legally employed in Romania with a formal contract automatically falls under the coverage of the state public insurance network (CNAS and CNPP authorities) through mandatory monthly salary deductions for health (CASS) and pension (CAS). By contributing to this system and obtaining the National Health Insurance Card, foreign employees gain the exact same right to directly access public medical services as Romanian citizens, while their pension history is officially and legally recorded.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'بیمه سلامت خودکار' : 'Automatic Health Insurance'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'هر فردی که در رومانی به‌صورت قانونی استخدام باشد و سهم CASS از حقوقش کسر شود، به‌طور خودکار تحت پوشش بیمه سلامت عمومی (Casa Națională de Asigurări de Sănătate / CNAS) قرار می‌گیرد.' : 'Anyone legally employed in Romania with the CASS contribution deducted from their salary is automatically covered by the public health insurance system (Casa Națională de Asigurări de Sănătate / CNAS).'}</li>
                <li>{currentLang === 'fa' ? 'کارت ملی بیمه سلامت (Cardul Național de Asigurări de Sănătate) برای دریافت خدمات درمانی در مراکز طرف‌قرارداد استفاده می‌شود.' : 'The National Health Insurance Card (Cardul Național de Asigurări de Sănătate) is used to access medical services at contracted facilities.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'بیمه بازنشستگی' : 'Pension Insurance'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سهم CAS کسرشده از حقوق به صندوق ملی بازنشستگی عمومی (Casa Națională de Pensii Publice / CNPP) واریز می‌شود و سابقه بیمه بازنشستگی فرد را می‌سازد.' : 'The CAS contribution deducted from the salary is deposited into the National Public Pension House (Casa Națională de Pensii Publice / CNPP), building the individual\'s pension history.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'وضعیت افراد بدون قرارداد کاری' : 'Status of Non-Employees'}</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'افرادی که کارمند نیستند نیز می‌توانند با ارائه اظهارنامه واحد (Declarația Unică / فرم D212) به‌صورت داوطلبانه در سیستم بیمه سلامت ثبت‌نام کنند.' : 'Non-employees can also voluntarily enroll in the health insurance system by submitting the Single Declaration (Declarația Unică / Form D212).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          {/* PRIVATE SUPPLEMENTAL INSURANCE — NAMED PROVIDERS */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏥</span>
              <span>{currentLang === 'fa' ? 'بیمه تکمیلی خصوصی — گزینه‌های واقعی' : 'Private Supplemental Insurance — Real Options'}</span>
            </h2>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'بیمه دولتی CNAS خدمات پایه و اورژانسی را پوشش می‌دهد، اما نوبت‌دهی طولانی در بخش دولتی رایج است. بسیاری از کارمندان (و برخی کارفرمایان به‌عنوان مزیت شغلی) در یکی از شبکه‌های بیمه/کلینیک خصوصی زیر عضو می‌شوند تا به نوبت‌دهی سریع‌تر و پزشک انتخابی دسترسی داشته باشند:'
                : 'State CNAS insurance covers basic and emergency care, but long wait times in the public system are common. Many employees (and some employers, as a job perk) also subscribe to one of the private clinic/insurance networks below for faster appointments and choice of doctor:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#526174]">
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">Regina Maria</strong></div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">MedLife</strong></div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">Sanador</strong></div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl"><strong className="text-[#142033]">Medicover</strong></div>
            </div>
            <div className="p-4 bg-[#eef3f8] rounded-xl text-xs sm:text-sm text-[#142033]">
              {currentLang === 'fa'
                ? 'بازه هزینه تقریبی اشتراک فردی: از حدود ۸۰-۱۴۰ لئو در ماه برای پلن پایه، تا ۳۶۰-۵۶۰+ لئو در ماه برای پلن‌های پیشرفته (برخی ارائه‌دهندگان مانند Medicover قیمت‌گذاری یورویی هم دارند، حدود ۲۹-۷۲ یورو در ماه). این ارقام تقریبی و بر اساس سایت‌های مقایسه‌گر است — پیش از تصمیم‌گیری، لیست قیمت رسمی هر ارائه‌دهنده را مستقیماً بررسی کنید.'
                : 'Rough individual subscription cost range: about 80–140 RON/month for entry-tier plans, up to 360–560+ RON/month for premium tiers (some providers like Medicover price in EUR, roughly €29–72/month). These figures come from comparison sites and are approximate — check each provider\'s official current price list before deciding.'}
            </div>
          </div>

          {/* NARRATIVE: REAL CNAS ACCESS FRICTION + PENSION TOTALIZATION REALITY */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🩺</span>
              <span>{currentLang === 'fa' ? 'واقعیت گزارش‌شده دریافت کارت بیمه سلامت به‌عنوان خارجی' : 'The Reported Reality of Getting Your Health Card as a Foreigner'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'روی کاغذ، بیمه CASS برای همه کارمندان با قرارداد رسمی خودکار است. اما در انجمن‌های مهاجران (مثل Expat.com)، برخی خارجیان گزارش داده‌اند که وقتی برای کارت ملی بیمه سلامت فیزیکی مراجعه کرده‌اند، اداره CNAS محلی به آن‌ها گفته «فعلاً به اتباع خارجی کارت صادر نمی‌شود» — یک کاربر گزارش داد از سال ۲۰۱۵ در لیست انتظار مانده است. راه‌حل موقتی که اغلب استفاده می‌شود، دریافت یک «Adeverință» (گواهی بیمه) با اعتبار ۳ ماهه قابل تمدید است که باید مکرراً از اداره تمدید شود؛ برخی داروخانه‌ها و پزشکان این گواهی را به‌جای کارت فیزیکی می‌پذیرند، برخی دیگر خیر. این گزارش‌ها از انجمن‌های عمومی است، نه آمار رسمی — اما نشان می‌دهد بهتر است از همان روز اول کار، این گواهی موقت را از اداره محلی CNAS بگیرید و آن را همراه داشته باشید، به‌جای اینکه منتظر کارت فیزیکی بمانید.'
                : 'On paper, CASS insurance is automatic for any employee with a formal contract. But on migrant forums (like Expat.com), some foreigners have reported that when they went in person for the physical National Health Insurance Card, their local CNAS office told them "no cards have been issued to foreign citizens at present" — one user reported being on a waitlist since 2015. The common workaround is a renewable 3-month "Adeverință" (insurance certificate) that must be re-collected from the office repeatedly; some pharmacies and doctors accept this certificate in place of the physical card, others don\'t. These are forum reports, not official statistics — but they suggest getting this temporary certificate from your local CNAS office from your first day of work, and keeping it on hand, rather than waiting for the physical card.'}
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-[#142033] leading-relaxed">
              <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'اگر روزی برای همیشه از رومانی بروید: چه اتفاقی برای سهم بازنشستگی می‌افتد؟' : 'If you eventually leave Romania for good: what happens to your pension contributions?'}</strong>
              {currentLang === 'fa'
                ? 'طبق فهرست رسمی توافق‌نامه‌های دوجانبه تامین اجتماعی سازمان ملی بازنشستگی رومانی (CNPP)، این سازمان فقط با ارمنستان، روسیه، اوکراین، بلاروس (کنوانسیون دوران شوروی ۱۹۶۰) و چند کشور دیگر (مثل آمریکا از ۲۰۲۳) توافق «تجمیع بیمه» (Totalization) دارد — ایران در این فهرست نیست. یعنی سهم CAS که در رومانی پرداخت می‌کنید، به‌طور خودکار به بازنشستگی ایران منتقل یا محاسبه نمی‌شود. این سایت نتوانست منبع رسمی روشنی پیدا کند که دقیقاً چه اتفاقی برای این سهم می‌افتد اگر شخص رومانی را برای همیشه ترک کند و به حداقل ۱۵ سال سابقه بیمه نرسیده باشد (آیا این سهم برای همیشه از دست می‌رود یا به‌صورت غیرفعال باقی می‌ماند) — برای وضعیت دقیق خودتان مستقیماً با CNPP تماس بگیرید.'
                : 'Per the official bilateral social-security agreement list of Romania\'s National Pension House (CNPP), it only has "totalization" agreements with Armenia, Russia, Ukraine, Belarus (a 1960 Soviet-era convention), and a few other countries (e.g. the US since 2023) — Iran is not on this list. That means the CAS contributions you pay in Romania are not automatically transferred to or counted toward an Iranian pension. This site could not find a clear official source on exactly what happens to those contributions if someone leaves Romania permanently without reaching the minimum 15-year vesting period (whether they are forfeited or remain a dormant entitlement) — contact CNPP directly for your specific situation.'}
            </div>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: انجمن Expat.com (گزارش کاربران، نه آمار رسمی)، فهرست رسمی توافق‌های دوجانبه CNPP (cnpp.ro).'
                : 'Sources: Expat.com forum (user reports, not official statistics), official CNPP bilateral agreements list (cnpp.ro).'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا دریافت خدمات درمانی با بیمه کارمندی رایگان است؟' : 'Are medical services free with employee health insurance?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'در بیمارستان‌ها و کلینیک‌های دولتی یا خصوصیِ طرف قرارداد با CNAS، خدمات پایه و اورژانسی عموماً رایگان یا با پوشش بسیار بالایی ارائه می‌شوند.' : 'In public hospitals and private clinics contracted with CNAS, basic and emergency services are generally free or highly subsidized.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر کارمند نباشم، آیا می‌توانم بیمه دولتی داشته باشم؟' : 'Can I get state insurance if I am not an employee?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، افراد بدون قرارداد کاری نیز می‌توانند از طریق ارسال اظهارنامه واحد (Declarația Unică) و پرداخت حق بیمه معادل، به‌صورت داوطلبانه خود را بیمه کنند.' : 'Yes, non-employees can voluntarily enroll in the health insurance system by submitting the Single Declaration (Declarația Unică) and paying the equivalent premium.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا بیمه خصوصی جایگزین بیمه دولتی CASS می‌شود؟' : 'Does private insurance replace mandatory state CASS insurance?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. بیمه خصوصی همیشه مکمل است، نه جایگزین؛ سهم CASS از حقوق شما همچنان طبق قانون کسر می‌شود، فارغ از اینکه اشتراک خصوصی هم داشته باشید یا نه.' : 'No. Private insurance is always supplemental, never a substitute; the CASS contribution is still deducted from your salary by law regardless of whether you also hold a private subscription.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر اداره CNAS به من گفت کارت فیزیکی صادر نمی‌شود چه کنم؟' : 'What if my CNAS office tells me physical cards aren\'t being issued?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برخی خارجیان این تجربه را در انجمن‌های مهاجران گزارش کرده‌اند. در این حالت، گواهی موقت بیمه (Adeverință) با اعتبار ۳ ماهه قابل تمدید را از همان اداره درخواست کنید و آن را همراه داشته باشید تا زمانی که کارت فیزیکی صادر شود.' : 'Some foreigners have reported this experience on migrant forums. In that case, request the temporary insurance certificate (Adeverință), valid for a renewable 3 months, from the same office and keep it on hand until the physical card is issued.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا سهم بازنشستگی من در رومانی به بازنشستگی ایران منتقل می‌شود؟' : 'Do my Romanian pension contributions transfer to an Iranian pension?'}</h3>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. رومانی هیچ توافق «تجمیع بیمه بازنشستگی» با ایران ندارد (طبق فهرست رسمی CNPP)؛ سهم CAS شما فقط در سیستم بازنشستگی رومانی محاسبه می‌شود.' : 'No. Romania has no pension "totalization" agreement with Iran (per the official CNPP list); your CAS contributions only count within the Romanian pension system.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="work/insurance" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    default:
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          {/* 1. HERO PANEL */}
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'کار و کسب‌وکار در رومانی' : 'Work & Business in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'راهنمای جامع بازار کار، دریافت مجوز کار، راه‌اندازی شرکت و مالیات و بیمه در رومانی.' 
                : 'Comprehensive guide to the job market, work permits, business registration, taxes, and insurance.'}
            </p>
          </div>

          {/* 2. WHICH SITUATION ARE YOU IN? (کدام وضعیت شمایید؟) */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🎯</span>
              <span>{currentLang === 'fa' ? 'کدام وضعیت شمایید؟ (انتخاب سریع مسیر)' : 'Which situation matches your goal?'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/work/finding-job" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🔍</span>
                  <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'به دنبال کار هستم' : 'I am looking for a job'}
                  </h3>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'سایت‌های کاریابی رومانی و رزومه‌نویسی پوزیشنی.' : 'Job search portals & CV standards.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'راهنمای پیدا کردن کار ←' : 'Job Search Guide →'}
                </span>
              </Link>

              <Link href="/work/work-permit" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">📄</span>
                  <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'مجوز کار لازم دارم' : 'I need a Work Permit'}
                  </h3>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'فرآیند صدور Aviz de Muncă توسط کارفرما نزد IGI.' : 'Employer application for Aviz de Muncă at IGI.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'مراحل مجوز کار ←' : 'Work Permit Steps →'}
                </span>
              </Link>

              <Link href="/company/registration" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🏢</span>
                  <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'می‌خواهم کسب‌وکار راه‌اندازی کنم' : 'I want to start a business'}
                  </h3>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'ثبت شرکت (SRL) در ONRC و اخذ سرمایه‌گذاری.' : 'SRL company setup via ONRC registry.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'راهنمای ثبت شرکت ←' : 'Company Formation Guide →'}
                </span>
              </Link>

              <Link href="/work/taxes-salaries" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'درباره مالیات و حقوق می‌پرسم' : 'Tax & Salary Info'}
                  </h3>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'محاسبه حقوق خالص و مالیات ۱۰٪ درآمد.' : 'Calculating net wage & 10% income tax.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'محاسبه حقوق و مالیات ←' : 'Taxes & Salary Calculator →'}
                </span>
              </Link>

              <Link href="/work/insurance" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🏥</span>
                  <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'درباره بیمه کاری و درمانی می‌پرسم' : 'Work & Health Insurance'}
                  </h3>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'سهم بیمه CASS و پوشش خدمات پزشکی.' : 'CASS contribution & medical rights.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'قوانین بیمه کارمندی ←' : 'Employee Insurance Rules →'}
                </span>
              </Link>
            </div>
          </div>

          {/* 3. WHERE SHOULD I START? (از کجا شروع کنم؟ - DECISION HELPER) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border border-blue-100 space-y-4">
            <h2 className="text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>💡</span>
              <span>{currentLang === 'fa' ? 'از کجا شروع کنم؟ (راهنمای تصمیم‌گیری)' : 'Where Should I Start? (Decision Helper)'}</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#526174]">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED] font-bold">▪</span>
                <span>
                  {currentLang === 'fa' ? 'در جستجوی موقعیت شغلی مناسب در رومانی هستید؟ ' : 'Looking for job opportunities in Romania? '}
                  <Link href="/work/finding-job" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'راهنمای پیدا کردن کار و ارسال رزومه را ببینید ←' : 'See job search & CV guide →'}
                  </Link>
                </span>
              </div>
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED] font-bold">▪</span>
                <span>
                  {currentLang === 'fa' ? 'پیشنهاد کاری (Job Offer) دریافت کرده‌اید و مجوز کار می‌خواهید؟ ' : 'Received a job offer and need a work permit? '}
                  <Link href="/work/work-permit" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'مراحل صدور مجوز کار (Aviz de Muncă) را ببینید ←' : 'See Aviz de Muncă work permit guide →'}
                  </Link>
                </span>
              </div>
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED] font-bold">▪</span>
                <span>
                  {currentLang === 'fa' ? 'می‌خواهید کسب‌وکار و شرکت شخصی خودتان را داشته باشید؟ ' : 'Want to incorporate your own business in Romania? '}
                  <Link href="/company/registration" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'راهنمای کامل ثبت شرکت (SRL) را ببینید ←' : 'See company registration guide →'}
                  </Link>
                </span>
              </div>
            </div>
          </div>

          {/* 4. PATHWAYS SECTION (MANDATORY PRESERVED) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مسیرهای اشتغال' : 'Employment Pathways'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/work/finding-job" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h3 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'پیدا کردن کار' : 'Finding a Job'}</h3>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'سایت‌های کاریابی و نگارش رزومه استاندارد' : 'Job portals and standard CV writing'}</p>
              </Link>
              <Link href="/work/work-permit" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h3 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'مجوز کار' : 'Work Permit'}</h3>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'فرآیند دریافت Aviz de Munca توسط کارفرما' : 'The process for employers to get Aviz de Munca'}</p>
              </Link>
              <Link href="/work/work-visa" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h3 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'ویزای کاری' : 'Work Visa'}</h3>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'اقدام برای ویزای نوع D/AM پس از دریافت مجوز' : 'Applying for the D/AM visa after permit approval'}</p>
              </Link>
              <Link href="/work/employment-contract" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h3 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'قرارداد استخدام' : 'Employment Contract'}</h3>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'انواع قرارداد کاری و حقوق کارمند' : 'Types of contracts and employee rights'}</p>
              </Link>
              <Link href="/work/taxes-salaries" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h3 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'حقوق و مالیات' : 'Taxes & Salaries'}</h3>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'نحوه محاسبه حقوق خالص و کسورات قانونی' : 'Calculating net salary and legal deductions'}</p>
              </Link>
              <Link href="/work/insurance" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h3 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'بیمه' : 'Insurance'}</h3>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'پوشش بیمه تامین اجتماعی و درمانی' : 'Social and health insurance coverage'}</p>
              </Link>
            </div>
          </div>

          {/* 5. EVALUATION CTA AT BOTTOM */}
          <div className="pt-6">
            <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
          </div>
        </div>
      );
  }
};

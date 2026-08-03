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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'تمدید اقامت موقت در رومانی یکی از مهم‌ترین دغدغه‌های اتباع خارجی پس از سال اول حضور است. بر اساس آیین‌نامه اتباع خارجی رومانی (OUG 194/2002)، تا زمانی که شرایط اولیه صدور اقامت—مانند ادامه تحصیل، تمدید قرارداد کاری یا پابرجا بودن ازدواج—برقرار باشد، حق اقامت به‌صورت دوره‌ای قابل تمدید است. متقاضیان موظفند پیش از پایان مهلت کارت اقامت فعلی خود، درخواست تمدید را به همراه مدارک مثبته جدید به اداره کل مهاجرت (IGI) ارائه کنند. عدم اقدام به‌موقع می‌تواند منجر به جریمه نقدی یا حتی لغو حق اقامت شود.'
              : 'Renewing a temporary residence permit in Romania is one of the most critical responsibilities for foreign nationals after their first year. According to the Romanian Foreigners Regime (OUG 194/2002), as long as the initial conditions for granting residence—such as continuing studies, renewing an employment contract, or maintaining a marriage—remain valid, the right of residence can be renewed periodically. Applicants must submit their renewal request along with updated supporting documents to the General Inspectorate for Immigration (IGI) before their current permit expires. Failure to act on time can result in fines or even the cancellation of the right of stay.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چه زمانی باید برای تمدید اقامت اقدام کنم؟' : 'When should I apply for residence renewal?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'درخواست تمدید اقامت شما باید حداقل ۳۰ روز پیش از پایان انقضای کارت اقامت فعلی در سامانه و شعب IGI ثبت شود.' : 'Your renewal application must be submitted online and at IGI branches at least 30 days before the expiration of your current residence card.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم اقامت خود را برای بیش از یک سال تمدید کنم؟' : 'Can I renew my residence for more than one year?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'تمدید اقامت به‌طور معمول یک‌ساله است، اما در برخی شرایط مانند داشتن قرارداد کار دائم، ممکن است کارت‌های چندساله نیز صادر گردد.' : 'Renewals are typically granted on a one-year basis, but in certain situations, such as having a permanent employment contract, multi-year cards may be issued.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'اقامت بلندمدت (Drept de Ședere pe Termen Lung) در رومانی نقطه‌عطفی در مسیر مهاجرتی اتباع غیراروپایی است که ثبات و حقوقی تقریباً برابر با شهروندان محلی (به جز حق رأی) را برای آن‌ها به ارمغان می‌آورد. این نوع اقامت، پس از اثبات حضور قانونی و مستمر در خاک رومانی به مدت زمان مشخص (معمولاً ۵ سال) و با احراز شرایطی نظیر داشتن درآمد کافی، مسکن مناسب و آشنایی با زبان رومانیایی، توسط IGI اعطا می‌شود. دارندگان این وضعیت می‌توانند بدون نیاز به مجوز کار مجزا در بازار کار رومانی فعالیت کنند و مسیر بسیار هموارتری برای اخذ تابعیت این کشور خواهند داشت.'
              : 'Long-term residence (Drept de Ședere pe Termen Lung) in Romania is a milestone in the immigration journey of non-EU citizens, offering stability and rights almost equal to those of local citizens (except voting rights). This status is granted by IGI after proving continuous and legal physical presence in Romanian territory for a specified period (typically 5 years) and meeting requirements such as sufficient income, appropriate housing, and familiarity with the Romanian language. Holders of this status can participate in the labor market without needing a separate work permit and enjoy a much smoother path toward acquiring citizenship.'}
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
                <li>{currentLang === 'fa' ? 'در صورت پایان اعتبار اقامت بلندمدت در حالی که فرد هنوز در رومانی است، ظرف ۳۰ روز از تاریخ اطلاع‌رسانی می‌تواند برای اقامت موقت با اهداف مشخص‌شده در قانون درخواست دهد.' : 'If long-term residence expires while the individual is still in Romania, they can apply for temporary residence for legally specified purposes within 30 days from the date of notification.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'شرط حضور مستمر برای اخذ اقامت بلندمدت چیست؟' : 'What is the continuous presence requirement for long-term residence?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما نباید در طول ۵ سال پیش از درخواست، بیش از ۱۰ ماه در مجموع یا بیش از ۶ ماه به‌صورت متوالی خارج از خاک رومانی حضور داشته باشید.' : 'You must not be absent from Romanian territory for more than 10 months in total, or for more than 6 consecutive months, during the 5-year period preceding the application.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اعتبار کارت اقامت بلندمدت چند سال است؟' : 'How long is the long-term residence card valid?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'حق اقامت بلندمدت دائمی است، اما فیزیکِ کارت اقامت برای متقاضیان عادی به‌صورت ۱۰ ساله و برای اعضای خانواده شهروندان رومانی ۵ ساله صادر و سپس تمدید می‌شود.' : 'The right to long-term residence is permanent, but the physical residence card is issued for 10 years for general applicants and 5 years for family members of Romanian citizens, after which it is simply renewed.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'دریافت تابعیت رومانی بالاترین سطح ادغام در این کشور است که به شما پاسپورت رومانیایی و تمامی حقوق شهروندی اتحادیه اروپا را اعطا می‌کند. مسیر اصلی برای اتباع خارجی جهت کسب این تابعیت، تقاضا بر اساس قانون تابعیت رومانی (ماده ۸ قانون ۲۱/۱۹۹۱) است که نیازمند حداقل ۸ سال اقامت قانونی مستمر (یا ۵ سال در صورت ازدواج با شهروند رومانیایی) می‌باشد. علاوه بر رعایت مدت زمان حضور، سازمان ملی تابعیت (ANC) متقاضیان را از نظر وفاداری به دولت، نداشتن سابقه کیفری، استقلال مالی، و موفقیت در آزمون زبان، فرهنگ و قانون اساسی رومانی مورد ارزیابی دقیق قرار می‌دهد.'
              : 'Acquiring Romanian citizenship is the highest level of integration, granting you a Romanian passport and all EU citizenship rights. The primary pathway for foreign nationals is applying under Article 8 of the Romanian Citizenship Law (Law 21/1991), which requires at least 8 years of continuous legal residence (or 5 years if married to a Romanian citizen). Beyond the residency duration, the National Authority for Citizenship (ANC) strictly evaluates applicants on their loyalty to the state, clean criminal record, financial independence, and success in passing an exam on the Romanian language, culture, and constitution.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'پروسه بررسی پرونده تابعیت چقدر زمان می‌برد؟' : 'How long does the citizenship application process take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بر اساس روال قانونی و آمارهای فعلی سازمان ملی تابعیت (ANC)، رسیدگی به درخواست‌های ماده ۸ معمولاً حدود ۲ سال زمان می‌برد.' : 'Based on legal procedures and current ANC statistics, processing Article 8 applications typically takes around 2 years.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا آزمون زبان و قانون اساسی برای دریافت تابعیت دشوار است؟' : 'Is the language and constitution exam difficult?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'متقاضی باید توانایی خواندن، نوشتن و مکالمه روان به زبان رومانیایی را داشته باشد و به پرسش‌هایی درباره تاریخ، جغرافیا و قانون اساسی پاسخ دهد که نیازمند مطالعه و آمادگی کامل است.' : 'The applicant must demonstrate the ability to read, write, and converse fluently in Romanian, and answer questions regarding the country\'s history, geography, and constitution, which requires thorough preparation.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'ویزا و اقامت از طریق پیوست خانواده، راهکاری قانونی برای گرد هم آوردن اعضای خانواده در خاک رومانی است. بر اساس قوانین مهاجرتی، شهروندان رومانیایی یا اتباع خارجی که دارای کارت اقامت معتبر (به ویژه اقامت بلندمدت) هستند، می‌توانند به عنوان حامی مالی و قانونی (Sponsor) برای الحاق همسر و فرزندان تحت تکفل خود درخواست دهند. در این پروسه، اداره کل مهاجرت (IGI) مدارک اثبات‌کننده رابطه خانوادگی را بررسی کرده و پس از تأیید عدم صوری بودن ازدواج، مجوز لازم جهت دریافت ویزای نوع D و در نهایت کارت اقامت موقت را برای اعضای خانواده صادر می‌نماید.'
              : 'Visa and residency through family reunification is a legal framework designed to bring family members together in Romania. Under immigration laws, Romanian citizens or foreign nationals holding a valid residence permit (especially long-term residence) can act as a sponsor to request reunification with their spouse and dependent children. During this process, the General Inspectorate for Immigration (IGI) evaluates documents proving the familial relationship and, after confirming that a marriage is not one of convenience, issues the necessary approval for obtaining a Type D visa and ultimately a temporary residence permit for the family members.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'بررسی درخواست پیوست خانواده چقدر طول می‌کشد؟' : 'How long does it take to process a family reunification application?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'زمان قانونی رسیدگی به درخواست اولیه صدور مجوز پیوست خانواده و کارت اقامت تا ۹۰ روز کاری است.' : 'The legal processing time for the initial family reunification permit and residence card application is up to 90 working days.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا همسر من می‌تواند با ویزای پیوست خانواده در رومانی کار کند؟' : 'Can my spouse work in Romania with a family reunification visa?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، اعضای خانواده‌ای که از طریق پیوست خانواده با یک شهروند رومانیایی یا مقیم بلندمدت اقامت دریافت می‌کنند، بر اساس قوانین موجود می‌توانند در رومانی مشغول به کار شوند.' : 'Yes, family members who obtain residency through family reunification with a Romanian citizen or long-term resident are generally allowed to work in Romania under existing regulations.'}</p>
              </div>
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

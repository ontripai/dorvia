'use client';

import React from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { RelatedGuidesCard } from './RelatedGuidesCard';
import { FaqSchema } from './FaqSchema';

interface InvestmentOverviewContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const InvestmentOverviewContent: React.FC<InvestmentOverviewContentProps> = ({ currentLang, onNavigate }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <Breadcrumb slugRoute="company/investment" currentLang={currentLang} onNavigate={onNavigate} />

      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'اقامت از طریق سرمایه‌گذاری و تجارت' : 'Residency through Investment and Business'}
        </h1>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: آژانس رومانیایی سرمایه‌گذاری و تجارت خارجی (ARICE، arice.gov.ro)، آیین‌نامه اتباع خارجی (OUG 194/2002) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
            : 'Source: Romanian Agency for Investment and Foreign Trade (ARICE, arice.gov.ro), Foreigners Regime (OUG 194/2002) — Last reviewed: August 2026'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'مسیر فعلی اقامت از طریق فعالیت تجاری' : 'Current Pathway for Commercial Residency'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'طبق آیین‌نامه اتباع خارجی رومانی (OUG 194/2002)، فردی که برای انجام فعالیت‌های تجاری وارد رومانی شده، می‌تواند برای اقامت موقت با هدف فعالیت تجاری اقدام کند.' : 'According to the Romanian Foreigners Regime (OUG 194/2002), individuals entering Romania to conduct commercial activities can apply for a temporary residence permit for commercial purposes.'}</li>
            <li>{currentLang === 'fa' ? 'این مسیر نیازمند تاییدیه فنی تخصصی (aviz tehnic de specialitate) از آژانس رومانیایی سرمایه‌گذاری و تجارت خارجی (ARICE) روی طرح تجاری متقاضی است.' : 'This pathway requires a specialized technical endorsement (aviz tehnic de specialitate) from the Romanian Agency for Investment and Foreign Trade (ARICE) on the applicant\'s business plan.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'نقش آژانس ARICE' : 'The Role of ARICE'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'آژانس رومانیایی سرمایه‌گذاری و تجارت خارجی (ARICE، arice.gov.ro) نهاد رسمی دولتی است که طرح‌های تجاری سرمایه‌گذاران خارجی را بررسی و تاییدیه فنی صادر می‌کند.' : 'The Romanian Agency for Investment and Foreign Trade (ARICE, arice.gov.ro) is the official government body that evaluates foreign investors\' business plans and issues the technical endorsement.'}</li>
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
            <span>{currentLang === 'fa' ? 'وضعیت مسیرهای اقامت سرمایه‌گذاری‌محور' : 'Status of Investment-based Residency'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'در حال حاضر، رومانی برنامه رسمی و فعالی مثل «اقامت طلایی» (Golden Visa) ندارد؛ متداول‌ترین مسیرهای اقامت بلندمدت که سرمایه‌گذاران استفاده می‌کنند، همچنان از طریق ثبت شرکت و فعالیت تجاری/اقتصادی (طبق OUG 194/2002) است.' : 'Currently, Romania does not have an active official "Golden Visa" program; the most common long-term residency pathways utilized by investors remain company registration and commercial/economic activity (per OUG 194/2002).'}</li>
            <li>{currentLang === 'fa' ? 'وضعیت قوانین مهاجرت و سرمایه‌گذاری پیوسته در حال تغییر است و اکیداً توصیه می‌شود فرصت‌های موجود از طریق منابع رسمی به‌روز بررسی شود تا با برنامه‌های منسوخ اشتباه گرفته نشود.' : 'Immigration and investment laws are constantly evolving; it is strongly advised to verify current opportunities through official sources to avoid confusion with outdated or inactive programs.'}</li>
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033]">
            {currentLang === 'fa' ? 'مدارک لازم برای طرح تجاری ARICE' : 'Documents Required for the ARICE Business Plan'}
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'کپی پاسپورت و مدرک هویت متقاضی.' : "Copy of the applicant's passport and ID."}</li>
            <li>{currentLang === 'fa' ? 'طرح تجاری کامل همراه با مستندات هزینه، تاییدشده توسط حسابدار مجاز.' : 'A complete business plan with cost documentation, certified by an authorized accountant.'}</li>
            <li>{currentLang === 'fa' ? 'گواهی بانکی مبنی بر وجود وجوه لازم برای سرمایه‌گذاری.' : 'A bank statement confirming the availability of the required investment funds.'}</li>
            <li>{currentLang === 'fa' ? 'در صورت وجود شرکت ثبت‌شده: اساسنامه و آخرین ترازنامه ارسالی به سازمان مالیاتی.' : 'If a company is already registered: its bylaws and latest balance sheet filed with the tax authority.'}</li>
            <li>{currentLang === 'fa' ? 'وکالت‌نامه محضری در صورت نمایندگی توسط شخص دیگر.' : 'Notarized power of attorney, if represented by someone else.'}</li>
            <li className="text-xs text-slate-500 italic">{currentLang === 'fa' ? 'طرح باید «ضروری، مرتبط و مفید» بوده و کارآیی، سودآوری و پایداری اقتصادی حداقل ۳ سال متوالی پس از سرمایه‌گذاری را نشان دهد؛ شرکت نباید بدهی معوق به دولت یا در حال انحلال/ورشکستگی باشد.' : 'The plan must be "necessary, relevant, and useful" and demonstrate technical-economic efficiency, profitability, and viability for at least 3 consecutive years post-investment; the company must have no outstanding state debt and not be in dissolution/insolvency.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033]">
            {currentLang === 'fa' ? 'مبالغ سرمایه‌گذاری و مهلت‌ها' : 'Investment Amounts & Timelines'}
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'آستانه ورودی: ۱۰۰,۰۰۰ یورو یا ۱۰ شغل تمام‌وقت برای SRL؛ ۱۵۰,۰۰۰ یورو یا ۱۵ شغل تمام‌وقت برای SA — این سرمایه‌گذاری باید ظرف ۱۲ ماه از دریافت اجازه اقامت محقق شود.' : 'Entry threshold: €100,000 or 10 full-time jobs for an SRL; €150,000 or 15 full-time jobs for an SA — the investment must be realized within 12 months of obtaining the residence permit.'}</li>
            <li>{currentLang === 'fa' ? 'بررسی کمیسیون معمولاً ظرف ۱۵ روز کاری انجام می‌شود، با مهلت قانونی نهایی ۳۰ روز برای ابلاغ تصمیم.' : "Commission review is typically completed within 15 working days, with a final legal deadline of 30 days to communicate the decision."}</li>
            <li>{currentLang === 'fa' ? 'با دریافت تاییدیه فنی، مرحله بعد درخواست ویزای D/AC (فعالیت تجاری) نزد سفارت رومانی در تهران است — هزینه ۳۰۰ یورو، اعتبار ۹۰ روز، رسیدگی ظرف حداکثر ۳۰ روز (قابل تمدید ۱۵ روز دیگر).' : 'Once the technical endorsement is issued, the next step is applying for the D/AC (commercial activity) visa at the Romanian Embassy in Tehran — a €300 fee, 90-day validity, processed within a maximum of 30 days (extendable by 15 more).'}</li>
            <li>{currentLang === 'fa' ? 'پس از ورود با ویزای D/AC، درخواست اجازه اقامت باید حداقل ۳۰ روز پیش از پایان اعتبار ویزا نزد IGI ثبت شود.' : "After entering on the D/AC visa, the residence permit application must be filed with IGI at least 30 days before the visa's validity expires."}</li>
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-semibold">
        ⚠️ {currentLang === 'fa'
          ? 'به‌روزرسانی مهم: در ۱۶ اکتبر ۲۰۲۵، طرحی برای «اقامت طلایی» رومانی (سرمایه‌گذاری حداقل ۴۰۰,۰۰۰ یورو در اوراق دولتی، ملک، صندوق سرمایه‌گذاری یا سهام بورس، اقامت ۵ ساله قابل تمدید) در مجلس سنا ثبت شد — اما در ۹-۱۰ دسامبر ۲۰۲۵ همین طرح توسط شورای عالی امنیت ملی رومانی (CSAT) «تهدید امنیت ملی» تشخیص داده شد و پس گرفته شد. اگر جایی (حتی سایت‌های دیگر) این برنامه ۴۰۰ هزار یورویی را فعال یا قریب‌الوقوع معرفی می‌کنند، اطلاعات منسوخ است — رومانی همچنان هیچ برنامه اقامت طلایی فعالی ندارد و تنها مسیر واقعی همان فعالیت تجاری واقعی از طریق ARICE است.'
          : 'Important update: on October 16, 2025, a bill for a Romanian "Golden Visa" (minimum €400,000 investment in government bonds, real estate, an investment fund, or listed shares, for a renewable 5-year residence permit) was registered in the Senate — but on December 9–10, 2025, it was withdrawn after Romania\'s Supreme Council for National Defense (CSAT) assessed it as a national-security risk. If you see this €400,000 scheme described elsewhere as active or imminent, that information is outdated — Romania still has no active golden-visa program, and the only real pathway remains genuine commercial activity through ARICE.'}
      </div>

      <div className="p-6 sm:p-8 bg-white border border-[#dfe6ef] rounded-2xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#142033]">
          {currentLang === 'fa' ? '🇮🇷 ویژه ایرانیان: اثبات منبع وجه سرمایه‌گذاری' : '🇮🇷 Iran-Specific: Proving the Source of Investment Funds'}
        </h3>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'یکی از مدارک الزامی طرح ARICE، گواهی بانکی مبنی بر وجود وجوه لازم (۱۰۰ تا ۱۵۰ هزار یورو) است. با توجه به قطع شبکه سوئیفت بانک‌های ایرانی و تحریم‌های اتحادیه اروپا (توضیح کامل در صفحه «صرافی و انتقال ارز»)، ممکن است انتقال و مستندسازی این مبلغ از منابع ایرانی پیچیده‌تر از حالت معمول باشد — این یک استنتاج معقول بر اساس مشکلات مستند‌شده انتقال پول است، نه گزارشی مستقیم از رد یک پرونده ARICE به همین دلیل. توصیه عملی: در صورت امکان، مسیر انتقال از طریق حساب‌های بانکی موجود در کشور ثالث (که پیش‌تر وجوه به آن‌جا منتقل شده) را برای تهیه گواهی بانکی در نظر بگیرید، و مستندات منبع وجه (فروش دارایی، ارث، درآمد سرمایه‌گذاری قبلی) را از همان ابتدا شفاف و کامل آماده کنید.'
            : "One of the required ARICE documents is a bank statement confirming the availability of the required funds (€100,000–150,000). Given Iranian banks' disconnection from SWIFT and EU sanctions (fully explained on the \"Currency Exchange\" page), transferring and documenting this amount from Iranian sources may be more complex than usual — this is a reasonable inference based on the money-transfer difficulties already documented on this site, not a direct report of an ARICE application being rejected for this reason. Practical tip: where possible, plan the bank-statement route through funds already held in a third-country account, and prepare source-of-funds documentation (asset sale, inheritance, prior investment income) transparently and completely from the outset."}
        </p>
      </div>

      <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
        <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا رومانی برنامه «اقامت طلایی» (Golden Visa) دارد؟' : 'Does Romania have a "Golden Visa" program?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، در حال حاضر رومانی هیچ برنامه رسمی اقامت طلایی مبتنی بر خرید ملک یا سپرده‌گذاری صرف ندارد؛ مسیر رسمی همچنان از طریق فعالیت تجاری واقعی و تاییدیه ARICE است. طرحی مشابه در اکتبر ۲۰۲۵ پیشنهاد شد ولی در دسامبر ۲۰۲۵ به‌خاطر ملاحظات امنیت ملی پس گرفته شد.' : 'No, Romania currently has no official golden-visa program based on simply buying property or making a deposit; the formal pathway remains genuine commercial activity endorsed by ARICE. A similar scheme was proposed in October 2025 but withdrawn in December 2025 over national-security concerns.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا صرفِ ثبت شرکت برای اقامت کافی است؟' : 'Is registering a company alone enough for residency?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، ثبت شرکت گام اول است؛ برای اقامت تجاری باید طرح کسب‌وکار به ARICE ارائه و درخواست مجزا نزد اداره مهاجرت (IGI) ثبت شود. برای جزئیات بیشتر به' : 'No, company registration is only the first step; for commercial residency you must submit a business plan to ARICE and file a separate application with the Immigration Office (IGI). See'} <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('company/residency'); }} className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'صفحه اقامت شرکتی' : 'the company-residency page'}</a> {currentLang === 'fa' ? 'مراجعه کنید.' : 'for details.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'دقیقاً چقدر باید سرمایه‌گذاری کنم؟' : 'Exactly how much do I need to invest?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای دریافت تاییدیه اولیه ARICE: ۱۰۰,۰۰۰ یورو (SRL) یا ۱۵۰,۰۰۰ یورو (SA)، یا به‌جای آن ایجاد ۱۰ تا ۱۵ شغل تمام‌وقت. توجه: این آستانه با آستانه تمدید سالانه اقامت (که پایین‌تر است) فرق دارد — برای جزئیات به صفحه «اقامت مدیرعامل و سهامدار» مراجعه کنید.' : "For the initial ARICE endorsement: €100,000 (SRL) or €150,000 (SA), or alternatively creating 10-15 full-time jobs. Note this differs from the annual residency-renewal threshold (which is lower) — see the \"Director & Shareholder Residency\" page for details."}</p>
          </div>
        </div>
      </div>

      <FaqSchema items={[
        {
          q: currentLang === 'fa' ? 'آیا رومانی برنامه «اقامت طلایی» (Golden Visa) دارد؟' : 'Does Romania have a "Golden Visa" program?',
          a: currentLang === 'fa' ? 'خیر، در حال حاضر رومانی هیچ برنامه رسمی اقامت طلایی مبتنی بر خرید ملک یا سپرده‌گذاری صرف ندارد؛ مسیر رسمی همچنان از طریق فعالیت تجاری واقعی و تاییدیه ARICE است. طرحی مشابه در اکتبر ۲۰۲۵ پیشنهاد شد ولی در دسامبر ۲۰۲۵ به‌خاطر ملاحظات امنیت ملی پس گرفته شد.' : 'No, Romania currently has no official golden-visa program based on simply buying property or making a deposit; the formal pathway remains genuine commercial activity endorsed by ARICE. A similar scheme was proposed in October 2025 but withdrawn in December 2025 over national-security concerns.'
        },
        {
          q: currentLang === 'fa' ? 'آیا صرفِ ثبت شرکت برای اقامت کافی است؟' : 'Is registering a company alone enough for residency?',
          a: currentLang === 'fa' ? 'خیر، ثبت شرکت گام اول است؛ برای اقامت تجاری باید طرح کسب‌وکار به ARICE ارائه و درخواست مجزا نزد اداره مهاجرت (IGI) ثبت شود. برای جزئیات بیشتر به صفحه اقامت شرکتی مراجعه کنید.' : 'No, company registration is only the first step; for commercial residency you must submit a business plan to ARICE and file a separate application with the Immigration Office (IGI). See the company-residency page for details.'
        },
        {
          q: currentLang === 'fa' ? 'دقیقاً چقدر باید سرمایه‌گذاری کنم؟' : 'Exactly how much do I need to invest?',
          a: currentLang === 'fa' ? 'برای دریافت تاییدیه اولیه ARICE: ۱۰۰,۰۰۰ یورو (SRL) یا ۱۵۰,۰۰۰ یورو (SA)، یا به‌جای آن ایجاد ۱۰ تا ۱۵ شغل تمام‌وقت. توجه: این آستانه با آستانه تمدید سالانه اقامت (که پایین‌تر است) فرق دارد — برای جزئیات به صفحه «اقامت مدیرعامل و سهامدار» مراجعه کنید.' : "For the initial ARICE endorsement: €100,000 (SRL) or €150,000 (SA), or alternatively creating 10-15 full-time jobs. Note this differs from the annual residency-renewal threshold (which is lower) — see the \"Director & Shareholder Residency\" page for details."
        }
      ]} />

      <RelatedGuidesCard items={['company/real-estate-investment', 'company/residency']} currentLang={currentLang} onNavigate={onNavigate} />
      <ParentHubFooterCard slugRoute="company/investment" currentLang={currentLang} onNavigate={onNavigate} />
    </div>
  );
};

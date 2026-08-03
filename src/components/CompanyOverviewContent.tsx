'use client';

import React from 'react';
import { Language } from '../types';

interface CompanyOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const CompanyOverviewContent: React.FC<CompanyOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  switch (subRoute) {
    case 'registration':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مراحل ثبت شرکت SRL در رومانی' : 'SRL Company Registration Steps in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره ثبت شرکت‌های رومانی (ONRC) — onrc.ro — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian National Trade Register Office (ONRC) — onrc.ro — Last reviewed: 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'تأسیس شرکت با مسئولیت محدود (SRL) محبوب‌ترین و کارآمدترین روش برای شروع یک کسب‌وکار در رومانی است. فرآیند ثبت که تحت نظارت اداره ثبت شرکت‌ها (ONRC) انجام می‌شود، ساختاریافته است و به سرمایه‌گذاران خارجی (حتی خارج از اتحادیه اروپا) اجازه می‌دهد مالک ۱۰۰٪ سهام و مدیرعامل شرکت خود باشند. آماده‌سازی دقیق مدارک اولیه نظیر رزرو نام، تعیین آدرس قانونی (sediu social) و تدوین اساسنامه بسیار حیاتی است. پس از ارسال مدارک از طریق پلتفرم دیجیتال، شرکت شما به‌سرعت ثبت شده و کد مالیاتی (CUI) صادر می‌گردد.'
              : 'Establishing a Limited Liability Company (SRL) is the most popular and efficient way to start a business in Romania. The registration process, overseen by the National Trade Register Office (ONRC), is highly structured and allows foreign investors, including non-EU citizens, to be sole shareholders and directors. Preparing accurate preliminary documentation, such as reserving the company name and legally establishing a registered office (sediu social), is essential. Once all documents are properly submitted, the company is officially registered and a unique tax code (CUI) is issued rapidly.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'آماده‌سازی مقدماتی' : 'Preliminary Preparation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رزرو نام شرکت نزد اداره ثبت شرکت‌ها (ONRC).' : 'Reserving the company name with the Trade Register (ONRC).'}</li>
                <li>{currentLang === 'fa' ? 'تعیین آدرس دفتر ثبت‌شده (سدیو سوشیال / sediu social).' : 'Establishing the registered office address (sediu social).'}</li>
                <li>{currentLang === 'fa' ? 'تدوین اساسنامه شرکت (act constitutiv).' : 'Drafting the Articles of Association (act constitutiv).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مدارک برای شهروندان غیر اتحادیه اروپا' : 'Documents for Non-EU Citizens'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'غیر اتحادیه‌ای‌ها می‌توانند سهامدار و مدیرعامل باشند.' : 'Non-EU citizens can act as shareholders and directors.'}</li>
                <li>{currentLang === 'fa' ? 'مدارک هویتی باید ترجمه رسمی و تأییدشده (آپوستیل یا تأییدیه سفارت) داشته باشند.' : 'Identity documents must be officially translated and certified (Apostille or embassy legalization).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'ثبت نهایی' : 'Final Registration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ارسال پرونده به ONRC، معمولاً از طریق پلتفرم دیجیتال با امضای الکترونیکی معتبر.' : 'Submitting the file to ONRC, usually via the digital platform with a valid electronic signature.'}</li>
                <li>{currentLang === 'fa' ? 'پس از تأیید، شرکت رسمی ثبت و کد مالیاتی صادر می‌شود.' : 'Upon approval, the company is officially registered and the tax code is issued.'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'پروسه ثبت شرکت چقدر زمان می‌برد؟' : 'How long does the registration take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'پس از آماده‌سازی و ارسال کامل مدارک به ONRC، ثبت نهایی معمولاً بین ۳ تا ۵ روز کاری زمان می‌برد.' : 'Once all documents are prepared and submitted to ONRC, the final registration typically takes between 3 to 5 working days.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای ثبت شرکت به شریک رومانیایی نیاز دارم؟' : 'Do I need a local Romanian partner?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، اتباع خارجی می‌توانند به تنهایی مالک ۱۰۰٪ سهام شرکت و مدیرعامل آن باشند.' : 'No, foreign nationals can own 100% of the company shares and act as the sole director.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'tax-types':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'نرخ‌های مالیاتی شرکت‌های کوچک در رومانی' : 'Small Business Tax Rates in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: قانون مالیاتی رومانی، سازمان امور مالیاتی (ANAF) — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian Tax Code, National Agency for Fiscal Administration (ANAF) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'رومانی یکی از جذاب‌ترین سیستم‌های مالیاتی را در اتحادیه اروپا برای کسب‌وکارهای کوچک و استارت‌آپ‌ها ارائه می‌دهد. مهم‌ترین مزیت، رژیم مالیاتی میکرو-شرکت (Micro-Enterprise) است؛ در این سیستم، شرکت‌هایی که گردش مالی سالانه آن‌ها کمتر از ۱۰۰,۰۰۰ یورو است و حداقل یک کارمند تمام‌وقت دارند، تنها ۱٪ مالیات بر درآمد (نه سود) پرداخت می‌کنند. چنانچه گردش مالی از این سقف عبور کند، شرکت وارد رژیم استاندارد مالیات بر سود شرکتی با نرخ ۱۶٪ می‌شود. درک این ساختارها برای برنامه‌ریزی مالی دقیق ضروری است.'
              : 'Romania offers one of the most attractive corporate tax regimes in the European Union, particularly for small businesses and startups. A notable advantage is the micro-enterprise tax regime, where eligible companies pay only a 1% tax on their total revenue (rather than profit), provided their annual turnover remains under €100,000 and they employ at least one full-time worker. Should a company exceed this revenue threshold, it transitions to the standard corporate profit tax rate of 16%. Understanding these structures is vital for accurate financial forecasting.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مالیات ۱٪ بر درآمد (میکرو-شرکت)' : '1% Income Tax (Micro-Enterprise)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فقط برای شرکت‌هایی با گردش مالی سالانه زیر ۱۰۰,۰۰۰ یورو و حداقل یک کارمند تمام‌وقت.' : 'Only for companies with an annual turnover under €100,000 and at least one full-time employee.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مالیات ۱۶٪ بر سود شرکتی' : '16% Corporate Profit Tax'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'برای شرکت‌هایی که از سقف ۱۰۰,۰۰۰ یورو گردش مالی عبور کنند، از همان فصل مالی نرخ ۱۶٪ اعمال می‌شود.' : 'For companies exceeding the €100,000 turnover threshold, the 16% rate applies from the same fiscal quarter.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'سایر مالیات‌ها' : 'Other Taxes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مالیات بر ارزش افزوده (VAT) برای شرکت‌های بالای آستانه معین.' : 'Value Added Tax (VAT) for companies exceeding the designated threshold.'}</li>
                <li>{currentLang === 'fa' ? 'سهم بیمه‌های اجتماعی کارفرما در صورت داشتن کارمند.' : 'Employer\'s social security contributions if employing staff.'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا بدون استخدام کارمند می‌توانم از مالیات ۱٪ استفاده کنم؟' : 'Can I pay 1% tax with 0 employees?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، بر اساس قوانین جدید، داشتن حداقل یک کارمند تمام‌وقت برای بهره‌مندی از نرخ ۱٪ میکرو-شرکت الزامی است.' : 'No, under current laws, having at least one full-time employee is mandatory to qualify for the 1% micro-enterprise rate.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر درآمد من از ۱۰۰ هزار یورو بیشتر شود چه اتفاقی می‌افتد؟' : 'What happens if revenue exceeds €100k?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شرکت شما به‌طور خودکار از رژیم میکرو خارج شده و مشمول پرداخت مالیات ۱۶ درصدی بر سود خالص خواهد شد.' : 'Your company will automatically exit the micro-enterprise regime and become subject to the 16% tax on net corporate profit.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'bank-account':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'افتتاح حساب بانکی برای شرکت در رومانی' : 'Opening a Corporate Bank Account in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'این بخش راهنمای عمومی است؛ شرایط دقیق هر بانک باید مستقیماً از آن بانک استعلام شود.'
                : 'This section is a general guide; exact conditions should be verified directly with each respective bank.'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'افتتاح حساب بانکی شرکتی در رومانی، گامی الزامی برای شروع فعالیت تجاری و واریز سرمایه اولیه است. اگرچه این روند برای شهروندان رومانیایی ساده است، اما مدیران خارجی معمولاً با بررسی‌های دقیق‌تر (KYC) و مقررات ضد پولشویی (AML) مواجه می‌شوند که گاهاً حضور فیزیکی آن‌ها را در شعبه الزامی می‌کند. انتخاب بانکی که خدمات بین‌المللی مطلوب، کارت‌های ارزی و سیستم بانکداری آنلاین قدرتمندی ارائه دهد، تأثیر زیادی در مدیریت روان‌تر کسب‌وکار شما خواهد داشت.'
              : 'Opening a corporate bank account in Romania is a mandatory step for finalizing your company\'s operational setup and injecting the initial share capital. While the process is straightforward for Romanian citizens, foreign directors may face stricter compliance and Anti-Money Laundering (AML) checks, which occasionally require their physical presence at the branch. It is highly recommended to choose a bank that aligns with your business needs, particularly concerning international wire transfers, multi-currency accounts, and robust online banking platforms.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مدارک لازم' : 'Required Documents'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مدارک ثبت شرکت (از ONRC).' : 'Company registration documents (from ONRC).'}</li>
                <li>{currentLang === 'fa' ? 'مدرک هویت مدیرعامل/سهامدار.' : 'Identity document of the director/shareholder.'}</li>
                <li>{currentLang === 'fa' ? 'در برخی بانک‌ها ممکن است حضور فیزیکی مدیرعامل لازم باشد.' : 'Some banks may require the physical presence of the director.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'نکات عملی' : 'Practical Considerations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'انتخاب بانک بر اساس نیاز به خدمات بین‌المللی (کارت‌های ارزی، انتقال وجه بین‌المللی).' : 'Choosing a bank based on international service needs (foreign currency cards, international wire transfers).'}</li>
                <li>{currentLang === 'fa' ? 'برخی بانک‌ها امکان افتتاح آنلاین برای اتباع خارجی محدود ارائه می‌دهند.' : 'Some banks offer limited online account opening options for foreign nationals.'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم از راه دور حساب بانکی شرکتی باز کنم؟' : 'Can I open a corporate account entirely online as a foreigner?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'با وجود ارائه خدمات آنلاین توسط برخی بانک‌ها، برای اتباع کشورهای غیراروپایی معمولاً حضور فیزیکی مدیرعامل جهت احراز هویت در شعبه الزامی است.' : 'While some banks offer online services, foreign directors from non-EU countries are often required to visit the branch in person for KYC procedures.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'residency':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'اقامت برای مدیرعامل و سهامدار شرکت' : 'Residency for Company Director and Shareholder'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'تأسیس یک شرکت در رومانی به‌خودی‌خود منجر به صدور اجازه اقامت برای سهامداران یا مدیران خارجی آن نمی‌شود. برای دریافت اقامت تجاری (Commercial Residency)، کارآفرینان خارج از اتحادیه اروپا باید پرونده مجزایی را نزد اداره کل مهاجرت (IGI) تشکیل دهند. این پروسه نیازمند ارائه یک طرح کسب‌وکار قوی، اثبات تمکن مالی برای سرمایه‌گذاری واقعی، و ایجاد شغل برای نیروهای بومی است تا نشان دهد حضور شرکت شما برای اقتصاد رومانی ارزش‌آفرین خواهد بود.'
              : 'Setting up a company in Romania does not automatically grant a residence permit to its foreign shareholders or directors. To legally reside in the country based on business activities, non-EU entrepreneurs must apply for a specific commercial residency permit through the General Inspectorate for Immigration (IGI). This process requires presenting a viable business plan, demonstrating a genuine economic impact, and proving a minimum level of actual investment or job creation to show that your business adds value to the Romanian economy.'}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'نکته مهم' : 'Important Note'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت شرکت به‌تنهایی اقامت نمی‌دهد.' : 'Registering a company alone does not grant residency.'}</li>
                <li>{currentLang === 'fa' ? 'نیاز به درخواست جداگانه اقامت برای فعالیت تجاری نزد اداره کل مهاجرت (IGI) است، معمولاً همراه با ارائه طرح کسب‌وکار و اثبات سرمایه‌گذاری واقعی.' : 'A separate application for commercial residency must be submitted to IGI, typically requiring a business plan and proof of actual investment.'}</li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا تنها با خرید سهام یک شرکت رومانیایی می‌توانم اقامت بگیرم؟' : 'Does buying shares in a Romanian company give me residency?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، صرفِ داشتن سهام کافی نیست؛ شما باید اثبات کنید که سرمایه‌گذاری قابل توجهی انجام داده‌اید و در مدیریت کسب‌وکار به‌طور فعال مشارکت دارید.' : 'No, simply holding shares is insufficient; you must prove substantial investment and active involvement in managing the business.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'حداقل سرمایه مورد نیاز چقدر است؟' : 'How much investment is required?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بسته به نوع و مسیر دقیق اقامت (مثلاً به عنوان مدیر یا سرمایه‌گذار عمده)، قوانین متغیر است، اما معمولاً سرمایه‌گذاری‌های بالای ۵۰,۰۰۰ یورو یا ایجاد حداقل ۱۰ شغل تمام‌وقت مد نظر IGI قرار می‌گیرد.' : 'Depending on the exact legal pathway (e.g., as a director or major investor), requirements vary, but typically investments over €50,000 or creating at least 10 full-time jobs are scrutinized favorably by IGI.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'real-estate-investment':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سرمایه‌گذاری در املاک و مستغلات' : 'Real Estate Investment'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره ثبت اسناد و املاک رومانی (OCPI)، سازمان امور مالیاتی رومانی (ANAF) — آخرین بررسی: ۲۰۲۶'
                : 'Source: National Agency for Cadastre and Land Registration (OCPI), National Agency for Fiscal Administration (ANAF) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'سرمایه‌گذاری در بازار املاک رومانی با توجه به رشد پیوسته ارزش ملک، گزینه‌ای بسیار جذاب است. بر اساس قوانین، اتباع خارج از اتحادیه اروپا کاملاً مجاز به خرید آپارتمان، خانه یا ساختمان تجاری (بنا) هستند. با این حال، مالکیت مستقیم زمین برای اتباع خارجی محدودیت دارد، مگر در صورت وجود معاهدات متقابل. برای عبور قانونی از این محدودیت، بسیاری از سرمایه‌گذاران ترجیح می‌دهند املاک و مستغلات (به همراه زمین) را به نام یک شرکت ثبت‌شده رومانیایی (SRL) خریداری کنند که خود مالکیت کامل آن شرکت را در اختیار دارند.'
              : 'Investing in Romanian real estate presents a lucrative opportunity, characterized by growing property values and a straightforward legal framework. Non-EU citizens have the full right to purchase and own apartments, houses, and commercial buildings under the exact same conditions as locals. However, direct ownership of the underlying land is restricted for foreigners unless a bilateral treaty exists. To seamlessly navigate this, many foreign investors opt to purchase properties through a registered Romanian company (SRL), which bypasses all land ownership restrictions.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'قانون مالکیت برای اتباع خارجی' : 'Foreign Ownership Rights'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اتباع کشورهای غیرعضو اتحادیه اروپا می‌توانند آپارتمان، خانه یا ساختمان تجاری در رومانی بخرند، دقیقاً با همان شرایط شهروندان رومانیایی.' : 'Non-EU citizens can purchase apartments, houses, or commercial buildings in Romania under the exact same conditions as Romanian citizens.'}</li>
                <li>{currentLang === 'fa' ? 'محدودیت اصلی مربوط به مالکیت زمین است: مالکیت مستقیم زمین برای اتباع خارج از اتحادیه اروپا فقط در صورت وجود معاهده متقابل بین رومانی و کشور متقاضی امکان‌پذیر است؛ در غیر این صورت فقط حق مالکیت بنا (نه زمین زیر آن) قابل خرید است.' : 'The main restriction concerns land ownership: direct ownership of land by non-EU citizens is only possible if a bilateral treaty exists between Romania and the applicant\'s country; otherwise, only the right to own the building (not the land beneath it) can be purchased.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'راه‌حل رایج برای مالکیت زمین' : 'Common Solution for Land Ownership'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رایج‌ترین روش برای دور زدن این محدودیت، خرید ملک از طریق یک شرکت رومانیایی (SRL) است که خودِ متقاضی مالک آن باشد؛ شرکت‌ها محدودیتی در مالکیت زمین ندارند.' : 'The most common method to bypass this restriction is purchasing the property through a Romanian company (SRL) owned by the applicant; companies have no restrictions on land ownership.'}</li>
                <li>{currentLang === 'fa' ? 'برای هرگونه معامله ملکی، خریدار خارجی باید ابتدا شماره شناسایی مالیاتی (Cod de Identificare Fiscală / CIF) از سازمان امور مالیاتی رومانی (ANAF) دریافت کند.' : 'For any real estate transaction, a foreign buyer must first obtain a Fiscal Identification Code (CIF) from the National Agency for Fiscal Administration (ANAF).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'مراحل رسمی معامله' : 'Official Transaction Steps'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'معامله باید نزد دفتر اسناد رسمی (Notar Public) ثبت و تایید شود.' : 'The transaction must be authenticated and registered by a Notary Public (Notar Public).'}</li>
                <li>{currentLang === 'fa' ? 'ثبت نهایی مالکیت در دفتر املاک (Carte Funciară) از طریق اداره ثبت اسناد و املاک (OCPI) انجام می‌شود.' : 'Final registration of ownership in the Land Registry (Carte Funciară) is processed through the National Agency for Cadastre and Land Registration (OCPI).'}</li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم آپارتمانی در بخارست به نام خودم بخرم؟' : 'Can I buy an apartment in Bucharest as a non-EU citizen?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، شما می‌توانید مالکیت خودِ آپارتمان را به‌طور کامل به نام شخصی خود ثبت کنید، اما زمینِ زیر مجتمع ممکن است به‌صورت اجاره‌ای (Concession) ثبت شود.' : 'Yes, you can fully own the apartment unit itself under your personal name, though the land beneath the building may be held in concession.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا با خرید ملک به من اقامت رومانی داده می‌شود؟' : 'Does buying real estate grant me residency?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. رومانی در حال حاضر برنامه «ویزای طلایی» (Golden Visa) بابت خرید ملک شخصی ندارد و خرید ملک مستقیماً منجر به صدور اقامت نمی‌شود.' : 'No. Romania does not currently have a "Golden Visa" program; buying real estate does not automatically grant a residence permit.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'startup-tech-investment':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'استارت‌آپ‌ها و فناوری اطلاعات' : 'Tech Startups & Innovation'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: قانون مالیاتی رومانی (Legea 227/2015)، سازمان امور مالیاتی رومانی (ANAF) — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian Fiscal Code (Legea 227/2015), National Agency for Fiscal Administration (ANAF) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'رومانی با بهره‌گیری از سیاست‌های حمایتی و نیروی کار بسیار متخصص، به‌سرعت در حال تبدیل‌شدن به یکی از قطب‌های مهم فناوری در اروپاست. یکی از جذاب‌ترین مشوق‌های دولتی برای استارت‌آپ‌های حوزه IT، معافیت کارمندان بخش «تولید نرم‌افزار» از پرداخت مالیات ۱۰ درصدی بر درآمد حقوق است. کارآفرینانی که شرکت خود را با کدهای فعالیت (CAEN) اختصاصی مانند 6201 (برنامه‌نویسی) ثبت کنند، می‌توانند از این امتیاز قانونی برای کاهش هزینه‌ها و جذب بهترین استعدادها بهره‌مند شوند.'
              : 'Romania has rapidly emerged as a prominent tech hub in Europe, heavily supported by favorable state policies and a highly skilled workforce. One of the most significant incentives is the tax exemption for IT professionals; employees working in specific software creation roles are completely exempt from the 10% income tax. For tech startups, properly registering the company with the correct CAEN codes (such as 6201 for custom software development) is the first critical step to unlocking these financial benefits and attracting top talent.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'معافیت مالیاتی برنامه‌نویسان' : 'Tax Exemption for Programmers'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'طبق قانون مالیاتی رومانی (Legea 227/2015، ماده ۶۰)، کارکنان شاغل در شرکت‌هایی که فعالیت اصلی یا فرعی‌شان «تولید نرم‌افزار» است (با کدهای فعالیت CAEN مشخص: 5821، 5829، 6201، 6202، 6209) از پرداخت مالیات ۱۰٪ بر درآمد حقوق معاف هستند.' : 'According to the Romanian Fiscal Code (Law 227/2015, Article 60), employees working in companies whose main or secondary activity is "software creation" (specific CAEN codes: 5821, 5829, 6201, 6202, 6209) are exempt from the 10% income tax on salaries.'}</li>
                <li>{currentLang === 'fa' ? 'این معافیت فقط مالیات بر درآمد را پوشش می‌دهد؛ کارمند همچنان باید سهم کامل بازنشستگی (CAS) و بیمه سلامت (CASS) را بپردازد.' : 'This exemption only covers income tax; the employee must still pay the full pension (CAS) and health insurance (CASS) contributions.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرایط شرکت و کارمند' : 'Company and Employee Requirements'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شرکت باید حداقل درآمد ۱۰,۰۰۰ یورو (معادل به لئو) به‌ازای هر کارمند مشمول در سال مالی قبل کسب کرده باشد (شرکت‌های تازه‌تاسیس از این شرط معاف‌اند).' : 'The company must have generated a minimum revenue of €10,000 (equivalent in RON) per eligible employee in the previous fiscal year (newly established companies are exempt from this condition).'}</li>
                <li>{currentLang === 'fa' ? 'سمت کارمند باید در فهرست مشخص‌شده قانونی باشد (مثل برنامه‌نویس، مهندس نرم‌افزار، تحلیلگر سیستم، مدیر پروژه فناوری اطلاعات).' : 'The employee\'s position must be on the legally specified list (e.g., programmer, software engineer, systems analyst, IT project manager).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته برای کارآفرینان استارت‌آپی' : 'Tip for Startup Entrepreneurs'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت شرکت با کد فعالیت مناسب (CAEN) اولین قدم برای بهره‌مندی از این معافیت است؛ جزئیات ثبت شرکت در صفحه «مراحل ثبت شرکت» موجود است.' : 'Registering a company with the appropriate activity code (CAEN) is the first step to benefit from this exemption; details are available on the "Registration Steps" page.'}</li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا تمام کارمندان یک شرکت IT معاف از مالیات هستند؟' : 'Are all tech company employees exempt from income tax?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، این معافیت منحصراً شامل سِمت‌هایی می‌شود که در قانون مشخص شده‌اند (مانند مهندس نرم‌افزار یا تحلیلگر) و مشاغل اداری یا مالیِ همان شرکت را شامل نمی‌شود.' : 'No, the exemption applies only to specific software creation roles outlined in the law (like programmers and system analysts) and does not cover administrative or financial staff.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا خود من به‌عنوان بنیان‌گذار از این معافیت برخوردار می‌شوم؟' : 'Do founders get this tax cut?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'تنها در صورتی که با شرکت خود قرارداد کاری رسمی برای یک سمت فنی (تولید نرم‌افزار) ببندید و شرایط تحصیلی/حقوقی آن را داشته باشید.' : 'Only if you are officially employed by your company with a formal labor contract in an eligible technical role and meet the educational/legal requirements.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'annual-tax-reporting':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قوانین مالیاتی و گزارش‌دهی سالانه' : 'Annual Tax Compliance'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: سازمان امور مالیاتی رومانی (ANAF)، وزارت دارایی رومانی — آخرین بررسی: ۲۰۲۶'
                : 'Source: National Agency for Fiscal Administration (ANAF), Romanian Ministry of Finance — Last reviewed: 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'رعایت انضباط مالی و انجام صحیح گزارش‌دهی‌ها برای بقای قانونی هر شرکتی در رومانی الزامی است. هر موجودیت ثبت‌شده، فارغ از حجم درآمد، موظف است صورت‌های مالی سالانه خود را به‌صورت الکترونیکی و با امضای دیجیتالِ مورد تأیید به سازمان امور مالیاتی (ANAF) ارسال نماید. مهلت این کار معمولاً در اواخر ماه می هر سال است. حتی شرکت‌هایی که در طول سال مالی هیچ‌گونه تراکنش یا فعالیتی نداشته‌اند (شرکت‌های غیرفعال)، از این قاعده مستثنی نیستند و باید اظهارنامه عدم‌فعالیت را در موعد مقرر تحویل دهند تا از جرایم سنگین مصون بمانند.'
              : 'Maintaining strict financial compliance is essential for the legal operation of any company in Romania. Every registered entity, regardless of its size or activity level, is legally obligated to submit annual financial statements to the National Agency for Fiscal Administration (ANAF). These reports must be digitally signed and filed by the statutory deadline, usually the end of May. Even dormant companies that have conducted zero transactions must fulfill their reporting duties by submitting a declaration of inactivity to avoid severe penalties.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'الزام گزارش‌دهی سالانه' : 'Annual Reporting Obligation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'هر شرکت ثبت‌شده در رومانی (از جمله SRL) موظف است صورت‌های مالی سالانه را به‌صورت الکترونیکی و با امضای دیجیتال معتبر به سازمان امور مالیاتی رومانی (ANAF) ارسال کند.' : 'Every company registered in Romania (including SRLs) is required to submit annual financial statements electronically, using a valid digital signature, to the National Agency for Fiscal Administration (ANAF).'}</li>
                <li>{currentLang === 'fa' ? 'مهلت معمول ارسال صورت‌های مالی سالانه، ۳۱ می هر سال است (در صورت مصادف شدن با تعطیلات رسمی، ممکن است چند روز تمدید شود).' : 'The standard deadline for submitting annual financial statements is May 31st of each year (this may be extended by a few days if it falls on a public holiday).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'عواقب عدم ارسال به‌موقع' : 'Consequences of Late Submission'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'عدم ارسال صورت‌های مالی می‌تواند جریمه نقدی (بین ۲,۰۰۰ تا ۵,۰۰۰ لئو) به همراه داشته باشد.' : 'Failure to submit financial statements can result in fines ranging from 2,000 to 5,000 RON.'}</li>
                <li>{currentLang === 'fa' ? 'اگر شرکت بیش از ۵ ماه بعد از مهلت قانونی هم صورت مالی ارسال نکند، ممکن است از سوی ANAF به‌عنوان «غیرفعال مالیاتی» اعلام شود که پیامدهای جدی‌تری (مثل از دست دادن حق کسر مالیاتی طرف‌های معامله) دارد.' : 'If a company fails to submit financial statements for more than 5 months past the legal deadline, it may be declared "fiscally inactive" by ANAF, which carries severe consequences (such as business partners losing the right to deduct taxes).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'شرکت‌های بدون فعالیت' : 'Dormant Companies'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شرکت‌هایی که از زمان ثبت تا پایان سال مالی هیچ فعالیتی نداشته‌اند، نیازی به تهیه صورت مالی کامل ندارند؛ در عوض باید ظرف ۶۰ روز از پایان سال مالی، اظهارنامه عدم‌فعالیت را به ANAF ارسال کنند.' : 'Companies that have had no activity from registration until the end of the financial year do not need to prepare full financial statements; instead, they must submit a declaration of inactivity to ANAF within 60 days of the financial year-end.'}</li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر موعد ارسال گزارش سالانه را از دست بدهم چه می‌شود؟' : 'What happens if I miss the annual reporting deadline?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'تأخیر در ارسال جریمه‌های نقدی بین ۲,۰۰۰ تا ۵,۰۰۰ لئو به دنبال دارد و تاخیر بیش از ۵ ماه منجر به قرار گرفتن در لیست غیرفعال‌های مالیاتی می‌شود.' : 'Late submissions lead to fines between 2,000 and 5,000 RON, and prolonged delays over 5 months can result in the company being declared "fiscally inactive".'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا شرکت بدون هیچ فعالیتی هم به حسابدار نیاز دارد؟' : 'Do I need an accountant if my company has no activity?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما همچنان برای ارسال اظهارنامه عدم‌فعالیت با امضای دیجیتالِ تأییدشده به یک شخص مجاز نیاز دارید، هرچند هزینه آن بسیار ناچیز است.' : 'You still need an authorized person with a digital signature to submit the declaration of inactivity, though the accounting cost is minimal.'}</p>
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
              {currentLang === 'fa' ? 'ثبت شرکت در رومانی (SRL)' : 'Company Registration'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بررسی قوانین ثبت شرکت SRL، ضوابط مالیاتی بر اساس نوع فعالیت و مسیرهای اقامتی مرتبط.'
                : 'SRL company formation steps, corporate tax rules, and executive residency criteria.'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مسیرهای کسب‌وکار' : 'Business Pathways'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/registration')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'ثبت شرکت' : 'Registration'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'مراحل ثبت شرکت با مسئولیت محدود (SRL)' : 'Steps to register an SRL company'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/tax-types')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'نرخ‌های مالیاتی' : 'Tax Rates'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'مالیات شرکت‌های خرد و سود سهام' : 'Micro-enterprise and dividend taxes'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/bank-account')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'حساب بانکی' : 'Bank Account'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'فرآیند افتتاح حساب بانکی شرکتی' : 'Corporate bank account opening process'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/residency')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'اقامت مدیرعامل' : 'CEO Residency'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'قوانین اقامت تجاری از طریق شرکت' : 'Commercial residency rules via company'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/real-estate-investment')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'سرمایه‌گذاری املاک' : 'Real Estate'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'خرید و سرمایه‌گذاری در بازار املاک' : 'Buying and investing in the property market'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/startup-tech-investment')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'استارت‌آپ و فناوری' : 'Startup & Tech'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'فرصت‌های بخش IT و دانش‌بنیان' : 'Opportunities in IT and tech sectors'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('company/annual-tax-reporting')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'گزارش‌دهی سالانه' : 'Annual Reporting'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'الزامات قانونی حسابداری در پایان سال' : 'Year-end legal accounting requirements'}</p>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

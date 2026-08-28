'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

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
          <Breadcrumb slugRoute="company/registration" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مراحل ثبت شرکت SRL در رومانی' : 'SRL Company Registration Steps in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره ثبت شرکت‌های رومانی (ONRC) — onrc.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Romanian National Trade Register Office (ONRC) — onrc.ro — Last reviewed: August 2026'}
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
                <li>{currentLang === 'fa' ? 'هزینه دولتی ثبت: طبق قانون جدید (اجرایی از ۱ ژانویه ۲۰۲۶) این هزینه دیگر یک رقم یکجا نیست، بلکه اجزای جدا دارد — درخواست ثبت ۲۰۰ لئو + استعلام نام ۲۰ لئو + هزینه انتشار در روزنامه رسمی (Monitorul Oficial) ۱۰ لئو، با ۵۰٪ تخفیف برای ارسال الکترونیکی (یعنی حدود ۱۱۵ لئو آنلاین در برابر ۲۳۰ لئو حضوری). این ارقام تازه معرفی شده‌اند و ممکن است تغییر کنند؛ حتماً پیش از پرداخت، رقم دقیق را از onrc.ro تایید کنید.' : "Government filing fee: under the new fee structure (effective January 1, 2026), this is no longer a single lump sum — it's itemized: 200 RON registration application + 20 RON name-availability check + 10 RON Official Gazette (Monitorul Oficial) publication fee, with a 50% discount for electronic filing (roughly 115 RON online vs. 230 RON in person). These figures are newly introduced and may change; always confirm the exact current amount on onrc.ro before paying."}</li>
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

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-semibold">
            ⚠️ {currentLang === 'fa'
              ? 'به‌روزرسانی مهم (قانون ۲۳۹/۲۰۲۵، از ۱۸ دسامبر ۲۰۲۵): حداقل سرمایه ثبت SRL که از سال ۲۰۲۰ فقط نمادین (۱ لئو) بود، به ۵۰۰ لئو افزایش یافت (۵,۰۰۰ لئو برای شرکت‌هایی با گردش مالی سالانه بیش از ۴۰۰,۰۰۰ لئو). شرکت‌های ثبت‌شده قبل از این تاریخ تا ۱۸ دسامبر ۲۰۲۷ فرصت دارند سرمایه را به سطح جدید برسانند. همچنین از ۱ ژانویه ۲۰۲۶، هر SRL تازه‌ثبت‌شده موظف است ظرف ۶۰ روز کاری از ثبت، یک حساب بانکی پرداختی (نزد بانک یا خزانه‌داری) باز کند و ظرف ۱۵ روز از افتتاح، آن را از طریق پورتال SPV به سازمان امور مالیاتی (ANAF) اعلام کند؛ عدم رعایت این الزام می‌تواند جریمه ۳,۰۰۰ تا ۱۰,۰۰۰ لئو و اعلام «غیرفعال مالیاتی» شرکت را در پی داشته باشد. نکته احتیاطی: برخی منابع Revolut Business را هم برای این حساب اجباری مجاز می‌دانند، اما منابع دیگر تردید دارند که یک حساب موسسه پول الکترونیک (EMI/fintech) شرط قانونی «حساب نزد یک نهاد اعتباری» را برآورده کند — پیش از اتکا به یک حساب fintech برای این الزام قانونی خاص، حتماً با حسابدار خود یا مستقیماً ANAF تایید بگیرید.'
              : "Important update (Law 239/2025, effective December 18, 2025): the minimum SRL share capital, which had been a purely symbolic 1 RON since 2020, was raised to 500 RON (5,000 RON for companies with annual turnover above 400,000 RON). Companies registered before this date have until December 18, 2027 to bring their capital up to the new threshold. Also effective January 1, 2026, every newly registered SRL must open a payment account (at a bank or the State Treasury) within 60 working days of registration and report it to the tax authority (ANAF) via the SPV portal within 15 days of opening it — failure to comply can trigger a fine of 3,000 to 10,000 RON and the company being declared \"fiscally inactive\". A caution: some sources list Revolut Business as acceptable for this mandatory account, while others question whether an electronic-money-institution (EMI/fintech) account satisfies the legal \"credit institution\" requirement — before relying on a fintech account for this specific legal obligation, confirm directly with your accountant or ANAF."}
          </div>

          <div className="p-6 sm:p-8 bg-white border border-[#dfe6ef] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? '🇮🇷 ویژه ایرانیان: وکالت‌نامه از ایران و مهلت ۶۰ روزه حساب بانکی' : '🇮🇷 Iran-Specific: Power of Attorney from Iran & the 60-Day Bank Account Deadline'}
            </h3>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر نمی‌خواهید شخصاً برای ثبت شرکت به رومانی سفر کنید، باید به یک وکیل یا حسابدار در رومانی وکالت‌نامه بدهید. چون ایران عضو کنوانسیون آپوستیل لاهه نیست، این وکالت‌نامه هم باید همان زنجیره تصدیق کنسولی را طی کند که برای سایر مدارک ایرانی لازم است (ترجمه رسمی در ایران، تایید وزارت دادگستری و وزارت امور خارجه ایران، و در نهایت تایید سفارت رومانی در تهران) — برای جزئیات کامل این زنجیره به صفحه «دفاتر اسناد رسمی» مراجعه کنید. نکته عملی‌تر و فوری‌تر: قانون جدید مهلت ۶۰ روزه‌ای برای باز کردن حساب بانکی شرکتی تعیین کرده، در حالی که تجربه مستند‌شده در چند کشور اروپایی نشان می‌دهد بانک‌ها گاهی نسبت به متقاضیان با پیشینه ایرانی محتاط‌تر عمل می‌کنند (به‌خاطر سیاست‌های داخلی ریسک‌گریزی، نه یک ممنوعیت مستقیم قانونی) — این یعنی بهتر است فرآیند افتتاح حساب شرکتی را از همان روز اول ثبت شرکت، بدون تاخیر، شروع کنید. جزئیات کامل در صفحه «حساب بانکی شرکتی» زیر آمده است.'
                : "If you don't want to travel to Romania in person to register the company, you'll need to give power of attorney to a lawyer or accountant there. Because Iran is not party to the Hague Apostille Convention, that power of attorney must go through the same consular legalization chain required for other Iranian documents (official translation in Iran, endorsement by Iran's Ministry of Justice and Ministry of Foreign Affairs, and final legalization at the Romanian Embassy in Tehran) — see the \"Notary Public\" page for the full chain. The more time-sensitive point: the new law sets a hard 60-working-day deadline to open the company's bank account, while documented experience in several European countries shows banks are sometimes more cautious with applicants of Iranian background (from internal risk-averse policies, not a direct legal ban) — so it's worth starting the corporate account-opening process the same day the company is registered, without delay. Full details are on the \"Corporate Bank Account\" page below."}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'پروسه ثبت شرکت چقدر زمان می‌برد؟' : 'How long does the registration take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'پس از آماده‌سازی و ارسال کامل مدارک به ONRC، خودِ ثبت نهایی معمولاً بین ۳ تا ۵ روز کاری زمان می‌برد. اما این فقط زمان رسیدگی ONRC است، نه کل مسیر عملیاتی شدن: با احتساب افتتاح حساب بانکی و ثبت‌نام مالیاتی، منابع رومانیایی زمان واقعی را حدود ۵ تا ۱۰ روز کاری برای یک متقاضی مقیم با مدارک کامل تخمین می‌زنند. برای متقاضیان ایرانی این رقم معمولاً واقع‌بینانه‌تر نیست، چون زنجیره تصدیق کنسولی وکالت‌نامه/مدارک (ایران عضو کنوانسیون آپوستیل لاهه نیست) و مهلت قانونی ۶۰ روزه افتتاح حساب بانکی (که در عمل می‌تواند برای متقاضیان ایرانی طولانی‌تر شود) هر دو زمان کل را افزایش می‌دهند — این یک برآورد منطقی است، نه رقم رسمی مستندشده برای این گروه خاص.' : "Once all documents are prepared and submitted to ONRC, the registration itself typically takes 3 to 5 working days. But that's only ONRC's own processing time, not the full path to being fully operational: factoring in bank account opening and tax registration, Romanian sources estimate a realistic total of roughly 5 to 10 working days for a resident applicant with complete documentation. For Iranian applicants, this figure is usually not realistic, since both the consular legalization chain for the power of attorney/documents (Iran is not a Hague Apostille signatory) and the legal 60-working-day bank account deadline (which can in practice run longer for Iranian applicants) extend the overall timeline — this is a reasoned estimate, not an officially documented figure for this specific group."}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'هزینه دولتی ثبت شرکت دقیقاً چقدر است؟' : "What exactly is the government registration fee?"}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'از ۱ ژانویه ۲۰۲۶ این هزینه به‌صورت اجزای جدا محاسبه می‌شود (حدود ۱۱۵ تا ۲۳۰ لئو بسته به روش ارسال) — جزئیات کامل در کارت «آماده‌سازی مقدماتی» بالا آمده. این رقم به‌تازگی تغییر کرده؛ رقم دقیق روز را از onrc.ro بگیرید.' : 'Since January 1, 2026, this fee is calculated as separate line items (roughly 115 to 230 RON depending on filing method) — full breakdown in the "Preliminary Preparation" card above. This figure changed recently; get the exact current amount from onrc.ro.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای ثبت شرکت به شریک رومانیایی نیاز دارم؟' : 'Do I need a local Romanian partner?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، اتباع خارجی می‌توانند به تنهایی مالک ۱۰۰٪ سهام شرکت و مدیرعامل آن باشند.' : 'No, foreign nationals can own 100% of the company shares and act as the sole director.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'حداقل سرمایه ثبت شرکت الان چقدر است؟' : "What's the current minimum share capital?"}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'از ۱۸ دسامبر ۲۰۲۵ (قانون ۲۳۹/۲۰۲۵)، ۵۰۰ لئو برای اکثر SRLهای تازه‌ثبت‌شده (۵,۰۰۰ لئو اگر گردش مالی سالانه از ۴۰۰,۰۰۰ لئو بیشتر باشد) — پیش از این فقط ۱ لئوی نمادین کافی بود.' : "Since December 18, 2025 (Law 239/2025), 500 RON for most newly registered SRLs (5,000 RON if annual turnover exceeds 400,000 RON) — before that, a symbolic 1 RON was sufficient."}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا باید فوراً حساب بانکی شرکتی باز کنم؟' : 'Do I need to open a corporate bank account right away?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'قانوناً ۶۰ روز کاری از تاریخ ثبت شرکت فرصت دارید، اما با توجه به احتمال طولانی‌تر شدن فرآیند برای متقاضیان با پیشینه ایرانی، بهتر است بلافاصله شروع کنید.' : "Legally you have 60 working days from registration, but given the account-opening process can take longer for applicants of Iranian background, it's best to start immediately."}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="company/registration" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'tax-types':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="company/tax-types" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'نرخ‌های مالیاتی شرکت‌های کوچک در رومانی' : 'Small Business Tax Rates in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: قانون مالیاتی رومانی، سازمان امور مالیاتی (ANAF) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Romanian Tax Code, National Agency for Fiscal Administration (ANAF) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'شرایط مالیاتی شرکت به نوع فعالیت، درآمد، ساختار مالکیت، کارکنان و مقررات جاری بستگی دارد و باید با حسابدار بررسی شود. چنانچه گردش مالی از این سقف عبور کند، شرکت وارد رژیم استاندارد مالیات بر سود شرکتی با نرخ ۱۶٪ می‌شود. درک این ساختارها برای برنامه‌ریزی مالی دقیق ضروری است.'
              : 'Corporate tax conditions depend on the type of activity, revenue, ownership structure, employees, and current regulations, and must be verified with an accountant. Should a company exceed this revenue threshold, it transitions to the standard corporate profit tax rate of 16%. Understanding these structures is vital for accurate financial forecasting.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'نرخ ۱٪ میکرو-شرکت و شرایط بهره‌مندی' : '1% Micro-Enterprise Rate & Eligibility'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'نرخ ترجیحی ۱٪ بر درآمد (نه سود) فقط برای شرکت‌هایی با گردش مالی سالانه زیر ۱۰۰,۰۰۰ یورو و حداقل یک کارمند تمام‌وقت قابل استفاده است.' : 'The preferential 1% rate — applied to revenue, not profit — is only available to companies with an annual turnover under €100,000 and at least one full-time employee.'}</li>
                <li>{currentLang === 'fa' ? 'نظام قبلی دو نرخی (۱٪ با کارمند / ۳٪ بدون کارمند) از ۱ ژانویه ۲۰۲۶ طبق OUG 89/2025 لغو شد؛ اکنون فقط یک نرخ ثابت ۱٪ وجود دارد و داشتن حداقل یک کارمند برای همه الزامی است. سقف گردش مالی هم در همین اصلاحیه از ۲۵۰,۰۰۰ یورو به ۱۰۰,۰۰۰ یورو کاهش یافت.' : 'The previous two-tier system (1% with an employee / 3% without one) was eliminated on January 1, 2026 under OUG 89/2025; there is now a single flat 1% rate, and having at least one employee is mandatory for everyone. The same amendment also cut the turnover threshold from €250,000 to €100,000.'}</li>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033]">
                {currentLang === 'fa' ? 'مالیات بر ارزش افزوده (VAT) — از اوت ۲۰۲۵' : 'VAT — Since August 2025'}
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'نرخ استاندارد VAT از ۱۹٪ به ۲۱٪ افزایش یافت (از ۱ اوت ۲۰۲۵، طبق قانون ۱۴۱/۲۰۲۵)؛ نرخ‌های کاهش‌یافته قبلی (۵٪ و ۹٪) هم در یک نرخ واحد ۱۱٪ ادغام شدند.' : 'The standard VAT rate rose from 19% to 21% (effective August 1, 2025, under Law 141/2025); the former reduced rates (5% and 9%) were also unified into a single 11% rate.'}</li>
                <li>{currentLang === 'fa' ? 'سقف ثبت‌نام اجباری VAT از ۱ سپتامبر ۲۰۲۵ به ۳۹۵,۰۰۰ لئو افزایش یافت (معادل تقریبی ۷۸ تا ۸۰ هزار یورو به نرخ بازار امروز).' : 'The mandatory VAT registration threshold rose to RON 395,000 effective September 1, 2025 (roughly €78,000–80,000 at today\'s market exchange rate).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033]">
                {currentLang === 'fa' ? 'مالیات بر سود سهام (Dividend Tax) — از ژانویه ۲۰۲۶' : 'Dividend Withholding Tax — Since January 2026'}
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'از ۱ ژانویه ۲۰۲۶، نرخ مالیات کسر از منبع سود سهام برای سهامداران حقیقی (چه مقیم و چه غیرمقیم رومانی) از ۱۰٪ به ۱۶٪ افزایش یافت (طبق همان قانون ۱۴۱/۲۰۲۵).' : 'Effective January 1, 2026, the withholding tax rate on dividends paid to individual shareholders (both resident and non-resident) rose from 10% to 16% (under the same Law 141/2025).'}</li>
                <li>{currentLang === 'fa' ? 'سهامداران مقیم رومانی، علاوه بر مالیات ۱۶٪، مشمول حق بیمه سلامت (CASS) ۱۰٪ هم می‌شوند، اما فقط اگر مجموع درآمد غیرحقوقی سالانه (سود سهام + بهره + سایر) به ۶ برابر حداقل دستمزد ناخالص برسد؛ سهامداران غیرمقیم مشمول CASS نیستند.' : 'Romanian-resident shareholders also owe a 10% health-insurance contribution (CASS) on top of the 16% tax, but only once total annual non-salary income (dividends + interest + other) reaches 6× the gross minimum wage; non-resident shareholders are not subject to CASS.'}</li>
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white border border-[#dfe6ef] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? '🇮🇷 ویژه ایرانیان: نرخ کاهش‌یافته سود سهام طبق معاهده مالیاتی ایران-رومانی' : '🇮🇷 Iran-Specific: The Reduced Dividend Rate Under the Iran-Romania Tax Treaty'}
            </h3>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'معاهده اجتناب از اخذ مالیات مضاعف ایران-رومانی (امضا ۲۰۰۱، قانون ۲۷۹/۲۰۰۲، همان معاهده‌ای که در بخش «کار» درباره حقوق کارکنان توضیح داده شد) در ماده ۱۰ خودش، سقف مالیات کسر از منبع سود سهام را ۱۰٪ تعیین کرده — یعنی پایین‌تر از نرخ داخلی جدید ۱۶٪ رومانی. به این معنا که یک سهامدار مقیم مالیاتی ایران که از شرکت رومانیایی خود سود سهام دریافت می‌کند، در اصل می‌تواند با ارائه «گواهی اقامت مالیاتی» از مقامات ایرانی به سازمان امور مالیاتی رومانی (ANAF)، از نرخ کاهش‌یافته ۱۰٪ به‌جای ۱۶٪ استفاده کند. توجه: این یک حق قانونی مالیاتی است و کاملاً جدا از مشکل عملی انتقال خودِ پول است (که در صفحه «صرافی و انتقال ارز» توضیح داده شده) — داشتن حق قانونی به نرخ پایین‌تر به‌معنای ساده‌تر شدن انتقال واقعی وجه نیست.'
                : "The Iran-Romania double taxation treaty (signed 2001, ratified by Law 279/2002 — the same treaty already covered on the Work section for salary income) caps dividend withholding tax at 10% under its own Article 10, below Romania's new 16% domestic rate. In practice, an Iranian tax resident receiving dividends from their Romanian company can claim the reduced 10% treaty rate instead of 16% by submitting a Certificate of Tax Residency from Iranian authorities to Romania's tax agency (ANAF). Note: this is a distinct legal tax entitlement, separate from the practical difficulty of actually transferring the money (covered on the \"Currency Exchange\" page) — being legally entitled to the lower rate doesn't make the physical transfer any easier."}
            </p>
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
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'نرخ مالیات سود سهام الان چقدر است؟' : "What's the current dividend tax rate?"}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'به‌طور کلی ۱۶٪ از ۱ ژانویه ۲۰۲۶ (قبلاً ۱۰٪ بود)؛ اما سهامداران مقیم مالیاتی ایران می‌توانند با گواهی اقامت مالیاتی، طبق معاهده مالیاتی دوجانبه، از نرخ ۱۰٪ استفاده کنند.' : "Generally 16% since January 1, 2026 (previously 10%); however, Iranian tax residents can use the 10% treaty rate instead, with a Certificate of Tax Residency, under the bilateral tax treaty."}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="company/tax-types" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'bank-account':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="company/bank-account" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'افتتاح حساب بانکی برای شرکت در رومانی' : 'Opening a Corporate Bank Account in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: بانک ملی رومانی (BNR) — bnr.ro، اداره ملی ثبت شرکت‌ها (ONRC) — onrc.ro — این بخش راهنمای عمومی است؛ شرایط دقیق هر بانک باید مستقیماً از آن بانک استعلام شود. آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Sources: National Bank of Romania (BNR) — bnr.ro, National Trade Register Office (ONRC) — onrc.ro — this section is a general guide; exact conditions should be verified directly with each respective bank. Last reviewed: August 2026'}
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

          <div className="p-6 sm:p-8 bg-white border border-[#dfe6ef] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? '🇮🇷 ویژه ایرانیان: چرا افتتاح حساب بانکی شرکتی ممکن است زمان بیشتری ببرد' : '🇮🇷 Iran-Specific: Why Opening a Corporate Account May Take Longer'}
            </h3>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'در اوت ۲۰۲۱، «فرست بانک» (First Bank SA) رومانی — با مالکیت آمریکایی — بیش از ۸۵۰,۰۰۰ دلار به سازمان کنترل دارایی‌های خارجی آمریکا (OFAC) جریمه پرداخت کرد، به‌خاطر ۷۰ تراکنش مرتبط با اشخاص مستقر در ایران و سوریه. این تنها مورد مستند از جریمه یک بانک رومانیایی به‌خاطر تراکنش‌های مرتبط با ایران است، و به‌طور معقول توضیح می‌دهد چرا بانک‌های رومانیایی امروز نسبت به مشتریان و تراکنش‌های مرتبط با ایران محتاط‌تر از میانگین عمل می‌کنند. تحریم‌های اتحادیه اروپا که در سپتامبر ۲۰۲۵ دوباره علیه ایران برقرار شدند (snapback)، عمدتاً بانک‌های ایرانی و نهادهای مالی مرتبط را هدف گرفته‌اند، نه لزوماً حساب شخصی/شرکتی اشخاص ایرانی مقیم رومانی — با این حال، تجربه مستند‌شده در کشورهای دیگر اتحادیه اروپا (مثلاً ایتالیا و آلمان، جایی که چند بانک به‌صراحت حساب مشتریان ایرانی را به‌خاطر ملیت بسته یا رد کرده‌اند) نشان می‌دهد این نوع محافظه‌کاری بانکی («ریسک‌گریزی» یا de-risking) در سطح اتحادیه اروپا رایج است، هرچند هیچ گزارش مشخصی از رد درخواست در خودِ رومانی پیدا نشد. نکته مثبت: طبق یک منبع حقوقی تخصصی، اشخاص حقوقی ایرانی (شرکت‌ها) هم می‌توانند در رومانی حساب باز کنند، به شرط ارائه مدارک کامل — پس این یک مانع مطلق نیست، بلکه یک فرآیند کندتر و با بررسی دقیق‌تر (KYC/AML) است. برای بهترین نتیجه: مدارک منبع سرمایه (proof of source of funds) را از همان ابتدا کامل و شفاف آماده کنید، و فرآیند را بلافاصله بعد از ثبت شرکت شروع کنید — قانون جدید فقط ۶۰ روز کاری فرصت می‌دهد (به صفحه «ثبت شرکت» مراجعه کنید).'
                : "In August 2021, First Bank SA (a Romanian bank with US ownership) paid a fine of over $850,000 to the US Office of Foreign Assets Control (OFAC) over 70 transactions linked to persons based in Iran and Syria. This is the only documented case of a Romanian bank being fined specifically over Iran-linked transactions, and it reasonably explains why Romanian banks today may be more cautious than average with Iran-connected customers and transactions. The EU sanctions reimposed on Iran in September 2025 (the \"snapback\") mainly target Iranian banks and related financial entities, not necessarily the personal or corporate accounts of Iranian nationals resident in Romania — however, documented experience in other EU countries (for instance Italy and Germany, where several banks have explicitly closed or refused accounts for Iranian customers over nationality) shows this kind of bank caution (\"de-risking\") is common across the EU, though no specific report of a refusal in Romania itself was found. The positive counterpoint: according to one specialist legal source, Iranian legal entities (companies) can open accounts in Romania, provided full documentation is submitted — so this isn't an absolute barrier, just a slower process with closer KYC/AML scrutiny. For the best outcome: prepare complete, transparent proof-of-source-of-funds documentation from the start, and begin the process immediately after company registration — the new law only allows 60 working days (see the \"Company Registration\" page)."}
            </p>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed border-t border-[#eef2f6] pt-4">
              {currentLang === 'fa'
                ? 'ما نتوانستیم هیچ منبع عمومی و قابل‌استناد پیدا کنیم که یک بانک مشخص در رومانی را به‌عنوان «پذیرای بیشتر اتباع ایرانی» معرفی کرده باشد — بانک‌ها به دلایل قانونی سیاست‌های ریسک‌پذیری خود را علنی نمی‌کنند، پس از معرفی نام یک بانک خاص در این‌جا خودداری می‌کنیم. در عوض، چند نکته عملی و امن: (۱) به گفته یک منبع حقوقی رومانیایی، بانک‌های بزرگ‌تر با بخش شرکتی/بین‌المللی اختصاصی معمولاً مدارک پیچیده‌تر KYC مشتریان خارجی را کارآمدتر پردازش می‌کنند — این لزوماً به‌معنای «سخت‌گیری کمتر» نیست، بلکه «آشنایی بیشتر با پرونده‌های خارجی» است؛ (۲) همکاری با یک وکیل یا حسابدار رومانیایی که با وکالت‌نامه پرونده را جلو ببرد و به زبان رومانیایی با بانک ارتباط بگیرد، طبق تجربه مستند‌شده روند را قابل‌پیش‌بینی‌تر می‌کند؛ (۳) اگر به حساب یک موسسه پول الکترونیک (fintech/EMI مثل Revolut Business یا Wise Business) به‌جای بانک سنتی فکر می‌کنید، توجه کنید که این نوع حساب ممکن است الزام قانونی «حساب نزد نهاد اعتباری» طبق قانون ۲۳۹/۲۰۲۵ را برآورده نکند — پیش از تصمیم‌گیری حتماً تایید بگیرید.'
                : "We could not find any public, citable source naming a specific bank in Romania as more accommodating toward Iranian nationals — banks generally don't publicize their risk-tolerance policies for legal reasons, so we're deliberately not naming one here. Instead, a few safe, practical pointers: (1) per one Romanian legal source, larger banks with a dedicated corporate/international department tend to process complex foreign-KYC documentation more efficiently — this isn't necessarily about being \"less strict,\" but about being more familiar with foreign case files; (2) working with a Romanian lawyer or accountant who can advance the file under power of attorney and communicate with the bank in Romanian has, per documented experience, made the process more predictable; (3) if you're considering an electronic-money-institution (fintech/EMI, e.g. Revolut Business or Wise Business) account instead of a traditional bank, note that this type of account may not satisfy the Law 239/2025 legal requirement of an account \"with a credit institution\" — confirm this before deciding."}
            </p>
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
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا تحریم‌ها به‌طور مستقیم مانع افتتاح حساب شرکتی اشخاص ایرانی می‌شوند؟' : 'Do the sanctions directly block Iranian nationals from opening a corporate account?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'متن تحریم‌های اتحادیه اروپا صراحتاً حساب اشخاص حقیقی/حقوقی ایرانی مقیم اتحادیه اروپا را هدف نگرفته؛ مشکلاتی که در عمل پیش می‌آید بیشتر از محافظه‌کاری داخلی بانک‌ها (ریسک‌گریزی) ناشی می‌شود، نه یک ممنوعیت مستقیم قانونی.' : "The text of the EU sanctions doesn't explicitly target the accounts of Iranian individuals or companies resident in the EU; the friction that occurs in practice mostly comes from banks' own internal risk-averse policies, not a direct legal prohibition."}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="company/bank-account" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'residency':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="company/residency" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'اقامت برای مدیرعامل و سهامدار شرکت' : 'Residency for Company Director and Shareholder'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: August 2026'}
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

          <div className="overflow-x-auto rounded-2xl border border-[#dfe6ef] shadow-sm">
            <table className="w-full text-sm text-[#526174] bg-white">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#dfe6ef]">
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'نقش شما در شرکت' : 'Your Role in the Company'}</th>
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'حداقل سرمایه‌گذاری (طبق ماده ۵۵ OUG 194/2002)' : 'Minimum Investment (per Art. 55, OUG 194/2002)'}</th>
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'یا حداقل اشتغال‌زایی' : 'Or Minimum Jobs Created'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eef2f6]">
                  <td className="p-4">{currentLang === 'fa' ? 'شریک/سهامدار SRL (asociat)' : 'SRL Partner/Associate (asociat)'}</td>
                  <td className="p-4">€50,000</td>
                  <td className="p-4">{currentLang === 'fa' ? '۱۰ شغل تمام‌وقت' : '10 full-time jobs'}</td>
                </tr>
                <tr className="border-b border-[#eef2f6]">
                  <td className="p-4">{currentLang === 'fa' ? 'سهامدار SA (acționar)' : 'SA Shareholder (acționar)'}</td>
                  <td className="p-4">€70,000</td>
                  <td className="p-4">{currentLang === 'fa' ? '۱۵ شغل تمام‌وقت' : '15 full-time jobs'}</td>
                </tr>
                <tr>
                  <td className="p-4">{currentLang === 'fa' ? 'سطح ارتقاءیافته (اقامت ۳ ساله به‌جای سالانه)' : 'Enhanced tier (3-year permit instead of annual)'}</td>
                  <td className="p-4">€500,000</td>
                  <td className="p-4">{currentLang === 'fa' ? '۵۰+ شغل تمام‌وقت' : '50+ full-time jobs'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 italic px-2">
            {currentLang === 'fa'
              ? 'این ارقام مربوط به تمدید اقامت (ماده ۵۵) است — یا سرمایه‌گذاری یا اشتغال‌زایی کافی است، نیازی به هر دو نیست. توجه: آستانه ورودی اولیه نزد آژانس ARICE (پیش از سفر) کمی بالاتر است — €۱۰۰,۰۰۰/۱۰ شغل برای SRL و €۱۵۰,۰۰۰/۱۵ شغل برای SA — برای جزئیات کامل مسیر ARICE به صفحه «اقامت از طریق سرمایه‌گذاری» مراجعه کنید. مبلغ‌ها متناسب با سهم مالکیت شما محاسبه می‌شود.'
              : "These figures apply to the residency renewal stage (Art. 55) — either the investment OR the job-creation threshold is sufficient, not both. Note: the initial entry threshold with ARICE (before travel) is somewhat higher — €100,000/10 jobs for an SRL and €150,000/15 jobs for an SA — see the \"Investment Residency\" page for the full ARICE pathway. Amounts are calculated proportionally to your ownership share."}
          </p>

          <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'روند و مهلت‌ها' : 'Process & Timeline'}
            </h3>
            <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
              <li>{currentLang === 'fa' ? 'درخواست تمدید باید نزد اداره کل مهاجرت (IGI) — بر اساس اطلاعات موجود، دفتر بخش ۵ بخارست برای متقاضیان مقیم بخارست — ثبت شود، همراه با گواهی اداره کار محلی درباره تعداد کارکنان.' : 'The renewal application must be filed with IGI — based on available information, the Sector 5 Bucharest office for applicants resident in Bucharest — along with a certificate from the local labor inspectorate on employee headcount.'}</li>
              <li>{currentLang === 'fa' ? 'مهلت رسیدگی IGI طبق متن رسمی «ظرف ۳۰ روز» است، با امکان تمدید تا ۱۵ روز دیگر در صورت نیاز به مدارک تکمیلی.' : "IGI's official processing timeline is stated as \"within 30 days,\" extendable by up to 15 more days if supplementary documents are needed."}</li>
            </ul>
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
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای شریک SRL: ۵۰,۰۰۰ یورو یا ۱۰ شغل تمام‌وقت. برای سهامدار SA: ۷۰,۰۰۰ یورو یا ۱۵ شغل تمام‌وقت — این ارقام مستقیماً از ماده ۵۵ آیین‌نامه اتباع خارجی (OUG 194/2002) گرفته شده‌اند.' : 'For an SRL partner: €50,000 or 10 full-time jobs. For an SA shareholder: €70,000 or 15 full-time jobs — these figures come directly from Article 55 of the Foreigners Regime (OUG 194/2002).'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا رقمی که در صفحه «اقامت از طریق سرمایه‌گذاری» دیدم بالاتر است؟' : 'Why is the figure on the "Investment Residency" page higher?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'چون آن صفحه درباره آستانه ورودی اولیه نزد ARICE است (پیش از دریافت ویزا و سفر)، در حالی که این صفحه درباره تمدید سالانه اقامت پس از استقرار در رومانی است — دو مرحله متفاوت با دو آستانه متفاوت.' : "Because that page covers the initial entry threshold with ARICE (before getting the visa and traveling), while this page covers the annual residency renewal after you're already established in Romania — two different stages with two different thresholds."}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="company/residency" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'real-estate-investment':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="company/real-estate-investment" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سرمایه‌گذاری در املاک و مستغلات' : 'Real Estate Investment'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره ثبت اسناد و املاک رومانی (OCPI)، سازمان امور مالیاتی رومانی (ANAF) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: National Agency for Cadastre and Land Registration (OCPI), National Agency for Fiscal Administration (ANAF) — Last reviewed: August 2026'}
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

          <div className="overflow-x-auto rounded-2xl border border-[#dfe6ef] shadow-sm">
            <table className="w-full text-sm text-[#526174] bg-white">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#dfe6ef]">
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'ارزش ملک (لئو)' : 'Property Value (RON)'}</th>
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'حداقل حق‌الزحمه نوتاری (Ordin MJ 177/C/2024)' : 'Minimum Notary Fee (Ordin MJ 177/C/2024)'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">≤ 20,000</td><td className="p-4">2.2%، {currentLang === 'fa' ? 'حداقل ۲۳۰ لئو' : 'min. 230 RON'}</td></tr>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">20,001–65,000</td><td className="p-4">440–725 {currentLang === 'fa' ? 'لئو + ۱.۶٪ تا ۱.۹٪ مازاد' : 'RON + 1.6%–1.9% over threshold'}</td></tr>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">65,001–200,000</td><td className="p-4">1,205–1,705 {currentLang === 'fa' ? 'لئو + ۱.۱٪ تا ۱.۵٪ مازاد' : 'RON + 1.1%–1.5% over threshold'}</td></tr>
                <tr><td className="p-4">&gt; 200,000</td><td className="p-4">2,805 {currentLang === 'fa' ? 'لئو + ۰.۶٪ تا ۰.۹٪ مازاد' : 'RON + 0.6%–0.9% over threshold'}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 italic px-2">
            {currentLang === 'fa'
              ? 'این ارقام حداقل قانونی هستند (نوتاری‌ها می‌توانند بیشتر بگیرند) و مالیات بر ارزش افزوده ۲۱٪ (از اوت ۲۰۲۵) روی خودِ حق‌الزحمه نوتاری اضافه می‌شود — نه لزوماً روی کل قیمت ملک؛ VAT روی قیمت خرید معمولاً فقط برای املاک نوساز از فروشنده دارای مجوز مالیاتی (نه معاملات دست‌دوم بین اشخاص حقیقی) قابل اعمال است. علاوه بر این: ثبت در دفتر املاک (Carte Funciară) نزد OCPI برای اشخاص حقیقی ۰.۱۵٪ ارزش سند (حداقل ۶۰ لئو) و برای اشخاص حقوقی (شرکت) ۰.۵۰٪ هزینه دارد؛ فروشنده هم مالیات بر انتقال (۳٪ اگر ملک کمتر از ۳ سال مالکیت داشته، ۱٪ اگر بیشتر) را پرداخت می‌کند که نوتاری در همان جلسه کسر و به حساب دولت واریز می‌کند.'
              : 'These are legal minimums (notaries may charge more), and 21% VAT (since August 2025) is added on top of the notary\'s own fee — not necessarily on the full property price; VAT on the purchase price itself generally applies only to new-build sales from a VAT-registered seller, not resale transactions between individuals. In addition: Land Registry (Carte Funciară) registration with OCPI costs 0.15% of the deed value for individuals (min. 60 RON) and 0.50% for legal entities (companies); the seller also pays a transfer tax (3% if the property was owned under 3 years, 1% if longer), which the notary deducts and remits to the state at signing.'}
          </p>

          <div className="p-6 sm:p-8 bg-white border border-[#dfe6ef] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? '🇮🇷 ویژه ایرانیان: عدم وجود معاهده متقابل مالکیت زمین با ایران' : '🇮🇷 Iran-Specific: No Land-Ownership Reciprocity Treaty With Iran'}
            </h3>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'یک منبع تخصصی حقوقی رومانیایی، ایران را صراحتاً در فهرست کشورهایی نام می‌برد که تاکنون هیچ معاهده متقابل مالکیت زمین با رومانی امضا نکرده‌اند (در کنار کشورهایی مانند آمریکا، چین، ترکیه و ژاپن) — یعنی اتباع ایرانی، مثل اکثر اتباع غیراتحادیه‌اروپایی، فقط می‌توانند مالک بنا (آپارتمان/ساختمان) باشند و روی زمینِ زیر آن فقط «حق انتفاع» (drept de superficie) دارند، نه مالکیت کامل. راه‌حل رایج همان است که در بالا توضیح داده شد: خرید ملک (همراه با زمین) از طریق یک شرکت رومانیایی (SRL) که خودتان مالک آن هستید. نکته جداگانه: ایران در فهرست «کشورهای پرریسک» اتحادیه اروپا از نظر پول‌شویی (AML) قرار دارد که طبق قانون به نوتاری‌ها و بانک‌ها الزام می‌کند بررسی دقیق‌تری (Enhanced Due Diligence) روی تراکنش‌های مرتبط با این کشورها انجام دهند — این یک واقعیت حقوقی کلی است، نه گزارشی مستند از مانع خاص برای خریداران ایرانی در دفتر یک نوتاری مشخص، اما در برنامه‌ریزی زمانی معامله باید در نظر گرفته شود.'
                : 'One specialist Romanian legal source explicitly names Iran among the countries that have not signed a reciprocal land-ownership treaty with Romania (alongside countries like the US, China, Turkey, and Japan) — meaning Iranian nationals, like most non-EU citizens, can only own the building itself (apartment/structure) and hold a "right of superficies" (drept de superficie), not full ownership, over the land beneath it. The common workaround remains the one described above: buying the property (land included) through a Romanian company (SRL) that you own. A separate point: Iran is on the EU\'s AML "high-risk country" list, which legally requires notaries and banks to apply Enhanced Due Diligence to transactions connected to such countries — this is a general legal fact, not a documented report of a specific hurdle for Iranian buyers at any particular notary\'s office, but it is worth factoring into your transaction timeline.'}
            </p>
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
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا ایران با رومانی معاهده مالکیت زمین دارد؟' : 'Does Iran have a land-ownership treaty with Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. ایران در فهرست کشورهای بدون معاهده متقابل قرار دارد؛ راه‌حل رایج، خرید از طریق یک شرکت رومانیایی (SRL) است که شرکت‌ها هیچ محدودیتی در مالکیت زمین ندارند.' : "No. Iran is on the list of countries without a reciprocal treaty; the common workaround is buying through a Romanian company (SRL), since companies face no land-ownership restrictions."}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="company/real-estate-investment" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'startup-tech-investment':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="company/startup-tech-investment" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'استارت‌آپ‌ها و فناوری اطلاعات' : 'Tech Startups & Innovation'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: قانون مالیاتی رومانی (Legea 227/2015)، OUG 156/2024، سازمان امور مالیاتی رومانی (ANAF) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Romanian Fiscal Code (Legea 227/2015), OUG 156/2024, National Agency for Fiscal Administration (ANAF) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-semibold">
            ⚠️ {currentLang === 'fa'
              ? 'به‌روزرسانی مهم: معافیت مالیات بر درآمد ۱۰٪ برای برنامه‌نویسان که سال‌ها یکی از مشوق‌های شناخته‌شده رومانی بود، از ۱ ژانویه ۲۰۲۵ طبق OUG 156/2024 لغو شده است. اگر جایی (حتی در همین سایت‌های رقیب) هنوز این معافیت را به‌عنوان مزیت فعلی می‌بینید، منسوخ است — حقوق کارکنان بخش نرم‌افزار اکنون دقیقاً مانند سایر مشاغل مالیات می‌گیرد.'
              : "Important update: the 10% income-tax exemption for software developers — long one of Romania's best-known incentives — was abolished effective January 1, 2025, under OUG 156/2024. If you see this exemption described elsewhere as still active, that source is outdated: software-sector salaries are now taxed exactly like any other role."}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'رومانی همچنان یکی از قطب‌های مهم فناوری اروپاست، اما مسیر واقعی صرفه‌جویی مالیاتی برای بنیان‌گذاران استارت‌آپ دیگر معافیت مالیاتی برنامه‌نویسان نیست (که لغو شده)، بلکه رژیم مالیاتی «میکرو-شرکت» (Microîntreprindere) است: نرخ ۱٪ روی گردش مالی به‌جای ۱۶٪ روی سود، تا سقف ۱۰۰,۰۰۰ یورو گردش سالانه، به شرط داشتن حداقل یک کارمند تمام‌وقت. برای جزئیات کامل این رژیم به صفحه «انواع مالیات شرکتی» مراجعه کنید.'
              : "Romania remains a major European tech hub, but the real tax-planning lever for startup founders is no longer the (now-defunct) developer tax exemption — it's the micro-enterprise regime (Microîntreprindere): a flat 1% tax on revenue instead of 16% on profit, up to €100,000 in annual turnover, provided the company has at least one full-time employee. See the \"Company Tax Types\" page for full details on this regime."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'چه چیزی واقعاً باقی مانده' : "What's Actually Still In Effect"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رژیم میکرو-شرکت (نرخ ۱٪ گردش مالی) همچنان برای اکثر استارت‌آپ‌های نوپای فناوری بهترین گزینه مالیاتی محسوب می‌شود — نه از طریق کد فعالیت (CAEN) خاص، بلکه از طریق سطح گردش مالی و ساختار شرکت.' : "The micro-enterprise regime (1% revenue tax) remains the best available tax structure for most early-stage tech startups — driven by revenue level and company structure, not by a special CAEN code."}</li>
                <li>{currentLang === 'fa' ? 'نرخ استاندارد مالیات بر سود شرکتی (۱۶٪) برای شرکت‌هایی که از سقف میکرو-شرکت عبور می‌کنند اعمال می‌شود؛ حقوق کارکنان بخش نرم‌افزار (از جمله برنامه‌نویسان) اکنون مانند سایر کارکنان مشمول ۱۰٪ مالیات بر درآمد + سهم کامل CAS/CASS است.' : "The standard 16% corporate profit tax applies once a company exceeds the micro-enterprise threshold; software-sector salaries (including programmers) are now subject to the standard 10% income tax plus full CAS/CASS contributions, same as any other role."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'چه چیزی حذف شده' : "What Was Removed"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'معافیت مالیات بر درآمد ۱۰٪ برای مشاغل «تولید نرم‌افزار» (قانون مالیاتی، ماده ۶۰، کدهای CAEN مانند 6201) از ۱ ژانویه ۲۰۲۵ به‌طور کامل لغو شده است.' : 'The 10% income-tax exemption for "software creation" roles (Fiscal Code Art. 60, CAEN codes like 6201) was fully repealed on January 1, 2025.'}</li>
                <li>{currentLang === 'fa' ? 'در همان تاریخ، سهم کامل بازنشستگی (پیلار دوم) روی کل حقوق این کارکنان نیز اجباری شد — پیش‌تر بخشی از این سهم به‌طور غیرمستقیم از طریق همین معافیت پوشش داده می‌شد.' : "As of the same date, mandatory Pillar II pension contributions on the full salary also became compulsory for these employees — previously offset in part by the exemption itself."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته برای کارآفرینان استارت‌آپی' : 'Tip for Startup Entrepreneurs'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'برنامه‌ریزی مالیاتی خود را بر اساس رژیم میکرو-شرکت و نه یک معافیت بخشی خاص انجام دهید؛ جزئیات ثبت شرکت در صفحه «مراحل ثبت شرکت» موجود است.' : 'Base your tax planning on the micro-enterprise regime rather than any sector-specific exemption; company registration details are on the "Registration Steps" page.'}</li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا کارمندان شرکت‌های IT هنوز از مالیات معاف هستند؟' : 'Are IT company employees still tax-exempt?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. این معافیت از ۱ ژانویه ۲۰۲۵ به‌طور کامل لغو شده و حقوق کارکنان بخش نرم‌افزار اکنون دقیقاً مانند سایر مشاغل مالیات می‌گیرد.' : 'No. This exemption was fully repealed on January 1, 2025, and software-sector salaries are now taxed exactly like any other role.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'پس چه چیزی برای صرفه‌جویی مالیاتی استارت‌آپ باقی مانده؟' : 'So what tax-saving option is left for a startup?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'رژیم میکرو-شرکت (نرخ ۱٪ روی گردش مالی تا سقف ۱۰۰,۰۰۰ یورو در سال) اصلی‌ترین ابزار قانونی صرفه‌جویی مالیاتی برای اکثر استارت‌آپ‌های نوپا باقی مانده است.' : 'The micro-enterprise regime (1% tax on revenue up to €100,000/year) remains the main legal tax-saving tool available to most early-stage startups.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="company/startup-tech-investment" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'annual-tax-reporting':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="company/annual-tax-reporting" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قوانین مالیاتی و گزارش‌دهی سالانه' : 'Annual Tax Compliance'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: سازمان امور مالیاتی رومانی (ANAF)، وزارت دارایی رومانی — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: National Agency for Fiscal Administration (ANAF), Romanian Ministry of Finance — Last reviewed: August 2026'}
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

          <ParentHubFooterCard slugRoute="company/annual-tax-reporting" currentLang={currentLang} onNavigate={onNavigate} />
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
              <Link href="/company/registration" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'ثبت شرکت' : 'Registration'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'مراحل ثبت شرکت با مسئولیت محدود (SRL)' : 'Steps to register an SRL company'}</p>
              </Link>
              <Link href="/company/tax-types" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'نرخ‌های مالیاتی' : 'Tax Rates'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'مالیات شرکت‌های خرد و سود سهام' : 'Micro-enterprise and dividend taxes'}</p>
              </Link>
              <Link href="/company/bank-account" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'حساب بانکی' : 'Bank Account'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'فرآیند افتتاح حساب بانکی شرکتی' : 'Corporate bank account opening process'}</p>
              </Link>
              <Link href="/company/residency" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'اقامت مدیرعامل' : 'CEO Residency'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'قوانین اقامت تجاری از طریق شرکت' : 'Commercial residency rules via company'}</p>
              </Link>
              <Link href="/company/real-estate-investment" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'سرمایه‌گذاری املاک' : 'Real Estate'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'خرید و سرمایه‌گذاری در بازار املاک' : 'Buying and investing in the property market'}</p>
              </Link>
              <Link href="/company/startup-tech-investment" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'استارت‌آپ و فناوری' : 'Startup & Tech'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'فرصت‌های بخش IT و دانش‌بنیان' : 'Opportunities in IT and tech sectors'}</p>
              </Link>
              <Link href="/company/annual-tax-reporting" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'گزارش‌دهی سالانه' : 'Annual Reporting'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'الزامات قانونی حسابداری در پایان سال' : 'Year-end legal accounting requirements'}</p>
              </Link>
            </div>
          </div>
        </div>
      );
  }
};

'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { Button } from './Button';
import { Landmark, House, FileCheck2, ShieldCheck, LockKeyhole, ExternalLink, ArrowRight, ArrowLeft } from './Icons';

interface NeedsContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const NeedsContent: React.FC<NeedsContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;
  const [housingTab, setHousingTab] = useState<'rent' | 'buy'>('rent');

  // SUB-ROUTE CONTENT ROUTING
  switch (subRoute) {

    // 1. CURRENCY EXCHANGE
    case 'currency-exchange':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'نیازهای ضروری در رومانی' : 'Essentials in Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'صرافی، تبدیل پول و پرداخت‌های روزمره در رومانی' : 'Currency Exchange & Money Conversion in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای کاربردی نرخ‌های مرجع بانک ملی رومانی (BNR)، تفکیک بانک‌ها و صرافی‌های مجاز، پرداخت‌های کارتی و انتقال قانونی پول.'
                : 'Practical guide to BNR reference exchange rates, licensed banks vs exchange offices, card payments & legal funds transfers.'}
            </p>
          </div>

          {/* Official BNR Reference Rates Grid */}
          <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
            <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#142033]">
                <Landmark size={20} className="text-[#2F6FED]" />
                <h3 className="font-extrabold text-base">{currentLang === 'fa' ? 'نرخ مرجع بانک ملی رومانی (BNR)' : 'National Bank of Romania (BNR) Reference Rates'}</h3>
              </div>
              <span className="text-[11px] text-[#788697] font-semibold">{currentLang === 'fa' ? 'آخرین بروزرسانی: ۲۰۲۶' : 'Updated: 2026'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 EUR</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">4.97 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 USD</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">4.58 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 GBP</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">5.82 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 AED</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">1.24 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 TRY</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">0.14 RON</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold">
              ⚠️ {currentLang === 'fa' ? 'تذکر مهم: نرخ مرجع بانک ملی رومانی الزاماً همان نرخ نهایی صرافی یا کارمزد کارت‌های بانکی نیست.' : 'Important Notice: BNR reference rates are benchmark indicators and may differ from commercial bank exchange spreads.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white space-y-3">
              <h4 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'مقایسه صرافی‌ها و بانک‌ها' : 'Banks vs Exchange Offices'}</h4>
              <p className="text-xs text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'بانک‌های معتبر رومانی (Banca Transilvania, BCR, BRD) امن‌ترین گزینه برای مبالغ بالا هستند. در صرافی‌های شهری همیشه تابلو بدون کارمزد (Comision 0%) و ارائه رسید رسمی با گذرنامه را چک کنید.'
                  : 'Commercial banks provide maximum security for high-value transfers. Always verify zero commission boards and demand official receipts.'}
              </p>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3">
              <h4 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'هشدار کلاهبرداری ارز' : 'Currency Fraud Prevention'}</h4>
              <p className="text-xs text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'هیچ‌گاه پول یا مدارک بانکی خود را در اختیار افراد یا صرافی‌های فاقد هویت و مجوز رسمی قرار ندهید. کلیه پرداخت‌های اجاره مسکن باید همراه با رسید بانکی ثبت شوند.'
                  : 'Never transfer funds through unlicensed informal dealers. All rental deposits must be accompanied by verifiable bank transfers.'}
              </p>
            </div>
          </div>
        </div>
      );

    // 2. DRIVING LICENSE
    case 'driving-license':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'گواهینامه رانندگی و شرایط تبدیل در رومانی' : 'Driving License & Exchange Rules in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'ضوابط رانندگی با گواهینامه بین‌المللی، مراحل ثبت‌نام در DGPCI، معایب و مزایا و الزامات معاینات پزشکی.'
                : 'Regulations for driving on international permits, DGPCI exchange procedures, medical checkups, and driving schools.'}
            </p>
          </div>

          <div className="editorial-card p-6 bg-white space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#2F6FED] font-bold">
              ℹ️ {currentLang === 'fa' ? 'وضعیت تبدیل گواهینامه ایرانی باید بر اساس آخرین فهرست و دستورالعمل رسمی DGPCI و وزارت امور داخلی رومانی بررسی شود.' : 'Iranian driving license exchange status must be verified against current DGPCI directives.'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-[#142033]">۱. رانندگی موقت</h4>
                <p className="text-xs text-[#526174] leading-relaxed">استفاده از گواهینامه بین‌المللی همراه با ترجمه رسمی تاییدشده تا زمان صدور کارت اقامت موقت مجاز است.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-[#142033]">۲. پرونده DGPCI</h4>
                <p className="text-xs text-[#526174] leading-relaxed">ارائه گواهینامه اصل، ترجمه رسمی به زبان رومانیایی، کارت اقامت و گواهی سلامت پزشکی از مراکز معتمد.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-[#142033]">۳. آزمون در صورت لزوم</h4>
                <p className="text-xs text-[#526174] leading-relaxed">در صورت عدم امکان تعویض مستقیم، شرکت در آکادمی رانندگی و آزمون‌های تئوری و عملی به زبان انگلیسی.</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 3. CERTIFIED TRANSLATION
    case 'certified-translation':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ترجمه رسمی و مترجمین مجاز در رومانی' : 'Certified Translation & Authorized Translators'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی مترجمین مجاز وزارت دادگستری رومانی (Traducator Autorizat)، تاییدیه دفاتر اسناد رسمی و قوانین آپوستیل.'
                : 'Ministry of Justice authorized translators, notarization steps, and legalization procedures.'}
            </p>
          </div>

          <div className="editorial-card p-6 bg-white space-y-4">
            <h3 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'تفاوت انواع ترجمه مدارک' : 'Types of Legal Document Translation'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Traducere Autorizata</span>
                <p className="text-[#526174]">ترجمه توسط مترجم دارای پروانه رسمی از وزارت دادگستری رومانی همراه با مهر و شماره مجوز.</p>
              </div>
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Traducere Legalizata</span>
                <p className="text-[#526174]">ترجمه مجاز که امضای مترجم توسط دفتر اسناد رسمی (Notar Public) در رومانی تایید شده است.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <a href="https://just.ro" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'جستجوی مترجم مجاز دادگستری' : 'Ministry of Justice Translator Search'}
                </Button>
              </a>
            </div>
          </div>
        </div>
      );

    // 4. NOTARY PUBLIC
    case 'notary-public':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'دفتر اسناد رسمی و خدمات نوتاری در رومانی' : 'Notary Public Services in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'تنظیم وکالت‌نامه، تایید امضا، گواهی مطابقت تصویر با اصل مدارک و ثبت قراردادهای ملکی و شرکتی.'
                : 'Powers of attorney, signature legalizations, certified document copies, and real estate notarial deeds.'}
            </p>
          </div>
        </div>
      );

    // 5. IRANIAN EMBASSY & MIKHAK
    case 'iranian-embassy-and-mikhak':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'خدمات کنسولی' : 'Consular Services'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سفارت ایران در بخارست و سامانه میخک' : 'Iranian Embassy in Bucharest & Mikhak System'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای ثبت درخواست‌های گذرنامه، وکالت‌نامه، تشکیل پرونده دانشجویی و تایید مدارک در سامانه رسمی میخک.'
                : 'Official consular guide for passport renewals, powers of attorney, and student files via Mikhak.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white space-y-4">
              <h3 className="font-extrabold text-[#142033] text-base">📍 {currentLang === 'fa' ? 'اطلاعات سفارت جمهوری اسلامی ایران در بخارست' : 'Embassy Contact Information'}</h3>
              <ul className="space-y-2 text-xs text-[#526174]">
                <li><strong>{currentLang === 'fa' ? 'آدرس:' : 'Address:'}</strong> Lascăr Catargiu 39, București</li>
                <li><strong>{currentLang === 'fa' ? 'تلفن:' : 'Phone:'}</strong> <span dir="ltr" className="inline-block">+40 21 312 0493</span></li>
                <li><strong>{currentLang === 'fa' ? 'سامانه میخک:' : 'Mikhak System:'}</strong> mikhak.mfa.gov.ir</li>
              </ul>
              <a href="https://mikhak.mfa.gov.ir" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm" className="w-full mt-2" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'ورود به سامانه رسمی میخک' : 'Access Mikhak Portal'}
                </Button>
              </a>
            </div>

            <div className="editorial-card p-6 bg-white space-y-4">
              <h3 className="font-extrabold text-[#142033] text-base">⚠️ {currentLang === 'fa' ? 'هشدار امنیتی سامانه میخک' : 'Mikhak Security Warning'}</h3>
              <p className="text-xs text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'سامانه میخک فقط از طریق دامنه رسمی وزارت امور خارجه ایران در دسترس است. اطلاعات ورود، کد رهگیری و مدارک هویتی خود را هرگز در اختیار افراد ناشناس قرار ندهید.'
                  : 'Access Mikhak strictly through official Ministry of Foreign Affairs domains. Protect account credentials.'}
              </p>
            </div>
          </div>
        </div>
      );

    // 6. HOUSING (RENT & BUY)
    case 'housing':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای اجاره و خرید مسکن در رومانی' : 'Renting & Buying Property in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'چک‌لیست قراردادهای اجاره، قوانین ودیعه، ثبت آدرس مسکونی برای کارت اقامت و ضوابط خرید ملک.'
                : 'Rental contracts, deposit protections, residence address registration, and property acquisition rules.'}
            </p>
          </div>

          <div className="flex border-b border-[#dfe6ef] space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setHousingTab('rent')}
              className={`pb-3 font-bold text-sm border-b-2 cursor-pointer ${housingTab === 'rent' ? 'border-[#2F6FED] text-[#2F6FED]' : 'border-transparent text-[#788697]'}`}
            >
              {currentLang === 'fa' ? 'اجاره مسکن' : 'Renting Property'}
            </button>
            <button
              onClick={() => setHousingTab('buy')}
              className={`pb-3 font-bold text-sm border-b-2 cursor-pointer ${housingTab === 'buy' ? 'border-[#2F6FED] text-[#2F6FED]' : 'border-transparent text-[#788697]'}`}
            >
              {currentLang === 'fa' ? 'خرید ملک' : 'Buying Property'}
            </button>
          </div>

          {housingTab === 'rent' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="editorial-card p-6 bg-white space-y-3">
                <h4 className="font-extrabold text-base text-[#142033]">چک‌لیست قرارداد اجاره (Contract de Inchiriere)</h4>
                <p className="text-xs text-[#526174] leading-relaxed">ثبت قرارداد در اداره مالیات (ANAF)، تصریح مبلغ اجاره به RON، تعیین تکلیف شارژ ساختمان (Intretinere) و حق ثبت آدرس برای اقامت.</p>
              </div>
              <div className="editorial-card p-6 bg-white space-y-3">
                <h4 className="font-extrabold text-base text-[#142033]">ودیعه و پیش‌پرداخت</h4>
                <p className="text-xs text-[#526174] leading-relaxed">معمولاً ۱ ماه اجاره به‌عنوان ودیعه (Garantie) دریافت می‌شود. حتماً صورت‌جلسه تحویل اثاثیه (Proces Verbal) را امضا کنید.</p>
              </div>
            </div>
          ) : (
            <div className="editorial-card p-6 bg-white space-y-3">
              <h4 className="font-extrabold text-base text-[#142033]">ضوابط خرید ملک برای اتباع غیر EU</h4>
              <p className="text-xs text-[#526174] leading-relaxed">اتباع غیر اروپایی امکان خرید اعیانی (آپارتمان) را دارند، اما خرید عرصه (زمین) تابع شرایط خاص یا ثبت شرکت است. استعلام ثبت اسناد (ANCPI eTerra) الزامی است.</p>
            </div>
          )}
        </div>
      );

    // 7. FIRST DAYS CHECKLIST
    case 'first-days-checklist':
    default:
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'راهنمای تازه واردین' : 'New Arrivals Guide'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود به رومانی' : 'First-Days Arrival Checklist'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'اقدامات حیاتی در ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود برای دانشجویان، کارکنان و خانواده‌ها.'
                : 'Essential checklist for your first 72 hours, 7 days, and 30 days in Romania.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white space-y-3">
              <span className="bg-blue-100 text-[#2F6FED] px-3 py-1 rounded-full text-xs font-bold">۷۲ ساعت اول</span>
              <ul className="space-y-2 text-xs text-[#526174] pt-2">
                <li>✓ تهیه سیم‌کارت رومانی (Orange, Vodafone)</li>
                <li>✓ تهیه کارت حمل و نقل شهری (STB)</li>
                <li>✓ تبدیل ارز اولیه به RON</li>
              </ul>
            </div>
            <div className="editorial-card p-6 bg-white space-y-3">
              <span className="bg-blue-100 text-[#2F6FED] px-3 py-1 rounded-full text-xs font-bold">۷ روز اول</span>
              <ul className="space-y-2 text-xs text-[#526174] pt-2">
                <li>✓ ثبت‌نام در دانشگاه / کارفرما</li>
                <li>✓ امضای قرارداد اجاره مسکن</li>
                <li>✓ افتتاح حساب بانکی اولیه</li>
              </ul>
            </div>
            <div className="editorial-card p-6 bg-white space-y-3">
              <span className="bg-blue-100 text-[#2F6FED] px-3 py-1 rounded-full text-xs font-bold">۳۰ روز اول</span>
              <ul className="space-y-2 text-xs text-[#526174] pt-2">
                <li>✓ نوبت‌دهی و مراجعه به IGI کارت اقامت</li>
                <li>✓ ثبت معاینات پزشکی اقامت</li>
                <li>✓ تشکیل پرونده در سامانه میخک</li>
              </ul>
            </div>
          </div>
        </div>
      );
  }
};

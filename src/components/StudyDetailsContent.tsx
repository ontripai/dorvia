'use client';

import React from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

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
          <Breadcrumb slugRoute="study/requirements" currentLang={currentLang} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مدارک و الزامات پذیرش' : 'Admission Requirements & Documents'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره کل مهاجرت رومانی (IGI) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'موفقیت در اخذ پذیرش در دانشگاه‌های رومانی نیازمند آماده‌سازی دقیق و رعایت استانداردهای تحصیلی و اداری است. دانشجویان بین‌المللی باید در گام نخست، نامه پذیرش رسمی (Letter of Acceptance) خود را از یک موسسه معتبر دریافت کنند که به تأیید وزارت آموزش رومانی رسیده باشد. علاوه بر ریزنمرات تحصیلی، اداره کل مهاجرت (IGI) اثبات تمکن مالی کافی، نداشتن سوءپیشینه کیفری و داشتن بیمه درمانی معتبر را الزامی می‌داند. جمع‌آوری صحیح این مدارک و ترجمه رسمی آن‌ها، پایه‌گذار یک مسیر تحصیلی موفق در رومانی خواهد بود.'
              : 'Securing admission to a Romanian university requires careful preparation and adherence to strict academic and administrative standards. International students must first obtain an official letter of acceptance from an accredited institution, endorsed by the Romanian Ministry of Education. Beyond academic transcripts, the General Inspectorate for Immigration (IGI) mandates proof of sufficient financial means, a clean police record, and valid health insurance. Gathering these documents correctly and translating them as required is the foundational step toward a successful academic journey in Romania.'}
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

          {/* IRAN-SPECIFIC: NO APOSTILLE — FULL CONSULAR LEGALIZATION REQUIRED */}
          <div className="bg-[#071B3D] text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold flex items-center space-x-2 rtl:space-x-reverse">
              <span>🇮🇷</span>
              <span>{currentLang === 'fa' ? 'نکته مخصوص متقاضیان ایرانی: ایران عضو کنوانسیون آپوستیل نیست' : 'Iran-Specific: No Apostille — Full Consular Legalization Is Required'}</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentLang === 'fa'
                ? 'این نکته‌ای است که اکثر راهنماهای عمومی «تحصیل در رومانی» اصلاً به آن اشاره نمی‌کنند چون برای شهروندان کشورهای عضو کنوانسیون لاهه ۱۹۶۱ صدق نمی‌کند. ایران عضو این کنوانسیون نیست (بر اساس جدول رسمی اعضای کنفرانس لاهه حقوق بین‌الملل خصوصی، HCCH)؛ بنابراین مدرک تحصیلی شما را نمی‌توان صرفاً «آپوستیل» کرد — باید مسیر کامل «تصدیق کنسولی» (Legalization) طی شود که طولانی‌تر و چندمرحله‌ای است:'
                : 'This is a fact most generic "study in Romania" guides skip entirely, because it doesn\'t apply to citizens of countries party to the 1961 Hague Convention. Iran is not a party to that Convention (per the official Hague Conference on Private International Law / HCCH status table); so your academic documents cannot simply be "apostilled" — they must go through the full, multi-step consular legalization chain instead:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 bg-[#0b2b55] rounded-xl space-y-1">
                <span className="font-extrabold text-blue-300">{currentLang === 'fa' ? '۱. تایید در ایران' : '1. Authentication in Iran'}</span>
                <p className="text-slate-300">{currentLang === 'fa' ? 'مدرک باید توسط مرجع صالح ایرانی (وزارت دادگستری / وزارت امور خارجه) تایید صحت امضا و مهر شود.' : 'The document must be authenticated by the competent Iranian authority (Ministry of Justice / Ministry of Foreign Affairs).'}</p>
              </div>
              <div className="p-4 bg-[#0b2b55] rounded-xl space-y-1">
                <span className="font-extrabold text-blue-300">{currentLang === 'fa' ? '۲. تایید سفارت رومانی در تهران' : '2. Romanian Embassy in Tehran'}</span>
                <p className="text-slate-300">{currentLang === 'fa' ? 'سفارت/بخش کنسولی رومانی در تهران مدرک را تصدیق (Legalize) می‌کند؛ سفارت رومانی در تهران فعال است.' : 'The Romanian Embassy/Consular Section in Tehran legalizes the document; the Romanian mission in Tehran is currently active.'}</p>
              </div>
              <div className="p-4 bg-[#0b2b55] rounded-xl space-y-1">
                <span className="font-extrabold text-blue-300">{currentLang === 'fa' ? '۳. تصدیق نهایی در رومانی (رایگان)' : '3. Final Legalization in Romania (Free)'}</span>
                <p className="text-slate-300">{currentLang === 'fa' ? 'پس از ورود مدرک به رومانی، مرحله «Supralegalizare» نزد وزارت امور خارجه رومانی در بخارست انجام می‌شود — این مرحله رایگان است و معمولاً همان روز تکمیل می‌شود.' : 'Once the document is in Romania, the "Supralegalizare" step happens at the Romanian MFA\'s Document Legalization Bureau in Bucharest — this step is free and typically completed same-day.'}</p>
              </div>
              <div className="p-4 bg-[#0b2b55] rounded-xl space-y-1">
                <span className="font-extrabold text-blue-300">{currentLang === 'fa' ? '۴. ترجمه رسمی + شناسایی مدرک (CNRED)' : '4. Sworn Translation + CNRED Recognition'}</span>
                <p className="text-slate-300">{currentLang === 'fa' ? 'ترجمه باید توسط مترجم رسمی مجاز وزارت دادگستری رومانی انجام شود (نه هر مترجمی)؛ برای مدارک دانشگاهی، مرکز ملی شناسایی و معادل‌سازی مدارک (CNRED) همین زنجیره را برای معادل‌سازی می‌پذیرد.' : 'Translation must be done by a translator specifically authorized by the Romanian Ministry of Justice (not any translator); for university-level degrees, the National Center for Recognition and Equivalence of Diplomas (CNRED) accepts this same chain for equivalence review.'}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentLang === 'fa'
                ? 'زمان کل این زنجیره معمولاً چند هفته طول می‌کشد و هزینه هر مرحله متفاوت است (مرحله رومانی رایگان است، مراحل ایران و سفارت هزینه دارند) — پیش از سفر یا اقدام، ساعات کاری و هزینه دقیق را مستقیماً از سفارت رومانی در تهران و CNRED استعلام بگیرید. منبع: HCCH، وزارت امور خارجه رومانی (mae.ro)، CNRED (cnred.edu.ro).'
                : 'The full chain typically takes several weeks, and cost varies per step (the Romania-side step is free; the Iran-side and embassy steps carry fees) — confirm exact hours and costs directly with the Romanian Embassy in Tehran and CNRED before traveling or applying. Source: HCCH, Romanian Ministry of Foreign Affairs (mae.ro), CNRED (cnred.edu.ro).'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا داشتن مدرک آیلتس یا تافل الزامی است؟' : 'Is IELTS/TOEFL strictly required?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بستگی به دانشگاه دارد؛ برخی دانشگاه‌ها گواهی تسلط به زبان انگلیسی از مقطع قبلی را می‌پذیرند یا خودشان مصاحبه تعیین سطح برگزار می‌کنند.' : 'It depends on the university and program; some accept a certificate of English proficiency from your previous school or conduct their own online interview.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا باید تمام مدارک دبیرستان را ترجمه کنم؟' : 'Do I need to translate all my high school transcripts?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، تمامی مدارک تحصیلی پایه باید به‌صورت رسمی ترجمه شوند. برای متقاضیان ایرانی، چون ایران عضو کنوانسیون آپوستیل نیست، به‌جای آپوستیل ساده باید زنجیره کامل تصدیق کنسولی طی شود (جزئیات در باکس بالا).' : 'Yes, all academic transcripts must be officially translated. For Iranian applicants specifically, since Iran is not an Apostille Convention member, a simple apostille is not possible — the full consular legalization chain must be followed instead (see the box above).'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا سفارت رومانی در تهران فعال است؟' : 'Is the Romanian Embassy in Tehran operating?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، بر اساس اطلاعات رسمی وزارت امور خارجه رومانی، سفارت رومانی در تهران فعال است؛ با این حال پیش از مراجعه حضوری، ساعات کاری و ظرفیت پذیرش را مستقیماً از سفارت استعلام بگیرید.' : 'Yes, per official Romanian Ministry of Foreign Affairs information, the Romanian Embassy in Tehran is active; however, confirm current opening hours and appointment capacity directly with the embassy before visiting in person.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="study/requirements" currentLang={currentLang} />
        </div>
      );

    case 'visa-type-d':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="study/visa-type-d" currentLang={currentLang} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ویزای تحصیلی تایپ D' : 'Type D/SD Student Visa'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره کل مهاجرت رومانی (IGI)، وزارت امور خارجه رومانی (MAE) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI), Ministry of Foreign Affairs (MAE) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'ویزای بلندمدت تحصیلی (تایپ D) مجوز ورود رسمی شما برای آغاز زندگی آکادمیک در رومانی است. این ویزا که توسط سفارتخانه‌ها و کنسولگری‌های رومانی در خارج از کشور صادر می‌شود، مختص دانشجویانی است که نامه پذیرش رسمی خود را دریافت کرده‌اند. درک این نکته بسیار مهم است که ویزای D به‌خودی‌خود تنها ۱۸۰ روز اعتبار دارد و صرفاً نقش یک «پل» را ایفا می‌کند تا شما وارد خاک رومانی شوید؛ پس از ورود، وظیفه دارید پیش از اتمام مهلت ۹۰ روزه اقامت مجاز، برای کارت اقامت موقت دانشجویی نزد IGI اقدام کنید.'
              : 'The Type D long-stay student visa is your official entry pass to begin your academic life in Romania. Issued by the Romanian diplomatic missions abroad, this visa is specifically for international students who have already received their official acceptance letter. It is critical to understand that the Type D visa itself is only valid for 180 days and acts as a bridge; its primary purpose is to allow you entry into the country so you can subsequently apply for a temporary student residence permit at IGI before your allowed 90 days of stay expire.'}
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
                <li>{currentLang === 'fa' ? 'زمان معمول رسیدگی به درخواست ویزای تحصیلی تا ۶0 روز از تاریخ ثبت مدارک در کنسولگری است.' : 'The typical processing time for a student visa application is up to 60 days from the date of submission at the consulate.'}</li>
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

          {/* FINANCIAL PROOF REQUIREMENT */}
          <div className="bg-[#f0f4f9] p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] space-y-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>💰</span>
              <span>{currentLang === 'fa' ? 'اثبات تمکن مالی — چقدر لازم است؟' : 'Proof of Financial Means — How Much Do You Need?'}</span>
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اصلاحیه مهم: این الزام دو مرحله متفاوت دارد که با ارقام متفاوتی سنجیده می‌شوند — با هم اشتباه گرفته نشوند. (۱) برای دریافت ویزای D در سفارت/کنسولگری، طبق راهنمای رسمی IGI باید تمکن مالی معادل «حداقل حقوق خالص کشوری» برای کل دوره اعتبار ویزا اثبات شود؛ حداقل حقوق خالص تقریبی فعلی (۲۰۲۶) حدود ۲,۶۹۹ لئو در ماه است (رقمی محاسبه‌شده بر پایه حداقل حقوق ناخالص، نه رقمی که خودِ IGI مستقیماً اعلام کند — پیش از اقدام حتماً نرخ روز را چک کنید). (۲) برای تمدید اقامت داخل رومانی نزد IGI، طبق مادهٔ ۵۸ آیین‌نامه اتباع خارجی (OUG 194/2002) و اطلاعیهٔ رسمی IGI (۹ دسامبر ۲۰۲۴)، الزام به «حداقل حقوق ناخالص کشوری» (نه خالص) تغییر کرده و باید این مبلغ حداقل ۶ ماه در حساب نگه‌داری/دریافت شده باشد؛ حداقل حقوق ناخالص از ژوئیهٔ ۲۰۲۶ برابر ۴,۳۲۵ لئو در ماه است.'
                : 'Important correction: this requirement actually has two distinct stages measured by different figures — don\'t confuse them. (1) To obtain the D visa at the embassy/consulate, IGI\'s official guidance requires proof of funds equal to the net national minimum wage for the whole visa validity period; the current approximate net minimum wage (2026) is around 2,699 RON/month (a figure calculated from the gross minimum wage, not one IGI itself publishes directly — always check the current exchange rate before applying). (2) To extend your residence permit inside Romania at IGI, per Article 58 of the foreigners\' status ordinance (OUG 194/2002) and IGI\'s official notice of December 9, 2024, the requirement switched to the gross national minimum wage (not net), held for at least 6 months; the gross minimum wage has been 4,325 RON/month since July 2026.'}
            </p>
            <p className="text-[11px] text-slate-400">
              {currentLang === 'fa' ? 'منبع: igi.mai.gov.ro (راهنمای ویزای تحصیلی + اطلاعیهٔ تمدید اقامت تحصیلی، دسامبر ۲۰۲۴؛ ماده ۵۸ OUG 194/2002).' : 'Source: igi.mai.gov.ro (student visa guide + student residence extension notice, Dec 2024; Article 58, OUG 194/2002).'}
            </p>
          </div>

          {/* IRAN-SPECIFIC CROSS-LINK */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-[#142033] flex items-start space-x-3 rtl:space-x-reverse">
            <span className="text-base mt-0.5">🇮🇷</span>
            <span>
              {currentLang === 'fa'
                ? 'متقاضیان ایرانی: مدارک تحصیلی شما نیاز به زنجیره کامل تصدیق کنسولی دارد، نه آپوستیل ساده — جزئیات کامل را در صفحه '
                : 'Iranian applicants: your academic documents require the full consular legalization chain, not a simple apostille — see full details on the '}
              <a href="/study/requirements" className="text-[#2F6FED] font-bold hover:underline">
                {currentLang === 'fa' ? 'مدارک و الزامات پذیرش' : 'Admission Requirements'}
              </a>
              {currentLang === 'fa' ? ' ببینید.' : ' page.'}
            </span>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم ویزای توریستی خود را در رومانی به ویزای دانشجویی تبدیل کنم؟' : 'Can I change my tourist visa to a student visa inside Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، قوانین مهاجرتی رومانی اجازه تبدیل ویزای توریستی (نوع C) به تحصیلی در داخل کشور را نمی‌دهد. شما باید ویزای نوع D را از کشور مبدأ خود دریافت کنید.' : 'No, Romanian immigration laws do not allow converting a short-stay tourist visa (Type C) into a student visa from within the country. You must apply for a Type D student visa from your home country or country of legal residence.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'صدور ویزا در سفارت چقدر طول می‌کشد؟' : 'How long does the embassy take to issue the visa?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'به‌طور معمول بررسی پرونده پس از مصاحبه و تحویل کامل مدارک در سفارت می‌تواند تا ۶۰ روز زمان ببرد.' : 'Processing can typically take up to 60 days from the date of your interview and full document submission at the consulate.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'برای اثبات تمکن مالی چه مبلغی نیاز دارم؟' : 'How much money do I need for financial proof?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای خودِ ویزای D در سفارت: معادل حداقل حقوق خالص کشوری (حدود ۲,۶۹۹ لئو در ماه، ۲۰۲۶). برای تمدید اقامت داخل رومانی: معادل حداقل حقوق ناخالص کشوری (۴,۳۲۵ لئو در ماه از ژوئیه ۲۰۲۶)، حداقل ۶ ماه نگه‌داری‌شده — این دو رقم متفاوت‌اند، با هم اشتباه نگیرید.' : 'For the D visa itself at the embassy: the net national minimum wage (around 2,699 RON/month, 2026). For extending residence inside Romania: the gross national minimum wage (4,325 RON/month as of July 2026), held for at least 6 months — these are two different figures, don\'t confuse them.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="study/visa-type-d" currentLang={currentLang} />
        </div>
      );

    case 'tuition-overview':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="study/tuition-overview" currentLang={currentLang} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'شهریه‌های تحصیلی (نمای کلی)' : 'Tuition Rates & Overview'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: وب‌سایت‌های رسمی دانشگاه‌های رومانی — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶ (ارقام تقریبی؛ برای مبلغ دقیق به سایت هر دانشگاه مراجعه شود)'
                : 'Source: Official Romanian university websites — Last reviewed: August 2026 (Approximate figures; check specific university websites for exact amounts)'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'رومانی به‌دلیل ارائه آموزش باکیفیت و مقرون‌به‌صرفه، یکی از مقاصد تحصیلی محبوب در اتحادیه اروپا محسوب می‌شود. شهریه دانشگاه‌های دولتی برای دانشجویان بین‌المللی عموماً بین ۲,۰۰۰ تا ۱۰,۰۰۰ یورو در سال متغیر است که رشته‌های پزشکی، دندانپزشکی و برخی شاخه‌های مهندسی در بالاترین سطح این بازه قرار می‌گیرند. علاوه بر شهریه، دانشجویان باید هزینه‌های معقول زندگی، خوابگاه و بیمه درمانی را نیز در نظر بگیرند که در مقایسه با کشورهای اروپای غربی، رومانی را به انتخابی بسیار اقتصادی و جذاب برای دانشجویان آزاد (بدون بورسیه) تبدیل کرده است.'
              : 'Romania is widely recognized as one of the most affordable and cost-effective study destinations within the European Union, offering high-quality education without the exorbitant price tags of Western Europe. Tuition fees at public universities typically range from €2,000 to €10,000 per year, with medical and technical specialties generally falling at the higher end of the spectrum. Prospective students should also budget for reasonable living costs, accommodation, and mandatory health insurance, making it a highly attractive option for self-funded international scholars.'}
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
                  <span className="text-[#2F6FED] font-medium">
                    {currentLang === 'fa' ? 'بورسیه تحصیلی دولتی رومانی' : 'Romanian Government Scholarships'}
                  </span>
                  {currentLang === 'fa' ? ' می‌تواند شهریه را به‌طور کامل پوشش دهد.' : ' can cover tuition fees completely.'}
                </li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا علاوه بر شهریه، هزینه‌های پنهان دیگری وجود دارد؟' : 'Are there any hidden fees besides tuition?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'هزینه‌های پنهان خیر، اما شما باید مبالغی را برای هزینه بررسی پرونده (Application Fee)، تمدید سالانه کارت اقامت، بیمه درمانی و کتب درسی در نظر بگیرید.' : 'There are no hidden fees, but you should budget for university application fees, annual residence permit taxes, health insurance, and course materials.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم شهریه را به‌صورت قسطی پرداخت کنم؟' : 'Can I pay my tuition in installments?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'معمولاً دانشگاه‌ها پرداخت کامل شهریه سال اول را برای صدور نامه تأییدیه جهت سفارت الزامی می‌دانند، اما در سال‌های بعد ممکن است امکان تقسیط وجود داشته باشد.' : 'Most universities require the first year\'s tuition to be paid in full upfront for the visa application process, but subsequent years might be payable in installments depending on the university.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="study/tuition-overview" currentLang={currentLang} />
        </div>
      );

    case 'part-time-work':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="study/part-time-work" currentLang={currentLang} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مجوز کار پاره‌وقت دانشجویی' : 'Student Part-time Work Permit'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: قانون OG 25/2014 (ماده ۳ بند ۳)، اصلاح‌شده با قانون ۲۸/۲۰۲۴ — اداره کل مهاجرت رومانی (IGI) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: OG 25/2014 (Art. 3(3)), as amended by Law 28/2024 — General Inspectorate for Immigration (IGI) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'کسب تجربه کاری در حین تحصیل، مزیت بزرگی برای دانشجویان بین‌المللی در رومانی است. طبق قانون، دانشجویان خارج از اتحادیه اروپا که کارت اقامت موقت تحصیلی دارند، حق کار پاره‌وقت را بدون نیاز به طی کردن پروسه پیچیده اخذ مجوز کار (Aviz de Muncă) دارا هستند. طبق اصلاحیه قانون ۲۸/۲۰۲۴ (اجرایی از ۸ مارس ۲۰۲۴)، این حق به دانشجویان اجازه می‌دهد تا حداکثر ۶ ساعت در روز مشغول به کار شوند که راهی عالی برای پوشش بخشی از هزینه‌های زندگی و آشنایی با بازار کار محلی است. البته بسیار مهم است که روی کارت اقامت شما عبارت «حق کار» (Drept de Muncă) قید شده باشد.'
              : 'Gaining practical work experience while studying is a major advantage for international students in Romania. By law, non-EU students holding a valid temporary residence permit for studies are permitted to work part-time without needing to go through the complex process of obtaining a separate work permit (Aviz de Muncă). Per the amendment introduced by Law 28/2024 (effective March 8, 2024), this right allows students to work up to 6 hours per day, helping them offset living expenses while integrating into the local professional environment. However, it is crucial to ensure that the "Right to Work" (Drept de Muncă) is explicitly stated on your residence card.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'حق کار دانشجویان بین‌المللی' : 'Work Rights for International Students'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'دانشجویان دارای اقامت موقت تحصیلی می‌توانند بدون نیاز به مجوز کار جداگانه (Aviz de Muncă)، صرفاً با قرارداد کار پاره‌وقت فعالیت کنند.' : 'Students holding a temporary study residence permit can work without needing a separate work permit (Aviz de Muncă), simply based on a part-time employment contract.'}</li>
                <li>{currentLang === 'fa' ? 'حداکثر ساعت مجاز کار ۶ ساعت در روز است (طبق ماده ۳ بند ۳ قانون OG 25/2014، اصلاح‌شده با قانون ۲۸/۲۰۲۴؛ این محدودیت مجموع همه مشاغل همزمان است، نه هرکدام به‌طور جداگانه).' : 'The maximum allowed working time is 6 hours per day (per Article 3(3) of OG 25/2014, as amended by Law 28/2024; this cap applies cumulatively across all jobs, not to each one separately).'}</li>
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا در تعطیلات تابستانی می‌توانم تمام‌وقت کار کنم؟' : 'Can I work full-time during summer holidays?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برخلاف برخی کشورهای دیگر اتحادیه اروپا، قوانین رومانی در حال حاضر سقف ۶ ساعت در روز را حتی در ایام تعطیلات تابستانی برای دانشجویان غیراروپایی حفظ می‌کند.' : 'Unlike some other EU countries, Romanian law currently maintains the 6-hour daily limit for non-EU students even during the summer academic holidays.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا کار فریلنسری یا دورکاری هم جزو این ۶ ساعت حساب می‌شود؟' : 'Does freelance or remote work count towards the 6 hours?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، هرگونه اشتغال قانونی و ثبت‌شده در رومانی مشمول این محدودیت روزانه ۶ ساعته برای دانشجویان است.' : 'Yes, any legal employment registered in Romania is subject to the 6-hour daily limit for students.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="study/part-time-work" currentLang={currentLang} />
        </div>
      );

    default:
      return null;
  }
};

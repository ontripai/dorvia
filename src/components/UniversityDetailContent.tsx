'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { universitiesData } from '@/lib/universities';
import { EvaluationCTA } from './EvaluationCTA';
import { Breadcrumb } from './Breadcrumb';
import { FaqSchema } from './FaqSchema';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Home, ExternalLink } from './Icons';

interface UniversityDetailContentProps {
  slug: string;
  currentLang: Language;
  onOpenEvaluationModal?: () => void;
}

export const UniversityDetailContent: React.FC<UniversityDetailContentProps> = ({
  slug,
  currentLang,
  onOpenEvaluationModal
}) => {
  const [photoFailed, setPhotoFailed] = useState(false);
  const uni = universitiesData.find(u => u.id === slug);

  if (!uni) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
          🏛️
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'دانشگاه مورد نظر یافت نشد' : 'University Not Found'}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {currentLang === 'fa'
            ? 'متأسفانه صفحه‌ای برای این شناسه دانشگاه وجود ندارد یا به آدرس دیگری منتقل شده است.'
            : 'Sorry, the requested university profile could not be found or has been moved.'}
        </p>
        <div>
          <Link
            href="/universities"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-[#2F6FED] text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors"
          >
            <span>{currentLang === 'fa' ? 'بازگشت به فهرست دانشگاه‌ها' : 'Back to Universities Directory'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isWarning = uni.warningLevel !== 'none';
  const badgeColors = isWarning
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const headerColors = isWarning
    ? 'bg-gradient-to-r from-amber-900 to-amber-700'
    : 'bg-gradient-to-r from-[#071B3D] to-[#2F6FED]';

  const formatAmount = (amount?: number, maxAmount?: number, currency?: string, period?: string, feeType?: string) => {
    if (feeType === 'contact' || !amount) {
      return currentLang === 'fa' ? 'تماس با دانشگاه' : 'Contact University';
    }

    const currLabel = currency === 'EUR' ? (currentLang === 'fa' ? 'یورو' : 'EUR') : (currentLang === 'fa' ? 'رون' : 'RON');
    
    let periodLabel = '';
    if (period === 'academic-year') periodLabel = currentLang === 'fa' ? '/ سال تحصیلی' : '/ year';
    if (period === 'calendar-year') periodLabel = currentLang === 'fa' ? '/ سال تقویمی' : '/ calendar year';

    if (currentLang === 'fa') {
      const amtStr = amount.toLocaleString('fa-IR');
      const maxAmtStr = maxAmount ? ' - ' + maxAmount.toLocaleString('fa-IR') : '';
      return `${amtStr}${maxAmtStr} ${currLabel} ${periodLabel}`;
    } else {
      const amtStr = amount.toLocaleString('en-US');
      const maxAmtStr = maxAmount ? '–' + maxAmount.toLocaleString('en-US') : '';
      return `${currLabel} ${amtStr}${maxAmtStr}${periodLabel}`;
    }
  };

  const name = currentLang === 'fa' ? uni.nameFa : uni.nameEn;
  const city = currentLang === 'fa' ? uni.cityFa : uni.cityEn;
  const institutionType = currentLang === 'fa' ? uni.institutionType.fa : uni.institutionType.en;
  const description = currentLang === 'fa' ? uni.descriptionFa : uni.descriptionEn;
  const disclaimerText = currentLang === 'fa' ? uni.disclaimer?.fa : uni.disclaimer?.en;
  const homeTitle = currentLang === 'fa' ? 'خانه' : 'Home';
  const parentTitle = currentLang === 'fa' ? 'دانشگاه‌ها' : 'Universities';
  const Separator = currentLang === 'fa' ? ChevronLeft : ChevronRight;
  const BackArrow = currentLang === 'fa' ? ArrowRight : ArrowLeft;
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const uniFaqs = [
    {
      q: currentLang === 'fa' ? `شهریه دانشگاه ${name} چقدر است؟` : `What is the tuition fee at ${name}?`,
      a: currentLang === 'fa'
        ? (uni.tuitionItems && uni.tuitionItems.length > 0 
            ? `شهریه مقاطع مختلف بین ${uni.tuitionItems.map(t => `${t.program.fa}: ${(t.amount || 0).toLocaleString('fa-IR')} ${t.currency}`).join('، ')} است.`
            : `شهریه بر اساس رشته تحصیلی و مقطع متغیر است و مستقیماً توسط دانشگاه تعیین می‌شود.`)
        : (uni.tuitionItems && uni.tuitionItems.length > 0
            ? `Tuition ranges across programs: ${uni.tuitionItems.map(t => `${t.program.en}: €${(t.amount || 0).toLocaleString()}`).join(', ')}.`
            : `Tuition varies depending on program and degree level.`)
    },
    {
      q: currentLang === 'fa' ? `آیا مدرک دانشگاه ${name} در ایران به رسمیت شناخته می‌شود؟` : `Is ${name}'s degree recognised in Iran?`,
      a: currentLang === 'fa'
        ? (uni.recognitionStatus === 'IRAN_MOH_APPROVED'
            ? 'بر اساس داده‌ی ما، این دانشگاه در فهرست مورد تایید وزارت بهداشت، درمان و آموزش پزشکی ایران قرار دارد — مرجعی که رشته‌های پزشکی، دندانپزشکی، داروسازی و حوزه‌های سلامت را ارزیابی می‌کند.\n\nاما یک نکته که ممکن است سرنوشت مدرک شما را عوض کند: تایید وزارت بهداشت به رشته‌های پزشکی مربوط است، نه لزوماً به همه‌ی رشته‌هایی که این دانشگاه ارائه می‌دهد. اگر رشته‌ی شما بالینی نیست (مثلاً مهندسی پزشکی، فیزیک پزشکی، یا مدیریت خدمات بهداشتی)، ممکن است مرجع ارزیابی مدرک شما وزارت علوم باشد نه وزارت بهداشت. ما نتوانستیم تایید کنیم ایران دقیقاً کجا این مرز را می‌کشد — پس پیش از ثبت‌نام، وضعیت رشته‌ی مشخص خودتان را جداگانه استعلام بگیرید، نه فقط نام دانشگاه را.'
            : 'برای رشته‌های غیرپزشکی، مرجع ارزیابی مدرک خارجی در ایران وزارت علوم، تحقیقات و فناوری است — اما بر اساس بررسی ما، خودِ ارزیابی و فهرست دانشگاه‌های مورد تایید را «سازمان امور دانشجویان» انجام می‌دهد و منتشر می‌کند، نه مستقیماً خود وزارتخانه. این نکته‌ی کاربردی است، چون بسیاری سراغ سایت وزارت علوم می‌روند در حالی که فرآیند نزد سازمان امور دانشجویان است.\n\nما نتوانستیم وضعیت این دانشگاه مشخص را در آن فهرست تایید کنیم. این به معنای «تایید نشده» نیست — به این معناست که ما نتوانستیم فهرست رسمی را مستقیماً ببینیم و ترجیح می‌دهیم به جای حدس زدن، همین را صادقانه بگوییم. تنها چیزی که واقعاً می‌توانید به آن تکیه کنید این است: پیش از ثبت‌نام، برای دانشگاه و رشته‌ی مشخص خودتان از سازمان امور دانشجویان استعلام کتبی بگیرید. هر فهرستی — از جمله هر چیزی که ما یا هر سایت دیگری منتشر می‌کند — با گذر زمان کهنه می‌شود؛ پاسخ کتبی به نام خودتان کهنه نمی‌شود.')
        : (uni.recognitionStatus === 'IRAN_MOH_APPROVED'
            ? 'Based on our data, this university appears on the list approved by Iran\'s Ministry of Health and Medical Education — the authority that evaluates medicine, dentistry, pharmacy and health-related fields.\n\nBut one point that could change the outcome for your own degree: Ministry of Health approval concerns medical fields, not necessarily every programme the university offers. If your programme is not clinical (biomedical engineering, medical physics, or health services management, for example), the authority evaluating your degree may be the Ministry of Science rather than the Ministry of Health. We could not confirm exactly where Iran draws that line — so before enrolling, check the position for your specific programme, not just the university\'s name.'
            : 'For non-medical fields, the authority that evaluates foreign degrees in Iran is the Ministry of Science, Research and Technology — but based on our review, the evaluation itself, and the list of approved universities, is handled and published by the Organization for Students Affairs (SAORG), not by the ministry directly. This matters practically, because many people go to the ministry\'s website when the process actually sits with SAORG.\n\nWe could not confirm this specific university\'s status on that list. That does not mean it is unapproved — it means we could not access the official list directly, and we would rather tell you that than guess. The only thing you can really rely on is this: before enrolling, obtain a written determination from SAORG for your specific university and programme. Any list — including anything we or any other site publishes — goes out of date; a written answer in your own name does not.')
    },
    {
      q: currentLang === 'fa' ? `آیا امکان تحصیل به زبان انگلیسی در ${name} وجود دارد؟` : `Are English-taught programs available at ${name}?`,
      a: currentLang === 'fa'
        ? `بله، در این دانشگاه برنامه‌های آموزشی به زبان انگلیسی یا رومانیایی (به همراه دوره سال مقدماتی زبان) ارائه می‌شود. با این حال زبان تدریس دقیق بسته به رشته و مقطع تحصیلی متفاوت است و باید مستقیماً از بخش پذیرش دانشگاه استعلام شود.`
        : `Yes, English-taught and Romanian-taught degree programs are available with preparatory language year options. However, exact teaching languages vary by degree and department and should be confirmed directly with university admissions.`
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <FaqSchema items={uniFaqs} />
      <Breadcrumb
        customTitle={name}
        customParentPath="/universities"
        customParentTitle={parentTitle}
        currentLang={currentLang}
      />

      {/* CAMPUS PHOTO BANNER (if available) */}
      {uni.photoUrl && !photoFailed && (
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <Image
            src={uni.photoUrl}
            alt={(currentLang === 'fa' ? uni.photoCaptionFa : uni.photoCaptionEn) || name}
            width={1200}
            height={480}
            quality={85}
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="w-full h-64 sm:h-96 object-cover"
            onError={() => setPhotoFailed(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
            <p className="text-white text-xs sm:text-sm font-medium">
              {currentLang === 'fa' ? uni.photoCaptionFa : uni.photoCaptionEn}
            </p>
          </div>
        </div>
      )}

      {/* HERO HEADER PANEL */}
      <div className={`${headerColors} rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${badgeColors}`}>
            {currentLang === 'fa' ? uni.badgeTextFa : uni.badgeTextEn}
          </span>
          {uni.foundedYear && (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-white/15 text-white border border-white/20">
              {currentLang === 'fa' ? `سال تأسیس: ${uni.foundedYear.toLocaleString('fa-IR')}` : `Founded: ${uni.foundedYear}`}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          {name}
        </h1>

        <div className="text-sm sm:text-base text-white/80 italic font-medium">
          {uni.officialRomanianName}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 pt-2 border-t border-white/20">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span>📍</span>
            <span className="font-semibold">{city}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span>🏛️</span>
            <span className="font-semibold">{institutionType}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span>🎓</span>
            <span>{currentLang === 'fa' ? 'سال تحصیلی:' : 'Academic Year:'} {uni.tuitionAcademicYear}</span>
          </div>
        </div>

        {/* Action button in hero */}
        {uni.officialWebsite && (
          <div className="pt-2">
            <a
              href={uni.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 bg-white text-[#071B3D] hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:-translate-y-0.5"
            >
              <span>{currentLang === 'fa' ? 'وبسایت رسمی دانشگاه' : 'Official University Website'}</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {/* MAIN OVERVIEW & DISCLAIMER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#142033]">
          {currentLang === 'fa' ? 'معرفی و نمای کلی' : 'Overview & About'}
        </h2>
        <p className="text-[#526174] text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        {disclaimerText && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-amber-900 leading-relaxed space-y-1">
            <div className="font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
              <span>⚠️</span>
              <span>{currentLang === 'fa' ? 'نکته و هشدار مهم' : 'Important Notice'}</span>
            </div>
            <p>{disclaimerText}</p>
          </div>
        )}
      </div>

      {/* FACILITIES & KEY HIGHLIGHTS */}
      {uni.facilities && uni.facilities.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
              {currentLang === 'fa' ? 'امکانات، پیشینه و ویژگی‌های برجسته' : 'Facilities, Heritage & Key Features'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526174] mt-1">
              {currentLang === 'fa'
                ? 'نکات برجسته درباره پیشینه علمی، ظرفیت‌های بالینی و پژوهشی و استانداردهای آموزشی'
                : 'Key facts regarding academic heritage, clinical and research facilities, and quality standards'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uni.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 flex items-start space-x-3 rtl:space-x-reverse"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2F6FED]/10 text-[#2F6FED] flex items-center justify-center text-xs font-bold mt-0.5">
                  ✓
                </span>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {currentLang === 'fa' ? fac.fa : fac.en}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DEGREE LEVELS & PROGRAMS */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
            {currentLang === 'fa' ? 'مقاطع و رشته‌های تحصیلی' : 'Degree Levels & Academic Programs'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            {currentLang === 'fa'
              ? 'اطلاعات دوره‌های کارشناسی، کارشناسی ارشد و دکتری ارائه شده در این دانشگاه'
              : 'Undergraduate, Master’s, and Doctoral programs offered at this institution'}
          </p>
        </div>

        {uni.degreeLevels && uni.degreeLevels.length > 0 && (
          <div className="space-y-4">
            {uni.degreeLevels.map((dl, idx) => (
              <div
                key={idx}
                className="border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#f8fafc] to-white space-y-2"
              >
                <div className="inline-block px-3 py-1 bg-[#071B3D] text-white rounded-lg text-xs font-bold">
                  {currentLang === 'fa' ? dl.levelFa : dl.levelEn}
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {currentLang === 'fa' ? dl.fieldsFa : dl.fieldsEn}
                </p>
              </div>
            ))}
          </div>
        )}

        {uni.programs && uni.programs.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentLang === 'fa' ? 'زمینه‌های تحصیلی کلیدی:' : 'Key Academic Fields:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {uni.programs.map((program, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#eef3f8] text-[#142033] rounded-xl text-xs font-medium border border-[#dfe6ef]"
                >
                  {currentLang === 'fa' ? program.name.fa : program.name.en}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* RANKINGS & STANDINGS */}
      {uni.rankingFacts && uni.rankingFacts.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
              {currentLang === 'fa' ? 'رتبه‌بندی و جایگاه علمی (با ذکر منبع)' : 'Rankings & Global Standing (Sourced)'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526174] mt-1">
              {currentLang === 'fa'
                ? 'جایگاه‌های مستند در رتبه‌بندی‌های معتبر بین‌المللی همراه با لینک منبع رسمی'
                : 'Documented positions in recognized global ranking systems with direct source links'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uni.rankingFacts.map((rf, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#2F6FED] uppercase tracking-wider">
                    {currentLang === 'fa' ? rf.labelFa : rf.labelEn}
                  </span>
                  <p className="text-sm font-extrabold text-[#142033] leading-snug">
                    {currentLang === 'fa' ? rf.valueFa : rf.valueEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <a
                    href={rf.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-slate-500 hover:text-[#2F6FED] transition-colors"
                  >
                    <span>
                      {currentLang === 'fa' ? `منبع: ${rf.sourceLabelFa}` : `Source: ${rf.sourceLabelEn}`}
                    </span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TUITION & FEES SECTION */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
            {currentLang === 'fa' ? 'شهریه و هزینه‌های تحصیلی' : 'Tuition & Fees'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            {currentLang === 'fa'
              ? `بر اساس سند رسمی منتشرشده برای سال تحصیلی ${uni.tuitionAcademicYear}`
              : `Based on official publications for the ${uni.tuitionAcademicYear} academic year`}
          </p>
        </div>

        <div className="space-y-3">
          {uni.tuitionItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] gap-2"
            >
              <span className="font-semibold text-sm text-[#142033]">
                {currentLang === 'fa' ? item.program.fa : item.program.en}
              </span>
              <span className="font-extrabold text-base text-[#2F6FED]" dir="ltr">
                {formatAmount(item.amount, item.maxAmount, item.currency, item.period, item.feeType)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{currentLang === 'fa' ? 'وضعیت استناد شهریه:' : 'Tuition Verification Status:'}</span>
          <span className="font-bold text-[#142033]">
            {uni.tuitionVerificationStatus === 'OFFICIAL_FIXED' && (currentLang === 'fa' ? '✓ سند رسمی دانشگاه با رقم قطعی' : '✓ Official Fixed Fee Document')}
            {uni.tuitionVerificationStatus === 'CONTACT_UNIVERSITY' && (currentLang === 'fa' ? 'نیاز به استعلام مستقیم از دانشگاه' : 'Direct Inquiry Required')}
            {uni.tuitionVerificationStatus === 'OFFICIAL_RANGE' && (currentLang === 'fa' ? '✓ محدوده رسمی شهریه بر حسب رشته' : '✓ Official Range by Program')}
          </span>
        </div>

        {/* RECOGNITION SOURCES */}
        {uni.recognitionSources && uni.recognitionSources.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentLang === 'fa' ? 'اسناد و منابع معتبر:' : 'Authoritative Sources & Documents:'}
            </div>
            <div className="space-y-2">
              {uni.recognitionSources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-medium">
                    {currentLang === 'fa' ? src.name.fa : src.name.en} ({currentLang === 'fa' ? src.issuer.fa : src.issuer.en})
                  </span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2F6FED] hover:underline font-bold"
                    >
                      {currentLang === 'fa' ? 'مشاهده سند ↗' : 'View Document ↗'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* COST OF LIVING CONTEXTUAL CALLOUT */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center sm:text-start">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-[#2F6FED] uppercase tracking-wider">
            <span>💰</span>
            <span>{currentLang === 'fa' ? `برآورد هزینه‌های زندگی در ${city}` : `Living Expenses in ${city}`}</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#142033]">
            {currentLang === 'fa'
              ? `هزینه ماهانه زندگی دانشجویی و اجاره مسکن در ${city} چقدر است؟`
              : `What does it cost to live and study in ${city}?`}
          </h3>
          <p className="text-xs sm:text-sm text-[#526174] max-w-xl">
            {currentLang === 'fa'
              ? `برای برآورد دقیق هزینه‌های مسکن، خوابگاه دانشجویی، خوراک، حمل‌ونقل و قبوض در ${city}، از محاسبه‌گر هوشمند هزینه زندگی استفاده کنید.`
              : `Estimate monthly expenses for housing, student dorms, groceries, public transit, and utilities in ${city} using our interactive calculator.`}
          </p>
        </div>
        <Link
          href="/needs/cost-of-living"
          className="flex-shrink-0 inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-[#2F6FED] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <span>{currentLang === 'fa' ? `محاسبه هزینه زندگی در ${city}` : `Calculate Living Cost`}</span>
          <ArrowIcon size={14} />
        </Link>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div id="faq" className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-3">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-6">
          {uniFaqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-[#334155]">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OFFICIAL ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#071B3D] rounded-3xl text-white shadow-lg">
        <div>
          <h3 className="text-lg font-bold">
            {currentLang === 'fa' ? 'اطلاعات بیشتر و ثبت‌نام' : 'More Information & Admissions'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            {currentLang === 'fa'
              ? 'برای مشاهده الزامات دقیق و تقویم آموزشی به سایت رسمی دانشگاه مراجعه کنید.'
              : 'Visit the official university portal for exact requirements and academic calendar.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {uni.officialWebsite && (
            <a
              href={uni.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial text-center px-6 py-3 bg-white text-[#071B3D] hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:-translate-y-0.5"
            >
              {currentLang === 'fa' ? 'سایت رسمی دانشگاه ↗' : 'Official Website ↗'}
            </a>
          )}
          <Link
            href="/universities"
            className="flex-1 sm:flex-initial text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-colors"
          >
            {currentLang === 'fa' ? 'همه دانشگاه‌ها' : 'All Universities'}
          </Link>
        </div>
      </div>

      {/* BOTTOM EVALUATION CTA */}
      <EvaluationCTA
        variant="study"
        currentLang={currentLang}
        onOpenModal={onOpenEvaluationModal || (() => {})}
      />
    </div>
  );
};

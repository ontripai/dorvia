import React, { useState } from 'react';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { University, Language, StudyAreaId, TeachingLanguage } from '../types';

interface UniversityCardProps {
  university: University;
  currentLang: Language;
  activeStudyAreaId?: StudyAreaId;
  activeLanguage?: TeachingLanguage;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, currentLang, activeStudyAreaId, activeLanguage }) => {
  // Real photos are self-hosted under /public/images/universities (see scripts/fetch-wikimedia-photos.js).
  // If a photo file is ever missing, this hides the photo block gracefully instead of showing a broken-image icon.
  const [photoFailed, setPhotoFailed] = useState(false);
  const isWarning = university.warningLevel !== 'none';
  const badgeColors = isWarning
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const headerColors = isWarning
    ? 'bg-gradient-to-r from-amber-800 to-amber-700'
    : 'bg-gradient-to-r from-[#071B3D] to-[#2F6FED]';

  const hoverClasses = isWarning
    ? 'hover:bg-amber-700 hover:border-amber-700'
    : 'hover:bg-[#071B3D] hover:border-[#071B3D]';

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

  const disclaimerText = currentLang === 'fa' ? university.disclaimer?.fa : university.disclaimer?.en;

  // Derive display programs and languages based on active filters
  let displayedPrograms = university.programs;
  if (activeStudyAreaId && activeLanguage) {
    displayedPrograms = university.programs.filter(p => p.studyAreaId === activeStudyAreaId && p.languages.includes(activeLanguage));
  } else if (activeStudyAreaId) {
    displayedPrograms = university.programs.filter(p => p.studyAreaId === activeStudyAreaId);
  } else if (activeLanguage) {
    displayedPrograms = university.programs.filter(p => p.languages.includes(activeLanguage));
  }

  // Fallback if none match (should not happen since we filter universities first, but just in case)
  if (!displayedPrograms || displayedPrograms.length === 0) {
    displayedPrograms = university.programs;
  }

  // Get unique languages for the displayed programs
  const uniqueLanguages = Array.from(new Set(displayedPrograms.flatMap(p => p.languages)));

  return (
    <div className={`bg-white rounded-2xl border ${isWarning ? 'border-amber-300' : 'border-slate-200'} shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group`}>

      {/* Real Campus Photo (self-hosted; only when a verified Wikimedia Commons photo is available) */}
      {university.photoUrl && !photoFailed && (
        <div className="relative">
          <Image
            src={university.photoUrl}
            alt={(currentLang === 'fa' ? university.photoCaptionFa : university.photoCaptionEn) || university.nameEn || 'University Campus'}
            width={400}
            height={144}
            quality={80}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="w-full h-36 object-cover"
            onError={() => setPhotoFailed(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-1.5">
            <p className="text-white text-[10px] leading-tight">
              {currentLang === 'fa' ? university.photoCaptionFa : university.photoCaptionEn}
            </p>
          </div>
        </div>
      )}

      {/* Visual Header Banner */}
      <div className={`${headerColors} p-5 text-white relative`}>
        <div className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border mb-3 ${badgeColors}`}>
          {currentLang === 'fa' ? university.badgeTextFa : university.badgeTextEn}
        </div>
        <h3 className="text-lg font-bold leading-snug">
          {currentLang === 'fa' ? university.nameFa : university.nameEn}
        </h3>
        <div className="text-[10px] text-white/80 mt-1 italic">
          {university.officialRomanianName}
        </div>
        <div className="text-xs text-white/90 mt-2 flex items-center space-x-2 rtl:space-x-reverse">
          <span>📍 {currentLang === 'fa' ? university.cityFa : university.cityEn}</span>
          <span>•</span>
          <span>🏛️ {currentLang === 'fa' ? university.institutionType.fa : university.institutionType.en}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 flex-1">
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {currentLang === 'fa' ? university.descriptionFa : university.descriptionEn}
        </p>

        {disclaimerText && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 leading-relaxed italic">
            {disclaimerText}
          </div>
        )}

        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {currentLang === 'fa' ? 'زمینه‌های تحصیلی مرتبط:' : 'Relevant Study Areas:'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {displayedPrograms.map((program, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200">
                {currentLang === 'fa' ? program.name.fa : program.name.en}
              </span>
            ))}
          </div>
        </div>

        {(uniqueLanguages.filter(l => l !== 'UNKNOWN').length > 0 || uniqueLanguages.includes('UNKNOWN')) && (
          <div className="space-y-1.5 pt-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {currentLang === 'fa' ? 'زبان‌های تدریس:' : 'Teaching Languages:'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {uniqueLanguages.filter(l => l !== 'UNKNOWN').map((lang, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold border border-blue-200">
                  {lang}
                </span>
              ))}
              {uniqueLanguages.includes('UNKNOWN') && (
                <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[11px] font-medium border border-slate-200 italic">
                  {currentLang === 'fa' ? 'زبان تدریس نیازمند بررسی است' : 'Teaching language needs verification'}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {currentLang === 'fa' ? 'شهریه و هزینه‌ها:' : 'Tuition & Fees:'}
          </div>
          {university.tuitionItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-md border border-slate-100">
              <span className="text-slate-600 font-medium">
                {currentLang === 'fa' ? item.program.fa : item.program.en}
              </span>
              <span className="font-bold text-[#142033]" dir="ltr">
                {formatAmount(item.amount, item.maxAmount, item.currency, item.period, item.feeType)}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-[10px] text-slate-500 pt-1">
            <span>{currentLang === 'fa' ? 'سال تحصیلی:' : 'Academic Year:'} {university.tuitionAcademicYear}</span>
            <span>
              {university.tuitionVerificationStatus === 'OFFICIAL_FIXED' && (currentLang === 'fa' ? '✓ سند رسمی' : '✓ Official Document')}
              {university.tuitionVerificationStatus === 'CONTACT_UNIVERSITY' && (currentLang === 'fa' ? 'نیاز به استعلام' : 'Check with Uni')}
              {university.tuitionVerificationStatus === 'OFFICIAL_RANGE' && (currentLang === 'fa' ? '✓ محدوده رسمی' : '✓ Official Range')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 mt-auto">
        {university.ctaType === 'internal' ? (
          <Link href={university.ctaHref} aria-label={`${currentLang === 'fa' ? university.ctaLabelFa : university.ctaLabelEn} - ${currentLang === 'fa' ? university.nameFa : university.nameEn}`} className={`block w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold border transition-colors ${isWarning ? 'bg-amber-800 border-amber-800 text-white hover:bg-amber-700 hover:border-amber-700' : 'bg-white border-[#071B3D] text-[#071B3D] ' + hoverClasses + ' hover:text-white'}`}>
            {currentLang === 'fa' ? university.ctaLabelFa : university.ctaLabelEn}
          </Link>
        ) : (
          <a href={university.ctaHref} target="_blank" rel="noopener noreferrer" aria-label={`${currentLang === 'fa' ? university.ctaLabelFa : university.ctaLabelEn} - ${currentLang === 'fa' ? university.nameFa : university.nameEn}`} className={`block w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold border transition-colors ${isWarning ? 'bg-amber-800 border-amber-800 text-white hover:bg-amber-700 hover:border-amber-700' : 'bg-white border-[#071B3D] text-[#071B3D] ' + hoverClasses + ' hover:text-white'}`}>
            {currentLang === 'fa' ? university.ctaLabelFa : university.ctaLabelEn} ↗
          </a>
        )}
      </div>
    </div>
  );
};

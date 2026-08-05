import React from 'react';
import Link from 'next/link';
import { University, Language } from '../types';

interface UniversityCardProps {
  university: University;
  currentLang: Language;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, currentLang }) => {
  const isWarning = university.warningLevel !== 'none';
  const badgeColors = isWarning
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const headerColors = isWarning
    ? 'bg-gradient-to-r from-amber-700 to-amber-600'
    : 'bg-gradient-to-r from-[#071B3D] to-[#2F6FED]';

  const hoverClasses = isWarning
    ? 'hover:bg-amber-600 hover:border-amber-600'
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

  return (
    <div className={`bg-white rounded-2xl border ${isWarning ? 'border-amber-300' : 'border-slate-200'} shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group`}>

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
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {currentLang === 'fa' ? 'رشته‌های تحصیلی:' : 'Study Fields:'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(currentLang === 'fa' ? university.studyFieldsFa : university.studyFieldsEn).map((field, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200">
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {currentLang === 'fa' ? 'شهریه و هزینه‌ها:' : 'Tuition & Fees:'}
          </div>
          {university.tuitionItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-md border border-slate-100">
              <span className="text-slate-600 font-medium">
                {currentLang === 'fa' ? item.program.fa : item.program.en}
              </span>
              <span className="font-bold text-[#071B3D]">
                {formatAmount(item.amount, item.maxAmount, item.currency, item.period, item.feeType)}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500">
              {currentLang === 'fa' ? 'سال تحصیلی:' : 'Academic Year:'}
            </span>
            <span className="text-[10px] font-bold text-slate-700">
              {university.tuitionAcademicYear}
            </span>
          </div>
        </div>

        {((university.recognitionSources && university.recognitionSources.length > 0) || university.sourceRecords.length > 0) && (
          <div className="pt-2">
            <div className="text-[10px] font-semibold text-slate-400 mb-1">
              {currentLang === 'fa' ? 'منابع تایید شده:' : 'Verified Sources:'}
            </div>
            <ul className="space-y-1">
              {university.recognitionSources?.map((source, idx) => (
                <li key={`rec-${idx}`} className="text-[10px]">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#2F6FED] hover:underline flex items-center space-x-1 rtl:space-x-reverse">
                    <span>🔗</span>
                    <span>{currentLang === 'fa' ? source.name.fa : source.name.en}</span>
                    {source.officialFlag && (
                      <span className="ml-1 text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                        {currentLang === 'fa' ? 'رسمی' : 'Official'}
                      </span>
                    )}
                  </a>
                </li>
              ))}
              {university.sourceRecords.map((source, idx) => (
                <li key={`src-${idx}`} className="text-[10px]">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#2F6FED] hover:underline flex items-center space-x-1 rtl:space-x-reverse">
                    <span>🔗</span>
                    <span>{currentLang === 'fa' ? source.name.fa : source.name.en}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-[9px] text-slate-400 mt-2">
              {currentLang === 'fa' ? 'تاریخ بررسی: ' : 'Reviewed: '}
              {university.reviewedAt}
            </div>
          </div>
        )}
      </div>

      {/* Card Action */}
      <div className="px-5 pb-5 pt-0">
        {university.ctaType === 'internal' ? (
          <Link
            href={university.ctaHref}
            className={`w-full py-3 bg-slate-50 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 block text-center ${hoverClasses}`}
          >
            {currentLang === 'fa' ? university.ctaLabelFa : university.ctaLabelEn}
          </Link>
        ) : (
          <a
            href={university.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 bg-slate-50 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center justify-center space-x-1 rtl:space-x-reverse ${hoverClasses}`}
          >
            <span>{currentLang === 'fa' ? university.ctaLabelFa : university.ctaLabelEn}</span>
            <span className="text-[10px]">↗</span>
          </a>
        )}
      </div>

    </div>
  );
};

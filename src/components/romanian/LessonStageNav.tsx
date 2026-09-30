'use client';

export function LessonStageNav({ lang, labels, stage, onSelect, minutes }: {
  lang: 'fa' | 'en'; labels: readonly string[]; stage: number; onSelect: (stage: number) => void; minutes?: readonly number[];
}) {
  return <nav aria-label={lang === 'fa' ? 'مراحل درس' : 'Lesson stages'} className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-5">
    {labels.map((label, index) => <button key={index} type="button" onClick={() => onSelect(index)} aria-current={stage === index ? 'step' : undefined} className={`min-h-11 rounded-xl px-3 py-2 text-start text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd] ${stage === index ? 'bg-[#1554bd] text-white' : 'bg-slate-50 text-slate-700 hover:bg-blue-50'}`}>
      <span className="block">{lang === 'fa' ? '۰۱۲۳۴۵۶۷۸۹'[index + 1] : index + 1}. {label}</span>
      {minutes?.[index] !== undefined && <span className="mt-1 block text-xs opacity-80">{lang === 'fa' ? `${minutes[index]} دقیقه` : `${minutes[index]} min`}</span>}
    </button>)}
  </nav>;
}

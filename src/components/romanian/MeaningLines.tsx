/** English stays with Romanian examples; the learner's language is an additional gloss. */
export function MeaningLines({ en, fa, lang, className = '' }: {
  en: string; fa?: string; lang: 'fa' | 'en'; className?: string;
}) {
  return <div className={className}>
    <p lang="en" dir="ltr" className="text-sm text-slate-700">{en}</p>
    {lang === 'fa' && fa && <p lang="fa" dir="rtl" className="mt-1 text-sm text-slate-600">{fa}</p>}
  </div>;
}

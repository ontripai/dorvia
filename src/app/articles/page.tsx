'use client';

import { useAppContext } from '../../components/AppLayout';
import { getTranslations } from '../../lib/i18n';
import { sampleArticles } from '../../lib/data';
import { EvaluationCTA } from '../../components/EvaluationCTA';

export default function ArticlesPage() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang);

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.articles}</h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === 'fa' ? 'مقالات و راهنماهای آموزشی و مهاجرتی' : 'Articles & Legal Updates'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleArticles.map((art) => (
          <div key={art.id} className="editorial-card p-6 space-y-3 bg-white">
            <span className="text-xs text-[#2F6FED] bg-blue-50 px-2.5 py-1 rounded font-semibold">{art.category[currentLang]}</span>
            <h3 className="font-bold text-[#142033] text-base">{art.title[currentLang]}</h3>
            <p className="text-xs text-[#526174] leading-relaxed">{art.excerpt[currentLang]}</p>
          </div>
        ))}
      </div>
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}

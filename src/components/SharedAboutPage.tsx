'use client';

import { useAppContext } from '@/components/AppLayout';
import { TrustSection } from '@/components/TrustSection';
import { getTranslations } from '@/lib/i18n';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export function SharedAboutPage() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang);

  return (
    <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'درباره پلتفرم «دوریا اروپا»' : 'About DORVIA EUROP'}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {t.brand.description}
        </p>
      </div>

      <TrustSection currentLang={currentLang} />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}

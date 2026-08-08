'use client';

import { useAppContext } from '@/components/AppLayout';
import { getTranslations } from '@/lib/i18n';
import { mainServices } from '@/lib/data';
import { ServiceCard } from '@/components/ServiceCard';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function ServicesPage() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();
  const t = getTranslations(currentLang);

  return (
    <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.services}</h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === 'fa' ? 'خدمات تخصصی مهاجرتی و مشاوره‌ای' : 'Professional Case Advisory Services'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainServices.map((svc) => (
          <ServiceCard key={svc.id} service={svc} currentLang={currentLang} onSelect={onOpenEvaluationModal} />
        ))}
      </div>
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}

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
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{t.nav.services}</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          {currentLang === 'fa'
            ? 'مرور کلی حوزه‌هایی که در آن‌ها راهنمایی، معرفی و همراهی ارائه می‌کنیم. جزئیات هر پرونده به شرایط فردی شما بستگی دارد و در جلسه ارزیابی رایگان بررسی می‌شود.'
            : 'An overview of the areas where we provide guidance, referrals, and hands-on support. The specifics of each case depend on your individual circumstances and are reviewed during a free assessment.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainServices.map((svc) => (
          <ServiceCard key={svc.id} service={svc} currentLang={currentLang} onSelect={onOpenEvaluationModal} expanded />
        ))}
      </div>

      <p className="text-[11px] sm:text-xs text-slate-400 italic text-center max-w-2xl mx-auto leading-relaxed">
        {currentLang === 'fa'
          ? 'این صفحه یک نمای کلی از حوزه‌های مشاوره‌ای است، نه فهرست تعهدآور خدمات؛ دامنه‌ی دقیق کار هر پرونده بر اساس مقررات جاری و شرایط فردی در جلسه ارزیابی مشخص می‌شود.'
          : 'This page is a general overview of our advisory areas, not a binding service list; the exact scope of work for each case is defined based on current regulations and individual circumstances during the assessment.'}
      </p>

      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}

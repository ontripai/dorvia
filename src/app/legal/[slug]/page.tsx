'use client';

import { useAppContext } from '../../../components/AppLayout';
import { getTranslations } from '../../../lib/i18n';

export default function LegalPage({ params }: { params: { slug: string } }) {
  const { currentLang } = useAppContext();
  const t = getTranslations(currentLang);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-[#dfe6ef] editorial-card mt-8">
      <h1 className="text-2xl font-bold text-[#142033] border-b border-[#dfe6ef] pb-4">
        {params.slug === 'privacy' 
          ? (currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy')
          : (currentLang === 'fa' ? 'شرایط و قوانین استفاده' : 'Terms & Disclaimer')}
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-[#526174] leading-relaxed">
        <p>{t.disclaimer.text}</p>
      </div>
    </div>
  );
}

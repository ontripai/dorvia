'use client';

import { useAppContext } from '../../components/AppLayout';
import { LeadForm } from '../../components/LeadForm';
import { getTranslations } from '../../lib/i18n';

export default function ContactPage() {
  const { currentLang } = useAppContext();
  const t = getTranslations(currentLang);

  return (
    <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.contact}</h1>
        <p className="text-[#526174] text-xs sm:text-sm mt-1">
          {currentLang === 'fa' ? 'ارتباط با کارشناسان ما' : 'Contact Our Team'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="editorial-card p-6 space-y-2 bg-white">
            <div className="font-bold text-[#142033]">🏢 {currentLang === 'fa' ? 'دفتر رومانی:' : 'Bucharest Office:'}</div>
            <p className="text-xs text-[#526174]">Bucharest, Romania</p>
          </div>
          <div className="bg-[#2F6FED] text-white p-6 rounded-2xl space-y-2 shadow-md">
            <div className="font-bold text-[#F4F7FC]">📧 {currentLang === 'fa' ? 'ایمیل:' : 'Email:'}</div>
            <p className="text-xs text-slate-100"><span dir="ltr" className="inline-block">ontrip.ai@gmail.com</span></p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <LeadForm currentLang={currentLang} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAppContext } from '@/components/AppLayout';
import { PathFinderAssessment } from '@/components/PathFinderAssessment';
import { getTranslations } from '@/lib/i18n';

export function SharedAssessmentPage() {
  const { currentLang } = useAppContext();
  const t = getTranslations(currentLang);
  const seo = (t as any)?.seoMetadata?.assessment;

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className={`text-center space-y-3 max-w-2xl mx-auto ${currentLang === 'fa' ? 'rtl' : 'ltr'}`}>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#142033]">
          {seo?.h1 || (currentLang === 'fa' ? 'مسیر مناسب شما برای رومانی چیست؟' : 'What is the right path to Romania for you?')}
        </h1>
        <p className="text-[#526174] text-xs sm:text-sm">
          {currentLang === 'fa'
            ? 'با پاسخ به چند سؤال کوتاه، DORVIA PathFinder مسیر (تحصیل، کار، کسب‌وکار، خانواده یا اقامت) متناسب با پروفایل شما را نشان می‌دهد.'
            : 'Answer a few short questions and DORVIA PathFinder will show you which pathway — study, work, business, family, or relocation — fits your profile.'}
        </p>
      </div>

      <PathFinderAssessment currentLang={currentLang} isModal={false} />
    </div>
  );
}

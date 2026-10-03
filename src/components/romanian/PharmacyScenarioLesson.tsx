'use client';

import { EverydayScenarioLesson } from './EverydayScenarioLesson';
import type { PharmacyScenario } from '@/content/romanian/pharmacy-scenarios';

export function PharmacyScenarioLesson({ lang, lesson }: { lang: 'fa' | 'en'; lesson: PharmacyScenario }) {
  return <EverydayScenarioLesson lang={lang} lesson={lesson} topic={{ fa: 'داروخانه', en: 'Pharmacy' }} counterpart={{ fa: 'داروساز', en: 'Pharmacist' }} topicHref="/learn-romanian/lectie/tema/pharmacy" footer={{ fa: 'تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد. این درس جایگزین توصیهٔ داروساز نیست.', en: 'The writing exercise does not score pronunciation. Ask the pharmacist about your actual situation.' }} />;
}

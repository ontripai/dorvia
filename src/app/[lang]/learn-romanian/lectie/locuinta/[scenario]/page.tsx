import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { housingScenarios, getHousingScenario } from '@/content/romanian/housing-scenarios';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => housingScenarios.map(scenario => ({ lang, scenario: scenario.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; scenario: string } }): Metadata {
  const lesson = getHousingScenario(params.scenario);
  return { title: `${lesson?.title[params.lang === 'fa' ? 'fa' : 'en'] ?? 'Housing and renting'} | Romanian lesson | Dorvia`, description: lesson?.goal[params.lang === 'fa' ? 'fa' : 'en'], robots: { index: false, follow: false } };
}
export default function ScenarioPage({ params }: { params: { lang: string; scenario: string } }) {
  const lesson = getHousingScenario(params.scenario);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'مسکن و اجاره' : 'Housing and renting', href: '/learn-romanian/lectie/tema/housing' }, { label: lesson.title[lang] }]} currentLang={lang} disableJsonLd /><EverydayScenarioLesson lang={lang} lesson={lesson} topic={{ fa: 'مسکن و اجاره', en: 'Housing and renting' }} counterpart={{ fa: 'مالک یا نماینده', en: 'Owner or representative' }} topicHref="/learn-romanian/lectie/tema/housing" footer={{ fa: 'هزینه‌ها و شرایط واقعی را برای همان خانه به صورت مکتوب بپرسید. تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد.', en: 'Ask for the actual costs and conditions of the property in writing. The writing exercise does not score pronunciation.' }} /></main>;
}

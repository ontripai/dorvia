import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { directionsScenarios, getDirectionsScenario } from '@/content/romanian/directions-scenarios';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => directionsScenarios.map(scenario => ({ lang, scenario: scenario.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; scenario: string } }): Metadata {
  const lesson = getDirectionsScenario(params.scenario);
  return { title: `${lesson?.title[params.lang === 'fa' ? 'fa' : 'en'] ?? 'Directions'} | Romanian lesson | Dorvia`, description: lesson?.goal[params.lang === 'fa' ? 'fa' : 'en'], robots: { index: false, follow: false } };
}
export default function ScenarioPage({ params }: { params: { lang: string; scenario: string } }) {
  const lesson = getDirectionsScenario(params.scenario);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'راه‌یابی در شهر' : 'Finding your way', href: '/learn-romanian/lectie/tema/directions' }, { label: lesson.title[lang] }]} currentLang={lang} disableJsonLd /><EverydayScenarioLesson lang={lang} lesson={lesson} topic={{ fa: 'راه‌یابی در شهر', en: 'Finding your way' }} counterpart={{ fa: 'رهگذر', en: 'Passerby' }} topicHref="/learn-romanian/lectie/tema/directions" footer={{ fa: 'تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد؛ جمله‌ها را با صدای بلند تکرار کنید.', en: 'The writing exercise does not score pronunciation; repeat the lines aloud.' }} /></main>;
}


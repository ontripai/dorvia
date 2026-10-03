import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { cafeScenarios, getCafeScenario } from '@/content/romanian/cafe-scenarios';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => cafeScenarios.map(scenario => ({ lang, scenario: scenario.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; scenario: string } }): Metadata {
  const lesson = getCafeScenario(params.scenario);
  return { title: `${lesson?.title[params.lang === 'fa' ? 'fa' : 'en'] ?? 'Café'} | Romanian lesson | Dorvia`, description: lesson?.goal[params.lang === 'fa' ? 'fa' : 'en'], robots: { index: false, follow: false } };
}
export default function ScenarioPage({ params }: { params: { lang: string; scenario: string } }) {
  const lesson = getCafeScenario(params.scenario);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'کافه و غذا' : 'Cafés and food', href: '/learn-romanian/lectie/tema/cafe' }, { label: lesson.title[lang] }]} currentLang={lang} disableJsonLd /><EverydayScenarioLesson lang={lang} lesson={lesson} topic={{ fa: 'کافه و غذا', en: 'Cafés and food' }} counterpart={{ fa: 'پیشخدمت', en: 'Server' }} topicHref="/learn-romanian/lectie/tema/cafe" footer={{ fa: 'تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد؛ جمله‌ها را با صدای بلند تکرار کنید.', en: 'The writing exercise does not score pronunciation; repeat the lines aloud.' }} /></main>;
}

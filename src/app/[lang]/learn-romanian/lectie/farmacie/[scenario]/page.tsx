import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PharmacyScenarioLesson } from '@/components/romanian/PharmacyScenarioLesson';
import { getPharmacyScenario, pharmacyScenarios } from '@/content/romanian/pharmacy-scenarios';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => pharmacyScenarios.map(scenario => ({ lang, scenario: scenario.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; scenario: string } }): Metadata {
  const lesson = getPharmacyScenario(params.scenario);
  return { title: `${lesson?.title[params.lang === 'fa' ? 'fa' : 'en'] ?? 'Pharmacy'} | Romanian lesson | Dorvia`, description: lesson?.goal[params.lang === 'fa' ? 'fa' : 'en'], robots: { index: false, follow: false } };
}
export default function ScenarioPage({ params }: { params: { lang: string; scenario: string } }) {
  const lesson = getPharmacyScenario(params.scenario);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'داروخانه' : 'Pharmacy', href: '/learn-romanian/lectie/farmacie' }, { label: lesson.title[lang] }]} currentLang={lang} disableJsonLd /><PharmacyScenarioLesson lang={lang} lesson={lesson} /></main>;
}

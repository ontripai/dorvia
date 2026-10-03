import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { transportScenarios, getTransportScenario } from '@/content/romanian/transport-scenarios';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => transportScenarios.map(scenario => ({ lang, scenario: scenario.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; scenario: string } }): Metadata {
  const lesson = getTransportScenario(params.scenario);
  return { title: `${lesson?.title[params.lang === 'fa' ? 'fa' : 'en'] ?? 'Transport'} | Romanian lesson | Dorvia`, description: lesson?.goal[params.lang === 'fa' ? 'fa' : 'en'], robots: { index: false, follow: false } };
}
export default function ScenarioPage({ params }: { params: { lang: string; scenario: string } }) {
  const lesson = getTransportScenario(params.scenario);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'رفت‌وآمد و بلیت' : 'Transport and tickets', href: '/learn-romanian/lectie/tema/transport' }, { label: lesson.title[lang] }]} currentLang={lang} disableJsonLd /><EverydayScenarioLesson lang={lang} lesson={lesson} topic={{ fa: 'رفت‌وآمد و بلیت', en: 'Transport and tickets' }} counterpart={{ fa: 'مسافر', en: 'Passenger' }} topicHref="/learn-romanian/lectie/tema/transport" footer={{ fa: 'مسیر و اعتبار بلیت را در همان شبکهٔ حمل‌ونقل بررسی کنید. تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد.', en: 'Check the route and ticket validity with the transport network. The writing exercise does not score pronunciation.' }} /></main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { appointmentScenarios, getAppointmentScenario } from '@/content/romanian/appointment-scenarios';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => appointmentScenarios.map(scenario => ({ lang, scenario: scenario.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; scenario: string } }): Metadata {
  const lesson = getAppointmentScenario(params.scenario);
  return { title: `${lesson?.title[params.lang === 'fa' ? 'fa' : 'en'] ?? 'Appointments'} | Romanian lesson | Dorvia`, description: lesson?.goal[params.lang === 'fa' ? 'fa' : 'en'], robots: { index: false, follow: false } };
}
export default function ScenarioPage({ params }: { params: { lang: string; scenario: string } }) {
  const lesson = getAppointmentScenario(params.scenario);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'قرار ملاقات و پذیرش' : 'Appointments and reception', href: '/learn-romanian/lectie/tema/appointments' }, { label: lesson.title[lang] }]} currentLang={lang} disableJsonLd /><EverydayScenarioLesson lang={lang} lesson={lesson} topic={{ fa: 'قرار ملاقات و پذیرش', en: 'Appointments and reception' }} counterpart={{ fa: 'پذیرش', en: 'Receptionist' }} topicHref="/learn-romanian/lectie/tema/appointments" footer={{ fa: 'نمونهٔ آموزشی است؛ زمان و مدارک واقعی را با همان مرکز تأیید کنید. تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد.', en: 'This is a learning example. Confirm real times and document requirements with the centre. Writing practice does not score pronunciation.' }} /></main>;
}


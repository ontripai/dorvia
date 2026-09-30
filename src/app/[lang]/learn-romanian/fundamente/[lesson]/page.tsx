import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CoreSentenceBuildingLesson } from '@/components/romanian/CoreSentenceBuildingLesson';
import { LOCALES } from '@/lib/locale-router';

const lessonBySlug = {
  'fi-avea': { kind: 'verbs-present' as const, titleFa: 'دو فعل پایه: بودن و داشتن', titleEn: 'Two essential verbs: to be and to have', summaryFa: 'صرف زمان حالِ a fi و a avea را با فاعل هماهنگ کنید.', summaryEn: 'Match the present forms of a fi and a avea to their subjects.' },
  sifat: { kind: 'adjectives' as const, titleFa: 'صفت و هماهنگی آن با اسم', titleEn: 'Adjectives and noun agreement', summaryFa: 'جای صفت و هماهنگی جنس و شمار را در عبارت تمرین کنید.', summaryEn: 'Practise adjective position and gender and number agreement.' },
};

type LessonSlug = keyof typeof lessonBySlug;

export function generateStaticParams() {
  return LOCALES.flatMap(lang => Object.keys(lessonBySlug).map(lesson => ({ lang, lesson })));
}

export function generateMetadata({ params }: { params: { lang: string; lesson: string } }): Metadata {
  const lesson = lessonBySlug[params.lesson as LessonSlug];
  if (!lesson) return { title: 'Not Found', robots: { index: false, follow: false } };
  const isFa = params.lang === 'fa';
  return {
    title: `${isFa ? lesson.titleFa : lesson.titleEn} | DORVIA`,
    description: isFa ? lesson.summaryFa : lesson.summaryEn,
    robots: { index: false, follow: false },
  };
}

export default function CoreFoundationLessonPage({ params }: { params: { lang: string; lesson: string } }) {
  if (!LOCALES.includes(params.lang as (typeof LOCALES)[number])) notFound();
  const lesson = lessonBySlug[params.lesson as LessonSlug];
  if (!lesson) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
    <Breadcrumb items={[
      { label: lang === 'fa' ? 'خانه' : 'Home', href: '/' },
      { label: lang === 'fa' ? 'درس‌های پایه' : 'Foundation lessons', href: '/learn-romanian/fundamente' },
      { label: lang === 'fa' ? lesson.titleFa : lesson.titleEn },
    ]} currentLang={lang} disableJsonLd />
    <CoreSentenceBuildingLesson lang={lang} kind={lesson.kind} />
  </main>;
}

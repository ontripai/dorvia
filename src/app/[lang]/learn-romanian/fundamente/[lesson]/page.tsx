import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CoreSentenceBuildingLesson } from '@/components/romanian/CoreSentenceBuildingLesson';
import { SubjectPronounsFoundationLesson } from '@/components/romanian/SubjectPronounsFoundationLesson';
import { AdditionalFoundationLesson } from '@/components/romanian/AdditionalFoundationLessons';
import { additionalFoundationLessons, type AdditionalFoundationSlug } from '@/content/romanian/additional-foundation-lessons';
import { LOCALES } from '@/lib/locale-router';

const lessonBySlug = {
  damayr: { kind: 'subject-pronouns' as const, titleFa: 'ضمیرهای فاعلی رومانیایی', titleEn: 'Romanian subject pronouns', summaryFa: 'ضمیرهای مفرد و جمع، سوم‌شخص و خطاب محترمانه را با مثال و تمرین یاد بگیرید.', summaryEn: 'Learn singular, plural, third-person, and polite subjects with examples and practice.' },
  'fi-avea': { kind: 'verbs-present' as const, titleFa: 'دو فعل پایه: بودن و داشتن', titleEn: 'Two essential verbs: to be and to have', summaryFa: 'صرف زمان حالِ a fi و a avea را با فاعل هماهنگ کنید.', summaryEn: 'Match the present forms of a fi and a avea to their subjects.' },
  sifat: { kind: 'adjectives' as const, titleFa: 'صفت و هماهنگی آن با اسم', titleEn: 'Adjectives and noun agreement', summaryFa: 'جای صفت و هماهنگی جنس و شمار را در عبارت تمرین کنید.', summaryEn: 'Practise adjective position and gender and number agreement.' },
};
const allSlugs = [...Object.keys(lessonBySlug), ...Object.keys(additionalFoundationLessons)];

type LessonSlug = keyof typeof lessonBySlug;

export function generateStaticParams() {
  return LOCALES.flatMap(lang => allSlugs.map(lesson => ({ lang, lesson })));
}

export function generateMetadata({ params }: { params: { lang: string; lesson: string } }): Metadata {
  const lesson = lessonBySlug[params.lesson as LessonSlug];
  const isFa = params.lang === 'fa';
  const added = additionalFoundationLessons[params.lesson as AdditionalFoundationSlug];
  if (!lesson && !added) return { title: 'Not Found', robots: { index: false, follow: false } };
  return {
    title: `${added ? added.title[isFa ? 'fa' : 'en'] : isFa ? lesson.titleFa : lesson.titleEn} | DORVIA`,
    description: added ? added.goal[isFa ? 'fa' : 'en'] : isFa ? lesson.summaryFa : lesson.summaryEn,
    robots: { index: false, follow: false },
  };
}

export default function CoreFoundationLessonPage({ params }: { params: { lang: string; lesson: string } }) {
  if (!LOCALES.includes(params.lang as (typeof LOCALES)[number])) notFound();
  const lesson = lessonBySlug[params.lesson as LessonSlug];
  const added = additionalFoundationLessons[params.lesson as AdditionalFoundationSlug];
  if (!lesson && !added) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
    <Breadcrumb items={[
      { label: lang === 'fa' ? 'خانه' : 'Home', href: '/' },
      { label: lang === 'fa' ? 'درس‌های پایه' : 'Foundation lessons', href: '/learn-romanian/fundamente' },
      { label: added ? added.title[lang] : lang === 'fa' ? lesson.titleFa : lesson.titleEn },
    ]} currentLang={lang} disableJsonLd />
    {added ? <AdditionalFoundationLesson lang={lang} slug={params.lesson as AdditionalFoundationSlug} /> : lesson.kind === 'subject-pronouns' ? <SubjectPronounsFoundationLesson lang={lang} /> : <CoreSentenceBuildingLesson lang={lang} kind={lesson.kind} />}
  </main>;
}

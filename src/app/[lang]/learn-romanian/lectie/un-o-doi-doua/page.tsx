import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { getWordById } from '@/lib/romanian/content';
import { Breadcrumb } from '@/components/Breadcrumb';
import { NumberGenderFoundationLesson } from '@/components/romanian/NumberGenderFoundationLesson';
import { NUMBER_GENDER_FOUNDATION_LESSON } from '@/content/romanian/number-gender-foundation-lesson';

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? `${NUMBER_GENDER_FOUNDATION_LESSON.titleFa} | DORVIA` : `${NUMBER_GENDER_FOUNDATION_LESSON.titleEn} | DORVIA`,
    description: isFa ? 'تمرین عدد یک و دو با اسم مذکر، مؤنث و خنثی؛ همراه با املا و مکالمهٔ بلیت.' : 'Practise one and two with masculine, feminine and neuter nouns, plus writing and a ticket-counter reply.',
    robots: { index: false, follow: false },
  };
}

export default function NumberGenderLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  const mapped = NUMBER_GENDER_FOUNDATION_LESSON.samples.map(sample => {
    const word = getWordById(sample.wordId);
    if (!word) notFound();
    return { ...sample, word };
  });
  return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <Breadcrumb items={[
      { label: lang === 'fa' ? 'خانه' : 'Home', href: '/' },
      { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
      { label: lang === 'fa' ? 'یک و دو و جنس اسم' : 'One, two and noun gender' },
    ]} currentLang={lang} disableJsonLd />
    <NumberGenderFoundationLesson lang={lang} samples={mapped as unknown as [typeof mapped[number], typeof mapped[number], typeof mapped[number]]} />
  </main>;
}

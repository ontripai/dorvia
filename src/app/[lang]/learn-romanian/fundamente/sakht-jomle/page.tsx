import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LOCALES } from '@/lib/locale-router';
import { SentenceOrderFoundationLesson } from '@/components/romanian/SentenceOrderFoundationLesson';

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'فعل و ترتیب جملهٔ رومانیایی | DORVIA' : 'Romanian Verbs and Sentence Order | DORVIA',
    description: isFa ? 'در یک درس کوتاه جای فاعل، فعل، مفعول، صفت و قید را یاد بگیرید و جملهٔ رومانیایی بسازید.' : 'Learn where Romanian subjects, verbs, objects, adjectives, and adverbs go, then build simple sentences.',
    robots: { index: false, follow: false },
  };
}

export default function SentenceOrderLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
    <Breadcrumb items={[
      { label: lang === 'fa' ? 'خانه' : 'Home', href: '/' },
      { label: lang === 'fa' ? 'درس‌های پایه' : 'Foundation lessons', href: '/learn-romanian/fundamente' },
      { label: lang === 'fa' ? 'فعل و ترتیب جمله' : 'Verbs and sentence order' },
    ]} currentLang={lang} disableJsonLd />
    <SentenceOrderFoundationLesson lang={lang} />
  </main>;
}

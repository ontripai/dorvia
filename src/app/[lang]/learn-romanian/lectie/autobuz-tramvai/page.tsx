import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SurfaceTicketLesson } from '@/components/romanian/SurfaceTicketLesson';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'درس تعاملی: بلیت اتوبوس و تراموا | درویا' : 'Bus and tram ticket lesson | Dorvia',
    description: isFa ? 'پرسیدن دربارهٔ اعتبار بلیت در اتوبوس و تراموا با تمرین مکالمه.' : 'Ask about a ticket on a bus or tram in a guided Romanian dialogue.',
    robots: { index: false, follow: false },
  };
}

export default function SurfaceLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'اتوبوس و تراموا' : 'Bus and tram' }]} currentLang={lang} disableJsonLd />
    <SurfaceTicketLesson lang={lang} />
  </main>;
}

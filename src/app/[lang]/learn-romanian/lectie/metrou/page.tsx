import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Breadcrumb } from '@/components/Breadcrumb';
import { MetroTicketLesson } from '@/components/romanian/MetroTicketLesson';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'درس تعاملی: سفرهای مترو یا اشتراک ماهانه | درویا' : 'Metro journeys or monthly pass | Dorvia',
    description: isFa ? 'درخواست ده سفر یا اشتراک ماهانه در گفت‌وگوی تعاملی متروی بخارست.' : 'Practise requesting ten metro journeys or a monthly pass in Romanian.',
    robots: { index: false, follow: false },
  };
}

export default function MetroLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مترو' : 'Metro' }]} currentLang={lang} disableJsonLd />
    <MetroTicketLesson lang={lang} />
  </main>;
}

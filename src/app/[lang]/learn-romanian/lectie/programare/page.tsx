import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AppointmentLesson } from '@/components/romanian/AppointmentLesson';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'گرفتن وقت ملاقات | درس رومانیایی | درویا' : 'Booking an appointment | Romanian lesson | Dorvia', description: isFa ? 'درس ۱۵ دقیقه‌ای درخواست وقت، انتخاب روز و ساعت به رومانیایی.' : 'A 15-minute Romanian lesson on requesting an appointment and choosing a day and time.', robots: { index: false, follow: false } };
}
export default function AppointmentLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'گرفتن وقت ملاقات' : 'Booking an appointment' }]} currentLang={lang} disableJsonLd /><AppointmentLesson lang={lang} /></main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PharmacyLesson } from '@/components/romanian/PharmacyLesson';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'گفت‌وگو در داروخانه | درس رومانیایی | درویا' : 'At the pharmacy | Romanian lesson | Dorvia', description: isFa ? 'درس ۱۵ دقیقه‌ای پرسیدن موجودی دارو، نسخه و درخواست توضیح از داروساز.' : 'A 15-minute Romanian lesson on asking about a medicine, a prescription, and an explanation from the pharmacist.', robots: { index: false, follow: false } };
}
export default function PharmacyLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'داروخانه' : 'Pharmacy' }]} currentLang={lang} disableJsonLd /><PharmacyLesson lang={lang} /></main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CafeLesson } from '@/components/romanian/CafeLesson';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'سفارش در کافه | درس رومانیایی | درویا' : 'Ordering in a café | Romanian lesson | Dorvia', description: isFa ? 'درس ۱۵ دقیقه‌ای سفارش نوشیدنی، درخواست مؤدبانه و صورتحساب.' : 'A 15-minute Romanian lesson on ordering a drink politely and asking for the bill.', robots: { index: false, follow: false } };
}
export default function CafeLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'سفارش در کافه' : 'Ordering in a café' }]} currentLang={lang} disableJsonLd /><CafeLesson lang={lang} /></main>;
}

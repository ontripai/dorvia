import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ShopLesson } from '@/components/romanian/ShopLesson';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'خرید در فروشگاه | درس رومانیایی | درویا' : 'Buying in a shop | Romanian lesson | Dorvia', description: isFa ? 'درس ۱۵ دقیقه‌ای خرید آب، شمارش بطری و پرسیدن قیمت به رومانیایی.' : 'A 15-minute Romanian lesson on buying water, counting bottles and asking the price.', robots: { index: false, follow: false } };
}
export default function ShopLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'خرید در فروشگاه' : 'Shopping in a store' }]} currentLang={lang} disableJsonLd /><ShopLesson lang={lang} /></main>;
}

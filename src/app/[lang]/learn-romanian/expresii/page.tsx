import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { CategoryGrid } from '@/components/romanian/CategoryGrid';
import { getCategoryCounts } from '@/lib/romanian/content';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'عبارت‌های کاربردی رومانیایی | DORVIA' : 'Practical Romanian phrases | DORVIA', description: isFa ? 'عبارت‌های رومانیایی دسته‌بندی‌شده برای موقعیت‌های زندگی روزمره.' : 'Romanian phrases grouped by real-life situations.', robots: { index: false, follow: false } };
}

export default function PhraseCollection({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en'; const isFa = lang === 'fa';
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8" dir={isFa ? 'rtl' : 'ltr'}>
    <Breadcrumb items={[{ label: isFa ? 'خانه' : 'Home', href: '/' }, { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: isFa ? 'عبارت‌های کاربردی' : 'Practical phrases' }]} currentLang={lang} disableJsonLd />
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-bold text-blue-200">{isFa ? 'مجموعهٔ ۴ · مرجع موقعیت‌ها' : 'Collection 4 · situation reference'}</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{isFa ? 'عبارت‌های کاربردی' : 'Practical phrases'}</h1><p className="mt-3 max-w-3xl leading-7 text-blue-50">{isFa ? 'موضوع موردنیاز خود را انتخاب کنید و عبارت‌های رومانیایی را همراه انگلیسی و معنی فارسی ببینید.' : 'Choose a topic and read Romanian phrases with their English meanings.'}</p></header>
    <section aria-labelledby="phrase-topics" className="rounded-3xl border border-violet-200 bg-violet-50/40 p-5 sm:p-8"><h2 id="phrase-topics" className="mb-5 text-xl font-extrabold text-slate-900">{isFa ? 'موضوع‌های دارای عبارت' : 'Topics with phrases'}</h2><CategoryGrid currentLang={lang} categoryCounts={getCategoryCounts()} /></section>
    <Link href="/learn-romanian" className="inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1554bd]">{isFa ? 'بازگشت به مجموعه‌ها ←' : 'Back to collections →'}</Link>
  </main>;
}

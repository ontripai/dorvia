import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { STATION_ENGLISH } from '@/content/romanian/learning-collections';
import { getPublishedStations } from '@/lib/romanian/content';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'تمرین‌های تکمیلی رومانیایی | DORVIA' : 'Romanian extra practice | DORVIA', description: isFa ? 'ماژول‌های چندبخشی واژه و عبارت و مرور روزانه.' : 'Step-by-step vocabulary and phrase modules with daily review.', robots: { index: false, follow: false } };
}

export default function PracticeCollection({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en'; const isFa = lang === 'fa'; const stations = getPublishedStations();
  const number = (value: number) => isFa ? String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]) : String(value);
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8" dir={isFa ? 'rtl' : 'ltr'}>
    <Breadcrumb items={[{ label: isFa ? 'خانه' : 'Home', href: '/' }, { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: isFa ? 'تمرین‌های تکمیلی' : 'Extra practice' }]} currentLang={lang} disableJsonLd />
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-bold text-blue-200">{isFa ? 'مجموعهٔ ۳ · واژه، عبارت و مرور' : 'Collection 3 · words, phrases and review'}</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{isFa ? 'تمرین‌های تکمیلی' : 'Extra practice'}</h1><p className="mt-3 max-w-3xl leading-7 text-blue-50">{isFa ? 'ماژول‌ها را بر اساس موضوع باز کنید و بخش‌های آن‌ها را به ترتیب تمرین کنید. برای به‌یادسپاری، به مرور روزانه بازگردید.' : 'Choose a topic module and follow its steps in order. Return to daily review to reinforce what you learned.'}</p></header>
    <section aria-labelledby="modules-list" className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 sm:p-8"><h2 id="modules-list" className="text-xl font-extrabold text-slate-900">{isFa ? 'ماژول‌های منتشرشده' : 'Published modules'}</h2><ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{stations.map((station, index) => <li key={station.id}><Link href={`/learn-romanian/modul/${station.slug}`} className="group flex h-full min-h-44 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"><span className="text-xs font-extrabold text-amber-800">{isFa ? `ماژول ${number(index + 1)}` : `Module ${index + 1}`}</span><h3 className="mt-3 text-lg font-extrabold text-slate-900">{isFa ? station.titleFa : STATION_ENGLISH[station.slug] || station.titleRo}</h3><p className="mt-2 flex-1 text-sm text-slate-600">{isFa ? `${number(station.stepCount)} بخش · ${number(station.wordCount)} واژه · ${number(station.phraseCount)} عبارت` : `${station.stepCount} steps · ${station.wordCount} words · ${station.phraseCount} phrases`}</p><span className="mt-4 text-sm font-bold text-amber-800 group-hover:underline">{isFa ? 'دیدن بخش‌ها ←' : 'View steps →'}</span></Link></li>)}</ol></section>
    <aside className="flex flex-col gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-extrabold text-slate-900">{isFa ? 'مرور روزانه' : 'Daily review'}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{isFa ? 'واژه‌ها و عبارت‌های آموخته‌شده را هر روز چند دقیقه مرور کنید.' : 'Review learned words and phrases for a few minutes each day.'}</p></div><Link href="/learn-romanian/exercitiu" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#1554bd] px-5 py-2.5 text-sm font-bold text-white">{isFa ? 'شروع مرور ←' : 'Start review →'}</Link></aside>
    <Link href="/learn-romanian" className="inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1554bd]">{isFa ? 'بازگشت به مجموعه‌ها ←' : 'Back to collections →'}</Link>
  </main>;
}

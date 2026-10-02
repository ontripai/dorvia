import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { CONVERSATION_LESSONS } from '@/content/romanian/learning-collections';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'درس‌های مکالمهٔ رومانیایی | DORVIA' : 'Romanian conversation lessons | DORVIA', description: isFa ? 'مکالمه‌های مرحله‌ای رومانیایی با شنیدن، نوشتن و گفتن.' : 'Step-by-step Romanian conversations with listening, writing and speaking.', robots: { index: false, follow: false } };
}

export default function ConversationCollection({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en'; const isFa = lang === 'fa';
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8" dir={isFa ? 'rtl' : 'ltr'}>
    <Breadcrumb items={[{ label: isFa ? 'خانه' : 'Home', href: '/' }, { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: isFa ? 'مکالمه‌های روزمره' : 'Everyday conversations' }]} currentLang={lang} disableJsonLd />
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-bold text-blue-200">{isFa ? 'مجموعهٔ ۲ · پس از پایه' : 'Collection 2 · after foundations'}</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{isFa ? 'مکالمه‌های روزمره' : 'Everyday conversations'}</h1><p className="mt-3 max-w-3xl leading-7 text-blue-50">{isFa ? 'در هر درس ابتدا گفت‌وگو را بشنوید، قاعده را کشف کنید، از حافظه پاسخ دهید و جملهٔ خود را بگویید. هر نوبت حدود ۱۵ دقیقه است و می‌توانید تکرارش کنید.' : 'Listen to the dialogue, discover the rule, recall your answer, and speak your own sentence. Each session takes about 15 minutes and can be repeated.'}</p></header>
    <section aria-labelledby="conversation-list" className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-8"><h2 id="conversation-list" className="text-xl font-extrabold text-slate-900">{isFa ? 'درس‌ها به ترتیب' : 'Lessons in order'}</h2><ol className="mt-5 grid gap-4 md:grid-cols-3">{CONVERSATION_LESSONS.map((lesson, index) => <li key={lesson.href}><Link href={lesson.href} className="group flex h-full min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"><div className="flex items-center justify-between gap-2 text-xs font-bold text-emerald-800"><span>{isFa ? `درس ${'۰۱۲۳۴۵۶۷۸۹'[index + 1]}` : `Lesson ${index + 1}`}</span><span>{isFa ? '۱۵ دقیقه' : '15 min'}</span></div><h3 className="mt-4 text-lg font-extrabold text-slate-900">{isFa ? lesson.fa : lesson.en}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? lesson.detailFa : lesson.detailEn}</p><span className="mt-5 text-sm font-bold text-emerald-800 group-hover:underline">{isFa ? 'شروع درس ←' : 'Start lesson →'}</span></Link></li>)}</ol></section>
    <Link href="/learn-romanian" className="inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1554bd]">{isFa ? 'بازگشت به مجموعه‌ها ←' : 'Back to collections →'}</Link>
  </main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { CONVERSATION_GROUPS } from '@/content/romanian/learning-collections';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.flatMap(lang => CONVERSATION_GROUPS.map(group => ({ lang, slug: group.slug }))); }
export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const group = CONVERSATION_GROUPS.find(item => item.slug === params.slug);
  const isFa = params.lang === 'fa';
  return { title: `${group ? isFa ? group.fa : group.en : 'Romanian'} | ${isFa ? 'درس‌های رومانیایی درویا' : 'Dorvia Romanian lessons'}`, description: group ? isFa ? group.introFa : group.introEn : undefined, robots: { index: false, follow: false } };
}
export default function TopicPage({ params }: { params: { lang: string; slug: string } }) {
  const group = CONVERSATION_GROUPS.find(item => item.slug === params.slug);
  if (!LOCALES.includes(params.lang as 'fa' | 'en') || !group) notFound();
  const lang = params.lang as 'fa' | 'en'; const isFa = lang === 'fa';
  return <main className="mx-auto max-w-5xl space-y-7 px-4 py-8" dir={isFa ? 'rtl' : 'ltr'}>
    <Breadcrumb items={[{ label: isFa ? 'خانه' : 'Home', href: '/' }, { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: isFa ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: isFa ? group.fa : group.en }]} currentLang={lang} disableJsonLd />
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-bold text-blue-200">{isFa ? 'مجموعهٔ موقعیت‌های روزمره' : 'Everyday situation collection'}</p><h1 className="mt-2 text-3xl font-extrabold">{isFa ? group.fa : group.en}</h1><p className="mt-3 max-w-3xl leading-7 text-blue-50">{isFa ? group.introFa : group.introEn}</p><p className="mt-4 text-sm font-semibold text-blue-100">{isFa ? `${group.lessons.length} درس · هر درس حدود ۱۵ دقیقه · درس‌ها را به ترتیب یا بر اساس نیاز بخوانید` : `${group.lessons.length} lessons · about 15 minutes each · follow the order or choose what you need`}</p></header>
    <section aria-labelledby="topic-lessons" className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-8"><h2 id="topic-lessons" className="text-2xl font-extrabold">{isFa ? 'درس‌های این موضوع' : 'Lessons in this topic'}</h2><ol className="mt-5 grid gap-4 md:grid-cols-2">{group.lessons.map((lesson, index) => <li key={lesson.href}><Link href={lesson.href} className="group flex h-full min-h-44 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"><span className="text-xs font-bold text-emerald-800">{isFa ? `درس ${index + 1} · ۱۵ دقیقه` : `Lesson ${index + 1} · 15 minutes`}</span><h3 className="mt-3 text-lg font-extrabold text-slate-900">{isFa ? lesson.fa : lesson.en}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? lesson.detailFa : lesson.detailEn}</p><span className="mt-4 text-sm font-bold text-emerald-800 group-hover:underline">{isFa ? 'شروع درس ←' : 'Start lesson →'}</span></Link></li>)}</ol></section>
    <Link href="/learn-romanian/lectie" className="inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1554bd]">{isFa ? 'بازگشت به موضوع‌ها ←' : 'Back to topics →'}</Link>
  </main>;
}

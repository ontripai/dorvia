import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { CONVERSATION_GROUPS, UPCOMING_CONVERSATION_GROUPS } from '@/content/romanian/learning-collections';
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
    <div className="grid gap-5 md:grid-cols-2" id="conversation-list">{CONVERSATION_GROUPS.map((group, index) => <section key={group.slug} aria-labelledby={`topic-${group.slug}`} className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8"><p className="text-xs font-bold text-emerald-800">{isFa ? `موضوع ${index + 1}` : `Topic ${index + 1}`}</p><h2 id={`topic-${group.slug}`} className="mt-2 text-2xl font-extrabold text-slate-900">{isFa ? group.fa : group.en}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{isFa ? group.introFa : group.introEn}</p><p className="mt-5 text-xs font-bold text-emerald-800">{isFa ? `${group.lessons.length} درس · هر درس حدود ۱۵ دقیقه` : `${group.lessons.length} lessons · about 15 minutes each`}</p><Link href={`/learn-romanian/lectie/tema/${group.slug}`} className="mt-5 inline-flex rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white transition hover:bg-[#10449a]">{isFa ? 'دیدن درس‌های این موضوع ←' : 'Explore this topic →'}</Link></section>)}</div>
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-8"><h2 className="text-xl font-extrabold">{isFa ? 'موضوع‌های بعدی این مسیر' : 'Next topics in this path'}</h2><p className="mt-2 text-sm text-slate-600">{isFa ? 'این موضوع‌ها در برنامهٔ آموزشی هستند؛ درس‌های کامل آن‌ها به تدریج در همین مجموعه قرار می‌گیرند.' : 'These topics are on the learning path; complete lessons will appear here as they are prepared.'}</p><ul className="mt-4 grid gap-3 md:grid-cols-3">{UPCOMING_CONVERSATION_GROUPS.map(group => <li key={group.en} className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-bold">{isFa ? group.fa : group.en}</h3><p className="mt-1 text-sm text-slate-600">{isFa ? group.detailFa : group.detailEn}</p></li>)}</ul></section>
    <Link href="/learn-romanian" className="inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1554bd]">{isFa ? 'بازگشت به مجموعه‌ها ←' : 'Back to collections →'}</Link>
  </main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { FamilyHomeReturn } from '@/components/romanian/FamilyHomeReturn';
import { familyMembers, welcomeHomeLesson } from '@/content/romanian/family-story';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang === 'fa' ? 'fa' : 'en';
  return { title: `${welcomeHomeLesson.title[lang]} | DORVIA`, description: welcomeHomeLesson.goal[lang], robots: { index: false, follow: false } };
}
export default function WelcomeHomePage({ params, searchParams }: { params: { lang: string }; searchParams: { return?: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en'; const fa = lang === 'fa';
  if (searchParams.return === 'shop') return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><FamilyHomeReturn lang={lang}/></main>;
  const intro = <aside className="space-y-4 rounded-2xl border border-blue-200 bg-sky-50 p-5 sm:p-7" aria-label={fa ? 'داستان شما' : 'Your story'}>
    <h2 className="text-xl font-bold">{fa ? 'شما پسرعمو یا دخترعمو هستید' : 'You are the cousin'}</h2>
    <p className="leading-7">{fa ? 'میهای عموی شما و آنا زن‌عموی شماست. برای دیدار آمده‌اید؛ النا، دخترعموی شما، به شما خوش‌آمد می‌گوید. می‌توانید پاسخ پسرعمو یا دخترعمو را انتخاب کنید. پیش‌نیاز: سلام و تشکر، ضمیرها و فعل‌های «بودن» و «داشتن» از درس‌های پایه. این‌ها در شمار پنج واژهٔ تازه نیستند. در حالت «نقش شما» هنگام مکث پاسخ بدهید.' : 'Mihai is your paternal uncle and Ana is your aunt by marriage. Elena, your cousin, welcomes you. Use the male or female cousin answer. Prerequisites: greetings, thanks, pronouns, a fi and a avea from foundations. These do not count as new words. Answer aloud during pauses in “Your role” mode.'}</p>
    <details><summary className="cursor-pointer font-semibold text-[#1554bd]">{fa ? 'آشنایی با شش عضو خانواده' : 'Meet the six family members'}</summary><ul className="mt-3 grid gap-3 sm:grid-cols-2">{familyMembers.map(person => <li key={person.name} className="rounded-xl border border-blue-100 bg-white p-3"><span lang="ro" dir="ltr" className="font-bold">{person.name}</span><p className="mt-1 text-sm">{person.age} {fa ? 'ساله' : 'years old'} · {person.role[lang]}</p></li>)}</ul></details>
  </aside>;
  const continuation = <aside className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="text-lg font-bold">{fa ? 'درس بعد: شناخت خانواده' : 'Next lesson: meet the family'}</h3><p>{fa ? 'برای امروز همین آشنایی کوتاه کافی است. درس بعدی مستقل است و پنج واژهٔ تازهٔ دیگری دارد.' : 'This short introduction is enough for today. The next lesson is independent and has five different vocabulary targets.'}</p><Link href="/learn-romanian/lectie/acasa/familia" className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{fa ? 'درس ۲: شناخت خانواده' : 'Lesson 2: meet the family'}</Link></aside>;
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8" dir={fa ? 'rtl' : 'ltr'}><Breadcrumb items={[{ label: fa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: fa ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: fa ? 'در خانه' : 'At home', href: '/learn-romanian/lectie/tema/home' }, { label: welcomeHomeLesson.title[lang] }]} currentLang={lang} disableJsonLd/><EverydayScenarioLesson lang={lang} lesson={welcomeHomeLesson} topic={{ fa: 'در خانه؛ داستان خانواده · قسمت ۱', en: 'At home: family story · episode 1' }} counterpart={{ fa: 'النا', en: 'Elena' }} topicHref="/learn-romanian/lectie/tema/home" storyIntro={intro} continuation={continuation} footer={{ fa: 'این خانواده و داستان خیالی‌اند. بررسی پاسخ صوتی، جملهٔ تشخیص‌داده‌شده را بررسی می‌کند و نمرهٔ دقیق تلفظ نیست.', en: 'This family and story are fictional. Voice-answer checking evaluates the recognised sentence, not a precise pronunciation score.' }}/></main>;
}

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
    <h2 className="text-xl font-bold">{fa ? 'شما مهمان هستید' : 'You are the guest'}</h2>
    <p className="leading-7">{fa ? 'برای دیدار به خانهٔ خانوادهٔ پوپسکو در بخارست آمده‌اید. آنا به شما خوش‌آمد می‌گوید و خانه را نشان می‌دهد. جمله‌های «شما» پاسخ نمونهٔ مهمان هستند؛ در حالت «نقش شما»، هنگام مکث خودتان پاسخ بدهید.' : 'You arrive at the Popescu family’s home in Bucharest for a visit. Ana welcomes you and shows you the house. Lines marked “You” are model guest answers; in “Your role” mode, answer aloud during the pauses.'}</p>
    <details><summary className="cursor-pointer font-semibold text-[#1554bd]">{fa ? 'آشنایی با شش عضو خانواده' : 'Meet the six family members'}</summary><ul className="mt-3 grid gap-3 sm:grid-cols-2">{familyMembers.map(person => <li key={person.name} className="rounded-xl border border-blue-100 bg-white p-3"><span lang="ro" dir="ltr" className="font-bold">{person.name}</span><p className="mt-1 text-sm">{person.age} {fa ? 'ساله' : 'years old'} · {person.role[lang]}</p></li>)}</ul></details>
  </aside>;
  const continuation = <aside className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" aria-label={fa ? 'ادامهٔ داستان بیرون از خانه' : 'Continue the story outside the home'}>
    <h3 className="text-lg font-bold">{fa ? 'بعد از استراحت: همراه آنا به فروشگاه' : 'After a rest: to the shop with Ana'}</h3>
    <p>{fa ? 'برای فردا آب لازم دارید. همراه آنا به فروشگاه نزدیک خانه می‌روید؛ این بار خودتان یک بطری آب می‌خواهید و قیمت را می‌پرسید.' : 'You need water for tomorrow. You go with Ana to the nearby shop; this time you ask for a bottle of water and its price yourself.'}</p>
    <Link href="/learn-romanian/lectie/magazin?story=home-welcome" className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{fa ? 'ادامه در فروشگاه: خرید آب' : 'Continue at the shop: buy water'}</Link>
    <p className="text-sm text-slate-600">{fa ? 'این پیوند، درس موجودِ خرید آب را باز می‌کند. می‌توانید جداگانه از فهرست موضوع‌ها هم وارد آن شوید.' : 'This opens the existing water-shopping lesson. You can also reach it directly from the topic list.'}</p>
  </aside>;
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8" dir={fa ? 'rtl' : 'ltr'}><Breadcrumb items={[{ label: fa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: fa ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: fa ? 'در خانه' : 'At home', href: '/learn-romanian/lectie/tema/home' }, { label: welcomeHomeLesson.title[lang] }]} currentLang={lang} disableJsonLd/><EverydayScenarioLesson lang={lang} lesson={welcomeHomeLesson} topic={{ fa: 'در خانه؛ داستان خانواده · قسمت ۱', en: 'At home: family story · episode 1' }} counterpart={{ fa: 'آنا', en: 'Ana' }} topicHref="/learn-romanian/lectie/tema/home" storyIntro={intro} continuation={continuation} footer={{ fa: 'این خانواده و داستان خیالی‌اند. بررسی پاسخ صوتی، جملهٔ تشخیص‌داده‌شده را بررسی می‌کند و نمرهٔ دقیق تلفظ نیست.', en: 'This family and story are fictional. Voice-answer checking evaluates the recognised sentence, not a precise pronunciation score.' }}/></main>;
}

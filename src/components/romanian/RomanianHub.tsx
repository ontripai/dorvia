import React from 'react';
import type { Language } from '@/types';
import type { RomanianCategory } from '@/lib/romanian/types';
import type { PublishedStationInfo } from '@/lib/romanian/content';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { CategoryGrid } from './CategoryGrid';

interface Props {
  currentLang: Language;
  categoryCounts: Record<RomanianCategory, number>;
  stations: PublishedStationInfo[];
}

const conversations = [
  { href: '/learn-romanian/lectie/bilet', fa: 'یک بلیت یا دو بلیت؟', en: 'One ticket or two?', detailFa: 'درخواست مؤدبانه و تعداد بلیت در باجه', detailEn: 'Polite requests and ticket quantities at the counter' },
  { href: '/learn-romanian/lectie/autobuz-tramvai', fa: 'اتوبوس و تراموا', en: 'Bus and tram', detailFa: 'پرسیدن دربارهٔ اعتبار بلیت در وسیلهٔ دیگر', detailEn: 'Ask whether a ticket works on another vehicle' },
  { href: '/learn-romanian/lectie/metrou', fa: 'متروی بخارست', en: 'Bucharest metro', detailFa: 'انتخاب ده سفر یا اشتراک ماهانه', detailEn: 'Choose ten journeys or a monthly pass' },
] as const;

const stationEnglish: Record<string, string> = {
  salutari: 'Greetings and politeness', numere: 'Numbers', timp: 'Time',
  'cuvinte-interogative': 'Question words', pronume: 'Pronouns',
};

function SectionHeading({ number, eyebrow, title, description, id, isFa }: {
  number: number; eyebrow: string; title: string; description: string; id: string; isFa: boolean;
}) {
  return <div className="flex items-start gap-4">
    <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1554bd] text-sm font-extrabold text-white">{isFa ? '۰۱۲۳۴۵۶۷۸۹'[number] : String(number).padStart(2, '0')}</span>
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wider text-[#1554bd]">{eyebrow}</p>
      <h2 id={id} className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  </div>;
}

export function RomanianHub({ currentLang, categoryCounts, stations }: Props) {
  const isFa = currentLang === 'fa';
  const number = (n: number) => isFa ? String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]) : String(n);

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-7 sm:space-y-12 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
    <Breadcrumb items={[
      { label: isFa ? 'خانه' : 'Home', href: '/' },
      { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian' },
    ]} currentLang={currentLang} disableJsonLd />

    <header className="dark-hero-panel rounded-3xl px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
      <p className="text-sm font-bold text-blue-200">{isFa ? 'مسیر آموزش رومانیایی · گام‌به‌گام' : 'Romanian learning path · step by step'}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{isFa ? 'از حروف الفبا تا مکالمهٔ روزمره' : 'From the alphabet to everyday conversation'}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{isFa ? 'از درس‌های پایه آغاز کنید، جملهٔ ساده بسازید و سپس آن را در گفت‌وگوهای واقعی تمرین کنید. هر درس را با شنیدن، نوشتن و گفتن پیش ببرید.' : 'Start with the foundations, build simple sentences, then use them in real conversations. Listen, write, and speak in each lesson.'}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/learn-romanian/fundamente" className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#1554bd] hover:bg-blue-50">{isFa ? 'شروع درس‌های پایه ←' : 'Start foundations →'}</Link>
        <a href="#conversation" className="inline-flex min-h-11 items-center rounded-xl border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">{isFa ? 'دیدن درس‌های مکالمه' : 'See conversation lessons'}</a>
      </div>
    </header>

    <nav aria-label={isFa ? 'بخش‌های آموزش' : 'Learning sections'} className="flex flex-wrap gap-2 text-xs font-bold">
      {[
        { href: '#foundation', fa: '۱ · پایه', en: '1 · Foundations' },
        { href: '#conversation', fa: '۲ · مکالمه', en: '2 · Conversations' },
        { href: '#practice-modules', fa: '۳ · تمرین تکمیلی', en: '3 · Extra practice' },
        { href: '#phrase-bank', fa: '۴ · بانک عبارت', en: '4 · Phrase bank' },
      ].map(item => <a key={item.href} href={item.href} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:border-blue-300 hover:text-[#1554bd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">{isFa ? item.fa : item.en}</a>)}
    </nav>

    <section id="foundation" aria-labelledby="foundation-title" className="scroll-mt-24 rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm sm:p-8">
      <SectionHeading number={1} id="foundation-title" isFa={isFa}
        eyebrow={isFa ? 'نقطهٔ شروع · هر درس حدود ۱۵ دقیقه' : 'Start here · about 15 minutes per lesson'}
        title={isFa ? 'دروس پایه؛ از صدا تا جمله' : 'Foundations: from sounds to sentences'}
        description={isFa ? 'همهٔ حروف و گروه‌حرف‌ها در بخش الفبا هستند. سپس ۹ درس پایه را به ترتیب بخوانید تا بتوانید با a fi و a avea جملهٔ ساده بسازید.' : 'Find every letter and letter pattern under the alphabet. Then follow nine ordered foundation lessons to build simple sentences with a fi and a avea.'} />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/learn-romanian/alfabet" className="group flex flex-col rounded-2xl border border-blue-100 bg-blue-50/70 p-5 transition hover:border-blue-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
          <span className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'آغاز مسیر · حروف و صداها' : 'First · letters and sounds'}</span>
          <h3 className="mt-2 text-xl font-extrabold text-slate-900">{isFa ? 'الفبا و گروه‌حرف‌ها' : 'Alphabet and letter patterns'}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? '۳۱ حرف در گروه‌های واکه، همخوان و وام‌واژه؛ سپس ce/ci، che/chi، ge/gi و ghe/ghi. نام حرف، آوا و واژهٔ نمونه را جداگانه بشنوید.' : '31 letters grouped as vowels, consonants, and loan letters, plus ce/ci, che/chi, ge/gi, and ghe/ghi. Hear each letter, sound, and example word.'}</p>
          <span className="mt-5 text-sm font-bold text-[#1554bd] group-hover:underline">{isFa ? 'بازکردن الفبا ←' : 'Open alphabet →'}</span>
        </Link>
        <Link href="/learn-romanian/fundamente" className="group flex flex-col rounded-2xl border border-violet-100 bg-violet-50/70 p-5 transition hover:border-violet-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
          <span className="text-xs font-extrabold text-violet-700">{isFa ? 'پس از الفبا · ۹ درس به ترتیب' : 'Next · nine ordered lessons'}</span>
          <h3 className="mt-2 text-xl font-extrabold text-slate-900">{isFa ? 'دستور زبان و جمله‌سازی' : 'Grammar and sentence building'}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? 'معرفی، پرسش، منفی‌سازی، اسم، دو فعل پایه، مکان، عدد و زمان؛ پایان مسیر، ترتیب فاعل، فعل، مفعول، صفت و قید است.' : 'Introductions, questions, negation, nouns, two essential verbs, place, number, and time; finish with sentence order.'}</p>
          <span className="mt-5 text-sm font-bold text-violet-700 group-hover:underline">{isFa ? 'دیدن ترتیب درس‌ها ←' : 'See lesson order →'}</span>
        </Link>
      </div>
      <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{isFa ? 'هدف این بخش: «Eu am un bilet nou.» — من یک بلیت جدید دارم.' : 'Goal: “Eu am un bilet nou.” — I have a new ticket.'}</p>
    </section>

    <section id="conversation" aria-labelledby="conversation-title" className="scroll-mt-24 space-y-5">
      <SectionHeading number={2} id="conversation-title" isFa={isFa}
        eyebrow={isFa ? 'کاربرد آموخته‌ها · گفت‌وگوی واقعی' : 'Use what you learned · real dialogues'}
        title={isFa ? 'درس‌های مکالمهٔ روزمره' : 'Everyday conversation lessons'}
        description={isFa ? 'از گفت‌وگو شروع کنید، قاعده را کشف کنید، از حافظه پاسخ دهید و در پایان خودتان جمله بگویید. هر کارت یک درس مستقل و حدود ۱۵ دقیقه‌ای است.' : 'Start with a dialogue, discover the rule, recall it, and say your own answer. Each card is a separate lesson of about 15 minutes.'} />
      <ol className="grid gap-4 md:grid-cols-3">
        {conversations.map((lesson, index) => <li key={lesson.href}><Link href={lesson.href} className="group flex h-full min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-extrabold text-emerald-800">{isFa ? `درس ${number(index + 1)}` : `LESSON ${index + 1}`}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">{isFa ? '۱۵ دقیقه' : '15 min'}</span></div>
          <h3 className="mt-4 text-lg font-extrabold text-slate-900">{isFa ? lesson.fa : lesson.en}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? lesson.detailFa : lesson.detailEn}</p>
          <span className="mt-5 text-sm font-bold text-emerald-800 group-hover:underline">{isFa ? 'ورود به درس ←' : 'Open lesson →'}</span>
        </Link></li>)}
      </ol>
    </section>

    {stations.length > 0 && <section id="practice-modules" aria-labelledby="modules-title" className="scroll-mt-24 space-y-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-8">
      <SectionHeading number={3} id="modules-title" isFa={isFa}
        eyebrow={isFa ? 'واژه و عبارت · تمرین چندبخشی' : 'Words and phrases · multi-part practice'}
        title={isFa ? 'تمرین‌های تکمیلی' : 'Extra practice modules'}
        description={isFa ? 'این ماژول‌ها واژه‌ها و عبارت‌ها را به چند بخش کوچک تقسیم می‌کنند. می‌توانید پس از درس‌های پایه یا کنار مکالمه‌ها آن‌ها را تمرین کنید.' : 'These modules split words and phrases into smaller steps. Practise them after the foundations or alongside conversations.'} />
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((station, index) => <li key={station.id}><Link href={`/learn-romanian/modul/${station.slug}`} className="group flex h-full flex-col rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
          <span className="text-xs font-extrabold text-[#1554bd]">{isFa ? `ماژول ${number(index + 1)}` : `MODULE ${index + 1}`}</span>
          <h3 className="mt-2 text-lg font-extrabold text-slate-900">{isFa ? station.titleFa : stationEnglish[station.slug] || station.titleRo}</h3>
          <p className="mt-2 flex-1 text-xs leading-5 text-slate-600">{isFa ? `${number(station.stepCount)} بخش · ${number(station.wordCount)} واژه · ${number(station.phraseCount)} عبارت` : `${station.stepCount} steps · ${station.wordCount} words · ${station.phraseCount} phrases`}</p>
          <span className="mt-4 text-xs font-bold text-[#1554bd] group-hover:underline">{isFa ? 'دیدن بخش‌ها ←' : 'View steps →'}</span>
        </Link></li>)}
      </ol>
    </section>}

    <section id="phrase-bank" aria-labelledby="phrase-bank-title" className="scroll-mt-24 space-y-5">
      <SectionHeading number={4} id="phrase-bank-title" isFa={isFa}
        eyebrow={isFa ? 'جست‌وجو بر اساس موقعیت' : 'Browse by situation'}
        title={isFa ? 'بانک عبارت‌های کاربردی' : 'Practical phrase bank'}
        description={isFa ? 'عبارت‌های منتشرشده را برای موقعیت موردنیاز خود پیدا کنید. این‌ها مجموعهٔ مرجع در کنار درس‌های مرحله‌ای بالا هستند.' : 'Find published expressions for your situation. These are reference collections alongside the guided lessons above.'} />
      <CategoryGrid currentLang={currentLang} categoryCounts={categoryCounts} />
    </section>

    {stations.length > 0 && <aside className="flex flex-col gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div><h2 className="text-lg font-extrabold text-slate-900">{isFa ? 'برای مرور دوباره آماده‌اید؟' : 'Ready to review?'}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{isFa ? 'واژه‌ها و عبارت‌های آموخته‌شده را در تمرین روزانه مرور کنید؛ می‌توانید هر روز چند دقیقه یا بیشتر تمرین کنید.' : 'Review learned words and phrases in daily practice. Spend a few minutes or more whenever you like.'}</p></div>
      <Link href="/learn-romanian/exercitiu" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#1554bd] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">{isFa ? 'شروع مرور ←' : 'Start review →'}</Link>
    </aside>}
  </main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { LOCALES } from '@/lib/locale-router';
import { getPublishedStations } from '@/lib/romanian/content';

type LessonLink = { labelFa: string; labelEn: string; href: string; noteFa: string; noteEn: string };
type FoundationStage = { number: string; numberEn: string; titleFa: string; titleEn: string; introFa: string; introEn: string; id: string; lessons: LessonLink[] };
const toFaDigits = (value: number | string) => String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);

const stages: FoundationStage[] = [
  {
    number: 'گام ۱', numberEn: 'STEP 1', id: 'sounds',
    titleFa: 'حرف را ببینید و صدایش را بشنوید', titleEn: 'See the letter and hear its sound',
    introFa: 'اول صدای خود حرف را جدا بشنوید؛ بعد همان صدا را در واژهٔ نمونه پیدا کنید، واژه را بنویسید و بلند تکرار کنید.',
    introEn: 'First hear the letter on its own. Then find it in a sample word, write the word, and say it aloud.',
    lessons: [
      { labelFa: 'الفبای کامل و انتخاب حرف', labelEn: 'Full alphabet and letter picker', href: '/learn-romanian/alfabet', noteFa: '۳۱ حرف، نمونه‌واژه و چهار گروه‌حرف C و G', noteEn: '31 letters, sample words, and four C/G patterns' },
      { labelFa: 'صدای A', labelEn: 'Sound of A', href: '/learn-romanian/alfabet/a', noteFa: 'شنیدن صدای مستقل و دیدن آن در سه واژه', noteEn: 'Hear it alone and find it in three words' },
      { labelFa: 'صدای E', labelEn: 'Sound of E', href: '/learn-romanian/alfabet/e', noteFa: 'آغاز واژه و لغزش آغازین را تمرین کنید', noteEn: 'Practise word beginnings and the initial glide' },
      { labelFa: 'صدای I', labelEn: 'Sound of I', href: '/learn-romanian/alfabet/i', noteFa: 'صدای واکهٔ i را با نمونه‌ها بشنوید', noteEn: 'Hear the vowel i in example words' },
      { labelFa: 'صدای O', labelEn: 'Sound of O', href: '/learn-romanian/alfabet/o', noteFa: 'واکهٔ گرد o را در واژه‌ها پیدا کنید', noteEn: 'Find the rounded vowel o in words' },
      { labelFa: 'صدای U', labelEn: 'Sound of U', href: '/learn-romanian/alfabet/u', noteFa: 'صدای u را تنها و در واژه بشنوید', noteEn: 'Hear u alone and inside a word' },
      { labelFa: 'همخوان‌ها و نمونه‌واژه‌ها', labelEn: 'Consonants and sample words', href: '/learn-romanian/alfabet/consoane', noteFa: 'صدای همخوان‌های رومانیایی را با واژهٔ نمونه مرور کنید', noteEn: 'Review Romanian consonant sounds with sample words' },
    ],
  },
  {
    number: 'گام ۲', numberEn: 'STEP 2', id: 'spelling',
    titleFa: 'تفاوت صداها و قواعد نوشتار را یاد بگیرید', titleEn: 'Learn sound contrasts and spelling patterns',
    introFa: 'پس از حروف منفرد، به نشانه‌های ویژهٔ رومانیایی، جایگاه i پایانی و ترکیب‌هایی برسید که با هم یک صدای مشخص می‌سازند.',
    introEn: 'After individual letters, study Romanian diacritics, word-final i, and combinations that make a specific sound.',
    lessons: [
      { labelFa: 'صدای ă', labelEn: 'Sound of ă', href: '/learn-romanian/alfabet/a-breve', noteFa: 'صدای مستقل، واژه‌های نمونه و تمرین یادآوری', noteEn: 'Isolated sound, sample words, and recall practice' },
      { labelFa: 'â و î', labelEn: 'Â and î', href: '/learn-romanian/alfabet/circ-rule', noteFa: 'صدای مشترک و تفاوت کاربرد نوشتاری', noteEn: 'Shared sound and different spelling contexts' },
      { labelFa: 'i پایانی', labelEn: 'Word-final i', href: '/learn-romanian/alfabet/i-final', noteFa: 'i شنیدنی را از i کم‌آوا تشخیص دهید', noteEn: 'Distinguish audible i from reduced i' },
      { labelFa: 'ce / ci', labelEn: 'ce / ci', href: '/learn-romanian/alfabet/ce-ci', noteFa: 'صدای چ در واژه‌هایی مثل ceai', noteEn: 'The ch sound, as in ceai' },
      { labelFa: 'che / chi', labelEn: 'che / chi', href: '/learn-romanian/alfabet/che-chi', noteFa: 'صدای ک در واژه‌هایی مثل cheie', noteEn: 'The k sound, as in cheie' },
      { labelFa: 'ge / gi', labelEn: 'ge / gi', href: '/learn-romanian/alfabet/ge-gi', noteFa: 'صدای ج در واژه‌هایی مثل geam', noteEn: 'The j sound, as in geam' },
      { labelFa: 'ghe / ghi', labelEn: 'ghe / ghi', href: '/learn-romanian/alfabet/ghe-ghi', noteFa: 'صدای گ در واژه‌هایی مثل ghișeu', noteEn: 'The hard g sound, as in ghișeu' },
    ],
  },
  {
    number: 'گام ۳', numberEn: 'STEP 3', id: 'words',
    titleFa: 'از واژه به جمله برسید', titleEn: 'Move from words to sentences',
    introFa: 'با یک قاعدهٔ روشن، واژه‌ها را درست در جمله به کار ببرید و هم‌زمان نوشتن و گفتن را تمرین کنید.',
    introEn: 'Use a clear pattern to put words into sentences while practising both writing and speaking.',
    lessons: [
      { labelFa: 'un / o و doi / două', labelEn: 'un / o and doi / două', href: '/learn-romanian/lectie/un-o-doi-doua', noteFa: 'یک و دو با اسم مذکر، مؤنث و خنثی', noteEn: 'One and two with masculine, feminine, and neuter nouns' },
    ],
  },
];

const CORE_STATION_COPY: Record<string, { titleEn: string; summaryFa: string; summaryEn: string }> = {
  salutari: { titleEn: 'Greetings and polite language', summaryFa: 'سلام‌کردن، معرفی، تشکر و عبارت‌های مؤدبانه.', summaryEn: 'Greetings, introductions, thanks, and polite expressions.' },
  numere: { titleEn: 'Numbers and counting', summaryFa: 'شمارش و عددهای ترتیبی؛ از صفر تا عددهای بزرگ.', summaryEn: 'Counting and ordinal numbers, from zero to larger numbers.' },
  timp: { titleEn: 'Time and calendar', summaryFa: 'روزهای هفته، ماه‌ها، ساعت و بخش‌های روز.', summaryEn: 'Days, months, telling time, and parts of the day.' },
  'cuvinte-interogative': { titleEn: 'Question words', summaryFa: 'ساخت پرسش‌هایی مثل چه، کجا، کی، چطور و چندتا.', summaryEn: 'Ask what, where, when, how, and how many.' },
  pronume: { titleEn: 'Pronouns', summaryFa: 'فاعل، مفعول، خطاب محترمانه و مالکیت.', summaryEn: 'Subjects, objects, polite address, and possession.' },
};

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'مسیر درس‌های پایهٔ رومانیایی | DORVIA' : 'Romanian Foundation Lessons | DORVIA',
    description: isFa ? 'مسیر مرحله‌به‌مرحلهٔ الفبا، تلفظ، گروه‌حرف‌ها، نوشتار و ساخت واژه و جملهٔ رومانیایی.' : 'A step-by-step Romanian path through letters, pronunciation, spelling patterns, words, and sentences.',
    robots: { index: false, follow: false },
  };
}

export default function RomanianFoundationPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as (typeof LOCALES)[number])) notFound();
  const isFa = params.lang === 'fa';
  const lang = params.lang as 'fa' | 'en';
  const coreStations = getPublishedStations()
    .filter(station => station.id.startsWith('core-'))
    .sort((a, b) => a.order - b.order);

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-7 sm:space-y-12 sm:py-10">
    <Breadcrumb items={[
      { label: isFa ? 'خانه' : 'Home', href: '/' },
      { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
      { label: isFa ? 'درس‌های پایه' : 'Foundation lessons' },
    ]} currentLang={lang} disableJsonLd />

    <header className="dark-hero-panel overflow-hidden rounded-3xl px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
      <span className="text-sm font-bold text-blue-200">{isFa ? 'مسیر مستقل آموزش پایه' : 'A separate foundation path'}</span>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{isFa ? 'از صدای حرف تا جملهٔ کاربردی' : 'From letter sounds to useful sentences'}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{isFa ? 'درس‌ها را به ترتیب پیش ببرید: نخست صدا، سپس املا و گروه‌حرف‌ها، و در پایان ساخت واژه و جمله. هر کارت یک مقصد روشن دارد و تمرین نوشتاری و گفتاری در خود درس انجام می‌شود.' : 'Follow the stages in order: sounds first, then spelling and letter groups, then words and sentences. Each card has a clear destination, with writing and speaking practice inside the lesson.'}</p>
    </header>

    <section aria-labelledby="how-to-use-heading" className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1554bd]">{isFa ? 'روش استفاده' : 'How to use this path'}</p>
          <h2 id="how-to-use-heading" className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{isFa ? 'هر درس را با چهار حرکت کامل کنید' : 'Complete each lesson in four moves'}</h2>
        </div>
        <span className="text-xs text-slate-500">{isFa ? 'پیشنهاد: روزی یک یا دو درس' : 'Suggested: one or two lessons a day'}</span>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { n: '۱', enN: '1', fa: 'بشنوید', en: 'Listen', detailFa: 'صدای حرف یا واژه را گوش کنید.', detailEn: 'Listen to the letter or word.' },
          { n: '۲', enN: '2', fa: 'مقایسه کنید', en: 'Compare', detailFa: 'صدا را در واژهٔ نمونه پیدا کنید.', detailEn: 'Find the sound in a sample word.' },
          { n: '۳', enN: '3', fa: 'بنویسید', en: 'Write', detailFa: 'پاسخ را بدون نگاه‌کردن یادآوری کنید.', detailEn: 'Recall and write the answer.' },
          { n: '۴', enN: '4', fa: 'بلند بگویید', en: 'Say it aloud', detailFa: 'واژه یا جمله را با صدای بلند تکرار کنید.', detailEn: 'Repeat the word or sentence aloud.' },
        ].map(step => <li key={step.enN} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-[#1554bd]">{isFa ? step.n : step.enN}</span>
          <h3 className="mt-3 font-bold text-slate-900">{isFa ? step.fa : step.en}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">{isFa ? step.detailFa : step.detailEn}</p>
        </li>)}
      </ol>
    </section>

    <div className="space-y-6">
      {stages.map((stage, index) => <section key={stage.id} id={stage.id} aria-labelledby={`${stage.id}-heading`} className="scroll-mt-24 space-y-4">
        <div className="flex gap-4 border-b border-slate-200 pb-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#1554bd] text-sm font-extrabold text-white">{isFa ? stage.number.replace('گام ', '') : stage.numberEn.replace('STEP ', '')}</span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#1554bd]">{isFa ? stage.number : stage.numberEn}</p>
            <h2 id={`${stage.id}-heading`} className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{isFa ? stage.titleFa : stage.titleEn}</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{isFa ? stage.introFa : stage.introEn}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stage.lessons.map((lesson, lessonIndex) => <Link key={lesson.href} href={lesson.href} className="group flex min-h-36 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
            <span className="text-[11px] font-bold text-slate-400">{isFa ? `درس ${index + 1}.${lessonIndex + 1}` : `LESSON ${index + 1}.${lessonIndex + 1}`}</span>
            <h3 className="mt-2 text-base font-extrabold text-slate-900 group-hover:text-[#1554bd]">{isFa ? lesson.labelFa : lesson.labelEn}</h3>
            <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{isFa ? lesson.noteFa : lesson.noteEn}</p>
            <span className="mt-4 text-xs font-bold text-[#1554bd]">{isFa ? 'رفتن به درس ←' : 'Open lesson →'}</span>
          </Link>)}
        </div>
      </section>)}
    </div>

    <section aria-labelledby="core-modules-heading" className="space-y-5 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-7">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">{isFa ? 'بخش چهارم · هستهٔ واژگان و جمله' : 'PART 4 · CORE VOCABULARY AND SENTENCES'}</p>
        <h2 id="core-modules-heading" className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{isFa ? 'پنج درس هسته‌ای رومانیایی' : 'Five core Romanian modules'}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{isFa ? 'این درس‌ها مبانی لازم برای پرسیدن، شمردن، گفت‌وگوی ساده و ساخت جمله را پوشش می‌دهند. از این بخش به درس‌های موقعیتی مثل خرید بلیت وارد نمی‌شویم؛ آن‌ها در مسیر کاربردی پایین صفحه قرار دارند.' : 'These modules build the basics for asking, counting, simple exchanges, and sentence building. Situational lessons such as buying a ticket are kept in the practical path below.'}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coreStations.map((station, index) => {
          const copy = CORE_STATION_COPY[station.slug];
          if (!copy) return null;
          return <Link key={station.id} href={`/learn-romanian/modul/${station.slug}`} className="group flex min-h-44 flex-col rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold text-indigo-700">{isFa ? `هسته ${toFaDigits(index + 1)}` : `CORE ${String(index + 1).padStart(2, '0')}`}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{isFa ? `${toFaDigits(station.totalCount)} مورد` : `${station.totalCount} items`}</span>
            </div>
            <h3 className="mt-3 text-base font-extrabold text-slate-900 group-hover:text-indigo-700">{isFa ? station.titleFa : copy.titleEn}</h3>
            <p className="mt-1 text-xs text-slate-400" lang="ro" dir="ltr">{station.titleRo}</p>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{isFa ? copy.summaryFa : copy.summaryEn}</p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-indigo-700">
              <span>{station.stepCount > 0 ? (isFa ? `${toFaDigits(station.stepCount)} گام آموزشی` : `${station.stepCount} learning steps`) : (isFa ? 'مشاهدهٔ درس' : 'Open module')}</span>
              <span aria-hidden="true">{isFa ? '←' : '→'}</span>
            </div>
          </Link>;
        })}
      </div>
    </section>

    <section className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">{isFa ? 'مسیر جداگانه' : 'A separate learning track'}</p>
        <h2 className="mt-1 text-xl font-extrabold text-slate-900">{isFa ? 'حالا وارد مکالمه‌های روزمره شوید' : 'Now move into everyday conversations'}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{isFa ? 'درس‌های بلیت، اتوبوس و مترو برای به‌کاربردن آموخته‌ها در موقعیت واقعی طراحی شده‌اند.' : 'The ticket, bus, and metro lessons help you use these foundations in real situations.'}</p>
      </div>
      <Link href="/learn-romanian/lectie/bilet" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">{isFa ? 'رفتن به درس بلیت ←' : 'Open the ticket lesson →'}</Link>
    </section>

    <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
      <Link href="/learn-romanian" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300">{isFa ? 'بازگشت به همهٔ آموزش‌ها' : 'Back to all learning'}</Link>
      <Link href="/learn-romanian/alfabet" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300">{isFa ? 'رفتن به الفبا و صداها' : 'Go to alphabet and sounds'}</Link>
    </div>
  </main>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { LOCALES } from '@/lib/locale-router';
import { getPublishedStations } from '@/lib/romanian/content';

type Copy = { fa: string; en: string; noteFa: string; noteEn: string; href: string };

const alphabetGroups: Array<{ titleFa: string; titleEn: string; items: Copy[] }> = [
  {
    titleFa: 'حروف الفبا: واکه، همخوان و حروف وام‌واژه', titleEn: 'The alphabet: vowels, consonants, and loan letters',
    items: [{ fa: 'هر ۳۱ حرف در یک فهرست دسته‌بندی‌شده', en: 'All 31 letters in one classified list', noteFa: 'نام حرف، صدای حرف و واژهٔ نمونه', noteEn: 'Letter name, letter sound, and sample word', href: '/learn-romanian/alfabet' }],
  },
  {
    titleFa: 'واکه‌ها و نشانه‌های ویژه', titleEn: 'Vowels and Romanian diacritics',
    items: [
      { fa: 'A', en: 'A', noteFa: 'صدای مستقل حرف و واژه‌های نمونه', noteEn: 'The letter sound on its own and sample words', href: '/learn-romanian/alfabet/a' },
      { fa: 'E', en: 'E', noteFa: 'صدای مستقل حرف و واژه‌های نمونه', noteEn: 'The letter sound on its own and sample words', href: '/learn-romanian/alfabet/e' },
      { fa: 'I', en: 'I', noteFa: 'صدای مستقل حرف و واژه‌های نمونه', noteEn: 'The letter sound on its own and sample words', href: '/learn-romanian/alfabet/i' },
      { fa: 'O', en: 'O', noteFa: 'صدای مستقل حرف و واژه‌های نمونه', noteEn: 'The letter sound on its own and sample words', href: '/learn-romanian/alfabet/o' },
      { fa: 'U', en: 'U', noteFa: 'صدای مستقل حرف و واژه‌های نمونه', noteEn: 'The letter sound on its own and sample words', href: '/learn-romanian/alfabet/u' },
      { fa: 'Ă', en: 'Ă', noteFa: 'صدای مستقل ă و نمونه‌واژه‌ها', noteEn: 'The distinct ă sound and examples', href: '/learn-romanian/alfabet/a-breve' },
      { fa: 'Â و Î', en: 'Â and Î', noteFa: 'صدای مشترک و کاربرد نوشتاری', noteEn: 'Shared sound and spelling contexts', href: '/learn-romanian/alfabet/circ-rule' },
    ],
  },
  {
    titleFa: 'همخوان‌ها و حروف وام‌واژه', titleEn: 'Consonants and loan letters',
    items: [
      { fa: 'همخوان‌های رومانیایی', en: 'Romanian consonants', noteFa: 'حرف، آوا و واژهٔ نمونه زیر یک دسته', noteEn: 'Letters, sounds, and examples in one group', href: '/learn-romanian/alfabet/consoane' },
      { fa: 'K · Q · W · Y', en: 'K · Q · W · Y', noteFa: 'حروف وام‌واژه با نمونهٔ کاربرد', noteEn: 'Loan letters with usage examples', href: '/learn-romanian/alfabet' },
    ],
  },
  {
    titleFa: 'گروه‌حرف‌های دو و سه‌حرفی', titleEn: 'Two- and three-letter patterns',
    items: [
      { fa: 'ce / ci', en: 'ce / ci', noteFa: 'صدای «چ» در واژه‌هایی مثل ceai', noteEn: 'The “ch” sound, as in ceai', href: '/learn-romanian/alfabet/ce-ci' },
      { fa: 'che / chi', en: 'che / chi', noteFa: 'صدای «ک» در واژه‌هایی مثل cheie', noteEn: 'The “k” sound, as in cheie', href: '/learn-romanian/alfabet/che-chi' },
      { fa: 'ge / gi', en: 'ge / gi', noteFa: 'صدای «ج» در واژه‌هایی مثل geam', noteEn: 'The “j” sound, as in geam', href: '/learn-romanian/alfabet/ge-gi' },
      { fa: 'ghe / ghi', en: 'ghe / ghi', noteFa: 'ترکیب سه‌حرفی برای حفظ صدای «گ»', noteEn: 'Three-letter spelling that keeps the hard “g” sound', href: '/learn-romanian/alfabet/ghe-ghi' },
    ],
  },
  {
    titleFa: 'جایگاه و املای حرف در واژه', titleEn: 'Letter position and spelling in words',
    items: [
      { fa: 'i پایانی', en: 'Final i', noteFa: 'تفاوت i شنیدنی و کم‌آوا در پایان واژه', noteEn: 'Audible and reduced i at the end of a word', href: '/learn-romanian/alfabet/i-final' },
    ],
  },
];

const coreModules: Record<string, { titleFa: string; titleEn: string; summaryFa: string; summaryEn: string }> = {
  salutari: { titleFa: 'گفت‌وگو و معرفی خود', titleEn: 'Greetings and introductions', summaryFa: 'سلام، معرفی خود، تشکر و عبارت‌های مؤدبانه.', summaryEn: 'Greetings, introductions, thanks, and polite expressions.' },
  numere: { titleFa: 'اعداد و شمارش', titleEn: 'Numbers and counting', summaryFa: 'شمارش فراتر از یک و دو در چند نوبت کوتاه.', summaryEn: 'Count beyond one and two across short sessions.' },
  timp: { titleFa: 'زمان و تقویم', titleEn: 'Time and calendar', summaryFa: 'روز، تاریخ، ساعت و بخش‌های روز.', summaryEn: 'Days, dates, clock time, and parts of the day.' },
  'cuvinte-interogative': { titleFa: 'واژه‌های پرسشی', titleEn: 'Question words', summaryFa: 'واژه‌های چه، کجا، کی، چگونه و چندتا.', summaryEn: 'What, where, when, how, and how many.' },
  pronume: { titleFa: 'ضمیرهای مفعولی و ملکی', titleEn: 'Object and possessive pronouns', summaryFa: 'پس از ضمیر فاعلی، پی‌بست‌های مفعولی و صورت‌های ملکی را یاد بگیرید.', summaryEn: 'After subject pronouns, continue with object clitics and possessive forms.' },
};

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'مسیر پایهٔ رومانیایی؛ از الفبا تا جملهٔ ساده | DORVIA' : 'Romanian Foundations: Alphabet to Simple Sentences | DORVIA',
    description: isFa ? 'مسیر دسته‌بندی‌شدهٔ الفبا، ترکیب‌حرف‌ها، واژه، ضمیر و ترتیب جمله برای ساخت جمله‌های سادهٔ رومانیایی.' : 'A classified path through the Romanian alphabet, letter patterns, words, pronouns, and sentence order.',
    robots: { index: false, follow: false },
  };
}

export default function RomanianFoundationPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as (typeof LOCALES)[number])) notFound();
  const isFa = params.lang === 'fa';
  const lang = params.lang as 'fa' | 'en';
  const stations = getPublishedStations().filter(station => station.id.startsWith('core-')).sort((a, b) => a.order - b.order);

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-7 sm:space-y-12 sm:py-10">
    <Breadcrumb items={[
      { label: isFa ? 'خانه' : 'Home', href: '/' },
      { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
      { label: isFa ? 'درس‌های پایه' : 'Foundation lessons' },
    ]} currentLang={lang} disableJsonLd />

    <header className="dark-hero-panel overflow-hidden rounded-3xl px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
      <span className="text-sm font-bold text-blue-200">{isFa ? 'مسیر پایه · هر نوبت حدود ۱۵ دقیقه' : 'Foundation path · about 15 minutes per session'}</span>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{isFa ? 'از الفبا تا ساخت جملهٔ ساده' : 'From the alphabet to a simple sentence'}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{isFa ? 'هدف این مسیر آن است که در پایان بتوانید واژه‌ها را کنار هم بگذارید و جملهٔ سادهٔ رومانیایی بسازید. نخست الفبا و همهٔ ترکیب‌های آن را یک‌جا و دسته‌بندی‌شده یاد می‌گیرید؛ سپس اسم، عدد، ضمیر، فعل و ترتیب جمله را تمرین می‌کنید.' : 'The goal is to put words together and make a simple Romanian sentence. First learn the alphabet and all its letter patterns in one classified place; then practise nouns, numbers, pronouns, verbs, and word order.'}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span lang="ro" dir="ltr" className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-lg font-bold">Eu am un bilet nou.</span>
        <span className="text-sm text-blue-100">{isFa ? 'من یک بلیت جدید دارم.' : 'I have a new ticket.'}</span>
      </div>
    </header>

    <section aria-labelledby="lesson-standard-heading" className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1554bd]">{isFa ? 'الگوی ثابت هر درس' : 'The same structure in every lesson'}</p>
          <h2 id="lesson-standard-heading" className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{isFa ? 'یک نوبت آموزشیِ ۱۵ دقیقه‌ای' : 'One 15-minute learning session'}</h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1554bd]">{isFa ? '۱۵ دقیقه پیشنهادی؛ بدون محدودیت تکرار' : 'Suggested time; repeat without a limit'}</span>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { min: 2, fa: 'هدف و یادآوری', en: 'Goal and recall', detailFa: 'بدون نگاه، دانستهٔ قبلی را به یاد بیاورید.', detailEn: 'Recall what you already know.' },
          { min: 3, fa: 'گوش‌دادن', en: 'Listen', detailFa: 'صدا و نمونه را جداگانه بشنوید.', detailEn: 'Listen to the sound and examples.' },
          { min: 4, fa: 'کشف قاعده', en: 'Notice the rule', detailFa: 'الگو را در نمونه‌ها پیدا کنید.', detailEn: 'Find the pattern in the examples.' },
          { min: 4, fa: 'نوشتن و گفتن', en: 'Write and speak', detailFa: 'پاسخ را بنویسید و بلند بگویید.', detailEn: 'Write your answer and say it aloud.' },
          { min: 2, fa: 'مرور', en: 'Review', detailFa: 'نتیجه را ببینید و نکته را مرور کنید.', detailEn: 'Check your result and review.' },
        ].map((step, index) => <li key={step.en} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
          <span className="text-xs font-extrabold text-[#1554bd]">{isFa ? `${step.min} دقیقه` : `${step.min} min`}</span>
          <h3 className="mt-2 font-bold text-slate-900">{isFa ? step.fa : step.en}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">{isFa ? step.detailFa : step.detailEn}</p>
        </li>)}
      </ol>
      <p className="mt-4 text-xs leading-5 text-slate-500">{isFa ? 'موضوع بزرگی مثل الفبا یا اعداد چند نوبت دارد؛ هر درس یا گام را جداگانه در حدود ۱۵ دقیقه انجام می‌دهید. این زمان سقف مطالعه نیست.' : 'Large topics such as the alphabet or numbers contain multiple sessions. Complete each lesson or step in about 15 minutes; this is not a study limit.'}</p>
    </section>

    <section id="alphabet" aria-labelledby="alphabet-heading" className="scroll-mt-24 space-y-6 rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm sm:p-8">
      <header className="flex flex-col gap-4 border-b border-blue-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1554bd]">{isFa ? 'بخش ۱ · یک باکس برای کل الفبا' : 'PART 1 · ONE HOME FOR THE WHOLE ALPHABET'}</p>
          <h2 id="alphabet-heading" className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{isFa ? 'الفبا، صداها و گروه‌حرف‌ها' : 'Alphabet, sounds, and letter groups'}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{isFa ? 'حروف تکی و ترکیب‌های دو و سه‌حرفی همگی زیر همین بخش قرار دارند. گروه‌حرف‌ها حرف تازه‌ای به الفبا نیستند؛ آن‌ها را کنار حروف و بر اساس الگوی صدا دسته‌بندی کرده‌ایم.' : 'Single letters and two- or three-letter patterns all belong in this section. Patterns are not extra alphabet letters; they are grouped with the alphabet by sound.'}</p>
        </div>
        <Link href="/learn-romanian/alfabet" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#1554bd] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">{isFa ? 'بازکردن الفبای کامل ←' : 'Open the full alphabet →'}</Link>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {alphabetGroups.map((group, groupIndex) => <section key={group.titleEn} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5" aria-labelledby={`alphabet-group-${groupIndex}`}>
          <h3 id={`alphabet-group-${groupIndex}`} className="font-extrabold text-slate-900">{isFa ? group.titleFa : group.titleEn}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {group.items.map(item => <Link key={item.href + item.fa} href={item.href} className="group rounded-xl border border-white bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
              <div className="flex items-start justify-between gap-2">
                <span lang="ro" dir="ltr" className="font-extrabold text-[#1554bd]">{isFa ? item.fa : item.en}</span>
                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-[#1554bd]">{isFa ? '۱۵ دقیقه' : '15 min'}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600">{isFa ? item.noteFa : item.noteEn}</p>
            </Link>)}
          </div>
        </section>)}
      </div>
      <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">{isFa ? 'در درس الفبای کامل، فیلترهای واکه، همخوان و وام‌واژه همهٔ ۳۱ حرف را نشان می‌دهند؛ درس‌های ce/ci، che/chi، ge/gi و ghe/ghi هم از همین بخش قابل دسترسی‌اند.' : 'The full alphabet lesson filters all 31 letters by vowel, consonant, and loan letter; ce/ci, che/chi, ge/gi, and ghe/ghi are available from this same section.'}</p>
    </section>

    <section aria-labelledby="sentence-foundations-heading" className="space-y-5">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">{isFa ? 'بخش ۲ · مسیر جمله‌سازی' : 'PART 2 · THE SENTENCE-BUILDING PATH'}</p>
        <h2 id="sentence-foundations-heading" className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{isFa ? 'این درس‌ها را به ترتیب پیش ببرید' : 'Follow these lessons in order'}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{isFa ? 'هر درس حدود ۱۵ دقیقه است و یک مهارت را اضافه می‌کند. ترتیب از اسم و فاعل شروع می‌شود، به فعل و صفت می‌رسد و با ساخت جملهٔ کامل پایان می‌یابد.' : 'Each lesson takes about 15 minutes and adds one skill. Start with nouns and subjects, move to verbs and adjectives, and finish by building a complete sentence.'}</p>
      </div>
      <ol className="grid gap-4 md:grid-cols-2">
        <li><LessonCard lang={lang} number="۱" numberEn="1" href="/learn-romanian/lectie/un-o-doi-doua" titleFa="اسم، جنس و شمار" titleEn="Nouns, gender, and number" noteFa="با un / o و doi / două اسم مذکر، مؤنث و خنثی را بسازید؛ پایهٔ انتخاب صفت هم همین‌جاست." noteEn="Build masculine, feminine, and neuter noun phrases with un / o and doi / două." /></li>
        <li><LessonCard lang={lang} number="۲" numberEn="2" href="/learn-romanian/modul/pronume#step-pron-1-subject" titleFa="ضمیر فاعلی و حذف ضمیر" titleEn="Subject pronouns and omission" noteFa="eu، tu، el/ea و دیگر فاعل‌ها را بشناسید و ببینید چه وقت فعل اجازه می‌دهد ضمیر حذف شود." noteEn="Learn eu, tu, el/ea, and other subjects, and when the verb lets you omit the pronoun." /></li>
        <li><LessonCard lang={lang} number="۳" numberEn="3" href="/learn-romanian/fundamente/fi-avea" titleFa="فعل‌های بودن و داشتن" titleEn="The verbs to be and to have" noteFa="a fi و a avea را در زمان حال صرف کنید و فعل را با فاعل هماهنگ کنید." noteEn="Conjugate a fi and a avea in the present and match each form to its subject." /></li>
        <li><LessonCard lang={lang} number="۴" numberEn="4" href="/learn-romanian/fundamente/sifat" titleFa="صفت و هماهنگی با اسم" titleEn="Adjectives and noun agreement" noteFa="جای معمول صفت و تغییر شکل آن بر اساس جنس و شمار اسم را تمرین کنید." noteEn="Practise the usual adjective position and match its form to the noun." /></li>
        <li className="md:col-span-2"><LessonCard lang={lang} number="۵" numberEn="5" href="/learn-romanian/fundamente/sakht-jomle" titleFa="ترتیب جمله و جمله‌سازی" titleEn="Sentence order and building" noteFa="فاعل، فعل، مفعول، صفت، قید و منفی‌سازی را کنار هم بگذارید و جملهٔ ساده بسازید." noteEn="Combine subjects, verbs, objects, adjectives, adverbs, and negation to make simple sentences." featured /></li>
      </ol>
      <p className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-sm leading-6 text-violet-950">{isFa ? 'معیار پایان این بخش: بتوانید جمله‌ای مانند «Eu am un bilet nou.» را بخوانید، اجزایش را تشخیص دهید، بنویسید و با صدای بلند بگویید.' : 'End goal: read a sentence such as “Eu am un bilet nou.”, identify its parts, write it, and say it aloud.'}</p>
    </section>

    <section aria-labelledby="sentence-order-outcome" className="overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">{isFa ? 'نتیجهٔ مسیر پایه' : 'FOUNDATION PATH OUTCOME'}</p>
          <h2 id="sentence-order-outcome" className="mt-1 text-2xl font-extrabold text-slate-900">{isFa ? 'در پایان، جملهٔ ساده می‌سازید' : 'Finish by building simple sentences'}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{isFa ? 'ترتیب معمول فاعل + فعل + مفعول، جای صفت پس از اسم، هماهنگی صفت با اسم، جای قید، و جای «نه» را در جمله تمرین می‌کنید.' : 'Practise the usual subject + verb + object order, adjectives after nouns and agreement, adverb placement, and where “not” goes.'}</p>
          <p className="mt-4 text-2xl font-extrabold text-emerald-950" lang="ro" dir="ltr">Eu am un bilet nou.</p>
          <p className="text-sm text-emerald-900" lang="fa">من یک بلیت جدید دارم.</p>
        </div>
        <Link href="/learn-romanian/fundamente/sakht-jomle" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900">{isFa ? 'رفتن به درس جمله‌سازی ←' : 'Open the sentence lesson →'}</Link>
      </div>
    </section>

    <section aria-labelledby="more-core-heading" className="space-y-5 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-7">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">{isFa ? 'بخش ۳ · ادامهٔ پایه پس از جمله‌سازی' : 'PART 3 · CONTINUE AFTER YOUR FIRST SENTENCES'}</p>
        <h2 id="more-core-heading" className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{isFa ? 'درس‌های پایهٔ بعدی' : 'Continue with other foundations'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{isFa ? 'این‌ها برای گسترش مکالمه‌اند، نه پیش‌نیاز جملهٔ نخست. هر گام را در یک نوبت حدود ۱۵ دقیقه‌ای بخوانید؛ ترتیب همان ترتیب کارت‌هاست.' : 'These modules extend your conversations; they are not prerequisites for your first sentence. Take one step in each 15-minute session, in the order shown.'}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((station, index) => {
          const copy = coreModules[station.slug];
          if (!copy) return null;
          return <Link key={station.id} href={`/learn-romanian/modul/${station.slug}`} className="group rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold text-indigo-700">{isFa ? `درس هسته ${'۰۱۲۳۴۵۶۷۸۹'[index + 1]}` : `CORE ${String(index + 1).padStart(2, '0')}`}</span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">{isFa ? 'هر گام ۱۵ دقیقه' : '15 min per step'}</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 group-hover:text-indigo-700">{isFa ? copy.titleFa : copy.titleEn}</h3>
            <p lang="ro" dir="ltr" className="mt-1 text-xs text-slate-400">{station.titleRo}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{isFa ? copy.summaryFa : copy.summaryEn}</p>
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-bold text-indigo-700">{isFa ? `${station.stepCount} گام آموزشی · بازکردن درس ←` : `${station.stepCount} learning steps · Open module →`}</p>
          </Link>;
        })}
      </div>
    </section>

    <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
      <Link href="/learn-romanian" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300">{isFa ? 'بازگشت به همهٔ آموزش‌ها' : 'Back to all lessons'}</Link>
      <Link href="/learn-romanian/lectie/bilet" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300">{isFa ? 'تمرین گفت‌وگوی بلیت' : 'Practise the ticket dialogue'}</Link>
    </div>
  </main>;
}

function LessonCard({ lang, number, numberEn, href, titleFa, titleEn, noteFa, noteEn, featured = false }: {
  lang: 'fa' | 'en'; number: string; numberEn: string; href: string; titleFa: string; titleEn: string; noteFa: string; noteEn: string; featured?: boolean;
}) {
  const isFa = lang === 'fa';
  return <Link href={href} className={`group flex min-h-44 flex-col rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${featured ? 'border-violet-300 bg-violet-50 hover:border-violet-500 focus-visible:outline-violet-700' : 'border-slate-200 bg-white hover:border-blue-300 focus-visible:outline-[#1554bd]'}`}>
    <div className="flex items-center justify-between gap-2">
      <span className={`text-xs font-extrabold ${featured ? 'text-violet-800' : 'text-[#1554bd]'}`}>{isFa ? `درس ${number}` : `LESSON ${numberEn}`}</span>
      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600">{isFa ? 'حدود ۱۵ دقیقه' : 'About 15 min'}</span>
    </div>
    <h3 className="mt-3 text-lg font-extrabold text-slate-900 group-hover:text-[#1554bd]">{isFa ? titleFa : titleEn}</h3>
    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? noteFa : noteEn}</p>
    <span className={`mt-4 text-xs font-bold ${featured ? 'text-violet-800' : 'text-[#1554bd]'}`}>{isFa ? 'رفتن به درس ←' : 'Open lesson →'}</span>
  </Link>;
}

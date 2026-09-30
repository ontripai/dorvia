import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { LOCALES } from '@/lib/locale-router';

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

const newPath = [
  { slug: 'moarefe', fa: 'سلام و معرفی خود', en: 'Greetings and introductions', noteFa: 'سلام، نام، کشور، شغل و خطاب محترمانه را در جمله یاد بگیرید.', noteEn: 'Use greetings, your name, country, job, and polite address in sentences.' },
  { slug: 'porsesh', fa: 'سؤال‌سازی و پاسخ کوتاه', en: 'Questions and short answers', noteFa: 'با چه کسی، چه، کجا و چگونه سؤال بپرسید و پاسخ دهید.', noteEn: 'Ask and answer who, what, where, and how questions.' },
  { slug: 'nafi', fa: 'منفی‌سازی', en: 'Negation', noteFa: 'جای nu را یاد بگیرید و پاسخ مثبت و منفی بدهید.', noteEn: 'Place nu correctly and give positive and negative answers.' },
  { slug: 'articole', fa: 'اسم نامعین و معین', en: 'Indefinite and definite nouns', noteFa: 'فرق un bilet با biletul و کاربرد o و niște را تمرین کنید.', noteEn: 'Distinguish un bilet from biletul and practise o and niște.' },
  { slug: 'verbe', fa: 'فعل‌های روزمره در زمان حال', en: 'Everyday present-tense verbs', noteFa: 'رفتن، زندگی‌کردن، صحبت‌کردن و انجام‌دادن را در جمله به کار ببرید.', noteEn: 'Use go, live, speak, and do in sentences.' },
  { slug: 'locatie', fa: 'مکان و حروف اضافه', en: 'Places and prepositions', noteFa: 'با در، روی، کنار، زیر و به، جای چیزها و مقصد را بگویید.', noteEn: 'Describe positions and destinations using in, on, beside, under, and to.' },
  { slug: 'numere-pret', fa: 'عدد، مقدار و قیمت', en: 'Numbers, quantities, and prices', noteFa: 'تعداد را با جنس اسم هماهنگ کنید و قیمت بپرسید.', noteEn: 'Match quantities to noun gender and ask prices.' },
  { slug: 'timp-sade', fa: 'روز، ساعت و قید زمان', en: 'Days, clock time, and time words', noteFa: 'امروز، فردا و ساعت انجام کار را بگویید و بپرسید.', noteEn: 'Say and ask when something happens.' },
] as const;

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

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-7 sm:space-y-12 sm:py-10">
    <Breadcrumb items={[
      { label: isFa ? 'خانه' : 'Home', href: '/' },
      { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
      { label: isFa ? 'درس‌های پایه' : 'Foundation lessons' },
    ]} currentLang={lang} disableJsonLd />

    <header className="dark-hero-panel overflow-hidden rounded-3xl px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
      <span className="text-sm font-bold text-blue-200">{isFa ? 'مسیر پایه · هر نوبت حدود ۱۵ دقیقه' : 'Foundation path · about 15 minutes per session'}</span>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{isFa ? 'از الفبا تا ساخت جملهٔ ساده' : 'From the alphabet to a simple sentence'}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{isFa ? 'هدف این مسیر آن است که در پایان بتوانید واژه‌ها را کنار هم بگذارید و جملهٔ سادهٔ رومانیایی بسازید. نخست الفبا و همهٔ ترکیب‌های آن را یک‌جا و دسته‌بندی‌شده یاد می‌گیرید؛ سپس معرفی، پرسش، منفی‌سازی، اسم، فعل، مکان، عدد و زمان را در جمله تمرین می‌کنید.' : 'The goal is to put words together and make a simple Romanian sentence. First learn the alphabet and all its letter patterns in one classified place; then practise introductions, questions, negation, nouns, verbs, places, numbers, and time in sentences.'}</p>
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
        <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">{isFa ? 'بخش ۲ · مسیر تازهٔ درس‌های پایه' : 'PART 2 · NEW FOUNDATION PATH'}</p>
        <h2 id="sentence-foundations-heading" className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{isFa ? 'هشت درس، به ترتیب کاربرد' : 'Eight lessons in practical order'}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{isFa ? 'هر کارت یک درس مستقل دارد: ابتدا درسنامهٔ کامل، سپس شنیدن، قاعده، نوشتن و گفتن در یک نوبت پیشنهادی ۱۵ دقیقه‌ای. در پایان، آموخته‌ها را در درس جمله‌سازی به هم وصل می‌کنید.' : 'Each card opens a complete reference followed by listening, rules, writing, and speaking in a suggested 15-minute session. The final lesson brings the skills together.'}</p>
      </div>
      <ol className="grid gap-4 md:grid-cols-2">
        {newPath.map((item,index)=><li key={item.slug}><LessonCard lang={lang} number={'۰۱۲۳۴۵۶۷۸۹'[index+1]} numberEn={String(index+1)} href={`/learn-romanian/fundamente/${item.slug}`} titleFa={item.fa} titleEn={item.en} noteFa={item.noteFa} noteEn={item.noteEn} /></li>)}
        <li className="md:col-span-2"><LessonCard lang={lang} number="۹" numberEn="9" href="/learn-romanian/fundamente/sakht-jomle" titleFa="جمع‌بندی: ترتیب جمله و جمله‌سازی" titleEn="Final practice: sentence order" noteFa="فاعل، فعل، مفعول، صفت و قید را کنار هم بگذارید؛ جملهٔ خبری، منفی و پرسشی بسازید." noteEn="Combine subjects, verbs, objects, adjectives, and adverbs; build statements, negatives, and questions." featured /></li>
      </ol>
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

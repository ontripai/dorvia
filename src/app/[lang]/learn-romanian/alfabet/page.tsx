import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { getPublishedGraphemes, getWordById } from '@/lib/romanian/content';
import { AlphabetExplorer } from '@/components/romanian/AlphabetExplorer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

const groups = [
  { category: 'vowels', letters: [['A a', 'a'], ['Ă ă', 'a-breve'], ['Â â', 'a-circ'], ['E e', 'e'], ['I i', 'i'], ['Î î', 'a-circ'], ['O o', 'o'], ['U u', 'u']] },
  { category: 'consonants', letters: [['B b', 'consoane'], ['C c', 'c-hard'], ['D d', 'consoane'], ['F f', 'consoane'], ['G g', 'g-hard'], ['H h', 'h'], ['J j', 'j'], ['L l', 'consoane'], ['M m', 'consoane'], ['N n', 'consoane'], ['P p', 'consoane'], ['R r', 'r'], ['S s', 's'], ['Ș ș', 's-comma'], ['T t', 'consoane'], ['Ț ț', 't-comma'], ['V v', 'v'], ['X x', 'x'], ['Z z', 'consoane']] },
  { category: 'loans', letters: [['K k', 'k'], ['Q q', 'q'], ['W w', 'w'], ['Y y', 'y']] },
] as const;

const patterns = [
  { label: 'ce / ci', slug: 'ce-ci', fa: 'صدای چ · ceai', en: 'ch sound · ceai' },
  { label: 'che / chi', slug: 'che-chi', fa: 'صدای ک · cheie', en: 'k sound · cheie' },
  { label: 'ge / gi', slug: 'ge-gi', fa: 'صدای ج · geam', en: 'j sound · geam' },
  { label: 'ghe / ghi', slug: 'ghe-ghi', fa: 'صدای گ · ghișeu', en: 'hard g · ghișeu' },
] as const;

const additionalExamples: Record<string, { word: string; fa: string; en: string }> = {
  'B b': { word: 'bilet', fa: 'بلیت', en: 'ticket' },
  'D d': { word: 'card', fa: 'کارت', en: 'card' },
  'F f': { word: 'telefon', fa: 'تلفن', en: 'phone' },
  'L l': { word: 'elev', fa: 'دانش‌آموز', en: 'pupil' },
  'M m': { word: 'masă', fa: 'میز', en: 'table' },
  'N n': { word: 'ban', fa: 'واحد پول', en: 'monetary unit' },
  'P p': { word: 'apă', fa: 'آب', en: 'water' },
  'T t': { word: 'taxi', fa: 'تاکسی', en: 'taxi' },
  'Z z': { word: 'zi', fa: 'روز', en: 'day' },
  'K k': { word: 'kilometru', fa: 'کیلومتر', en: 'kilometre' },
  'Q q': { word: 'quasar', fa: 'اختروش', en: 'quasar' },
  'W w': { word: 'weekend', fa: 'آخر هفته', en: 'weekend' },
  'Y y': { word: 'yoga', fa: 'یوگا', en: 'yoga' },
};

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'الفبا و درس‌های تلفظ رومانیایی | DORVIA' : 'Romanian Alphabet Lessons | DORVIA',
    description: isFa ? '۳۱ حرف رومانیایی، گروه‌حرف‌های C و G، واژهٔ نمونه و تمرین نوشتن و گفتن.' : 'Explore 31 Romanian letters, C/G spelling patterns, example words, writing and speaking practice.',
    robots: { index: false, follow: false },
  };
}

export default function RomanianAlphabetIndexPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as any)) notFound();
  const lang = params.lang as 'fa' | 'en';
  const isFa = lang === 'fa';
  const graphemes = getPublishedGraphemes();
  const letters = groups.flatMap(group => group.letters.map(([glyph, slug]) => {
    const sound = graphemes.find(entry => entry.slug === slug);
    const word = glyph === 'Î î' ? getWordById('w-inainte') : sound && getWordById(sound.exampleWordId);
    const extra = additionalExamples[glyph];
    return {
      glyph, slug, category: group.category,
      example: extra?.word || (glyph === 'Î î' ? word?.lemma : sound?.exampleForm || word?.lemma),
      translation: extra?.[lang] || word?.translations[lang],
      hint: slug === 'consoane' ? (isFa ? 'درس مشترک همخوان‌ها' : 'Shared consonant lesson') : undefined,
    };
  }));

  return <main className="mx-auto max-w-6xl space-y-12 px-4 py-7 sm:py-10">
    <Breadcrumb items={[
      { label: isFa ? 'خانه' : 'Home', href: '/' },
      { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
      { label: isFa ? 'الفبا و صداها' : 'Alphabet and sounds' },
    ]} currentLang={lang} disableJsonLd />

    <header className="dark-hero-panel overflow-hidden rounded-3xl px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
      <p className="text-sm font-semibold text-blue-200">{isFa ? 'مسیر پایه · درس‌های کوتاه و قابل تکرار' : 'Foundation path · short, repeatable lessons'}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{isFa ? 'از دیدن حرف تا ساختن واژه' : 'From letters to usable words'}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">{isFa ? 'یک حرف را انتخاب کنید، نام آن را بشنوید، صدایش را در واژه پیدا کنید، بنویسید و بلند بگویید. اگر میکروفون در دسترس باشد، پاسخ گفتاری شما هم به متن تبدیل می‌شود. هر درس را هر چند بار خواستید مرور کنید.' : 'Choose a letter, hear its name, find its sound in a word, write it, and say it aloud. If a microphone is available, speech recognition can transcribe your response. Repeat a lesson as often as you like.'}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/learn-romanian/alfabet/a" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1554bd] hover:bg-blue-50">{isFa ? 'شروع از A' : 'Start with A'}</Link>
        <a href="#letters" className="rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">{isFa ? 'انتخاب حرف' : 'Choose a letter'}</a>
      </div>
      <p className="mt-5 text-xs text-blue-100">{isFa ? '۳۱ حرف · ۴ گروه‌حرف کاربردی · صدای مرورگر برای واژهٔ نوشته‌شده' : '31 letters · 4 useful C/G patterns · browser voice reads the displayed word'}</p>
    </header>

    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { n: '۱', enN: '1', fa: 'یک حرف یا گروه‌حرف انتخاب کنید', en: 'Pick a letter or pattern' },
        { n: '۲', enN: '2', fa: 'واژه و قاعدهٔ آن را ببینید', en: 'Explore the word and rule' },
        { n: '۳', enN: '3', fa: 'بنویسید، بگویید و تکرار کنید', en: 'Write, speak and repeat' },
      ].map(item => <div key={item.enN} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-blue-50 font-extrabold text-[#1554bd]">{isFa ? item.n : item.enN}</span>
        <p className="mt-3 text-sm font-semibold text-slate-800">{isFa ? item.fa : item.en}</p>
      </div>)}
    </div>

    <section id="alphabet-curriculum" aria-labelledby="alphabet-curriculum-heading" className="space-y-8 rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm sm:p-8">
      <header>
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#1554bd]">{isFa ? 'یک بخش · همهٔ حروف و ترکیب‌ها' : 'One section · all letters and patterns'}</p>
        <h2 id="alphabet-curriculum-heading" className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{isFa ? 'الفبا را دسته‌بندی‌شده کامل کنید' : 'Complete the alphabet in clear groups'}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{isFa ? 'همهٔ حروف تکی، واکه‌ها، همخوان‌ها، حروف وام‌واژه و گروه‌حرف‌های دو و سه‌حرفی در همین بخش قرار دارند. هر درس صدا و واژهٔ نمونهٔ خودش را دارد.' : 'Single letters, vowels, consonants, loan letters, and two- or three-letter patterns all live in this section. Each lesson includes its own sound and sample word.'}</p>
      </header>
      <AlphabetExplorer letters={letters} lang={lang} />

    <section id="patterns" className="scroll-mt-24 space-y-4" aria-labelledby="patterns-heading">
      <div><p className="text-xs font-bold uppercase tracking-wider text-[#1554bd]">{isFa ? 'زیرگروه · ترکیب‌حرف‌ها' : 'Alphabet subgroup · letter patterns'}</p>
        <h2 id="patterns-heading" className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{isFa ? 'گروه‌حرف‌های دو و سه‌حرفی' : 'Two- and three-letter patterns'}</h2>
        <p className="mt-2 text-sm text-slate-600">{isFa ? 'این ترکیب‌ها حرف تازهٔ الفبا نیستند. تفاوت صدای آن‌ها را با واژه و تمرین یاد بگیرید.' : 'These patterns are not extra alphabet letters. Learn the sound differences through words and practice.'}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{patterns.map(pattern => <Link key={pattern.slug} href={`/learn-romanian/alfabet/${pattern.slug}`} className="group rounded-2xl border border-blue-200 bg-blue-50 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
        <strong lang="ro" dir="ltr" className="block text-2xl text-[#1554bd]">{pattern.label}</strong>
        <span className="mt-2 block text-sm text-slate-700">{isFa ? pattern.fa : pattern.en}</span>
        <span className="mt-4 block text-xs font-bold text-[#1554bd] group-hover:underline">{isFa ? 'تمرین این ترکیب ←' : 'Practise this pattern →'}</span>
      </Link>)}</div>
    </section>

    <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2 sm:p-8">
      <div><h2 className="text-xl font-bold text-slate-900">{isFa ? 'بعد از حروف چه بخوانم؟' : 'What comes after letters?'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{isFa ? 'تفاوت جایگاه i پایانی و قاعدهٔ نوشتن â/î را جدا مرور کنید؛ سپس سراغ جمله‌ها و موقعیت‌های روزمره بروید.' : 'Explore word-final i and the â/î spelling rule separately, then move to useful sentences and everyday situations.'}</p></div>
      <div className="flex flex-col gap-2">
        <Link href="/learn-romanian/alfabet/i-final" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1554bd] hover:bg-blue-50">{isFa ? 'i پایانی در واژه‌ها ←' : 'Word-final i →'}</Link>
        <Link href="/learn-romanian/alfabet/circ-rule" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1554bd] hover:bg-blue-50">{isFa ? 'قاعدهٔ نوشتن â و î ←' : 'The â and î spelling rule →'}</Link>
        <Link href="/learn-romanian" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1554bd] hover:bg-blue-50">{isFa ? 'مسیر کامل آموزش ←' : 'Full learning path →'}</Link>
      </div>
    </section>

    <p className="text-xs leading-6 text-slate-500">{isFa ? 'حروف K، Q، W و Y نیز جزو ۳۱ حرف‌اند و بیشتر در نام‌ها و وام‌واژه‌ها دیده می‌شوند. â و î دو حرف جدا با صدای مشترک‌اند. صدای مصنوعی مرورگر ضبط گوینده یا ارزیابی تلفظ نیست.' : 'K, Q, W and Y are part of the 31 letters and occur mostly in names and loans. Â and î are separate letters with a shared sound. Browser speech is neither a verified recording nor pronunciation assessment.'} <a href="https://doom.lingv.ro/studiu_introductiv_complet" target="_blank" rel="noopener noreferrer" className="text-[#1554bd] underline">DOOM3</a></p>
    </section>
  </main>;
}

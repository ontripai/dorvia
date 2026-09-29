import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import { getPublishedGraphemes, getWordById } from '@/lib/romanian/content';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight } from '@/components/Icons';

// Official alphabetical order (DOOM3). A sound lesson can teach several letters,
// and a letter can require more than one lesson; neither count is an alphabet count.
const alphabetGroups = [
  { fa: 'واکه‌ها', en: 'Vowels', letters: [
    ['A a', 'a'], ['Ă ă', 'a-breve'], ['Â â', 'a-circ'], ['E e', 'e'],
    ['I i', 'i'], ['Î î', 'a-circ'], ['O o', 'o'], ['U u', 'u'],
  ] },
  { fa: 'همخوان‌ها', en: 'Consonants', letters: [
    ['B b', 'consoane'], ['C c', 'c-hard'], ['D d', 'consoane'], ['F f', 'consoane'],
    ['G g', 'g-hard'], ['H h', 'h'], ['J j', 'j'], ['L l', 'consoane'],
    ['M m', 'consoane'], ['N n', 'consoane'], ['P p', 'consoane'], ['R r', 'r'],
    ['S s', 's'], ['Ș ș', 's-comma'], ['T t', 'consoane'], ['Ț ț', 't-comma'],
    ['V v', 'v'], ['X x', 'x'], ['Z z', 'consoane'],
  ] },
  { fa: 'حروف بیشتر در وام‌واژه‌ها و نام‌ها', en: 'Letters common in loans and names', letters: [
    ['K k', 'k'], ['Q q', 'q'], ['W w', 'w'], ['Y y', 'y'],
  ] },
] as const;

const soundGroups = [
  { fa: 'واکه‌ها و نشانه‌های ویژه', en: 'Vowels and distinctive letters', orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { fa: 'صدای C و G با دو و سه حرف', en: 'C and G in two and three-letter patterns', orders: [11, 12, 13, 14, 15, 16] },
  { fa: 'همخوان‌های دیگر', en: 'Other consonants', orders: [17, 18, 19, 20, 21, 22, 24] },
  { fa: 'تغییر صدا در جایگاه واژه', en: 'Sound changes by word position', orders: [23] },
] as const;

const pairedPatterns = [
  { label: 'ce / ci', slug: 'ce-ci', fa: 'صدای «چ»؛ مانند ceai', en: 'ch sound; as in ceai' },
  { label: 'che / chi', slug: 'che-chi', fa: 'صدای «ک»؛ h صدای جدا ندارد؛ مانند cheie', en: 'k sound; h has no separate sound; as in cheie' },
  { label: 'ge / gi', slug: 'ge-gi', fa: 'صدای «ج»؛ مانند geam', en: 'j sound; as in geam' },
  { label: 'ghe / ghi', slug: 'ghe-ghi', fa: 'صدای «گ»؛ h صدای جدا ندارد؛ مانند ghișeu', en: 'hard g; h has no separate sound; as in ghișeu' },
] as const;

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const isFa = params.lang === 'fa';
  return {
    title: isFa
      ? 'الفبا و تلفظ زبان رومانیایی | DORVIA'
      : 'Romanian Alphabet & Pronunciation | DORVIA',
    description: isFa
      ? 'راهنمای جامع حروف، صداها و تلفظ صحیح زبان رومانیایی به همراه فایل‌های صوتی بومی.'
      : 'Comprehensive guide to Romanian letters, sounds, and pronunciation with native audio.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RomanianAlphabetIndexPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';
  const graphemes = getPublishedGraphemes();
  const ArrowIcon = isFa ? ArrowRight : ArrowLeft;

  const toFaDigits = (n: number | string) =>
    String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: isFa ? 'صفحه اصلی' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & Pronunciation' },
        ]}
        currentLang={currentLang}
        disableJsonLd={true}
      />

      {/* Header Panel */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Link
            href="/learn-romanian"
            className="hover:text-white transition-colors underline decoration-dotted inline-flex items-center gap-1"
          >
            <ArrowIcon className="w-3.5 h-3.5" />
            <span>{isFa ? 'بازگشت به آموزش رومانیایی' : 'Back to Learn Romanian'}</span>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading">
            {isFa ? 'الفبا و آواهای زبان رومانیایی' : 'Romanian Alphabet & Phonetics'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isFa
              ? 'الفبای رومانیایی ۳۱ حرف دارد. فهرست کامل حروف را در پایین می‌بینید؛ ۲۴ درس صوتی کنونی چند حرف و الگوی نوشتاری را با هم آموزش می‌دهند. درس هر حرف با خود حرف یکی نیست و برخی بخش‌ها هنوز به نمونه‌های بیشتری نیاز دارند.'
              : 'The Romanian alphabet has 31 letters. Below is the complete letter inventory and 24 current sound lessons; some lessons combine letters or spelling patterns and still need more examples.'}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 font-medium">
            {isFa ? '۳۱ حرف · ۲۴ درس آوایی' : '31 letters · 24 sound lessons'}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
            {isFa ? 'صوت آزاد و عمومی' : 'Free Public Audio'}
          </span>
        </div>
      </div>

      <section className="space-y-4" aria-labelledby="letter-inventory">
        <h2 id="letter-inventory" className="text-2xl font-bold">{isFa ? 'فهرست کامل حروف' : 'Complete letter inventory'}</h2>
        <p className="text-sm text-slate-700">{isFa ? 'ترتیب حروف مطابق DOOM3 است. روی هر حرف بزنید تا درس مرتبط را ببینید. چهار درس K/Q/W/Y فعلاً صوت ضبط‌شده ندارند و این موضوع در خود درس مشخص است.' : 'Letters follow DOOM3 alphabetical order. Open a lesson for each letter. The four K/Q/W/Y lessons currently have no verified recorded audio, as marked on each page.'}</p>
        {alphabetGroups.map(group => <div key={group.en} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <h3 className="font-bold text-lg">{isFa ? group.fa : group.en} <span className="text-sm font-normal text-slate-500">({isFa ? toFaDigits(group.letters.length) : group.letters.length})</span></h3>
          <div className="flex flex-wrap gap-2" dir="ltr">{group.letters.map(([letter, slug]) => slug ? <Link key={letter} href={`/learn-romanian/alfabet/${slug}`} lang="ro" className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-semibold text-[#1554bd] hover:bg-blue-100">{letter}</Link> : <a key={letter} href="#borrowed-letters" lang="ro" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100">{letter}</a>)}</div>
        </div>)}
        <p className="text-sm text-slate-600">{isFa ? 'ă، â، î، ș و ț حرف‌های مستقل‌اند؛ ce/ci و che/chi گروه‌حرف‌اند، نه حرف تازه. â و î یک آوا را با دو املا نشان می‌دهند. K/Q/W/Y بیشتر در وام‌واژه‌ها و نام‌ها دیده می‌شوند.' : 'Ă, Â, Î, Ș and Ț are separate letters. Ce/ci and che/chi are letter patterns, not extra letters. Â and Î usually represent the same sound. K/Q/W/Y occur mainly in loans and names.'}</p>
        <a href="https://doom.lingv.ro/studiu_introductiv_complet" target="_blank" rel="noopener noreferrer" className="text-sm text-[#1554bd] underline">{isFa ? 'منبع معیار: فرهنگ DOOM3 فرهنگستان رومانی' : 'Reference: Romanian Academy DOOM3'}</a>
      </section>

      <section className="space-y-3" aria-labelledby="paired-patterns">
        <h2 id="paired-patterns" className="text-2xl font-bold">{isFa ? 'چهار گروه‌حرف ضروری C و G' : 'Four essential C/G letter patterns'}</h2>
        <p className="text-sm text-slate-700">{isFa ? 'این‌ها حروف جدید الفبا نیستند. تفاوت ce با che و ge با ghe را بشنوید و در هر درس، واژه و قاعده را تمرین کنید.' : 'These are spelling patterns, not extra alphabet letters. Compare ce with che and ge with ghe, then practise the word and rule in each lesson.'}</p>
        <div className="grid gap-3 sm:grid-cols-2">{pairedPatterns.map(pattern => <Link key={pattern.slug} href={`/learn-romanian/alfabet/${pattern.slug}`} className="rounded-xl border border-blue-200 bg-blue-50 p-4 hover:bg-blue-100">
          <strong lang="ro" dir="ltr" className="block text-2xl text-[#1554bd]">{pattern.label}</strong>
          <span className="text-sm text-slate-700">{isFa ? pattern.fa : pattern.en}</span>
        </Link>)}</div>
      </section>

      <section id="borrowed-letters" className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h2 className="text-xl font-bold">{isFa ? 'چهار حرف وام‌واژه‌ها: K، Q، W، Y' : 'Four letters in loans: K, Q, W, Y'}</h2>
        <p className="text-sm">{isFa ? 'این چهار حرف جزو همان ۳۱ حرف‌اند. در وام‌واژه‌ها، نام‌های خاص و بعضی واژه‌های بین‌المللی به کار می‌روند. تلفظشان را از خود واژه و زبان مبدأ یاد می‌گیریم؛ برای W، Y و ترکیب QU یک صدای ثابت به همهٔ واژه‌ها نسبت نمی‌دهیم.' : 'These four belong to the same 31-letter alphabet. They occur in loans, proper names and international words. Learn pronunciation word by word; W, Y and QU do not have one universal sound in all loans.'}</p>
        <div className="flex flex-wrap gap-3" dir="ltr" lang="ro">{[['K k', 'ka / kapa'], ['Q q', 'kü'], ['W w', 'dublu ve'], ['Y y', 'i grec']].map(([letter, name]) => <div key={letter} className="rounded-lg bg-slate-50 p-3 min-w-28"><strong>{letter}</strong><p className="text-sm text-slate-600">{name}</p></div>)}</div>
        <p className="text-xs text-slate-600">{isFa ? 'نام حروف و کاربردشان مطابق DOOM3 است. درس واژه‌محور هر چهار حرف موجود است؛ ضبط و تأیید صوت مستقل هنوز باقی است.' : 'Names and usage follow DOOM3. All four have word-based lessons; verified recordings are still pending.'}</p>
      </section>

      <section className="space-y-6" aria-labelledby="sound-lessons">
      <h2 id="sound-lessons" className="text-2xl font-bold">{isFa ? 'درس‌ها بر پایهٔ نوع صدا و ترکیب' : 'Lessons by sound and spelling pattern'}</h2>
      {soundGroups.map(group => <div key={group.en} className="space-y-3">
      <h3 className="text-lg font-bold">{isFa ? group.fa : group.en}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {graphemes.filter(g => (group.orders as readonly number[]).includes(g.order)).map(g => {
          const exampleWord = getWordById(g.exampleWordId);
          const displayWord = g.exampleForm || exampleWord?.lemma || '';

          return (
            <div
              key={g.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Letter and order badge */}
                <div className="flex items-start justify-between">
                  <Link
                    href={`/learn-romanian/alfabet/${g.slug}`}
                    className="group inline-flex items-baseline gap-2"
                  >
                    <span className="text-3xl font-extrabold text-[#1554bd] dark:text-blue-400 group-hover:underline">
                      {g.grapheme}
                    </span>
                  </Link>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {isFa ? `#${toFaDigits(g.order)}` : `#${g.order}`}
                  </span>
                </div>

                {/* Persian Sound Hint */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isFa ? g.soundHintFa : g.soundHintEn}
                </p>

                {/* Example Word */}
                {exampleWord && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">
                        {isFa ? 'واژه نمونه:' : 'Example word:'}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {displayWord}
                      </span>
                      {exampleWord.definiteForm && (
                        <span className="text-slate-500 ms-1.5 font-normal">
                          ({exampleWord.definiteForm})
                        </span>
                      )}
                    </div>
                    <div className="text-end text-slate-500 dark:text-slate-400">
                      {isFa ? exampleWord.translations.fa : exampleWord.translations.en}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Audio Island & Lesson Link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <PronunciationAudio
                  clips={g.audio}
                  currentLang={currentLang}
                  label={g.grapheme}
                  variant="labelled"
                />
                <Link
                  href={`/learn-romanian/alfabet/${g.slug}`}
                  className="text-xs font-medium text-[#1554bd] dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>{isFa ? 'مشاهده درس' : 'Lesson'}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div></div>)}
      </section>
    </div>
  );
}

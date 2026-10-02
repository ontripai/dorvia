import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import {
  getPublishedGraphemes,
  getGraphemeBySlug,
  getWordById,
} from '@/lib/romanian/content';
import { ABreveFoundationLesson } from '@/components/romanian/ABreveFoundationLesson';
import { BasicConsonantPractice } from '@/components/romanian/BasicConsonantPractice';
import { BASIC_CONSONANT_LETTERS, type BasicConsonantSlug } from '@/content/romanian/basic-consonants';
import { LoanLetterLesson } from '@/components/romanian/LoanLetterLesson';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { GuidedAlphabetLesson } from '@/components/romanian/GuidedAlphabetLesson';
import { VowelFoundationLesson } from '@/components/romanian/VowelFoundationLesson';
import { VOWEL_FOUNDATION_LESSONS, type VowelFoundationSlug } from '@/content/romanian/vowel-foundation-lessons';
import { CircumflexFoundationLesson } from '@/components/romanian/CircumflexFoundationLesson';
import { CIRCUMFLEX_FOUNDATION_LESSON } from '@/content/romanian/circumflex-foundation-lesson';
import { FinalIFoundationLesson } from '@/components/romanian/FinalIFoundationLesson';
import { FINAL_I_FOUNDATION_LESSON } from '@/content/romanian/final-i-foundation-lesson';

const LOAN_LETTER_SLUGS = ['k', 'q', 'w', 'y'] as const;
const LETTER_READINGS: Record<string, Array<{ label: string; text: string; sound: string; soundCaptionFa?: string; soundCaptionEn?: string }>> = {
  a: [{ label: 'A', text: 'a', sound: 'a' }], e: [{ label: 'E', text: 'e', sound: 'e' }], i: [{ label: 'I', text: 'i', sound: 'i' }],
  o: [{ label: 'O', text: 'o', sound: 'o' }], u: [{ label: 'U', text: 'u', sound: 'u' }],
  'a-breve': [{ label: 'Ă', text: 'ă', sound: 'ă' }],
  'a-circ': [{ label: 'Â', text: 'î din a', sound: 'î' }, { label: 'Î', text: 'î din i', sound: 'î' }],
  'c-hard': [{ label: 'C', text: 'ce', sound: 'ca' }], 'g-hard': [{ label: 'G', text: 'ge', sound: 'ga' }],
  's-comma': [{ label: 'Ș', text: 'șe', sound: 'șa' }], 't-comma': [{ label: 'Ț', text: 'țe', sound: 'ța' }],
  j: [{ label: 'J', text: 'je', sound: 'ja' }], r: [{ label: 'R', text: 'er', sound: 'ra' }], v: [{ label: 'V', text: 've', sound: 'va' }],
  h: [{ label: 'H', text: 'haș', sound: 'ha' }], s: [{ label: 'S', text: 'es', sound: 'sa' }],
  x: [{ label: 'X', text: 'iks', sound: 'taxi', soundCaptionFa: 'صدای x در واژهٔ taxi', soundCaptionEn: 'X in the word taxi' }],
};
function isLoanLetterSlug(slug: string): slug is typeof LOAN_LETTER_SLUGS[number] {
  return LOAN_LETTER_SLUGS.some(letter => letter === slug);
}
function isBasicConsonantSlug(slug: string): slug is BasicConsonantSlug {
  return BASIC_CONSONANT_LETTERS.some(letter => letter === slug);
}
function isFoundationVowel(slug: string): slug is VowelFoundationSlug {
  return Object.hasOwn(VOWEL_FOUNDATION_LESSONS, slug);
}
function isCircumflexLesson(slug: string): slug is 'a-circ' | 'i-circ' | 'circ-rule' {
  return slug === 'a-circ' || slug === 'i-circ' || slug === 'circ-rule';
}
function isFinalILesson(slug: string): slug is 'i-final' {
  return slug === 'i-final';
}

export function generateStaticParams() {
  const published = getPublishedGraphemes();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    for (const g of published) {
      params.push({ lang, slug: g.slug });
    }
    for (const slug of LOAN_LETTER_SLUGS) params.push({ lang, slug });
    for (const slug of BASIC_CONSONANT_LETTERS) params.push({ lang, slug });
    params.push({ lang, slug: 'i-circ' });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const grapheme = getGraphemeBySlug(params.slug === 'i-circ' ? 'a-circ' : params.slug);
  if (isLoanLetterSlug(params.slug)) {
    return { title: params.lang === 'fa' ? `حرف ${params.slug.toUpperCase()} در الفبای رومانیایی | DORVIA` : `Romanian letter ${params.slug.toUpperCase()} | DORVIA`, robots: { index: false, follow: false } };
  }
  if (isBasicConsonantSlug(params.slug)) {
    const letter = params.slug.toUpperCase();
    return { title: params.lang === 'fa' ? `درس حرف ${letter} در رومانیایی | DORVIA` : `Romanian letter ${letter} lesson | DORVIA`, robots: { index: false, follow: false } };
  }
  if (isFoundationVowel(params.slug)) {
    const lesson = VOWEL_FOUNDATION_LESSONS[params.slug];
    return {
      title: params.lang === 'fa' ? `${lesson.titleFa} | DORVIA` : `${lesson.titleEn} | DORVIA`,
      description: params.lang === 'fa' ? `${lesson.introFa} همراه با تلفظ واژه‌های نمونه، نوشتن و گفتار.` : `${lesson.introEn} Includes word pronunciation, writing and speaking practice.`,
      robots: { index: false, follow: false },
    };
  }
  if (isCircumflexLesson(params.slug)) {
    return {
      title: params.slug === 'i-circ' ? (params.lang === 'fa' ? 'درس حرف Î در رومانیایی | DORVIA' : 'Romanian letter Î lesson | DORVIA') : params.lang === 'fa' ? `${CIRCUMFLEX_FOUNDATION_LESSON.titleFa} | DORVIA` : `${CIRCUMFLEX_FOUNDATION_LESSON.titleEn} | DORVIA`,
      description: params.lang === 'fa' ? CIRCUMFLEX_FOUNDATION_LESSON.introFa : CIRCUMFLEX_FOUNDATION_LESSON.introEn,
      robots: { index: false, follow: false },
    };
  }
  if (isFinalILesson(params.slug)) {
    return {
      title: params.lang === 'fa' ? `${FINAL_I_FOUNDATION_LESSON.titleFa} | DORVIA` : `${FINAL_I_FOUNDATION_LESSON.titleEn} | DORVIA`,
      description: params.lang === 'fa' ? FINAL_I_FOUNDATION_LESSON.introFa : FINAL_I_FOUNDATION_LESSON.introEn,
      robots: { index: false, follow: false },
    };
  }
  if (!grapheme) {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false },
    };
  }

  const isFa = params.lang === 'fa';
  return {
    title: isFa
      ? `تلفظ حرف «${grapheme.grapheme}» در زبان رومانیایی | DORVIA`
      : `Pronunciation of "${grapheme.grapheme}" in Romanian | DORVIA`,
    description: isFa
      ? `راهنمای حرف «${grapheme.grapheme}» در رومانیایی با واژه نمونه و تمرین؛ صوت ضبط‌شده در انتظار بررسی است.`
      : `Romanian spelling pattern "${grapheme.grapheme}" with example words and practice; recorded audio is pending review.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RomanianGraphemeDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  if (isLoanLetterSlug(params.slug)) {
    return <main className="max-w-4xl mx-auto px-4 py-8"><LoanLetterLesson slug={params.slug} lang={params.lang as 'fa' | 'en'} /></main>;
  }
  if (isBasicConsonantSlug(params.slug)) {
    const currentLang = params.lang as 'fa' | 'en';
    const isFa = currentLang === 'fa';
    return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Breadcrumb items={[
        { label: isFa ? 'خانه' : 'Home', href: '/' },
        { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
        { label: isFa ? 'الفبا و صداها' : 'Alphabet and sounds', href: '/learn-romanian/alfabet' },
        { label: params.slug.toUpperCase() },
      ]} currentLang={currentLang} disableJsonLd />
      <BasicConsonantPractice lang={currentLang} letter={params.slug} />
      <Link href="/learn-romanian/alfabet" className="inline-block font-semibold text-[#1554bd] underline">{isFa ? 'بازگشت به همهٔ حروف' : 'Back to all letters'}</Link>
    </main>;
  }
  const grapheme = getGraphemeBySlug(params.slug === 'i-circ' ? 'a-circ' : params.slug);
  if (!grapheme) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';
  const allGraphemes = getPublishedGraphemes();

  // Find previous and next graphemes for sequential navigation
  const currentIndex = allGraphemes.findIndex(g => g.slug === grapheme.slug);
  const prevGrapheme = currentIndex > 0 ? allGraphemes[currentIndex - 1] : null;
  const nextGrapheme =
    currentIndex < allGraphemes.length - 1 ? allGraphemes[currentIndex + 1] : null;

  const exampleWord = getWordById(grapheme.exampleWordId);
  const displayWord = grapheme.exampleForm || exampleWord?.lemma || '';
  const letterReadings = LETTER_READINGS[grapheme.slug];

  if (grapheme.slug === 'a-breve') {
    return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: isFa ? 'خانه' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & pronunciation', href: '/learn-romanian/alfabet' },
          { label: 'ă' },
        ]}
        currentLang={currentLang}
        disableJsonLd
      />
      <ABreveFoundationLesson lang={currentLang} />
    </main>;
  }

  if (isCircumflexLesson(grapheme.slug)) {
    const mapped = CIRCUMFLEX_FOUNDATION_LESSON.samples.map(sample => {
      const word = getWordById(sample.wordId);
      if (!word) notFound();
      return { ...sample, word };
    });
    return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: isFa ? 'خانه' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & pronunciation', href: '/learn-romanian/alfabet' },
          { label: params.slug === 'i-circ' ? 'Î î' : grapheme.grapheme },
        ]}
        currentLang={currentLang}
        disableJsonLd
      />
      <CircumflexFoundationLesson lang={currentLang} focusLetter={params.slug === 'i-circ' ? 'î' : params.slug === 'a-circ' ? 'â' : undefined} samples={mapped as unknown as [typeof mapped[number], typeof mapped[number], typeof mapped[number]]} />
    </main>;
  }

  if (isFinalILesson(grapheme.slug)) {
    const mapped = FINAL_I_FOUNDATION_LESSON.samples.map(sample => {
      const word = getWordById(sample.wordId);
      if (!word) notFound();
      return { ...sample, word };
    });
    return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: isFa ? 'خانه' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & pronunciation', href: '/learn-romanian/alfabet' },
          { label: grapheme.grapheme },
        ]}
        currentLang={currentLang}
        disableJsonLd
      />
      <FinalIFoundationLesson lang={currentLang} samples={mapped as unknown as [typeof mapped[number], typeof mapped[number], typeof mapped[number]]} />
    </main>;
  }

  if (isFoundationVowel(grapheme.slug)) {
    const lesson = VOWEL_FOUNDATION_LESSONS[grapheme.slug];
    const samples = lesson.samples.map(sample => {
      const word = getWordById(sample.wordId);
      if (!word) notFound();
      return { ...sample, word };
    });
    return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: isFa ? 'خانه' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & pronunciation', href: '/learn-romanian/alfabet' },
          { label: grapheme.grapheme },
        ]}
        currentLang={currentLang}
        disableJsonLd
      />
      <VowelFoundationLesson lang={currentLang} slug={grapheme.slug} data={{ ...lesson, samples: samples as typeof samples & [typeof samples[number], typeof samples[number], typeof samples[number]] }} />
    </main>;
  }

  if (grapheme.slug === 'consoane') {
    return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Breadcrumb items={[{ label: isFa ? 'خانه' : 'Home', href: '/' }, { label: isFa ? 'الفبا و صداها' : 'Alphabet and sounds', href: '/learn-romanian/alfabet' }, { label: grapheme.grapheme }]} currentLang={currentLang} disableJsonLd />
      <BasicConsonantPractice lang={currentLang} />
    </main>;
  }

  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
    <Breadcrumb items={[
      { label: isFa ? 'خانه' : 'Home', href: '/' },
      { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
      { label: isFa ? 'الفبا و صداها' : 'Alphabet and sounds', href: '/learn-romanian/alfabet' },
      { label: grapheme.grapheme },
    ]} currentLang={currentLang} disableJsonLd />
    <GuidedAlphabetLesson
      lang={currentLang}
      slug={grapheme.slug}
      symbol={grapheme.grapheme}
      soundHint={isFa ? grapheme.soundHintFa : grapheme.soundHintEn}
      readings={letterReadings}
      example={exampleWord ? {
        form: displayWord,
        translation: exampleWord.translations.en,
        translationFa: exampleWord.translations.fa,
        definite: exampleWord.definiteForm,
        gender: exampleWord.gender === 'f' ? (isFa ? 'مؤنث' : 'feminine') : exampleWord.gender === 'm' ? (isFa ? 'مذکر' : 'masculine') : exampleWord.gender === 'n' ? (isFa ? 'خنثی' : 'neuter') : undefined,
        plural: exampleWord.plural,
        source: exampleWord.source?.label,
      } : undefined}
      previous={prevGrapheme ? { slug: prevGrapheme.slug, symbol: prevGrapheme.grapheme } : undefined}
      next={nextGrapheme ? { slug: nextGrapheme.slug, symbol: nextGrapheme.grapheme } : undefined}
    />
  </main>;
}

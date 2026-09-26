import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import {
  getPublishedStations,
  getStationBySlug,
  getStationItems,
  getStationStepGroups,
  StationStepGroup,
  StepWordCard,
} from '@/lib/romanian/content';
import { RomanianWord, RomanianPhrase } from '@/lib/romanian/types';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight } from '@/components/Icons';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { UsageNoteText } from '@/components/romanian/UsageNoteText';
import { CORE_AUDIO } from '@/content/romanian/audio-manifest';

export function generateStaticParams() {
  const stations = getPublishedStations();
  return LOCALES.flatMap(lang =>
    stations.map(st => ({
      lang,
      slug: st.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const station = getStationBySlug(params.slug);
  const isFa = params.lang === 'fa';

  if (!station) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = isFa
    ? `ایستگاه ${station.titleFa} (${station.titleRo}) | آموزش زبان رومانیایی`
    : `${station.titleRo} (${station.titleFa}) Station | Learn Romanian`;
  const description = isFa
    ? `واژگان، عبارات و نکات کاربردی ایستگاه ${station.titleFa} در زبان رومانیایی.`
    : `Vocabulary, phrases, and usage notes for the ${station.titleRo} station in Romanian.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const toFaDigits = (n: number | string): string =>
  String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const POS_LABELS_FA: Record<string, string> = {
  noun: 'اسم',
  verb: 'فعل',
  adj: 'صفت',
  adv: 'قید',
  pronoun: 'ضمیر',
  numeral: 'عدد',
  prep: 'حرف اضافه',
  interj: 'صوت / ندا',
  expression: 'اصطلاح',
};

const GENDER_LABELS_FA: Record<string, string> = {
  m: 'مذکر',
  f: 'مؤنث',
  n: 'خنثی',
};

const REGISTER_LABELS_FA: Record<string, string> = {
  formal: 'رسمی / محترمانه',
  informal: 'دوستانه / غیررسمی',
  neutral: 'خنثی / عمومی',
};

const CARD_SHELL =
  'editorial-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4';
const CARD_GRID = 'grid grid-cols-1 md:grid-cols-2 gap-5';

/**
 * کارت یک واژه. یک بار تعریف می‌شود و هم در چیدمان گام‌بندی‌شده و هم در فهرست
 * تخت (ایستگاه‌هایی که گام ندارند) استفاده می‌شود، تا دو نسخه از یک کارت
 * نتوانند از هم دور بیفتند.
 */
function WordCardBlock({
  card,
  isFa,
  currentLang,
}: {
  card: StepWordCard;
  isFa: boolean;
  currentLang: Language;
}) {
  const { word, nested, shownApartFrom } = card;
  const posLabel = isFa ? POS_LABELS_FA[word.pos] || word.pos : word.pos;

  return (
    <div className={CARD_SHELL}>
      <div className="space-y-3">
        {/* Header Row: Lemma and Badges */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#142033] font-heading tracking-wide">
              {word.lemma}
            </span>
            {word.plural && (
              <span className="text-xs text-slate-400 block mt-0.5">
                {isFa ? `جمع: ${word.plural}` : `pl. ${word.plural}`}
              </span>
            )}
            {shownApartFrom && (
              <span className="text-[11px] text-slate-500 block mt-1">
                {isFa ? 'صورتی از ' : 'a form of '}
                <span
                  dir="ltr"
                  lang="ro"
                  className="inline-block font-bold text-[#1554bd] font-heading"
                >
                  {shownApartFrom.lemma}
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
              {posLabel}
            </span>
            {word.gender && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                {isFa ? GENDER_LABELS_FA[word.gender] || word.gender : word.gender}
              </span>
            )}
            {word.invariable && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                {isFa ? 'نامتصرف' : 'invariable'}
              </span>
            )}
          </div>
        </div>

        {/* Translations */}
        <div className="space-y-1 pt-1">
          <div className="text-base font-bold text-slate-900 leading-snug">
            {word.translations.fa}
          </div>
          <div className="text-xs text-slate-500 font-medium">{word.translations.en}</div>
        </div>

        <PronunciationAudio
          clips={CORE_AUDIO[word.id]}
          currentLang={currentLang}
          label={word.lemma}
          variant="compact"
        />

        {/* Noun Inflection Details */}
        {word.pos === 'noun' && word.definiteForm && (
          <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1">
            <div>
              <span className="font-semibold text-slate-700">
                {isFa ? 'صورت معرفه: ' : 'Definite form: '}
              </span>
              <span className="font-bold text-[#1554bd] font-heading">{word.definiteForm}</span>
            </div>
          </div>
        )}

        {/* Counter Examples (غلط رایج) */}
        {word.counterExamples && word.counterExamples.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50/90 border border-rose-200/80 rounded-lg px-3 py-2">
            <span className="font-bold shrink-0">{isFa ? 'غلط رایج:' : 'Common mistake:'}</span>
            <span className="line-through decoration-rose-500 font-medium">
              {word.counterExamples.join(' · ')}
            </span>
          </div>
        )}

        {/* Usage Note */}
        {word.usageNote && (
          <div className="text-xs text-slate-700 bg-blue-50/60 rounded-xl p-3 border border-blue-100/80 leading-relaxed">
            <div className="font-bold text-blue-900 mb-1">
              {isFa ? 'نکته کاربردی:' : 'Usage note:'}
            </div>
            <p>
              <UsageNoteText note={word.usageNote} lang={isFa ? 'fa' : 'en'} />
            </p>
          </div>
        )}

        {/* Grouped formOf Dependents taught in the same step */}
        {nested.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-slate-700">
              {isFa ? 'صورت‌های دیگر این واژه:' : 'Other forms of this word:'}
            </div>
            <div className="space-y-2">
              {nested.map(dep => (
                <div
                  key={dep.id}
                  className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-base text-[#1554bd] font-heading">
                      {dep.lemma}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {dep.translations.fa}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{dep.translations.en}</div>
                  <PronunciationAudio
                    clips={CORE_AUDIO[dep.id]}
                    currentLang={currentLang}
                    label={dep.lemma}
                    variant="compact"
                  />
                  {dep.usageNote && (
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/50">
                      <UsageNoteText note={dep.usageNote} lang={isFa ? 'fa' : 'en'} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** کارت یک عبارت. مثل کارت واژه، یک تعریف برای هر دو چیدمان. */
function PhraseCardBlock({
  phrase,
  isFa,
  currentLang,
}: {
  phrase: RomanianPhrase;
  isFa: boolean;
  currentLang: Language;
}) {
  const regLabel = isFa ? REGISTER_LABELS_FA[phrase.register] || phrase.register : phrase.register;

  return (
    <div className={CARD_SHELL}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xl sm:text-2xl font-extrabold text-[#142033] font-heading leading-snug">
            {phrase.text.ro}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70 shrink-0">
            {regLabel}
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <div className="text-base font-bold text-slate-900 leading-snug">{phrase.text.fa}</div>
          <div className="text-xs text-slate-500 font-medium">{phrase.text.en}</div>
        </div>

        <PronunciationAudio
          clips={CORE_AUDIO[phrase.id]}
          currentLang={currentLang}
          label={phrase.text.ro}
          variant="compact"
        />

        {phrase.informalVariant?.ro && (
          <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <span className="font-semibold text-slate-700">
              {isFa ? 'صورت محاوره‌ای (برای شنیدار): ' : 'Spoken variant (for listening): '}
            </span>
            <span className="font-bold text-slate-800">{phrase.informalVariant.ro}</span>
          </div>
        )}

        {phrase.usageNote && (
          <div className="text-xs text-slate-700 bg-blue-50/60 rounded-xl p-3 border border-blue-100/80 leading-relaxed">
            <div className="font-bold text-blue-900 mb-1">
              {isFa ? 'نکته کاربردی:' : 'Usage note:'}
            </div>
            <p>
              <UsageNoteText note={phrase.usageNote} lang={isFa ? 'fa' : 'en'} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * یک گام: سرتیتر، جمله‌ی توانایی، و محتوایش.
 *
 * جمله‌ی توانایی (`can`) عمداً عنوان موضوع نیست. یادگیرنده باید بداند پس از
 * این گام چه کاری می‌تواند بکند، نه فقط چه فهرستی را دیده است.
 */
function StepSection({
  group,
  stepTotal,
  isFa,
  currentLang,
}: {
  group: StationStepGroup;
  stepTotal: number;
  isFa: boolean;
  currentLang: Language;
}) {
  const { step } = group;
  const num = isFa ? toFaDigits(step.order) : String(step.order);
  const total = isFa ? toFaDigits(stepTotal) : String(stepTotal);

  return (
    <section className="space-y-5" id={`step-${step.id}`}>
      <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-5 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1554bd] text-white text-sm font-bold shrink-0">
              {num}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-[#142033] leading-snug">
                {isFa ? step.titleFa : step.titleRo}
              </h2>
              <div dir="ltr" lang="ro" className="text-xs text-slate-400 font-medium">
                {isFa ? step.titleRo : step.titleFa}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium shrink-0 text-end">
            <div>{isFa ? `گام ${num} از ${total}` : `Step ${num} of ${total}`}</div>
            <div className="text-slate-400">
              {isFa ? `${toFaDigits(group.itemCount)} قلم` : `${group.itemCount} items`}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-500">
            {isFa ? 'پس از این گام: ' : 'After this step: '}
          </span>
          {isFa ? step.canFa : step.canEn}
        </p>
      </div>

      {group.words.length > 0 && (
        <div className={CARD_GRID}>
          {group.words.map(card => (
            <WordCardBlock
              key={card.word.id}
              card={card}
              isFa={isFa}
              currentLang={currentLang}
            />
          ))}
        </div>
      )}

      {group.phrases.length > 0 && (
        <div className={CARD_GRID}>
          {group.phrases.map(phrase => (
            <PhraseCardBlock
              key={phrase.id}
              phrase={phrase}
              isFa={isFa}
              currentLang={currentLang}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function RomanianStationModulePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';
  const station = getStationBySlug(params.slug);

  if (!station) {
    notFound();
  }

  const allStations = getPublishedStations();
  const currentIndex = allStations.findIndex(s => s.slug === station.slug);
  const prevStation = currentIndex > 0 ? allStations[currentIndex - 1] : null;
  const nextStation = currentIndex < allStations.length - 1 ? allStations[currentIndex + 1] : null;

  const { words, phrases } = getStationItems(station.id);

  /**
   * ایستگاهی که گام تعریف کرده، به ترتیب آموزشی رندر می‌شود. ایستگاهی که گام
   * ندارد همان فهرست تخت قبلی را می‌گیرد — واژگان، بعد عبارت‌ها.
   */
  const stepGroups = getStationStepGroups(station.id);
  const hasSteps = stepGroups.length > 0;

  // فهرست تخت: صورت‌های `formOf` زیر سرواژه‌شان لانه می‌شوند.
  const dependentsByHeadId = new Map<string, RomanianWord[]>();
  for (const word of words) {
    if (word.formOf) {
      const list = dependentsByHeadId.get(word.formOf) || [];
      list.push(word);
      dependentsByHeadId.set(word.formOf, list);
    }
  }
  const flatWordCards: StepWordCard[] = words
    .filter(w => !w.formOf)
    .map(word => ({ word, nested: dependentsByHeadId.get(word.id) || [] }));

  const PrevNextNav = () => (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/80 text-sm">
      {prevStation ? (
        <Link
          href={`/learn-romanian/modul/${prevStation.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#1554bd] hover:border-[#1554bd] transition-colors shadow-sm"
        >
          {isFa ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <div className="text-start">
            <div className="text-[10px] text-slate-400">
              {isFa ? 'ایستگاه قبلی' : 'Previous Station'}
            </div>
            <div className="font-bold">
              {isFa ? prevStation.titleFa : prevStation.titleRo}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextStation ? (
        <Link
          href={`/learn-romanian/modul/${nextStation.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#1554bd] hover:border-[#1554bd] transition-colors shadow-sm"
        >
          <div className="text-end">
            <div className="text-[10px] text-slate-400">
              {isFa ? 'ایستگاه بعدی' : 'Next Station'}
            </div>
            <div className="font-bold">
              {isFa ? nextStation.titleFa : nextStation.titleRo}
            </div>
          </div>
          {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      ) : (
        <div />
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: isFa ? 'صفحه اصلی' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? station.titleFa : station.titleRo },
        ]}
        currentLang={currentLang}
        disableJsonLd={true}
      />

      {/* Hero Header Panel */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Link
            href="/learn-romanian"
            className="hover:text-white transition-colors underline decoration-dotted inline-flex items-center gap-1"
          >
            {isFa ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isFa ? 'بازگشت به آموزش رومانیایی' : 'Back to Learn Romanian'}</span>
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-amber-300 font-semibold">
              <span>
                {isFa
                  ? `ایستگاه ${toFaDigits(station.order)} از ${toFaDigits(allStations.length)}`
                  : `Station ${station.order} of ${allStations.length}`}
              </span>
            </div>
            {station.isFree && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200 font-bold">
                <span>{isFa ? 'رایگان' : 'Free'}</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            {isFa
              ? `${station.titleFa} · ${station.titleRo}`
              : `${station.titleRo} · ${station.titleFa}`}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isFa
              ? `واژگان پایه، اصطلاحات کلیدی و نکات کاربردی مرتبط با ${station.titleFa} در زبان رومانیایی به همراه معادل‌های استاندارد فارسی و انگلیسی.`
              : `Core vocabulary, practical expressions, and usage rules for ${station.titleRo} in Romanian with verified English and Persian definitions.`}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 font-medium">
            {isFa
              ? `${toFaDigits(station.totalCount)} مورد آموزشی`
              : `${station.totalCount} learning items`}
          </span>
          {hasSteps && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-medium">
              {isFa
                ? `${toFaDigits(stepGroups.length)} گام`
                : `${stepGroups.length} step${stepGroups.length > 1 ? 's' : ''}`}
            </span>
          )}
          {words.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 font-medium">
              {isFa
                ? `${toFaDigits(words.length)} واژه`
                : `${words.length} word${words.length > 1 ? 's' : ''}`}
            </span>
          )}
          {phrases.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-medium">
              {isFa
                ? `${toFaDigits(phrases.length)} عبارت`
                : `${phrases.length} phrase${phrases.length > 1 ? 's' : ''}`}
            </span>
          )}
        </div>
      </div>

      {hasSteps ? (
        /* Stepped layout — teaching order */
        <div className="space-y-10">
          {stepGroups.map(group => (
            <StepSection
              key={group.step.id}
              group={group}
              stepTotal={stepGroups.length}
              isFa={isFa}
              currentLang={currentLang}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Words Section */}
          {flatWordCards.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
                  {isFa ? 'واژگان و اصطلاحات' : 'Vocabulary & Expressions'}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {isFa
                    ? `${toFaDigits(words.length)} واژه در این ایستگاه`
                    : `${words.length} words in this station`}
                </span>
              </div>

              <div className={CARD_GRID}>
                {flatWordCards.map(card => (
                  <WordCardBlock
                    key={card.word.id}
                    card={card}
                    isFa={isFa}
                    currentLang={currentLang}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Phrases Section */}
          {phrases.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
                  {isFa ? 'عبارت‌ها و جملات کاربردی' : 'Practical Phrases & Formulas'}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {isFa
                    ? `${toFaDigits(phrases.length)} عبارت در این ایستگاه`
                    : `${phrases.length} phrases in this station`}
                </span>
              </div>

              <div className={CARD_GRID}>
                {phrases.map(phrase => (
                  <PhraseCardBlock
                    key={phrase.id}
                    phrase={phrase}
                    isFa={isFa}
                    currentLang={currentLang}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Sequential Navigation Footer */}
      <PrevNextNav />
    </div>
  );
}

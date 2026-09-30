'use client';

import React from 'react';
import { AlphabetStageNav } from './AlphabetStageNav';
import type { RomanianWord } from '@/lib/romanian/types';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';
import { SpokenWordCheck } from './SpokenWordCheck';
import type { VowelFoundationLessonData, VowelFoundationSlug, VowelSample } from '@/content/romanian/vowel-foundation-lessons';

type SampleWithWord = VowelSample & { word: RomanianWord };
type LessonData = Omit<VowelFoundationLessonData, 'samples'> & { samples: [SampleWithWord, SampleWithWord, SampleWithWord] };

const VOWELS: Record<VowelFoundationSlug, { upper: string; lower: string }> = {
  a: { upper: 'A', lower: 'a' }, e: { upper: 'E', lower: 'e' }, i: { upper: 'I', lower: 'i' },
  o: { upper: 'O', lower: 'o' }, u: { upper: 'U', lower: 'u' },
};

function normalizeAnswer(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO');
}

function HighlightVowel({ text, vowel }: { text: string; vowel: string }) {
  const index = text.toLocaleLowerCase('ro-RO').indexOf(vowel);
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<span className="rounded bg-amber-200 px-0.5 text-amber-950">{text[index]}</span>{text.slice(index + 1)}</>;
}

export function VowelFoundationLesson({ lang, slug, data }: { lang: Language; slug: VowelFoundationSlug; data: LessonData }) {
  const isFa = lang === 'fa';
  const letter = VOWELS[slug];
  const positions = isFa ? { start: 'آغاز واژه', middle: 'میانهٔ واژه', end: 'پایان واژه' } : { start: 'Word beginning', middle: 'Word middle', end: 'Word ending' };
  const [stage, setStage] = React.useState(0);
  const [sampleIndex, setSampleIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState<number[]>([]);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const sample = data.samples[sampleIndex];
  const expected = sample.displayForm || sample.word.lemma;
  const correct = normalizeAnswer(answer) === normalizeAnswer(expected);
  const progressKey = `dorvia:ro-foundation-vowel:${slug}:complete`;

  React.useEffect(() => {
    try { setSaved(window.localStorage.getItem(progressKey) === 'true'); } catch { /* storage can be disabled */ }
  }, [progressKey]);

  function completeLesson() {
    try { window.localStorage.setItem(progressKey, 'true'); } catch { /* progress remains visible for this visit */ }
    setSaved(true);
    setStage(4);
  }

  function checkAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (correct) setWritten(current => current.includes(sampleIndex) ? current : [...current, sampleIndex]);
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <Link href="/learn-romanian/alfabet" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به فهرست حروف' : '← Back to the alphabet'}</Link>
    <header className="dark-hero-panel space-y-4 rounded-3xl p-7 text-white sm:p-10">
      <p className="text-sm font-semibold text-blue-100">{isFa ? 'الفبا · واکه‌های پایه' : 'Alphabet · foundation vowels'}</p>
      <div className="flex flex-wrap items-center gap-5">
        <h1 className="text-6xl font-extrabold" lang="ro" dir="ltr">{letter.upper} {letter.lower}</h1>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
          <p className="mb-2 text-sm font-bold">{isFa ? `شنیدن آوای خود حرف ${letter.upper}` : `Hear the sound of ${letter.upper}`}</p>
          <PronunciationAudio currentLang={lang} label={letter.lower} />
          <p className="mt-2 max-w-sm text-xs leading-5 text-blue-100">{isFa ? 'این دکمه فقط صدای واکه را پخش می‌کند، نه نام طولانی حرف. صدا از گفتار مصنوعی مرورگر است و ضبط گویندهٔ بازبینی‌شده نیست.' : 'This plays the vowel sound itself, not a longer letter name. It uses browser speech synthesis, not a reviewed speaker recording.'}</p>
        </div>
      </div>
      <p className="max-w-2xl leading-7 text-blue-50">{isFa ? data.introFa : data.introEn}</p>
    </header>

    <AlphabetStageNav lang={lang} stage={stage} onSelect={index => setStage(index)} />

    {stage === 0 && <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold">{isFa ? 'اول خودِ آوا را بشنوید' : 'First, hear the vowel sound by itself'}</h2>
      <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-blue-50 p-5">
        <span className="text-5xl font-extrabold text-[#1554bd]" lang="ro" dir="ltr">{letter.upper} {letter.lower}</span>
        <div><p className="font-semibold">{isFa ? `آوا: ${letter.lower}` : `Sound: ${letter.lower}`}</p><PronunciationAudio currentLang={lang} label={letter.lower} className="mt-2" /></div>
      </div>
      <p className="text-sm leading-6 text-slate-600">{isFa ? 'گوش کنید و واکه را کوتاه و روشن تکرار کنید. سپس ببینید همین آوا در کدام بخش واژه می‌آید.' : 'Listen and repeat the vowel clearly. Then find it in different parts of a word.'}</p>
      <button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن واژه‌های نمونه ←' : 'Explore example words →'}</button>
    </section>}

    {stage === 1 && <section className="space-y-4">
      <div><h2 className="text-xl font-bold">{isFa ? 'هر واژه را جداگانه ببینید و بشنوید' : 'See and hear each word separately'}</h2><p className="mt-1 text-sm text-slate-600">{isFa ? 'بخش رنگی جای واکهٔ هدف را نشان می‌دهد. آوانویسی فارسی تقریبی است؛ IPA تلفظ را دقیق‌تر ثبت می‌کند.' : 'The highlighted part marks the target vowel. IPA gives a more precise guide than the approximate Persian spelling.'}</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {data.samples.map((item, index) => {
          const form = item.displayForm || item.word.lemma;
          return <article key={item.wordId} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1554bd]">{positions[item.position]}</span>
            <p lang="ro" dir="ltr" className="text-3xl font-bold"><HighlightVowel text={form} vowel={slug} /></p>
            <p className="text-sm font-semibold text-slate-700">{isFa ? item.word.translations.fa : item.word.translations.en}</p>
            <div className="rounded-xl bg-slate-50 p-3 text-sm">
              <p>{isFa ? 'تقریب فارسی:' : 'Approximate:'} <strong lang="fa" dir="rtl">{item.pronunciationFa}</strong></p>
              <p className="mt-1" lang="ro" dir="ltr">IPA: <strong>{item.ipa}</strong></p>
            </div>
            <PronunciationAudio currentLang={lang} label={form} />
            <details className="text-sm text-slate-600"><summary className="cursor-pointer font-semibold">{isFa ? 'نکتهٔ واژه و دستور' : 'Word and grammar note'}</summary><p className="mt-2 leading-6">{isFa ? item.noteFa : item.noteEn}</p>{item.word.gender && <p className="mt-1">{isFa ? 'جنس:' : 'Gender:'} {item.word.gender === 'f' ? (isFa ? 'مؤنث' : 'feminine') : item.word.gender === 'm' ? (isFa ? 'مذکر' : 'masculine') : (isFa ? 'خنثی' : 'neuter')} · {isFa ? 'جمع:' : 'Plural:'} {item.word.plural}</p>}</details>
          </article>;
        })}
      </div>
      <button type="button" onClick={() => { setStage(2); setSampleIndex(0); setAnswer(''); setChecked(false); }} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین نوشتن از حافظه ←' : 'Practise writing from memory →'}</button>
    </section>}

    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold text-[#1554bd]">{isFa ? `واژهٔ ${sampleIndex + 1} از ۳` : `Word ${sampleIndex + 1} of 3`}</p>
      <h2 className="text-xl font-bold">{isFa ? `«${sample.word.translations.fa}» را به رومانیایی بنویسید.` : `Write “${sample.word.translations.en}” in Romanian.`}</h2>
      <form onSubmit={checkAnswer} className="flex flex-wrap gap-2">
        <input lang="ro" dir="ltr" autoComplete="off" aria-label={isFa ? 'پاسخ به رومانیایی' : 'Romanian answer'} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="min-w-56 rounded-xl border border-slate-300 p-3 text-lg" />
        <button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button>
      </form>
      {checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? (isFa ? 'درست است؛ املای واژه و واکه را پیدا کردید.' : 'Correct. You found the spelling and vowel.') : (isFa ? 'هنوز مطابق نیست؛ به جای واکه و نشانه‌های رومانیایی توجه کنید.' : 'Not quite. Check the vowel position and Romanian diacritics.')}</p>}
      {checked && !correct && <button type="button" onClick={() => setAnswer(expected)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'نمایش پاسخ' : 'Show answer'}</button>}
      {written.includes(sampleIndex) && <button type="button" onClick={() => { if (sampleIndex < 2) { setSampleIndex(sampleIndex + 1); setAnswer(''); setChecked(false); } else setStage(3); }} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{isFa ? sampleIndex < 2 ? 'واژهٔ بعدی ←' : 'رفتن به تمرین گفتاری ←' : sampleIndex < 2 ? 'Next word →' : 'Go to speaking →'}</button>}
      <p className="text-xs text-slate-500">{isFa ? `واژهٔ هدف: ${expected} · ${sample.pronunciationFa} · ${sample.ipa}` : `Target: ${expected} · ${sample.ipa}`}</p>
    </section>}

    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold">{isFa ? 'عبارت را بشنوید و بلند بگویید' : 'Listen to the phrase and say it aloud'}</h2>
      <div className="rounded-2xl bg-blue-50 p-5">
        <p lang="ro" dir="ltr" className="text-2xl font-bold text-[#1554bd]">{data.speakingPhrase}</p>
        <p className="mt-2">{isFa ? data.speakingFa : data.speakingEn}</p>
        <p className="mt-2 text-sm text-slate-600">{isFa ? data.speakingNoteFa : data.speakingNoteEn}</p>
        <PronunciationAudio currentLang={lang} label={data.speakingPhrase} className="mt-3" />
      </div>
      <SpokenWordCheck word={data.speakingPhrase} lang={lang} />
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'عبارت را بلند تکرار کردم' : 'I repeated the phrase aloud'}</label>
      <button type="button" disabled={!saidAloud} onClick={completeLesson} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{isFa ? 'ثبت پایان درس' : 'Complete lesson'}</button>
    </section>}

    {stage === 4 && <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-extrabold text-emerald-800">{isFa ? saved ? 'درس واکه کامل شد' : 'تمرین این بار تمام شد' : saved ? 'Vowel lesson complete' : 'Practice finished for now'}</h2>
      <p>{isFa ? `${written.length} واژه از ۳ واژه را درست نوشتید و تمرین گفتاری را انجام دادید.` : `You wrote ${written.length} of 3 words correctly and completed the speaking practice.`}</p>
      <p className="text-sm text-slate-600">{isFa ? 'مقایسهٔ گفتار فقط متنِ تشخیص‌داده‌شده را می‌سنجد و ارزیابی دقت تلفظ نیست.' : 'Speech recognition compares text only; it does not assess pronunciation accuracy.'}</p>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setStage(0); setSampleIndex(0); setAnswer(''); setChecked(false); setWritten([]); setSaidAloud(false); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button><Link href="/learn-romanian/alfabet" className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'بازگشت به الفبا' : 'Back to alphabet'}</Link></div>
    </section>}
  </div>;
}

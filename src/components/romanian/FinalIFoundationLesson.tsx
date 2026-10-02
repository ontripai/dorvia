'use client';

import { MeaningLines } from './MeaningLines';

import React from 'react';
import { AlphabetStageNav } from './AlphabetStageNav';
import type { RomanianWord } from '@/lib/romanian/types';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';
import { SpokenWordCheck } from './SpokenWordCheck';
import { FINAL_I_FOUNDATION_LESSON } from '@/content/romanian/final-i-foundation-lesson';

type LessonSample = (typeof FINAL_I_FOUNDATION_LESSON.samples)[number] & { word: RomanianWord };

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO');
}

export function FinalIFoundationLesson({ lang, samples }: { lang: Language; samples: [LessonSample, LessonSample, LessonSample] }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState<number[]>([]);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const current = samples[index];
  const expected = current.displayForm;
  const correct = normalize(answer) === normalize(expected);
  const key = 'dorvia:ro-foundation-final-i:complete';

  React.useEffect(() => {
    try { setSaved(window.localStorage.getItem(key) === 'true'); } catch { /* optional */ }
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (correct) setWritten(previous => previous.includes(index) ? previous : [...previous, index]);
  }

  function complete() {
    try { window.localStorage.setItem(key, 'true'); } catch { /* progress remains for this visit */ }
    setSaved(true);
    setStage(4);
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <Link href="/learn-romanian/alfabet" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به فهرست الفبا' : '← Back to the alphabet'}</Link>
    <header className="dark-hero-panel space-y-4 rounded-3xl p-7 text-white sm:p-10">
      <p className="text-sm font-semibold text-blue-100">{isFa ? 'الفبا · واکه در پایان واژه' : 'Alphabet · a vowel at the end of a word'}</p>
      <div className="flex flex-wrap items-center gap-5"><h1 lang="ro" dir="ltr" className="text-6xl font-extrabold">i</h1><div className="rounded-2xl border border-white/20 bg-white/10 p-4"><p className="mb-2 text-sm font-bold">{isFa ? 'شنیدن آوای حرف i' : 'Hear the sound of i'}</p><PronunciationAudio currentLang={lang} label="i" /></div></div>
      <p className="max-w-3xl leading-7 text-blue-50">{isFa ? FINAL_I_FOUNDATION_LESSON.introFa : FINAL_I_FOUNDATION_LESSON.introEn}</p>
      <p className="text-xs leading-5 text-blue-100">{isFa ? 'صدای رومانیایی /i/ را تنها می‌شنوید؛ در واژهٔ واقعی، نقش i پایانی به همخوان پیش از آن و خود واژه بستگی دارد.' : 'This plays the Romanian /i/ sound by itself. In words, final i varies with the preceding consonant and the word.'}</p>
      <p className="text-xs text-blue-100">{isFa ? 'همهٔ پخش‌ها گفتار مصنوعی مرورگرند و ضبط گویندهٔ بازبینی‌شده نیستند.' : 'All playback uses browser speech synthesis, not reviewed speaker recordings.'}</p>
    </header>

    <AlphabetStageNav lang={lang} stage={stage} onSelect={index => setStage(index)} />

    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'صدای حرف را از نقش پایانی جدا کنید' : 'Separate the letter sound from its word-final role'}</h2><div className="flex flex-wrap items-center gap-4 rounded-2xl bg-blue-50 p-5"><span lang="ro" dir="ltr" className="text-4xl font-extrabold text-[#1554bd]">i</span><span className="text-xl font-bold">/i/</span><PronunciationAudio currentLang={lang} label="i" /></div><p className="text-sm leading-6 text-slate-600">{isFa ? 'آوای پایهٔ حرف i شنیدنی است؛ اما در پایان همهٔ واژه‌ها به شکل یک واکهٔ کامل ادا نمی‌شود. تفاوت را با واژه‌های واقعی بشنوید.' : 'The basic i sound is clear, but word-final i is not always pronounced as a full vowel. Hear the difference in real words.'}</p><div className="grid gap-3 sm:grid-cols-3">{samples.map(item => <div key={item.wordId} className="rounded-xl bg-slate-50 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{item.word.lemma}</p><MeaningLines en={item.word.translations.en} fa={item.word.translations.fa} lang={lang} className="text-sm" /><PronunciationAudio currentLang={lang} label={item.word.lemma} variant="compact" /></div>)}</div><button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'مقایسهٔ نمونه‌ها ←' : 'Compare examples →'}</button></section>}

    {stage === 1 && <section className="space-y-4"><div><h2 className="text-xl font-bold">{isFa ? 'کم‌آوا در برابر واکهٔ کامل' : 'Reduced ending versus full vowel'}</h2><p className="mt-1 text-sm text-slate-600">{isFa ? 'حرف i پایانی را رنگی کرده‌ایم. آوانویسی فارسی تقریبی است؛ IPA و پخش واژه را هم بررسی کنید.' : 'Final i is highlighted. The Persian guide is approximate; also check the IPA and play each word.'}</p></div><div className="grid gap-4 md:grid-cols-3">{samples.map(sample => { const word = sample.displayForm; const glossFa = sample.wordId === 'w-ban' ? 'پول / واحدهای پولی' : sample.wordId === 'w-elev' ? 'دانش‌آموزان' : sample.word.translations.fa; const glossEn = sample.wordId === 'w-ban' ? 'money / coins' : sample.wordId === 'w-elev' ? 'pupils' : sample.word.translations.en; return <article key={sample.wordId} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${sample.kind === 'reduced' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>{sample.kind === 'reduced' ? (isFa ? 'i کم‌آوا' : 'Reduced i') : (isFa ? 'i کامل' : 'Full i')}</span><p lang="ro" dir="ltr" className="text-3xl font-bold">{word.slice(0, -1)}<span className="rounded bg-amber-200 px-0.5 text-amber-950">i</span></p><MeaningLines en={glossEn} fa={glossFa} lang={lang} /><div className="rounded-xl bg-slate-50 p-3 text-sm"><p>{isFa ? 'تقریبی:' : 'Approximate:'} <strong>{sample.pronunciationFa}</strong></p><p className="mt-1" lang="ro" dir="ltr">IPA: <strong>{sample.ipa}</strong></p></div><PronunciationAudio currentLang={lang} label={word} /><p className="text-sm leading-6 text-slate-600">{isFa ? sample.noteFa : sample.noteEn}</p><details className="text-sm text-slate-600"><summary className="cursor-pointer font-semibold">{isFa ? 'قاعدهٔ واژه' : 'Word note'}</summary><p className="mt-2">{isFa ? sample.word.gender === 'm' ? 'اسم مذکر' : sample.word.gender === 'f' ? 'اسم مؤنث' : 'اسم خنثی' : sample.word.gender === 'm' ? 'Masculine noun' : sample.word.gender === 'f' ? 'Feminine noun' : 'Neuter noun'} · {isFa ? 'جمع/صورت نمونه:' : 'Form:'} {word}</p><a href={sample.word.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details></article>; })}</div><div className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><p className="font-bold">{isFa ? 'ترفند شنیداری' : 'Listening tip'}</p><p className="mt-1 text-sm">{isFa ? FINAL_I_FOUNDATION_LESSON.phoneticHintFa : FINAL_I_FOUNDATION_LESSON.phoneticHintEn}</p></div><button type="button" onClick={() => { setStage(2); setIndex(0); setAnswer(''); setChecked(false); }} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین نوشتن ←' : 'Practise writing →'}</button></section>}

    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold text-[#1554bd]">{isFa ? `واژهٔ ${index + 1} از ۳` : `Word ${index + 1} of 3`}</p><h2 className="text-xl font-bold">{isFa ? `«${current.wordId === 'w-ban' ? 'پول' : current.wordId === 'w-elev' ? 'دانش‌آموزان' : 'تاکسی'}» را به رومانیایی بنویسید.` : `Write “${current.wordId === 'w-ban' ? 'money' : current.wordId === 'w-elev' ? 'pupils' : 'taxi'}” in Romanian.`}</h2><form onSubmit={submit} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" autoComplete="off" aria-label={isFa ? 'پاسخ به رومانیایی' : 'Romanian answer'} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="min-w-56 rounded-xl border border-slate-300 p-3 text-lg" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>{checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? (isFa ? 'درست است؛ حالا نقش i پایانی را در این واژه تشخیص دهید.' : 'Correct. Now notice the role of final i in this word.') : (isFa ? 'هنوز مطابق نیست؛ به املای جمع یا صورت واژه دقت کنید.' : 'Not quite. Check the plural or word spelling.')}</p>}{checked && !correct && <button type="button" onClick={() => setAnswer(expected)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'نمایش پاسخ' : 'Show answer'}</button>}{written.includes(index) && <button type="button" onClick={() => { if (index < 2) { setIndex(index + 1); setAnswer(''); setChecked(false); } else setStage(3); }} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{isFa ? index < 2 ? 'واژهٔ بعدی ←' : 'تمرین گفتاری ←' : index < 2 ? 'Next word →' : 'Speaking practice →'}</button>}<p className="text-xs text-slate-500">{isFa ? `پاسخ: ${expected} · ${current.ipa}` : `Answer: ${expected} · ${current.ipa}`}</p></section>}

    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'در عبارت، دو نوع i را مقایسه کنید' : 'Compare both kinds of i in one phrase'}</h2><div className="rounded-2xl bg-blue-50 p-5"><p lang="ro" dir="ltr" className="text-2xl font-bold text-[#1554bd]">{FINAL_I_FOUNDATION_LESSON.speakingPhrase}</p><p className="mt-2">{isFa ? FINAL_I_FOUNDATION_LESSON.speakingFa : FINAL_I_FOUNDATION_LESSON.speakingEn}</p><p className="mt-2 text-sm text-slate-600">{isFa ? FINAL_I_FOUNDATION_LESSON.speakingNoteFa : FINAL_I_FOUNDATION_LESSON.speakingNoteEn}</p><PronunciationAudio currentLang={lang} label={FINAL_I_FOUNDATION_LESSON.speakingPhrase} className="mt-3" /></div><SpokenWordCheck word={FINAL_I_FOUNDATION_LESSON.speakingPhrase} lang={lang} /><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'عبارت را بلند تکرار کردم' : 'I repeated the phrase aloud'}</label><button type="button" disabled={!saidAloud} onClick={complete} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'ثبت پایان درس' : 'Complete lesson'}</button></section>}

    {stage === 4 && <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-emerald-800">{isFa ? saved ? 'درس i پایانی کامل شد' : 'تمرین این بار تمام شد' : saved ? 'Final i lesson complete' : 'Practice finished for now'}</h2><p>{isFa ? `${written.length} واژه از ۳ واژه را درست نوشتید و تمرین گفتاری را انجام دادید.` : `You wrote ${written.length} of 3 words correctly and completed the speaking practice.`}</p><p className="text-sm text-slate-600">{isFa ? 'تشخیص گفتار فقط متن را مقایسه می‌کند و نمرهٔ تلفظ نیست.' : 'Speech recognition compares text only; it is not a pronunciation score.'}</p><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setStage(0); setIndex(0); setAnswer(''); setChecked(false); setWritten([]); setSaidAloud(false); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button><Link href="/learn-romanian/alfabet" className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'بازگشت به الفبا' : 'Back to the alphabet'}</Link></div></section>}
  </div>;
}

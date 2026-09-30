'use client';

import React from 'react';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';

type Exercise = { id: string; words: string[]; answer: string[]; meaningFa: string; meaningEn: string; hintFa: string; hintEn: string };

const exercises: Exercise[] = [
  {
    id: 'have-ticket', words: ['nou.', 'am', 'un', 'Eu', 'bilet'], answer: ['Eu', 'am', 'un', 'bilet', 'nou.'],
    meaningFa: 'من یک بلیت جدید دارم.', meaningEn: 'I have a new ticket.',
    hintFa: 'فاعل ← فعل ← مفعول؛ صفت معمولاً بعد از اسم می‌آید.', hintEn: 'Subject → verb → object; the adjective usually follows the noun.',
  },
  {
    id: 'new-book', words: ['carte', 'nouă.', 'Am', 'o'], answer: ['Am', 'o', 'carte', 'nouă.'],
    meaningFa: 'من یک کتاب جدید دارم.', meaningEn: 'I have a new book.',
    hintFa: 'با اسم مؤنث، صفت هم شکل مؤنث می‌گیرد: carte nouă.', hintEn: 'With a feminine noun, the adjective agrees: carte nouă.',
  },
  {
    id: 'slowly', words: ['încet.', 'Vorbesc'], answer: ['Vorbesc', 'încet.'],
    meaningFa: 'آهسته صحبت می‌کنم.', meaningEn: 'I speak slowly.',
    hintFa: 'قیدِ حالت معمولاً بعد از فعل می‌آید؛ گاهی برای تأکید جابه‌جا می‌شود.', hintEn: 'An adverb of manner often follows the verb; it can move for emphasis.',
  },
];

const phases = [
  { min: 2, fa: 'هدف و الگو', en: 'Goal and pattern' },
  { min: 3, fa: 'شنیدن نمونه', en: 'Hear examples' },
  { min: 4, fa: 'کشف ترتیب', en: 'Notice word order' },
  { min: 4, fa: 'ساختن و گفتن', en: 'Build and speak' },
  { min: 2, fa: 'مرور', en: 'Review' },
];

function normalizeWords(words: string[]) {
  return words.join(' ').normalize('NFC').toLocaleLowerCase('ro-RO').replace(/[.,!?;:]/g, '').trim();
}

export function SentenceOrderFoundationLesson({ lang }: { lang: Language }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [exerciseIndex, setExerciseIndex] = React.useState(0);
  const [built, setBuilt] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState(false);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const exercise = exercises[exerciseIndex];
  const correct = normalizeWords(built) === normalizeWords(exercise.answer);

  function beginPractice() {
    setStage(3);
    setExerciseIndex(0);
    setBuilt([]);
    setChecked(false);
    setSaidAloud(false);
  }

  function chooseWord(word: string) {
    if (built.includes(word) || checked) return;
    setBuilt(previous => [...previous, word]);
  }

  function removeWord(index: number) {
    if (checked) return;
    setBuilt(previous => previous.filter((_, wordIndex) => wordIndex !== index));
  }

  function nextExercise() {
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex(previous => previous + 1);
      setBuilt([]);
      setChecked(false);
    } else {
      setStage(4);
    }
  }

  return <div dir={isFa ? 'rtl' : 'ltr'} className="space-y-6">
    <Link href="/learn-romanian/fundamente" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به مسیر درس‌های پایه' : '← Back to the foundation path'}</Link>

    <header className="dark-hero-panel space-y-4 rounded-3xl p-6 text-white sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-blue-100">{isFa ? 'درس پایهٔ پایانی · حدود ۱۵ دقیقه' : 'Final foundation lesson · about 15 minutes'}</p>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{isFa ? 'هدف: جملهٔ ساده' : 'Goal: a simple sentence'}</span>
      </div>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{isFa ? 'فعل، مفعول و ترتیب جمله' : 'Verbs, objects, and sentence order'}</h1>
      <p className="max-w-3xl leading-7 text-blue-50">{isFa ? 'جای فاعل، فعل، مفعول، صفت و قید را یاد بگیرید. بعد کلمه‌ها را مرتب کنید، جمله را بنویسید و با صدای بلند تمرین کنید.' : 'Learn where the subject, verb, object, adjective, and adverb go. Then arrange the words, write the sentence, and say it aloud.'}</p>
      <div className="flex flex-wrap gap-2 pt-1 text-sm font-bold" lang="ro" dir="ltr">
        <span className="rounded-xl bg-white/10 px-3 py-2">Eu</span><span className="self-center text-blue-200">+</span>
        <span className="rounded-xl bg-white/10 px-3 py-2">am</span><span className="self-center text-blue-200">+</span>
        <span className="rounded-xl bg-white/10 px-3 py-2">un bilet nou.</span>
      </div>
    </header>

    <nav aria-label={isFa ? 'مراحل درس ۱۵ دقیقه‌ای' : '15-minute lesson stages'} className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-5">
      {phases.map((phase, index) => <button key={phase.en} type="button" onClick={() => setStage(index)} aria-current={stage === index ? 'step' : undefined} className={`min-h-14 rounded-xl px-3 py-2 text-start text-xs font-bold transition ${stage === index ? 'bg-[#1554bd] text-white' : 'bg-slate-50 text-slate-700 hover:bg-blue-50'}`}>
        <span className="block">{isFa ? `مرحلهٔ ${'۱۲۳۴۵'[index]}` : `STEP ${index + 1}`} · {isFa ? `${phase.min} دقیقه` : `${phase.min} min`}</span>
        <span className="mt-1 block">{isFa ? phase.fa : phase.en}</span>
      </button>)}
    </nav>

    {stage === 0 && <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۱ · ۲ دقیقه' : 'STEP 1 · 2 MINUTES'}</p><h2 className="mt-1 text-xl font-extrabold">{isFa ? 'یک الگوی ساده را بشناسید' : 'Recognize a simple pattern'}</h2></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <PatternCard lang={lang} code="فاعل + فعل + مفعول" english="Subject + verb + object" example="Eu am un bilet." meaningFa="من یک بلیت دارم." meaningEn="I have a ticket." />
        <PatternCard lang={lang} code="اسم + صفت" english="Noun + adjective" example="un bilet nou" meaningFa="یک بلیت جدید" meaningEn="a new ticket" />
        <PatternCard lang={lang} code="فعل + قید" english="Verb + adverb" example="Vorbesc încet." meaningFa="آهسته صحبت می‌کنم." meaningEn="I speak slowly." />
      </div>
      <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">{isFa ? 'این‌ها الگوهای معمول جملهٔ ساده‌اند، نه قانون بی‌استثنا. ضمیر فاعلی در رومانیایی اغلب حذف می‌شود؛ مثلاً Am un bilet هم یعنی «یک بلیت دارم».' : 'These are common simple patterns, not exception-free rules. Romanian often omits the subject pronoun; Am un bilet also means “I have a ticket.”'}</p>
      <button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'شنیدن نمونه‌ها ←' : 'Hear the examples →'}</button>
    </section>}

    {stage === 1 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۲ · ۳ دقیقه' : 'STEP 2 · 3 MINUTES'}</p><h2 className="mt-1 text-xl font-extrabold">{isFa ? 'جمله‌ها را بشنوید و اجزا را پیدا کنید' : 'Listen and identify each part'}</h2></div>
      <ExampleRow lang={lang} sentence="Eu am un bilet nou." meaningFa="من یک بلیت جدید دارم." meaningEn="I have a new ticket." labelsFa="Eu (فاعل) · am (فعل) · un bilet (مفعول) · nou (صفت)" labelsEn="Eu (subject) · am (verb) · un bilet (object) · nou (adjective)" />
      <ExampleRow lang={lang} sentence="Am o carte nouă." meaningFa="یک کتاب جدید دارم." meaningEn="I have a new book." labelsFa="am (فعل) · o carte (مفعول) · nouă (صفت مؤنث)" labelsEn="am (verb) · o carte (object) · nouă (feminine adjective)" />
      <ExampleRow lang={lang} sentence="Vorbesc încet." meaningFa="آهسته صحبت می‌کنم." meaningEn="I speak slowly." labelsFa="Vorbesc (فعل) · încet (قید حالت)" labelsEn="Vorbesc (verb) · încet (adverb of manner)" />
      <button type="button" onClick={() => setStage(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'بررسی قاعده ←' : 'Explore the rules →'}</button>
    </section>}

    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۳ · ۴ دقیقه' : 'STEP 3 · 4 MINUTES'}</p><h2 className="mt-1 text-xl font-extrabold">{isFa ? 'جای هر جزء را در جمله پیدا کنید' : 'Notice where each part goes'}</h2></div>
      <RuleRow lang={lang} titleFa="فاعل پیش از فعل" titleEn="The subject comes before the verb" detailFa="ترتیب معمول جملهٔ خبری فاعل + فعل + مفعول است. چون شناسهٔ فعل شخص را نشان می‌دهد، فاعل را گاهی نمی‌آوریم: (Eu) am un bilet." detailEn="A common statement order is subject + verb + object. Since the verb ending can identify the person, the subject is sometimes omitted: (Eu) am un bilet." example="(Eu) am un bilet." />
      <RuleRow lang={lang} titleFa="مفعول بعد از فعل" titleEn="The object follows the verb" detailFa="در جملهٔ خبری ساده، چیزی که داریم یا می‌خواهیم معمولاً بعد از فعل می‌آید: Am un bilet. مفعول را با فاعل اشتباه نگیرید." detailEn="In a simple statement, the thing we have or want usually follows the verb: Am un bilet. Keep the object distinct from the subject." example="Am un bilet." />
      <RuleRow lang={lang} titleFa="صفت معمولاً بعد از اسم و هماهنگ با آن" titleEn="The adjective usually follows and agrees with the noun" detailFa="جای معمول صفت پس از اسم است و شکلش با جنس و شمار اسم هماهنگ می‌شود: un bilet nou، اما o carte nouă." detailEn="The usual adjective position is after the noun, and its form agrees in gender and number: un bilet nou, but o carte nouă." example="un bilet nou · o carte nouă" />
      <RuleRow lang={lang} titleFa="قید و منفی‌ساز" titleEn="Adverbs and negation" detailFa="قید حالت اغلب پس از فعل می‌آید: Vorbesc încet. برای منفی‌کردن، nu پیش از فعل قرار می‌گیرد: Nu am un bilet." detailEn="An adverb of manner often follows the verb: Vorbesc încet. To negate, nu goes before the verb: Nu am un bilet." example="Vorbesc încet. · Nu am un bilet." />
      <button type="button" onClick={beginPractice} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'شروع تمرین جمله‌سازی ←' : 'Start building sentences →'}</button>
    </section>}

    {stage === 3 && <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۴ · ۴ دقیقه' : 'STEP 4 · 4 MINUTES'}</p><h2 className="mt-1 text-xl font-extrabold">{isFa ? 'کلمه‌ها را به ترتیب درست بچینید' : 'Put the words in the correct order'}</h2></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1554bd]">{isFa ? `تمرین ${'۰۱۲۳'[exerciseIndex + 1]} از ${'۰۱۲۳'[exercises.length]}` : `Practice ${exerciseIndex + 1} of ${exercises.length}`}</span></div>
      <p className="text-sm leading-6 text-slate-600">{isFa ? exercise.hintFa : exercise.hintEn}</p>
      <div aria-live="polite" className="flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-4" lang="ro" dir="ltr">
        {built.length ? built.map((word, index) => <button key={`${word}-${index}`} type="button" onClick={() => removeWord(index)} aria-label={isFa ? `حذف ${word}` : `Remove ${word}`} className="rounded-lg bg-[#1554bd] px-3 py-2 text-lg font-bold text-white disabled:cursor-default">{word}</button>) : <span className="text-sm text-slate-500" dir={isFa ? 'rtl' : 'ltr'}>{isFa ? 'کلمه‌ها را به اینجا اضافه کنید.' : 'Add words here.'}</span>}
      </div>
      <div className="flex flex-wrap gap-2" lang="ro" dir="ltr">
        {exercise.words.map((word, index) => <button key={`${word}-${index}`} type="button" onClick={() => chooseWord(word)} disabled={built.includes(word) || checked} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40">{word}</button>)}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => { setBuilt([]); setChecked(false); }} disabled={!built.length || checked} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50">{isFa ? 'پاک‌کردن' : 'Clear'}</button>
        {!checked && <button type="button" onClick={() => setChecked(true)} disabled={built.length !== exercise.answer.length} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی ترتیب' : 'Check order'}</button>}
        {checked && <button type="button" onClick={correct ? nextExercise : () => { setBuilt([]); setChecked(false); }} className={`rounded-xl px-5 py-3 font-bold text-white ${correct ? 'bg-emerald-700' : 'bg-amber-700'}`}>{correct ? (isFa ? exerciseIndex < exercises.length - 1 ? 'جملهٔ بعدی ←' : 'رفتن به گفتن و مرور ←' : exerciseIndex < exercises.length - 1 ? 'Next sentence →' : 'Speak and review →') : (isFa ? 'دوباره مرتب می‌کنم' : 'Try again')}</button>}
      </div>
      {checked && <p role="status" className={`rounded-xl p-4 text-sm leading-6 ${correct ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`}>{correct ? `${exercise.answer.join(' ')} — ${isFa ? exercise.meaningFa : exercise.meaningEn}` : (isFa ? 'ترتیب را دوباره بررسی کنید: صفت را بعد از اسم بگذارید و قید را کنار فعل قرار دهید.' : 'Check the order again: place the adjective after the noun and keep the adverb with the verb.')}</p>}
    </section>}

    {stage === 4 && <section className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-7">
      <div><p className="text-xs font-extrabold text-emerald-800">{isFa ? 'مرحلهٔ ۵ · ۲ دقیقه' : 'STEP 5 · 2 MINUTES'}</p><h2 className="mt-1 text-2xl font-extrabold text-emerald-900">{isFa ? 'حالا جملهٔ ساده می‌سازید' : 'You can now build simple sentences'}</h2></div>
      <p className="text-sm leading-6 text-slate-700">{isFa ? 'در این نوبت، ترتیب اجزای جمله، مفعول، جای صفت و قید را تمرین کردید. این سه الگو را یک بار دیگر بلند بخوانید:' : 'In this session, you practised sentence order, objects, adjective position, and adverbs. Read these three patterns aloud once more:'}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <FinalExample lang={lang} sentence="Sunt student." meaningFa="دانشجو هستم." meaningEn="I am a student." />
        <FinalExample lang={lang} sentence="Am un bilet nou." meaningFa="یک بلیت جدید دارم." meaningEn="I have a new ticket." />
        <FinalExample lang={lang} sentence="Vorbesc încet." meaningFa="آهسته صحبت می‌کنم." meaningEn="I speak slowly." />
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="mt-0.5 h-5 w-5 accent-[#1554bd]" />{isFa ? 'جمله‌ها را با صدای بلند گفتم.' : 'I said the sentences aloud.'}</label>
      {saidAloud && <p role="status" className="rounded-xl bg-emerald-50 p-4 font-bold text-emerald-900">{isFa ? 'نوبت ۱۵ دقیقه‌ای تمام شد. می‌توانید درس را تکرار کنید یا به مسیر کاربردی بروید.' : 'Your 15-minute session is complete. Repeat the lesson or continue to practical dialogues.'}</p>}
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setStage(0); setSaidAloud(false); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button><Link href="/learn-romanian/lectie/bilet" className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'ادامه به گفت‌وگوی بلیت ←' : 'Continue to the ticket dialogue →'}</Link></div>
    </section>}
  </div>;
}

function PatternCard({ lang, code, english, example, meaningFa, meaningEn }: { lang: Language; code: string; english: string; example: string; meaningFa: string; meaningEn: string }) {
  const isFa = lang === 'fa';
  return <article className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-xs font-bold text-slate-500">{isFa ? code : english}</h3><p lang="ro" dir="ltr" className="mt-2 text-lg font-extrabold text-[#1554bd]">{example}</p><p className="mt-1 text-sm text-slate-600">{isFa ? meaningFa : meaningEn}</p></article>;
}

function ExampleRow({ lang, sentence, meaningFa, meaningEn, labelsFa, labelsEn }: { lang: Language; sentence: string; meaningFa: string; meaningEn: string; labelsFa: string; labelsEn: string }) {
  const isFa = lang === 'fa';
  return <article className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p lang="ro" dir="ltr" className="text-xl font-extrabold text-[#1554bd]">{sentence}</p><p className="mt-1 text-sm text-slate-700">{isFa ? meaningFa : meaningEn}</p><p className="mt-2 text-xs leading-5 text-slate-500">{isFa ? labelsFa : labelsEn}</p></div><PronunciationAudio currentLang={lang} label={sentence} variant="compact" /></article>;
}

function RuleRow({ lang, titleFa, titleEn, detailFa, detailEn, example }: { lang: Language; titleFa: string; titleEn: string; detailFa: string; detailEn: string; example: string }) {
  return <article className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><h3 className="font-extrabold text-slate-900">{lang === 'fa' ? titleFa : titleEn}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{lang === 'fa' ? detailFa : detailEn}</p></div><p lang="ro" dir="ltr" className="font-bold text-[#1554bd]">{example}</p></article>;
}

function FinalExample({ lang, sentence, meaningFa, meaningEn }: { lang: Language; sentence: string; meaningFa: string; meaningEn: string }) {
  return <article className="rounded-xl bg-emerald-50 p-4"><p lang="ro" dir="ltr" className="text-lg font-extrabold text-emerald-950">{sentence}</p><p className="mt-1 text-sm text-emerald-900">{lang === 'fa' ? meaningFa : meaningEn}</p><PronunciationAudio currentLang={lang} label={sentence} variant="compact" className="mt-2" /></article>;
}

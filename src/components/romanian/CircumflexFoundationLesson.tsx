'use client';

import React from 'react';
import type { RomanianWord } from '@/lib/romanian/types';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';
import { SpokenWordCheck } from './SpokenWordCheck';
import { CIRCUMFLEX_FOUNDATION_LESSON } from '@/content/romanian/circumflex-foundation-lesson';

type Sample = (typeof CIRCUMFLEX_FOUNDATION_LESSON.samples)[number] & { word: RomanianWord };
const stagesFa = ['شنیدن آوا', 'کشف تفاوت', 'نوشتن', 'گفتن', 'نتیجه'];
const stagesEn = ['Hear the sound', 'Explore the contrast', 'Write', 'Speak', 'Result'];

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO');
}

function HighlightLetter({ text, target }: { text: string; target: 'â' | 'î' }) {
  const index = text.toLocaleLowerCase('ro-RO').indexOf(target);
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<span className="rounded bg-amber-200 px-0.5 text-amber-950">{text[index]}</span>{text.slice(index + 1)}</>;
}

export function CircumflexFoundationLesson({ lang, samples, focusLetter }: { lang: Language; samples: [Sample, Sample, Sample]; focusLetter?: 'â' | 'î' }) {
  const isFa = lang === 'fa';
  const stages = isFa ? stagesFa : stagesEn;
  const [stage, setStage] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState<number[]>([]);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const current = samples[index];
  const expected = current.word.lemma;
  const correct = normalize(answer) === normalize(expected);
  const key = 'dorvia:ro-foundation-circumflex:complete';

  React.useEffect(() => {
    try { setSaved(window.localStorage.getItem(key) === 'true'); } catch { /* optional */ }
  }, []);

  function checkAnswer(event: React.FormEvent<HTMLFormElement>) {
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
    <Link href="/learn-romanian/alfabet" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به الفبا' : '← Back to the alphabet'}</Link>
    <header className="dark-hero-panel space-y-4 rounded-3xl p-7 text-white sm:p-10">
      <p className="text-sm font-semibold text-blue-100">{isFa ? 'الفبا · واکه‌های ویژه' : 'Alphabet · Romanian vowels with diacritics'}</p>
      <h1 className="text-5xl font-extrabold" lang="ro" dir="ltr">{focusLetter === 'î' ? 'Î î · Â â' : 'Â â · Î î'}</h1>
      <p className="max-w-3xl leading-7 text-blue-50">{isFa ? CIRCUMFLEX_FOUNDATION_LESSON.introFa : CIRCUMFLEX_FOUNDATION_LESSON.introEn}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { glyph: 'Â â', name: 'î din a', note: isFa ? 'نام حرف: «î از a»' : 'Letter name: “î from a”' },
          { glyph: 'Î î', name: 'î din i', note: isFa ? 'نام حرف: «î از i»' : 'Letter name: “î from i”' },
        ].map(item => <div key={item.glyph} className="rounded-2xl border border-white/20 bg-white/10 p-4">
          <p lang="ro" dir="ltr" className="text-3xl font-extrabold">{item.glyph}</p>
          <p className="mt-1 text-sm text-blue-100">{item.note}</p>
          <div className="mt-3 flex flex-wrap gap-4"><div><p className="mb-1 text-xs font-bold">{isFa ? 'نام حرف' : 'Letter name'}</p><PronunciationAudio currentLang={lang} label={item.name} /></div><div><p className="mb-1 text-xs font-bold">{isFa ? 'آوای مشترک /ɨ/' : 'Shared sound /ɨ/'}</p><PronunciationAudio currentLang={lang} label="î" /></div></div>
        </div>)}
      </div>
      <p className="text-xs leading-5 text-blue-100">{isFa ? 'آوای /ɨ/ در فارسی معادل دقیق ندارد؛ به آوای شنیده‌شده در واژه‌های نمونه گوش دهید. صدا از گفتار مصنوعی مرورگر است.' : '/ɨ/ has no exact English equivalent; listen to it in the example words. Playback uses browser speech synthesis.'}</p>
    </header>

    <nav aria-label={isFa ? 'مراحل درس' : 'Lesson stages'} className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">{stages.map((label, step) => <button key={label} type="button" onClick={() => setStage(step)} aria-current={stage === step ? 'step' : undefined} className={`rounded-xl px-3 py-2 text-sm font-semibold ${stage === step ? 'bg-[#1554bd] text-white' : 'bg-slate-50 text-slate-700 hover:bg-blue-50'}`}>{step + 1}. {label}</button>)}</nav>

    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'یک آوا، دو حرف' : 'One sound, two letters'}</h2><p className="text-sm leading-6 text-slate-600">{isFa ? 'Â و Î در جایگاه‌های متفاوت نوشته می‌شوند، اما هر دو واکهٔ /ɨ/ دارند. نام هر حرف را جدا از صدای آن بشنوید.' : 'Â and Î appear in different spelling positions but both represent /ɨ/. Hear each letter name separately from its sound.'}</p><div className="flex flex-wrap gap-4 rounded-2xl bg-blue-50 p-5"><span lang="ro" dir="ltr" className="text-3xl font-bold">Â / Î</span><span className="text-xl font-bold text-[#1554bd]">/ɨ/</span><PronunciationAudio currentLang={lang} label="î" /></div><button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن قاعده در واژه‌ها ←' : 'Explore the spelling in words →'}</button></section>}

    {stage === 1 && <section className="space-y-4"><div><h2 className="text-xl font-bold">{isFa ? 'جایگاه واکه را مقایسه کنید' : 'Compare the spelling positions'}</h2><p className="mt-1 text-sm text-slate-600">{isFa ? 'حرف هدف برجسته شده است. آوانویسی فارسی تقریبی است؛ IPA دقیق‌تر است.' : 'The target letter is highlighted. The Persian guide is approximate; IPA is more precise.'}</p></div><div className="grid gap-4 md:grid-cols-3">{samples.map(sample => { const form = sample.word.lemma; return <article key={sample.wordId} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1554bd]">{sample.target === 'â' ? (isFa ? 'â در میانه' : 'â inside') : (isFa ? 'î در آغاز' : 'î at the beginning')}</span><p lang="ro" dir="ltr" className="text-3xl font-bold"><HighlightLetter text={form} target={sample.target} /></p><p className="font-semibold">{isFa ? sample.word.translations.fa : sample.word.translations.en}</p><div className="rounded-xl bg-slate-50 p-3 text-sm"><p>{isFa ? 'تقریبی:' : 'Approximate:'} <strong>{sample.pronunciationFa}</strong></p><p className="mt-1" lang="ro" dir="ltr">IPA: <strong>{sample.ipa}</strong></p></div><PronunciationAudio currentLang={lang} label={form} /><p className="text-sm leading-6 text-slate-600">{isFa ? sample.noteFa : sample.noteEn}</p><details className="text-sm text-slate-600"><summary className="cursor-pointer font-semibold">{isFa ? 'نکتهٔ واژه' : 'Word note'}</summary><p className="mt-2">{sample.word.gender ? `${isFa ? 'جنس:' : 'Gender:'} ${sample.word.gender === 'f' ? (isFa ? 'مؤنث' : 'feminine') : sample.word.gender === 'm' ? (isFa ? 'مذکر' : 'masculine') : (isFa ? 'خنثی' : 'neuter')}` : ''}{sample.word.plural ? ` · ${isFa ? 'جمع:' : 'Plural:'} ${sample.word.plural}` : ''}</p><a href={sample.word.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details></article>; })}</div><aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="font-bold">{isFa ? 'یک مورد دیگر: î در پایان مصدر' : 'One more case: î at the end of an infinitive'}</h3><p lang="ro" dir="ltr" className="mt-2 text-2xl font-bold">{CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitive}</p><p>{isFa ? CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitiveFa : CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitiveEn} · <span lang="ro" dir="ltr">{CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitiveIPA}</span></p><PronunciationAudio currentLang={lang} label={CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitive} className="mt-2" /><p className="mt-2 text-sm text-slate-700">{isFa ? CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitiveNoteFa : CIRCUMFLEX_FOUNDATION_LESSON.finalInfinitiveNoteEn}</p><a href="https://doom.lingv.ro/cautare/q/cobor%C3%AE" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-[#1554bd] underline">{isFa ? 'جست‌وجو در DOOM 3' : 'Look up in DOOM 3'}</a></aside><button type="button" onClick={() => { setStage(2); setIndex(0); setAnswer(''); setChecked(false); }} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین نوشتن ←' : 'Practise writing →'}</button></section>}

    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold text-[#1554bd]">{isFa ? `واژهٔ ${index + 1} از ۳` : `Word ${index + 1} of 3`}</p><h2 className="text-xl font-bold">{isFa ? `«${current.word.translations.fa}» را به رومانیایی بنویسید.` : `Write “${current.word.translations.en}” in Romanian.`}</h2><form onSubmit={event => { event.preventDefault(); setChecked(true); if (correct) setWritten(previous => previous.includes(index) ? previous : [...previous, index]); }} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" autoComplete="off" aria-label={isFa ? 'پاسخ به رومانیایی' : 'Romanian answer'} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="min-w-56 rounded-xl border border-slate-300 p-3 text-lg" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>{checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? (isFa ? 'درست است؛ به نشانهٔ â/î دقت کردید.' : 'Correct. You used the â/î spelling correctly.') : (isFa ? 'هنوز درست نیست؛ به جایگاه /ɨ/ و نشانهٔ آن در واژه نگاه کنید.' : 'Not quite. Check the position and spelling of /ɨ/.')}</p>}{checked && !correct && <button type="button" onClick={() => setAnswer(expected)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'نمایش پاسخ' : 'Show answer'}</button>}{written.includes(index) && <button type="button" onClick={() => { if (index < 2) { setIndex(index + 1); setAnswer(''); setChecked(false); } else setStage(3); }} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{isFa ? index < 2 ? 'واژهٔ بعدی ←' : 'تمرین گفتاری ←' : index < 2 ? 'Next word →' : 'Speaking practice →'}</button>}<p className="text-xs text-slate-500">{isFa ? `پاسخ: ${expected} · ${current.ipa}` : `Answer: ${expected} · ${current.ipa}`}</p></section>}

    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'عبارت را بشنوید و بلند تکرار کنید' : 'Listen and repeat the phrase aloud'}</h2><div className="rounded-2xl bg-blue-50 p-5"><p lang="ro" dir="ltr" className="text-2xl font-bold text-[#1554bd]">{CIRCUMFLEX_FOUNDATION_LESSON.speakingPhrase}</p><p className="mt-2">{isFa ? CIRCUMFLEX_FOUNDATION_LESSON.speakingFa : CIRCUMFLEX_FOUNDATION_LESSON.speakingEn}</p><p className="mt-2 text-sm text-slate-600">{isFa ? CIRCUMFLEX_FOUNDATION_LESSON.speakingNoteFa : CIRCUMFLEX_FOUNDATION_LESSON.speakingNoteEn}</p><PronunciationAudio currentLang={lang} label={CIRCUMFLEX_FOUNDATION_LESSON.speakingPhrase} className="mt-3" /></div><SpokenWordCheck word={CIRCUMFLEX_FOUNDATION_LESSON.speakingPhrase} lang={lang} /><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'عبارت را بلند تکرار کردم' : 'I repeated the phrase aloud'}</label><button type="button" disabled={!saidAloud} onClick={complete} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'ثبت پایان درس' : 'Complete lesson'}</button></section>}

    {stage === 4 && <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-emerald-800">{isFa ? saved ? 'درس â و î کامل شد' : 'تمرین این بار تمام شد' : saved ? 'Â and î lesson complete' : 'Practice finished for now'}</h2><p>{isFa ? `${written.length} واژه از ۳ واژه را درست نوشتید و تمرین گفتاری را انجام دادید.` : `You wrote ${written.length} of 3 words correctly and completed the speaking practice.`}</p><p className="text-sm text-slate-600">{isFa ? 'تشخیص گفتار فقط متن را مقایسه می‌کند و دقت تلفظ را نمی‌سنجد.' : 'Speech recognition compares text only; it does not assess pronunciation accuracy.'}</p><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setStage(0); setIndex(0); setAnswer(''); setChecked(false); setWritten([]); setSaidAloud(false); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button><Link href="/learn-romanian/alfabet" className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'بازگشت به الفبا' : 'Back to the alphabet'}</Link></div></section>}
  </div>;
}

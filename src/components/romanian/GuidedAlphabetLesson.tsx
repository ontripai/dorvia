'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';
import { SpokenWordCheck } from './SpokenWordCheck';
import { LetterPositionPractice } from './LetterPositionPractice';
import { CGPatternPractice } from './CGPatternPractice';
import { ConsonantWordPractice } from './ConsonantWordPractice';
import { AlphabetStageNav } from './AlphabetStageNav';

type Reading = { label: string; text: string; sound: string; soundCaptionFa?: string; soundCaptionEn?: string };
type Example = { form: string; translation: string; definite?: string; gender?: string; plural?: string; source?: string };

export function GuidedAlphabetLesson({ lang, slug, symbol, soundHint, readings, example, previous, next }: {
  lang: 'fa' | 'en'; slug: string; symbol: string; soundHint: string; readings?: Reading[]; example?: Example;
  previous?: { slug: string; symbol: string }; next?: { slug: string; symbol: string };
}) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState(false);
  const correct = !!example && answer.normalize('NFC').trim().toLocaleLowerCase('ro-RO') === example.form.toLocaleLowerCase('ro-RO');
  const pattern = ['c-hard', 'ce-ci', 'che-chi', 'g-hard', 'ge-gi', 'ghe-ghi'].includes(slug);

  return <div className="space-y-5" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10">
      <p className="text-sm font-semibold text-blue-100">{isFa ? 'الفبا · حدود ۱۵ دقیقه' : 'Alphabet · about 15 minutes'}</p>
      <h1 lang="ro" dir="ltr" className="mt-2 text-4xl font-extrabold sm:text-5xl">{symbol}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50">{soundHint}</p>
      <p className="mt-2 text-sm text-blue-100">{isFa ? 'بشنوید، نمونه و قاعده را ببینید، از حافظه بنویسید، بلند بگویید و نتیجه را مرور کنید.' : 'Listen, explore the example and rule, write from memory, speak, and review your result.'}</p>
    </header>
    <AlphabetStageNav lang={lang} stage={stage} onSelect={setStage} />
    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold">{isFa ? 'حرف یا الگو را بشنوید' : 'Hear the letter or pattern'}</h2>
      {readings?.length ? <div className="grid gap-3 sm:grid-cols-2">{readings.map(reading => <div key={reading.label} className="space-y-3 rounded-xl bg-blue-50 p-4">
        <div><p className="text-sm font-semibold">{isFa ? 'نام حرف' : 'Letter name'} · <span lang="ro" dir="ltr">{reading.text}</span></p><PronunciationAudio currentLang={lang} label={reading.text} /></div>
        <div><p className="text-sm font-semibold">{isFa ? reading.soundCaptionFa || 'آوا در هجای کوتاه' : reading.soundCaptionEn || 'Sound in a short syllable'} · <span lang="ro" dir="ltr">{reading.sound}</span></p><PronunciationAudio currentLang={lang} label={reading.sound} /></div>
      </div>)}</div> : <div className="rounded-xl bg-blue-50 p-4"><p lang="ro" dir="ltr" className="text-3xl font-bold text-[#1554bd]">{symbol}</p><p className="mt-2 text-sm text-slate-600">{isFa ? 'آوای این الگو را در واژهٔ نمونهٔ مرحلهٔ بعد بشنوید.' : 'Hear this pattern in the example word in the next stage.'}</p></div>}
      {example && <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-xs font-bold text-[#1554bd]">{isFa ? 'واژهٔ نمونه' : 'Example word'}</p><p lang="ro" dir="ltr" className="mt-1 text-2xl font-bold">{example.form}</p><p className="text-sm">{example.translation}</p><PronunciationAudio currentLang={lang} label={example.form} /></div>}
      <button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن نمونه و قاعده' : 'Explore example and rule'}</button>
    </section>}
    {stage === 1 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold">{isFa ? 'واژهٔ نمونه و قاعده' : 'Example word and rule'}</h2>
      {example ? <div className="space-y-3 rounded-xl bg-blue-50 p-5"><p lang="ro" dir="ltr" className="text-3xl font-bold text-[#1554bd]">{example.form}</p><p className="font-semibold">{example.translation}</p><PronunciationAudio currentLang={lang} label={example.form} /><div className="flex flex-wrap gap-3 text-sm text-slate-700">{example.gender && <span>{isFa ? 'جنس:' : 'Gender:'} {example.gender}</span>}{example.plural && <span>{isFa ? 'جمع:' : 'Plural:'} <span lang="ro" dir="ltr">{example.plural}</span></span>}{example.definite && <span>{isFa ? 'معرفه:' : 'Definite:'} <span lang="ro" dir="ltr">{example.definite}</span></span>}</div>{example.source && <p className="text-xs text-slate-600">{isFa ? 'منبع:' : 'Source:'} {example.source}</p>}</div> : <p>{isFa ? 'نمونه‌های این الگو را در تمرین مرحلهٔ بعد ببینید.' : 'Explore this pattern in the practice examples in the next stage.'}</p>}
      <button type="button" onClick={() => setStage(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'نوشتن از حافظه' : 'Write from memory'}</button>
    </section>}
    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold">{isFa ? 'بنویسید و بررسی کنید' : 'Write and check'}</h2>
      {example && <form onSubmit={event => { event.preventDefault(); setChecked(true); if (correct) setWritten(true); }} className="space-y-3"><label className="block font-semibold" htmlFor={`write-${slug}`}>{isFa ? `«${example.translation}» را به رومانیایی بنویسید.` : `Write “${example.translation}” in Romanian.`}</label><div className="flex flex-wrap gap-2"><input id={`write-${slug}`} lang="ro" dir="ltr" value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} autoComplete="off" className="rounded-xl border border-slate-300 p-3" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-4 py-2 text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></div>{checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? isFa ? 'درست است.' : 'Correct.' : isFa ? 'واژهٔ مرحلهٔ قبل را مرور کنید و دوباره تلاش کنید.' : 'Review the previous stage and try again.'}</p>}</form>}
      <LetterPositionPractice slug={slug} lang={lang} />
      <button type="button" onClick={() => setStage(3)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین گفتاری' : 'Speaking practice'}</button>
    </section>}
    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'بلند بگویید و در واژه بشناسید' : 'Speak and recognise it in a word'}</h2>{example && <><p lang="ro" dir="ltr" className="text-2xl font-bold">{example.form}</p><PronunciationAudio currentLang={lang} label={example.form} /><SpokenWordCheck word={example.form} lang={lang} /></>}{pattern && <CGPatternPractice slug={slug as 'c-hard' | 'ce-ci' | 'che-chi' | 'g-hard' | 'ge-gi' | 'ghe-ghi'} lang={lang} />}<ConsonantWordPractice slug={slug} lang={lang} /><button type="button" onClick={() => setStage(4)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن نتیجه' : 'See result'}</button></section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'نتیجه و ادامهٔ مسیر' : 'Result and next lesson'}</h2><p>{written ? isFa ? 'واژهٔ نمونه را درست نوشتید. شنیدن و گفتن را هر زمان خواستید تکرار کنید.' : 'You wrote the example correctly. Repeat listening and speaking as often as you like.' : isFa ? 'برای تکمیل تمرین، به مرحلهٔ نوشتن برگردید.' : 'Return to writing to complete the practice.'}</p><p className="text-sm text-slate-600">{isFa ? 'تبدیل گفتار به متن، نمرهٔ تلفظ نیست.' : 'Speech transcription is not a pronunciation score.'}</p><div className="flex flex-wrap gap-4 text-sm font-semibold text-[#1554bd]">{previous && <Link href={`/learn-romanian/alfabet/${previous.slug}`} className="underline">{isFa ? 'درس قبلی:' : 'Previous:'} {previous.symbol}</Link>}{next && <Link href={`/learn-romanian/alfabet/${next.slug}`} className="underline">{isFa ? 'درس بعدی:' : 'Next:'} {next.symbol}</Link>}<Link href="/learn-romanian/alfabet" className="underline">{isFa ? 'همهٔ حروف' : 'All letters'}</Link></div><button type="button" onClick={() => setStage(0)} className="rounded-xl border border-[#1554bd] px-4 py-2 text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button></section>}
  </div>;
}

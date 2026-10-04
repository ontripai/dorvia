'use client';
import React from 'react';
import { homeVerbTimes } from '@/content/romanian/family-story';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';
import { matchesRomanianAnswer } from '@/lib/romanian/answerFeedback';
import { VoiceAnswer } from './VoiceAnswer';
import { AnswerWritingTip } from './AnswerWritingTip';

export function StoryVerbTimes({ lang }: { lang: 'fa' | 'en' }) {
  const fa = lang === 'fa';
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  React.useEffect(() => () => stopVerifiedAudio(), []);
  const target = homeVerbTimes[round];
  function check(value: string) { setAnswer(value); setFeedback(matchesRomanianAnswer(value,target.ro) ? 'correct' : 'retry'); }
  function reset(next: number) { stopVerifiedAudio(); setRound(next); setAnswer(''); setFeedback(null); setHint(false); }
  const button = 'inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50';
  return <details className="rounded-2xl border border-blue-200 bg-white p-5" onToggle={event => { if (!event.currentTarget.open) stopVerifiedAudio(); }}><summary className="cursor-pointer text-lg font-bold text-[#1554bd]">{fa ? 'تمرین بیشتر: داشتن در گذشته، حال و آینده' : 'Extra practice: having in the past, present and future'}</summary><div className="mt-4 space-y-5">
    <p>{fa ? 'یک فعل آشنا: a avea. ابتدا سه شکل «من» را بشنوید و بخوانید؛ سپس بدون نمونه پاسخ بدهید. این تمرین اختیاریِ ادامهٔ همین داستان است.' : 'One familiar verb: a avea. First hear and read the three “I” forms, then answer without the model. This is optional extra practice within the same story.'}</p>
    <div className="grid gap-3 sm:grid-cols-3">{homeVerbTimes.map(item => <article key={item.form} className="space-y-2 rounded-xl bg-blue-50 p-4"><h3 className="font-bold">{item.tense[lang]}</h3><p lang="ro" dir="ltr" className="text-lg font-bold">{item.form}</p><p className="text-sm">{item.hint[lang]}</p><p lang="ro" dir="ltr">{item.ro}</p><p lang="en" dir="ltr" className="text-sm">{item.en}</p>{fa && <p className="text-sm">{item.fa}</p>}<button type="button" className="min-h-11 font-semibold text-[#1554bd] underline" onClick={() => playVerifiedAudio(item.ro,()=>setAudioError(true))}>{fa ? 'شنیدن مثال' : 'Hear example'}</button></article>)}</div>
    {!complete ? <div className="space-y-4 border-t pt-4"><h3 className="font-bold">{fa ? `از حافظه بگویید یا بنویسید · ${round + 1} از ۳` : `Say or write from memory · ${round + 1} of 3`}</h3><p>{target.tense[lang]}</p><p lang="en" dir="ltr">{target.en}</p>{fa && <p>{target.fa}</p>}<form className="space-y-3" onSubmit={e=>{e.preventDefault();check(answer);}}><label htmlFor="story-time-answer" className="block font-semibold">{fa ? 'پاسخ رومانیایی برای این زمان' : 'Romanian answer for this tense'}</label><input id="story-time-answer" lang="ro" dir="ltr" value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback(null);}} className="w-full rounded-xl border p-3 text-lg focus:ring-2 focus:ring-blue-600"/><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className={button}>{fa ? 'بررسی' : 'Check'}</button><button type="button" className="min-h-12 rounded-xl border px-4" onClick={()=>setHint(true)}>{fa ? 'نمایش نمونه' : 'Show model'}</button></div></form><VoiceAnswer key={round} lang={lang} target={target.ro} onAnswer={check}/>{hint && <p lang="ro" dir="ltr">{target.ro}</p>}{feedback && <p role="status">{feedback==='correct' ? fa ? 'آفرین؛ زمان فعل را هم درست به کار بردید.' : 'Well done; you used the right verb tense.' : fa ? 'واژهٔ زمان و شکل فعل را دوباره بررسی کنید؛ نمونه کمک می‌کند.' : 'Check the time word and verb form again; the model can help.'}</p>}{feedback==='correct' && <><AnswerWritingTip lang={lang} answer={answer} target={target.ro}/><button type="button" className={button} onClick={()=>round===2 ? (stopVerifiedAudio(),setComplete(true)) : reset(round+1)}>{round===2 ? fa ? 'پایان تمرین زمان‌ها' : 'Finish tense practice' : fa ? 'زمان بعدی' : 'Next tense'}</button></>}</div> : <div role="status" className="space-y-3 rounded-xl bg-emerald-50 p-4"><p>{fa ? 'داشتن را در سه زمان تمرین کردید؛ am، am avut و voi avea شکل‌های یک فعل‌اند.' : 'You practised having in three tenses; am, am avut and voi avea are forms of one verb.'}</p><button type="button" className={button} onClick={()=>{setComplete(false);reset(0);}}>{fa ? 'تمرین دوباره' : 'Practise again'}</button></div>}
    {audioError && <p role="status">{fa ? 'صدا پخش نشد؛ دوباره تلاش کنید.' : 'Audio did not play; please try again.'}</p>}
  </div></details>;
}

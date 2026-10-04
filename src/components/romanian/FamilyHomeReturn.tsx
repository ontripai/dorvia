'use client';
import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { homeReturnDialogue } from '@/content/romanian/family-story';
import { ListeningPractice } from './ListeningPractice';
import { StoryVerbTimes } from './StoryVerbTimes';
import { VoiceAnswer } from './VoiceAnswer';
import { AnswerWritingTip } from './AnswerWritingTip';
import { matchesRomanianAnswer } from '@/lib/romanian/answerFeedback';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

export function FamilyHomeReturn({ lang }: { lang: 'fa' | 'en' }) {
  const fa = lang === 'fa';
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  React.useEffect(() => () => stopVerifiedAudio(), []);
  const cue = homeReturnDialogue[round * 2];
  const target = homeReturnDialogue[round * 2 + 1];
  function check(value: string) { setAnswer(value); setFeedback(matchesRomanianAnswer(value, target.ro) ? 'correct' : 'retry'); }
  function next() { stopVerifiedAudio(); if (round === 1) { setComplete(true); return; } setRound(1); setAnswer(''); setFeedback(null); setHint(false); }
  const button = 'inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50';
  return <div className="space-y-6" dir={fa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white"><p>{fa ? 'قسمت ۱ · بازگشت از فروشگاه · مرور داستان' : 'Episode 1 · back from the shop · story review'}</p><h1 className="mt-2 text-3xl font-bold">{fa ? 'دوباره در خانهٔ خانواده' : 'Back at the family home'}</h1><p className="mt-3">{fa ? 'آب را به خانه آورده‌اید. آنا دربارهٔ خرید می‌پرسد؛ با واژه‌های خانه و جمله‌های فروشگاه پاسخ بدهید. قیمت پنج لِی فقط نمونهٔ آموزشی است.' : 'You have brought the water home. Ana asks about your shopping; answer using the home vocabulary and shop sentences. Five lei is only a practice price.'}</p></header>
    <section className="space-y-4 rounded-2xl border bg-white p-5"><p className="rounded-xl bg-sky-50 p-3 text-sm">{fa ? 'آنا اکنون صمیمی صحبت می‌کند: ai یعنی «داری». در دیدار اول aveți («دارید») را شنیدید؛ در فروشگاه هم خطاب مؤدبانه مناسب است.' : 'Ana now uses familiar address: ai means “you have”. At the first meeting you heard polite aveți; polite address also suits the shop.'}</p><h2 className="text-xl font-bold">{fa ? 'گفت‌وگوی بازگشت را بشنوید' : 'Listen to the homecoming'}</h2><ListeningPractice lang={lang} scene="home" dialogue={homeReturnDialogue} counterpart={{fa:'آنا',en:'Ana'}}/></section>
    {!complete ? <section className="space-y-4 rounded-2xl border bg-white p-5"><p className="text-sm font-semibold">{fa ? `پاسخ شما به آنا · ${round + 1} از ۲` : `Your answer to Ana · ${round + 1} of 2`}</p><h2 lang="ro" dir="ltr" className="text-xl font-bold">{cue.ro}</h2><p lang="en" dir="ltr">{cue.en}</p>{fa && <p>{cue.fa}</p>}<button type="button" className="min-h-11 text-[#1554bd] underline" onClick={() => playVerifiedAudio(cue.ro, () => setAudioError(true))}>{fa ? 'شنیدن سؤال آنا' : 'Hear Ana’s question'}</button><form className="space-y-3" onSubmit={e=>{e.preventDefault();check(answer);}}><label htmlFor="return-answer" className="block font-semibold">{fa ? 'پاسخ رومانیایی' : 'Romanian answer'}</label><input id="return-answer" lang="ro" dir="ltr" value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback(null);}} className="w-full rounded-xl border p-3 text-lg focus:ring-2 focus:ring-blue-600"/><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className={button}>{fa ? 'بررسی' : 'Check'}</button><button type="button" className="min-h-12 rounded-xl border px-4 font-semibold" onClick={()=>setHint(true)}>{fa ? 'راهنما' : 'Hint'}</button></div></form><VoiceAnswer key={round} lang={lang} target={target.ro} onAnswer={check}/>{hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{target.ro}</p>}{feedback && <p role="status" className="rounded-xl bg-blue-50 p-3">{feedback==='correct' ? fa ? 'آفرین! خریدتان را به آنا توضیح دادید.' : 'Well done! You told Ana about your shopping.' : fa ? 'یک بار دیگر تلاش کنید؛ صدای نمونه و راهنما کمک می‌کنند.' : 'Try again; the model audio and hint can help.'}</p>}{feedback==='correct' && <><AnswerWritingTip lang={lang} answer={answer} target={target.ro}/><button type="button" className={button} onClick={next}>{round===0 ? fa ? 'سؤال بعدی آنا' : 'Ana’s next question' : fa ? 'پایان این قسمت' : 'Finish this episode'}</button></>}</section> : <section className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="text-2xl font-bold">{fa ? 'یک داستان کامل را تجربه کردید' : 'You experienced a complete story'}</h2><p>{fa ? 'وارد خانه شدید، با خانواده آشنا شدید، خرید کردید و به خانه برگشتید. حالا می‌توانید بخش‌های همین داستان را دوباره تمرین کنید.' : 'You entered the home, met the family, went shopping and returned home. You can now practise any part of the story again.'}</p><button type="button" className={button} onClick={()=>{stopVerifiedAudio();setComplete(false);setRound(0);setAnswer('');setFeedback(null);setHint(false);}}>{fa ? 'تمرین دوبارهٔ بازگشت' : 'Practise the homecoming again'}</button></section>}
    {complete && <StoryVerbTimes lang={lang}/>}
    {audioError && <p role="status">{fa ? 'صدا پخش نشد؛ دوباره تلاش کنید.' : 'Audio did not play; please try again.'}</p>}
    <div className="flex flex-wrap gap-4"><Link href="/learn-romanian/lectie/acasa/bun-venit" className="min-h-11 text-[#1554bd] underline">{fa ? 'شروع دوباره از ورود به خانه' : 'Start again at the front door'}</Link><Link href="/learn-romanian/lectie/tema/home" className="min-h-11 text-[#1554bd] underline">{fa ? 'درس‌های در خانه' : 'At-home lessons'}</Link></div>
  </div>;
}

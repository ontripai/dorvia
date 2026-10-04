'use client';

import React from 'react';
import { LessonSceneIllustration } from './LessonSceneIllustration';
import { AudioControlIcon, type AudioIconName } from './AudioControlIcon';
import { normalizeRomanianAnswer as normalize } from '@/lib/romanian/answerFeedback';
import { AnswerWritingTip } from './AnswerWritingTip';
import { playVerifiedSequence, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

type Line = { ro: string; en: string; fa: string; audioVoice?: string; who: string };
type Mode = 'full' | 'repeat' | 'role' | 'meaning' | 'dictation';

export function ListeningPractice({ lang, dialogue, counterpart, scene }: { lang: 'fa' | 'en'; scene?: string; dialogue: readonly Line[]; counterpart: { fa: string; en: string } }) {
  const fa = lang === 'fa';
  const t = (persian: string, english: string) => fa ? persian : english;
  const [mode, setMode] = React.useState<Mode>('full');
  const [visible, setVisible] = React.useState(true);
  const [persian, setPersian] = React.useState(true);
  const [rate, setRate] = React.useState(1);
  const [pause, setPause] = React.useState(6);
  const [loop, setLoop] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  React.useEffect(() => () => stopVerifiedAudio(), []);
  const line = dialogue[index];
  const exercise = mode === 'meaning' || mode === 'dictation';
  const showText = !exercise && visible;
  // Rotate the correct choice; use only distinct translations from this dialogue.
  const distractors = dialogue.filter(item => item.en !== line.en).filter((item, i, all) => all.findIndex(other => other.en === item.en) === i).slice(0, 2);
  const choices = distractors.slice();
  choices.splice(index % (choices.length + 1), 0, line);
  function reset() { stopVerifiedAudio(); setError(false); setAnswer(''); setFeedback(null); setRevealed(false); }
  function selectMode(next: Mode) { reset(); setMode(next); setIndex(0); if (next === 'role') setVisible(false); }
  function chooseLine(next: number) { reset(); setIndex(next); }
  function start(single = false) {
    setError(false);
    const source = single || exercise ? [line] : dialogue.slice(index);
    const offset = index;
    const steps = source.map(item => mode === 'role' && !single && item.who === 'you' ? { pauseMs: pause * 1000 } : { text: item.ro, audioVoice: item.audioVoice, pauseMs: undefined });
    const sequence = mode === 'repeat' && !single ? steps.flatMap(step => [step, { pauseMs: pause * 1000 }]) : steps;
    playVerifiedSequence(sequence, () => setError(true), setPlaying, {
      rate, gapMs: 350, repeat: loop && !exercise,
      onLine: position => { if (!single && !exercise) setIndex(offset + (mode === 'repeat' ? Math.floor(position / 2) : position)); },
    });
  }
  const button = 'rounded-xl border border-blue-200 px-4 py-2 font-semibold text-[#1554bd] disabled:opacity-40';
  function iconButton(icon: AudioIconName, label: string, onClick: () => void, disabled = false, primary = false) {
    return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-30 ${primary ? 'bg-[#1554bd] text-white shadow-sm' : 'border border-blue-100 bg-white text-[#1554bd] shadow-sm hover:bg-blue-100'}`}><AudioControlIcon name={icon}/></button>;
  }
  return <div className="space-y-4" dir={fa ? 'rtl' : 'ltr'}>
    <section aria-label={t('پخش‌کنندهٔ تمرین شنیداری', 'Listening practice player')} className="space-y-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 p-2 sm:p-4">
    <div className="flex items-center justify-between gap-3">
      <label className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">{t('تمرین', 'Practice')}
        <select aria-label={t('روش تمرین شنیداری', 'Listening practice mode')} value={mode} onChange={event => selectMode(event.target.value as Mode)} className="min-w-0 flex-1 rounded-xl border border-blue-200 bg-white p-3 sm:flex-none">
          {([['full', t('کل مکالمه', 'Full dialogue')], ['repeat', t('بشنو و تکرار کن', 'Listen and repeat')], ['role', t('نقش شما', 'Your role')], ['meaning', t('درک شنیداری', 'Listening meaning')], ['dictation', t('بشنو و بنویس', 'Dictation')]] as [Mode, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      {!exercise && iconButton(visible ? 'eye-off' : 'eye', visible ? t('پنهان کردن همهٔ متن‌ها', 'Hide all text') : t('نمایش متن', 'Show transcript'), () => setVisible(!visible))}
    </div>
    <div className="flex items-start gap-3">{scene && <LessonSceneIllustration scene={scene} lang={lang}/>}<p className="text-sm leading-6 text-slate-600">{mode === 'role' ? t('صدای طرف مقابل پخش می‌شود؛ در نوبت خودتان بلند پاسخ بدهید. ارزیابی تلفظ خودکار نیست.', 'Hear the other speaker and answer aloud during your turn. Pronunciation is not automatically assessed.') : mode === 'repeat' ? t('بعد از هر جمله، هنگام مکث آن را بلند تکرار کنید.', 'Repeat each line aloud during the pause.') : exercise ? t('بدون دیدن متن گوش کنید، سپس پاسخ بدهید.', 'Listen without the transcript, then answer.') : t('بار اول بدون متن گوش کنید؛ سپس متن را نشان دهید و دوباره بشنوید.', 'Listen once without the transcript, then show it and listen again.')}</p></div>
    <div role="group" aria-label={t('کنترل پخش', 'Playback controls')} dir="ltr" className="flex items-center justify-center gap-0 rounded-2xl bg-blue-50/60 p-1 sm:gap-3 sm:p-2">
      {iconButton('start', t('بازگشت به ابتدا', 'Back to start'), () => chooseLine(0))}
      {iconButton('previous', t('قبلی', 'Previous'), () => chooseLine(index - 1), index === 0)}
      {iconButton(playing ? 'stop' : 'play', playing ? t('توقف', 'Stop') : exercise ? t('شنیدن جمله', 'Hear sentence') : t('پخش از این جمله', 'Play from this line'), () => playing ? stopVerifiedAudio() : start(), false, true)}
      {iconButton('next', t('بعدی', 'Next'), () => chooseLine(index + 1), index === dialogue.length - 1)}
      {iconButton('repeat', mode === 'role' ? t('شنیدن پاسخ نمونه', 'Hear model answer') : t('تکرار جمله', 'Replay line'), () => start(true))}
    </div>
    <details className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
      <summary className="cursor-pointer font-semibold text-slate-600">{t('تنظیمات پخش', 'Playback settings')} · {rate === 1 ? t('عادی', 'Normal') : t('آهسته', 'Slow')}</summary>
      <div className="mt-3 flex flex-wrap items-center gap-4 pb-2">
        <label>{t('سرعت', 'Speed')} <select aria-label={t('سرعت پخش', 'Playback speed')} value={rate} onChange={event => { reset(); setRate(Number(event.target.value)); }} className="rounded border bg-white p-2"><option value={1}>{t('عادی', 'Normal')}</option><option value={0.8}>{t('آهسته', 'Slow')}</option></select></label>
        {(mode === 'role' || mode === 'repeat') && <label>{t('مکث', 'Pause')} <select value={pause} onChange={event => { reset(); setPause(Number(event.target.value)); }} className="rounded border bg-white p-2">{[4, 6, 10].map(seconds => <option key={seconds} value={seconds}>{seconds} {t('ثانیه', 'seconds')}</option>)}</select></label>}
        {!exercise && <label className="flex items-center gap-2"><input type="checkbox" checked={loop} onChange={event => { reset(); setLoop(event.target.checked); }}/>{t('تکرار خودکار', 'Loop playback')}</label>}
      </div>
    </details>
    <p role="status" className="text-center text-xs font-semibold text-slate-600">{t('جمله', 'Line')} {index + 1} / {dialogue.length} · {line.who === 'you' ? t('شما', 'You') : counterpart[lang]}{playing && mode === 'role' && line.who === 'you' ? ` · ${t('اکنون پاسخ بدهید', 'Answer now')}` : playing ? ` · ${t('در حال پخش', 'Playing')}` : ''}</p>
    <progress aria-label={t('جایگاه جمله در مکالمه', 'Current line in the dialogue')} value={index + 1} max={dialogue.length} className="block h-1.5 w-full overflow-hidden rounded-full accent-blue-600"/>
    </section>
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-3">{t('صدا پخش نشد؛ دوباره تلاش کنید.', 'Audio could not play. Please try again.')}</p>}
    {mode === 'meaning' && <fieldset className="space-y-2"><legend className="mb-2 font-bold">{t('کدام معنی با جملهٔ شنیده‌شده مطابقت دارد؟', 'Which meaning matches the sentence you heard?')}</legend>{choices.map(choice => <button type="button" key={choice.en} onClick={() => setFeedback(choice.ro === line.ro ? 'correct' : 'retry')} className={`${button} block w-full text-start`}><span lang="en" dir="ltr" className="block">{choice.en}</span>{fa && <span className="block">{choice.fa}</span>}</button>)}</fieldset>}
    {mode === 'dictation' && <form className="space-y-3" onSubmit={event => { event.preventDefault(); setFeedback(normalize(answer) === normalize(line.ro) ? 'correct' : 'retry'); }}><label className="block font-semibold">{t('جمله‌ای را که شنیدید به رومانیایی بنویسید', 'Write the Romanian sentence you heard')}<input lang="ro" dir="ltr" autoComplete="off" spellCheck={false} value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="mt-2 w-full rounded-xl border p-3"/></label><button type="submit" disabled={!answer.trim()} className={button}>{t('بررسی پاسخ', 'Check answer')}</button><p className="text-xs">{t('نوشتن حروف رومانیایی مانند ă و ș را تمرین کنید؛ نبود علامت حروف یا تفاوت نشانه‌گذاری مانع ادامه نیست.', 'Practise Romanian letters such as ă and ș. Missing accent marks or punctuation differences do not block progress.')}</p></form>}
    {mode === 'dictation' && feedback === 'correct' && <AnswerWritingTip lang={lang} answer={answer} target={line.ro}/>}
    {feedback && <p role="status" className={`rounded-xl p-3 ${feedback === 'correct' ? 'bg-emerald-50' : 'bg-amber-50'}`}>{feedback === 'correct' ? t('درست است؛ برای جملهٔ بعد «بعدی» را بزنید.', 'Correct. Choose Next for another sentence.') : t('دوباره گوش کنید و تلاش کنید.', 'Listen again and try again.')}</p>}
    {exercise && <button type="button" className={button} onClick={() => setRevealed(!revealed)}>{revealed ? t('پنهان کردن پاسخ', 'Hide answer') : t('نمایش پاسخ', 'Reveal answer')}</button>}
    {exercise && revealed && <div className="rounded-xl bg-slate-50 p-4"><p lang="ro" dir="ltr" className="font-bold">{line.ro}</p><p lang="en" dir="ltr">{line.en}</p>{fa && <p>{line.fa}</p>}</div>}
    {showText && <div className="space-y-3">{dialogue.map((item, position) => <article key={position} className={`rounded-xl border p-4 ${position === index ? 'border-blue-400 bg-blue-50' : 'border-transparent bg-slate-50'}`}><p className="text-xs font-bold">{item.who === 'you' ? t('شما', 'You') : counterpart[lang]}</p><p lang="ro" dir="ltr" className="text-xl font-bold">{item.ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{item.en}</p>{fa && persian && <p className="text-sm">{item.fa}</p>}<button type="button" aria-label={t(`شنیدن جملهٔ ${position + 1}`, `Hear line ${position + 1}`)} title={t('شنیدن جمله', 'Hear line')} className="mt-2 grid h-11 w-11 place-items-center rounded-full text-[#1554bd] hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700" onClick={() => { reset(); setIndex(position); playVerifiedSequence([{ text: item.ro, audioVoice: item.audioVoice }], () => setError(true), setPlaying, { rate }); }}><AudioControlIcon name="volume"/></button></article>)}{fa && <button type="button" className={button} onClick={() => setPersian(!persian)}>{persian ? 'پنهان کردن فارسی' : 'نمایش فارسی'}</button>}</div>}
  </div>;
}

'use client';

import React from 'react';
import { ListeningPractice } from './ListeningPractice';
import { LessonStageNav } from './LessonStageNav';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';
import type { LocalizedPhrase } from '@/content/romanian/pharmacy-scenarios';

export type EverydayScenario = { slug: string; title: { fa: string; en: string }; goal: { fa: string; en: string }; dialogue: (LocalizedPhrase & { who: string })[]; rules: { title: { fa: string; en: string }; explanation: { fa: string; en: string }; examples: LocalizedPhrase[] }[]; tasks: (LocalizedPhrase & { hint: string })[] };

type Locale = 'fa' | 'en';
const normalize = (s: string) => s.normalize('NFC').toLocaleLowerCase('ro-RO').trim().replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');

export function EverydayScenarioLesson({ lang, lesson, topic, counterpart, topicHref, footer }: { lang: Locale; lesson: EverydayScenario; topic: { fa: string; en: string }; counterpart: { fa: string; en: string }; topicHref: string; footer: { fa: string; en: string } }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  React.useEffect(() => () => stopVerifiedAudio(), []);
  const task = stage === 2 ? lesson.tasks[0] : lesson.tasks[round];
  const labels = isFa ? ['مکالمه', 'قاعده‌ها', 'یادآوری', 'تمرین موقعیت', 'نتیجه'] : ['Conversation', 'Rules', 'Recall', 'Situation', 'Result'];
  function move(to: number) { stopVerifiedAudio(); setStage(to); setRound(0); setAnswer(''); setFeedback(null); setHint(false); setAudioError(false); }
  function play(ro: string) { setAudioError(false); playVerifiedAudio(ro, () => setAudioError(true)); }
  function next() {
    if (stage === 2) { move(3); return; }
    if (round < lesson.tasks.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem(`dorvia:romanian:${topicHref}:${lesson.slug}:v1`, new Date().toISOString()); } catch { /* optional */ }
    setComplete(true); move(4);
  }
  const action = (label: string, onClick: () => void) => <button type="button" onClick={onClick} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{label}</button>;
  const example = ({ ro, en, fa }: LocalizedPhrase) => <div key={ro} className="rounded-xl bg-white/80 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{en}</p>{isFa && <p className="text-sm">{fa}</p>}<button type="button" onClick={() => play(ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن' : 'Listen'}</button></div>;
  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-semibold text-blue-100">{isFa ? `${topic.fa} · درس موضوعی · حدود ۱۵ دقیقه` : `${topic.en} · focused lesson · about 15 minutes`}</p><h1 className="mt-2 text-3xl font-extrabold">{lesson.title[lang]}</h1><p className="mt-3 text-blue-50">{lesson.goal[lang]}</p></header>
    <LessonStageNav lang={lang} labels={labels} stage={stage} onSelect={move} />
    {stage === 0 && <section className="space-y-4 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۱. گفت‌وگو را بشنوید' : '1. Listen to the conversation'}</h2><p>{isFa ? 'هر جمله را بشنوید و یک بار با صدای بلند تکرار کنید. در موقعیت واقعی، وضعیت خودتان را دقیق بیان کنید.' : 'Listen to each line and repeat it aloud. Describe your actual situation accurately.'}</p><ListeningPractice lang={lang} dialogue={lesson.dialogue} counterpart={counterpart}/><div>{action(isFa ? 'دیدن قاعده‌ها' : 'Explore the rules', () => move(1))}</div></section>}
    {stage === 1 && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۲. واژه‌ها و قاعده‌های همین موقعیت' : '2. Words and rules for this situation'}</h2>{lesson.rules.map((rule, i) => <article key={rule.title.en} className={`space-y-3 rounded-xl p-4 ${['bg-sky-50', 'bg-emerald-50', 'bg-amber-50'][i % 3]}`}><h3 className="font-bold">{rule.title[lang]}</h3><p>{rule.explanation[lang]}</p>{rule.examples.map(example)}</article>)}<div>{action(isFa ? 'یادآوری از حافظه' : 'Recall from memory', () => move(2))}</div></section>}
    {(stage === 2 || stage === 3) && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><p className="text-sm font-bold text-[#1554bd]">{stage === 2 ? isFa ? '۳. یادآوری' : '3. Recall' : isFa ? `۴. موقعیت ${round + 1} از ${lesson.tasks.length}` : `4. Situation ${round + 1} of ${lesson.tasks.length}`}</p><h2 className="text-xl font-bold">{isFa ? task.fa : task.en}</h2><p className="text-sm text-slate-600">{isFa ? 'به رومانیایی بنویسید و سپس بلند بگویید.' : 'Write it in Romanian, then say it aloud.'}</p><form onSubmit={event => { event.preventDefault(); setFeedback(normalize(answer) === normalize(task.ro) ? 'correct' : 'retry'); }} className="space-y-3"><label htmlFor="scenario-answer" className="block font-semibold">{isFa ? 'پاسخ رومانیایی' : 'Romanian answer'}</label><input id="scenario-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]"/><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button><button type="button" onClick={() => setHint(true)} className="rounded-xl border px-5 py-3 font-semibold text-[#1554bd]">{isFa ? 'راهنما' : 'Hint'}</button></div></form>{hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{task.hint}</p>}{feedback && <p role="status" className={`rounded-xl p-3 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. جمله را بلند بگویید.' : 'Correct. Say it aloud.' : isFa ? 'دوباره تلاش کنید؛ به قاعده و راهنما برگردید.' : 'Try again; review the rule and hint.'}</p>}{feedback === 'correct' && <button type="button" onClick={() => play(task.ro)} className="rounded-xl border border-blue-300 px-4 py-2 font-semibold text-[#1554bd]">{isFa ? 'شنیدن پاسخ و تکرار بلند' : 'Hear and repeat your answer'}</button>}{feedback === 'correct' && action(stage === 2 ? isFa ? 'شروع گفت‌وگو' : 'Start conversation' : round === lesson.tasks.length - 1 ? isFa ? 'دیدن نتیجه' : 'See result' : isFa ? 'مورد بعد' : 'Next item', next)}</section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">{complete ? isFa ? 'این موقعیت را تمرین کردید' : 'You practised this situation' : isFa ? 'تمرین هنوز کامل نشده است' : 'Practice is not complete yet'}</h2><p>{lesson.goal[lang]}</p>{action(complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'ادامهٔ تمرین' : 'Continue practice', () => move(complete ? 0 : 3))}<Link href={topicHref} className="ms-3 inline-block text-[#1554bd] underline">{isFa ? 'درس‌های این موضوع' : 'Lessons in this topic'}</Link></section>}
    {audioError && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{isFa ? 'فایل صدا در دسترس نیست.' : 'Audio recording is unavailable.'}</p>}
    <p className="text-xs text-slate-500">{footer[lang]}</p>
  </div>;
}


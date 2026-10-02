'use client';

import React from 'react';
import { MeaningLines } from './MeaningLines';
import { LessonStageNav } from './LessonStageNav';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { SpokenWordCheck } from '@/components/romanian/SpokenWordCheck';

const forms = [
  { subject: 'eu', fa: 'من', en: 'I', verb: 'sunt', example: 'Eu sunt aici.', meaningFa: 'من اینجا هستم.', meaningEn: 'I am here.' },
  { subject: 'tu', fa: 'تو؛ یک نفر، خودمانی', en: 'you; one person, informal', verb: 'ești', example: 'Tu ești aici.', meaningFa: 'تو اینجا هستی.', meaningEn: 'You are here.' },
  { subject: 'el', fa: 'او؛ مذکر', en: 'he', verb: 'este', example: 'El este aici.', meaningFa: 'او اینجا است.', meaningEn: 'He is here.' },
  { subject: 'ea', fa: 'او؛ مؤنث', en: 'she', verb: 'este', example: 'Ea este aici.', meaningFa: 'او اینجا است.', meaningEn: 'She is here.' },
  { subject: 'noi', fa: 'ما', en: 'we', verb: 'suntem', example: 'Noi suntem aici.', meaningFa: 'ما اینجا هستیم.', meaningEn: 'We are here.' },
  { subject: 'voi', fa: 'شما؛ چند نفر، خودمانی', en: 'you; several people, informal', verb: 'sunteți', example: 'Voi sunteți aici.', meaningFa: 'شما اینجا هستید.', meaningEn: 'You are here.' },
  { subject: 'ei', fa: 'آن‌ها؛ مردان یا گروه ترکیبی', en: 'they; masculine or mixed group', verb: 'sunt', example: 'Ei sunt aici.', meaningFa: 'آن‌ها اینجا هستند.', meaningEn: 'They are here.' },
  { subject: 'ele', fa: 'آن‌ها؛ زنان یا گروه مؤنث', en: 'they; feminine group', verb: 'sunt', example: 'Ele sunt aici.', meaningFa: 'آن‌ها اینجا هستند.', meaningEn: 'They are here.' },
  { subject: 'dumneavoastră', fa: 'شما؛ محترمانه، یک یا چند نفر', en: 'you; polite, one or several people', verb: 'sunteți', example: 'Dumneavoastră sunteți aici.', meaningFa: 'شما اینجا هستید.', meaningEn: 'You are here.' },
] as const;

const examples = [
  { ro: 'Eu sunt aici.', fa: 'من اینجا هستم.', en: 'I am here.' },
  { ro: 'Ea este studentă.', fa: 'او دانشجو است (زن).', en: 'She is a student.' },
  { ro: 'Ei sunt studenți.', fa: 'آن‌ها دانشجو هستند (مردان یا گروه ترکیبی).', en: 'They are students (masculine or mixed group).' },
  { ro: 'Ele sunt studente.', fa: 'آن‌ها دانشجو هستند (زنان).', en: 'They are students (women).' },
  { ro: 'Dumneavoastră sunteți aici.', fa: 'شما (محترمانه) اینجا هستید.', en: 'You are here (polite).' },
] as const;

const prompts = [
  { fa: 'او (زن) اینجا است.', en: 'She is here.', answer: 'Ea este aici.', hintFa: 'برای «او» مؤنث از ea استفاده کنید.', hintEn: 'Use ea for a female third-person subject.' },
  { fa: 'آن‌ها (زنان) اینجا هستند.', en: 'They (women) are here.', answer: 'Ele sunt aici.', hintFa: 'جمع مؤنث ele است و فعل آن sunt.', hintEn: 'The feminine plural is ele; its verb is sunt.' },
  { fa: 'ما اینجا هستیم.', en: 'We are here.', answer: 'Noi suntem aici.', hintFa: 'برای «ما» از noi suntem استفاده کنید.', hintEn: 'Use noi suntem for “we are”.' },
  { fa: 'شما (محترمانه) اینجا هستید.', en: 'You are here (polite).', answer: 'Dumneavoastră sunteți aici.', hintFa: 'خطاب محترمانه با صورت دوم‌شخص جمع فعل می‌آید.', hintEn: 'Polite address takes the second-person plural verb form.' },
] as const;

const stagesFa = ['هدف', 'شنیدن', 'قاعده', 'نوشتن', 'گفتن'];
const stagesEn = ['Goal', 'Listen', 'Rule', 'Write', 'Speak'];
const minutes = [2, 3, 4, 4, 2];

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO').replace(/[.!?]+$/g, '').replace(/\s+/g, ' ');
}

export function SubjectPronounsFoundationLesson({ lang }: { lang: Language }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [passed, setPassed] = React.useState<number[]>([]);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const correct = normalize(answer) === normalize(prompts[index].answer);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (correct) setPassed(previous => previous.includes(index) ? previous : [...previous, index]);
  }

  function nextPrompt() {
    if (index < prompts.length - 1) {
      setIndex(index + 1);
      setAnswer('');
      setChecked(false);
    } else setStage(4);
  }

  return <div dir={isFa ? 'rtl' : 'ltr'} className="space-y-6">
    <Link href="/learn-romanian/fundamente" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به مسیر درس‌های پایه' : '← Back to the foundation path'}</Link>
    <header className="dark-hero-panel space-y-3 rounded-3xl p-7 text-white sm:p-10">
      <p className="text-sm font-bold text-blue-100">{isFa ? 'درس ۲ مسیر جمله‌سازی · حدود ۱۵ دقیقه' : 'Sentence path lesson 2 · about 15 minutes'}</p>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{isFa ? 'ضمیرهای فاعلی: از من و تو تا او و آن‌ها' : 'Subject pronouns: I, you, he, she, and they'}</h1>
      <p className="max-w-3xl leading-7 text-blue-50">{isFa ? 'فاعل می‌گوید دربارهٔ چه کسی صحبت می‌کنیم. همهٔ صورت‌های مفرد، جمع، سوم‌شخص و خطاب محترمانه را اینجا با مثال یاد می‌گیرید.' : 'The subject tells us whom the sentence is about. Learn singular, plural, third-person, and polite forms here with examples.'}</p>
    </header>

    <article aria-labelledby="pronoun-reference" className="space-y-6 rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm sm:p-8">
      <div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'درسنامه · از آغاز صفحه در دسترس' : 'LESSON REFERENCE · AVAILABLE FROM THE START'}</p><h2 id="pronoun-reference" className="mt-1 text-2xl font-extrabold">{isFa ? 'ضمیر فاعلی چیست و کدام صورت را انتخاب کنیم؟' : 'What is a subject pronoun and which form do we choose?'}</h2><p className="mt-2 text-sm leading-7 text-slate-700">{isFa ? 'ضمیر فاعلی جای نام شخص یا گروه می‌نشیند: در «Ea este aici.»، واژهٔ ea یعنی «او» و فاعل جمله است. شکل فعل با شخص و شمار فاعل هماهنگ می‌شود؛ صرف کامل فعل a fi را در درس بعد تمرین می‌کنید.' : 'A subject pronoun stands for a person or group. In “Ea este aici.”, ea means “she” and is the subject. The verb form agrees with the subject; you will practise the full a fi conjugation in the next lesson.'}</p></div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[580px] text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-start">{isFa ? 'ضمیر فاعلی' : 'Subject'}</th><th className="p-3 text-start">{isFa ? 'معنی و کاربرد' : 'Meaning and use'}</th><th className="p-3 text-start">{isFa ? 'شکل فعل «بودن»' : 'Form of “to be”'}</th><th className="p-3 text-start">{isFa ? 'مثال' : 'Example'}</th></tr></thead><tbody>{forms.map(row => <tr key={row.subject} className="border-t border-slate-100"><td lang="ro" dir="ltr" className="p-3 font-extrabold text-[#1554bd]">{row.subject}</td><td className="p-3"><MeaningLines en={row.en} fa={row.fa} lang={lang} /></td><td lang="ro" dir="ltr" className="p-3 font-bold">{row.verb}</td><td className="p-3"><span lang="ro" dir="ltr" className="block font-semibold">{row.example}</span><MeaningLines en={row.meaningEn} fa={row.meaningFa} lang={lang} className="mt-1" /></td></tr>)}</tbody></table></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-violet-50 p-4"><h3 className="font-extrabold text-violet-950">{isFa ? 'سوم‌شخص را کامل ببینید' : 'All third-person forms'}</h3><p lang="ro" dir="ltr" className="mt-2 text-lg font-bold">el / ea → este · ei / ele → sunt</p><p className="mt-2 text-sm leading-6">{isFa ? 'el برای یک مرد یا اسم مذکر، ea برای یک زن یا اسم مؤنث است. ei برای جمع مذکر یا گروه ترکیبی، ele برای جمع مؤنث به کار می‌رود. جنس ضمیر فرق می‌کند، ولی فعل در هر جفت یکسان است.' : 'El/ea refer to masculine/feminine singular subjects; ei/ele to masculine or mixed/feminine plural subjects. The pronoun changes with gender, while each pair shares one verb form.'}</p></div>
        <div className="rounded-2xl bg-amber-50 p-4"><h3 className="font-extrabold text-amber-950">{isFa ? 'شما؛ جمع یا محترمانه؟' : 'Plural or polite “you”?'}</h3><p lang="ro" dir="ltr" className="mt-2 text-lg font-bold">voi sunteți · dumneavoastră sunteți</p><p className="mt-2 text-sm leading-6">{isFa ? 'voi برای چند نفر در گفت‌وگوی خودمانی است. dumneavoastră خطاب محترمانه به یک نفر یا چند نفر است و مانند voi فعل دوم‌شخص جمع می‌گیرد.' : 'Voi addresses several people informally. Dumneavoastră is polite for one or several people and takes the same second-person plural verb form as voi.'}</p></div>
      </div>
      <div className="rounded-2xl border border-slate-200 p-4"><h3 className="font-extrabold">{isFa ? 'چه وقت ضمیر را بیاوریم؟' : 'When do we say the pronoun?'}</h3><p className="mt-2 text-sm leading-7 text-slate-700">{isFa ? 'وقتی شکل فعل و بافت، فاعل را روشن می‌کنند، ضمیر را می‌توان حذف کرد: «Eu sunt aici.» و «Sunt aici.» هر دو «من اینجا هستم» هستند. برای تأکید، مقایسه یا رفع ابهام ضمیر را می‌آوریم: «Ea este aici.» چون «Este aici.» به‌تنهایی جنس فاعل را نشان نمی‌دهد. ضمیرهای مفعولی مانند mă و te نقش دیگری دارند و در درس بعدیِ ضمایر می‌آیند.' : 'When the verb form and context identify the subject, the pronoun can be omitted: “Eu sunt aici.” and “Sunt aici.” both mean “I am here.” Keep it for emphasis, contrast, or clarity: “Ea este aici.” identifies a female subject, while “Este aici.” alone does not. Object forms such as mă and te have another role and belong to a later pronoun lesson.'}</p></div>
      <div><h3 className="font-extrabold">{isFa ? 'جمله‌ها را در بافت ببینید و بشنوید' : 'See and hear the forms in context'}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{examples.map(item => <div key={item.ro} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p lang="ro" dir="ltr" className="text-lg font-bold text-[#1554bd]">{item.ro}</p><MeaningLines en={item.en} fa={item.fa} lang={lang} className="mt-1 text-sm" /><PronunciationAudio currentLang={lang} label={item.ro} className="mt-2" /></div>)}</div></div>
    </article>
    <LessonStageNav lang={lang} labels={isFa ? stagesFa : stagesEn} stage={stage} onSelect={setStage} minutes={minutes} />

    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">{isFa ? 'هدف: فاعل را در جمله پیدا کنید' : 'Goal: find the subject'}</h2><p className="leading-7">{isFa ? 'در «Eu am un bilet.»، eu فاعل است: کسی که بلیت دارد. un bilet چیزی است که او دارد. برای فاعل سوم‌شخص به el، ea، ei یا ele نگاه کنید.' : 'In “Eu am un bilet.”, eu is the subject: the person who has the ticket. Un bilet is the thing they have. For third-person subjects, look for el, ea, ei, or ele.'}</p><button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'شنیدن نمونه‌ها ←' : 'Listen to examples →'}</button></section>}
    {stage === 1 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">{isFa ? 'تفاوت سوم‌شخص مفرد و جمع را بشنوید' : 'Listen to singular and plural third person'}</h2><div className="grid gap-3 sm:grid-cols-2">{examples.map(item => <div key={item.ro} className="rounded-xl bg-blue-50 p-4"><p lang="ro" dir="ltr" className="text-lg font-bold">{item.ro}</p><PronunciationAudio currentLang={lang} label={item.ro} className="mt-2" /><MeaningLines en={item.en} fa={item.fa} lang={lang} className="mt-2 text-sm" /></div>)}</div><button type="button" onClick={() => setStage(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'مرور قاعده ←' : 'Review the rule →'}</button></section>}
    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">{isFa ? 'شخص، شمار و جنس را با هم بررسی کنید' : 'Check person, number, and gender together'}</h2><p className="leading-7">{isFa ? 'یک نفر: el یا ea با este. چند نفر: ei یا ele با sunt. «شما» در جمع خودمانی voi و در خطاب محترمانه dumneavoastră است؛ هر دو sunteți می‌گیرند. در جملهٔ بعد، فعل‌های a fi و a avea را کامل صرف می‌کنید.' : 'One third-person subject: el or ea with este. Several: ei or ele with sunt. Informal plural voi and polite dumneavoastră both take sunteți. In the next lesson you will fully conjugate a fi and a avea.'}</p><button type="button" onClick={() => { setStage(3); setIndex(0); setAnswer(''); setChecked(false); }} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین نوشتن ←' : 'Write the forms →'}</button></section>}
    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? `پرسش ${index + 1} از ${prompts.length}` : `Prompt ${index + 1} of ${prompts.length}`}</p><h2 className="text-xl font-extrabold">{isFa ? `«${prompts[index].fa}» را به رومانیایی بنویسید.` : `Write “${prompts[index].en}” in Romanian.`}</h2><form onSubmit={submit} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" autoComplete="off" aria-label={isFa ? 'جملهٔ رومانیایی' : 'Romanian sentence'} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="min-w-56 flex-1 rounded-xl border border-slate-300 p-3 text-lg" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>{checked && <p role="status" className={`rounded-xl p-3 ${correct ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{correct ? (isFa ? 'درست است؛ ضمیر و فعل با هم هماهنگ‌اند.' : 'Correct. The pronoun and verb form agree.') : (isFa ? prompts[index].hintFa : prompts[index].hintEn)}</p>}{checked && !correct && <button type="button" onClick={() => setAnswer(prompts[index].answer)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'نمایش پاسخ' : 'Show answer'}</button>}{passed.includes(index) && <button type="button" onClick={nextPrompt} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{isFa ? index < prompts.length - 1 ? 'پرسش بعدی ←' : 'تمرین گفتاری ←' : index < prompts.length - 1 ? 'Next prompt →' : 'Speaking practice →'}</button>}</section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-6"><h2 className="text-xl font-extrabold text-emerald-900">{isFa ? 'یک جملهٔ سوم‌شخص را بلند بگویید' : 'Say a third-person sentence aloud'}</h2><div className="rounded-2xl bg-emerald-50 p-4"><p lang="ro" dir="ltr" className="text-2xl font-extrabold">Ele sunt aici.</p><p className="mt-1 text-sm">{isFa ? 'آن‌ها (زنان) اینجا هستند.' : 'They (women) are here.'}</p><PronunciationAudio currentLang={lang} label="Ele sunt aici." className="mt-2" /></div><SpokenWordCheck word="Ele sunt aici." lang={lang} /><label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'جمله را بلند گفتم و جدول را مرور کردم.' : 'I said the sentence aloud and reviewed the table.'}</label>{saidAloud && <p role="status" className="rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-900">{isFa ? `${passed.length} پاسخ از ${prompts.length} پاسخ نوشتاری درست بود.` : `${passed.length} of ${prompts.length} written answers were correct.`}</p>}<Link href="/learn-romanian/fundamente/fi-avea" className="inline-flex rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'درس بعد: صرف فعل ←' : 'Next: verb conjugation →'}</Link></section>}
  </div>;
}

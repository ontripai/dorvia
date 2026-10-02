'use client';

import { MeaningLines } from './MeaningLines';

import React from 'react';
import { LessonStageNav } from './LessonStageNav';
import type { RomanianWord } from '@/lib/romanian/types';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';
import { SpokenWordCheck } from './SpokenWordCheck';
import { NUMBER_GENDER_FOUNDATION_LESSON as lesson } from '@/content/romanian/number-gender-foundation-lesson';

type Sample = (typeof lesson.samples)[number] & { word: RomanianWord };
const stagesFa = ['قاعده', 'شنیدن نمونه‌ها', 'نوشتن', 'گفتن', 'نتیجه'];
const stagesEn = ['The rule', 'Hear examples', 'Write', 'Speak', 'Result'];
const stageMinutes = [2, 3, 4, 4, 2];

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO').replace(/\s+/g, ' ');
}

function genderLabel(gender: 'm' | 'f' | 'n', isFa: boolean) {
  if (isFa) return gender === 'm' ? 'مذکر' : gender === 'f' ? 'مؤنث' : 'خنثی';
  return gender === 'm' ? 'masculine' : gender === 'f' ? 'feminine' : 'neuter';
}

export function NumberGenderFoundationLesson({ lang, samples }: { lang: Language; samples: [Sample, Sample, Sample] }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState<number[]>([]);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const prompt = lesson.prompts[index];
  const sample = samples[prompt.sample];
  const expected = prompt.number === 'singular' ? sample.singular : sample.pluralForm;
  const correct = normalize(answer) === normalize(expected);
  const storageKey = 'dorvia:ro-foundation-number-gender:complete';

  React.useEffect(() => {
    try { setSaved(window.localStorage.getItem(storageKey) === 'true'); } catch { /* optional */ }
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (correct) setWritten(previous => previous.includes(index) ? previous : [...previous, index]);
  }

  function complete() {
    try { window.localStorage.setItem(storageKey, 'true'); } catch { /* progress remains for this visit */ }
    setSaved(true);
    setStage(4);
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <Link href="/learn-romanian" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به آموزش رومانیایی' : '← Back to Romanian lessons'}</Link>
    <header className="dark-hero-panel space-y-4 rounded-3xl p-7 text-white sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-blue-100">{isFa ? 'درس پایه · حدود ۱۵ دقیقه' : 'Foundation · about 15 minutes'}</p><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{isFa ? 'یک اسم + عدد + جمله' : 'Noun + number + sentence'}</span></div>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{isFa ? lesson.titleFa : lesson.titleEn}</h1>
      <p className="max-w-3xl leading-7 text-blue-50">{isFa ? lesson.introFa : lesson.introEn}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { number: '1', forms: 'un elev', label: isFa ? 'مذکر' : 'Masculine', sub: 'un / doi' },
          { number: '2', forms: 'o casă', label: isFa ? 'مؤنث' : 'Feminine', sub: 'o / două' },
          { number: '3', forms: 'un bilet', label: isFa ? 'خنثی' : 'Neuter', sub: 'un / două' },
        ].map(item => <div key={item.number} className="rounded-2xl border border-white/20 bg-white/10 p-4"><p className="text-xs font-bold text-blue-100">{item.label}</p><p lang="ro" dir="ltr" className="mt-1 text-xl font-extrabold">{item.forms}</p><p className="mt-1 text-sm text-blue-100">{item.sub}</p></div>)}
      </div>
      <p className="text-xs text-blue-100">{isFa ? 'پخش واژه‌ها با گفتار مصنوعی مرورگر انجام می‌شود، نه صدای ضبط‌شدهٔ بازبینی‌شده.' : 'Words use browser speech synthesis, not reviewed speaker recordings.'}</p>
    </header>

    <article aria-labelledby="noun-reference" className="space-y-5 rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm sm:p-8">
      <div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'درسنامهٔ کامل · پیش از تمرین' : 'COMPLETE REFERENCE · BEFORE PRACTICE'}</p><h2 id="noun-reference" className="mt-1 text-2xl font-extrabold">{isFa ? 'اسم، جنس، مفرد و جمع' : 'Nouns, gender, singular, and plural'}</h2><p className="mt-2 text-sm leading-7 text-slate-700">{isFa ? 'اسم نام شخص یا چیز است: elev «دانش‌آموز»، casă «خانه» و bilet «بلیت». در رومانیایی هر اسم جنس دستوریِ مذکر، مؤنث یا خنثی دارد. این جنس ویژگی واژه است؛ مثلاً خانه مؤنث و بلیت خنثی است و به جنس طبیعی اشاره نمی‌کند. شمار هم می‌گوید یک چیز داریم یا چند چیز.' : 'A noun names a person or thing: elev “pupil”, casă “house”, bilet “ticket”. Romanian nouns have grammatical gender: masculine, feminine, or neuter. This belongs to the word; a house is feminine and a ticket neuter, without referring to natural sex. Number tells us whether we mean one or several.'}</p></div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[520px] text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-start">{isFa ? 'جنس' : 'Gender'}</th><th className="p-3 text-start">{isFa ? 'یک: حرف تعریف + اسم' : 'One: article + noun'}</th><th className="p-3 text-start">{isFa ? 'دو: عدد + جمع اسم' : 'Two: number + plural noun'}</th><th className="p-3 text-start">{isFa ? 'معنی' : 'Meaning'}</th></tr></thead><tbody>{samples.map(item => <tr key={item.wordId} className="border-t border-slate-100"><td className="p-3 font-bold">{genderLabel(item.gender, isFa)}</td><td lang="ro" dir="ltr" className="p-3 font-bold text-[#1554bd]">{item.singular}</td><td lang="ro" dir="ltr" className="p-3 font-bold text-[#1554bd]">{item.pluralForm}</td><td className="p-3">{isFa ? `${item.singularFa} / ${item.pluralFa}` : `${item.singularEn} / ${item.pluralEn}`}</td></tr>)}</tbody></table></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-blue-50 p-4"><h3 className="font-extrabold">{isFa ? 'قاعدهٔ «یک» و «دو»' : 'The “one” and “two” pattern'}</h3><p className="mt-2 text-sm leading-7">{isFa ? 'برای یک اسم مذکر یا خنثی، un و برای مؤنث o می‌آید. برای «دو» با مذکر doi و با مؤنث و خنثی două می‌آید. این‌ها قبل از اسم قرار می‌گیرند.' : 'Use un before a masculine or neuter singular noun, and o before a feminine one. With “two”, use doi for masculine nouns and două for feminine and neuter nouns. These forms precede the noun.'}</p></div><div className="rounded-2xl bg-amber-50 p-4"><h3 className="font-extrabold">{isFa ? 'اسم خنثی و تغییر جمع' : 'Neuter nouns and plural forms'}</h3><p className="mt-2 text-sm leading-7">{isFa ? 'خنثی در مفرد مانند مذکر و در جمع مانند مؤنث رفتار می‌کند: un bilet، اما două bilete. خودِ اسم نیز در جمع تغییر می‌کند: elev → elevi، casă → case، bilet → bilete. پس هر اسم را با جنس و جمعش یاد بگیرید.' : 'Neuter behaves like masculine in the singular and feminine in the plural: un bilet, but două bilete. The noun itself changes in the plural: elev → elevi, casă → case, bilet → bilete. Learn each noun with its gender and plural.'}</p></div></div>
      <div className="rounded-2xl border border-slate-200 p-4"><h3 className="font-extrabold">{isFa ? 'از عبارت تا جمله' : 'From phrase to sentence'}</h3><p lang="ro" dir="ltr" className="mt-2 text-lg font-bold text-[#1554bd]">Eu am un bilet. · Eu am două bilete.</p><p className="mt-1 text-sm">{isFa ? 'من یک بلیت دارم. · من دو بلیت دارم. در درس‌های بعد، ضمیر eu و فعل am را به‌طور کامل یاد می‌گیرید.' : 'I have one ticket. · I have two tickets. The next lessons teach the pronoun eu and verb am fully.'}</p><PronunciationAudio currentLang={lang} label="Eu am un bilet. Eu am două bilete." className="mt-3" /></div>
    </article>
    <LessonStageNav lang={lang} labels={isFa ? stagesFa : stagesEn} stage={stage} onSelect={setStage} minutes={stageMinutes} />

    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'الگوی ساده را به خاطر بسپارید' : 'Remember the basic pattern'}</h2><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-blue-50 p-4"><strong>{isFa ? 'مذکر' : 'Masculine'}</strong><p className="mt-2" lang="ro" dir="ltr">un elev → doi elevi</p></div><div className="rounded-xl bg-blue-50 p-4"><strong>{isFa ? 'مؤنث' : 'Feminine'}</strong><p className="mt-2" lang="ro" dir="ltr">o casă → două case</p></div><div className="rounded-xl bg-amber-50 p-4"><strong>{isFa ? 'خنثی' : 'Neuter'}</strong><p className="mt-2" lang="ro" dir="ltr">un bilet → două bilete</p></div></div><p className="text-sm leading-6 text-slate-600">{isFa ? 'اسم خنثی در مفرد از un استفاده می‌کند، اما در جمع با două می‌آید. جنس دستوری ویژگی خود اسم است و همیشه به جنس طبیعی اشاره نمی‌کند.' : 'A neuter noun uses un in the singular and două in the plural. Grammatical gender belongs to the noun and does not always refer to natural sex.'}</p><button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'شنیدن مثال‌ها ←' : 'Hear the examples →'}</button></section>}

    {stage === 1 && <section className="space-y-4"><div><h2 className="text-xl font-bold">{isFa ? 'هر دو شکل را با اسم بشنوید' : 'Hear both forms with the noun'}</h2><p className="mt-1 text-sm text-slate-600">{isFa ? 'صورت مفرد و جمع را جدا پخش کنید. آوانویسی فارسی تقریبی است و IPA تلفظ را دقیق‌تر نشان می‌دهد.' : 'Play the singular and plural separately. The Persian guide is approximate; IPA is more precise.'}</p></div><div className="grid gap-4 md:grid-cols-3">{samples.map(item => <article key={item.wordId} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-2"><p className="text-2xl font-bold" lang="ro" dir="ltr">{item.word.lemma}</p><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1554bd]">{genderLabel(item.gender, isFa)}</span></div><MeaningLines en={item.word.translations.en} fa={item.word.translations.fa} lang={lang} className="text-sm" /><div className="rounded-xl bg-slate-50 p-3"><p className="font-semibold" lang="ro" dir="ltr">{item.singular}</p><p className="mt-1 text-sm">{isFa ? item.singularPronFa : item.singularIPA}</p><PronunciationAudio currentLang={lang} label={item.singular} className="mt-2" /></div><div className="rounded-xl bg-slate-50 p-3"><p className="font-semibold" lang="ro" dir="ltr">{item.pluralForm}</p><p className="mt-1 text-sm">{isFa ? item.pluralPronFa : item.pluralIPA}</p><PronunciationAudio currentLang={lang} label={item.pluralForm} className="mt-2" /></div><p className="text-sm leading-6 text-slate-600">{isFa ? item.noteFa : item.noteEn}</p><details className="text-sm text-slate-600"><summary className="cursor-pointer font-semibold">{isFa ? 'بیشتر دربارهٔ واژه' : 'More about the word'}</summary><p className="mt-2">{isFa ? 'جمع:' : 'Plural:'} {item.word.plural} · {isFa ? 'منبع:' : 'Source:'} {item.word.source.label}</p><a href={item.word.source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[#1554bd] underline">{isFa ? 'بازکردن منبع' : 'Open source'}</a></details></article>)}</div><button type="button" onClick={() => { setStage(2); setIndex(0); setAnswer(''); setChecked(false); }} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین نوشتن ←' : 'Practise writing →'}</button></section>}

    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold text-[#1554bd]">{isFa ? `پرسش ${index + 1} از ${lesson.prompts.length}` : `Prompt ${index + 1} of ${lesson.prompts.length}`}</p><h2 className="text-xl font-bold">{isFa ? `«${prompt.fa}» را به رومانیایی بنویسید.` : `Write “${prompt.en}” in Romanian.`}</h2><form onSubmit={submit} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" autoComplete="off" aria-label={isFa ? 'پاسخ به رومانیایی' : 'Romanian answer'} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="min-w-56 rounded-xl border border-slate-300 p-3 text-lg" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>{checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? (isFa ? 'درست است؛ به حرف تعریف و شکل عدد توجه کردید.' : 'Correct. You matched the article and number form.') : (isFa ? 'هنوز درست نیست؛ جنس اسم و صورت مفرد یا جمع را بررسی کنید.' : 'Not quite. Check the noun gender and singular or plural form.')}</p>}{checked && !correct && <button type="button" onClick={() => setAnswer(expected)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'نمایش پاسخ' : 'Show answer'}</button>}{written.includes(index) && <button type="button" onClick={() => { if (index < lesson.prompts.length - 1) { setIndex(index + 1); setAnswer(''); setChecked(false); } else setStage(3); }} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{isFa ? index < lesson.prompts.length - 1 ? 'پرسش بعدی ←' : 'تمرین گفتاری ←' : index < lesson.prompts.length - 1 ? 'Next prompt →' : 'Speaking practice →'}</button>}</section>}

    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">{isFa ? 'در باجهٔ بلیت جواب بدهید' : 'Answer at the ticket counter'}</h2><div className="rounded-2xl bg-blue-50 p-5"><p className="text-xs font-bold text-slate-600">{isFa ? 'فروشنده می‌پرسد:' : 'The clerk asks:'}</p><p lang="ro" dir="ltr" className="mt-1 text-xl font-bold">{lesson.speakingQuestion}</p><p className="mt-4 text-xs font-bold text-slate-600">{isFa ? 'پاسخ شما:' : 'Your reply:'}</p><p lang="ro" dir="ltr" className="mt-1 text-2xl font-bold text-[#1554bd]">{lesson.speakingPhrase}</p><p className="mt-2">{isFa ? lesson.speakingFa : lesson.speakingEn}</p><p className="mt-2 text-sm text-slate-600">{isFa ? lesson.speakingNoteFa : lesson.speakingNoteEn}</p><PronunciationAudio currentLang={lang} label={`${lesson.speakingQuestion} ${lesson.speakingPhrase}`} className="mt-3" /></div><SpokenWordCheck word={lesson.speakingPhrase} lang={lang} /><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'پاسخ را بلند تکرار کردم' : 'I repeated the reply aloud'}</label><button type="button" disabled={!saidAloud} onClick={complete} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'ثبت پایان درس' : 'Complete lesson'}</button></section>}

    {stage === 4 && <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-emerald-800">{isFa ? saved ? 'تمرین عدد یک و دو کامل شد' : 'تمرین این بار تمام شد' : saved ? 'One and two practice complete' : 'Practice finished for now'}</h2><p>{isFa ? `${written.length} پاسخ از ${lesson.prompts.length} پاسخ را درست نوشتید و تمرین گفتاری را انجام دادید.` : `You wrote ${written.length} of ${lesson.prompts.length} answers correctly and completed the speaking practice.`}</p><p className="text-sm text-slate-600">{isFa ? 'تشخیص گفتار فقط متن را مقایسه می‌کند و تلفظ را نمره نمی‌دهد.' : 'Speech recognition compares text only; it does not score pronunciation.'}</p><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setStage(0); setIndex(0); setAnswer(''); setChecked(false); setWritten([]); setSaidAloud(false); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button><Link href="/learn-romanian/lectie/bilet" className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'ادامه به گفت‌وگوی بلیت' : 'Continue to the ticket dialogue'}</Link></div></section>}
  </div>;
}

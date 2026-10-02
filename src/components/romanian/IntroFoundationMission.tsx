'use client';

import { MeaningLines } from './MeaningLines';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { SpokenWordCheck } from '@/components/romanian/SpokenWordCheck';

type Props = { lang: 'fa' | 'en'; stage: 0 | 1 | 2 | 4; onNext: () => void; passed: number; total: number; next: string };

const dialogue = [
  { speakerFa: 'کارمند', speakerEn: 'Staff member', ro: 'Bună ziua! Dumneavoastră sunteți Ana?', fa: 'روز بخیر! شما خانم آنا هستید؟', en: 'Good day! Are you Ana?' },
  { speakerFa: 'آنا', speakerEn: 'Ana', ro: 'Bună ziua! Da, eu sunt Ana.', fa: 'روز بخیر! بله، من آنا هستم.', en: 'Good day! Yes, I am Ana.' },
  { speakerFa: 'کارمند', speakerEn: 'Staff member', ro: 'Aveți un bilet?', fa: 'بلیت دارید؟', en: 'Do you have a ticket?' },
  { speakerFa: 'آنا', speakerEn: 'Ana', ro: 'Da, am un bilet.', fa: 'بله، یک بلیت دارم.', en: 'Yes, I have a ticket.' },
];

export function IntroFoundationMission({ lang, stage, onNext, passed, total, next }: Props) {
  const isFa = lang === 'fa';
  const [choice, setChoice] = React.useState<string | null>(null);
  const [showMeaning, setShowMeaning] = React.useState(false);
  const [personName, setPersonName] = React.useState('Ana');
  const [spoken, setSpoken] = React.useState(false);
  const name = personName.trim() || 'Ana';
  const personalSentence = `Eu sunt ${name}.`;

  if (stage === 0) return <section className="space-y-5 rounded-2xl border border-blue-200 bg-white p-5 sm:p-7" aria-labelledby="intro-mission-start">
    <div className="flex flex-wrap items-center gap-3"><span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-2xl">🎫</span><div><p className="text-sm font-bold text-[#1554bd]">{isFa ? 'موقعیت · پیشخوان بلیت' : 'Scene · ticket counter'}</p><h2 id="intro-mission-start" className="text-xl font-extrabold">{isFa ? 'خودتان را معرفی کنید' : 'Introduce yourself'}</h2></div></div>
    <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-600">{isFa ? 'کارمند از شما می‌پرسد:' : 'The staff member asks:'}</p><p lang="ro" dir="ltr" className="mt-2 text-lg font-bold">Dumneavoastră sunteți Ana?</p><MeaningLines en="Are you Ana?" fa="شما آنا هستید؟" lang={lang} className="mt-1" /><PronunciationAudio currentLang={lang} label="Dumneavoastră sunteți Ana?" variant="compact" className="mt-2" /></div>
    <fieldset className="space-y-2"><legend className="mb-3 font-bold">{isFa ? 'اگر شما آنا هستید، چه پاسخی می‌دهید؟' : 'If you are Ana, what do you say?'}</legend>{[
      { ro: 'Da, eu sunt Ana.', fa: 'بله، من آنا هستم.', en: 'Yes, I am Ana.' },
      { ro: 'Da, eu ești Ana.', fa: 'صورت فعل با «من» هماهنگ نیست.', en: 'The verb does not match “I”.' },
      { ro: 'Da, eu am Ana.', fa: 'am یعنی «دارم»؛ برای هویت از sunt استفاده کنید.', en: 'Am means “have”; identity needs sunt.' },
    ].map(option => <button key={option.ro} type="button" aria-pressed={choice === option.ro} onClick={() => setChoice(option.ro)} className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border p-3 text-start transition ${choice === option.ro ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}><span lang="ro" dir="ltr" className="font-bold">{option.ro}</span><span className="text-xs text-slate-600">{choice === option.ro ? option[lang] : ''}</span></button>)}</fieldset>
    {choice && <p role="status" className={`rounded-xl p-3 text-sm font-semibold ${choice === 'Da, eu sunt Ana.' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`}>{choice === 'Da, eu sunt Ana.' ? isFa ? 'درست است: eu با sunt می‌آید.' : 'Correct: eu takes sunt.' : isFa ? 'دوباره انتخاب کنید. برای «من هستم» از eu sunt استفاده می‌شود.' : 'Try again. “I am” is eu sunt.'}</p>}
    <button type="button" disabled={choice !== 'Da, eu sunt Ana.'} onClick={onNext} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-40">{isFa ? 'شنیدن گفت‌وگو ←' : 'Hear the dialogue →'}</button>
  </section>;

  if (stage === 1) return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="intro-dialogue">
    <div><p className="text-sm font-bold text-[#1554bd]">{isFa ? 'گفت‌وگوی کوتاه' : 'Short dialogue'}</p><h2 id="intro-dialogue" className="text-xl font-extrabold">{isFa ? 'بشنوید، سپس نقش آنا را بگویید' : 'Listen, then speak Ana’s lines'}</h2></div>
    <div className="space-y-3">{dialogue.map((line, i) => <div key={line.ro} className={`max-w-[92%] rounded-2xl p-4 sm:max-w-[80%] ${i % 2 ? 'ms-auto bg-emerald-50' : 'me-auto bg-blue-50'}`}><p className="text-xs font-bold text-slate-600">{isFa ? line.speakerFa : line.speakerEn}</p><p lang="ro" dir="ltr" className="mt-1 text-lg font-bold">{line.ro}</p><MeaningLines en={line.en} fa={showMeaning ? line.fa : undefined} lang={lang} className="mt-1" /><PronunciationAudio currentLang={lang} label={line.ro} variant="compact" className="mt-2" /></div>)}</div>
    <div className="flex flex-wrap gap-2"><button type="button" aria-pressed={showMeaning} onClick={() => setShowMeaning(!showMeaning)} className="rounded-xl border border-blue-300 px-4 py-2 font-bold text-[#1554bd]">{showMeaning ? isFa ? 'پنهان‌کردن معنی' : 'Hide meaning' : isFa ? 'نمایش معنی' : 'Show meaning'}</button><button type="button" onClick={onNext} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'کشف قاعده ←' : 'Notice the rule →'}</button></div>
  </section>;

  if (stage === 2) return <RuleChoice lang={lang} onNext={onNext} />;

  return <section className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-5 sm:p-7" aria-labelledby="intro-result">
    <div><p className="text-sm font-bold text-emerald-800">{isFa ? 'نتیجهٔ مأموریت' : 'Mission result'}</p><h2 id="intro-result" className="text-xl font-extrabold">{isFa ? 'این بار خودتان صحبت کنید' : 'Now make it yours'}</h2><p className="mt-2 text-sm text-slate-700">{isFa ? `${passed} پاسخ نوشتاری از ${total} پاسخ را درست نوشتید.` : `${passed} of ${total} written answers were correct.`}</p></div>
    <label className="block font-semibold" htmlFor="intro-name">{isFa ? 'نام خود را در جمله جایگزین کنید' : 'Put your name in the sentence'}</label><input id="intro-name" lang="ro" dir="ltr" value={personName} maxLength={30} onChange={event => setPersonName(event.target.value)} className="w-full max-w-xs rounded-xl border border-slate-300 p-3 text-lg" />
    <div className="rounded-2xl bg-emerald-50 p-4"><p lang="ro" dir="ltr" className="text-xl font-extrabold text-emerald-950">{personalSentence}</p><MeaningLines en={`I am ${name}.`} fa={`من ${name} هستم.`} lang={lang} /><PronunciationAudio currentLang={lang} label={personalSentence} variant="compact" className="mt-2" /><SpokenWordCheck key={personalSentence} word={personalSentence} lang={lang} /></div>
    <p className="text-sm text-slate-600">{isFa ? 'پاسخ صوتیِ مرورگر فقط متن شنیده‌شده را نشان می‌دهد و نمرهٔ تلفظ نیست.' : 'Speech recognition only shows transcribed text; it is not a pronunciation score.'}</p>
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold"><input type="checkbox" checked={spoken} onChange={event => setSpoken(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'جملهٔ شخصی و پاسخ بلیت را بلند گفتم.' : 'I said my introduction and ticket answer aloud.'}</label>
    {spoken && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900">{isFa ? 'مأموریت معرفی کامل شد. می‌توانید دوباره گفت‌وگو کنید یا درس بعد را شروع کنید.' : 'Introduction complete. Repeat the dialogue or continue.'}</p>}
    <Link href={next} className="inline-flex rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'درس بعدی ←' : 'Next lesson →'}</Link>
  </section>;
}

function RuleChoice({ lang, onNext }: { lang: 'fa' | 'en'; onNext: () => void }) {
  const isFa = lang === 'fa';
  const [choice, setChoice] = React.useState<string | null>(null);
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="intro-rule">
    <h2 id="intro-rule" className="text-xl font-extrabold">{isFa ? 'کدام فعل برای خطاب محترمانه درست است؟' : 'Which form fits polite address?'}</h2><p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-4 text-lg font-bold">Dumneavoastră ___ Ana?</p>
    <div className="flex flex-wrap gap-3" role="group" aria-label={isFa ? 'انتخاب صورت فعل' : 'Choose the verb form'}>{['ești', 'sunteți', 'am'].map(form => <button key={form} type="button" aria-pressed={choice === form} onClick={() => setChoice(form)} className={`min-w-28 rounded-xl border px-5 py-3 font-bold ${choice === form ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`} lang="ro">{form}</button>)}</div>
    {choice && <p role="status" className={`rounded-xl p-4 text-sm font-semibold ${choice === 'sunteți' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`}>{choice === 'sunteți' ? isFa ? 'درست است. dumneavoastră برای خطاب محترمانه با sunteți می‌آید؛ tu با ești می‌آید.' : 'Correct. Polite dumneavoastră takes sunteți; informal tu takes ești.' : isFa ? 'این شکل مناسب نیست. به سطر dumneavoastră در جدول بالای صفحه نگاه کنید و دوباره انتخاب کنید.' : 'That form does not fit. Check the dumneavoastră row in the table above and try again.'}</p>}
    <button type="button" disabled={choice !== 'sunteți'} onClick={onNext} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-40">{isFa ? 'نوشتن پاسخ خودم ←' : 'Write my answer →'}</button>
  </section>;
}

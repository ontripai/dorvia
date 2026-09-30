'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';
import { SpokenWordCheck } from './SpokenWordCheck';

const lessons = {
  k: { letter: 'K k', name: 'ka / kapa', word: 'kilometru', fa: 'کیلومتر', en: 'kilometre', ruleFa: 'اسم مذکر: un kilometru، جمع kilometri، صورت مشخص kilometrul. در این واژه k صدای «ک» دارد.', ruleEn: 'Masculine noun: un kilometru, plural kilometri, definite kilometrul. Here k has a k sound.', source: 'https://dexonline.ro/definitie/kilometru', useFa: 'برای فاصلهٔ مسیر و سفر به کار می‌رود.', useEn: 'Used for travel distance.' },
  q: { letter: 'Q q', name: 'kü', word: 'quasar', fa: 'اختروش', en: 'quasar', ruleFa: 'اسم مذکرِ اصطلاح علمی: un quasar، جمع quasari، صورت مشخص quasarul. آغاز آن در فرهنگ «cua-» خوانده شده است؛ Q را در همهٔ وام‌واژه‌ها یکسان نخوانید.', ruleEn: 'Masculine scientific noun: un quasar, plural quasari, definite quasarul. Dictionary pronunciation begins “cua-”; Q in loans is not universally pronounced alike.', source: 'https://dexonline.ro/definitie/quasar/definitii', useFa: 'این واژه تخصصی است؛ شناخت حرف هدف درس است، نه حفظ واژه برای مکالمهٔ روزانه.', useEn: 'This is a specialist word; the goal is recognising the letter, not daily conversation vocabulary.' },
  w: { letter: 'W w', name: 'dublu ve', word: 'weekend', fa: 'آخر هفته', en: 'weekend', ruleFa: 'اسم خنثی: un weekend، جمع weekenduri، صورت مشخص weekendul. تلفظ این واژه از انگلیسی آمده است؛ W در همهٔ وام‌واژه‌ها یک صدای ثابت ندارد.', ruleEn: 'Neuter noun: un weekend, plural weekenduri, definite weekendul. This loan retains an English-influenced pronunciation; W varies across loans.', source: 'https://dexonline.ro/intrare/weekend/187448', useFa: 'در برنامه‌ریزی آخر هفته کاربرد دارد.', useEn: 'Useful for weekend plans.' },
  y: { letter: 'Y y', name: 'i grec', word: 'yoga', fa: 'یوگا', en: 'yoga', ruleFa: 'اسم مؤنث برای فعالیت/مکتب یوگا؛ در این جلسه جمع ساختگی برای آن تمرین نمی‌کنیم. تلفظ Y در وام‌واژه‌ها را باید برای هر واژه جدا بررسی کرد.', ruleEn: 'Feminine noun for yoga as an activity/tradition; no artificial plural is practised. Check Y pronunciation word by word in loans.', source: 'https://dexonline.ro/definitie/yoga/821328', useFa: 'در باشگاه و برنامهٔ ورزش دیده می‌شود.', useEn: 'Seen in fitness and class schedules.' },
} as const;

export type LoanLetterSlug = keyof typeof lessons;

export function LoanLetterLesson({ slug, lang }: { slug: LoanLetterSlug; lang: 'fa' | 'en' }) {
  const item = lessons[slug];
  const isFa = lang === 'fa';
  const stages = isFa ? ['شنیدن', 'کشف واژه', 'یادآوری', 'گفتن', 'نتیجه'] : ['Listen', 'Discover', 'Recall', 'Speak', 'Result'];
  const [stage, setStage] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState(false);
  const correct = answer.normalize('NFC').trim().toLocaleLowerCase('ro-RO') === item.word;

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <Link href="/learn-romanian/alfabet" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به فهرست حروف' : '← Back to letters'}</Link>
    <header className="dark-hero-panel rounded-3xl p-7 sm:p-10 text-white space-y-3">
      <p className="text-sm font-semibold text-blue-100">{isFa ? 'الفبا · حروف وام‌واژه‌ها' : 'Alphabet · letters in loans'}</p>
      <h1 className="text-5xl font-extrabold" lang="ro" dir="ltr">{item.letter}</h1>
      <p>{isFa ? `نام حرف: ${item.name}` : `Letter name: ${item.name}`}</p>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 space-y-2">
        <p className="text-sm font-bold">{isFa ? 'شنیدن نام حرف' : 'Hear the letter name'}</p>
        <PronunciationAudio currentLang={lang} label={item.name} />
        <p className="text-xs text-blue-100">{isFa ? slug === 'k' ? 'صدای مصنوعی مرورگر است؛ واژهٔ نمونه را هم جداگانه بشنوید.' : 'در Q، W و Y صدای ثابت و یگانه‌ای برای همهٔ وام‌واژه‌ها نداریم؛ تلفظ همین نمونه را جدا بشنوید.' : slug === 'k' ? 'Browser synthesis; hear the example word separately too.' : 'Q, W and Y do not have one fixed sound across loans; hear this example word separately.'}</p>
        <div className="border-t border-white/20 pt-2">
          <p className="text-sm font-bold">{isFa ? 'شنیدن آوای حرف در هجای کوتاه یا واژهٔ نمونه' : 'Hear the sound in a short syllable or example word'}</p>
          <PronunciationAudio currentLang={lang} label={slug === 'k' ? 'ka' : item.word} />
          <p className="text-xs text-blue-100">{isFa ? slug === 'k' ? 'برای K آوا در هجای کوتاه ka شنیده می‌شود؛ پایین‌تر خود واژهٔ kilometru را جدا پخش کنید.' : `این پخش فقط صدای ${item.letter[0]} را در واژهٔ «${item.word}» نشان می‌دهد؛ آن را به همهٔ وام‌واژه‌ها تعمیم ندهید.` : slug === 'k' ? 'K is heard in the short syllable ka; play kilometru separately below.' : `This plays ${item.letter[0]} in “${item.word}”; the sound can vary in other loanwords.`}</p>
        </div>
      </div>
      <p className="max-w-xl text-sm leading-6 text-blue-100">{isFa ? 'در پنج مرحله، جای حرف را در یک واژه ببینید، قاعدهٔ آن را کشف کنید و نوشتن و گفتن را تمرین کنید. هر مرحله قابل بازگشت است.' : 'Find this letter in a word, explore its grammar, then practise writing and speaking in five repeatable stages.'}</p>
    </header>
    <nav aria-label={isFa ? 'مراحل درس' : 'Lesson stages'} className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">{stages.map((name, index) => <button key={name} type="button" onClick={() => { setStage(index); setChecked(false); }} aria-current={stage === index ? 'step' : undefined} className={`rounded-xl px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd] ${stage === index ? 'bg-[#1554bd] text-white' : 'bg-slate-50 text-slate-700 hover:bg-blue-50'}`}>{index + 1}. {name}</button>)}</nav>
    {stage === 0 && <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm"><h2 className="text-xl font-bold">{isFa ? 'واژه را ببینید و بشنوید' : 'See and hear the word'}</h2><div className="rounded-2xl bg-blue-50 p-5"><p lang="ro" dir="ltr" className="text-3xl font-bold text-[#1554bd]">{item.word}</p><p className="mt-2">{isFa ? item.fa : item.en}</p></div><PronunciationAudio currentLang={lang} label={item.word} /><p className="text-xs text-slate-600">{isFa ? 'صدای مصنوعی مرورگر در وام‌واژه‌ها ممکن است دقیق نباشد؛ فایل تأییدشده هنوز نداریم.' : 'Browser speech may mispronounce loans; no verified recording is available yet.'}</p><button type="button" onClick={() => setStage(1)} className="block rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'کشف قاعده ←' : 'Discover the rule →'}</button></section>}
    {stage === 1 && <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3"><h2 className="text-xl font-bold">{isFa ? 'معنی و قاعدهٔ همین واژه' : 'Meaning and this word’s grammar'}</h2><p lang="ro" dir="ltr" className="text-2xl font-bold">{item.word}</p><p>{isFa ? item.ruleFa : item.ruleEn}</p><p>{isFa ? item.useFa : item.useEn}</p><a href={item.source} target="_blank" rel="noopener noreferrer" className="text-[#1554bd] underline">{isFa ? 'منبع واژه' : 'Word source'}</a><button type="button" onClick={() => setStage(2)} className="block rounded-xl bg-[#1554bd] px-4 py-2 text-white">{isFa ? 'تمرین از حافظه' : 'Recall from memory'}</button></section>}
    {stage === 2 && <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"><h2 className="text-xl font-bold">{isFa ? `«${item.fa}» را با ${item.letter[0]} بنویسید.` : `Write “${item.en}” with ${item.letter[0]}.`}</h2><form onSubmit={event => { event.preventDefault(); setChecked(true); if (correct) setWritten(true); }} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" aria-label={isFa ? 'پاسخ رومانیایی' : 'Romanian answer'} autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="rounded-xl border border-slate-300 p-3" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-4 py-2 text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>{checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? isFa ? 'درست است.' : 'Correct.' : isFa ? 'به املا و جای حرف نگاه کنید و دوباره تلاش کنید.' : 'Check the spelling and try again.'}</p>}{correct && checked && <button type="button" onClick={() => setStage(3)} className="text-[#1554bd] underline">{isFa ? 'تمرین گفتاری' : 'Speaking practice'}</button>}</section>}
    {stage === 3 && <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3"><h2 className="text-xl font-bold">{isFa ? 'این واژه را بلند بگویید' : 'Say the word aloud'}</h2><p lang="ro" dir="ltr" className="text-2xl font-bold">{item.word}</p><SpokenWordCheck word={item.word} lang={lang} /><button type="button" onClick={() => setStage(4)} className="rounded-xl bg-[#1554bd] px-4 py-2 text-white">{isFa ? 'دیدن نتیجه' : 'See result'}</button></section>}
    {stage === 4 && <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3"><h2 className="text-xl font-bold">{isFa ? 'نتیجهٔ این تمرین' : 'Practice result'}</h2><p>{written ? isFa ? 'نوشتن واژه با پاسخ درست انجام شد.' : 'You wrote the word correctly.' : isFa ? 'برای تکمیل تمرین نوشتن، به مرحلهٔ یادآوری برگردید.' : 'Return to recall to complete writing.'}</p><p className="text-sm text-slate-600">{isFa ? 'تمرین گفتاری آزادانه تکرار می‌شود؛ متن تشخیص‌داده‌شده ارزیابی تلفظ نیست.' : 'Repeat speaking freely; a matching transcript is not a pronunciation assessment.'}</p><button type="button" onClick={() => { setStage(0); setAnswer(''); setChecked(false); }} className="rounded-xl border border-[#1554bd] px-4 py-2 text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button><Link href="/learn-romanian/alfabet" className="block text-[#1554bd] underline">{isFa ? 'بازگشت به الفبا' : 'Back to alphabet'}</Link></section>}
  </div>;
}

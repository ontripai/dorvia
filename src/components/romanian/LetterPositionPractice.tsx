'use client';

import React from 'react';
import { SpokenWordCheck } from './SpokenWordCheck';

type Example = { word: string; fa: string; en: string; ruleFa: string; ruleEn: string; source: string };
type SetOfExamples = { letter: string; samples: [Example, Example, Example]; noteFa?: string; noteEn?: string };

const examples: Record<string, SetOfExamples> = {
  a: { letter: 'a', samples: [
    { word: 'apă', fa: 'آب', en: 'water', ruleFa: 'اسم مؤنث: apă، صورت مشخص apa، جمع ape.', ruleEn: 'Feminine noun: apă, definite apa, plural ape.', source: 'https://dexonline.ro/definitie/ap%C4%83/paradigma' },
    { word: 'card', fa: 'کارت', en: 'card', ruleFa: 'اسم خنثی: un card، جمع carduri، صورت مشخص cardul.', ruleEn: 'Neuter noun: un card, plural carduri, definite cardul.', source: 'https://dexonline.ro/definitie/card/paradigma' },
    { word: 'casa', fa: 'آن خانه / خانهٔ مشخص', en: 'the house', ruleFa: 'صورت مشخص مفرد از اسم مؤنث casă؛ جمع case، جمع مشخص casele.', ruleEn: 'Definite singular of feminine casă; plural case, definite plural casele.', source: 'https://dexonline.ro/definitie/cas%C4%83/paradigma' },
  ] },
  e: { letter: 'e', samples: [
    { word: 'elev', fa: 'دانش‌آموز', en: 'pupil', ruleFa: 'اسم مذکر: un elev، جمع elevi، صورت مشخص elevul.', ruleEn: 'Masculine noun: un elev, plural elevi, definite elevul.', source: 'https://dexonline.ro/definitie/elev/paradigma' },
    { word: 'telefon', fa: 'تلفن', en: 'phone', ruleFa: 'اسم خنثی: un telefon، جمع telefoane، صورت مشخص telefonul.', ruleEn: 'Neuter noun: un telefon, plural telefoane, definite telefonul.', source: 'https://dexonline.ro/definitie/telefon/paradigma' },
    { word: 'rece', fa: 'سرد', en: 'cold', ruleFa: 'صفت: برای مفرد مذکر و مؤنث rece؛ در جمع reci. با اسم هماهنگ می‌شود.', ruleEn: 'Adjective: rece in masculine and feminine singular, reci in plural; agrees with its noun.', source: 'https://dexonline.ro/definitie/rece' },
  ] },
  i: { letter: 'i', samples: [
    { word: 'inimă', fa: 'قلب', en: 'heart', ruleFa: 'اسم مؤنث: o inimă، جمع inimi، صورت مشخص inima.', ruleEn: 'Feminine noun: o inimă, plural inimi, definite inima.', source: 'https://dexonline.ro/definitie/inim%C4%83' },
    { word: 'bilet', fa: 'بلیت', en: 'ticket', ruleFa: 'اسم خنثی: un bilet، جمع două bilete، صورت مشخص biletul.', ruleEn: 'Neuter noun: un bilet, plural două bilete, definite biletul.', source: 'https://dexonline.ro/definitie/bilet/paradigma' },
    { word: 'taxi', fa: 'تاکسی', en: 'taxi', ruleFa: 'اسم خنثی: un taxi، جمع taxiuri، صورت مشخص taxiul. i این واژه در پایان خوانده می‌شود؛ با i پایانیِ کم‌آوای بعضی جمع‌ها فرق دارد.', ruleEn: 'Neuter noun: un taxi, plural taxiuri, definite taxiul. Final i is pronounced here, unlike the reduced final i of some plurals.', source: 'https://dexonline.ro/definitie/taxi/paradigma' },
  ] },
  o: { letter: 'o', samples: [
    { word: 'oraș', fa: 'شهر', en: 'city', ruleFa: 'اسم خنثی: un oraș، جمع orașe، صورت مشخص orașul.', ruleEn: 'Neuter noun: un oraș, plural orașe, definite orașul.', source: 'https://dexonline.ro/definitie/ora%C8%99/paradigma' },
    { word: 'telefon', fa: 'تلفن', en: 'phone', ruleFa: 'اسم خنثی: un telefon، جمع telefoane، صورت مشخص telefonul.', ruleEn: 'Neuter noun: un telefon, plural telefoane, definite telefonul.', source: 'https://dexonline.ro/definitie/telefon/paradigma' },
    { word: 'radio', fa: 'رادیو', en: 'radio', ruleFa: 'در معنی دستگاه/رسانه اسم خنثی است: un radio، صورت مشخص radioul، جمع radiouri. واژه سه هجا دارد: ra-di-o.', ruleEn: 'As device/broadcast medium, a neuter noun: un radio, definite radioul, plural radiouri. Three syllables: ra-di-o.', source: 'https://doom.lingv.ro/cautare/q/radio' },
  ] },
  u: { letter: 'u', samples: [
    { word: 'unde', fa: 'کجا', en: 'where', ruleFa: 'قید پرسشیِ تغییرناپذیر؛ جنس، جمع و حرف تعریف ندارد.', ruleEn: 'Invariable question adverb; no gender, plural or article.', source: 'https://dexonline.ro/definitie/unde' },
    { word: 'ajutor', fa: 'کمک', en: 'help', ruleFa: 'اسم خنثی: un ajutor، جمع ajutoare، صورت مشخص ajutorul.', ruleEn: 'Neuter noun: un ajutor, plural ajutoare, definite ajutorul.', source: 'https://dexonline.ro/definitie/ajutor/paradigma' },
    { word: 'ghișeu', fa: 'باجه', en: 'service counter', ruleFa: 'اسم خنثی: un ghișeu، جمع ghișee، صورت مشخص ghișeul.', ruleEn: 'Neuter noun: un ghișeu, plural ghișee, definite ghișeul.', source: 'https://dexonline.ro/definitie/ghi%C8%99eu/paradigma' },
  ] },
  'a-circ': { letter: 'â/î', noteFa: 'â و î دو حرف مستقل در الفبا هستند، اما در این کاربرد یک آوا را نشان می‌دهند. در واژه‌های معمول، î اغلب آغاز یا پایان و â اغلب میانهٔ واژه می‌آید؛ واژه‌های مرکب و نام‌ها را جدا بررسی کنید.', noteEn: 'Â and Î are separate alphabet letters, but represent the same sound here. In ordinary words, î commonly occurs at the beginning or end and â in the middle; compounds and names need separate attention.', samples: [
    { word: 'înainte', fa: 'پیش / قبل', en: 'before / ahead', ruleFa: 'قید یا حرف اضافه بسته به جمله؛ تغییر جنس و شمار ندارد. نمونهٔ î در آغاز.', ruleEn: 'Adverb or preposition depending on context; invariable. Initial î.', source: 'https://dexonline.ro/definitie/%C3%AEnainte' },
    { word: 'română', fa: 'رومانیایی (مؤنث)', en: 'Romanian (feminine)', ruleFa: 'صورت مؤنث مفردِ صفت român؛ در «limba română» با اسم مؤنث limba هماهنگ است. نمونهٔ â در میانه.', ruleEn: 'Feminine singular of adjective român; agrees with feminine limba in limba română. Medial â.', source: 'https://dexonline.ro/definitie/rom%C3%A2n' },
    { word: 'coborî', fa: 'پایین رفتن', en: 'to descend', ruleFa: 'مصدر فعل a coborî؛ در زمان حال برای «من» cobor و برای «او» coboară می‌آید. در این تمرین فقط املای î پایانی سنجیده می‌شود.', ruleEn: 'Infinitive of a coborî; present “I descend” is cobor and “he/she descends” is coboară. Only final î spelling is tested here.', source: 'https://dexonline.ro/intrare/cobor%C3%AE/11290' },
  ] },
  's-comma': { letter: 'ș', samples: [
    { word: 'școală', fa: 'مدرسه', en: 'school', ruleFa: 'اسم مؤنث: o școală، جمع școli، صورت مشخص școala.', ruleEn: 'Feminine noun: o școală, plural școli, definite școala.', source: 'https://dexonline.ro/definitie/%C8%99coal%C4%83' },
    { word: 'ușă', fa: 'در', en: 'door', ruleFa: 'اسم مؤنث: o ușă، جمع uși، صورت مشخص ușa.', ruleEn: 'Feminine noun: o ușă, plural uși, definite ușa.', source: 'https://dexonline.ro/definitie/u%C8%99%C4%83/paradigma' },
    { word: 'oraș', fa: 'شهر', en: 'city', ruleFa: 'اسم خنثی: un oraș، جمع orașe، صورت مشخص orașul.', ruleEn: 'Neuter noun: un oraș, plural orașe, definite orașul.', source: 'https://dexonline.ro/definitie/ora%C8%99/paradigma' },
  ] },
  't-comma': { letter: 'ț', samples: [
    { word: 'țară', fa: 'کشور', en: 'country', ruleFa: 'اسم مؤنث: o țară، جمع țări، صورت مشخص țara.', ruleEn: 'Feminine noun: o țară, plural țări, definite țara.', source: 'https://dexonline.ro/definitie/%C8%9Bar%C4%83' },
    { word: 'mulțumesc', fa: 'سپاسگزارم', en: 'thank you', ruleFa: 'اول‌شخص مفرد زمان حال از a mulțumi است؛ یک عبارت رایج سپاسگزاری نیز هست.', ruleEn: 'First-person singular present of a mulțumi; also used as a common thanks.', source: 'https://dexonline.ro/definitie/mul%C8%9Bumi/paradigma' },
    { word: 'braț', fa: 'بازو', en: 'arm', ruleFa: 'اسم خنثی: un braț، جمع brațe، صورت مشخص brațul.', ruleEn: 'Neuter noun: un braț, plural brațe, definite brațul.', source: 'https://dexonline.ro/definitie/bra%C8%9B' },
  ] },
};

export function LetterPositionPractice({ slug, lang }: { slug: string; lang: 'fa' | 'en' }) {
  const set = examples[slug];
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [audioNotice, setAudioNotice] = React.useState('');
  if (!set) return null;
  const isFa = lang === 'fa';
  const positions = isFa ? ['آغاز', 'میانه', 'پایان'] : ['Beginning', 'Middle', 'End'];
  const target = set.samples[2].word;
  const correct = answer.normalize('NFC').trim().toLocaleLowerCase('ro-RO') === target;

  function speak(word: string) {
    const voice = window.speechSynthesis?.getVoices().find(v => v.lang.toLowerCase().startsWith('ro'));
    if (!voice) { setAudioNotice(isFa ? 'صدای رومانیایی مرورگر در دسترس نیست.' : 'A Romanian browser voice is unavailable.'); return; }
    window.speechSynthesis.cancel();
    setAudioNotice('');
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.voice = voice;
    utterance.lang = 'ro-RO';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }

  return <section className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-7 space-y-5" dir={isFa ? 'rtl' : 'ltr'}>
    <h2 className="text-xl font-bold">{isFa ? `جای «${set.letter}» در واژه` : `Where ${set.letter} appears in a word`}</h2>
    <p className="text-sm text-slate-700">{isFa ? 'سه واژه را از آغاز تا پایان بررسی کنید. قاعدهٔ هر واژه را باز کنید و سپس نمونهٔ پایانی را از حافظه بنویسید.' : 'Explore a word for each position. Open each grammar note, then write the final example from memory.'}</p>
    {(set.noteFa || set.noteEn) && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{isFa ? set.noteFa : set.noteEn}</p>}
    <div className="grid gap-3 sm:grid-cols-3">{set.samples.map((sample, index) => <article key={`${index}-${sample.word}`} className="rounded-xl bg-blue-50 p-4 space-y-2">
      <p className="text-xs font-semibold text-[#1554bd]">{positions[index]}</p>
      <p lang="ro" dir="ltr" className="text-2xl font-bold">{sample.word}</p>
      <p className="text-sm">{isFa ? sample.fa : sample.en}</p>
      <button type="button" onClick={() => speak(sample.word)} className="text-sm text-[#1554bd] underline">{isFa ? 'شنیدن با صدای مرورگر' : 'Hear browser voice'}</button>
      <details className="rounded-lg bg-white p-2 text-sm"><summary className="cursor-pointer font-semibold">{isFa ? 'قاعده و صورت‌ها' : 'Grammar and forms'}</summary><p className="mt-2">{isFa ? sample.ruleFa : sample.ruleEn}</p><a href={sample.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details>
    </article>)}</div>
    {audioNotice && <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{audioNotice}</p>}
    <form onSubmit={event => { event.preventDefault(); setChecked(true); }} className="space-y-2">
      <label htmlFor={`letter-${slug}`} className="block font-semibold">{isFa ? `واژهٔ «${set.samples[2].fa}» را با حرف هدف در پایان بنویسید.` : `Write “${set.samples[2].en}” with the target letter at the end.`}</label>
      <div className="flex flex-wrap gap-2"><input id={`letter-${slug}`} lang="ro" dir="ltr" value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} autoComplete="off" className="rounded-xl border border-slate-300 px-3 py-2" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-4 py-2 text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></div>
      {checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-800'}>{correct ? isFa ? 'درست است. واژه را بلند بخوانید.' : 'Correct. Read the word aloud.' : isFa ? 'املای واژه و جای حرف را دوباره بررسی کنید.' : 'Check the word spelling and letter position again.'}</p>}
    </form>
    <SpokenWordCheck key={target} word={target} lang={lang} />
    <p className="text-xs text-slate-600">{isFa ? 'صوت ضبط‌شدهٔ بالای صفحه نمونهٔ درس است؛ صدای این سه واژه فقط در صورت وجود صدای رومانیایی مرورگر پخش می‌شود.' : 'The recorded clip above is the lesson sample; these three words use a Romanian browser voice only when available.'}</p>
  </section>;
}

import React from 'react';
import { Language } from '@/types';
import { RomanianPhrase, RomanianCategory } from '@/lib/romanian/types';
import { PublishedStationInfo } from '@/lib/romanian/content';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { CategoryGrid } from './CategoryGrid';
import { PhraseCard } from './PhraseCard';

interface RomanianHubProps {
  currentLang: Language;
  categoryCounts: Record<RomanianCategory, number>;
  samplePhrases: RomanianPhrase[];
  stations?: PublishedStationInfo[];
}

export const RomanianHub: React.FC<RomanianHubProps> = ({
  currentLang,
  categoryCounts,
  samplePhrases,
  stations = [],
}) => {
  const isFa = currentLang === 'fa';

  return (
    <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* Dark Hero Panel */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
          {isFa ? 'آموزش زبان رومانیایی' : 'Learn Romanian Language'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {isFa
            ? 'بانک عبارت‌ها و جملات کاربردی زبان رومانیایی'
            : 'Essential Romanian Phrases for Practical Living'}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {isFa
            ? 'مجموعه‌ای مدون از جملات و عبارت‌های رسمی و کاربردی برای زندگی، اشتغال، تحصیل و کارهای اداری در کشور رومانی به همراه ترجمه انگلیسی و فارسی.'
            : 'A structured collection of official and practical Romanian phrases for living, working, studying, and administrative procedures in Romania.'}
        </p>
      </div>

      <section aria-labelledby="foundation-path-heading" className="overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#1554bd]">{isFa ? 'مسیر یادگیری · پیش از مکالمه' : 'Learning path · before conversation'}</span>
            <h2 id="foundation-path-heading" className="mt-2 text-2xl font-extrabold text-[#142033] sm:text-3xl">{isFa ? 'درس‌های پایهٔ زبان رومانیایی' : 'Romanian foundation lessons'}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">{isFa ? 'صدا و نوشتار را مرحله‌به‌مرحله یاد بگیرید: از حرف و گروه‌حرف، تا ساخت واژه و جمله. این مسیر از درس‌های کاربردی و موقعیت‌های روزمره جداست.' : 'Learn sounds and spelling step by step, from letters and letter groups to words and sentences. This path is separate from practical, everyday dialogues.'}</p>
          </div>
          <Link href="/learn-romanian/fundamente" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1554bd] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f3f8f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">{isFa ? 'نمایش مسیر درس‌های پایه ←' : 'Explore foundation path →'}</Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { n: '۰۱', enN: '01', fa: 'حرف و صدای مستقل', en: 'Letters and their sounds', href: '/learn-romanian/alfabet' },
            { n: '۰۲', enN: '02', fa: 'گروه‌حرف و قواعد نوشتار', en: 'Letter groups and spelling', href: '/learn-romanian/fundamente#spelling' },
            { n: '۰۳', enN: '03', fa: 'ساخت واژه و جمله', en: 'Build words and sentences', href: '/learn-romanian/lectie/un-o-doi-doua' },
          ].map(item => <Link key={item.n} href={item.href} className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm transition hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1554bd]">
            <span className="text-xs font-extrabold tracking-wider text-[#1554bd]">{isFa ? item.n : item.enN}</span>
            <span className="mt-1 block text-sm font-bold text-slate-800">{isFa ? item.fa : item.en}</span>
          </Link>)}
        </div>
      </section>

      <section aria-labelledby="practical-lessons-heading" className="space-y-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{isFa ? 'پس از یادگیری پایه‌ها' : 'After the foundations'}</span>
        <h2 id="practical-lessons-heading" className="mt-1 text-xl font-extrabold text-[#142033] sm:text-2xl">{isFa ? 'درس‌های کاربردی و موقعیت‌های روزمره' : 'Practical lessons and everyday situations'}</h2>
        <p className="mt-1 text-sm text-slate-600">{isFa ? 'در این بخش، واژه و قاعده را در گفت‌وگوی واقعی به کار ببرید.' : 'Use vocabulary and grammar in realistic conversations.'}</p>
      </div>
      <Link
        href="/learn-romanian/lectie/bilet"
        className="block rounded-3xl border border-[#1554bd]/30 bg-blue-50 p-6 sm:p-8 hover:border-[#1554bd] transition-colors"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-sm font-bold text-[#1554bd]">{isFa ? 'جلسه نمونه تعاملی · حدود ۱۵ دقیقه' : 'Interactive sample · about 15 minutes'}</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">{isFa ? 'یک بلیت یا دو بلیت؟' : 'One ticket or two?'}</h2>
            <p className="text-sm text-slate-700">{isFa ? 'واژه و قاعده را در مکالمه با فروشنده تمرین کنید و خودتان پاسخ بسازید.' : 'Practise the noun and its grammar in a ticket-counter conversation.'}</p>
          </div>
          <span className="rounded-xl bg-[#1554bd] px-5 py-3 text-white text-sm font-bold">{isFa ? 'ورود به درس' : 'Open lesson'}</span>
        </div>
      </Link>
      </section>

      <p className="text-sm text-slate-700 leading-relaxed">
        {isFa
          ? 'حدود ۱۵ دقیقه برای هر جلسه پیشنهاد می‌شود. اگر امروز فرصت بیشتری دارید، پس از هر درس می‌توانید درس دیگری انتخاب کنید یا همان تمرین را تکرار کنید؛ محدودیت روزانه‌ای وجود ندارد.'
          : 'About 15 minutes per lesson is a suggestion. If you have more time today, choose another lesson or repeat a practice session; there is no daily lesson limit.'}
      </p>

      <section aria-labelledby="ticket-path-heading" className="space-y-4">
        <div>
          <h2 id="ticket-path-heading" className="text-xl sm:text-2xl font-extrabold text-[#142033]">{isFa ? 'مسیر مکالمهٔ بلیت' : 'The ticket conversation path'}</h2>
          <p className="text-sm text-slate-600">{isFa ? 'هر درس مستقل و قابل تکرار است. برای ادامه در همان روز محدودیتی ندارید.' : 'Each lesson can be repeated. Continue on the same day whenever you like.'}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: '/learn-romanian/lectie/bilet', fa: '۱. یک یا دو بلیت؟', en: '1. One or two tickets?', detailFa: 'تعداد و درخواست مؤدبانه', detailEn: 'Quantity and a polite request' },
            { href: '/learn-romanian/lectie/autobuz-tramvai', fa: '۲. اتوبوس و تراموا', en: '2. Bus and tram', detailFa: 'پرسیدن دربارهٔ اعتبار بلیت', detailEn: 'Ask whether a ticket is valid' },
            { href: '/learn-romanian/lectie/metrou', fa: '۳. متروی بخارست', en: '3. Bucharest metro', detailFa: 'ده سفر یا اشتراک ماهانه', detailEn: 'Ten journeys or a monthly pass' },
          ].map(lesson => <Link key={lesson.href} href={lesson.href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#1554bd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1554bd]">
            <h3 className="font-bold text-[#142033]">{isFa ? lesson.fa : lesson.en}</h3>
            <p className="text-sm text-slate-600 mt-1">{isFa ? lesson.detailFa : lesson.detailEn}</p>
            <span className="text-sm font-semibold text-[#1554bd] mt-3 inline-block">{isFa ? 'ورود به درس' : 'Open lesson'}</span>
          </Link>)}
        </div>
        <p className="text-sm text-slate-600">{isFa ? 'در ادامهٔ این مسیر: اتوبوس بین‌شهری، سینما، تئاتر و تله‌کابین؛ هر کدام با موقعیت و واژگان مخصوص خود.' : 'Planned next: intercity buses, cinema, theatre, and cable cars, each with its own dialogue and vocabulary.'}</p>
      </section>

      {/*
        ورودِ تمرین روزانه (dre-p188).

        پیش از این هیچ صفحه‌ای به `/learn-romanian/exercitiu` لینک نمی‌داد —
        فقط با تایپ دستی آدرس باز می‌شد. یک حلقه‌ی یادگیری که راهی به آن نیست،
        ساخته نشده حساب می‌شود.

        جای آن عمداً پیش از فهرست ایستگاه‌هاست: کسی که برگشته، کارِ امروزش را
        می‌خواهد، نه فهرست درس‌ها را.
      */}
      {stations.length > 0 && (
        <Link
          href="/learn-romanian/exercitiu"
          className="block rounded-3xl border border-[#1554bd]/25 bg-gradient-to-l from-[#1554bd]/[0.07] to-transparent p-6 sm:p-7 hover:border-[#1554bd]/50 transition-colors group"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#1554bd] uppercase tracking-wider">
                {isFa ? 'تمرین روزانه' : 'Daily practice'}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-[#142033]">
                {isFa ? 'هر روز چند دقیقه، با فاصله‌گذاری' : 'A few minutes a day, spaced out'}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                {isFa
                  ? 'هر واژه را درست وقتی که در آستانه‌ی فراموشی است دوباره می‌بینید. بدون ایمیل و بدون رمز.'
                  : 'Each word comes back just as you are about to forget it. No email, no password.'}
              </p>
            </div>
            <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#1554bd] text-white text-sm font-bold group-hover:bg-[#0f3f8f] transition-colors shrink-0">
              {isFa ? 'شروع تمرین' : 'Start practising'}
            </span>
          </div>
        </Link>
      )}

      {/* Thematic Category Grid */}
      <CategoryGrid currentLang={currentLang} categoryCounts={categoryCounts} />

      {/* Featured / Sample Phrases Section */}
      {samplePhrases.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
                {isFa ? 'نمونه عبارت‌های منتخب' : 'Selected Phrase Samples'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isFa
                  ? 'برخی از پرکاربردترین جملات مقدماتی و رسمی'
                  : 'A selection of high-frequency formal and neutral introductory phrases'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {samplePhrases.map(phrase => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                currentLang={currentLang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

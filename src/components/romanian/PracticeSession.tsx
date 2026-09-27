'use client';

import React from 'react';
import { PronunciationAudio } from './PronunciationAudio';
import { PhraseText } from './PhraseText';
import type { AudioClip } from '@/lib/romanian/types';

export interface PracticeOption {
  id: string;
  fa: string;
  en: string;
}

export interface PracticeQuestion {
  itemId: string;
  promptRo: string;
  options: PracticeOption[];
  /** آیا این قلم همین حالا معرفی می‌شود یا مرور است. */
  isNew: boolean;
  clips?: AudioClip[];
}

interface Props {
  sessionId: string;
  questions: PracticeQuestion[];
  isFa: boolean;
  currentLang: 'fa' | 'en';
  dailyGoalItems: number;
}

type Verdict = {
  isCorrect: boolean;
  correctOptionId: string;
  box: number;
  dueOn: string;
} | null;

const toFaDigits = (n: number | string): string =>
  String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/**
 * یک نشست تمرین.
 *
 * درستیِ پاسخ **از سرور** می‌آید، نه از داده‌ی همراه سؤال. گزینه‌ها بدون نشانه‌ی
 * پاسخ درست فرستاده می‌شوند، پس نمی‌شود با نگاه به سورس صفحه جواب را دید. هزینه‌اش
 * یک رفت‌وبرگشت در هر پاسخ است — که چون پاسخ باید ثبت هم بشود، هزینه‌ی اضافه‌ای نیست.
 */
export function PracticeSession({
  sessionId,
  questions,
  isFa,
  currentLang,
  dailyGoalItems,
}: Props) {
  const [index, setIndex] = React.useState(0);
  const [verdict, setVerdict] = React.useState<Verdict>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [summary, setSummary] = React.useState<null | {
    goalMet: boolean;
    streakDays: number;
    longTerm: number;
    answeredToday: number;
  }>(null);
  const shownAt = React.useRef<number>(Date.now());

  const q = questions[index];
  const isLast = index >= questions.length - 1;

  React.useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);

  async function answer(optionId: string) {
    if (pending || verdict) return;
    setPending(true);
    setSelected(optionId);
    setError(null);
    try {
      const res = await fetch('/api/romanian/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemId: q.itemId,
          selectedOptionId: optionId,
          latencyMs: Date.now() - shownAt.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setVerdict(data);
      if (data.isCorrect) setCorrectCount(c => c + 1);
    } catch {
      setSelected(null);
      setError(
        isFa
          ? 'پاسخ ثبت نشد. اتصال را بررسی کنید و دوباره بزنید.'
          : 'Your answer was not saved. Check your connection and try again.'
      );
    } finally {
      setPending(false);
    }
  }

  async function next() {
    if (!isLast) {
      setIndex(i => i + 1);
      setVerdict(null);
      setSelected(null);
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/romanian/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemsTotal: questions.length,
          itemsCorrect: correctCount,
        }),
      });
      const data = await res.json();
      setSummary({
        goalMet: !!data.goalMet,
        streakDays: Number(data.streakDays) || 0,
        longTerm: Number(data.longTerm) || 0,
        answeredToday: Number(data.answeredToday) || 0,
      });
    } catch {
      setSummary({ goalMet: false, streakDays: 0, longTerm: 0, answeredToday: 0 });
    } finally {
      setPending(false);
    }
  }

  /* ------------------------------------------------------------- خلاصه */

  if (summary) {
    const num = (n: number) => (isFa ? toFaDigits(n) : String(n));
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
          <div className="text-4xl font-extrabold text-[#142033]">
            {num(correctCount)} / {num(questions.length)}
          </div>
          <p className="text-sm text-slate-600">
            {isFa ? 'پاسخ درست در این نشست' : 'correct in this session'}
          </p>

          {/*
            عدد حافظه‌ی بلندمدت عمداً تنها معیار پیشرفت است — نه امتیاز، نه
            جواهر. فقط وقتی بالا می‌رود که فاصله‌گذاری واقعاً جواب داده باشد.
          */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-2xl font-bold text-[#1554bd]">
              {isFa
                ? `${num(summary.longTerm)} واژه در حافظه‌ی بلندمدت شما`
                : `${num(summary.longTerm)} words in your long-term memory`}
            </div>
            {summary.goalMet ? (
              <div className="text-sm font-semibold text-emerald-700">
                {isFa
                  ? `هدف امروز انجام شد — روزشمار: ${num(summary.streakDays)} روز`
                  : `Today's goal met — streak: ${num(summary.streakDays)} days`}
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                {isFa
                  ? `${num(summary.answeredToday)} از ${num(dailyGoalItems)} قلمِ امروز`
                  : `${num(summary.answeredToday)} of ${num(dailyGoalItems)} items today`}
              </div>
            )}
          </div>
        </div>

        <a
          href={`/${currentLang}/learn-romanian`}
          className="inline-block px-5 py-2.5 rounded-xl bg-[#1554bd] text-white text-sm font-bold hover:bg-[#0f3f8f] transition-colors"
        >
          {isFa ? 'بازگشت به ایستگاه‌ها' : 'Back to the stations'}
        </a>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-xl mx-auto text-center text-slate-600">
        {isFa ? 'امروز چیزی برای تمرین نیست.' : 'Nothing to practise today.'}
      </div>
    );
  }

  /* -------------------------------------------------------------- سؤال */

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          {isFa
            ? `${toFaDigits(index + 1)} از ${toFaDigits(questions.length)}`
            : `${index + 1} of ${questions.length}`}
        </span>
        {q.isNew && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-bold">
            {isFa ? 'واژه‌ی تازه' : 'new'}
          </span>
        )}
      </div>

      <div
        className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
      >
        <div
          className="h-full bg-[#1554bd] transition-all duration-300"
          style={{ width: `${((index + (verdict ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-3">
        <div
          dir="ltr"
          lang="ro"
          className="text-4xl sm:text-5xl font-extrabold text-[#142033] font-heading tracking-wide"
        >
          <PhraseText text={q.promptRo} variant="ro" lang={currentLang} />
        </div>
        {q.clips && q.clips.length > 0 && (
          <div className="flex justify-center">
            <PronunciationAudio
              clips={q.clips}
              currentLang={currentLang}
              label={q.promptRo}
              variant="compact"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map(opt => {
          const isChosen = selected === opt.id;
          const isAnswer = verdict?.correctOptionId === opt.id;
          let tone =
            'bg-white border-slate-200 text-slate-800 hover:border-[#1554bd] hover:text-[#1554bd]';
          if (verdict) {
            if (isAnswer) tone = 'bg-emerald-50 border-emerald-400 text-emerald-900';
            else if (isChosen) tone = 'bg-rose-50 border-rose-400 text-rose-900';
            else tone = 'bg-white border-slate-200 text-slate-400';
          }
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => answer(opt.id)}
              disabled={pending || !!verdict}
              className={`rounded-2xl border p-4 text-start transition-colors shadow-sm disabled:cursor-default ${tone}`}
            >
              <div className="font-bold text-base leading-snug">{opt.fa}</div>
              <div dir="ltr" className="text-xs text-slate-400 mt-0.5">
                {opt.en}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {verdict && (
        <div className="space-y-3">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              verdict.isCorrect
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {verdict.isCorrect
              ? isFa
                ? 'درست'
                : 'Correct'
              : isFa
                ? 'نادرست'
                : 'Not quite'}
            {' · '}
            {/*
              «چه روزی دوباره می‌بینیدش» همان چیزی است که جعبه‌ای بودن را قابل
              توضیح می‌کند، و دلیل انتخابش به‌جای SM-2 بود.
            */}
            <span className="font-normal">
              {isFa
                ? `دوباره در ${verdict.dueOn} می‌بینیدش`
                : `you will see it again on ${verdict.dueOn}`}
            </span>
          </div>

          <button
            type="button"
            onClick={next}
            disabled={pending}
            className="w-full rounded-xl bg-[#1554bd] px-5 py-3 text-white text-sm font-bold hover:bg-[#0f3f8f] transition-colors disabled:opacity-60"
          >
            {isLast
              ? isFa
                ? 'پایان نشست'
                : 'Finish session'
              : isFa
                ? 'بعدی'
                : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}

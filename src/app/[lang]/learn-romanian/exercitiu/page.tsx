import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { getTeachingOrderItemIds } from '@/lib/romanian/content';
import { buildRecognitionQuestion } from '@/lib/romanian/exercise';
import { planSession } from '@/lib/romanian/session';
import { longTermCount } from '@/lib/romanian/scheduler';
import {
  getSignedInUserId,
  loadLearnerSnapshot,
  startSession,
} from '@/lib/romanian/learnerStore';
import { CORE_AUDIO } from '@/content/romanian/audio-manifest';
import {
  PracticeSession,
  PracticeQuestion,
} from '@/components/romanian/PracticeSession';
import { StartPracticeGate } from '@/components/romanian/StartPracticeGate';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'تمرین رومانیایی | DORVIA EUROP' : 'Practise Romanian | DORVIA EUROP',
    description: isFa
      ? 'تمرین روزانه‌ی واژگان رومانیایی با فاصله‌گذاری.'
      : 'Daily spaced practice for Romanian vocabulary.',
    robots: { index: false, follow: false },
  };
}

export default async function RomanianPracticePage({
  params,
}: {
  params: { lang: string };
}) {
  if (!LOCALES.includes(params.lang as any)) notFound();

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';

  const crumbs = (
    <Breadcrumb
      items={[
        { label: isFa ? 'صفحه اصلی' : 'Home', href: '/' },
        { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
        { label: isFa ? 'تمرین' : 'Practice' },
      ]}
      currentLang={currentLang}
      disableJsonLd={true}
    />
  );

  const shell = (children: React.ReactNode) => (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {crumbs}
      {children}
    </div>
  );

  /* ------------------------------------------------------------ دروازه */

  /*
    دروازه‌ی ورود: یک نشست ناشناس، بدون ایمیل و بدون رمز (dre-p188).

    مسیر ورود پورتال عمداً فقط با دعوت کار می‌کند و کال‌بکش هر کسی را که سطر
    `leads` با `invited_at` ندارد sign out می‌کند — یادگیرنده از آن در می‌رفت و
    بیرون انداخته می‌شد. باز کردن ثبت‌نام عمومی روی همان مسیر هم سهمیه‌ی ایمیلِ
    ورودِ مشتریان پرونده را در معرض هجوم می‌گذاشت. پس ورودِ یادگیرنده هیچ ایمیلی
    نمی‌فرستد.
  */
  const userId = await getSignedInUserId();
  if (!userId) {
    return shell(
      <StartPracticeGate isFa={isFa} browseHref={`/${currentLang}/learn-romanian`} />
    );
  }

  /* ------------------------------------------------------- ساخت نشست */

  const snapshot = await loadLearnerSnapshot(userId);
  if (!snapshot) {
    return shell(
      <div className="max-w-xl mx-auto text-center text-slate-600">
        {isFa
          ? 'پروفایل یادگیری در دسترس نیست. کمی بعد دوباره تلاش کنید.'
          : 'Your learning profile is unavailable. Please try again shortly.'}
      </div>
    );
  }

  const plan = planSession({
    states: snapshot.states,
    today: snapshot.today,
    candidateNewItemIds: getTeachingOrderItemIds(),
    cap: snapshot.learner.dailyGoalItems,
  });

  const sessionId = await startSession(
    userId,
    snapshot.learner.currentStationId,
    snapshot.learner.currentStepId
  );

  const plannedIds = [
    ...plan.reviewItemIds.map(id => ({ id, isNew: false })),
    ...plan.newItemIds.map(id => ({ id, isNew: true })),
  ];

  const questions: PracticeQuestion[] = [];
  if (sessionId) {
    for (const { id, isNew } of plannedIds) {
      // همان seed که مسیر ثبت پاسخ دوباره با آن سؤال را می‌سازد.
      const q = buildRecognitionQuestion(id, sessionId);
      if (!q) continue;
      questions.push({
        itemId: q.itemId,
        promptRo: q.promptRo,
        // پاسخ درست عمداً فرستاده نمی‌شود.
        options: q.options.map(o => ({ id: o.id, fa: o.fa, en: o.en })),
        isNew,
        clips: CORE_AUDIO[q.itemId],
      });
    }
  }

  const streak = snapshot.streakForDisplay;
  const longTerm = longTermCount(snapshot.states);
  const toFa = (n: number) =>
    isFa ? String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]) : String(n);

  return shell(
    <>
      <div className="dark-hero-panel rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            {isFa ? 'تمرین امروز' : "Today's practice"}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            {isFa
              ? `${toFa(questions.length)} قلم — حدود دو دقیقه`
              : `${questions.length} items — about two minutes`}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 font-medium">
            {isFa ? `روزشمار: ${toFa(streak)}` : `Streak: ${streak}`}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-medium">
            {isFa ? `${toFa(longTerm)} در حافظه‌ی بلندمدت` : `${longTerm} in long-term memory`}
          </span>
        </div>
      </div>

      {plan.newItemsHeldBack && plan.backlogCount > 0 && (
        /*
          صادق بودن درباره‌ی عقب‌افتادگی عمدی است. یادگیرنده باید بداند چرا امروز
          چیز تازه‌ای نمی‌بیند، وگرنه حس می‌کند محصول گیر کرده است.
        */
        <div className="max-w-xl mx-auto rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          {isFa
            ? `${toFa(plan.backlogCount)} قلم دیگر هم سررسید شده‌اند. امروز واژه‌ی تازه‌ای معرفی نمی‌شود تا صف کوتاه شود.`
            : `${plan.backlogCount} more items are due. No new words today, so the queue can shrink.`}
        </div>
      )}

      {sessionId && questions.length > 0 ? (
        <PracticeSession
          sessionId={sessionId}
          questions={questions}
          isFa={isFa}
          currentLang={isFa ? 'fa' : 'en'}
          dailyGoalItems={snapshot.learner.dailyGoalItems}
        />
      ) : (
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-3">
          <p className="text-base font-bold text-[#142033]">
            {isFa ? 'امروز چیزی سررسید نشده' : 'Nothing is due today'}
          </p>
          <p className="text-sm text-slate-600">
            {isFa
              ? 'فردا برگردید — یا یک ایستگاه تازه را شروع کنید.'
              : 'Come back tomorrow — or start a new station.'}
          </p>
          <Link
            href="/learn-romanian"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#1554bd] text-white text-sm font-bold hover:bg-[#0f3f8f] transition-colors"
          >
            {isFa ? 'ایستگاه‌ها' : 'Stations'}
          </Link>
        </div>
      )}
    </>
  );
}

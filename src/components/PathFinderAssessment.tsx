'use client';

// DORVIA Assessment / PathFinder™ — Phase 1 MVP.
// Implements claude/dorvia-pathfinder-full-spec-v1-2026-09-04.md (project docs).
//
// Drop-in replacement for <LeadForm /> inside AppLayout's evaluation modal —
// same props shape (currentLang / isModal / onSuccess) so every existing
// entry point on the site (Header, Footer, mobile bottom nav, EvaluationCTA
// instances across pages) instantly gets the smarter multi-step assessment
// instead of the old 3-step contact form, with zero per-page rewiring.

import React, { useMemo, useState } from 'react';
import { Language } from '../types';
import { hasVerifiedLegalEntity } from '../lib/legalConfig';
import { LocalizedLink as Link } from './LocalizedLink';
import {
  ArrowRight, ArrowLeft, Check, ShieldCheck, LockKeyhole, MessageSquare, Send,
} from './Icons';
import { getVisibleQuestions } from '../lib/assessment/questions';
import { buildAssessmentResult } from '../lib/assessment/scoring';
import { ROUTE_META, matchMeta, whyThisPath, needsReview, whatsappLink } from '../lib/assessment/recommendations';
import { AssessmentAnswers } from '../lib/assessment/types';

interface PathFinderAssessmentProps {
  currentLang: Language;
  isModal?: boolean;
  onSuccess?: () => void;
}

type Phase = 'intro' | 'questions' | 'result';

const t = (lang: Language, fa: string, en: string) => (lang === 'fa' ? fa : en);

export const PathFinderAssessment: React.FC<PathFinderAssessmentProps> = ({ currentLang, isModal = false, onSuccess }) => {
  const lang = currentLang;
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;
  const BackArrowIcon = lang === 'fa' ? ArrowRight : ArrowLeft;

  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);

  const [leadName, setLeadName] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const currentQuestion = visibleQuestions[stepIndex];
  const result = useMemo(() => (phase === 'result' ? buildAssessmentResult(answers) : null), [phase, answers]);

  if (process.env.NODE_ENV === 'production' && !hasVerifiedLegalEntity()) {
    return (
      <div className={`editorial-card p-6 sm:p-10 bg-white border border-[#dfe6ef] ${isModal ? 'shadow-none' : 'shadow-lg'} text-center`}>
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-2xl font-bold mb-4">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-extrabold text-[#142033] mb-2">
          {t(lang, 'نسخه آزمایشی — فرم غیرفعال است', 'Preview Mode — Form Disabled')}
        </h3>
        <p className="text-sm text-[#526174] leading-relaxed mb-6">
          {t(lang, 'ارسال آنلاین موقتاً در دسترس نیست. لطفاً از واتساپ، تلفن یا ایمیل استفاده کنید.', 'Online submission is temporarily unavailable. Please contact us via WhatsApp, phone, or email.')}
        </p>
        <div className="space-y-2 text-sm font-bold text-[#2F6FED]">
          <p>📞 +40 727 348 009</p>
          <p>✉️ ontrip.ai@gmail.com</p>
        </div>
      </div>
    );
  }

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      return next;
    });
  };

  const handleSingleSelect = (questionId: string, value: string) => {
    setAnswer(questionId, value);
  };

  const handleMultiToggle = (questionId: string, value: string, max?: number) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      let next: string[];
      if (value === 'none') {
        next = current.includes('none') ? [] : ['none'];
      } else if (current.includes(value)) {
        next = current.filter((v) => v !== value);
      } else {
        const withoutNone = current.filter((v) => v !== 'none');
        next = max && withoutNone.length >= max ? withoutNone : [...withoutNone, value];
      }
      return { ...prev, [questionId]: next };
    });
  };

  const canAdvance = (): boolean => {
    if (!currentQuestion) return true;
    if (!currentQuestion.required) return true;
    const v = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi') return Array.isArray(v) && v.length > 0;
    return typeof v === 'string' && v.length > 0;
  };

  const goNext = () => {
    // Re-derive visible questions since an answer just given may reveal/hide
    // conditional questions further down the list.
    const freshVisible = getVisibleQuestions(answers);
    if (stepIndex + 1 < freshVisible.length) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase('result');
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      setPhase('intro');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || (!leadWhatsapp.trim() && !leadEmail.trim())) {
      setErrorMsg(t(lang, 'لطفاً نام و حداقل یک راه ارتباطی (واتساپ یا ایمیل) را وارد کنید.', 'Please enter your name and at least one contact method (WhatsApp or email).'));
      return;
    }
    if (!leadConsent) {
      setErrorMsg(t(lang, 'لطفاً مطالعه قوانین حریم خصوصی را تایید کنید.', 'Please acknowledge the privacy policy to submit.'));
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: leadName,
          whatsapp: leadWhatsapp,
          email: leadEmail,
          preferredLanguage: lang,
          answers,
          result,
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setIsSubmitting(false);
      setLeadCaptured(true);
      if (onSuccess) {
        // Give the user time to read the result and click through to
        // WhatsApp before the host (AppLayout's modal) auto-closes.
        setTimeout(() => onSuccess(), 6000);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg(t(lang, 'متاسفانه مشکلی در ارسال رخ داد. لطفاً دوباره تلاش کنید.', 'Submission failed. Please try again.'));
    }
  };

  const cardClass = `editorial-card p-6 sm:p-10 bg-white border border-[#dfe6ef] ${isModal ? 'shadow-none' : 'shadow-lg'}`;

  // ---------------- Intro ----------------
  if (phase === 'intro') {
    return (
      <div className={cardClass}>
        <div className="text-center max-w-xl mx-auto space-y-5">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
            DORVIA PathFinder™
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
            {t(lang, 'مسیر مناسب شما برای رومانی چیست؟', 'What is the right path to Romania for you?')}
          </h2>
          <p className="text-sm text-[#526174] leading-relaxed">
            {t(
              lang,
              'در کمتر از ۵ دقیقه، شرایط اولیه خود را بررسی کنید و ببینید کدام مسیر برای شما ارزش بررسی بیشتری دارد: تحصیل، کار، کسب‌وکار، خانواده یا جابه‌جایی و زندگی در رومانی.',
              'Answer a few questions in less than 5 minutes to discover which Romania pathway — study, work, business, family, or relocation — may be worth exploring based on your current profile.'
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-bold text-[#526174]">
            <span>✓ {t(lang, 'رایگان', 'Free')}</span>
            <span>✓ {t(lang, 'حدود ۵ دقیقه', '~5 minutes')}</span>
            <span>✓ {t(lang, 'بدون نیاز به ارسال مدارک حساس', 'No sensitive documents required')}</span>
          </div>
          <button
            onClick={() => { setPhase('questions'); setStepIndex(0); }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-8 py-4 bg-[#2F6FED] hover:bg-[#1A5BB8] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-[#2F6FED]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{t(lang, 'شروع ارزیابی رایگان', 'Start Free Assessment')}</span>
            <ArrowIcon size={18} />
          </button>
          <p className="text-[11px] text-[#788697] leading-relaxed pt-2 border-t border-[#dfe6ef]">
            {t(
              lang,
              'این ارزیابی اطلاعات اولیه ارائه می‌کند و جایگزین بررسی رسمی شرایط قانونی یا تصمیم مراجع ذی‌صلاح نیست.',
              'This assessment provides preliminary information and is not a substitute for an official legal review or a decision by the relevant authorities.'
            )}
          </p>
        </div>
      </div>
    );
  }

  // ---------------- Questions ----------------
  if (phase === 'questions' && currentQuestion) {
    const total = visibleQuestions.length;
    const progressPct = Math.round(((stepIndex + 1) / Math.max(total, 1)) * 100);
    const selected = answers[currentQuestion.id];

    return (
      <div className={cardClass}>
        <div className="mb-6 space-y-2 border-b border-[#dfe6ef] pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">DORVIA PathFinder™</span>
            <span className="text-xs font-bold text-[#526174]">
              {t(lang, `سؤال ${stepIndex + 1} از ${total}`, `Question ${stepIndex + 1} of ${total}`)}
            </span>
          </div>
          <div className="w-full bg-[#eef3f8] h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-[#2F6FED] h-full transition-all duration-300 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-[#142033] mb-1">{currentQuestion.title[lang]}</h3>
        {currentQuestion.helper && <p className="text-xs text-[#526174] mb-4">{currentQuestion.helper[lang]}</p>}

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ${currentQuestion.helper ? '' : 'mt-4'}`}>
          {currentQuestion.options.map((opt) => {
            const isMulti = currentQuestion.type === 'multi';
            const isSelected = isMulti
              ? Array.isArray(selected) && (selected as string[]).includes(opt.value)
              : selected === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() =>
                  isMulti
                    ? handleMultiToggle(currentQuestion.id, opt.value, currentQuestion.maxSelections)
                    : handleSingleSelect(currentQuestion.id, opt.value)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 rtl:space-x-reverse ${
                  isSelected ? 'bg-blue-50 border-[#2F6FED] text-[#2F6FED] font-bold shadow-xs' : 'bg-white border-[#dfe6ef] text-[#142033] hover:border-[#2F6FED]/40'
                }`}
              >
                {opt.icon && <span className="text-lg shrink-0">{opt.icon}</span>}
                <span className="leading-snug">{opt.label[lang]}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-7 mt-3 border-t border-[#dfe6ef] flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="px-5 py-2.5 rounded-xl border border-[#dfe6ef] bg-white text-[#142033] font-bold text-xs hover:bg-[#eef3f8] flex items-center space-x-2 rtl:space-x-reverse transition-colors cursor-pointer"
          >
            <BackArrowIcon size={14} />
            <span>{t(lang, 'قبلی', 'Back')}</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance()}
            className="px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-[#1554bd] text-white font-bold text-xs flex items-center space-x-2 rtl:space-x-reverse transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{stepIndex + 1 === total ? t(lang, 'مشاهده نتیجه', 'See my result') : t(lang, 'بعدی', 'Next')}</span>
            <ArrowIcon size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ---------------- Result ----------------
  if (phase === 'result' && result) {
    const primary = result.primaryRoute;
    const primaryMeta = ROUTE_META[primary];
    const primaryMatch = matchMeta(result.matchLevel[primary]);
    const primaryScore = result.scores[primary];
    const secondary = result.secondaryRoute;

    if (leadCaptured) {
      return (
        <div className={cardClass}>
          <div className="text-center max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
              <Check size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#142033]">
                {t(lang, 'نتیجه شما آماده است 🎉', 'Your result is ready 🎉')}
              </h3>
              <p className="text-sm text-[#526174] leading-relaxed">
                {t(lang, 'یک نسخه از نتیجه برای شما ثبت شد. تیم DORVIA به‌زودی از طریق واتساپ یا ایمیل با شما تماس می‌گیرد.', 'A copy of your result has been saved. The DORVIA team will reach out via WhatsApp or email soon.')}
              </p>
            </div>
            <a
              href={whatsappLink(primary, lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-7 py-3.5 bg-[#25D366] hover:bg-[#1fb955] text-white rounded-2xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageSquare size={18} />
              <span>{t(lang, 'ادامه بررسی در واتساپ', 'Continue on WhatsApp')}</span>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className={cardClass}>
        <div className="space-y-8">
          <div className="text-center space-y-3 pb-6 border-b border-[#dfe6ef]">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
              {t(lang, 'ارزیابی DORVIA شما آماده است', 'Your DORVIA Assessment is ready')}
            </span>
            <div className="text-4xl">{primaryMeta.icon}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#142033]">{primaryMeta.title[lang]}</h3>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-extrabold text-[#2F6FED]">{primaryScore}/100</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#eef3f8] text-[#142033] border border-[#dfe6ef]">
                {primaryMatch.icon} {primaryMatch.label[lang]}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#526174] max-w-md mx-auto leading-relaxed">{primaryMatch.text[lang]}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-extrabold text-[#142033] mb-3">{t(lang, 'چرا این مسیر؟', 'Why this path?')}</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#526174]">
                {whyThisPath(primary, answers).map((f, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{f[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#142033] mb-3">{t(lang, 'موارد نیازمند بررسی', 'Needs review')}</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#526174]">
                {needsReview(primary, answers).map((f, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{f[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {secondary && (
            <div className="bg-[#f7f9fc] border border-[#dfe6ef] rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ROUTE_META[secondary].icon}</span>
                <div>
                  <p className="text-[11px] font-bold text-[#788697] uppercase tracking-wider">{t(lang, 'مسیر جایگزین', 'Alternative path')}</p>
                  <p className="text-sm font-extrabold text-[#142033]">
                    {ROUTE_META[secondary].title[lang]} — {result.scores[secondary]}/100
                  </p>
                </div>
              </div>
              <Link href={ROUTE_META[secondary].href} className="text-xs font-bold text-[#2F6FED] hover:underline">
                {t(lang, 'مشاهده این مسیر ←', 'Explore this path →')}
              </Link>
            </div>
          )}

          {!leadCaptured && (
            <form onSubmit={handleLeadSubmit} className="pt-6 border-t border-[#dfe6ef] space-y-4">
              <h4 className="text-sm font-extrabold text-[#142033]">
                {t(lang, 'برای دریافت گزارش کامل، اطلاعات تماس خود را وارد کنید', 'Enter your contact details to get the full report')}
              </h4>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{errorMsg}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t(lang, 'نام', 'Name')} *</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">WhatsApp</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={leadWhatsapp}
                    onChange={(e) => setLeadWhatsapp(e.target.value)}
                    placeholder="+40 727 000 000"
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white text-start"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">Email</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white text-start"
                  />
                </div>
              </div>
              <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={leadConsent}
                  onChange={(e) => setLeadConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#2F6FED] rounded border-[#dfe6ef] focus:ring-[#2F6FED]"
                />
                <span className="text-[#142033] font-bold leading-relaxed text-xs">
                  {t(lang, 'سیاست حریم خصوصی و نحوه پردازش درخواست را مطالعه کردم.', 'I have read the Privacy Policy and how this request is processed.')} *
                </span>
              </label>
              <div className="flex items-center gap-2 text-[11px] text-[#788697] pt-1">
                <LockKeyhole size={13} className="shrink-0 text-[#2F6FED]" />
                <span>{t(lang, 'اطلاعات شما فقط برای بررسی این درخواست استفاده می‌شود.', 'Your information is used only to review this request.')}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2F6FED] hover:bg-[#1A5BB8] text-white font-extrabold text-xs flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? t(lang, 'در حال ارسال...', 'Sending...') : t(lang, 'دریافت گزارش کامل', 'Get my full report')}</span>
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return null;
};

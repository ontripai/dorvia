import { matchesRomanianAnswer } from '@/lib/romanian/answerFeedback';

export function AnswerWritingTip({ lang, answer, target }: { lang: 'fa' | 'en'; answer: string; target: string }) {
  if (!matchesRomanianAnswer(answer, target) || answer.normalize('NFC').trim() === target) return null;
  const fa = lang === 'fa';
  return <div className="space-y-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><p>{fa ? 'آفرین، پاسخ شما پذیرفته شد! برای نوشتن مرتب‌تر، این شکل را ببینید؛ تفاوت نشانه‌گذاری، فاصله یا علامت‌های حروف مانع ادامه نیست.' : 'Well done, your answer is accepted! Here is the suggested written form. Punctuation, spacing or missing accent marks do not prevent you from continuing.'}</p><p lang="ro" dir="ltr" className="font-bold">{target}</p><p>{fa ? 'در نوشتن، قبل از ویرگول فاصله نمی‌گذاریم و بعد از آن یک فاصله می‌آید. برای درخواست معمولی نقطه می‌گذاریم؛ علامت سؤال برای پرسش است.' : 'Use no space before a comma and one space after it. A request usually ends with a full stop; a question uses a question mark.'}</p></div>;
}

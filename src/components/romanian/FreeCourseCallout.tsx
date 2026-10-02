'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Languages } from '@/components/Icons';
import { Language } from '@/types';

/**
 * کارت معرفیِ ماژول آموزش زبانِ خودِ DORVIA، در صفحهی «آموزش زبان رومانیایی».
 *
 * چرا وجود دارد (dre-p191): آن صفحه دورههای نهادهای بیرونی را معرفی میکند و
 * تا امروز هیچ اشارهای به ماژول رایگان خودمان نداشت. ماژول از هیچ منویی هم
 * لینک نداشت، پس عملاً فقط با تایپ آدرس پیدا میشد.
 *
 * این کارت جایگزین محتوای صفحه نیست؛ بالای آن مینشیند.
 */
export function FreeCourseCallout({ currentLang }: { currentLang: Language }) {
  const isFa = currentLang === 'fa';

  return (
    <div className="rounded-2xl border border-[#2F6FED]/20 bg-gradient-to-l from-[#2F6FED]/5 to-transparent p-6 sm:p-8">
      <div className="flex items-start gap-4 rtl:space-x-reverse">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center">
          <Languages size={24} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#142033]">
            {isFa
              ? 'پیش از ثبت‌نام در دوره‌های دیگر، رایگان شروع کنید'
              : 'Start for free, before you enrol anywhere'}
          </h2>
          <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
            {isFa
              ? 'در DORVIA از الفبا و درس‌های پایه شروع کنید، جمله‌سازی و مکالمه را تمرین کنید و صداهای ضبط‌شدهٔ درس‌ها را بشنوید. شروع یادگیری بدون ثبت‌نام است.'
              : 'Start with the alphabet and foundations, then practise sentences and conversation with recorded lesson audio. You can begin without signing up.'}
          </p>
          <Link
            href="/learn-romanian"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-[#2F6FED] text-white text-sm font-extrabold hover:opacity-95 transition-opacity cursor-pointer"
          >
            {isFa ? 'شروع آموزش رایگان' : 'Start learning for free'}
          </Link>
        </div>
      </div>
    </div>
  );
}

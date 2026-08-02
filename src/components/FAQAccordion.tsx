'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { ChevronDown } from './Icons';

interface FAQAccordionProps {
  currentLang: Language;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ currentLang }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: currentLang === 'fa' ? 'آیا ایرانیان می‌توانند برای تحصیل در رومانی اقدام کنند؟' : 'Can global applicants study at Romanian universities?',
      a: currentLang === 'fa'
        ? 'بله، دانشگاه‌های معتبر رومانی سالانه در رشته‌های پزشکی، دندانپزشکی، مهندسی و مدیریت به زبان‌های انگلیسی و فرانسوی دانشجو می‌پذیرند. تاییدیه مدارک تحصیلی از طریق وزارت آموزش رومانی انجام می‌شود.'
        : 'Yes, accredited Romanian universities welcome international students in Medicine, Dentistry, Engineering, and Business taught in English and French.'
    },
    {
      q: currentLang === 'fa' ? 'برای کار در رومانی به چه مجوزی نیاز است؟' : 'What permit is required for working in Romania?',
      a: currentLang === 'fa'
        ? 'کارفرما در رومانی باید ابتدا مجوز کار (Aviz de Munca) را از اداره کل مهاجرت (IGI) دریافت کند. پس از صدور مجوز کار، متقاضی برای ویزای تایپ D کاری اقدام کرده و پس از ورود کارت اقامت موقت دریافت می‌کند.'
        : 'Employers must first obtain a Work Authorization (Aviz de Munca) from the General Inspectorate for Immigration (IGI) before the employee applies for a Long-Stay Type D Visa.'
    },
    {
      q: currentLang === 'fa' ? 'آیا ثبت شرکت به تنهایی باعث دریافت اقامت می‌شود؟' : 'Does company registration automatically grant residency?',
      a: currentLang === 'fa'
        ? 'خیر، ثبت شرکت SRL مرحله اول است. برای دریافت اقامت مدیرعامل، شرکت باید فعالیت واقعی اقتصادی، طرح کسب‌وکار مشخص یا ایجاد اشتغال بر اساس قوانین مهاجرتی رومانی داشته باشد.'
        : 'No, company formation is step one. Executive residency requires active business operations, clear business plans, or employment creation under IGI criteria.'
    },
    {
      q: currentLang === 'fa' ? 'هزینه خدمات مشاوره و ارزیابی چگونه تعیین می‌شود؟' : 'How are service fees determined?',
      a: currentLang === 'fa'
        ? 'ارزیابی اولیه مدارک کاملاً رایگان است. در صورت تمایل به دریافت خدمات مشاوره، هزینه‌ها بر اساس نوع مسیر (تحصیلی، کاری، شرکتی) به صورت شفاف پیش از عقد قرارداد اعلام می‌گردد.'
        : 'Initial case evaluation is completely free. Service fees for university or business advisory are provided transparently prior to any agreement.'
    },
    {
      q: currentLang === 'fa' ? 'آیا صدور ویزا، پذیرش یا اقامت تضمین می‌شود؟' : 'Are visa or residency outcomes guaranteed?',
      a: currentLang === 'fa'
        ? 'خیر. طبق اصول اخلاقی و حقوقی، تصمیم‌گیری نهایی درباره صدور پذیرش، ویزا و کارت اقامت صراحتاً در صلاحیت دانشگاه‌ها، سفارت رومانی و اداره مهاجرت (IGI) بوده و هیچ‌گونه تضمینی صادقانه نیست.'
        : 'No. Final decisions regarding admissions, visas, and residency rest exclusively with universities, embassies, and the IGI.'
    },
    {
      q: currentLang === 'fa' ? 'نحوه اقدام از داخل ایران، امارات یا ترکیه چگونه است؟' : 'How to apply from Iran, UAE, or Turkey?',
      a: currentLang === 'fa'
        ? 'فرآیند کار از طریق بررسی مدارک، اخذ تاییدیه‌ها در رومانی و سپس تعیین وقت مصاحبه در سفارت رومانی در کشور محل سکونت متقاضی (تهران، ابوظبی، آنکارا و...) انجام می‌پذیرد.'
        : 'Procedures involve document audits, obtaining Romanian approvals, and scheduling interviews at the embassy in your country of residence.'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="editorial-card overflow-hidden bg-white border border-[#dfe6ef] transition-all"
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full p-5 text-start font-bold text-[#142033] text-sm sm:text-base flex items-center justify-between space-x-3 rtl:space-x-reverse cursor-pointer hover:text-[#2F6FED] transition-colors"
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <ChevronDown
                size={18}
                className={`transform transition-transform shrink-0 text-[#788697] ${isOpen ? 'rotate-180 text-[#2F6FED]' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#526174] leading-relaxed border-t border-[#dfe6ef] bg-[#f7f9fc] animate-fadeIn">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

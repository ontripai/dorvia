import React from 'react';

export const DisclaimerContent = ({ currentLang }: { currentLang: string }) => {
  const isFa = currentLang === 'fa';

  return (
    <div className={`space-y-6 text-sm text-[#526174] leading-relaxed ${isFa ? 'rtl text-right' : 'ltr text-left'}`}>
      <h1 className="text-3xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-4">
        {isFa ? 'سلب مسئولیت (Disclaimer)' : 'Disclaimer'}
      </h1>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱. عدم تضمین نتیجه پرونده (No Guarantee of Outcome)' : '1. No Guarantee of Outcome'}
        </h2>
        <p>
          {isFa
            ? 'ما نمی‌توانیم صدور ویزا، پذیرش دانشگاه یا تأیید اقامت را تضمین کنیم. تمامی تصمیمات نهایی صرفاً در اختیار مراجع رسمی دولتی (مانند IGI، سفارتخانه‌ها و وزارت آموزش) است.'
            : 'We cannot guarantee visa issuance, university admission, or residency approval. All final decisions are solely at the discretion of official government authorities (such as IGI, embassies, and the Ministry of Education).'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۲. اطلاعات عمومی (General Information)' : '2. General Information'}
        </h2>
        <p>
          {isFa
            ? 'مطالب منتشر شده در DORVIA EUROP برای آشنایی عمومی است و نباید جایگزین مشاوره تخصصی و حقوقی در موارد خاص تلقی شود.'
            : 'The content published on DORVIA EUROP is for general informational purposes and should not replace specialized and legal consultation in specific cases.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۳. عدم ارائه مشاوره پزشکی یا حقوقی رسمی (No Official Medical or Legal Advice)' : '3. No Official Medical or Legal Advice'}
        </h2>
        <p>
          {isFa
            ? 'اطلاعات مربوط به سیستم بهداشت یا قوانین مالیاتی صرفاً راهنما هستند. برای امور درمانی به پزشک معتبر و برای امور مالیاتی به حسابدار رسمی (CECCAR) مراجعه کنید.'
            : 'Information regarding the healthcare system or tax laws is merely a guide. For medical matters, consult a certified physician, and for tax matters, consult a certified accountant (CECCAR).'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۴. سلب مسئولیت مالی (Financial Disclaimer)' : '4. Financial Disclaimer'}
        </h2>
        <p>
          {isFa
            ? 'اطلاعات مربوط به سرمایه‌گذاری یا ثبت شرکت، پیشنهاد سرمایه‌گذاری (Investment Advice) نیست و DORVIA EUROP هیچگونه مسئولیتی در قبال ریسک‌ها یا زیان‌های تجاری شما ندارد.'
            : 'Information regarding investments or company registration is not investment advice, and DORVIA EUROP bears no responsibility for any business risks or losses you may incur.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۵. تغییرات قوانین دولتی' : '5. Changes to Government Laws'}
        </h2>
        <p>
          {isFa
            ? 'قوانین مهاجرتی و اداری رومانی ممکن است بدون اطلاع قبلی تغییر کنند. ما تلاش می‌کنیم سایت را به‌روز نگه داریم، اما مسئولیت نهایی بررسی آخرین بخشنامه‌ها با کاربر است.'
            : 'Romanian immigration and administrative laws may change without prior notice. We strive to keep the site updated, but the final responsibility for checking the latest regulations lies with the user.'}
        </p>
      </section>
    </div>
  );
};

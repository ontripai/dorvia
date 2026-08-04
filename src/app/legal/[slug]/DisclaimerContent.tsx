import React from 'react';

export const DisclaimerContent = ({ currentLang }: { currentLang: string }) => {
  return (
    <div className="space-y-6 text-sm text-[#526174] leading-relaxed rtl text-right">
      <h1 className="text-3xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-4">سلب مسئولیت (Disclaimer)</h1>
      
      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱. عدم تضمین نتیجه پرونده (No Guarantee of Outcome)</h2>
        <p>ما نمی‌توانیم صدور ویزا، پذیرش دانشگاه یا تأیید اقامت را تضمین کنیم. تمامی تصمیمات نهایی صرفاً در اختیار مراجع رسمی دولتی (مانند IGI، سفارتخانه‌ها و وزارت آموزش) است.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۲. اطلاعات عمومی (General Information)</h2>
        <p>مطالب منتشر شده در DORVIA EUROP برای آشنایی عمومی است و نباید جایگزین مشاوره تخصصی و حقوقی در موارد خاص تلقی شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۳. عدم ارائه مشاوره پزشکی یا حقوقی رسمی (No Official Medical or Legal Advice)</h2>
        <p>اطلاعات مربوط به سیستم بهداشت یا قوانین مالیاتی صرفاً راهنما هستند. برای امور درمانی به پزشک معتبر و برای امور مالیاتی به حسابدار رسمی (CECCAR) مراجعه کنید.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۴. سلب مسئولیت مالی (Financial Disclaimer)</h2>
        <p>اطلاعات مربوط به سرمایه‌گذاری یا ثبت شرکت، پیشنهاد سرمایه‌گذاری (Investment Advice) نیست و DORVIA EUROP هیچگونه مسئولیتی در قبال ریسک‌ها یا زیان‌های تجاری شما ندارد.</p>
      </section>
      
      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۵. تغییرات قوانین دولتی</h2>
        <p>قوانین مهاجرتی و اداری رومانی ممکن است بدون اطلاع قبلی تغییر کنند. ما تلاش می‌کنیم سایت را به‌روز نگه داریم، اما مسئولیت نهایی بررسی آخرین بخشنامه‌ها با کاربر است.</p>
      </section>
    </div>
  );
};

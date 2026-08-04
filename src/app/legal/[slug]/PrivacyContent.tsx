import { legalOperatorConfig } from '../../../lib/legalConfig';
import React from 'react';

export const PrivacyContent = ({ currentLang }: { currentLang: string }) => {
  return (
    <div className="space-y-6 text-sm text-[#526174] leading-relaxed rtl text-right">
      <h1 className="text-3xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-4">سیاست حفظ حریم خصوصی</h1>
      
      <div className="bg-[#eef3f8] border-l-4 border-[#2F6FED] p-4 rounded-r-xl">
        <p className="font-bold text-[#142033] text-xs">اطلاعات حقوقی مجری (شرکت) به زودی پس از تایید نهایی در این بخش قرار می‌گیرد.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱. هویت پلتفرم (Identity of the Platform)</h2>
        <p>پلتفرم DORVIA EUROP به عنوان یک پلتفرم اطلاعاتی و تسهیل‌گر خدمات در رومانی فعالیت می‌کند. فعالیت می‌کند.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۲. اطلاعات تماس (Contact Information)</h2>
        <p>برای امور مربوط به حریم خصوصی، می‌توانید با ایمیل حریم خصوصی اعلام‌شده در این صفحه تماس بگیرید.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۳. داده‌های جمع‌آوری شده (Data Collected)</h2>
        <p>ما فقط اطلاعات پایه‌ای که برای بررسی اولیه درخواست شما ضروری است را جمع‌آوری می‌کنیم شامل: نام، شماره تماس، ایمیل (اختیاری)، وضعیت تحصیلی و شغلی اولیه و هدف اصلی.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۴. هدف از جمع‌آوری (Purpose of Collection)</h2>
        <p>اطلاعات صرفاً جهت امکان‌سنجی شرایط شما برای مهاجرت/تحصیل/ثبت شرکت در رومانی و برقراری تماس اولیه برای ارائه مشاوره استفاده می‌شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۵. مبنای قانونی پردازش (Legal Basis)</h2>
        <p>مبنای قانونی ما برای این پردازش، درخواست صریح شما پیش از عقد قرارداد احتمالی (Steps requested before entering a service agreement) و رضایت صریح (Consent) برای موارد بازاریابی است.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۶. پردازش فرم‌ها (Form Processing)</h2>
        <p>اطلاعات وارد شده در فرم مستقیماً به سرورهای ما ارسال شده و پس از اعتبارسنجی اولیه به تیم بررسی ارجاع داده می‌شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۷. استفاده از تلگرام (Telegram Usage)</h2>
        <p>جهت تسریع در اطلاع‌رسانی به کارشناسان ما، اطلاعات فرم شما ممکن است از طریق ربات‌های امن به گروه تلگرامی اختصاصی و بسته مدیران DORVIA EUROP منتقل شود (Third-party messaging service).</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۸. دریافت‌کنندگان و دسترسی مجاز (Recipients & Access)</h2>
        <p>دسترسی به اطلاعات شما محدود به کارشناسان و مدیران تأیید شده DORVIA EUROP است. در حال حاضر هیچ اطلاعاتی با ارائه‌دهندگان شخص ثالث (Third-party Providers) به اشتراک گذاشته نمی‌شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۹. انتقال بین‌المللی داده‌ها (International Data Transfer)</h2>
        <p>به دلیل استفاده از سرویس پیام‌رسان تلگرام، بخشی از داده‌های ارسالی شما ممکن است بر روی سرورهای این پلتفرم در خارج از اتحادیه اروپا پردازش یا ذخیره شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۰. سیاست نگهداری (Retention Policy)</h2>
        <p>{legalOperatorConfig.retentionPolicy}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۱. درخواست اصلاح و حذف (Deletion & Correction)</h2>
        <p>شما می‌توانید در هر زمان با ارسال ایمیل به اطلاعات تماس اعلام شده، درخواست اصلاح اطلاعات یا حذف کامل تاریخچه پیام‌های مربوط به خود را ثبت کنید (شامل پاک کردن دستی پیام‌ها از تلگرام).</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۲. حقوق کاربر (User Rights)</h2>
        <p>حق دسترسی، حق فراموشی، حق محدود کردن پردازش و حق مخالفت با پردازش برای تمامی کاربران محفوظ است.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۳. محدودیت‌های امنیتی (Security Limitations)</h2>
        <p>اگرچه ما از رمزنگاری استاندارد وب استفاده می‌کنیم، انتقال داده بر بستر اینترنت و سرویس‌های شخص ثالث هرگز ۱۰۰٪ تضمین شده نیست.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۴. داده‌های کودکان (Children’s Data)</h2>
        <p>ما به‌طور عمدی اطلاعات افراد زیر ۱۸ سال را بدون رضایت والدین پردازش نمی‌کنیم.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۵. ارتباطات بازاریابی (Marketing Communications)</h2>
        <p>فقط در صورت تیک زدن گزینه اختیاری در فرم ارزیابی، برای شما پیشنهادات و اخبار ارسال خواهد شد.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۶. کوکی‌ها و آنالیتیکس (Cookie & Analytics)</h2>
        <p>در حال حاضر این سایت از هیچ کوکی شخص ثالث یا ابزار رهگیری تحلیلی (مانند Google Analytics) پیش از کسب اجازه استفاده نمی‌کند و فقط کوکی‌های ضروری عملکردی استفاده می‌شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۷. تاریخ به‌روزرسانی (Policy Update Date)</h2>
        <p>این سند آخرین بار در تاریخ {legalOperatorConfig.privacyPolicyUpdatedAt} به‌روزرسانی شده است.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱۸. روش تماس برای درخواست‌های حریم خصوصی (Privacy Requests)</h2>
        <p>برای ثبت هرگونه درخواست مرتبط با حریم خصوصی خود با ایمیل {legalOperatorConfig.privacyContactEmail} در ارتباط باشید.</p>
      </section>
    </div>
  );
};

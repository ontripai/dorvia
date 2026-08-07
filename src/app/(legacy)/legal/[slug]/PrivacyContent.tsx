import { legalOperatorConfig } from '@/lib/legalConfig';
import React from 'react';

export const PrivacyContent = ({ currentLang }: { currentLang: string }) => {
  const isFa = currentLang === 'fa';
  
  return (
    <div className={`space-y-6 text-sm text-[#526174] leading-relaxed ${isFa ? 'rtl text-right' : 'ltr text-left'}`}>
      <h1 className="text-3xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-4">
        {isFa ? 'سیاست حفظ حریم خصوصی' : 'Privacy Policy'}
      </h1>
      
      <div className="bg-[#eef3f8] border-l-4 border-[#2F6FED] p-4 rounded-r-xl">
        <p className="font-bold text-[#142033] text-xs">
          {isFa 
            ? 'اطلاعات حقوقی مجری (شرکت) به زودی پس از تایید نهایی در این بخش قرار می‌گیرد.'
            : 'Legal operator (company) information will be provided in this section upon final approval.'}
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱. هویت پلتفرم (Identity of the Platform)' : '1. Identity of the Platform'}
        </h2>
        <p>
          {isFa 
            ? 'پلتفرم DORVIA EUROP به عنوان یک پلتفرم اطلاعاتی و تسهیل‌گر خدمات در رومانی فعالیت می‌کند.' 
            : 'The DORVIA EUROP platform operates as an informational and service facilitation platform in Romania.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۲. اطلاعات تماس (Contact Information)' : '2. Contact Information'}
        </h2>
        <p>
          {isFa
            ? 'برای امور مربوط به حریم خصوصی، می‌توانید با ایمیل حریم خصوصی اعلام‌شده در این صفحه تماس بگیرید.'
            : 'For privacy-related matters, you can contact the privacy email address provided on this page.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۳. داده‌های جمع‌آوری شده (Data Collected)' : '3. Data Collected'}
        </h2>
        <p>
          {isFa
            ? 'ما فقط اطلاعات پایه‌ای که برای بررسی اولیه درخواست شما ضروری است را جمع‌آوری می‌کنیم شامل: نام، شماره تماس، ایمیل (اختیاری)، وضعیت تحصیلی و شغلی اولیه و هدف اصلی.'
            : 'We only collect basic information necessary for the initial review of your request, including: name, contact number, email (optional), initial educational and occupational status, and primary goal.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۴. هدف از جمع‌آوری (Purpose of Collection)' : '4. Purpose of Collection'}
        </h2>
        <p>
          {isFa
            ? 'اطلاعات صرفاً جهت امکان‌سنجی شرایط شما برای مهاجرت/تحصیل/ثبت شرکت در رومانی و برقراری تماس اولیه برای ارائه مشاوره استفاده می‌شود.'
            : 'The information is used solely to assess the feasibility of your circumstances for immigration/study/company registration in Romania and to establish initial contact for providing consultation.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۵. مبنای قانونی پردازش (Legal Basis)' : '5. Legal Basis'}
        </h2>
        <p>
          {isFa
            ? 'مبنای قانونی ما برای این پردازش، درخواست صریح شما پیش از عقد قرارداد احتمالی (Steps requested before entering a service agreement) و رضایت صریح (Consent) برای موارد بازاریابی است.'
            : 'Our legal basis for this processing is your explicit request before potentially entering a service agreement, and explicit consent for marketing purposes.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۶. پردازش فرم‌ها (Form Processing)' : '6. Form Processing'}
        </h2>
        <p>
          {isFa
            ? 'اطلاعات وارد شده در فرم مستقیماً به سرورهای ما ارسال شده و پس از اعتبارسنجی اولیه به تیم بررسی ارجاع داده می‌شود.'
            : 'The information entered in the form is sent directly to our servers and, after initial validation, is forwarded to the review team.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۷. استفاده از تلگرام (Telegram Usage)' : '7. Telegram Usage'}
        </h2>
        <p>
          {isFa
            ? 'جهت تسریع در اطلاع‌رسانی به کارشناسان ما، اطلاعات فرم شما ممکن است از طریق ربات‌های امن به گروه تلگرامی اختصاصی و بسته مدیران DORVIA EUROP منتقل شود (Third-party messaging service).'
            : 'To expedite notification to our experts, your form information may be securely transferred via bots to a dedicated, closed Telegram group of DORVIA EUROP management (Third-party messaging service).'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۸. دریافت‌کنندگان و دسترسی مجاز (Recipients & Access)' : '8. Recipients & Access'}
        </h2>
        <p>
          {isFa
            ? 'دسترسی به اطلاعات شما محدود به کارشناسان و مدیران تأیید شده DORVIA EUROP است. در حال حاضر هیچ اطلاعاتی با ارائه‌دهندگان شخص ثالث (Third-party Providers) به اشتراک گذاشته نمی‌شود.'
            : 'Access to your information is restricted to approved DORVIA EUROP experts and management. Currently, no information is shared with third-party providers.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۹. انتقال بین‌المللی داده‌ها (International Data Transfer)' : '9. International Data Transfer'}
        </h2>
        <p>
          {isFa
            ? 'به دلیل استفاده از سرویس پیام‌رسان تلگرام، بخشی از داده‌های ارسالی شما ممکن است بر روی سرورهای این پلتفرم در خارج از اتحادیه اروپا پردازش یا ذخیره شود.'
            : 'Due to the use of the Telegram messaging service, a portion of your submitted data may be processed or stored on this platform’s servers outside the European Union.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۰. سیاست نگهداری (Retention Policy)' : '10. Retention Policy'}
        </h2>
        <p>{legalOperatorConfig.retentionPolicy}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۱. درخواست اصلاح و حذف (Deletion & Correction)' : '11. Deletion & Correction'}
        </h2>
        <p>
          {isFa
            ? 'شما می‌توانید در هر زمان با ارسال ایمیل به اطلاعات تماس اعلام شده، درخواست اصلاح اطلاعات یا حذف کامل تاریخچه پیام‌های مربوط به خود را ثبت کنید (شامل پاک کردن دستی پیام‌ها از تلگرام).'
            : 'You can request the correction of your information or the complete deletion of your message history (including manual deletion of messages from Telegram) at any time by sending an email to the provided contact details.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۲. حقوق کاربر (User Rights)' : '12. User Rights'}
        </h2>
        <p>
          {isFa
            ? 'حق دسترسی، حق فراموشی، حق محدود کردن پردازش و حق مخالفت با پردازش برای تمامی کاربران محفوظ است.'
            : 'The right to access, the right to be forgotten, the right to restrict processing, and the right to object to processing are reserved for all users.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۳. محدودیت‌های امنیتی (Security Limitations)' : '13. Security Limitations'}
        </h2>
        <p>
          {isFa
            ? 'اگرچه ما از رمزنگاری استاندارد وب استفاده می‌کنیم، انتقال داده بر بستر اینترنت و سرویس‌های شخص ثالث هرگز ۱۰۰٪ تضمین شده نیست.'
            : 'Although we use standard web encryption, data transmission over the internet and third-party services is never 100% guaranteed.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۴. داده‌های کودکان (Children’s Data)' : '14. Children’s Data'}
        </h2>
        <p>
          {isFa
            ? 'ما به‌طور عمدی اطلاعات افراد زیر ۱۸ سال را بدون رضایت والدین پردازش نمی‌کنیم.'
            : 'We do not intentionally process information from individuals under 18 without parental consent.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۵. ارتباطات بازاریابی (Marketing Communications)' : '15. Marketing Communications'}
        </h2>
        <p>
          {isFa
            ? 'فقط در صورت تیک زدن گزینه اختیاری در فرم ارزیابی، برای شما پیشنهادات و اخبار ارسال خواهد شد.'
            : 'Offers and news will only be sent to you if you check the optional box in the assessment form.'}
        </p>
      </section>

      <section className="space-y-2" id="cookies">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۶. کوکی‌ها و آنالیتیکس (Cookie & Analytics)' : '16. Cookie & Analytics'}
        </h2>
        <p>
          {isFa
            ? 'در حال حاضر این سایت از هیچ کوکی شخص ثالث یا ابزار رهگیری تحلیلی (مانند Google Analytics) پیش از کسب اجازه استفاده نمی‌کند و فقط کوکی‌های ضروری عملکردی استفاده می‌شود.'
            : 'Currently, this site does not use any third-party cookies or analytical tracking tools (like Google Analytics) without prior consent, and only essential functional cookies are used.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۷. تاریخ به‌روزرسانی (Policy Update Date)' : '17. Policy Update Date'}
        </h2>
        <p>
          {isFa 
            ? `این سند آخرین بار در تاریخ ${legalOperatorConfig.privacyPolicyUpdatedAt} به‌روزرسانی شده است.`
            : `This document was last updated on ${legalOperatorConfig.privacyPolicyUpdatedAt}.`}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱۸. روش تماس برای درخواست‌های حریم خصوصی (Privacy Requests)' : '18. Privacy Requests Contact'}
        </h2>
        <p>
          {isFa
            ? `برای ثبت هرگونه درخواست مرتبط با حریم خصوصی خود با ایمیل ${legalOperatorConfig.privacyContactEmail} در ارتباط باشید.`
            : `To submit any requests related to your privacy, please contact us at ${legalOperatorConfig.privacyContactEmail}.`}
        </p>
      </section>
    </div>
  );
};

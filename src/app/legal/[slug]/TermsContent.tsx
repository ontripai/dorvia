import React from 'react';

export const TermsContent = ({ currentLang }: { currentLang: string }) => {
  return (
    <div className="space-y-6 text-sm text-[#526174] leading-relaxed rtl text-right">
      <h1 className="text-3xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-4">شرایط و قوانین استفاده (Terms of Use)</h1>
      
      <div className="bg-[#eef3f8] border-l-4 border-[#2F6FED] p-4 rounded-r-xl">
        <p className="font-bold text-[#142033] text-xs">حوزه قضایی و اطلاعات ثبتی پس از تایید نهایی درج خواهد شد.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۱. پذیرش شرایط</h2>
        <p>با استفاده از سایت DORVIA EUROP شما موافقت خود را با این شرایط اعلام می‌کنید. اگر با این شرایط موافق نیستید، لطفاً از سایت استفاده نکنید.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۲. استفاده از وب‌سایت (Website Usage)</h2>
        <p>محتوای این سایت صرفاً جهت اطلاع‌رسانی است. استفاده تجاری از محتوای این سایت یا استخراج خودکار داده‌ها (Scraping) ممنوع است.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۳. مسئولیت‌های کاربر (User Responsibilities)</h2>
        <p>شما متعهد می‌شوید که اطلاعات صحیح و دقیق را در فرم‌های ارزیابی وارد کنید. ارائه اطلاعات هویتی اشتباه ممکن است منجر به توقف خدمات شود.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۴. مالکیت معنوی (Intellectual Property)</h2>
        <p>تمامی حقوق مالکیت معنوی از جمله متون، طراحی‌ها، لوگوها و کدهای این وب‌سایت متعلق به DORVIA EUROP است.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۵. مرزهای خدمات (Service Boundaries)</h2>
        <p>ثبت فرم ارزیابی به معنای انعقاد قرارداد خدمات نیست. توافق برای خدمات حقوقی، مهاجرتی یا تجاری تنها پس از امضای قرارداد کتبی جداگانه رسمیت می‌یابد.</p>
      </section>
      
      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">۶. خدمات اشخاص ثالث (Provider / Marketplace placeholder)</h2>
        <p>[توجه: شرایط ارائه‌دهندگان خدمات محلی، تبلیغات و ثبت‌نام همکاران پس از اخذ تأییدیه‌های حقوقی در این بخش منتشر خواهد شد].</p>
      </section>
    </div>
  );
};

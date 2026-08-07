import React from 'react';

export const TermsContent = ({ currentLang }: { currentLang: string }) => {
  const isFa = currentLang === 'fa';

  return (
    <div className={`space-y-6 text-sm text-[#526174] leading-relaxed ${isFa ? 'rtl text-right' : 'ltr text-left'}`}>
      <h1 className="text-3xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-4">
        {isFa ? 'شرایط و قوانین استفاده (Terms of Use)' : 'Terms of Use'}
      </h1>

      <div className="bg-[#eef3f8] border-l-4 border-[#2F6FED] p-4 rounded-r-xl">
        <p className="font-bold text-[#142033] text-xs">
          {isFa
            ? 'حوزه قضایی و اطلاعات ثبتی پس از تایید نهایی درج خواهد شد.'
            : 'Jurisdiction and registration information will be included after final approval.'}
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۱. پذیرش شرایط' : '1. Acceptance of Terms'}
        </h2>
        <p>
          {isFa
            ? 'با استفاده از سایت DORVIA EUROP شما موافقت خود را با این شرایط اعلام می‌کنید. اگر با این شرایط موافق نیستید، لطفاً از سایت استفاده نکنید.'
            : 'By using the DORVIA EUROP website, you agree to these terms. If you do not agree with these terms, please do not use the site.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۲. استفاده از وب‌سایت (Website Usage)' : '2. Website Usage'}
        </h2>
        <p>
          {isFa
            ? 'محتوای این سایت صرفاً جهت اطلاع‌رسانی است. استفاده تجاری از محتوای این سایت یا استخراج خودکار داده‌ها (Scraping) ممنوع است.'
            : 'The content of this site is for informational purposes only. Commercial use of the content or automated data extraction (scraping) is prohibited.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۳. مسئولیت‌های کاربر (User Responsibilities)' : '3. User Responsibilities'}
        </h2>
        <p>
          {isFa
            ? 'شما متعهد می‌شوید که اطلاعات صحیح و دقیق را در فرم‌های ارزیابی وارد کنید. ارائه اطلاعات هویتی اشتباه ممکن است منجر به توقف خدمات شود.'
            : 'You commit to providing true and accurate information in the assessment forms. Providing false identity information may lead to the suspension of services.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۴. مالکیت معنوی (Intellectual Property)' : '4. Intellectual Property'}
        </h2>
        <p>
          {isFa
            ? 'تمامی حقوق مالکیت معنوی از جمله متون، طراحی‌ها، لوگوها و کدهای این وب‌سایت متعلق به DORVIA EUROP است.'
            : 'All intellectual property rights, including texts, designs, logos, and the code of this website, belong to DORVIA EUROP.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۵. مرزهای خدمات (Service Boundaries)' : '5. Service Boundaries'}
        </h2>
        <p>
          {isFa
            ? 'ثبت فرم ارزیابی به معنای انعقاد قرارداد خدمات نیست. توافق برای خدمات حقوقی، مهاجرتی یا تجاری تنها پس از امضای قرارداد کتبی جداگانه رسمیت می‌یابد.'
            : 'Submitting an assessment form does not constitute entering into a service agreement. Agreements for legal, immigration, or business services are formalized only after signing a separate written contract.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-[#142033]">
          {isFa ? '۶. خدمات اشخاص ثالث (Provider / Marketplace placeholder)' : '6. Third-Party Services (Provider / Marketplace placeholder)'}
        </h2>
        <p>
          {isFa
            ? '[توجه: شرایط ارائه‌دهندگان خدمات محلی، تبلیغات و ثبت‌نام همکاران پس از اخذ تأییدیه‌های حقوقی در این بخش منتشر خواهد شد].'
            : '[Note: Terms for local service providers, advertisements, and partner registrations will be published in this section upon securing legal approvals].'}
        </p>
      </section>
    </div>
  );
};

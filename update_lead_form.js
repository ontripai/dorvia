const fs = require('fs');

let content = fs.readFileSync('src/components/LeadForm.tsx', 'utf8');

// 1. Update State
content = content.replace(
`    currentCountry: currentLang === 'fa' ? 'ایران' : 'Iran',
    nationality: currentLang === 'fa' ? 'ایرانی' : 'Iranian',
    preferredLanguage: currentLang === 'fa' ? 'فارسی' : 'English',
    mainGoal: 'study',
    educationLevel: currentLang === 'fa' ? 'کارشناسی' : 'Bachelor',
    workExperience: '3-5',
    approximateBudget: '10000-20000',
    maritalStatus: 'single',
    message: '',
    privacyConsent: false`,
`    mainGoal: 'study',
    educationLevel: currentLang === 'fa' ? 'کارشناسی' : 'Bachelor',
    workExperience: '3-5',
    approximateBudget: '10000-20000',
    maritalStatus: 'single',
    message: '',
    privacyAcknowledgment: false,
    marketingConsent: false,
    _gotcha: ''`
);

// 2. Update handleSubmit
content = content.replace(
`  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      setErrorMsg(currentLang === 'fa' ? 'لطفاً موافقت خود با قوانین حریم خصوصی را تایید کنید.' : 'Please accept the privacy terms to submit.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    }, 1200);
  };`,
`  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAcknowledgment) {
      setErrorMsg(currentLang === 'fa' ? 'لطفاً مطالعه قوانین حریم خصوصی را تایید کنید.' : 'Please acknowledge the privacy policy to submit.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(currentLang === 'fa' ? 'متاسفانه مشکلی در ارسال رخ داد. لطفاً دوباره تلاش کنید.' : 'Submission failed. Please try again later.');
    }
  };`
);

// 3. Update Step 1 JSX
content = content.replace(
`                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr"
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white text-start"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.currentCountry}</label>
                  <input
                    type="text"
                    name="currentCountry"
                    value={formData.currentCountry}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  />
                </div>`,
`                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.email} <span className="text-slate-400 font-normal">({currentLang === 'fa' ? 'اختیاری' : 'Optional'})</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr"
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white text-start"
                  />
                </div>`
);

// 4. Update Step 4 JSX
content = content.replace(
`                <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#2F6FED] rounded border-[#dfe6ef] focus:ring-[#2F6FED]"
                  />
                  <span className="text-[#526174] leading-relaxed">
                    {t.evaluationForm.privacyConsent}
                  </span>
                </label>`,
`                <input
                  type="text"
                  name="_gotcha"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData._gotcha}
                  onChange={handleChange}
                />
                
                <div className="bg-[#f0f4f8] p-4 rounded-xl border border-[#dfe6ef] space-y-2 mt-4">
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' 
                      ? 'اطلاعات این فرم برای بررسی اولیه درخواست و تماس با شما پردازش میشود. در ساختار فعلی، اطلاعات از طریق سرویس Telegram برای مدیران مجاز DORVIA EUROP ارسال میشود. جزئیات مربوط به هدف پردازش، مدت نگهداری و حقوق شما در سیاست حریم خصوصی توضیح داده شده است.'
                      : 'The information in this form is processed for an initial review of your request and to contact you. Currently, information is transmitted via Telegram to authorized DORVIA EUROP administrators. Details regarding the purpose of processing, retention periods, and your rights are explained in the Privacy Policy.'}
                  </p>
                </div>

                <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    name="privacyAcknowledgment"
                    checked={formData.privacyAcknowledgment}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#2F6FED] rounded border-[#dfe6ef] focus:ring-[#2F6FED]"
                  />
                  <span className="text-[#142033] font-bold leading-relaxed text-xs">
                    {currentLang === 'fa' ? 'سیاست حریم خصوصی و نحوه پردازش درخواست را مطالعه کردم.' : 'I have read the Privacy Policy and how the request is processed.'} *
                  </span>
                </label>

                <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#2F6FED] rounded border-[#dfe6ef] focus:ring-[#2F6FED]"
                  />
                  <span className="text-[#526174] leading-relaxed text-xs">
                    {currentLang === 'fa' ? 'مایلم اخبار و پیشنهادهای DORVIA EUROP را نیز دریافت کنم.' : 'I would like to receive news and offers from DORVIA EUROP.'}
                  </span>
                </label>`
);

fs.writeFileSync('src/components/LeadForm.tsx', content, 'utf8');
console.log('LeadForm updated');

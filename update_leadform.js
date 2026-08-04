const fs = require('fs');

let content = fs.readFileSync('src/components/LeadForm.tsx', 'utf8');

// Imports
content = content.replace(
  `import { getTranslations } from '../lib/i18n';`,
  `import { getTranslations } from '../lib/i18n';\nimport { hasVerifiedLegalEntity } from '../lib/legalConfig';`
);

// State minimization
content = content.replace(
  `    mainGoal: 'study',
    educationLevel: currentLang === 'fa' ? 'کارشناسی' : 'Bachelor',
    workExperience: '3-5',
    approximateBudget: '10000-20000',
    maritalStatus: 'single',
    message: '',`,
  `    mainGoal: 'study',
    message: '',`
);

// Validation
content = content.replace(
  `    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        setErrorMsg(currentLang === 'fa' ? 'لطفاً نام و شماره تماس خود را وارد کنید.' : 'Please enter your name and phone number.');
        return;
      }
    }`,
  `    if (currentStep === 1) {
      if (!formData.fullName.trim() || (!formData.phone.trim() && !formData.email.trim())) {
        setErrorMsg(currentLang === 'fa' ? 'لطفاً نام و حداقل یک راه ارتباطی (تلفن یا ایمیل) را وارد کنید.' : 'Please enter your name and at least one contact method (phone or email).');
        return;
      }
    }`
);

// Step progression
content = content.replace(/Math\.min\(prev \+ 1, 4\)/g, 'Math.min(prev + 1, 3)');
content = content.replace(/گام \${currentStep} از ۴/g, 'گام ${currentStep} از ۳');
content = content.replace(/Step \${currentStep} of 4/g, 'Step ${currentStep} of 3');
content = content.replace(/currentStep \/ 4/g, 'currentStep / 3');
content = content.replace(/currentStep < 4/g, 'currentStep < 3');

// Remove Step 3 HTML
const step3Start = content.indexOf(`{/* STEP 3: Background Details */}`);
const step4Start = content.indexOf(`{/* STEP 4: Details & Consent */}`);
if (step3Start !== -1 && step4Start !== -1) {
  content = content.substring(0, step3Start) + content.substring(step4Start);
}

// Rename Step 4 to Step 3
content = content.replace(/{currentStep === 4 && \(/g, '{currentStep === 3 && (');
content = content.replace(/۴\. توضیحات و موافقت‌نامه حریم خصوصی/g, '۳. توضیحات و موافقت‌نامه حریم خصوصی');
content = content.replace(/4\. Additional Details & Privacy/g, '3. Additional Details & Privacy');

// Email placeholder
content = content.replace(
  `{currentLang === 'fa' ? 'اختیاری' : 'Optional'}`,
  `{currentLang === 'fa' ? 'الزامی در صورت عدم ثبت تلفن' : 'Required if no phone'}`
);
content = content.replace(
  `{t.evaluationForm.phone} *`,
  `{t.evaluationForm.phone} <span className="text-slate-400 font-normal">({currentLang === 'fa' ? 'الزامی در صورت عدم ثبت ایمیل' : 'Required if no email'})</span>`
);

// Production Disable Logic
const renderStart = content.indexOf('if (isSubmitted) {');
const fallbackUi = `
  if (process.env.NODE_ENV === 'production' && !hasVerifiedLegalEntity()) {
    return (
      <div className={\`editorial-card p-6 sm:p-10 bg-white border border-[#dfe6ef] \${isModal ? 'shadow-none' : 'shadow-lg'} text-center\`}>
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-2xl font-bold mb-4">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-extrabold text-[#142033] mb-2">
          {currentLang === 'fa' ? 'نسخه آزمایشی — فرم غیرفعال است' : 'Preview Mode — Form Disabled'}
        </h3>
        <p className="text-sm text-[#526174] leading-relaxed mb-6">
          {currentLang === 'fa' 
            ? 'ارسال آنلاین موقتاً در دسترس نیست. لطفاً از واتساپ، تلفن یا ایمیل استفاده کنید.' 
            : 'Online submission is temporarily unavailable. Please contact us via WhatsApp, phone, or email.'}
        </p>
        <div className="space-y-2 text-sm font-bold text-[#2F6FED]">
          <p>📞 +40 700 000 000</p>
          <p>✉️ ontrip.ai@gmail.com</p>
        </div>
      </div>
    );
  }
`;
content = content.substring(0, renderStart) + fallbackUi + content.substring(renderStart);

fs.writeFileSync('src/components/LeadForm.tsx', content, 'utf8');
console.log('LeadForm minimized and secured.');

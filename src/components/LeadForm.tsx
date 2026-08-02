'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { GraduationCap, BriefcaseBusiness, Building2, ChartNoAxesCombined, Users, House, Check, ArrowRight, ArrowLeft, ShieldCheck, LockKeyhole } from './Icons';

interface LeadFormProps {
  currentLang: Language;
  isModal?: boolean;
  onSuccess?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ currentLang, isModal = false, onSuccess }) => {
  const t = getTranslations(currentLang);
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;
  const BackArrowIcon = currentLang === 'fa' ? ArrowRight : ArrowLeft;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentCountry: currentLang === 'fa' ? 'ایران' : 'Iran',
    nationality: currentLang === 'fa' ? 'ایرانی' : 'Iranian',
    preferredLanguage: currentLang === 'fa' ? 'فارسی' : 'English',
    mainGoal: 'study',
    educationLevel: currentLang === 'fa' ? 'کارشناسی' : 'Bachelor',
    workExperience: '3-5',
    approximateBudget: '10000-20000',
    maritalStatus: 'single',
    message: '',
    privacyConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGoalSelect = (goalId: string) => {
    setFormData((prev) => ({ ...prev, mainGoal: goalId }));
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        setErrorMsg(currentLang === 'fa' ? 'لطفاً نام و شماره تماس خود را وارد کنید.' : 'Please enter your name and phone number.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  const goalOptions = [
    { id: 'study', title: t.evaluationForm.goals.study, icon: GraduationCap },
    { id: 'work', title: t.evaluationForm.goals.work, icon: BriefcaseBusiness },
    { id: 'company', title: t.evaluationForm.goals.company, icon: Building2 },
    { id: 'investment', title: t.evaluationForm.goals.investment, icon: ChartNoAxesCombined },
    { id: 'family', title: t.evaluationForm.goals.family, icon: Users },
    { id: 'living', title: currentLang === 'fa' ? 'زندگی و استقرار' : 'Living & Relocation', icon: House },
  ];

  if (isSubmitted) {
    return (
      <div className="editorial-card p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto bg-white border border-[#dfe6ef]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-[#142033]">{t.evaluationForm.successTitle}</h3>
          <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">{t.evaluationForm.successMsg}</p>
        </div>
        <div className="pt-2 text-xs text-[#788697]">
          {currentLang === 'fa' ? 'کد پیگیری ارزیابی شما ثبت شد. به زودی تماس خواهیم گرفت.' : 'Your assessment request has been safely registered.'}
        </div>
      </div>
    );
  }

  return (
    <div className={`editorial-card p-6 sm:p-10 bg-white border border-[#dfe6ef] ${isModal ? 'shadow-none' : 'shadow-lg'}`}>
      
      {/* Form Header */}
      <div className="mb-8 space-y-2 border-b border-[#dfe6ef] pb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
            {currentLang === 'fa' ? 'ارزیابی رایگان پرونده' : 'Free Case Evaluation'}
          </span>
          <span className="text-xs font-bold text-[#526174]">
            {currentLang === 'fa' ? `گام ${currentStep} از ۴` : `Step ${currentStep} of 4`}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
          {t.evaluationForm.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#526174]">
          {t.evaluationForm.subtitle}
        </p>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#eef3f8] h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-[#2F6FED] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Controls Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Contact Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? '۱. اطلاعات تماس و هویت اولیه' : '1. Basic Contact Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.fullName} *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={currentLang === 'fa' ? 'مثال: علی محمدی' : 'e.g. John Smith'}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.phone} *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr"
                    placeholder="+98 912 000 0000"
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white text-start"
                  />
                </div>

                <div className="space-y-1">
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
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Objective Selection */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? '۲. هدف اصلی شما از اقدام برای رومانی' : '2. Primary Objective'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {goalOptions.map((g) => {
                  const isSelected = formData.mainGoal === g.id;
                  const IconComp = g.icon;
                  return (
                    <div
                      key={g.id}
                      onClick={() => handleGoalSelect(g.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 rtl:space-x-reverse ${
                        isSelected ? 'bg-blue-50 border-[#2F6FED] text-[#2F6FED] font-bold shadow-xs' : 'bg-white border-[#dfe6ef] text-[#142033] hover:border-[#2F6FED]/40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#2F6FED] text-white' : 'bg-[#eef3f8] text-[#2F6FED]'}`}>
                        <IconComp size={18} />
                      </div>
                      <span className="leading-snug">{g.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Background Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? '۳. سوابق تحصیلی، شغلی و مالی' : '3. Academic & Budget Background'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.educationLevel}</label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  >
                    <option value="دیپلم">{currentLang === 'fa' ? 'دیپلم / پیش‌دانشگاهی' : 'High School Diploma'}</option>
                    <option value="کاردانی">{currentLang === 'fa' ? 'کاردانی / فوق دیپلم' : 'Associate Degree'}</option>
                    <option value="کارشناسی">{currentLang === 'fa' ? 'کارشناسی (لیسانس)' : 'Bachelor Degree'}</option>
                    <option value="کارشناسی ارشد">{currentLang === 'fa' ? 'کارشناسی ارشد (فوق لیسانس)' : 'Master Degree'}</option>
                    <option value="دکتری">{currentLang === 'fa' ? 'دکتری تخصصی (PhD)' : 'Doctorate / PhD'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.workExperience}</label>
                  <select
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  >
                    <option value="0-1">{currentLang === 'fa' ? 'کمتر از ۱ سال' : 'Less than 1 year'}</option>
                    <option value="1-3">{currentLang === 'fa' ? '۱ تا ۳ سال' : '1 - 3 years'}</option>
                    <option value="3-5">{currentLang === 'fa' ? '۳ تا ۵ سال' : '3 - 5 years'}</option>
                    <option value="5+">{currentLang === 'fa' ? 'بیش از ۵ سال' : 'More than 5 years'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.approximateBudget}</label>
                  <select
                    name="approximateBudget"
                    value={formData.approximateBudget}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  >
                    <option value="5000-10000">5,000 - 10,000 EUR</option>
                    <option value="10000-20000">10,000 - 20,000 EUR</option>
                    <option value="20000+">20,000+ EUR</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.maritalStatus}</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  >
                    <option value="single">{t.evaluationForm.single}</option>
                    <option value="married">{t.evaluationForm.married}</option>
                    <option value="marriedWithChildren">{t.evaluationForm.marriedWithChildren}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Details & Consent */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? '۴. توضیحات و موافقت‌نامه حریم خصوصی' : '4. Additional Details & Privacy'}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#142033]">{t.evaluationForm.message}</label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={currentLang === 'fa' ? 'نکات اختصاصی پرونده، سوالات احتمالی یا دانشگاه‌های مدنظر...' : 'Specific notes, target universities, or questions...'}
                    className="w-full p-3 rounded-xl border border-[#dfe6ef] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
                  />
                </div>

                <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer pt-2">
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
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-[#dfe6ef] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-[#dfe6ef] bg-white text-[#142033] font-bold text-xs hover:bg-[#eef3f8] flex items-center space-x-2 rtl:space-x-reverse transition-colors cursor-pointer"
              >
                <BackArrowIcon size={14} />
                <span>{currentLang === 'fa' ? 'گام قبل' : 'Back'}</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-[#1554bd] text-white font-bold text-xs flex items-center space-x-2 rtl:space-x-reverse transition-colors shadow-xs cursor-pointer"
              >
                <span>{currentLang === 'fa' ? 'گام بعدی' : 'Next Step'}</span>
                <ArrowIcon size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-[#2F6FED] hover:bg-[#1A5BB8] text-white font-extrabold text-xs flex items-center space-x-2 rtl:space-x-reverse transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? t.evaluationForm.submitting : t.evaluationForm.submit}</span>
                <Check size={16} />
              </button>
            )}
          </div>

        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 bg-[#eef3f8] rounded-2xl p-6 border border-[#dfe6ef] space-y-4 flex flex-col justify-between">
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-extrabold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>{currentLang === 'fa' ? 'چه اتفاقی پس از ارسال می‌افتد؟' : 'What Happens Next?'}</span>
            </div>
            
            <ol className="space-y-3 text-[#526174] leading-relaxed pt-1">
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-[#2F6FED]">۱.</span>
                <span>{currentLang === 'fa' ? 'بررسی سوابق تحصیلی و شغلی شما توسط کارشناسان حقوقی در رومانی.' : 'Evaluation of your documents against Romanian criteria.'}</span>
              </li>
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-[#2F6FED]">۲.</span>
                <span>{currentLang === 'fa' ? 'تماس مستقیم از طریق واتس‌اپ یا ایمیل جهت تکمیل اطلاعات.' : 'Direct contact via WhatsApp or Email to finalize options.'}</span>
              </li>
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-[#2F6FED]">۳.</span>
                <span>{currentLang === 'fa' ? 'ارائه شفاف‌ترین مسیرهای قانونی بدون ادعاهای غیرواقعی.' : 'Clear pathway recommendation compliant with official IGI standards.'}</span>
              </li>
            </ol>
          </div>

          <div className="pt-4 border-t border-[#dfe6ef] flex items-center space-x-2 rtl:space-x-reverse text-[11px] text-[#788697]">
            <LockKeyhole size={14} className="shrink-0 text-[#2F6FED]" />
            <span>{currentLang === 'fa' ? 'اطلاعات شما طبق قوانین GDPR اروپا کاملاً محرمانه می‌ماند.' : 'Strictly confidential under EU GDPR rules.'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

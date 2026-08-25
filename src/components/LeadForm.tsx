'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { hasVerifiedLegalEntity } from '../lib/legalConfig';
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
    mainGoal: 'study',
    message: '',
    privacyAcknowledgment: false,
    marketingConsent: false,
    _gotcha: ''
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
      if (!formData.fullName.trim() || (!formData.phone.trim() && !formData.email.trim())) {
        setErrorMsg(currentLang === 'fa' ? 'لطفاً نام و حداقل یک راه ارتباطی (تلفن یا ایمیل) را وارد کنید.' : 'Please enter your name and at least one contact method (phone or email).');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  const goalOptions = [
    { id: 'study', title: t.evaluationForm.goals.study, icon: GraduationCap },
    { id: 'work', title: t.evaluationForm.goals.work, icon: BriefcaseBusiness },
    { id: 'company', title: t.evaluationForm.goals.company, icon: Building2 },
    { id: 'investment', title: t.evaluationForm.goals.investment, icon: ChartNoAxesCombined },
    { id: 'family', title: t.evaluationForm.goals.family, icon: Users },
    { id: 'living', title: currentLang === 'fa' ? 'زندگی و استقرار' : 'Living & Relocation', icon: House },
  ];

  
  if (process.env.NODE_ENV === 'production' && !hasVerifiedLegalEntity()) {
    return (
      <div className={`editorial-card p-6 sm:p-10 bg-white border border-[#dfe6ef] ${isModal ? 'shadow-none' : 'shadow-lg'} text-center`}>
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
          <p>📞 +40 727 348 009</p>
          <p>✉️ ontrip.ai@gmail.com</p>
        </div>
      </div>
    );
  }
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
            {currentLang === 'fa' ? `گام ${currentStep} از ۳` : `Step ${currentStep} of 3`}
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
            style={{ width: `${(currentStep / 3) * 100}%` }}
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
                  <label className="font-bold text-[#142033]">{t.evaluationForm.phone} <span className="text-slate-400 font-normal">({currentLang === 'fa' ? 'الزامی در صورت عدم ثبت ایمیل' : 'Required if no email'})</span></label>
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
                  <label className="font-bold text-[#142033]">{t.evaluationForm.email} <span className="text-slate-400 font-normal">({currentLang === 'fa' ? 'الزامی در صورت عدم ثبت تلفن' : 'Required if no phone'})</span></label>
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

          {/* STEP 4: Details & Consent */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? '۳. توضیحات و موافقت‌نامه حریم خصوصی' : '3. Additional Details & Privacy'}
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

                <input
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

            {currentStep < 3 ? (
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
                <span>{currentLang === 'fa' ? 'بررسی اولیه اطلاعات توسط تیم DORVIA EUROP.' : 'Initial review of information by the DORVIA EUROP team.'}</span>
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
            <span>{currentLang === 'fa' ? 'اطلاعات شما با رعایت سیاست حفظ حریم خصوصی سایت و منحصراً برای بررسی درخواست و ارتباطات مربوط به خدمات پردازش می‌شود.' : "Your information is processed in accordance with the site's privacy policy and solely for reviewing requests and service-related communication."}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

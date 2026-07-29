import React, { useState } from 'react';
import { Language, LeadFormData } from '../types';
import { getTranslations } from '../lib/i18n';
import { submitLeadForm } from '../lib/supabase';

interface LeadFormProps {
  currentLang: Language;
  onSuccess?: () => void;
  isModal?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ currentLang, onSuccess, isModal = false }) => {
  const t = getTranslations(currentLang);
  const tf = t.evaluationForm;

  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    currentCountry: currentLang === 'fa' ? 'ایران' : 'Iran',
    nationality: currentLang === 'fa' ? 'ایرانی' : 'Iranian',
    preferredLanguage: currentLang,
    mainGoal: 'study',
    educationLevel: currentLang === 'fa' ? 'کارشناسی (لیسانس)' : 'Bachelor Degree',
    workExperience: '3-5',
    approximateBudget: '5,000 - 15,000 EUR',
    maritalStatus: 'single',
    message: '',
    privacyConsent: true
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setStatus('error');
      setErrorMessage(currentLang === 'fa' ? 'لطفاً تمامی فیلدهای الزامی را تکمیل کنید.' : 'Please fill in all required fields.');
      return;
    }
    if (!formData.privacyConsent) {
      setStatus('error');
      setErrorMessage(currentLang === 'fa' ? 'پذیرش قوانین حریم خصوصی الزامی است.' : 'Privacy policy consent is required.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await submitLeadForm(formData);
      if (result.success) {
        setStatus('success');
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
        setErrorMessage(currentLang === 'fa' ? 'خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.' : 'Submission error. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(currentLang === 'fa' ? 'پاسخی دریافت نشد. شبکه را بررسی فرمایید.' : 'Network error. Please try again.');
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-200/80 relative overflow-hidden ${isModal ? '' : 'max-w-4xl mx-auto'}`}>
      
      {/* Decorative Brand Tricolor Header Strip */}
      <div className="absolute top-0 left-0 right-0 h-2 flex">
        <div className="bg-[#002B7F] w-1/3" />
        <div className="bg-[#FCD116] w-1/3" />
        <div className="bg-[#CE1126] w-1/3" />
      </div>

      <div className="mb-8 text-center sm:text-start pt-2">
        <span className="inline-block px-3 py-1 bg-blue-50 text-[#002B7F] rounded-full text-xs font-bold mb-3 border border-blue-100">
          {tf.title}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {tf.title}
        </h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
          {tf.subtitle}
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-xl font-bold text-emerald-900">{tf.successTitle}</h3>
          <p className="text-emerald-700 text-sm max-w-md mx-auto">{tf.successMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-6 py-2.5 bg-[#002B7F] text-white rounded-xl font-semibold text-sm hover:bg-[#002266] transition-colors"
          >
            {currentLang === 'fa' ? 'ثبت درخواست جدید' : 'Submit Another Request'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.fullName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder={currentLang === 'fa' ? 'مثال: علی رضایی' : 'e.g. Ali Rezaei'}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+98 912 000 0000"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.preferredLanguage}
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              >
                <option value="fa">فارسی (Persian)</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Residence Country */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.currentCountry}
              </label>
              <input
                type="text"
                name="currentCountry"
                value={formData.currentCountry}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.nationality}
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Main Goal */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.mainGoal}
              </label>
              <select
                name="mainGoal"
                value={formData.mainGoal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              >
                <option value="study">{tf.goals.study}</option>
                <option value="work">{tf.goals.work}</option>
                <option value="company">{tf.goals.company}</option>
                <option value="investment">{tf.goals.investment}</option>
                <option value="family">{tf.goals.family}</option>
                <option value="other">{tf.goals.other}</option>
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.educationLevel}
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              >
                <option value="High School">{currentLang === 'fa' ? 'دیپلم / پیش‌دانشگاهی' : 'High School Diploma'}</option>
                <option value="Associate">{currentLang === 'fa' ? 'فوق دیپلم' : 'Associate Degree'}</option>
                <option value="Bachelor">{currentLang === 'fa' ? 'کارشناسی (لیسانس)' : 'Bachelor Degree'}</option>
                <option value="Master">{currentLang === 'fa' ? 'کارشناسی ارشد (فوق لیسانس)' : 'Master Degree'}</option>
                <option value="PhD/Doctorate">{currentLang === 'fa' ? 'دکتری / پزشکی' : 'PhD / MD Degree'}</option>
              </select>
            </div>

            {/* Work Experience */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.workExperience}
              </label>
              <select
                name="workExperience"
                value={formData.workExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              >
                <option value="0-1">{currentLang === 'fa' ? 'بدون سابقه یا کمتر از ۱ سال' : '0-1 Year'}</option>
                <option value="1-3">{currentLang === 'fa' ? '۱ تا ۳ سال' : '1-3 Years'}</option>
                <option value="3-5">{currentLang === 'fa' ? '۳ تا ۵ سال' : '3-5 Years'}</option>
                <option value="5+">{currentLang === 'fa' ? 'بیش از ۵ سال' : '5+ Years'}</option>
              </select>
            </div>

            {/* Approximate Budget */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.approximateBudget}
              </label>
              <select
                name="approximateBudget"
                value={formData.approximateBudget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
              >
                <option value="Under 5,000 EUR">{currentLang === 'fa' ? 'کمتر از ۵,۰۰۰ یورو' : 'Under €5,000'}</option>
                <option value="5,000 - 15,000 EUR">۵,۰۰۰ - ۱۵,۰۰۰ EUR</option>
                <option value="15,000 - 30,000 EUR">۱۵,۰۰۰ - ۳۰,۰۰۰ EUR</option>
                <option value="30,000+ EUR">{currentLang === 'fa' ? 'بیشتر از ۳۰,۰۰۰ یورو' : 'Above €30,000'}</option>
              </select>
            </div>

            {/* Marital Status */}
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                {tf.maritalStatus}
              </label>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="single"
                    checked={formData.maritalStatus === 'single'}
                    onChange={handleChange}
                    className="text-[#002B7F] focus:ring-[#002B7F]"
                  />
                  <span className="text-sm font-medium text-slate-700">{tf.single}</span>
                </label>
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="married"
                    checked={formData.maritalStatus === 'married'}
                    onChange={handleChange}
                    className="text-[#002B7F] focus:ring-[#002B7F]"
                  />
                  <span className="text-sm font-medium text-slate-700">{tf.married}</span>
                </label>
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="married_with_children"
                    checked={formData.maritalStatus === 'married_with_children'}
                    onChange={handleChange}
                    className="text-[#002B7F] focus:ring-[#002B7F]"
                  />
                  <span className="text-sm font-medium text-slate-700">{tf.marriedWithChildren}</span>
                </label>
              </div>
            </div>

          </div>

          {/* Short Message */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              {tf.message}
            </label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder={currentLang === 'fa' ? 'سوالات یا جزئیات رزومه تحصیلی و شغلی خود را اینجا بنویسید...' : 'Write your questions or academic background highlights here...'}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#002B7F] focus:outline-none text-sm transition-all"
            />
          </div>

          {/* Privacy Consent */}
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="privacyConsent"
              name="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleChange}
              className="mt-1 rounded text-[#002B7F] focus:ring-[#002B7F] w-4 h-4"
            />
            <label htmlFor="privacyConsent" className="text-xs text-slate-600 leading-normal cursor-pointer select-none">
              {tf.privacyConsent}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-[#002B7F] hover:bg-[#002266] text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {status === 'submitting' ? (
              <span>{tf.submitting}</span>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FCD116]"></span>
                <span>{tf.submit}</span>
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
};

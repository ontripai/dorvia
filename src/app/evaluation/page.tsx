'use client';

import { useAppContext } from '../../components/AppLayout';
import { LeadForm } from '../../components/LeadForm';

export default function EvaluationPage() {
  const { currentLang } = useAppContext();

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-12">
      <div className={`text-center space-y-4 ${currentLang === 'fa' ? 'rtl' : 'ltr'}`}>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'ارزیابی رایگان شرایط' : 'Free Profile Evaluation'}
        </h1>
        <p className="text-[#526174] max-w-2xl mx-auto">
          {currentLang === 'fa'
            ? 'با پر کردن فرم زیر، کارشناسان ما شرایط شما را بررسی کرده و بهترین مسیر مهاجرت به رومانی را به شما پیشنهاد خواهند داد.'
            : 'By filling out the form below, our experts will evaluate your profile and suggest the best immigration path to Romania for you.'}
        </p>
      </div>
      
      <LeadForm currentLang={currentLang} />
    </div>
  );
}
